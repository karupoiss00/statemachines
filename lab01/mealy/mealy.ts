import {MealyState} from "../../common/types/mealy";
import {MooreState} from "../../common/types/moore.ts";

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

export {
	convertMealyToMoore,
}