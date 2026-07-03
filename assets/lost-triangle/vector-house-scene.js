// Vector House — the built epilogue to The Fleishman Sequence.
// Loads the real scanned/modeled structure (assets/models/vector-house.glb,
// optimized from a 174MB Rhino/Grasshopper export down to ~9MB: fragmented
// per-member Draco primitives deduped, joined into one mesh, recompressed
// with meshopt) and lets the visitor orbit it. Vanilla Three.js r160 ESM,
// no build step — matches the renderer-setup convention in CLAUDE.md.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';

export function mountVectorHouseScene(container) {
  const SC = (window.GF_SCENE && window.GF_SCENE.dark) || { bg: ['#0B0B0B', '#0B0B0B'] };
  const BGc = new THREE.Color(SC.bg[1] || '#0B0B0B');

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setClearColor(BGc, 1);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NoToneMapping;
  renderer.domElement.style.cssText = 'position:absolute;inset:0;display:block;';
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 500);

  const hemi = new THREE.HemisphereLight(0xfff3df, 0x14120e, 1.15);
  scene.add(hemi);
  const key = new THREE.DirectionalLight(0xfff0d8, 2.4);
  key.position.set(6, 10, 7);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x6f9bc4, 0.55);
  rim.position.set(-8, 4, -6);
  scene.add(rim);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.55;
  controls.minDistance = 1;
  controls.maxDistance = 200;
  controls.addEventListener('start', () => { controls.autoRotate = false; });

  function fit() {
    const w = container.clientWidth || 1, h = container.clientHeight || 1;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  fit();
  window.addEventListener('resize', fit);

  // --- loading UI ---------------------------------------------------------
  const loadingEl = document.createElement('div');
  loadingEl.style.cssText = 'position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);' +
    'font-family:"Space Grotesk",sans-serif;font-size:12px;letter-spacing:.18em;text-transform:uppercase;' +
    'color:rgba(240,237,232,.55);pointer-events:none;';
  loadingEl.textContent = 'loading the structure…';
  container.appendChild(loadingEl);

  const loader = new GLTFLoader();
  loader.setMeshoptDecoder(MeshoptDecoder);

  let model = null;
  loader.load(
    'assets/models/vector-house.glb',
    (gltf) => {
      loadingEl.remove();
      model = gltf.scene;
      model.traverse((o) => {
        if (o.isMesh) {
          o.material = new THREE.MeshStandardMaterial({
            color: 0xc8a96e,
            metalness: 0.08,
            roughness: 0.62,
            side: THREE.DoubleSide,
          });
        }
      });

      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      model.position.sub(center);
      scene.add(model);

      const maxDim = Math.max(size.x, size.y, size.z);
      const dist = maxDim * 1.15;
      camera.position.set(dist * 0.62, dist * 0.42, dist * 0.62);
      camera.near = maxDim / 500;
      camera.far = maxDim * 12;
      camera.updateProjectionMatrix();
      controls.target.set(0, 0, 0);
      controls.update();
    },
    (xhr) => {
      if (xhr.total) loadingEl.textContent = 'loading the structure… ' + Math.round((xhr.loaded / xhr.total) * 100) + '%';
    },
    (err) => {
      loadingEl.textContent = 'the structure could not be loaded.';
      console.error('[vector-house-scene] load failed:', err);
    }
  );

  let raf = null;
  function animate() {
    controls.update();
    renderer.render(scene, camera);
    raf = requestAnimationFrame(animate);
  }
  animate();

  return function dispose() {
    cancelAnimationFrame(raf);
    window.removeEventListener('resize', fit);
    controls.dispose();
    renderer.dispose();
  };
}
