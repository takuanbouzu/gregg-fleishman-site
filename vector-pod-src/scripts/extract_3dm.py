"""Extract a lightweight, clickable edge model from the source Rhino 3DM.

The source file is read-only. Brep edges are sampled from the actual model,
nested blocks are expanded, and coordinates are quantized for web delivery.
"""

from __future__ import annotations

import base64
import argparse
import json
import math
import struct
from pathlib import Path

import rhino3dm as rhino


SCRIPT = Path(__file__).resolve()
SOURCE_PROJECT = SCRIPT.parents[1]
PACKAGE_ROOT = SCRIPT.parents[2]
LEGACY_ROOT = SCRIPT.parents[3]
PART_QUANT = 0.005
REFERENCE_QUANT = 0.01


def resolve_paths():
    parser = argparse.ArgumentParser(description="Extract web-ready edge geometry from the Vertor Pod Rhino model.")
    parser.add_argument("--source", type=Path, help="Path to the source .3dm file.")
    parser.add_argument(
        "--output",
        type=Path,
        default=SOURCE_PROJECT / "src/modelData.ts",
        help="Generated TypeScript output path (default: src/modelData.ts).",
    )
    args = parser.parse_args()
    candidates = [
        args.source,
        LEGACY_ROOT / "03_MASTER_CONTEXT/3dm/vertor pod whole unit.3dm",
        PACKAGE_ROOT / "source_model/vertor pod whole unit.3dm",
        SOURCE_PROJECT / "source_model/vertor pod whole unit.3dm",
    ]
    source = next((path.expanduser().resolve() for path in candidates if path and path.expanduser().is_file()), None)
    if source is None:
        parser.error(
            "Source 3DM not found. Pass it explicitly with "
            "--source '/path/to/vertor pod whole unit.3dm'."
        )
    return source, args.output.expanduser().resolve()


SOURCE, OUTPUT = resolve_paths()


def point_xyz(point):
    return (point.X, point.Y, point.Z)


def map_point(point, origin):
    """Map Rhino Z-up coordinates to Three.js Y-up coordinates."""
    x, y, z = point
    ox, oy, oz = origin
    return (x - ox, z - oz, -(y - oy))


def quantized_base64(values, quantum):
    integers = [max(-32768, min(32767, round(value / quantum))) for value in values]
    payload = struct.pack(f"<{len(integers)}h", *integers)
    return base64.b64encode(payload).decode("ascii")


model = rhino.File3dm.Read(str(SOURCE))
if model is None:
    raise RuntimeError(f"Could not read {SOURCE}")

layers = {layer.Index: layer for layer in model.Layers}
groups = {group.Index: group.Name for group in model.Groups}
objects = {str(obj.Attributes.Id): obj for obj in model.Objects}
definitions = {str(definition.Id): definition for definition in model.InstanceDefinitions}

axis_points = [
    point_xyz(obj.Geometry.Location)
    for obj in model.Objects
    if isinstance(obj.Geometry, rhino.Point) and obj.Attributes.LayerIndex == 2
]
origin = axis_points[-1] if axis_points else (141.631859, 129.239273, 242.636647)


def object_groups(obj):
    return [groups[index] for index in (obj.Attributes.GetGroupList2() or []) if index in groups]


def expanded(obj, transforms=(), inherited_groups=(), instance_path=()):
    geometry = obj.Geometry
    own_groups = tuple(object_groups(obj))
    effective_groups = own_groups or tuple(inherited_groups)
    if isinstance(geometry, rhino.InstanceReference):
        definition = definitions[str(geometry.ParentIdefId)]
        path_entry = f"{definition.Name}:{str(obj.Attributes.Id)[:8]}"
        next_transforms = (geometry.Xform,) + tuple(transforms)
        for object_id in definition.GetObjectIds2():
            child = objects[str(object_id)]
            yield from expanded(
                child,
                next_transforms,
                effective_groups,
                tuple(instance_path) + (path_entry,),
            )
        return

    duplicate = geometry.Duplicate()
    for transform in transforms:
        duplicate.Transform(transform)
    yield duplicate, obj, effective_groups, tuple(instance_path)


