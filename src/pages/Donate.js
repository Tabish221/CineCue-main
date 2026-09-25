import React, { useState } from "react";
import { FaHeart, FaCoffee, FaFilm, FaStar, FaQrcode } from "react-icons/fa";
import { SiGooglepay } from "react-icons/si";

const Donate = () => {
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState("");
  const [showThankYou, setShowThankYou] = useState(false);

  const donationAmounts = [
    {
      value: 100,
      label: "₹100",
      icon: <FaCoffee />,
      description: "Buy us a coffee",
    },
    {
      value: 500,
      label: "₹500",
      icon: <FaFilm />,
      description: "Support a feature",
    },
    {
      value: 1000,
      label: "₹1000",
      icon: <FaStar />,
      description: "Become a star supporter",
    },
    {
      value: 2500,
      label: "₹2500",
      icon: <FaHeart />,
      description: "Premium supporter",
    },
  ];

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (e) => {
    setCustomAmount(e.target.value);
    setSelectedAmount(null);
  };

  const getFinalAmount = () => {
    return selectedAmount || (customAmount ? parseInt(customAmount) : 0);
  };

  const handleDonate = (method) => {
    const amount = getFinalAmount();
    if (amount < 10) {
      alert("Please select or enter an amount (minimum ₹10)");
      return;
    }

    // Here you would integrate with actual payment gateways
    // For now, we'll show different options based on the method
    switch (method) {
      case "upi":
        // UPI deep link - opens UPI apps directly
        const upiLink = `upi://pay?pa=jaisejohn69@okicici&pn=CineCue&am=${amount}&cu=INR&tn=Donation%20to%20CineCue`;
        window.location.href = upiLink;
        break;
      case "gpay":
        // Google Pay UPI link
        const gpayLink = `tez://upi/pay?pa=jaisejohn69@okicici&pn=CineCue&am=${amount}&cu=INR&tn=Donation%20to%20CineCue`;
        window.location.href = gpayLink;
        break;
      default:
        break;
    }

    setShowThankYou(true);
    setTimeout(() => setShowThankYou(false), 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-600 rounded-full mb-6">
            <FaHeart className="text-white text-4xl animate-pulse" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Support <span className="text-red-600">CineCue</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            CineCue is a free platform dedicated to helping you discover amazing
            movies and TV shows. Your donation helps us keep the lights on,
            improve our recommendations, and add new features!
          </p>
        </div>

        {/* Thank You Popup Modal */}
        {showThankYou && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-gray-800 rounded-2xl p-8 max-w-md mx-4 text-center transform animate-bounce-in">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold text-white mb-3">Thank You!</h2>
              <p className="text-gray-300 text-lg mb-2">
                Your support means the world to us!
              </p>
              <p className="text-gray-400 mb-6">
                Thanks for helping CineCue grow and improve. You're awesome! ❤️
              </p>
              <button
                onClick={() => setShowThankYou(false)}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-full transition-all"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Donation Amounts */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {donationAmounts.map((donation) => (
            <button
              key={donation.value}
              onClick={() => handleAmountSelect(donation.value)}
              className={`p-6 rounded-xl border-2 transition-all transform hover:scale-105 ${
                selectedAmount === donation.value
                  ? "border-red-600 bg-red-600/20"
                  : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
              }`}
            >
              <div className="text-3xl mb-2 text-red-500">{donation.icon}</div>
              <div className="text-2xl font-bold text-white">
                {donation.label}
              </div>
              <div className="text-sm text-gray-400 mt-1">
                {donation.description}
              </div>
            </button>
          ))}
        </div>

        {/* Custom Amount */}
        <div className="mb-8">
          <label className="block text-gray-400 mb-2 text-center">
            Or enter a custom amount
          </label>
          <div className="relative max-w-xs mx-auto">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">
              ₹
            </span>
            <input
              type="number"
              min="10"
              value={customAmount}
              onChange={handleCustomAmountChange}
              placeholder="Enter amount"
              className="w-full p-4 pl-10 rounded-xl bg-gray-800 text-white text-center text-xl border border-gray-700 focus:border-red-600 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Selected Amount Display */}
        {getFinalAmount() > 0 && (
          <div className="text-center mb-8">
            <p className="text-gray-400">You're donating</p>
            <p className="text-4xl font-bold text-white">₹{getFinalAmount()}</p>
          </div>
        )}

        {/* Payment Methods */}
        <div className="bg-gray-800/50 rounded-2xl p-6 mb-8">
          <h3 className="text-xl font-semibold text-white mb-4 text-center">
            Supports GPay, PhonePe, Paytm, SuperMoney, Slice & more
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleDonate("upi")}
              className="flex flex-col items-center p-4 bg-gray-700/50 rounded-xl hover:bg-gray-700 transition-all group"
            >
              <FaQrcode className="text-3xl text-purple-400 group-hover:scale-110 transition-transform" />
              <span className="text-white mt-2">Open UPI App</span>
            </button>
            <button
              onClick={() => handleDonate("gpay")}
              className="flex flex-col items-center p-4 bg-gray-700/50 rounded-xl hover:bg-gray-700 transition-all group"
            >
              <SiGooglepay className="text-3xl text-blue-400 group-hover:scale-110 transition-transform" />
              <span className="text-white mt-2">Google Pay</span>
            </button>
          </div>
        </div>

        {/* UPI QR Code Section */}
        <div className="bg-gray-800/50 rounded-2xl p-6 mb-8 text-center">
          <h3 className="text-xl font-semibold text-white mb-4">
            Scan to Pay via UPI
          </h3>
          <div className="inline-block bg-white p-4 rounded-xl mb-4">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=jaisejohn69@okicici%26pn=CineCue${
                getFinalAmount() > 0 ? `%26am=${getFinalAmount()}` : ""
              }%26cu=INR%26tn=Donation%20to%20CineCue`}
              alt="UPI QR Code for CineCue"
              className="w-48 h-48"
            />
          </div>
          {getFinalAmount() > 0 && (
            <p className="text-green-400 text-sm mb-2">
              Amount: ₹{getFinalAmount()}
            </p>
          )}
          <p className="text-gray-400 text-sm">UPI ID: jai*****69@oki**ci</p>
        </div>

        {/* What Your Donation Supports */}
        <div className="bg-gray-800/50 rounded-2xl p-6 mb-8">
          <h3 className="text-xl font-semibold text-white mb-4 text-center">
            What Your Donation Supports
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">🖥️</div>
              <h4 className="text-white font-semibold mb-2">Server Costs</h4>
              <p className="text-gray-400 text-sm">
                Keeping CineCue fast and reliable 24/7
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">✨</div>
              <h4 className="text-white font-semibold mb-2">New Features</h4>
              <p className="text-gray-400 text-sm">
                Developing better recommendations and tools
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🎬</div>
              <h4 className="text-white font-semibold mb-2">Content Updates</h4>
              <p className="text-gray-400 text-sm">
                Adding more movies and TV shows regularly
              </p>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center text-gray-500 text-sm">
          <p>
            Every contribution, big or small, makes a difference. Thank you for
            your support! ❤️
          </p>
          <p className="mt-2">
            Questions?{" "}
            <a href="/contact" className="text-red-500 hover:underline">
              Contact us
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Donate;
