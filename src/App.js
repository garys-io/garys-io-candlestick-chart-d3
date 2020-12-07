import React, { useEffect, useRef, useState } from 'react'

import { timedelta, YEAR, MONTH, DAY } from './dataTransformer'
import { chartRenderer } from './chartRenderer'

const defaultInterval = '1 minute'
const width = 1920
const height = 1080
const margin = 50

function App() {
    const svgRef = useRef()

    const [interval, setInterval] = useState(defaultInterval)
    const data = timedelta[interval]
    const candleWidth = (0.42 * (width - 2 * margin)) / data.length

    useEffect(() => {
        console.log('called')
        chartRenderer({
            svgEle: svgRef.current,
            YEAR,
            MONTH,
            DAY,
            width,
            height,
            margin,
            candleWidth,
            data,
            interval,
        })
    }, [data, candleWidth])

    return (
        <>
            <svg ref={svgRef} width={width} height={height}>
                <g id="graph"></g>
            </svg>
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
