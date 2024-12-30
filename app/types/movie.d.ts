export interface Movie {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

export interface SearchResponseSuccess {
  Search: Movie[];
  totalResults: number;
  Response: "True"; // 성공적인 응답의 경우 "True"
}

export interface SearchResponseError {
  Response: "False"; // 실패 응답의 경우 "False"
  Error: string; // 에러 메시지, 예: "Movie not found!"
}

export type SearchResponse = SearchResponseSuccess | SearchResponseError;