def sampled_edge_segments(brep):
    values = []
    for edge in brep.Edges:
        domain = edge.Domain
        try:
            sample_count = 2 if edge.IsLinear(0.0005) else 5
        except Exception:
            sample_count = 5
        points = [
            point_xyz(edge.PointAt(domain.T0 + (domain.T1 - domain.T0) * i / (sample_count - 1)))
            for i in range(sample_count)
        ]
        for start, end in zip(points, points[1:]):
            values.extend((start, end))
    return values


parts = []
part_number = 0
for top_index, top_object in enumerate(model.Objects):
    if top_object.Attributes.IsInstanceDefinitionObject:
        continue
    for geometry, source_object, inherited_groups, instance_path in expanded(top_object):
        if not isinstance(geometry, rhino.Brep):
            continue
        layer_index = source_object.Attributes.LayerIndex
        bounding_box = geometry.GetBoundingBox()
        center_rhino = point_xyz(bounding_box.Center)
        center = map_point(center_rhino, origin)
        samples = sampled_edge_segments(geometry)
        local_positions = []
        for sample in samples:
            mapped = map_point(sample, origin)
            local_positions.extend(mapped[axis] - center[axis] for axis in range(3))

        diagonal = bounding_box.Diagonal
        category = "extension" if layer_index == 4 else "panels" if layer_index == 1 else "assembly"
        parts.append(
            {
                "id": f"part-{part_number:03d}",
                "sourceId": str(source_object.Attributes.Id),
                "sourceIndex": top_index,
                "category": category,
                "layerIndex": layer_index,
                "layerName": layers[layer_index].Name,
                "groups": list(inherited_groups),
                "instancePath": list(instance_path),
                "faceCount": len(geometry.Faces),
                "edgeCount": len(geometry.Edges),
                "center": [round(value, 4) for value in center],
                "dimensions": [round(diagonal.X, 4), round(diagonal.Y, 4), round(diagonal.Z, 4)],
                "quantum": PART_QUANT,
                "vertexCount": len(local_positions) // 3,
                "positions": quantized_base64(local_positions, PART_QUANT),
            }
        )
        part_number += 1


references = {}
for layer_index in (2, 3):
    values = []
    for obj in model.Objects:
        if obj.Attributes.LayerIndex != layer_index or not isinstance(obj.Geometry, rhino.LineCurve):
            continue
        values.extend(map_point(point_xyz(obj.Geometry.PointAtStart), origin))
        values.extend(map_point(point_xyz(obj.Geometry.PointAtEnd), origin))
    references[str(layer_index)] = {
        "layerName": layers[layer_index].Name,
        "quantum": REFERENCE_QUANT,
        "vertexCount": len(values) // 3,
        "positions": quantized_base64(values, REFERENCE_QUANT),
    }

points = []
for obj in model.Objects:
    if not isinstance(obj.Geometry, rhino.Point):
        continue
    points.append(
        {
            "layerIndex": obj.Attributes.LayerIndex,
            "position": [round(value, 4) for value in map_point(point_xyz(obj.Geometry.Location), origin)],
        }
    )

visible_parts = [part for part in parts if part["category"] != "extension"]
radius = max(
    math.sqrt(sum((part["center"][axis] + part["dimensions"][axis] / 2) ** 2 for axis in range(3)))
    for part in visible_parts
)

payload = {
    "meta": {
        "source": SOURCE.name,
        "archiveVersion": model.ArchiveVersion,
        "originRhino": [round(value, 6) for value in origin],
        "storedObjectCount": len(model.Objects),
        "solidInstanceCount": len(parts),
        "visibleSolidInstanceCount": len(visible_parts),
        "radius": round(radius, 4),
        "units": str(model.Settings.ModelUnitSystem).split(".")[-1],
    },
    "parts": parts,
    "references": references,
    "points": points,
}

OUTPUT.write_text(
    "// Generated from the source 3DM by scripts/extract_3dm.py. Do not hand-edit.\n"
    "export const MODEL_DATA = "
    + json.dumps(payload, separators=(",", ":"))
    + ";\n",
    encoding="utf-8",
)
print(
    json.dumps(
        {
            "output": str(OUTPUT),
            "bytes": OUTPUT.stat().st_size,
            "parts": len(parts),
            "visibleParts": len(visible_parts),
            "referenceLayers": len(references),
        },
        indent=2,
    )
)
