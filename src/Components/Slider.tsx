import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getMovieDetail, getMovies, IGetMovieDetail, IGetMoviesResult } from "../api";
import { Types } from "../enums";
import { makeImagePath, useWindowDimensions } from "../utiles";

export const SliderTitle = styled.h4`
    text-transform: uppercase;
    font-size: 30px;
    font-weight: 700;
    margin-bottom: 25px;
`

export const SliderWrapper = styled.div`
    padding: 0 60px 40px 60px;
`

export const SliderContainer = styled.div`
    position: relative;
    top: -200px;
    height: 300px;
    margin-bottom: 20px;
    width: 100%;
    overflow-y: hidden;
    -ms-overflow-style: none;
    &::-webkit-scrollbar{
      display:none;
    }
`

export const Row = styled(motion.div)`
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 10px;
    width: 100%;
    position: absolute;
`

export const Box = styled(motion.div)<{ bgphoto: string }>`
    background-color: white;
    height: 200px;
    font-size: 66px;
    background-size: cover;
    background-position: center center;
    background-image: url(${(props) => props.bgphoto});
    position: relative;
    cursor: pointer;
    &:first-child {
        transform-origin: center left;
    }
    &:last-child {
        transform-origin: center right;
    }
`

export const Info = styled(motion.div)`
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

export const rowVariants = {
  hidden: ({width, clickReverse}:{width:number, clickReverse:boolean})=>({
      x: clickReverse ? -width - 5 : width + 5,
  }),
  visible: {
    x: 0,
  },
  exit: ({width, clickReverse}:{width:number, clickReverse:boolean})=>({
    x: clickReverse ? width + 5 : -width - 5,
}),
};
// user의 화면크기 = window.outerWidth 마지막에 +10 -10은 row끼리의 간격을 잡기위해서이다

export const BoxVariants = {
  normal:{
    scale: 1,
  },
  hover:{
    y:-35,
    zIndex: 99,
    scale: 1.3,
    transition: {
      delay: 0.5,
      duration: 0.4
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

export const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  z-index: 11;
`

export const BigMovie = styled(motion.div)`
  position: absolute;
  width: 600px;
  height: 70vh;
  left: 0;
  right: 0;
  margin:0 auto;
  background-color:${props => props.theme.black.darker};
  border-radius: 10px;
  overflow: hidden;
  z-index: 12;
`

export const BigCover = styled.div`
  width: 100%;
  height: 300px;
  background-size: cover;
  background-position: center center;
  position: relative;
`

export const BigTitle = styled.h3`
  padding: 20px 25px;
  position: relative;
  top: -75px;
  font-weight: 400;
  font-size: 30px;
  color: ${(props) => props.theme.white.lighter};
`
export const BigOverview = styled.p`
  position: relative;
  top: -70px;
  padding: 20px 25px;
  color: ${(props) => props.theme.white.lighter};
  h4{
    font-weight: 500;
    margin-bottom: 10px;
    font-size: 20px;
  }
`

export const Before = styled(motion.div)`
    height: 200px;
    position: absolute;
    z-index: 2;
    display: flex;
    align-items: center;
    padding: 0 25px;
    background: linear-gradient(to right, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0));
    svg{
        width: 20px;
        cursor: pointer;
    }
`

export const Next = styled(motion.div)`
    height: 200px;
    position: absolute;
    right: 0;
    z-index: 2;
    display: flex;
    align-items: center;
    padding: 0 25px;
    background: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1));
    svg{
        width: 20px;
        cursor: pointer;
    }
`

export const BigBottom = styled.div`
    position: absolute;
    bottom: 0;
    padding: 25px;
    font-weight: 400;
    font-size: 20px;
    color: rgb(255, 72, 72);
    span{
        margin: 4px;
        color: ${(props) => props.theme.white.lighter};
        text-transform: uppercase;
    }
`

export const BigLang = styled.p`
    p{
        color: ${(props) => props.theme.white.lighter};
        text-transform: uppercase;
    }
`

export const BigGenres = styled.p`

`

const offset = 6;

