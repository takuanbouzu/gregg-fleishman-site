# Extract Gregg's actual 45° node part from assets/models/rhombi-pod.glb
# into 06_BLENDER/node_part_45.obj (world/pod coordinates, proportions untouched).
#
# The GLB is meshopt-compressed; decode it first (from the repo root):
#   npx --yes @gltf-transform/cli copy assets/models/rhombi-pod.glb /tmp/rhombi-pod-plain.glb
#   npx --yes @gltf-transform/cli dequantize /tmp/rhombi-pod-plain.glb /tmp/rhombi-pod-f32.glb
# then:
#   python3 GREGG_MOTION_GRAPHICS/06_BLENDER/extract_node_part.py /tmp/rhombi-pod-f32.glb
#
# Requires `pip install bpy` (Blender as a Python module).
#
# Mesh_48 is one of the 41 identical "NODE PARTS/45" solids in Gregg's
# `Single Rhomi Pod STEP` Rhino model. The OBJ is written with axis_forward='Y',
# axis_up='Z' so its coordinates round-trip identically (no axis conversion).

import sys
import bpy

SRC = sys.argv[1] if len(sys.argv) > 1 else '/tmp/rhombi-pod-f32.glb'
OUT = __file__.rsplit('/', 1)[0] + '/node_part_45.obj'
PART = 'Mesh_48'

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=SRC)

obj = bpy.data.objects[PART]
# bake the (importer) world transform into the mesh so the OBJ is in pod coords
obj.data.transform(obj.matrix_world)
obj.matrix_world.identity()

for o in list(bpy.context.scene.objects):
    if o is not obj:
        bpy.data.objects.remove(o, do_unlink=True)
obj.select_set(True)
bpy.context.view_layer.objects.active = obj

bpy.ops.wm.obj_export(filepath=OUT, export_selected_objects=True,
                      export_materials=False, export_uv=False, export_normals=False,
                      forward_axis='Y', up_axis='Z')
print('wrote', OUT)
