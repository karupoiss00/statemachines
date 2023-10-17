import {MealyState} from "../types/mealy.ts";
import {MooreState} from "../types/moore.ts";

function createMealyTable(input: Array<string>, colsCount: number, rowsCount: number): [Array<MealyState>, Map<string, MealyState>] {
    const states: Array<MealyState> = []
    const idxMealyStates: Map<string, MealyState> = new Map()

    for (let i = 1; i <= colsCount; i++) {
        states.push({
            name: `s${i}`,
            transitions: new Map()
        })
    }

    const strTransitions = input.map(str => str.split(' '))

    const initState = (state: MealyState, index: number) => {
        for (let i = 0; i < rowsCount; i++)
        {
            const transition = strTransitions[i][index]
            const [name, signal] = transition.split('/')
            state.transitions.set(`x${i}`, {
                state: states.find(s => s.name === name),
                signal: signal,
            })
            idxMealyStates.set(state.name, state)
        }
    }

    states.forEach(initState)

    return [states, idxMealyStates]
}


function createMooreTable(input: Array<string>, colsCount: number, rowsCount: number): [Array<MooreState>, Map<string, MooreState>] {
    const states: Array<MooreState> = []
    const idxMooreStates: Map<string, MooreState> = new Map()

    const stateSignalPairs = input.shift().split(' ')

    stateSignalPairs.forEach(pair => {
        const [name, signal] = pair.split('/')
        states.push({
            name,
            signal,
            transitions: new Map()
        })
    })

    const strTransitions = input.map(str => str.split(' '))

    const initState = (state: MooreState, index: number) => {
        for (let i = 0; i < rowsCount; i++)
        {
            const transitionStateNumber = Number(strTransitions[i][index]) - 1
            state.transitions.set(`x${i}`, {
                state: states[transitionStateNumber],
            })
            idxMooreStates.set(state.name, state)
        }
    }

    states.forEach(initState)

    return [states, idxMooreStates]
}

export {
    createMealyTable,
    createMooreTable
}