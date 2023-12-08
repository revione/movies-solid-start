import { Show } from "solid-js";
import { createRouteData, useRouteData } from "solid-start";
import Hero from "~/components/Hero";
import { ListingCarousel } from "~/components/ListingCarousel";
import {
  getListItem,
  getMovie,
  getTrending,
  getTvShow,
} from "~/services/tmdbAPI";

interface Movie {
  adult: boolean;
  backdrop_path: string; // "/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg";
  id: number; // 872585;
  title: string; // "Oppenheimer";
  original_language: string; // "en";
  original_title: string; // "Oppenheimer";
  overview: string; // "The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II.";
  poster_path: string; // "/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg";
  media_type: string; // "movie";
  genre_ids: any[];
  popularity: number; // 1142.284;
  release_date: string; // "2023-07-19";
  video: boolean; // false;
  vote_average: number; // 8.154;
  vote_count: number; // 5071;
}

interface TV {
  adult: false;
  backdrop_path: string; // "/fUfz4YPuhzc9qHinkopY6DuBCm3.jpg";
  id: number; // 95480;
  name: string; // "Slow Horses";
  original_language: string; // "en";
  original_name: string; // "Slow Horses";
  overview: string; // "This quick-witted spy drama follows a dysfunctional team of MI5 agents—and their obnoxious boss, the notorious Jackson Lamb—as they navigate the espionage world’s smoke and mirrors to defend England from sinister forces.";
  poster_path: string; // "/vJI9OcHFHxDy6ZeEmXfM5zhApXV.jpg";
  media_type: string; // "tv";
  genre_ids: any[]; // [Array];
  popularity: number; // 398.208;
  first_air_date: string; // 2022-04-01";
  vote_average: number; // 7.748;
  vote_count: number; // 250;
  origin_country: any; // [Array];
}

interface DataMovies {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

interface DataTV {
  page: number;
  results: TV[];
  total_pages: number;
  total_results: number;
}

export function routeData() {
  return createRouteData(async () => {
    try {
      const trendingMovies: DataMovies = await getTrending("movie");
      const trendingTv: DataTV = await getTrending("tv");
      let featured;

      // feature a random item from movies or tv
      const items = [...trendingMovies.results, ...trendingTv.results];
      const randomItem = items[Math.floor(Math.random() * items.length)];
      const media = "title" in randomItem ? "movie" : "tv";

      if (media === "movie") featured = await getMovie(randomItem.id);
      else featured = await getTvShow(randomItem.id);

      return {
        trendingMovies,
        trendingTv,
        featured,
      };
    } catch {
      throw new Error("Data not available");
    }
  });
}

export default function Page() {
  const data = useRouteData<typeof routeData>();
  return (
    <main class="main" $ServerOnly>
      <Show when={data()}>
        <Hero item={data()?.featured} />
        <ListingCarousel
          items={data()?.trendingMovies.results}
          viewAllHref={`/movie/categories/trending`}
          title={getListItem("movie", "trending").TITLE}
        />
        <ListingCarousel
          items={data()?.trendingTv.results}
          viewAllHref={`/tv/categories/trending`}
          title={getListItem("tv", "trending").TITLE}
        />
      </Show>
      {/* <Show when={trendingMoviesShown}></Show> */}
    </main>
  );
}
