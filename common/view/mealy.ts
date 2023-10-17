import {MealyState} from "../types/mealy.ts";

function sortMealyStates(mealyStates: Array<MealyState>) {
    const compare = (a: MealyState, b: MealyState) => {
        if ( a.name < b.name ){
            return -1;
        }
        if ( a.name > b.name ){
            return 1;
        }
        return 0;
    }

    return mealyStates.sort(compare)
}

function mealyToString(mealyStates: Array<MealyState>) {
    const lines = ['']
    sortMealyStates(mealyStates).forEach(mealy => {
        lines[0] += `${mealy.name} `
        let i = 1
        for (const [, transition] of mealy.transitions) {
            if (!lines[i])
            {
                lines.push('')
            }
            lines[i] += `${transition.state.name}/${transition.signal} `
            i++
        }
    })

    return lines
}

function createMealyViewData(mealyStates: Array<MealyState>): [Array<Object>, Array<Object>] {
    let nodes = []
    let edges = []

    mealyStates.forEach((s, index) => {
        nodes.push({
            id: index,
            label: s.name
        })
        for (const [input, next] of s.transitions) {
            edges.push({
                from: index,
                to: mealyStates.findIndex(f => f.name === next.state.name),
                label: `${input}/${next.signal}`,
                length: 250,
            })
        }
    })

    return [nodes, edges]
}

export {
    mealyToString,
    createMealyViewData
}
