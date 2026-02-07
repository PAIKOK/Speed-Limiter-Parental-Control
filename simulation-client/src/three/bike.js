import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";

export async function loadBike() {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();

    loader.load(
      "/bike.glb",
      (gltf) => {
        const model = gltf.scene;

        // ----------------------------------
        // FIX INTERNAL BIKE ORIENTATION
        // ----------------------------------
        const bike = new THREE.Object3D();
        bike.add(model);

        // Sketchfab bikes face -Z → rotate to +Z
        bike.rotation.z = Math.PI;

        // Scale
        bike.scale.set(0.8, 0.8, 0.8);
        bike.position.set(0, 0, 0);

        // ----------------------------------
        // WHEEL DETECTION
        // ----------------------------------
        const wheels = [];
        model.traverse((child) => {
          const n = child.name.toLowerCase();
          if (n.includes("front_tire") || n.includes("rear_tire"))
            wheels.push(child);
        });

        // ----------------------------------
        // FIX WHEEL PIVOTS
        // ----------------------------------
        const fixedWheels = wheels.map((wheel) => {
          const pivot = new THREE.Object3D();
          wheel.parent.add(pivot);
          pivot.position.copy(wheel.position);
          pivot.add(wheel);
          wheel.position.set(0, 0, 0);
          return pivot;
        });

        resolve({ car: bike, wheels: fixedWheels });
      },
      undefined,
      reject
    );
  });
}
