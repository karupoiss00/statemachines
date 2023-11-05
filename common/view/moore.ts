import {MooreState} from "../types/moore.ts";

function mooreToString(mooreStates: Array<MooreState>) {
    const lines = ['']
    mooreStates.forEach(moore => {
        lines[0] += `${moore.name}/${moore.signal}`
        let i = 1
        for (const [, transition] of moore.transitions) {
            if (!lines[i])
            {
                lines.push('')
            }

            lines[i] += `${mooreStates.findIndex(s => s.name === transition.state.name) + 1} `

            i++
        }
    })

    return lines
}

function createMooreViewData(mooreStates: Array<MooreState>, baseIndex = 100): [Array<Object>, Array<Object>] {
    let nodes = []
    let edges = []

    mooreStates.forEach((s, index) => {
        nodes.push({
            id: index + baseIndex,
            label: s.name + '/' + s.signal
        })
        for (const [input, next] of s.transitions) {
            edges.push({
                from: index + baseIndex,
                to: mooreStates.findIndex(f => f.name === next.state.name) + baseIndex,
                label: `${input}`,
                length: 250,
            })
        }
    })

    return [nodes, edges]
}

export {
    mooreToString,
    createMooreViewData
}