import * as THREE from "three";

let groundMaterial = null;

export function createScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xa0a0a0);

  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    3000
  );
  camera.position.set(0, 4, 10);
  camera.lookAt(0, 1, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Lights
  scene.add(new THREE.AmbientLight(0xffffff, 0.7));

  const sun = new THREE.DirectionalLight(0xffffff, 1);
  sun.position.set(30, 40, 20);
  scene.add(sun);

  // Road texture
  const texture = new THREE.TextureLoader().load("/road.jpg");
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 50);

  groundMaterial = new THREE.MeshStandardMaterial({
    map: texture,
    roughness: 1,
    metalness: 0,
  });

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(40, 2000),
    groundMaterial
  );

  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);

  return { scene, camera, renderer };
}

// --------------------
// SMOOTH FOLLOW CAMERA
// --------------------
export function followCamera(vehicle, camera, dt) {
  // camera offset behind car
  const offset = new THREE.Vector3(0, 3, -7);

  // transform offset into world space
  const worldOffset = offset.clone().applyQuaternion(vehicle.quaternion);

  const targetPos = vehicle.position.clone().add(worldOffset);

  // Smooth camera motion
  camera.position.lerp(targetPos, 4 * dt);

  // Look slightly ahead of the car
  const lookAt = vehicle.position
    .clone()
    .add(new THREE.Vector3(0, 1.5, 5).applyQuaternion(vehicle.quaternion));

  camera.lookAt(lookAt);
}

// --------------------
// ROAD SCROLLING
// --------------------
export function scrollRoad(speedKmh) {
  if (!groundMaterial || !groundMaterial.map) return;

  const factor = speedKmh / 120;
  groundMaterial.map.offset.y -= factor * 0.02;
}
