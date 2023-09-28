import {MealyState, MealyTransition} from "../mealy/mealy";

type MooreState = {
	name: string,
	signal: string,
	transitions: Map<string, MooreTransition>
}

type MooreTransition = {
	state: MooreState
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

function convertMooreToMealy(idxMooreStates: Map<string, MooreState>, mooreStates: Array<MooreState>): [Map<string, MealyState>, Array<MealyState>] {
	const [idsMealy, mealies] = generateMealyStatesFromMooreStates(mooreStates)

	fillMealyTransitions(idxMooreStates, idsMealy)

	return [idsMealy, mealies.filter(mealy => !!mealy.transitions.size)]
}

function generateMealyStatesFromMooreStates(mooreStates: MooreState[]): [Map<string, MealyState>, MealyState[]] {
	const idxMealyStates = new Map<string, MealyState>();
	const mealyStates: MealyState[] = [];

	for (const mooreState of mooreStates) {
		const mealyState: MealyState = {
			name: mooreState.name,
			transitions: new Map<string, MealyTransition>(),
		};

		idxMealyStates.set(mooreState.name, mealyState);
		mealyStates.push(mealyState);
	}

	return [idxMealyStates, mealyStates];
}

function fillMealyTransitions(idxMooreStates: Map<string, MooreState>, idxMealyStates: Map<string, MealyState>): void {
	for (const [mealyStateName, mealyState] of idxMealyStates) {
		const mooreState = idxMooreStates.get(mealyStateName);

		if (mooreState) {
			for (const [input, transition] of mooreState.transitions) {
				const nextMooreState = transition.state;
				if (nextMooreState) {
					mealyState.transitions.set(input, {
						signal: nextMooreState.signal,
						state: idxMealyStates.get(nextMooreState.name),
					});
				}
			}
		}
	}
}
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

export type {
	MooreState,
	MooreTransition
}

export {
	createMooreViewData,
	convertMooreToMealy,
	createMooreTable,
	mooreToString,
}