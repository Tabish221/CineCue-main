import React from "react";

const Privacy = () => (
  <div className="max-w-4xl mx-auto px-4 py-10 text-gray-200">
    <h1 className="text-3xl font-bold mb-6 text-red-600">Privacy Policy</h1>
    <p>Your privacy is important to us. CineCue collects and uses personal information only to provide the best streaming experience and improve our services.</p>

    <h2 className="text-2xl font-semibold mt-6 mb-2">Information We Collect</h2>
    <ul className="list-disc ml-6 mb-4">
      <li>Account registration details (email, name)</li>
      <li>Payment and subscription information</li>
      <li>Usage data to improve your experience</li>
    </ul>

    <h2 className="text-2xl font-semibold mt-6 mb-2">Data Usage</h2>
    <p>We never sell your personal data. Your information is used only to personalize your experience and for customer support.</p>
  </div>
);

export default Privacy;
