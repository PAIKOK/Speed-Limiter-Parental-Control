
export default function About() {
  return (
    <div className="bg-slate-950 text-white min-h-screen">

      <section className="pt-32 pb-20 max-w-5xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-6">About This Project</h1>
        <p className="text-slate-300 text-lg leading-relaxed">
          SpeedLimiter is a complete end-to-end system built to monitor and 
          regulate vehicle speed for minors or new drivers. 
          It combines 3D simulation, real-time networking, maps, databases, 
          and analytics into a single platform.
        </p>

        <h2 className="text-3xl font-bold mt-10 mb-4">Tech Stack</h2>

        <ul className="space-y-3 text-slate-300 text-lg">
          <li>⚙ <span className="font-semibold">Frontend:</span> React, TailwindCSS</li>
          <li>🎮 <span className="font-semibold">3D Engine:</span> Three.js (Car & Bike simulation)</li>
          <li>🛰 <span className="font-semibold">Live Communication:</span> Socket.IO (WebSockets)</li>
          <li>🗺 <span className="font-semibold">Maps:</span> Leaflet (Live GPS rendering)</li>
          <li>🗄 <span className="font-semibold">Backend:</span> Node.js + Express</li>
          <li>📦 <span className="font-semibold">Database:</span> MongoDB (Vehicle logs & analytics)</li>
          <li>🔐 <span className="font-semibold">Auth:</span> Session tokens (No JWT)</li>
        </ul>

        <h2 className="text-3xl font-bold mt-10 mb-4">Purpose</h2>
        <p className="text-slate-300 text-lg">
          The system allows parents to remotely monitor vehicle usage, 
          detect overspeeding, and view all routes driven using GPS.  
          It's designed for safety, modern UI, and real-time responsiveness.
        </p>
      </section>

    </div>
  );
}
