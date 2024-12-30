import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MagnifyingGlassIcon, StarIcon } from "@heroicons/react/24/outline";
import SearchTab from "@/components/home/SearchTab";
import FavoriteTab from "@/components/home/FavoriteTab";

import type {
  Movie,
} from "@/types/movie";

function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);

  return (
    <Tabs defaultValue="search">
      <TabsContent className="m-auto w-full max-w-[1024px]" value="search">
        <SearchTab movies={movies} setMovies={setMovies} />
      </TabsContent>
      <TabsContent className="m-auto w-full max-w-[1024px]" value="favorite">
        <FavoriteTab />
      </TabsContent>
      <TabsList className="fixed bottom-0 left-1/2 transform -translate-x-1/2 flex w-full max-w-[1024px]">
        <TabsTrigger value="search" className="flex-1">
          <MagnifyingGlassIcon className="w-[24px] h-[24px]" />
        </TabsTrigger>
        <TabsTrigger value="favorite" className="flex-1">
          <StarIcon className="w-[24px] h-[24px]" />
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

export default Home;
