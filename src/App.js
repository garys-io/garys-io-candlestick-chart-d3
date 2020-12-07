import React, { useEffect, useRef } from 'react'
import { select } from 'd3'

import { parsed1minData } from './dataTransformer'

function App() {
    // console.log(parsed1minData)
    const svgRef = useRef()

    useEffect(() => {
        const svg = select(svgRef.current)
    }, [])

    return (
        <div>
            <svg ref={svgRef}></svg>
        </div>
    )
}

export default App
