type MealyTransition = {
    state: MealyState,
    signal: string,
}

type MealyState = {
    name: string,
    transitions: Map<string, MealyTransition>
}

export type {
    MealyState,
    MealyTransition
}