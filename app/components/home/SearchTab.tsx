import { useState, useEffect, useRef } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import MovieCard from "@/components/custom/movie-card";

import { searchMovies } from "@/lib/utils"; // searchMovies가 있는 파일 경로로 수정하세요.
import type {
  Movie,
  SearchResponse,
  SearchResponseSuccess,
  SearchResponseError,
} from "@/types/movie";

// 타입 가드 함수
function isSearchResponseSuccess(data: SearchResponse): data is SearchResponseSuccess {
  return data.Response === "True"; // Response가 "True"인 경우 성공
}

// 타입 가드 함수
function isSearchResponseError(data: SearchResponse): data is SearchResponseError {
  return data.Response === "False"; // Response가 "False"인 경우 성공
}

function SearchTab({ movies, setMovies }: { movies: Movie[]; setMovies: React.Dispatch<React.SetStateAction<Movie[]>> }) {
  const [searchQuery, setSearchQuery] = useState(""); // 사용자의 검색어 상태
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [error, setError] = useState(""); // 에러 메시지 상태
  const [page, setPage] = useState(1); // 페이지 상태
  const [hasMore, setHasMore] = useState(true); // 더 로드할 데이터가 있는지 여부
  const observerRef = useRef<HTMLDivElement | null>(null); // 관찰할 요소

  const handleSearch = async (resetPage = true) => {
    if (!searchQuery.trim()) {
      setError("검색어를 입력해주세요.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const currentPage = resetPage ? 1 : page;
      const data: SearchResponse = await searchMovies(searchQuery, currentPage);

      if (isSearchResponseSuccess(data)) {
        setMovies((prev) => (resetPage ? data.Search : [...prev, ...data.Search]));
        setHasMore(data.Search.length > 0); // 더 가져올 데이터가 있는지 여부
        if (resetPage) setPage(2); // 초기화 후 다음 페이지 설정
        else setPage((prev) => prev + 1); // 현재 페이지 증가
      } else if (isSearchResponseError(data)) {
        if (page === 1) {
          setError(data.Error || "검색 결과가 없습니다.");
          setMovies(resetPage ? [] : movies); // 에러 발생 시 목록 초기화 또는 유지
        }
        setHasMore(false); // 더 가져올 데이터가 없음
      }
    } catch (err: unknown) {
      if (page !== 1) {
        setHasMore(false); // 더 가져올 데이터가 없음
      }

      if (err instanceof Error) {
        setError(err.message || "영화를 검색할 수 없습니다.");
      } else {
        setError("영화를 검색할 수 없습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  const loadMoreMovies = () => {
    if (!loading && hasMore) {
      handleSearch(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreMovies();
        }
      },
      { threshold: 1.0 }
    );

    const currentObserverRef = observerRef.current;
    if (currentObserverRef) {
      observer.observe(currentObserverRef);
    }

    return () => {
      if (currentObserverRef) {
        observer.unobserve(currentObserverRef);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [observerRef?.current, loading, hasMore]);

  const handleNewSearch = () => {
    setMovies([]);
    setPage(1);
    setHasMore(true);
    handleSearch(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setMovies([]);
      handleNewSearch();
    }
  };

  return (
    <div className="w-full h-[94vh] flex flex-col">
      <div className="flex-1 flex gap-2 items-center">
        <Input
          className="flex-auto"
          placeholder="영화 제목을 입력하세요."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown} // 엔터 키 이벤트 핸들러 추가
          icon={<MagnifyingGlassIcon className="w-[24px] h-[24px]" />}
        />
        <Button className="w-40" onClick={handleNewSearch} disabled={loading}>
          {loading ? "Loading..." : "Search"}
        </Button>
      </div>
      {movies.length <= 0 ? (
        <div className="flex-[9] flex justify-center items-center rounded-md border mb-2">
          <div className="p-4">
            <div className="text-sm items">{error || "검색 결과가 없습니다."}</div>
          </div>
        </div>
      ) : (
        <ScrollArea className="flex-[9] flex rounded-md border mb-2">
          <div className="p-4">
            <ul className="grid grid-cols-2 gap-4"> {/* 그리드 레이아웃으로 변경 */}
              {movies.map((movie: Movie) => (
                <MovieCard
                  key={movie.imdbID}
                  imdbID={movie.imdbID}
                  Poster={movie.Poster}
                  Type={movie.Type}
                  Title={movie.Title}
                  Year={movie.Year}
                />
              ))}
            </ul>
            {hasMore && (
              <div ref={observerRef} className="h-8 flex justify-center items-center">
                {loading ? "Loading ..." : ""}
              </div>
            )}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}

export default SearchTab;
