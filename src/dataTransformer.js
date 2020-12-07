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
        time: new Date(YEAR, MONTH, DAY, hour, minute, second + 5),
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

const parsed20secData = []
for (let i = 0; i < parsed10secData.length + 2; i += 2) {
    if (!parsed10secData[i]) break
    const t = parsed10secData[i].time
    const time = new Date(YEAR, MONTH, DAY, t.getHours(), t.getMinutes(), t.getSeconds() + 5)
    const list = [parsed10secData[i], parsed10secData[i + 1]]
    if (!list.every(x => x)) break

    parsed20secData.push({
        time,
        ...calcMetrics(list),
    })
}

const parsed30secData = []
for (let i = 0; i < parsed10secData.length + 3; i += 3) {
    if (!parsed10secData[i + 1]) break
    const list = [parsed10secData[i], parsed10secData[i + 1], parsed10secData[i + 2]]
    if (!list.every(x => x)) break

    parsed30secData.push({
        time: parsed10secData[i + 1].time,
        ...calcMetrics(list),
    })
}

const parsed1minData = []
for (let i = 0; i < parsed10secData.length + 6; i += 6) {
    if (!parsed10secData[i + 2]) break
    const list = [
        parsed10secData[i],
        parsed10secData[i + 1],
        parsed10secData[i + 2],
        parsed10secData[i + 3],
        parsed10secData[i + 4],
        parsed10secData[i + 5],
    ]
    if (!list.every(x => x)) break

    parsed1minData.push({
        time: parsed10secData[i + 2].time,
        ...calcMetrics(list),
    })
}

const parsed2minData = []
for (let i = 0; i < parsed10secData.length + 12; i += 12) {
    if (!parsed10secData[i + 5]) break
    const list = [
        parsed10secData[i],
        parsed10secData[i + 1],
        parsed10secData[i + 2],
        parsed10secData[i + 3],
        parsed10secData[i + 4],
        parsed10secData[i + 5],
        parsed10secData[i + 6],
        parsed10secData[i + 7],
        parsed10secData[i + 8],
        parsed10secData[i + 9],
        parsed10secData[i + 10],
        parsed10secData[i + 11],
    ]
    if (!list.every(x => x)) break

    parsed2minData.push({
        time: parsed10secData[i + 5].time,
        ...calcMetrics(list),
    })
}

export {
    YEAR,
    MONTH,
    DAY,
    data as rawData,
    parsed10secData,
    parsed20secData,
    parsed30secData,
    parsed1minData,
    parsed2minData,
}
