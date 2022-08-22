import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import { getMovies, IGetMoviesResult } from "../api";
import { MovieSlider } from "../Components/Slider";
import { Types } from "../enums";
import { makeImagePath } from "../utiles";

export const Wrapper = styled.div`
  background: black;
`;

export const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Banner = styled.div<{ bgphoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgphoto});
  background-size: cover;
`;

export const Title = styled.h2`
  font-size: 60px;
  margin-bottom: 20px;
  font-weight: 400;
`;

export const Overview = styled.p`
  font-size: 20px;
  width: 65%;
`;

export function Home() {
  const { isLoading, data } = useQuery<IGetMoviesResult>(["movies", "nowPlaying"], ()=>getMovies(Types.now_playing))

    return(
      <>
        <Wrapper>
          { isLoading ? (
            <Loader>Loadding...</Loader>
          ) : (
              <>
                <Banner bgphoto={makeImagePath(data?.results[0].backdrop_path || "")}>
                    <Title>{data?.results[0].title}</Title>
                    <Overview>{data?.results[0].overview}</Overview>
                </Banner>
                <MovieSlider type={Types.now_playing}/>
                <MovieSlider type={Types.popular}/>
                <MovieSlider type={Types.top_rated}/>
                <MovieSlider type={Types.upcoming}/>
              </>
          )}
        </Wrapper>
      </>
    )
}