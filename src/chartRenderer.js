import { select, scaleTime, scaleLinear, min, max, axisBottom, axisLeft } from 'd3'

const chartRenderer = props => {
    const { svgEle, YEAR, MONTH, DAY, width, height, margin, candleWidth, data, interval } = props

    const svg = select(svgEle).attr('viewBox', [0, 0, width, height])

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

    svg.append('g').call(yAxis).attr('transform', `translate(${margin}, ${margin})`)

    svg.select('#graph').selectAll('line')
        .data(data)
        .join('line')
        .attr('y1', d => y(d.low))
        .attr('y2', d => y(d.high))
        .attr('stroke', 'black')
        .attr('transform', d => `translate(${x(d.time) + margin}, ${margin})`)

    svg.select('#graph').selectAll('rect')
        .data(data)
        .join('rect')
        .attr('height', d => Math.abs(y(d.open) - y(d.close)))
        .attr('width', candleWidth)
        .attr('fill', d => (d.open > d.close ? 'red' : 'green'))
        .attr(
            'transform',
            d =>
                `translate(${x(d.time) - candleWidth / 2 + margin}, ${
                    y(Math.max(d.open, d.close)) + margin
                })`
        )
}

export { chartRenderer }
