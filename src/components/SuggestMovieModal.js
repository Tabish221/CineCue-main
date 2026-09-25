import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";
import {Check, X} from "lucide-react"
import toast from "react-hot-toast";
import "./SuggestMovieModal.css";

const SuggestMovieModal = ({ onClose }) => {
  const [movieName, setMovieName] = useState("");
  const { user } = useAuth();

  const handleSubmit = async () => {
    if (!movieName.trim()) {
      toast.error("Please enter a movie name.");
      return;
    }

    const { data, error } = await supabase
      .from("movie_requests")
      .insert([{ email: user.email, movie_name: movieName }]);

    if (error) {
      toast.error("Error submitting suggestion: " + error.message);
    } else {
      toast.success("Suggestion submitted successfully!");
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Suggest a Movie</h3>
        <input
          type="text"
          value={movieName}
          onChange={(e) => setMovieName(e.target.value)}
          placeholder="Enter movie name"
          className="movie-input"
        />
        <button onClick={handleSubmit} className="submit-button">
          <Check size={16}/>
        </button>
        <button onClick={onClose} className="cancel-button">
          <X size={16}/>
        </button>
      </div>
    </div>
  );
};

export default SuggestMovieModal;
