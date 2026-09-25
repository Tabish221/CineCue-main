import React from "react";

const Help = () => (
  <div className="max-w-4xl mx-auto px-4 py-10 text-gray-200">
    <h1 className="text-3xl font-bold mb-6 text-red-600">Help Center</h1>
    <p>Welcome to CineCue's Help Center. Here you'll find answers to frequently asked questions about using our platform, account management, and movie streaming tips.</p>
    
    <h2 className="text-2xl font-semibold mt-6 mb-2">Account & Membership</h2>
    <ul className="list-disc ml-6 mb-4">
      <li>How to create an account and login.</li>
      <li>Managing your subscription and billing.</li>
      <li>Recovering your password.</li>
    </ul>

    <h2 className="text-2xl font-semibold mt-6 mb-2">Streaming & Playback</h2>
    <ul className="list-disc ml-6 mb-4">
      <li>How to stream movies and TV shows.</li>
      <li>Troubleshooting playback issues.</li>
      <li>Supported devices and browsers.</li>
    </ul>

    <p>If you need further assistance, visit our <a href="/contact" className="text-red-600 underline">Contact Page</a>.</p>
  </div>
);

export default Help;
