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

export async function getMovies() {
    return (
      await fetch(
        `${BASE_PATH}/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1&region=kr`
      )
    ).json();
}