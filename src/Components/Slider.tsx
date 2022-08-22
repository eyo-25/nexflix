import { AnimatePresence, motion } from "framer-motion"
import { useState } from "react"
import styled from "styled-components"

const SliderMenu = styled.div`
    position: relative;
`

const Row = styled(motion.div)`
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 10px;
    margin-bottom: 5px;
    width: 100%;
    position: absolute;
`

const Box = styled.div`
    background-color: white;
    height: 200px;
`


export function Slider() {
    const [index, setIndex] = useState(0)
    const increaseIndex = setIndex(prev => prev + 1)
    return (
        <>
            <SliderMenu>
                <AnimatePresence>
                    <Row>
                        <Box/>
                        <Box/>
                        <Box/>
                        <Box/>
                        <Box/>
                        <Box/>
                    </Row>
                </AnimatePresence>
            </SliderMenu>
        </>
    )
}