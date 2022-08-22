import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import MovieSearch from "../Components/MovieSearch";
import { TvSearch } from "../Components/TvSearch";
import { Category } from "../enums";

export const Banner = styled.div`
  height: 20vh;
  padding: 60px;
  margin-top: 68px;
  display: flex;
  align-items: center;
  span{
    font-size: 30px;
    font-weight: 600;
  }
`;

function Search() {
    const location = useLocation();
    const srcParams = new URLSearchParams(location.search);
    const keyword = srcParams.get("keyword");
    const [cat, setCat] = useState(srcParams.get("category") === "movies");
    const navigate = useNavigate();
    console.log(cat)

    return (
        <>
            <Banner>
                <span>
                    Keyword: {keyword}
                </span>
            </Banner>
            <MovieSearch type={Category.movie}></MovieSearch>
            <TvSearch type={Category.tv}></TvSearch>
        </>
    )
}

export default Search;