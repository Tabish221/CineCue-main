import React, { useState } from "react";
import MovieCard from "./MovieCard";
import LoadingCard from "./LoadingCard";
import MovieModal from "./MovieModal";
import { useAuth } from "../context/AuthContext";

const MoviesContainer = ({
  movies,
  viewMode,
  isLoading,
  onMovieClick,
  user,
}) => {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const { user: authUser } = useAuth();
  const currentUser = user || authUser;

  return (
    <div className={`movies-container ${viewMode}`}>
      {isLoading
        ? Array.from({ length: 12 }).map((_, index) => (
            <LoadingCard key={index} />
          ))
        : movies.map((movie, index) => (
            <MovieCard
              key={index}
              title={movie.title}
              poster={movie.poster}
              year={movie.year}
              rating={movie.rating}
              genre={movie.genre}
              duration={movie.duration}
              preview={movie.preview}
              download={movie.download}
              onClick={() =>
                onMovieClick ? onMovieClick(movie) : setSelectedMovie(movie)
              }
            />
          ))}

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          isOpen={true}
          onClose={() => setSelectedMovie(null)}
          user={currentUser}
        />
      )}
    </div>
  );
};

export default MoviesContainer;
