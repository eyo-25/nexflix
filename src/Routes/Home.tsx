import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { url } from "inspector";
import { useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getMovies, IGetMoviesResult } from "../api";
import { Slider } from "../Components/Slider";
import { makeImagePath, useWindowDimensions } from "../utiles";

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

const SliderMenu = styled.div`
    position: relative;
    top: -150px;
`

const Row = styled(motion.div)`
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 10px;
    width: 100%;
    position: absolute;
`

const Box = styled(motion.div)<{ bgphoto: string }>`
    background-color: white;
    height: 200px;
    font-size: 66px;
    background-size: cover;
    background-position: center center;
    background-image: url(${(props) => props.bgphoto});
    position: relative;
    cursor: pointer;
    margin-bottom: 100px;
    &:first-child {
        transform-origin: center left;
    }
    &:last-child {
        transform-origin: center right;
    }
`

const Info = styled(motion.div)`
    padding: 10px;
    background-color: ${(props) => props.theme.black.darker};
    opacity: 0;
    position: absolute;
    width: 100%;
    bottom: 0;
    h4 {
        text-align: center;
        font-size: 18px;
        font-weight: 600;
    }
`

const rowVariants = {
  hidden: (width:number)=>({
      x: width + 5,
  }),
  visible: {
    x: 0,
  },
  exit: (width:number)=>({
    x: -width - 5,
}),
};
// user의 화면크기 = window.outerWidth 마지막에 +10 -10은 row끼리의 간격을 잡기위해서이다

const BoxVariants = {
  normal:{
    scale: 1,
  },
  hover:{
    zIndex: 99,
    scale: 1.3,
    transition: {
      delay: 0.5,
      duration: 0.3
    }
  }
}

// hover에만 transition을 주어야 hover동작시에만 delay가 들어가고 다른 동작에 delay가 걸리지않는다

export const infovariants = {
  hover:{
    opacity: 1,
    trasition: {
      delay: 0.5,
      duration: 0.3,
      type: "tween",
    }
  }
}

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  z-index: 12;
  background-color: ${props=>props.theme.black.lighter};
  border-radius: 10px;
  overflow: hidden;
`;

export const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  z-index: 11;
`

export const BigCover = styled.div`
  width: 100%;
  height: 400px;
  background-size: cover;
  background-position: center center;
  position: relative;
`

export const BigTitle = styled.h3`
  padding: 20px;
  position: relative;
  top: -70px;
  font-weight: 700;
  font-size: 30px;
  color: ${(props) => props.theme.white.lighter};
`
export const BigOverview = styled.p`
  position: relative;
  top: -70px;
  padding: 20px;
  color: ${(props) => props.theme.white.lighter};
`

const offset = 6;

export function Home() {
  const { isLoading, data } = useQuery<IGetMoviesResult>(["movies", "nowPlaying"], getMovies)
  const [index, setIndex] = useState(0)
  const [leaving, setLeaving] =useState(false)
  const toggleLeaving = ()=>setLeaving(prev=>!prev)
  const navigate = useNavigate()
  const increaseIndex = ()=>{
    if(data) {
      if(leaving) return;
      toggleLeaving()
      const totalMovies = data.results.length - 1
      const maxIndex = Math.floor(totalMovies / offset) - 1
      setIndex(prev => prev === maxIndex ? 0 : prev + 1)
    }
  }
  const bigMovieMatch = useMatch("/movies/:movieId")
  const clickedMovie = bigMovieMatch?.params.movieId && data?.results.find(movie => movie.id + "" === bigMovieMatch?.params.movieId)
  // data에서 bigMovie로 클릭한 movieid와 동일한 정보를 다 불러온다
  console.log(clickedMovie)
  const onBoxClicked = (movieId:number) => {
    navigate(`/movies/${movieId}`)
  }
  const onOverlayClicked = () => {
    navigate(`/`)
  }
  const width = useWindowDimensions();
  // if(leaving) return; 슬라이더 버튼을 눌렀을때 setLeaving(true)가 되어 한번더 누르는걸 방지한다.
  // 또한 <AnimatePresence onExitComplete={()=>setLeaving(false)}>으로 애니메이션(슬라이드)이 끝났을때 초기화
  // <AnimatePresence initial={false} 사용시 페이지 로드시 애니메이션(initial)이 발생되지않는다
  const {scrollY} = useScroll()
    return(
      <>
        <Wrapper>
          { isLoading ? (
            <Loader>Loadding...</Loader>
          ) : (
              <>
                <Banner onClick={increaseIndex} bgphoto={makeImagePath(data?.results[0].backdrop_path || "")}>
                    <Title>{data?.results[0].title}</Title>
                    <Overview>{data?.results[0].overview}</Overview>
                </Banner>
                <SliderMenu>
                  <AnimatePresence custom={width} initial={false} onExitComplete={toggleLeaving}>
                        <Row
                          custom={width} 
                          transition={{type:"tween", duration: 1}}
                          variants={rowVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          key={index}
                        >
                          {data?.results.slice(1).slice(offset*index, offset*index+offset).map((movie, i) =>
                            <Box
                              layoutId={movie.id + ""}
                              onClick={()=> onBoxClicked(movie.id)}
                              variants={BoxVariants}
                              initial="normal"
                              whileHover="hover"
                              transition={{type:"tween"}}
                              bgphoto={makeImagePath(movie.backdrop_path || movie.backdrop_path, "w500")}
                              key={movie.id}>
                                <Info variants={infovariants}>
                                  <h4>{movie.title}</h4>
                                </Info>
                            </Box>
                          )}
                        </Row>
                    </AnimatePresence>
                </SliderMenu>
              </>
          )}
        </Wrapper>
        <AnimatePresence>
          {bigMovieMatch ? (
            <>
              <Overlay
                onClick={onOverlayClicked}
                exit={{opacity: 0}}
                animate={{opacity: 1}}
              ></Overlay>
              <BigMovie
                layoutId={bigMovieMatch.params.movieId}
                style={{top: scrollY.get() + 100}}
              >
                {clickedMovie &&(
                  <>
                    <BigCover
                      style={{
                        backgroundImage:`linear-gradient(to top, black, transparent),
                        url(${makeImagePath(clickedMovie.backdrop_path || clickedMovie.backdrop_path, "w500")})`
                      }}
                    />
                    <BigTitle>{clickedMovie.title}</BigTitle>
                    <BigOverview>{clickedMovie.overview}</BigOverview>
                  </>
                )}
              </BigMovie>
            </>
          ): null}
        </AnimatePresence>
      </>
    )
}

// <Banner bgphoto={makeImagePath(data?.results[0].backdrop_path || "")}> 에서 data? || "" data가 들어오지 않으면 빈 string을 반환하도록한다.