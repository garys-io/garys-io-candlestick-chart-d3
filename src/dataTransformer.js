import { data } from './dataLoader'

const YEAR = 2020
const MONTH = 11
const DAY = 4

/////////
// colums : time,volume,low,high,open,close
/////////

const parsed10secData = data.map(({ time, volume, low, high, open, close }) => {
    const [hour, minute, second] = time.split(':')
    return {
        time: new Date(YEAR, MONTH, DAY, hour, minute, second),
        volume: Number(volume),
        low: Number(low),
        high: Number(high),
        open: Number(open),
        close: Number(close),
    }
})

const calcVolume = list => list.reduce((acc, cur) => acc + cur.volume, 0)

const calcLow = list => list.reduce((acc, cur) => Math.min(acc, cur.low), 1e10)

const calcHigh = list => list.reduce((acc, cur) => Math.max(acc, cur.high), 1e-10)

const calcOpen = list => list[0].open

const calcClose = list => list[list.length - 1].close

const calcMetrics = list => ({
    volume: calcVolume(list),
    low: calcLow(list),
    high: calcHigh(list),
    open: calcOpen(list),
    close: calcClose(list),
})

// combine two 10 seconds to make 20 second data
const parsed20secData = []
for (let i = 0; i < parsed10secData.length + 2; i += 2) {
    if (!parsed10secData[i]) break
    const list = [parsed10secData[i], parsed10secData[i + 1]]
    if (!list.every(x => x)) break

    parsed20secData.push({
        time: parsed10secData[i].time,
        ...calcMetrics(list),
    })
}

// combine three 10 seconds to make 30 second data
const parsed30secData = []
for (let i = 0; i < parsed10secData.length + 3; i += 3) {
    if (!parsed10secData[i + 1]) break
    const list = [parsed10secData[i], parsed10secData[i + 1], parsed10secData[i + 2]]
    if (!list.every(x => x)) break

    parsed30secData.push({
        time: parsed10secData[i].time,
        ...calcMetrics(list),
    })
}

// combine two 30 seconds to make 1 minute data
const parsed1minData = []
for (let i = 0; i < parsed30secData.length + 2; i += 2) {
    if (!parsed30secData[i + 2]) break
    const list = [parsed30secData[i], parsed30secData[i + 1]]
    if (!list.every(x => x)) break

    parsed1minData.push({
        time: parsed30secData[i].time,
        ...calcMetrics(list),
    })
}

// combine two 1 minutes to make 2 minute data
const parsed2minData = []
for (let i = 0; i < parsed1minData.length + 2; i += 2) {
    if (!parsed1minData[i + 1]) break
    const list = [parsed1minData[i], parsed1minData[i + 1]]
    if (!list.every(x => x)) break

    parsed2minData.push({
        time: parsed1minData[i].time,
        ...calcMetrics(list),
    })
}

// combine three 1 minutes to make 3 minute data
const parsed3minData = []
for (let i = 0; i < parsed1minData.length + 3; i += 3) {
    if (!parsed1minData[i + 1]) break
    const list = [parsed1minData[i], parsed1minData[i + 1], parsed1minData[i + 2]]
    if (!list.every(x => x)) break

    parsed3minData.push({
        time: parsed1minData[i].time,
        ...calcMetrics(list),
    })
}

// combine five 1 minutes to make 5 minute data
const parsed5minData = []
for (let i = 0; i < parsed1minData.length + 5; i += 5) {
    if (!parsed1minData[i + 2]) break
    const list = [
        parsed1minData[i],
        parsed1minData[i + 1],
        parsed1minData[i + 2],
        parsed1minData[i + 3],
        parsed1minData[i + 4],
    ]
    if (!list.every(x => x)) break

    parsed5minData.push({
        time: parsed1minData[i].time,
        ...calcMetrics(list),
    })
}

// combine two 5 minutes to make 10 minute data
const parsed10minData = []
for (let i = 0; i < parsed5minData.length + 2; i += 2) {
    if (!parsed5minData[i + 1]) break
    const list = [parsed5minData[i], parsed5minData[i + 1]]
    if (!list.every(x => x)) break

    parsed10minData.push({
        time: parsed5minData[i].time,
        ...calcMetrics(list),
    })
}

const timedelta = {
    '10 second': parsed10secData,
    '20 second': parsed20secData,
    '30 second': parsed30secData,
    '1 minute': parsed1minData,
    '2 minute': parsed2minData,
    '3 minute': parsed3minData,
    '5 minute': parsed5minData,
    '10 minute': parsed10minData,
}

export { YEAR, MONTH, DAY, data as rawData, timedelta }
