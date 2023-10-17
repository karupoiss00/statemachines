import {MooreState} from "../../common/types/moore";
import {MealyState, MealyTransition} from "../../common/types/mealy.ts";

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
export {
	convertMooreToMealy,
}