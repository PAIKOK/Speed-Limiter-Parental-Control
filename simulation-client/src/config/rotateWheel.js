import * as THREE from "three";
export function rotateWheelCorrectly(wheel, amount) {
  const bbox = new THREE.Box3().setFromObject(wheel);
  const size = bbox.getSize(new THREE.Vector3());

  // wheel is circular in 2 dimensions → smallest axis is spin axis
  let axis = "x";
  if (size.x < size.y && size.x < size.z) axis = "x";
  else if (size.y < size.x && size.y < size.z) axis = "y";
  else axis = "z";

  if (axis === "x") wheel.rotation.x -= amount;
  if (axis === "y") wheel.rotation.y -= amount;
  if (axis === "z") wheel.rotation.z -= amount;
}
