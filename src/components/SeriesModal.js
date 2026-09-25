import React, { useState } from "react";
import { X, Play, Plus, Check, ChevronDown } from "lucide-react";
import { useSeriesList } from "../context/SeriesContext";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import "./SeriesModal.css";

const SeriesModal = ({ series, isOpen, onClose, user }) => {
  const [currentSeasonIndex, setCurrentSeasonIndex] = useState(0);
  const [showSeasonDropdown, setShowSeasonDropdown] = useState(false);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [currentVideoSrc, setCurrentVideoSrc] = useState("");
  const [currentVideoTitle, setCurrentVideoTitle] = useState("");
  const [isGoogleDriveVideo, setIsGoogleDriveVideo] = useState(false);
  const {
    isInMySeriesList,
    optimisticAddToSeriesList,
    optimisticRemoveFromSeriesList,
  } = useSeriesList();
  const { user: authUser } = useAuth();
  const currentUser = user || authUser;

  if (!isOpen || !series) return null;

  console.log("Series data:", series);

  const inMyList = isInMySeriesList(series.title);
  const currentSeason = series.seasonsData[currentSeasonIndex];

  // Function to generate episode thumbnail from CSV data
  const getEpisodeThumbnail = (episode) => {
    // Use "Episode Thumbnail" column from CSV
    if (episode["Episode Thumbnail"] && episode["Episode Thumbnail"].trim()) {
      return episode["Episode Thumbnail"];
    }

    // Fallback to placeholder if no thumbnail in CSV
    return "/api/placeholder/300/450";
  };

  // Function to get episode description from CSV
  const getEpisodeDescription = (episode) => {
    console.log("🔍 Episode object:", episode);
    console.log("🔍 Available keys:", Object.keys(episode || {}));
    console.log(
      "🔍 Episode Description value:",
      episode["Episode Description"]
    );

    // Use "Episode Description" column from CSV
    if (
      episode["Episode Description"] &&
      episode["Episode Description"].trim()
    ) {
      return episode["Episode Description"];
    }

    // Fallback to a generic description
    return "No description available.";
  };

  // Function to extract clean episode title from CSV data
  const getCleanEpisodeTitle = (episode) => {
    // Use "Episode Name" column from CSV if available and not just a number
    if (
      episode["Episode Name"] &&
      episode["Episode Name"].trim() &&
      episode["Episode Name"] !== episode.episodeNumber?.toString()
    ) {
      return episode["Episode Name"];
    }

    // Try to extract a clean title from the filename if Episode Name is not available
    if (episode.title || episode.fileName) {
      const sourceText = episode.title || episode.fileName;

      // Remove file extension
      let title = sourceText.replace(/\.(mkv|mp4|avi|mov|wmv|flv|webm)$/i, "");

      // For BoJack Horseman format: extract the actual episode title
      if (title.includes("BoJack.Horseman")) {
        // Pattern: BoJack.Horseman.S01E01.BoJack.Horseman_.The.BoJack.Horseman.Story.Chapter.One
        const match = title.match(
          /BoJack\.Horseman\.S\d+E\d+\.BoJack\.Horseman[._](.+)$/i
        );
        if (match) {
          return match[1].replace(/[._]/g, " ").replace(/\s+/g, " ").trim();
        }

        // Alternative pattern: BoJack.Horseman.S01E02.BoJack.Hates.the.Troops
        const altMatch = title.match(/BoJack\.Horseman\.S\d+E\d+\.(.+)$/i);
        if (altMatch) {
          return altMatch[1].replace(/[._]/g, " ").replace(/\s+/g, " ").trim();
        }
      }

      // General pattern for other shows
      const generalMatch = title.match(/^.+?\.S\d+E\d+\.(.+)$/i);
      if (generalMatch) {
        return generalMatch[1]
          .replace(/[._]/g, " ")
          .replace(/\s+/g, " ")
          .trim();
      }
    }

    // Fallback to episode number format
    return `Episode ${episode.episodeNumber || ""}`;
  };

  // Function to convert Google Drive URL to iframe embedding URL
  const convertGoogleDriveToIframe = (url) => {
    if (!url) return { url, isGoogleDrive: false };

    // Check if it's a Google Drive URL
    if (!url.includes("drive.google.com")) {
      return { url, isGoogleDrive: false };
    }

    let fileId = null;

    // Pattern 1: /file/d/FILE_ID/
    const pattern1 = /\/file\/d\/([a-zA-Z0-9_-]+)/;
    const match1 = url.match(pattern1);
    if (match1) {
      fileId = match1[1];
    }

    // Pattern 2: ?id=FILE_ID or &id=FILE_ID
    const pattern2 = /[?&]id=([a-zA-Z0-9_-]+)/;
    const match2 = url.match(pattern2);
    if (match2) {
      fileId = match2[1];
    }

    if (fileId) {
      // Convert to iframe embedding URL
      const iframeUrl = `https://drive.google.com/file/d/${fileId}/preview`;
      return { url: iframeUrl, isGoogleDrive: true, fileId };
    }

    return { url, isGoogleDrive: false };
  };

  const handlePlayEpisode = (episode, episodeIndex) => {
    console.log("🎬 Attempting to play episode:", {
      series: series.title,
      season: currentSeasonIndex + 1,
      episode: episodeIndex + 1,
      title: getCleanEpisodeTitle(episode),
      fileName: episode.fileName,
      allEpisodeData: episode,
    });

    // Check if we have a filename from the CSV
    const fileName = episode.fileName || episode.title;

    if (!fileName) {
      console.error("❌ No filename found in episode data");
      toast.error("No video file information found for this episode.");
      return;
    }

    console.log("📁 Found filename:", fileName);

    // Debug: Log the preview field to understand what we have
    console.log(
      "🔗 Preview field:",
      episode.preview,
      "Type:",
      typeof episode.preview
    );

    // Check if preview URL is available for web streaming
    if (
      episode.preview &&
      episode.preview.trim() &&
      episode.preview !== "undefined" &&
      episode.preview !== "" &&
      (episode.preview.startsWith("http://") ||
        episode.preview.startsWith("https://"))
    ) {
      console.log("🌐 Original preview URL:", episode.preview);

      // Convert Google Drive URL to iframe embedding URL
      const { url: streamingUrl, isGoogleDrive } = convertGoogleDriveToIframe(
        episode.preview
      );
      console.log(
        "🎬 Processed URL:",
        streamingUrl,
        "Is Google Drive:",
        isGoogleDrive
      );

      setCurrentVideoSrc(streamingUrl);
      setCurrentVideoTitle(getCleanEpisodeTitle(episode));
      setIsGoogleDriveVideo(isGoogleDrive);
      setShowVideoPlayer(true);
      toast.success(`Playing: ${getCleanEpisodeTitle(episode)}`);
      return;
    } // If we reach here, we don't have a valid streaming URL
    // Don't open the video player modal, just show helpful info
    console.log("❌ No valid streaming URL found, showing file info instead");
    console.log("❌ Preview value was:", episode.preview);

    // Make sure video player is NOT shown
    setShowVideoPlayer(false);

    toast.custom(
      (t) => (
        <div
          style={{
            background: "#333",
            color: "white",
            padding: "16px",
            borderRadius: "8px",
            maxWidth: "400px",
            border: "1px solid #555",
          }}
        >
          <div style={{ fontWeight: "bold", marginBottom: "8px" }}>
            📹 Video File Information
          </div>
          <div style={{ fontSize: "14px", marginBottom: "8px" }}>
            <strong>Episode:</strong> {getCleanEpisodeTitle(episode)}
          </div>
          <div style={{ fontSize: "14px", marginBottom: "8px" }}>
            <strong>File:</strong> {fileName}
          </div>
          {episode.preview && (
            <div
              style={{
                fontSize: "12px",
                marginBottom: "8px",
                color: "#ffaa00",
              }}
            >
              <strong>Preview:</strong> {episode.preview}
            </div>
          )}
          <div
            style={{ fontSize: "12px", color: "#ccc", marginBottom: "12px" }}
          >
            This video needs to be opened from your local files or media player.
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => {
                navigator.clipboard.writeText(fileName);
                toast.dismiss(t.id);
                toast.success("Filename copied to clipboard!");
              }}
              style={{
                background: "#0066cc",
                color: "white",
                border: "none",
                padding: "6px 12px",
                borderRadius: "4px",
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
              Copy Filename
            </button>
            <button
              onClick={() => {
                const searchQuery = `${series.title} ${getCleanEpisodeTitle(
                  episode
                )}`;
                navigator.clipboard.writeText(searchQuery);
                toast.dismiss(t.id);
                toast.success("Search query copied!");
              }}
              style={{
                background: "#666",
                color: "white",
                border: "none",
                padding: "6px 12px",
                borderRadius: "4px",
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
              Copy Search
            </button>
          </div>
        </div>
      ),
      { duration: 10000 }
    );

    // Remove all the file path trying logic since it doesn't work in web browsers
  };

  const handlePlaySeries = () => {
    if (currentSeason?.episodes?.length > 0) {
      handlePlayEpisode(currentSeason.episodes[0], 0);
    } else {
      toast.error("No episodes available");
    }
  };

  const handleAddToList = () => {
    if (!currentUser) {
      toast.error("Please log in to add to your list");
      return;
    }

    optimisticAddToSeriesList(currentUser.id, series)
      .then(() => toast.success("Added to My List"))
      .catch(() => toast.error("Failed to add to list"));
  };

  const handleRemoveFromList = () => {
    if (!currentUser) {
      toast.error("Please log in to manage your list");
      return;
    }

    optimisticRemoveFromSeriesList(currentUser.id, series.title)
      .then(() => toast.success("Removed from My List"))
      .catch(() => toast.error("Failed to remove from list"));
  };

  return (
    <div className="series-modal-overlay" onClick={onClose}>
      <div
        className="series-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="series-modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        {/* Header Section */}
        <div className="series-modal-header">
          <div className="series-modal-poster">
            <img
              src={series.poster}
              alt={series.title}
              onError={(e) => {
                e.target.src = "/api/placeholder/300/450";
              }}
            />
          </div>

          <div className="series-modal-info">
            <h1 className="series-modal-title">{series.title}</h1>
            <div className="series-modal-meta">
              {series.totalSeasons && series.totalSeasons > 0 && (
                <span className="series-modal-seasons">
                  {series.totalSeasons} Season
                  {series.totalSeasons !== 1 ? "s" : ""}
                </span>
              )}
              <span className="series-modal-episodes-count">
                {series.totalEpisodes || "0"} Episodes
              </span>
              {series.totalSeasons && series.totalSeasons > 0 && (
                <span className="series-modal-latest">
                  Latest: Season {series.totalSeasons}
                </span>
              )}
            </div>

            <div className="series-modal-actions">
              <button
                className="series-modal-play-btn"
                onClick={handlePlaySeries}
              >
                <Play size={16} fill="white" />
                Play S
                {currentSeason?.episodes?.[0]?.season || currentSeasonIndex + 1}
                E
                {currentSeason?.episodes?.[0]?.episodeNumber ||
                  currentSeason?.episodes?.[0]?.episode ||
                  1}
              </button>
              <button
                className={`series-modal-list-btn ${inMyList ? "in-list" : ""}`}
                onClick={inMyList ? handleRemoveFromList : handleAddToList}
              >
                {inMyList ? <Check size={16} /> : <Plus size={16} />}
              </button>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="series-modal-body">
          {/* Episodes Header with Season Selector */}
          <div className="series-modal-episodes-header">
            <div className="series-modal-episodes-title">
              <h2>Episodes</h2>
              <p className="series-modal-season-description">
                Season {currentSeasonIndex + 1}:{" "}
                {currentSeason?.description ||
                  "U/A 13+ | language, mature themes, substances, tobacco use"}
              </p>
            </div>

            <div className="series-modal-season-selector">
              <button
                className="series-modal-season-dropdown"
                onClick={() => setShowSeasonDropdown(!showSeasonDropdown)}
              >
                Season {currentSeasonIndex + 1}
                <ChevronDown
                  size={16}
                  className={showSeasonDropdown ? "rotated" : ""}
                />
              </button>

              {showSeasonDropdown && (
                <div className="series-modal-season-dropdown-menu">
                  {series.seasonsData.map((season, index) => (
                    <div
                      key={index}
                      className={`series-modal-season-option ${
                        index === currentSeasonIndex ? "active" : ""
                      }`}
                      onClick={() => {
                        setCurrentSeasonIndex(index);
                        setShowSeasonDropdown(false);
                      }}
                    >
                      Season {index + 1} ({season.episodes?.length || 0}{" "}
                      Episodes)
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Episodes Grid */}
          <div className="series-modal-episodes">
            {currentSeason?.episodes?.map((episode, index) => (
              <div key={index} className="series-modal-episode">
                <div className="series-modal-episode-thumbnail">
                  <img
                    src={getEpisodeThumbnail(episode)}
                    alt={`Episode ${episode.episodeNumber || index + 1}`}
                    onError={(e) => {
                      e.target.src = "/api/placeholder/300/169";
                    }}
                  />
                  <button
                    className="series-modal-episode-play"
                    onClick={() => handlePlayEpisode(episode, index)}
                  >
                    <Play size={20} fill="white" />
                  </button>
                </div>
                <div className="series-modal-episode-info">
                  <div className="series-modal-episode-title">
                    {getCleanEpisodeTitle(episode)}
                  </div>
                  <div className="series-modal-episode-description">
                    {getEpisodeDescription(episode)}
                  </div>
                  <div className="series-modal-episode-meta">
                    {episode["Runtime (min)"] && (
                      <span className="series-modal-episode-runtime">
                        {episode["Runtime (min)"]} min
                      </span>
                    )}
                    {episode["Air Date"] && (
                      <span className="series-modal-episode-date">
                        {episode["Air Date"]}
                      </span>
                    )}
                    {episode["TMDB Rating"] && (
                      <span className="series-modal-episode-rating">
                        ⭐ {episode["TMDB Rating"]}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Video Player Modal */}
      {showVideoPlayer && currentVideoSrc && (
        <div
          className="video-player-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.95)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
          }}
          onClick={() => setShowVideoPlayer(false)}
        >
          <div
            className="video-player-container"
            style={{
              width: "90%",
              maxWidth: "1200px",
              height: "80%",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowVideoPlayer(false)}
              style={{
                position: "absolute",
                top: "-40px",
                right: "0",
                background: "none",
                border: "none",
                color: "white",
                fontSize: "2rem",
                cursor: "pointer",
                zIndex: 2001,
              }}
            >
              ×
            </button>
            <h3
              style={{
                color: "white",
                marginBottom: "1rem",
                textAlign: "center",
              }}
            >
              {currentVideoTitle}
            </h3>
            {isGoogleDriveVideo ? (
              <iframe
                src={currentVideoSrc}
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "8px",
                  border: "none",
                }}
                allow="autoplay; encrypted-media"
                allowFullScreen
                title={currentVideoTitle}
                onLoad={() => {
                  console.log(
                    "✅ Google Drive iframe loaded:",
                    currentVideoSrc
                  );
                }}
              />
            ) : currentVideoSrc.startsWith("http://") ||
              currentVideoSrc.startsWith("https://") ? (
              <video
                src={currentVideoSrc}
                controls
                autoPlay
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "8px",
                }}
                onError={(e) => {
                  console.error("❌ Video playback error:", e);
                  toast.error(
                    `Video cannot be played. URL: ${currentVideoSrc}`
                  );
                  setShowVideoPlayer(false);
                }}
                onLoadStart={() => {
                  console.log("🎬 Video loading started for:", currentVideoSrc);
                }}
                onCanPlay={() => {
                  console.log("✅ Video can play:", currentVideoSrc);
                }}
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "18px",
                  textAlign: "center",
                  background: "#222",
                  borderRadius: "8px",
                }}
              >
                <div>
                  <div style={{ marginBottom: "1rem" }}>
                    ❌ Invalid Video Source
                  </div>
                  <div style={{ fontSize: "14px", color: "#ccc" }}>
                    Cannot play local files in web browser.
                    <br />
                    Source: {currentVideoSrc}
                  </div>
                  <button
                    onClick={() => setShowVideoPlayer(false)}
                    style={{
                      marginTop: "1rem",
                      padding: "8px 16px",
                      background: "#666",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SeriesModal;
