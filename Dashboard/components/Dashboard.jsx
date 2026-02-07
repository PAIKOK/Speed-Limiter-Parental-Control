// frontend/pages/dashboard.jsx
"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { io } from "socket.io-client";
import LiveMap from "./LiveMap";

export default function Dashboard() {
  const router = useRouter();

  const [telemetry, setTelemetry] = useState(null);
  const [alert, setAlert] = useState(null);
  const [warnings, setWarnings] = useState([]);
  const [history, setHistory] = useState([]);

  const clearTimer = useRef(null);

  // ✅ keep socket reference for buttons
  const socketRef = useRef(null);

  // ✅ prevent spam clicking
  const [lockLoading, setLockLoading] = useState(false);

  // redirect if not logged in
  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("sessionToken")
        : null;

    if (!token) {
      router.push("/login");
    }
  }, [router]);

  // socket.io telemetry
  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("sessionToken")
        : null;

    if (!token) return;

    const socket = io("http://localhost:5000", {
      auth: { token },
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("📡 Dashboard socket connected:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket error:", err.message);
    });

    // ✅ telemetry updates
    socket.on("vehicleUpdate", (msg) => {
      setTelemetry(msg);

      // overspeed notification behavior
      if (msg.isOverSpeed) {
        setAlert({
          message: `⚠ ${msg.vehicleId} overspeed! (${msg.speed.toFixed(1)}/${
            msg.maxSpeed
          } km/h)`,
        });

        if (clearTimer.current) {
          clearTimeout(clearTimer.current);
          clearTimer.current = null;
        }
      } else {
        if (!clearTimer.current) {
          clearTimer.current = setTimeout(() => {
            setAlert(null);
            clearTimer.current = null;
          }, 3000);
        }
      }
    });

    // ✅ NEW: lock/unlock status update from server
    socket.on("vehicleLockStatus", (msg) => {
      console.log("🔒 vehicleLockStatus:", msg);

      setTelemetry((prev) => {
        if (!prev) return prev;
        if (prev.vehicleId !== msg.vehicleId) return prev;
        return { ...prev, isLocked: msg.isLocked };
      });

      setLockLoading(false);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  async function loadWarnings() {
    const token = localStorage.getItem("sessionToken");
    if (!token) return;

    const res = await fetch("http://localhost:5000/api/warnings", {
      headers: { "x-session-token": token },
    });

    const data = await res.json();
    setWarnings(Array.isArray(data) ? data : []);
  }

  async function loadHistory() {
    const token = localStorage.getItem("sessionToken");
    if (!token) return;

    const res = await fetch("http://localhost:5000/api/history", {
      headers: { "x-session-token": token },
    });

    const data = await res.json();
    setHistory(Array.isArray(data) ? data : []);
  }

  function startSimulation() {
    const token = localStorage.getItem("sessionToken");
    if (!token) {
      alert("Please log in first.");
      return;
    }
    window.open(`http://localhost:5173/?token=${token}`, "_blank");
  }

  // ✅ LOCK command
  function lockVehicle() {
    if (!socketRef.current || !telemetry?.vehicleId) return;

    setLockLoading(true);

    socketRef.current.emit("lockVehicle", {
      vehicleId: telemetry.vehicleId,
    });

    console.log("🔒 Lock request sent");
  }

  // ✅ UNLOCK command
  function unlockVehicle() {
    if (!socketRef.current || !telemetry?.vehicleId) return;

    setLockLoading(true);

    socketRef.current.emit("unlockVehicle", {
      vehicleId: telemetry.vehicleId,
    });

    console.log("🔓 Unlock request sent");
  }

  const vehicleIcon =
    telemetry?.vehicleType === "bike"
      ? "🏍️"
      : telemetry?.vehicleType === "car"
        ? "🚗"
        : "🚙";

  const lat = telemetry?.gps?.lat ?? 12.9716;
  const lng = telemetry?.gps?.lng ?? 77.5946;

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 p-6 space-y-4">
      <header className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold">Vehicle Dashboard</h1>
          <p className="text-xs text-slate-400">
            Live speed & GPS with overspeed warnings + remote lock
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={startSimulation}
            className="text-xs px-3 py-2 rounded bg-emerald-500 hover:bg-emerald-600"
          >
            Start Simulation
          </button>

          <button
            onClick={() => {
              localStorage.clear();
              router.push("/login");
            }}
            className="text-xs px-3 py-2 rounded bg-slate-700 hover:bg-slate-600"
          >
            Log out
          </button>
        </div>
      </header>

      {alert && (
        <div className="bg-red-900/60 border border-red-500 text-red-100 px-3 py-2 rounded text-sm">
          {alert.message}
        </div>
      )}

      {!telemetry && (
        <div className="text-slate-400 text-sm">
          Waiting for telemetry from simulation...
        </div>
      )}

      {telemetry && (
        <div className="grid gap-4 md:grid-cols-2">
          {/* Telemetry card */}
          <div className="bg-slate-800 p-4 rounded-xl shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{vehicleIcon}</span>
                <div>
                  <div className="text-xs uppercase text-slate-400">
                    Vehicle
                  </div>
                  <div className="text-lg font-semibold">
                    {telemetry.vehicleId}
                  </div>
                  <div className="text-xs text-slate-400">
                    Type: {telemetry.vehicleType}
                  </div>
                </div>
              </div>

              {/* ✅ lock badge */}
              <span
                className={
                  "text-xs px-3 py-1 rounded-full font-semibold " +
                  (telemetry.isLocked
                    ? "bg-red-600 text-white"
                    : "bg-emerald-600 text-white")
                }
              >
                {telemetry.isLocked ? "LOCKED" : "MOVING"}
              </span>
            </div>

            <div className="mt-2 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Speed</span>
                <span
                  className={
                    telemetry.isOverSpeed
                      ? "text-red-400 font-semibold"
                      : "text-emerald-300 font-semibold"
                  }
                >
                  {telemetry.speed.toFixed(1)} km/h
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">Limit</span>
                <span>{telemetry.maxSpeed ?? "—"} km/h</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">Lat</span>
                <span>{lat.toFixed(5)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">Lng</span>
                <span>{lng.toFixed(5)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">Last update</span>
                <span className="text-xs">
                  {new Date(telemetry.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>

            {/* ✅ LOCK / UNLOCK buttons */}
            <div className="mt-4 flex gap-3">
              {telemetry.isOverSpeed && !telemetry.isLocked && (
                <button
                  onClick={lockVehicle}
                  disabled={lockLoading}
                  className={
                    "px-4 py-2 rounded font-semibold text-sm " +
                    (lockLoading
                      ? "bg-red-900 text-red-300 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700 text-white")
                  }
                >
                  🔒 Lock Vehicle
                </button>
              )}

              {telemetry.isLocked && (
                <button
                  onClick={unlockVehicle}
                  disabled={lockLoading}
                  className={
                    "px-4 py-2 rounded font-semibold text-sm " +
                    (lockLoading
                      ? "bg-emerald-900 text-emerald-300 cursor-not-allowed"
                      : "bg-emerald-600 hover:bg-emerald-700 text-white")
                  }
                >
                  🔓 Unlock Vehicle
                </button>
              )}

              {!telemetry.isOverSpeed && !telemetry.isLocked && (
                <div className="text-xs text-slate-400 flex items-center">
                  Lock button appears when overspeed occurs.
                </div>
              )}
            </div>
          </div>

          {/* Warnings panel */}
          <div className="bg-slate-800 p-4 rounded-xl shadow flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs uppercase text-slate-400">
                Warning history
              </div>
              <button
                onClick={loadWarnings}
                className="text-xs px-2 py-1 rounded bg-slate-700 hover:bg-slate-600"
              >
                Refresh
              </button>
            </div>

            <div className="flex-1 overflow-y-auto max-h-64 text-xs space-y-1">
              {warnings.length === 0 && (
                <div className="text-slate-500">
                  No overspeed events recorded yet.
                </div>
              )}

              {warnings.map((w) => (
                <div
                  key={w._id}
                  className="border border-red-500/40 bg-red-900/30 rounded px-2 py-1"
                >
                  <div>
                    ⚠ {w.vehicleId} @ {w.speed.toFixed(1)} km/h (limit{" "}
                    {w.maxSpeed} km/h)
                  </div>
                  <div className="text-[10px] text-slate-300">
                    {new Date(w.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* LIVE MAP */}
          <div className="md:col-span-2 bg-slate-800 p-5 rounded-xl shadow mt-2">
            <div className="text-sm uppercase text-slate-400 mb-2">
              Live Vehicle Map
            </div>

            {telemetry ? (
              <LiveMap telemetry={telemetry} />
            ) : (
              <div className="text-slate-500 text-sm">Waiting for GPS...</div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
