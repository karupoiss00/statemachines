import {MooreState} from "../types/moore.ts";

function mooreToString(mooreStates: Array<MooreState>) {
    const lines = ['']
    mooreStates.forEach(moore => {
        lines[0] += `${moore.name} `
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

function createMooreViewData(mooreStates: Array<MooreState>): [Array<Object>, Array<Object>] {
    let nodes = []
    let edges = []

    mooreStates.forEach((s, index) => {
        nodes.push({
            id: index,
            label: s.name
        })
        for (const [input, next] of s.transitions) {
            edges.push({
                from: index,
                to: mooreStates.findIndex(f => f.name === next.state.name),
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