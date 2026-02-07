import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-slate-950 text-white min-h-screen">
      <section className="pt-32 pb-24 text-center max-w-5xl mx-auto px-4">
        <h1 className="text-4xl md:text-6xl font-extrabold text-blue-400">
          Speed Limiter & Parental Monitoring System
        </h1>
        <p className="mt-6 text-lg text-slate-300">
          Real-time vehicle tracking, overspeed alerts, and complete driving
          behavior analytics — powered by WebSockets, GPS mapping, and 3D
          simulation.
        </p>

        <div className="flex justify-center gap-4 mt-8">
          <Link
            href="/signup"
            className="bg-blue-600 px-6 py-3 rounded-lg text-lg hover:bg-blue-700"
          >
            Get Started
          </Link>
          <a
            href="#features"
            className="bg-white text-slate-900 px-6 py-3 rounded-lg text-lg hover:bg-slate-200"
          >
            Learn More
          </a>
        </div>
      </section>

      {/* Section 1 — What is SpeedLimiter */}
      <section className="py-20 max-w-6xl mx-auto px-4" id="about">
        <h2 className="text-3xl font-bold mb-6">What Is This Project?</h2>
        <p className="text-slate-300 text-lg leading-relaxed">
          SpeedLimiter is a system designed for parents to monitor their
          children’s driving behavior. It integrates a 3D simulation (Three.js),
          real-time speed tracking, GPS mapping (Leaflet), overspeed warnings,
          MongoDB data logging, and a modern dashboard built in React.
        </p>
      </section>

      {/* Section 2 — Features */}
      <section className="py-20 bg-slate-900" id="features">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10">Key Features</h2>

          <div className="grid md:grid-cols-2 gap-10">
            <div className="p-6 bg-slate-800 rounded-xl shadow-md">
              <h3 className="text-xl font-bold mb-2">
                🚗 Real-Time Speed Monitoring
              </h3>
              <p className="text-slate-300">
                3D vehicle simulation sends speed to the dashboard instantly via
                Socket.IO.
              </p>
            </div>

            <div className="p-6 bg-slate-800 rounded-xl shadow-md">
              <h3 className="text-xl font-bold mb-2">⚠ Overspeed Alerts</h3>
              <p className="text-slate-300">
                System automatically detects overspeed and warns parents
                instantly.
              </p>
            </div>

            <div className="p-6 bg-slate-800 rounded-xl shadow-md">
              <h3 className="text-xl font-bold mb-2">🗺 Live GPS Tracking</h3>
              <p className="text-slate-300">
                Using Leaflet maps to render live positions of cars/bikes.
              </p>
            </div>

            <div className="p-6 bg-slate-800 rounded-xl shadow-md">
              <h3 className="text-xl font-bold mb-2">📊 History & Analytics</h3>
              <p className="text-slate-300">
                MongoDB stores all events for review — speed, warnings,
                positions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3 — How It Works */}
      <section className="py-20 max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6">How It Works</h2>
        <ul className="space-y-4 text-slate-300 text-lg">
          <li>✔ Parent logs in → gets a unique token</li>
          <li>✔ Simulation connects with the same token via WebSocket</li>
          <li>✔ Vehicle movement generates speed, GPS, & events</li>
          <li>✔ All data is streamed instantly to the dashboard</li>
          <li>✔ Overspeed alerts appear in real time</li>
          <li>✔ Database stores full driving history</li>
        </ul>
      </section>

      {/* Section 4 — Call To Action */}
      <section className="py-20 bg-blue-600 text-center" id="contact">
        <h2 className="text-3xl font-bold mb-4 text-white">
          Ready to Use the System?
        </h2>
        <p className="text-white text-lg mb-6">
          Start monitoring real-time vehicle data now.
        </p>
        <Link
          href="/signup"
          className="bg-white text-blue-700 px-10 py-3 rounded-xl text-xl font-bold hover:bg-slate-100"
        >
          Create Account For Free
        </Link>
      </section>
    </div>
  );
}
