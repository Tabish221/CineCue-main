import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const HeroSection = ({ movieCount, genreCount }) => {
  const { user, setShowSuggestMovieModal } = useAuth();
const navigate = useNavigate();

const handleSuggestClick = () => {
    if (user) {
      setShowSuggestMovieModal(true);
    } else {
      toast.error("Please sign in to suggest a movie");
      navigate("/auth");
    }
  };
  return (
    <div className="hero-section">
      <div className="hero-content">
        <h1 className="hero-title">Unlimited movies, TV shows, and more.</h1>
        <p className="hero-subtitle">Watch anywhere. Cancel anytime.</p>
        <button onClick={handleSuggestClick} className="suggest-button"
        style={{display: "inline-flex", alignItems: "center",borderRadius: "9999px", backgroundColor: "#e50914", color: "white", padding: "14px 14px", fontSize: "16px", fontWeight: "bold", border: "none", cursor: "pointer"}}>
          Suggest a movie
        </button>
        <div className="hero-stats">
          <div className="stat">
            <span className="stat-number">{movieCount}</span>
            <span className="stat-label">Movies Available</span>
          </div>
          <div className="stat">
            <span className="stat-number">{genreCount}</span>
            <span className="stat-label">Genres</span>
          </div>
          <div className="stat">
            <span className="stat-number">HD</span>
            <span className="stat-label">Quality</span>
          </div>
        </div>
      </div>
      <div className="hero-gradient"></div>
    </div>
  );
};

export default HeroSection;
