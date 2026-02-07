import * as THREE from "three";
import { createScene, followCamera, scrollRoad } from "./three/scene";
import { loadCar } from "./three/car";
import { loadBike } from "./three/bike";
import { createMovementSystem } from "./three/movement";
import { createGPS } from "./three/gps";
import { io } from "socket.io-client";

// read ?token=... from URL
const params = new URLSearchParams(window.location.search);
const token = params.get("token");
console.log("Simulation extracted token:", token);

const socket = io("http://localhost:5000", {
  auth: { token },
});

socket.on("connect_error", (err) => {
  console.error("Socket connection error:", err.message);
});

const ui = document.getElementById("ui");
const startBtn = document.getElementById("startBtn");
const vehicleSelect = document.getElementById("vehicleType");
const speedInput = document.getElementById("maxSpeed");

const engineSound = new Audio("/engine.mp3");
engineSound.loop = true;
engineSound.volume = 0;

startBtn.addEventListener("click", () => {
  initSimulation().catch(console.error);
});

async function initSimulation() {
  const vehicleType = vehicleSelect.value;
  const maxSpeed = parseInt(speedInput.value, 10) || 80;

  ui.style.display = "none";

  const { scene, camera, renderer } = createScene();

  // Load the model
  const data = vehicleType === "car" ? await loadCar() : await loadBike();
  const vehicle = data.car;
  const wheels = data.wheels ?? [];

  scene.add(vehicle);

  const movement = createMovementSystem({
    maxSpeedKmh: maxSpeed,
    vehicleType,
  });

  const gps = createGPS(12.9716, 77.5946);
  const clock = new THREE.Clock();

  // ✅ lock state
  let isLocked = false;

  // listen for server-enforced limiter (if you still use it)
  socket.on("speedLimitEnforced", ({ maxSpeedKmh }) => {
    if (movement.setServerLimit) {
      movement.setServerLimit(maxSpeedKmh);
    }
  });

  // ✅ NEW: listen for lock/unlock commands from backend
  socket.on("vehicleLockCommand", (msg) => {
    console.log("🚨 vehicleLockCommand received:", msg);

    if (!msg?.action) return;

    if (msg.action === "LOCK") {
      isLocked = true;
      if (movement.setLocked) movement.setLocked(true);
      console.log("🔒 Vehicle LOCKED by parent/dashboard");
    }

    if (msg.action === "UNLOCK") {
      isLocked = false;
      if (movement.setLocked) movement.setLocked(false);
      console.log("🔓 Vehicle UNLOCKED by parent/dashboard");
    }
  });

  engineSound.play().catch(() => {});

  let frame = 0;

  function loop() {
    const dt = clock.getDelta();
    frame++;

    const telemetry = movement.update(vehicle, dt);

    // ----------------------------
    // WHEEL ROTATION
    // ----------------------------
    // ✅ stop wheels if locked
    if (!isLocked) {
      if (vehicleType === "car") {
        wheels.forEach((wheel) => {
          wheel.rotation.z -= telemetry.wheelRotation;
        });
      }

      if (vehicleType === "bike") {
        wheels.forEach((wheel) => {
          wheel.rotation.z -= telemetry.wheelRotation;
        });

        vehicle.rotation.z = telemetry.leanAngle;
      }
    }

    // ----------------------------
    // ROAD
    // ----------------------------
    scrollRoad(telemetry.speedKmh);

    // ----------------------------
    // CAMERA
    // ----------------------------
    if (frame > 5) {
      followCamera(vehicle, camera, dt);
    }

    // ----------------------------
    // ENGINE SOUND
    // ----------------------------
    const norm = Math.min(telemetry.speedKmh / maxSpeed, 1);
    engineSound.playbackRate = 0.8 + norm * 0.8;

    // ✅ reduce sound if locked
    engineSound.volume = isLocked ? 0.0 : 0.1 + norm * 0.3;

    // ----------------------------
    // GPS + SERVER
    // ----------------------------
    const gpsData = gps.toGPS(telemetry.position.x, telemetry.position.z);

    socket.emit("vehicleUpdate", {
      vehicleId: `${vehicleType}-01`,
      vehicleType,
      speed: telemetry.speedKmh,
      maxSpeed,
      gps: gpsData,
      position: telemetry.position,
      timestamp: Date.now(),

      // ✅ NEW field
      isLocked,
    });

    renderer.render(scene, camera);
    requestAnimationFrame(loop);
  }

  loop();
}
