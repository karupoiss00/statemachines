import {WriteDeterministicAutomaton} from "../writeAutomaton.ts";
import {determinate} from "../task1/determinator.ts";
import {readNonDeterministicAutomaton} from "../readGrammar.ts";

function NKAToDKA(input: string, output: string): void {
	const automation = readNonDeterministicAutomaton(input)
	const result = determinate(automation)
	WriteDeterministicAutomaton(output, result)
}

export {
	NKAToDKA,
}
