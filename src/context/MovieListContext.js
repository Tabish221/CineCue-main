import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

const MovieListContext = createContext();

export function MovieListProvider({ children }) {
  const [myList, setMyList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let subscription;

    const setupSubscription = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // Initial fetch
      const { data: initialMovies, error: fetchError } = await supabase
        .from("user_movies")
        .select("id, created_at, user_id, movie_title, movie_data")
        .eq("user_id", user.id);

      if (fetchError) {
        console.error("Error fetching movies:", fetchError);
        setLoading(false);
        return;
      }

      setMyList(initialMovies || []);
      setLoading(false);

      // Subscribe to changes
      subscription = supabase
        .channel("movie_list_changes")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "user_movies",
            filter: `user_id=eq.${user.id}`,
          },
          async (payload) => {
            // Refetch the entire list when any change occurs
            const { data: updatedMovies, error: updateError } = await supabase
              .from("user_movies")
              .select("id, created_at, user_id, movie_title, movie_data")
              .eq("user_id", user.id);

            if (updateError) {
              console.error("Error updating movies:", updateError);
              return;
            }
            setMyList(updatedMovies || []);
          }
        )
        .subscribe();
    };

    setupSubscription();

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const isInMyList = (movieTitle) => {
    return myList.some((m) => m.movie_data.title === movieTitle);
  };

  const optimisticAddToList = async (userId, movie) => {
    // Create an optimistic movie entry
    const optimisticMovie = {
      id: `temp-${Date.now()}`, // Temporary ID
      user_id: userId,
      movie_title: movie.title,
      movie_data: movie,
      created_at: new Date().toISOString(),
    };

    // Optimistically update the UI
    setMyList((current) => [...current, optimisticMovie]);

    try {
      // Make the actual API call
      const { data, error } = await supabase
        .from("user_movies")
        .insert([
          {
            user_id: userId,
            movie_title: movie.title,
            movie_data: movie,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      // Update with the real data
      setMyList((current) =>
        current.map((m) => (m.id === optimisticMovie.id ? data : m))
      );

      return { success: true };
    } catch (error) {
      // Revert on error
      setMyList((current) =>
        current.filter((m) => m.id !== optimisticMovie.id)
      );
      throw error;
    }
  };

  const optimisticRemoveFromList = async (userId, movieTitle) => {
    // Store the movie being removed
    const movieToRemove = myList.find((m) => m.movie_data.title === movieTitle);
    if (!movieToRemove) return { success: false };

    // Optimistically update the UI
    setMyList((current) =>
      current.filter((m) => m.movie_data.title !== movieTitle)
    );

    try {
      // Make the actual API call
      const { error } = await supabase
        .from("user_movies")
        .delete()
        .eq("user_id", userId)
        .eq("movie_title", movieTitle);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      // Revert on error
      setMyList((current) => [...current, movieToRemove]);
      throw error;
    }
  };

  return (
    <MovieListContext.Provider
      value={{
        myList,
        loading,
        isInMyList,
        optimisticAddToList,
        optimisticRemoveFromList,
      }}
    >
      {children}
    </MovieListContext.Provider>
  );
}

export function useMovieList() {
  const context = useContext(MovieListContext);
  if (context === undefined) {
    throw new Error("useMovieList must be used within a MovieListProvider");
  }
  return context;
}
