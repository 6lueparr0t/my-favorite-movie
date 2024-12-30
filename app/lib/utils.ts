import axios from "axios";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { SearchResponse } from "@/types/movie";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function searchMovies(s: string, page: number = 1): Promise<SearchResponse> {
  try {
    const response = await axios.get(import.meta.env.VITE_APP_BASE_URL, {
      params: {
        apikey: import.meta.env.VITE_APP_API_KEY,
        s,
        page,
      },
    });

    if (response.data.Response === "False") {
      throw new Error(response.data.Error || "검색에 실패했습니다.");
    }

    return response.data as SearchResponse;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data || error.message);
    } else {
      console.error("Unexpected error:", error);
    }
    throw new Error("검색에 실패했습니다. 다시 시도해 주세요.");
  }
}
