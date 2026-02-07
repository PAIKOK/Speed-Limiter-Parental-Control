import * as THREE from "three";

export function createMovementSystem(options) {
  const uiMaxSpeed = (options.maxSpeedKmh ?? 80) / 3.6;
  let serverLimit = null;

  // ✅ lock state (parent control)
  let locked = false;

  let speed = 0;
  let steer = 0;
  let rot = 0;

  // Physics tuned like "Dr Driving"
  const ACCEL = 9; // forward push
  const BRAKE = 12; // strong brake
  const FRICTION = 2.0; // rolling resistance
  const TURN = 1.2;

  // realistic air drag
  const DRAG_COEFF = 0.015;

  const forward = new THREE.Vector3(0, 0, 1);
  const Y = new THREE.Vector3(0, 1, 0);
  const keys = {};

  window.addEventListener("keydown", (e) => (keys[e.key.toLowerCase()] = true));
  window.addEventListener("keyup", (e) => (keys[e.key.toLowerCase()] = false));

  function update(vehicle, dt) {
    // ✅ if locked -> freeze vehicle completely
    if (locked) {
      speed = 0;
      steer = 0;

      return {
        speed,
        speedKmh: 0,
        wheelRotation: 0,
        leanAngle: 0,
        position: vehicle.position,
        isLocked: true,
      };
    }

    const up = keys["w"] || keys["arrowup"];
    const down = keys["s"] || keys["arrowdown"];
    const left = keys["a"] || keys["arrowleft"];
    const right = keys["d"] || keys["arrowright"];

    // -------------------------
    // ACCELERATION
    // -------------------------
    if (up) speed += ACCEL * dt;
    else if (down) speed -= BRAKE * dt;
    else {
      speed -= Math.sign(speed) * FRICTION * dt;
    }

    if (Math.abs(speed) < 0.05) speed = 0;

    // never reverse
    if (speed < 0) speed = 0;

    // -------------------------
    // AIR DRAG
    // -------------------------
    const drag = DRAG_COEFF * speed * speed;
    speed -= drag * dt;

    if (speed < 0) speed = 0;

    // -------------------------
    // STEERING
    // -------------------------
    steer = 0;
    if (left) steer = 1;
    if (right) steer = -1;

    if (speed > 0.3 && steer !== 0) {
      rot += steer * TURN * dt;
      vehicle.rotation.y = rot;
    }

    // -------------------------
    // MOVEMENT
    // -------------------------
    forward.set(0, 0, 1).applyAxisAngle(Y, rot);
    vehicle.position.addScaledVector(forward, speed * dt);

    return {
      speed,
      speedKmh: speed * 3.6,
      wheelRotation: speed * dt * 4,
      leanAngle: steer * 0.3 * Math.min(speed / uiMaxSpeed, 1),
      position: vehicle.position,
      isLocked: false,
    };
  }

  function setServerLimit(kmh) {
    serverLimit = kmh / 3.6;
    console.log("SERVER LIMIT:", kmh);
  }

  // ✅ NEW: parent control lock
  function setLocked(value) {
    locked = !!value;
    if (locked) speed = 0;

    console.log("🔒 MOVEMENT LOCK STATE:", locked);
  }

  return { update, setServerLimit, setLocked };
}
