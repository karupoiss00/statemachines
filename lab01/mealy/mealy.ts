import {MooreState} from "../moore/moore";

type MealyTransition = {
	state: MealyState,
	signal: string,
}

type MealyState = {
	name: string,
	transitions: Map<string, MealyTransition>
}

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


function convertMealyToMoore(idxMealyStates: Map<string, MealyState>, mealiesStates: Array<MealyState>): [Map<string, MooreState>, Array<MooreState>] {
	const [idxMoore, moores] = generateMooreStatesFromMealyStates(mealiesStates)

	fillMooreTransitions(idxMealyStates, idxMoore)

	return [idxMoore, moores]
}


function generateMooreStatesFromMealyStates(mealyStates: Array<MealyState>): [Map<string, MooreState>, Array<MooreState>] {
	const mooreStates = []
	const idxMooreStates = new Map()

	mealyStates.forEach(state => {
		state.transitions.forEach(transition => {
			const name = transition.state.name + '/' + transition.signal
			if (!mooreStates.find(state => state.name === name)) {
				const state = {
					name,
					signal: transition.signal,
					transitions: new Map(),
				}
				mooreStates.push(state)
				idxMooreStates.set(name, state)
			}
		})
	})

	return [idxMooreStates, mooreStates]
}

function fillMooreTransitions(idxMealyStates: Map<string, MealyState>, idxMooreStates: Map<string, MooreState>) {
	let countTransitions = 0
	const filledTransitions = new Map<string, string[]>();

	for (const [_, mealyState] of idxMealyStates) {
		for (const transition of mealyState.transitions.values()) {
			for (const input of mealyState.transitions.keys()) {
				const currentStateName = `${transition.state.name}/${transition.signal}`;
				const currentMooreState = idxMooreStates.get(currentStateName);

				const nextMealyState = transition.state;
				const nextStateName = `${nextMealyState.transitions.get(input).state.name}/${nextMealyState.transitions.get(input).signal}`;
				const nextMooreState = idxMooreStates.get(nextStateName);

				if (isTransitionExist(filledTransitions, currentStateName, nextStateName)) {
					continue;
				}

				currentMooreState.transitions.set(input, {
					state: nextMooreState!
				});

				countTransitions++;
				if (!filledTransitions.has(currentStateName)) {
					filledTransitions.set(currentStateName, []);
				}
				filledTransitions.get(currentStateName).push(nextStateName);
			}
		}
	}
}

function isTransitionExist(filledTransitions: Map<string, string[]>, currentStateName: string, nextStateName: string): boolean {
	return (filledTransitions.get(currentStateName) || []).includes(nextStateName);
}

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
		for (const [_, transition] of mealy.transitions) {
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

export type {
	MealyTransition,
	MealyState
}

export {
	createMealyTable,
	convertMealyToMoore,
	mealyToString,
}