import React, { useState } from "react";
import { motion } from "framer-motion";
import { Play, Plus, Check, Star, Info } from "lucide-react";

const MobileOptimizedMovieCard = ({
  title,
  poster,
  year,
  rating,
  genre,
  duration,
  preview,
  download,
  onClick,
  viewMode = "grid",
  isInMyList = false,
  onAddToList,
  onPlay,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  const renderStars = (rating) => {
    if (!rating) return null;
    const numRating = parseFloat(rating);
    const stars = Math.round(numRating / 2); // Convert 10-point to 5-point scale

    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={12}
            className={`${
              i < stars ? "text-yellow-400 fill-current" : "text-gray-400"
            }`}
          />
        ))}
        <span className="text-xs text-gray-300 ml-1">{numRating}</span>
      </div>
    );
  };

  if (viewMode === "list") {
    return (
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        whileTap="tap"
        className="bg-netflix-gray rounded-lg overflow-hidden 
                   flex flex-row h-32 sm:h-40
                   border border-gray-700 hover:border-gray-500
                   transition-colors duration-200"
        onClick={onClick}
      >
        {/* Mobile List Poster */}
        <div className="w-24 sm:w-32 h-full flex-shrink-0 relative">
          {!imageLoaded && !imageError && (
            <div className="w-full h-full bg-gray-800 animate-pulse flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-netflix-red border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          <img
            src={
              poster ||
              `https://via.placeholder.com/300x450/1a1a1a/ffffff?text=${encodeURIComponent(
                title
              )}`
            }
            alt={title}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setImageError(true);
              setImageLoaded(true);
            }}
          />
        </div>

        {/* Mobile List Content */}
        <div className="flex-1 p-3 sm:p-4 flex flex-col justify-between">
          <div>
            <h3 className="text-white font-semibold text-sm sm:text-base line-clamp-2 mb-1">
              {title}
            </h3>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {year && (
                <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
                  {year}
                </span>
              )}
              {duration && (
                <span className="text-xs text-gray-400">{duration}</span>
              )}
            </div>
            {rating && renderStars(rating)}
          </div>

          {/* Mobile Action Buttons */}
          <div className="flex items-center justify-between mt-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPlay?.(preview || download);
              }}
              className="bg-netflix-red text-white px-3 py-1.5 rounded text-xs font-semibold
                         flex items-center space-x-1 hover:bg-red-700 transition-colors
                         active:scale-95 transform duration-100"
            >
              <Play size={12} fill="white" />
              <span>Play</span>
            </button>

            <div className="flex space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToList?.();
                }}
                className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors
                           active:scale-95 transform duration-100"
              >
                {isInMyList ? (
                  <Check size={14} className="text-green-400" />
                ) : (
                  <Plus size={14} className="text-white" />
                )}
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClick?.();
                }}
                className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors
                           active:scale-95 transform duration-100"
              >
                <Info size={14} className="text-white" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid View (Default)
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
      className="group relative bg-netflix-gray rounded-lg overflow-hidden
                 w-full aspect-[2/3] cursor-pointer
                 border border-gray-700 hover:border-gray-500
                 transition-colors duration-200"
      onClick={onClick}
    >
      {/* Poster Image */}
      <div className="relative w-full h-2/3">
        {!imageLoaded && !imageError && (
          <div className="w-full h-full bg-gray-800 animate-pulse flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-netflix-red border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        <img
          src={
            poster ||
            `https://via.placeholder.com/300x450/1a1a1a/ffffff?text=${encodeURIComponent(
              title
            )}`
          }
          alt={title}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            setImageError(true);
            setImageLoaded(true);
          }}
        />

        {/* Mobile Hover Overlay */}
        <div
          className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60
                        transition-all duration-300 flex items-center justify-center"
        >
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300
                       bg-netflix-red text-white rounded-full p-3
                       hover:bg-red-700 active:scale-95 transform"
            onClick={(e) => {
              e.stopPropagation();
              onPlay?.(preview || download);
            }}
          >
            <Play size={20} fill="white" />
          </motion.button>
        </div>

        {/* Quick Action Buttons (Mobile) */}
        <div className="absolute top-2 right-2 flex flex-col space-y-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToList?.();
            }}
            className="p-1.5 rounded-full bg-black bg-opacity-70 hover:bg-opacity-90 transition-all
                       active:scale-95 transform duration-100"
          >
            {isInMyList ? (
              <Check size={14} className="text-green-400" />
            ) : (
              <Plus size={14} className="text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Card Info */}
      <div className="h-1/3 p-3 flex flex-col justify-between">
        <div>
          <h3 className="text-white font-semibold text-sm line-clamp-2 mb-1">
            {title}
          </h3>

          <div className="flex items-center justify-between text-xs text-gray-400">
            {year && <span>{year}</span>}
            {rating && renderStars(rating)}
          </div>
        </div>

        {/* Genre Tags (Hidden on very small screens) */}
        {genre && (
          <div className="hidden xs:block">
            <div className="flex flex-wrap gap-1 mt-1">
              {genre
                .split(",")
                .slice(0, 2)
                .map((g, index) => (
                  <span
                    key={index}
                    className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded"
                  >
                    {g.trim()}
                  </span>
                ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MobileOptimizedMovieCard;
