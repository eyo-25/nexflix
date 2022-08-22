import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion, useScroll } from "framer-motion"
import { useState } from "react";
import { useLocation, useMatch, useNavigate } from "react-router-dom"
import styled from "styled-components"
import { getMovieDetail, getSearchResult, IGetMovieDetail, IGetMoviesResult } from "../api";
import { Before, BigBottom, BigCover, BigGenres, BigLang, BigMovie, BigOverview, BigTitle, Box, BoxVariants, Info, infovariants, Next, Overlay, Row, rowVariants, SliderTitle } from "../Components/Slider"
import { makeImagePath, useWindowDimensions } from "../utiles";

const offset = 6;

export const SliderWrapper = styled.div`
    display: flex;
    height:600px;
    width: 100%;
    padding: 20px 60px;
    position: relative;
`

export const TemplateBox = styled(motion.div)`
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 10px;
    width: 100%;
    position: absolute;
`;

export const SliderContainer = styled.div`
    position: relative;
    height: 300px;
    margin-bottom: 20px;
    width: 100%;
    overflow-y: hidden;
    -ms-overflow-style: none;
    &::-webkit-scrollbar{
      display:none;
    }
`


function MovieSearch({type}:{type:string}) {
    const location = useLocation()
    const keyword = new URLSearchParams(location.search).get("keyword")
    const bigMovieMatch = useMatch(`/search/${type}/:movieId`);
    const { isLoading, data } = useQuery<IGetMoviesResult>(["searchmovies", 1], ()=>getSearchResult({category: "movie", keyword: keyword}))
    const {data:detailData, isLoading:detailLoding} = useQuery<IGetMovieDetail>([bigMovieMatch?.params.movieId, "detail"], ()=>getMovieDetail(bigMovieMatch?.params.movieId))
    const [index, setIndex] = useState(0)
    const [leaving, setLeaving] =useState(false)
    const toggleLeaving = ()=>setLeaving(prev=>!prev)
    const navigate = useNavigate()
    const [clickReverse, setClickReverse] = useState(false)
    const nextSlide = ()=>{
      if(data) {
        if(leaving) return;
        setClickReverse(false)
        toggleLeaving()
        const totalMovies = data.results.length - 1
        const maxIndex = Math.ceil(totalMovies / offset) - 1
        setIndex(prev => prev === maxIndex ? 0 : prev + 1)
      }
    }
    const prevSlide = ()=>{
        if(data) {
          if(leaving) return;
          setClickReverse(true)
          toggleLeaving()
          const totalMovies = data.results.length - 1
          const maxIndex = Math.ceil(totalMovies / offset) - 1
          setIndex(prev => prev === 0 ? maxIndex : prev - 1)
        }
      }

    const clickedMovie = (bigMovieMatch?.params.movieId&&
        data?.results.find((movie) => movie.id + "" === bigMovieMatch?.params.movieId));
    console.log(clickedMovie)
    const onBoxClicked = (movieId:number) => {
        navigate(`/search/${type}/${movieId}/?keyword=${keyword}`)
    }
    const onOverlayClicked = () => {
      navigate(-1)
    }
    const width = useWindowDimensions();
    const {scrollY} = useScroll()

    return(
      <>
        <SliderWrapper>
            <SliderContainer>
                <SliderTitle>Movies</SliderTitle>
                <AnimatePresence custom={{width, clickReverse}} initial={false} onExitComplete={toggleLeaving}>
                    <TemplateBox
                    custom={{width, clickReverse}} 
                    transition={{type:"tween", duration: 1}}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    key={index}
                    >
                        {data?.results.slice(offset*index, offset*index+offset).map((movie) =>
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
                    </TemplateBox>
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

export default MovieSearch;