import { useRecoilState } from "recoil";
import { favoriteMoviesState } from "@/store/favorite";
import type { Movie } from "@/types/movie";

const useFavoriteMovies = () => {
  const [favorites, setFavorites] = useRecoilState(favoriteMoviesState);

  const addFavorite = (movie: Movie) => {
    setFavorites((prev) => ({
      ...prev,
      [movie.imdbID]: {
        Poster: movie.Poster,
        Title: movie.Title,
        Year: movie.Year,
        Type: movie.Type,
      },
    }));
  };

  const removeFavorite = (imdbID: string) => {
    setFavorites((prev) => {
      const updated = { ...prev };
      delete updated[imdbID];
      return updated;
    });
  };

  const isFavorite = (imdbID: string) => !!favorites[imdbID];

  return { favorites, addFavorite, removeFavorite, isFavorite };
};

export default useFavoriteMovies;
