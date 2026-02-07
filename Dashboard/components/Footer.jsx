export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-20 py-10">
      <div className="max-w-6xl mx-auto text-center space-y-3">
        <p className="text-sm">
          © {new Date().getFullYear()} SpeedLimiter — Parental Vehicle
          Monitoring System
        </p>
        <p className="text-xs text-slate-500">
          Built using Three.js, Node.js, MongoDB & WebSockets.
        </p>
      </div>
    </footer>
  );
}
