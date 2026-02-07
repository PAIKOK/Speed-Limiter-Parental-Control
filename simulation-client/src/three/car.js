import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";

export async function loadCar() {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();

    loader.load(
      "/car.glb",
      (gltf) => {
        const car = gltf.scene;
        // Find the real car model
        let realCar =
          car.getObjectByName("RootNode") ||
          car.getObjectByName("Object_2") ||
          car.getObjectByName("7f09d404031140d78a7bb6db74b81fa4fbx") ||
          car.getObjectByName("Sketchfab_model");

        // rotate REAL mesh so front = +Z
        if (realCar) {
          realCar.rotation.y = -Math.PI / 2;
        } else {
          car.rotation.y = -Math.PI / 2; // fallback
        }

        // scale
        car.scale.set(0.01, 0.01, 0.01);
        car.position.set(0, 0, 0);

        // ------------------------------------------------
        // WHEEL ROOT GROUPS
        // ------------------------------------------------
        const wheelNames = [
          "Front_wheel",
          "Rear_wheel",
          "Front_wheel001",
          "Rear_wheel001",
        ];

        const wheels = [];

        car.traverse((node) => {
          if (wheelNames.includes(node.name)) {
            wheels.push(node);
          }
        });

        // ------------------------------------------------
        // FIX WHEEL PIVOTS (IMPORTANT)
        // ------------------------------------------------
        const fixed = wheels.map((wheel) => {
          const pivot = new THREE.Object3D();
          wheel.parent.add(pivot);
          pivot.position.copy(wheel.position);
          pivot.add(wheel);
          wheel.position.set(0, 0, 0);
          return pivot;
        });

        resolve({ car, wheels: fixed });
      },
      undefined,
      reject
    );
  });
}
