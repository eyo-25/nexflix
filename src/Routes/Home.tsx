import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import { getMovies, IGetMoviesResult } from "../api";
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
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgphoto});
  background-size: cover;
`;

export const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px; ;
`;

export const Overview = styled.p`
  font-size: 30px;
  width: 50%;
`;

export function Home() {
  const { isLoading, data } = useQuery<IGetMoviesResult>(["movies", "nowPlaying"], getMovies)
    return(
      <Wrapper>
        { isLoading ? (
        <Loader>Loadding...</Loader>
        ) : (
            <>
                <Banner bgphoto={makeImagePath(data?.results[0].backdrop_path || "")}>
                    <Title>{data?.results[0].title}</Title>
                    <Overview>{data?.results[0].overview}</Overview>
                </Banner>
            </>
        )}
      </Wrapper>
    )
}

// <Banner bgphoto={makeImagePath(data?.results[0].backdrop_path || "")}> 에서 data? || "" data가 들어오지 않으면 빈 string을 반환하도록한다.