import {readLines} from "../common/readlines.ts";
import {writeLines} from "../common/writelines.ts"
import {convertMooreToMealy, createMooreTable, mooreToString} from "./moore/moore.ts";
import {convertMealyToMoore, createMealyTable, mealyToString} from "./mealy/mealy.ts";

const INPUT_FILE_NAME = 'input.txt'
const OUTPUT_FILE_NAME = 'output.txt'

function getMachineInfo(line: string) {
	const [columnsStr, rowsStr, machineType] = line.split(' ')

	return {
		colsCount: Number(columnsStr),
		rowsCount: Number(rowsStr),
		machineType
	}
}

const inputLines = readLines(INPUT_FILE_NAME)
const {colsCount, rowsCount, machineType} = getMachineInfo(inputLines.shift())

let outputLines = []

if (machineType === 'mur') {
	const [states, map] = createMooreTable(inputLines, colsCount, rowsCount)
	const [_, mealyStates] = convertMooreToMealy(map, states)
	outputLines = mealyToString(mealyStates)
}

if (machineType === 'mili') {
	const [states, map] = createMealyTable(inputLines, colsCount, rowsCount)
	const [_, mooreStates] = convertMealyToMoore(map, states)
	outputLines = mooreToString(mooreStates)
}

if (!outputLines.length) {
	throw new Error('incorrect input data')
}

writeLines(OUTPUT_FILE_NAME, outputLines)
