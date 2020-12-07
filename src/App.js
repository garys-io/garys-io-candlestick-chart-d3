import React, { useEffect, useRef, useState } from 'react'
import { select, scaleTime, scaleLinear, min, max, axisBottom, axisLeft } from 'd3'

import { timedelta, YEAR, MONTH, DAY } from './dataTransformer'

const defaultInterval = '1 minute'

function App() {
    const svgRef = useRef()

    const [interval, setInterval] = useState(defaultInterval)

    const data = timedelta[interval]
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
            .range([height - 2 * margin, 0])

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
    }, [data, candleWidth])

    return (
        <>
            <svg ref={svgRef} width={width} height={height}></svg>
            <div>
                <label htmlFor="timedelta">Choose Timedelata:</label>
                <select
                    id="timedelta"
                    onChange={e => setInterval(e.target.value)}
                    defaultValue={defaultInterval}
                >
                    {Object.keys(timedelta).map(key => (
                        <option value={key} key={key}>
                            {key}
                        </option>
                    ))}
                </select>
            </div>
        </>
    )
}

export default App
