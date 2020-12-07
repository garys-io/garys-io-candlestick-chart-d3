import React, { useEffect, useRef } from 'react'
import { select, scaleTime, scaleLinear, min, max, axisBottom, axisLeft } from 'd3'

import { parsed1minData, YEAR, MONTH, DAY } from './dataTransformer'

function App() {
    const svgRef = useRef()

    const data = parsed1minData
    const width = 1920
    const height = 1080
    const margin = 50
    const candleWidth = (0.42 * (width - 2 * margin)) / data.length

    useEffect(() => {
        const svg = select(svgRef.current).attr('viewBox', [0, 0, width, height])

        const x = scaleTime()
            .domain([new Date(YEAR, MONTH, DAY, 9, 30), new Date(YEAR, MONTH, DAY, 16, 0)])
            .range([0, width - 2 * margin])

        const y = scaleLinear()
            .domain([min(data.map(x => x.low)), max(data.map(x => x.high))])
            .range([0, height - 2 * margin])

        const xAxis = axisBottom(x)
        const yAxis = axisLeft(y)

        svg.append('g')
            .call(xAxis)
            .attr('transform', `translate(${margin}, ${height - margin})`)

        svg.append('g')
            .call(yAxis)
            .attr('transform', `translate(${margin}, ${margin})`)

        const g = svg
            .append('g')
            .attr('stroke', 'black')
            .selectAll('g')
            .data(data)
            .join('g')
            .attr('transform', d => `translate(${x(d.time) + margin}, ${margin})`)

        g.append('line')
            .attr('y1', d => y(d.low))
            .attr('y2', d => y(d.high))

        g.append('line')
            .attr('y1', d => y(d.open))
            .attr('y2', d => y(d.close))
            .attr('stroke-width', candleWidth)
            .attr('stroke', d => (d.open > d.close ? 'red' : 'green'))
    }, [])

    return (
        <>
            <svg ref={svgRef} width={width} height={height}></svg>
        </>
    )
}

export default App
