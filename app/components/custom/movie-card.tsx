import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton"; // Skeleton 컴포넌트 경로 확인 필요
import type { Movie } from "@/types/movie";

import useFavoriteMovies from "@/hooks/use-favorite-movies";

const MovieCard: React.FC<Movie> = ({ imdbID, Poster, Title, Year, Type }) => {
  const { isFavorite, addFavorite, removeFavorite } = useFavoriteMovies();

  const toggleFavorite = () => {
    if (isFavorite(imdbID)) {
      removeFavorite(imdbID);
    } else {
      addFavorite({ imdbID, Poster, Title, Year, Type });
    }
  };

  return (
    <AlertDialog key={imdbID}>
      <AlertDialogTrigger asChild>
        <li className="flex items-center gap-4">
          {Poster !== "N/A" ? (
            <img src={Poster} alt={Title} className="w-12 h-16 object-cover rounded" />
          ) : (
            <Skeleton className="w-12 h-16 rounded" />
          )}
          <div>
            <h3 className={`font-medium text-base ${isFavorite(imdbID) && "text-amber-400"}`}>
              {Title}
            </h3>
            <p className="text-sm text-gray-500">{Type}</p>
            <p className="text-sm text-gray-500">{Year}</p>
          </div>
        </li>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center">
            {Title}
          </AlertDialogTitle>
          <div className="p-4 flex flex-col justify-center items-center">
            {Poster !== "N/A" ? (
              <img src={Poster} alt={Title} className="w-72 h-96 object-cover rounded" />
            ) : (
              <Skeleton className="w-72 h-96 rounded" />
            )}
            <p className="text-sm text-gray-500">{Type}</p>
            <p className="text-sm text-gray-500">{Year}</p>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="flex-1">취소</AlertDialogCancel>
          <AlertDialogAction className="flex-1" onClick={toggleFavorite}>
            {isFavorite(imdbID) ? "즐겨찾기 제거" : "즐겨찾기"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default MovieCard;
