import React, { useState, useEffect } from "react";
import PageHeader from "../components/PageHeader";
import MoviesContainer from "../components/MoviesContainer";
import SeriesContainer from "../components/SeriesContainer";
import MovieModal from "../components/MovieModal";
import SeriesModal from "../components/SeriesModal";
import { useMovieList } from "../context/MovieListContext";
import { useSeriesList } from "../context/SeriesContext";
import { supabase } from "../supabaseClient";

const MyList = () => {
  const { myList: myMovieList, loading: moviesLoading } = useMovieList();
  const { mySeriesList, loading: seriesLoading } = useSeriesList();
  const [user, setUser] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [isMovieModalOpen, setIsMovieModalOpen] = useState(false);
  const [isSeriesModalOpen, setIsSeriesModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all"); // "all", "movies", "series"

  useEffect(() => {
    // Get initial user
    supabase.auth.getUser().then(({ data: { user: currentUser } }) => {
      setUser(currentUser);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleOpenMovieModal = (movie) => {
    setSelectedMovie(movie);
    setIsMovieModalOpen(true);
  };

  const handleOpenSeriesModal = (series) => {
    setSelectedSeries(series);
    setIsSeriesModalOpen(true);
  };

  const totalItems = myMovieList.length + mySeriesList.length;
  const isLoading = moviesLoading || seriesLoading;

  return (
    <>
      <PageHeader
        title="My List"
        subtitle="Your personally curated collection"
        itemCount={totalItems}
      />

      {/* Tab Navigation */}
      <div style={{ padding: "0 4%", marginBottom: "2rem" }}>
        <div
          style={{
            display: "flex",
            gap: "1rem",
            borderBottom: "1px solid #333",
          }}
        >
          <button
            onClick={() => setActiveTab("all")}
            style={{
              background: "none",
              border: "none",
              color: activeTab === "all" ? "white" : "#999",
              padding: "1rem 0",
              borderBottom: activeTab === "all" ? "2px solid #e50914" : "none",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: activeTab === "all" ? "600" : "400",
            }}
          >
            All ({totalItems})
          </button>
          <button
            onClick={() => setActiveTab("movies")}
            style={{
              background: "none",
              border: "none",
              color: activeTab === "movies" ? "white" : "#999",
              padding: "1rem 0",
              borderBottom:
                activeTab === "movies" ? "2px solid #e50914" : "none",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: activeTab === "movies" ? "600" : "400",
            }}
          >
            Movies ({myMovieList.length})
          </button>
          <button
            onClick={() => setActiveTab("series")}
            style={{
              background: "none",
              border: "none",
              color: activeTab === "series" ? "white" : "#999",
              padding: "1rem 0",
              borderBottom:
                activeTab === "series" ? "2px solid #e50914" : "none",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: activeTab === "series" ? "600" : "400",
            }}
          >
            TV Shows ({mySeriesList.length})
          </button>
        </div>
      </div>

      {isLoading ? (
        <div
          style={{ padding: "2rem 4%", textAlign: "center", minHeight: "50vh" }}
        >
          <p>Loading your list...</p>
        </div>
      ) : totalItems === 0 ? (
        <div
          style={{ padding: "2rem 4%", textAlign: "center", minHeight: "50vh" }}
        >
          <div
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              padding: "3rem",
              borderRadius: "12px",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
              Your list is empty
            </h2>
            <p
              style={{
                fontSize: "1.1rem",
                color: "#ccc",
                marginBottom: "1.5rem",
              }}
            >
              Start adding movies and TV shows to your personal collection.
              Browse through our catalog and add content you want to watch
              later!
            </p>
            <div
              style={{ display: "flex", gap: "1rem", justifyContent: "center" }}
            >
              <a
                href="/movies"
                style={{
                  background: "linear-gradient(45deg, #e50914, #8b0000)",
                  padding: "12px 24px",
                  borderRadius: "6px",
                  color: "white",
                  textDecoration: "none",
                  fontWeight: "600",
                  display: "inline-block",
                }}
              >
                Browse Movies
              </a>
              <a
                href="/tv-shows"
                style={{
                  background: "linear-gradient(45deg, #e50914, #8b0000)",
                  padding: "12px 24px",
                  borderRadius: "6px",
                  color: "white",
                  textDecoration: "none",
                  fontWeight: "600",
                  display: "inline-block",
                }}
              >
                Browse TV Shows
              </a>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ padding: "0 4%" }}>
          {/* Show Movies */}
          {(activeTab === "all" || activeTab === "movies") &&
            myMovieList.length > 0 && (
              <div style={{ marginBottom: "2rem" }}>
                {activeTab === "all" && (
                  <h2
                    style={{
                      fontSize: "1.5rem",
                      marginBottom: "1rem",
                      color: "white",
                    }}
                  >
                    Movies
                  </h2>
                )}
                <MoviesContainer
                  movies={myMovieList.map((item) => ({
                    ...item.movie_data,
                    id: item.id,
                  }))}
                  viewMode="grid"
                  isLoading={false}
                  onMovieClick={handleOpenMovieModal}
                />
              </div>
            )}

          {/* Show Series */}
          {(activeTab === "all" || activeTab === "series") &&
            mySeriesList.length > 0 && (
              <div>
                {activeTab === "all" && (
                  <h2
                    style={{
                      fontSize: "1.5rem",
                      marginBottom: "1rem",
                      color: "white",
                    }}
                  >
                    TV Shows
                  </h2>
                )}
                <SeriesContainer
                  series={mySeriesList.map((item) => ({
                    ...item.series_data,
                    id: item.id,
                  }))}
                  viewMode="grid"
                  isLoading={false}
                  onSeriesClick={handleOpenSeriesModal}
                  user={user}
                />
              </div>
            )}
        </div>
      )}

      {/* Movie Modal */}
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          isOpen={isMovieModalOpen}
          onClose={() => setIsMovieModalOpen(false)}
          user={user}
        />
      )}

      {/* Series Modal */}
      {selectedSeries && (
        <SeriesModal
          series={selectedSeries}
          isOpen={isSeriesModalOpen}
          onClose={() => setIsSeriesModalOpen(false)}
          user={user}
        />
      )}
    </>
  );
};

export default MyList;
