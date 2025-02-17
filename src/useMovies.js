import { useState, useEffect } from "react";
const KEY = "3f2853f5";

export function useMovies(query, callback) {
  const [movies, setMovies] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState("");
  useEffect(
    function () {
      callback?.();
      const controller = new AbortController();

      async function fetchMovie() {
        try {
          setIsLoaded(true);
          setError("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );

          if (!res.ok)
            throw new Error("Something went wrong with fetching movie");

          const data = await res.json();
          if (data.Response === "False")
            throw new Error("We could not found your movie");

          setMovies(data.Search);
          setError("");
        } catch (err) {
          if (err.name !== "AbortError") {
            console.log(err.message);
            setError(err.message);
          }
        } finally {
          setIsLoaded(false);
        }
      }
      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }
      //   handleCloseMovie();
      fetchMovie();
      return function () {
        controller.abort();
      };
    },
    [query]
  );
  return { movies, isLoaded, error };
}
