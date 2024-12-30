import { atom } from "recoil";
import { useRecoilTransactionObserver_UNSTABLE } from "recoil";
import type { Movie } from "@/types/movie";

export const favoriteMoviesState = atom<Record<string, Omit<Movie, "imdbID">>>({
  key: "favoriteMoviesState", // 고유 ID
  default: (() => {
    // localStorage에서 초기 상태 복원
    const savedState = localStorage.getItem("favoriteMoviesState");
    return savedState ? JSON.parse(savedState) : {};
  })(),
});

export function FavoritePersistenceObserver() {
  useRecoilTransactionObserver_UNSTABLE(({ snapshot }) => {
    // 모든 atom 상태 추적
    for (const node of snapshot.getNodes_UNSTABLE({ isModified: true })) {
      const loadable = snapshot.getLoadable(node);

      if (loadable.state === "hasValue") {
        // 특정 상태만 저장 (예: favoriteMoviesState)
        if (node.key === "favoriteMoviesState") {
          localStorage.setItem(node.key, JSON.stringify(loadable.contents));
        }
      }
    }
  });

  return null; // 리액트 컴포넌트로 동작하지만 UI는 없음
}