export function MovieSlider({type}:{type:Types}) {
    const { data } = useQuery<IGetMoviesResult>(["movies", type], ()=>getMovies(type))
    const [index, setIndex] = useState(0)
    const [leaving, setLeaving] =useState(false)
    const toggleLeaving = ()=>setLeaving(prev=>!prev)
    const navigate = useNavigate()
    const [clickReverse, setClickReverse] = useState(false)
    const bigMovieMatch = useMatch(`/movies/${type}/:movieId`)
    const {data:detailData, isLoading:detailLoding} = useQuery<IGetMovieDetail>([bigMovieMatch?.params.movieId, "detail"], ()=>getMovieDetail(bigMovieMatch?.params.movieId))
    const nextSlide = ()=>{
      if(data) {
        if(leaving) return;
        setClickReverse(false)
        toggleLeaving()
        const totalMovies = data.results.length - 1
        const maxIndex = Math.floor(totalMovies / offset) - 1
        setIndex(prev => prev === maxIndex ? 0 : prev + 1)
      }
    }
    const prevSlide = ()=>{
        if(data) {
          if(leaving) return;
          setClickReverse(true)
          toggleLeaving()
          const totalMovies = data.results.length - 1
          const maxIndex = Math.floor(totalMovies / offset) - 1
          setIndex(prev => prev === 0 ? maxIndex : prev - 1)
        }
      }
    const clickedMovie = bigMovieMatch?.params.movieId && data?.results.find(movie => movie.id + "" === bigMovieMatch?.params.movieId)
    // data에서 bigMovie로 클릭한 movieid와 동일한 정보를 다 불러온다
    console.log(clickedMovie)
    const onBoxClicked = (movieId:number) => {
      navigate(`/movies/${type}/${movieId}`)
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
        <SliderWrapper>
            <SliderContainer>
                <SliderTitle>{type}</SliderTitle>
                <AnimatePresence custom={{width, clickReverse}} initial={false} onExitComplete={toggleLeaving}>
                    <Row
                    custom={{width, clickReverse}} 
                    transition={{type:"tween", duration: 1}}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    key={index}
                    >
                    {data?.results.slice(1).slice(offset*index, offset*index+offset).map((movie, i) =>
                        <Box
                        layoutId={type + movie.id}
                        onClick={()=> onBoxClicked(movie.id)}
                        variants={BoxVariants}
                        initial="normal"
                        whileHover="hover"
                        transition={{type:"tween"}}
                        bgphoto={makeImagePath(movie.backdrop_path || movie.poster_path, "w500")}
                        key={type + movie.id}>
                            <Info variants={infovariants}>
                            <h4>{movie.title}</h4>
                            </Info>
                        </Box>
                    )}
                    </Row>
                </AnimatePresence>
                <Before onClick={prevSlide}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 256 512"
                        fill="currentColor"
                    >
                        <path d="M137.4 406.6l-128-127.1C3.125 272.4 0 264.2 0 255.1s3.125-16.38 9.375-22.63l128-127.1c9.156-9.156 22.91-11.9 34.88-6.943S192 115.1 192 128v255.1c0 12.94-7.781 24.62-19.75 29.58S146.5 415.8 137.4 406.6z" />
                    </svg>
                </Before>
                <Next onClick={nextSlide}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 256 512"
                        fill="currentColor"
                    >
                        <path d="M118.6 105.4l128 127.1C252.9 239.6 256 247.8 256 255.1s-3.125 16.38-9.375 22.63l-128 127.1c-9.156 9.156-22.91 11.9-34.88 6.943S64 396.9 64 383.1V128c0-12.94 7.781-24.62 19.75-29.58S109.5 96.23 118.6 105.4z" />
                    </svg>
                </Next>
            </SliderContainer>
        </SliderWrapper>
        <AnimatePresence >
        { bigMovieMatch?
                  <>
                        <Overlay
                            onClick={onOverlayClicked}
                            exit={{opacity: 0}}
                            animate={{opacity: 1}}>
                        </Overlay>
                        <BigMovie
                            layoutId={type + bigMovieMatch.params.movieId}
                            style={{ top: scrollY.get() + 100 }}
                        >
                            {clickedMovie && <>
                                <BigCover
                                style={{
                                    backgroundImage: `linear-gradient(to top, black, transparent),
                                        url(${makeImagePath(clickedMovie.backdrop_path || clickedMovie.poster_path,"w500")})
                                        `
                                    }}
                                />
                                <BigTitle>{clickedMovie.title}</BigTitle>
                                <BigOverview>
                                  <h4>Summary</h4>
                                  {clickedMovie.overview}
                                </BigOverview>
                                <BigBottom>
                                    Realesa <span>
                                    {new Date(clickedMovie?.release_date).getFullYear()}
                                    </span>
                                    <BigGenres>Genres {detailData?.genres.map((genres)=>
                                            <span>{genres.name}</span>
                                        )}
                                    </BigGenres>
                                    <BigLang>Language <span>{clickedMovie.original_language}</span></BigLang>
                                </BigBottom>
                            </>}
                        </BigMovie>
                  </>
                : null }
        </AnimatePresence>
      </>
    )
}

// <Banner bgphoto={makeImagePath(data?.results[0].backdrop_path || "")}> 에서 data? || "" data가 들어오지 않으면 빈 string을 반환하도록한다.