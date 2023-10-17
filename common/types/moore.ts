type MooreState = {
    name: string,
    signal: string,
    transitions: Map<string, MooreTransition>
}

type MooreTransition = {
    state: MooreState
}

export type {
    MooreState,
    MooreTransition
}