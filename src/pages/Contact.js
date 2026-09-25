import React, { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("https://formspree.io/f/xpwyzeya", { // replace with your Formspree endpoint
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({ name: "", email: "", message: "" });
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error sending message.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 text-gray-200">
      <h2 className="text-3xl font-bold text-red-600 mb-6">Contact Us</h2>
      <p className="mb-6">
        Have questions or feedback? Send us a message and our support team will respond promptly.
      </p>

      {success && (
        <p className="text-green-400 mb-4">✅ Message sent successfully!</p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="p-3 rounded bg-gray-800 text-gray-200 border border-gray-700"
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="p-3 rounded bg-gray-800 text-gray-200 border border-gray-700"
        />
        <textarea
          name="message"
          placeholder="Your Message"
          value={formData.message}
          onChange={handleChange}
          required
          rows="6"
          className="p-3 rounded bg-gray-800 text-gray-200 border border-gray-700"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-red-600 hover:bg-red-700 transition text-white font-semibold py-3 px-6 rounded"
        >
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
};

export default Contact;
