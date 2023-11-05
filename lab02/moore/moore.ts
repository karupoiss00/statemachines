import {MooreState} from '../../common/types/moore.ts'

function minimizeMoore(mooreStates: Array<MooreState>) {
	const reachableStates = removeUnreachableStates(mooreStates)
	let {
		mapStateNameToClassIndex,
		classesOfStates,
		classNames
	} = firstBreakToEquivalentClasses(reachableStates)

	let minimized = false

	let newMapStateNameToClassIndex: Map<string, number> = new Map()
	let newClassesOfStates: Map<number, Array<MooreState>> = new Map()
	while (!minimized) {
		minimized = true
		classNames = []

		const classes = Array.from(classesOfStates.values())

		classes.forEach(equivalenceClass => {
			const subClassesOfStates: Map<number, Array<MooreState>> = new Map()
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

	return createMinimizedMooreStates(classesOfStates, mapStateNameToClassIndex)
}

function removeUnreachableStates(mooreStates: Array<MooreState>) {
	const mapStateToVisited = new Map(mooreStates.map(state =>
		[state.name, false]
	))

	mooreStates.forEach(state => {
		const transitions = state.transitions.values()
		Array.from(transitions).forEach(t => {
			mapStateToVisited.set(t.state.name, true)
		})
	})

	return mooreStates.filter(state => !!mapStateToVisited.get(state.name))
}

function firstBreakToEquivalentClasses(states: Array<MooreState>) {
	const mapStateNameToClassIndex: Map<string, number> = new Map()
	const classesOfStates: Map<number, Array<MooreState>> = new Map()
	const classNames = []

	states.forEach(state => {
		const transitions = Array.from(state.transitions.values())
		const signals = transitions.map(transition => transition.state.name + transition.state.signal).join()

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

function createMinimizedMooreStates(classes: Map<number, Array<MooreState>>, mapStateToClass: Map<string, number>) {
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
	minimizeMoore
}