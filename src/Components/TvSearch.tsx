import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion, useScroll } from "framer-motion"
import { useState } from "react";
import { useLocation, useMatch, useNavigate } from "react-router-dom"
import { getSearchResult, IGetMoviesResult, ITvShowsResult } from "../api";
import { Before, BigCover, BigMovie, BigOverview, BigTitle, Box, BoxVariants, Info, infovariants, Next, Overlay, Row, rowVariants, SliderTitle } from "../Components/Slider"
import { makeImagePath, useWindowDimensions } from "../utiles";
import { SliderContainer, SliderWrapper, TemplateBox } from "./MovieSearch";

const offset = 6;

export function TvSearch({type}:{type:string}) {
    const location = useLocation()
    const keyword = new URLSearchParams(location.search).get("keyword")
    const { data } = useQuery<ITvShowsResult>(["searchtvshow", 1], ()=>getSearchResult({category: "tv", keyword: keyword}))
    console.log(data)
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
        const totalTvs = data.results.length - 1
        const maxIndex = Math.ceil(totalTvs / offset) - 1
        setIndex(prev => prev === maxIndex ? 0 : prev + 1)
      }
    }
    const prevSlide = ()=>{
        if(data) {
          if(leaving) return;
          setClickReverse(true)
          toggleLeaving()
          const totalTvs = data.results.length - 1
          const maxIndex = Math.ceil(totalTvs / offset) - 1
          setIndex(prev => prev === 0 ? maxIndex : prev - 1)
        }
      }
    const bigTvMatch = useMatch(`/search/${type}/:tvId`);

    const clickedTv = (bigTvMatch?.params.tvId&&
        data?.results.find((Tv) => Tv.id + "" === bigTvMatch?.params.tvId));
    console.log(clickedTv)
    const onBoxClicked = (tvId:number) => {
        navigate(`/search/${type}/${tvId}/?keyword=${keyword}`)
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
                <SliderTitle>Tv Shows</SliderTitle>
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
                        {data?.results.slice(offset*index, offset*index+offset).map((Tv) =>
                            <Box
                            layoutId={type + Tv.id}
                            onClick={()=> onBoxClicked(Tv.id)}
                            variants={BoxVariants}
                            initial="normal"
                            whileHover="hover"
                            transition={{type:"tween"}}
                            bgphoto={makeImagePath(Tv.backdrop_path || Tv.poster_path, "w500")}
                            key={type + Tv.id}>
                                <Info variants={infovariants}>
                                <h4>{Tv.name}</h4>
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
        { bigTvMatch?
                  <>
                        <Overlay
                            onClick={onOverlayClicked}
                            exit={{opacity: 0}}
                            animate={{opacity: 1}}>
                        </Overlay>
                        <BigMovie
                            layoutId={type + bigTvMatch.params.tvId}
                            style={{ top: scrollY.get() + 100 }}
                        >
                            {clickedTv && <>
                                <BigCover
                                style={{
                                    backgroundImage: `linear-gradient(to top, black, transparent),
                                        url(${makeImagePath(clickedTv.backdrop_path || clickedTv.poster_path,"w500")})
                                        `
                                    }}
                                />
                                <BigTitle>{clickedTv.name}</BigTitle>
                                <BigOverview>
                                  <h4>Summary</h4>
                                  {clickedTv.overview}
                                </BigOverview>
                                
                            </>}
                        </BigMovie>
                  </>
                : null }
        </AnimatePresence>
      </>
    )
}