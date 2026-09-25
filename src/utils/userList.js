import { supabase } from "../supabaseClient";

export async function getUserList(userId) {
  if (!userId) return [];

  try {
    const { data, error } = await supabase
      .from("user_movies") // New table name
      .select("*")
      .eq("user_id", userId);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching user list:", error);
    return [];
  }
}

export async function addToList(userId, movie) {
  if (!userId || !movie) return false;

  try {
    // Check if movie is already in list
    const { data: existing } = await supabase
      .from("user_movies")
      .select("*")
      .eq("user_id", userId)
      .eq("movie_title", movie.title)
      .single();

    if (existing) return true; // Already in list

    // Add to list
    const { error } = await supabase.from("user_movies").insert([
      {
        user_id: userId,
        movie_title: movie.title,
        movie_data: {
          title: movie.title,
          poster: movie.poster,
          preview: movie.preview,
          download: movie.download,
          year: movie.year,
          rating: movie.rating,
          genre: movie.genre,
          language: movie.language,
          duration: movie.duration,
          trailer: movie.trailer,
        },
      },
    ]);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error adding to list:", error);
    return false;
  }
}

export async function removeFromList(userId, movieTitle) {
  if (!userId || !movieTitle) return false;

  try {
    const { error } = await supabase
      .from("user_movies")
      .delete()
      .eq("user_id", userId)
      .eq("movie_title", movieTitle);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error removing from list:", error);
    return false;
  }
}

export async function isInList(userId, movieTitle) {
  if (!userId || !movieTitle) return false;

  try {
    const { data, error } = await supabase
      .from("user_movies")
      .select("movie_title")
      .eq("user_id", userId)
      .eq("movie_title", movieTitle)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return !!data;
  } catch (error) {
    console.error("Error checking if in list:", error);
    return false;
  }
}
