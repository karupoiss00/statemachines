import {MealyState} from '../../common/types/mealy.ts'
import {inspect} from "util";

function printData<T>(data: T, depth = 2) {
	console.log(inspect(data, true, depth, true))
}

function minimizeMealy(mealyStates: Array<MealyState>) {
	const reachableStates = removeUnreachableStates(mealyStates)
	let {
		mapStateNameToClassIndex,
		classesOfStates,
		classNames
	} = firstBreakToEquivalentClasses(reachableStates)

	let minimized = false

	let newMapStateNameToClassIndex: Map<string, number> = new Map()
	let newClassesOfStates: Map<number, Array<MealyState>> = new Map()
	while (!minimized) {
		minimized = true
		classNames = []

		const classes = Array.from(classesOfStates.values())

		classes.forEach(equivalenceClass => {
			const subClassesOfStates: Map<number, Array<MealyState>> = new Map()
			const subClassNames = []

			equivalenceClass.forEach(state => {
				const transitions = Array.from(state.transitions.values())
				const nameFromTransitionSequence = transitions.map(t => {
					return mapStateNameToClassIndex.get(t.state.name)
				}).join()

				if (!subClassNames.includes(nameFromTransitionSequence)) {
					subClassNames.push(nameFromTransitionSequence)
					subClassesOfStates.set(subClassNames.findIndex(s => s === nameFromTransitionSequence) + classNames.length, [])
				}

				const index = subClassNames.findIndex(s => s === nameFromTransitionSequence) + classNames.length

				subClassesOfStates.get(index).push(state)
				newMapStateNameToClassIndex.set(state.name, index)
			})

			classNames = [...classNames, ...subClassNames]

			Array.from(subClassesOfStates.entries()).forEach(([index, states]) => {
				newClassesOfStates.set(index, states)
			})

			if (subClassesOfStates.size > 1) {
				minimized = false
			}
		})

		classesOfStates = new Map(Array.from(newClassesOfStates.entries()))
		newClassesOfStates = new Map()

		mapStateNameToClassIndex = new Map(Array.from(newMapStateNameToClassIndex.entries()))
		newMapStateNameToClassIndex = new Map()
	}

	return createMinimizedMealyStates(classesOfStates, mapStateNameToClassIndex)
}

function removeUnreachableStates(mealyStates: Array<MealyState>) {
	const mapStateToVisited = new Map(mealyStates.map(state =>
		[state.name, false]
	))

	mealyStates.forEach(state => {
		const transitions = state.transitions.values()
		Array.from(transitions).forEach(t => {
			mapStateToVisited.set(t.state.name, true)
		})
	})

	return mealyStates.filter(state => !!mapStateToVisited.get(state.name))
}

function firstBreakToEquivalentClasses(states: Array<MealyState>) {
	const mapStateNameToClassIndex: Map<string, number> = new Map()
	const classesOfStates: Map<number, Array<MealyState>> = new Map()
	const classNames = []

	states.forEach(state => {
		const transitions = Array.from(state.transitions.values())
		const signals = transitions.map(transition => transition.signal).join()

		if (classNames.includes(signals)) {
			const index = classNames.findIndex(s => s === signals)
			classesOfStates.get(index).push(state)
			mapStateNameToClassIndex.set(state.name, index)
		}
		else {
			classNames.push(signals)
			classesOfStates.set(classNames.length - 1, [state])
			mapStateNameToClassIndex.set(state.name, classNames.length - 1)
		}
	})

	return {
		mapStateNameToClassIndex,
		classesOfStates,
		classNames
	}
}

function createMinimizedMealyStates(classes: Map<number, Array<MealyState>>, mapStateToClass: Map<string, number>) {
	const states = Array.from(classes.values()).map(states => states[0])

	states.forEach(state => {
		const transitions = Array.from(state.transitions.values())

		transitions.forEach(t => {
			const indexOfGroup = mapStateToClass.get(t.state.name)
			t.state = states[indexOfGroup]
		})
	})

	return states
}

export {
	minimizeMealy
}