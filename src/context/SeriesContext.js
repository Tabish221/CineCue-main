import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

const SeriesContext = createContext();

export function SeriesProvider({ children }) {
  const [mySeriesList, setMySeriesList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let subscription;

    const setupSubscription = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        console.log("👤 No authenticated user found");
        setLoading(false);
        return;
      }

      console.log("👤 Authenticated user:", user.id);

      // Check if table exists and try to fetch initial data
      try {
        const { data: initialSeries, error: fetchError } = await supabase
          .from("user_series")
          .select("id, created_at, user_id, series_title, series_data")
          .eq("user_id", user.id);

        if (fetchError) {
          console.error("❌ Error fetching series:", fetchError);

          // If table doesn't exist, it might be a permissions issue
          if (
            fetchError.code === "PGRST116" ||
            fetchError.message.includes("does not exist")
          ) {
            console.warn(
              "⚠️ user_series table might not exist or you don't have permissions"
            );
          }

          setLoading(false);
          return;
        }

        console.log("📊 Fetched series list:", initialSeries);
        setMySeriesList(initialSeries || []);
        setLoading(false);

        // Subscribe to changes
        subscription = supabase
          .channel("series_list_changes")
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "user_series",
              filter: `user_id=eq.${user.id}`,
            },
            async (payload) => {
              console.log("🔄 Series list changed:", payload);
              // Refetch the entire list when any change occurs
              const { data: updatedSeries, error: updateError } = await supabase
                .from("user_series")
                .select("id, created_at, user_id, series_title, series_data")
                .eq("user_id", user.id);

              if (updateError) {
                console.error("Error updating series:", updateError);
                return;
              }
              setMySeriesList(updatedSeries || []);
            }
          )
          .subscribe();
      } catch (error) {
        console.error("💥 Setup error:", error);
        setLoading(false);
      }
    };

    setupSubscription();

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const isInMySeriesList = (seriesTitle) => {
    return mySeriesList.some((s) => s.series_data.title === seriesTitle);
  };

  const optimisticAddToSeriesList = async (userId, series) => {
    console.log("🚀 Adding to series list:", {
      userId,
      seriesTitle: series.title,
    });

    // Create an optimistic series entry
    const optimisticSeries = {
      id: `temp-${Date.now()}`, // Temporary ID
      user_id: userId,
      series_title: series.title,
      series_data: series,
      created_at: new Date().toISOString(),
    };

    // Optimistically update the UI
    setMySeriesList((current) => [...current, optimisticSeries]);

    try {
      // Make the actual API call
      console.log("📡 Making API call to add series...");
      const { data, error } = await supabase
        .from("user_series")
        .insert([
          {
            user_id: userId,
            series_title: series.title,
            series_data: series,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("❌ Database error:", error);
        throw error;
      }

      console.log("✅ Successfully added to database:", data);

      // Update with the real data
      setMySeriesList((current) =>
        current.map((s) => (s.id === optimisticSeries.id ? data : s))
      );

      return { success: true };
    } catch (error) {
      console.error("💥 Failed to add series:", error);
      // Revert on error
      setMySeriesList((current) =>
        current.filter((s) => s.id !== optimisticSeries.id)
      );
      throw error;
    }
  };

  const optimisticRemoveFromSeriesList = async (userId, seriesTitle) => {
    // Store the series being removed
    const seriesToRemove = mySeriesList.find(
      (s) => s.series_data.title === seriesTitle
    );
    if (!seriesToRemove) return { success: false };

    // Optimistically update the UI
    setMySeriesList((current) =>
      current.filter((s) => s.series_data.title !== seriesTitle)
    );

    try {
      // Make the actual API call
      const { error } = await supabase
        .from("user_series")
        .delete()
        .eq("user_id", userId)
        .eq("series_title", seriesTitle);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      // Revert on error
      setMySeriesList((current) => [...current, seriesToRemove]);
      throw error;
    }
  };

  return (
    <SeriesContext.Provider
      value={{
        mySeriesList,
        loading,
        isInMySeriesList,
        optimisticAddToSeriesList,
        optimisticRemoveFromSeriesList,
      }}
    >
      {children}
    </SeriesContext.Provider>
  );
}

export function useSeriesList() {
  const context = useContext(SeriesContext);
  if (context === undefined) {
    throw new Error("useSeriesList must be used within a SeriesProvider");
  }
  return context;
}
