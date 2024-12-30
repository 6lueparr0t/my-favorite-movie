import { useMemo } from "react";
import MovieCard from "@/components/custom/movie-card";
import { ChevronUpDownIcon } from "@heroicons/react/24/outline";

import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import { SortableContext, arrayMove, rectSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useRecoilState } from "recoil";
import { favoriteMoviesState } from "@/store/favorite";
import type { Movie } from "@/types/movie";

function SortableMovieCard({ movie, id }: { movie: Movie; id: string }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="flex items-center gap-4 p-2 rounded"
    >
      <div
        className="cursor-move" // 드래그 가능한 핸들
        {...listeners} // 드래그 이벤트를 핸들에만 적용
      >
        <ChevronUpDownIcon className="w-[24px] h-[24px]" />
      </div>
      <MovieCard
        imdbID={movie.imdbID}
        Poster={movie.Poster}
        Title={movie.Title}
        Year={movie.Year}
        Type={movie.Type}
      />
    </li>
  );
}

function FavoriteTab() {
  const [favorites, setFavorites] = useRecoilState(favoriteMoviesState); // Recoil 상태 사용

  // favorites를 기반으로 movies를 계산
  const movies = useMemo(() => {
    return Object.entries(favorites).map(([imdbID, movie]) => ({
      imdbID,
      ...movie,
    }));
  }, [favorites]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = movies.findIndex((movie) => movie.imdbID === active.id);
      const newIndex = movies.findIndex((movie) => movie.imdbID === over.id);
      const newMovies = arrayMove(movies, oldIndex, newIndex);

      // Recoil 상태 업데이트
      const updatedFavorites = newMovies.reduce((acc, movie) => {
        acc[movie.imdbID] = {
          Poster: movie.Poster,
          Title: movie.Title,
          Year: movie.Year,
          Type: movie.Type,
        };
        return acc;
      }, {} as Record<string, Omit<Movie, "imdbID">>);
      setFavorites(updatedFavorites); // Recoil 상태를 통해 localStorage에 저장
    }
  };

  return (
    <div className="w-full h-[94vh] flex flex-col">
      <div className="flex-1 flex gap-2 items-center">
        <h2 className="text-lg font-bold p-4">내 즐겨찾기</h2>
      </div>
      {movies.length <= 0 ? (
        <div className="flex-[9] flex justify-center items-center rounded-md border mb-2">
          <div className="p-4">
            <div className="text-sm items">즐겨찾기한 영화가 없습니다.</div>
          </div>
        </div>
      ) : (
        <div className="flex-[9] flex flex-col rounded-md border mb-2 p-4">
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext
              items={movies.map((movie) => movie.imdbID)}
              strategy={rectSortingStrategy}
            >
              <ul className="grid grid-cols-2 gap-4"> {/* 그리드 레이아웃으로 변경 */}
                {movies.map((movie) => (
                  <SortableMovieCard key={movie.imdbID} movie={movie} id={movie.imdbID} />
                ))}
              </ul>
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  );
}

export default FavoriteTab;
