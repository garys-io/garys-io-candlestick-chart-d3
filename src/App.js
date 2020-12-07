import React, { useEffect, useRef, useState } from 'react'

import { timedelta, YEAR, MONTH, DAY } from './dataTransformer'
import { chartRenderer } from './chartRenderer'

const defaultInterval = '1 minute'
const defaultFromTime = new Date(YEAR, MONTH, DAY, 9, 30)
const defaultToTime = new Date(YEAR, MONTH, DAY, 16, 0)
const dateOptions = [
    new Date(YEAR, MONTH, DAY, 9, 30),
    new Date(YEAR, MONTH, DAY, 10, 0),
    new Date(YEAR, MONTH, DAY, 10, 30),
    new Date(YEAR, MONTH, DAY, 11, 0),
    new Date(YEAR, MONTH, DAY, 11, 30),
    new Date(YEAR, MONTH, DAY, 12, 0),
    new Date(YEAR, MONTH, DAY, 12, 30),
    new Date(YEAR, MONTH, DAY, 13, 0),
    new Date(YEAR, MONTH, DAY, 13, 30),
    new Date(YEAR, MONTH, DAY, 14, 0),
    new Date(YEAR, MONTH, DAY, 14, 30),
    new Date(YEAR, MONTH, DAY, 15, 0),
    new Date(YEAR, MONTH, DAY, 15, 30),
    new Date(YEAR, MONTH, DAY, 16, 0),
]
const margin = 50
const width = 1920 - 2 * margin
const height = 1080 - 2 * margin

function App() {
    const svgRef = useRef()
    // [, new Date(YEAR, MONTH, DAY, 16, 0)]
    const [interval, setInterval] = useState(defaultInterval)
    const [fromTime, setFromTime] = useState(defaultFromTime)
    const [toTime, setToTime] = useState(defaultToTime)
    const data = timedelta[interval].filter(d => d.time > fromTime && d.time < toTime)

    useEffect(() => {
        chartRenderer({
            svgEle: svgRef.current,
            width,
            height,
            margin,
            data,
            fromTime,
            toTime,
        })
    }, [data])

    return (
        <>
            <svg ref={svgRef} width={width} height={height}>
                <g id="x-axis"></g>
                <g id="y-axis"></g>
                <g id="graph"></g>
            </svg>
            <div id='user-inputs'>
                <span>
                    <label htmlFor="interval">Interval:</label>
                    <select
                        id="interval"
                        onChange={e => setInterval(e.target.value)}
                        defaultValue={defaultInterval}
                    >
                        {Object.keys(timedelta).map(key => (
                            <option value={key} key={key}>
                                {key}
                            </option>
                        ))}
                    </select>
                </span>
                <span>
                    <label htmlFor="form-time">From:</label>
                    <select
                        id="form-time"
                        onChange={e => setFromTime(new Date(e.target.value))}
                        defaultValue={defaultFromTime.toISOString()}
                    >
                        {dateOptions.map(date => (
                            <option value={date.toISOString()} key={date.toISOString()}>
                                {date.toLocaleTimeString()}
                            </option>
                        ))}
                    </select>
                </span>
                <span>
                    <label htmlFor="to-time">To:</label>
                    <select
                        id="to-time"
                        onChange={e => setToTime(new Date(e.target.value))}
                        defaultValue={defaultToTime.toISOString()}
                    >
                        {dateOptions.map(date => (
                            <option value={date.toISOString()} key={date.toISOString()}>
                                {date.toLocaleTimeString()}
                            </option>
                        ))}
                    </select>
                </span>
            </div>
        </>
    )
}

export default App
