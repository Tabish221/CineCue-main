// src/components/MovieModal.js
import React, { useState } from "react";
import { X, Play, Download, Plus, Check } from "lucide-react";
import toast from "react-hot-toast";
import "./MovieModal.css";
import { useMovieList } from "../context/MovieListContext";

// Helper to extract YouTube video ID from a URL or return the ID if already provided
const getYouTubeId = (urlOrId) => {
  // If it's already an ID (11 chars, no special chars), return as is
  if (/^[a-zA-Z0-9_-]{11}$/.test(urlOrId)) return urlOrId;
  // Try to extract ID from URL
  const match = urlOrId.match(/(?:v=|\/embed\/|\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
};

const extractDriveFileId = (url) => {
  if (!url) return null;
  const match = url.match(/[-\w]{25,}/);
  return match ? match[0] : null;
};

const MovieModal = ({ movie, isOpen, onClose, user }) => {
  const [showPlayer, setShowPlayer] = useState(false);
  const [isAddingToList, setIsAddingToList] = useState(false);
  const { isInMyList, optimisticAddToList, optimisticRemoveFromList } =
    useMovieList();
  const isInList = isInMyList(movie?.title);

  document.addEventListener('keydown', function(event) {
          if (event.key === "Escape") {
            onClose();
            setShowPlayer(false);
          }
        });

  if (!isOpen || !movie) return null;

  const trailerId = getYouTubeId(movie.trailer);
  const driveFileId = extractDriveFileId(movie.preview);

  return (
    <div className="movie-modal-backdrop" onClick={onClose}>
      <div className="movie-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header with trailer (YouTube embed) */}
        <div className="movie-modal-header">
          {trailerId ? (
            <iframe
              className="modal-trailer"
              src={`https://www.youtube.com/embed/${trailerId}?autoplay=1`}
              title="YouTube trailer"
              frameBorder="0"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <img
              src={movie.poster}
              alt={movie.title}
              className="modal-poster"
            />
          )}
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="movie-modal-content">
          <h2 className="modal-title">{movie.title}</h2>
          <div className="modal-meta">
            {movie.rating && (
              <span className="modal-rating">{movie.rating}</span>
            )}
            {movie.year && <span>{movie.year}</span>}
            {movie.duration && <span>{movie.duration}</span>}
            {movie.genre && <span>{movie.genre}</span>}
            {movie.language && <span>{movie.language}</span>}
          </div>

          {/* Actions */}
          <div className="modal-actions">
            <button
              className="modal-btn primary"
              style={{ display: "inline-flex", alignItems: "center" }}
              onClick={() => setShowPlayer(true)}
            >
              <Play size={18} /> Play
            </button>

            <button
              className={`modal-btn secondary list-toggle-btn ${
                isAddingToList ? "loading" : ""
              } ${isInList ? "in-list" : ""}`}
              onClick={async () => {
                if (!user) {
                  toast.error("Please sign in to add to your list", {
                    id: `auth-${movie.title}`,
                  });
                  return;
                }
                setIsAddingToList(true);
                try {
                  if (isInList) {
                    toast.success("Removed from My List", {
                      id: `remove-${movie.title}`,
                      duration: 2000,
                    });
                    await optimisticRemoveFromList(user.id, movie.title);
                  } else {
                    toast.success("Added to My List", {
                      id: `add-${movie.title}`,
                      duration: 2000,
                    });
                    await optimisticAddToList(user.id, movie);
                  }
                } catch (error) {
                  toast.error("Failed to update list", {
                    id: `error-${movie.title}`,
                  });
                  console.error("Error toggling movie in list:", error);
                }
                setIsAddingToList(false);
              }}
              disabled={isAddingToList}
            >
              <div className="btn-icon-container">
                {isInList ? (
                  <Check className="list-icon check" size={18} />
                ) : (
                  <Plus className="list-icon plus" size={18} />
                )}
              </div>
              <span className="btn-text">
                {isInList ? "In My List" : "Add to My List"}
              </span>
            </button>

            <a href={movie.download} target="_blank" rel="noreferrer">
              <button className="modal-btn secondary">
                <Download size={18} /> Download
              </button>
            </a>
          </div>

          {/* Movie Description */}
          {movie.description && (
            <div className="modal-description">
              <h3 className="modal-description-title">About this movie</h3>
              <p className="modal-description-text">{movie.description}</p>
            </div>
          )}
        </div>

        {/* Video Player */}
        {showPlayer && driveFileId && (
          <div
            className="movie-player-container"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0,0,0,0.95)",
              zIndex: 2000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <iframe
              className="movie-player"
              src={`https://drive.google.com/file/d/${driveFileId}/preview`}
              title="Google Drive Video"
              frameBorder="0"
              allow="autoplay; encrypted-media; accelerometer; clipboard-write; encrypted-media; gyroscope;"
              allowFullScreen
              width="80%"
              height="80%"
              style={{ borderRadius: "12px", boxShadow: "0 0 32px #000" }}
            />
            <button
              style={{
                position: "absolute",
                top: 32,
                right: 32,
                color: "#fff",
                border: "none",
                borderRadius: "25%",
                width: 40,
                height: 40,
                fontSize: 24,
                cursor: "pointer",
                zIndex: 2100,
              }}
              onClick={() => setShowPlayer(false)}
            >
              <X size={24} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieModal;
