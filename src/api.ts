import { TvTypes, Types } from "./enums";

const API_KEY = "f96c0986771492bbe7f15346dc8aae25"
const BASE_PATH = "https://api.themoviedb.org/3";

export interface IGetMoviesResult {
    dates: {
        maximum: string,
        minimum: string
        },
        page: number,
        results: IMovie[],
        total_pages: number;
        total_results: number;
}

export interface IMovie {
    adult: boolean,
    backdrop_path: string,
    genre_ids: [
    number,
    number,
    number
    ],
    id: number,
    original_language: string,
    original_title: string,
    overview: string,
    popularity: number,
    poster_path: string,
    release_date: string,
    title: string,
    video: boolean,
    vote_average: number,
    vote_count: number
}

export interface ITvShowsResult {
  page:number;
  results: ITvShow[];
  total_pages: number;
  total_results: number;
}

export interface ITvShow {
    backdrop_path: string,
    first_air_date: string,
    genre_ids: [
    number,
    number,
    number
    ],
    id: number,
    name: string,
    origin_country: [
      string
    ],
    original_language: string,
    original_name: string,
    overview: string,
    popularity: number,
    poster_path: string,
    vote_average: number,
    vote_count: number
}

export interface IGetMovieDetail {
  adult: boolean;
  backdrop_path: string;
  budget: number;
  genres: [
    {
      id: number;
      name: string;
    }
  ];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  runtime: number;
  title: string;
}

export interface IGetTvShowDetail {
  adult: boolean;
  backdrop_path: string;
  budget: number;
  genres: [
    {
      id: number;
      name: string;
    }
  ];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  runtime: number;
  title: string;
}

export async function getMovies(type: Types) {
    return (
      await fetch(
        `${BASE_PATH}/movie/${type}?api_key=${API_KEY}&language=en-US&page=1&region=kr`
      )
    ).json();
}

export async function getTvShows(type: TvTypes) {
  return (
    await fetch(
      `${BASE_PATH}/tv/${type}?api_key=${API_KEY}&language=en-US&page=1`
    )
  ).json();
}

export async function getSearchResult({category, keyword}:{category:string, keyword:string|null}) {
  return (
    await fetch(
      `
      ${BASE_PATH}/search/${category}?api_key=${API_KEY}&language=en-US&query=${keyword}&page=1&include_adult=false
      `
    )
  ).json();
}

export async function getMovieDetail(movieId: string | undefined) {
  return (
    await fetch(
      `${BASE_PATH}/movie/${movieId}?api_key=${API_KEY}&language=en-US`
    )
  ).json();
}

export async function getTvShowDetail(tvId: string | undefined) {
  return (
    await fetch(
      `${BASE_PATH}/tv/${tvId}?api_key=${API_KEY}&language=en-US`
    )
  ).json();
}


