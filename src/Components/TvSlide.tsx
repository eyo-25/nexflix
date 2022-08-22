import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getTvShows, ITvShowsResult, } from "../api";
import { TvTypes } from "../enums";
import { makeImagePath, useWindowDimensions } from "../utiles";
import { Before, BigCover, BigMovie, BigOverview, BigTitle, Box, BoxVariants, Info, infovariants, Next, Overlay, Row, rowVariants, SliderContainer, SliderTitle, SliderWrapper } from "./Slider";

const offset = 6;

export function TvSlider({type}:{type:TvTypes}) {
    const { data } = useQuery<ITvShowsResult>(["TvShows", type], ()=>getTvShows(type))
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
    const bigTvShowMatch = useMatch(`/tvs/${type}/:tvId`)
    const clickedTvshow = bigTvShowMatch?.params.tvId && data?.results.find(movie => movie.id + "" === bigTvShowMatch?.params.tvId)
    console.log(clickedTvshow)
    const onBoxClicked = (tvId:number) => {
      navigate(`/tvs/${type}/${tvId}`)
    }
    const onOverlayClicked = () => {
      navigate(`/tvs`)
    }
    const width = useWindowDimensions();
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
                    {data?.results.slice(1).slice(offset*index, offset*index+offset).map((tv, i) =>
                        <Box
                        layoutId={type + tv.id}
                        onClick={()=> onBoxClicked(tv.id)}
                        variants={BoxVariants}
                        initial="normal"
                        whileHover="hover"
                        transition={{type:"tween"}}
                        bgphoto={makeImagePath(tv.backdrop_path || tv.poster_path, "w500")}
                        key={type + tv.id}>
                            <Info variants={infovariants}>
                            <h4>{tv.name}</h4>
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
        { bigTvShowMatch?
                  <>
                        <Overlay
                            onClick={onOverlayClicked}
                            exit={{opacity: 0}}
                            animate={{opacity: 1}}>
                        </Overlay>
                        <BigMovie
                            layoutId={type + bigTvShowMatch.params.tvId}
                            style={{ top: scrollY.get() + 100 }}
                        >
                            {clickedTvshow && <>
                                <BigCover
                                style={{
                                    backgroundImage: `linear-gradient(to top, black, transparent),
                                        url(${makeImagePath(clickedTvshow.backdrop_path || clickedTvshow.poster_path,"w500")})
                                        `
                                    }}
                                />
                                <BigTitle>{clickedTvshow.name}</BigTitle>
                                <BigOverview>
                                  <h4>Summary</h4>
                                  {clickedTvshow.overview}
                                </BigOverview>
                            </>}
                        </BigMovie>
                  </>
                : null }
        </AnimatePresence>
      </>
    )
}