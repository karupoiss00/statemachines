import {readLines} from "../common/readlines.ts";
import {writeLines} from "../common/writelines.ts"
import {convertMooreToMealy, createMooreTable, createMooreViewData, mooreToString} from "./moore/moore.ts";
import {convertMealyToMoore, createMealyTable, createMealyViewData, mealyToString} from "./mealy/mealy.ts";
import {generateView} from "./view/generateView.ts";

const INPUT_FILE_NAME = 'input.txt'
const OUTPUT_FILE_NAME = 'output.txt'
const OUTPUT_VIEW_FILE_NAME = './view/view.generated.js'

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

const view = {
	nodes: [],
	edges: []
}

if (machineType === 'mur') {
	const [states, map] = createMooreTable(inputLines, colsCount, rowsCount)
	const [_, mealyStates] = convertMooreToMealy(map, states)
	outputLines = mealyToString(mealyStates)
	const [nodes, edges] = createMealyViewData(mealyStates)
	view.edges = edges
	view.nodes = nodes
}

if (machineType === 'mili') {
	const [states, map] = createMealyTable(inputLines, colsCount, rowsCount)
	const [_, mooreStates] = convertMealyToMoore(map, states)
	outputLines = mooreToString(mooreStates)
	const [nodes, edges] = createMooreViewData(mooreStates)
	view.edges = edges
	view.nodes = nodes
}

if (!outputLines.length) {
	throw new Error('incorrect input data')
}



writeLines(OUTPUT_FILE_NAME, outputLines)
writeLines(OUTPUT_VIEW_FILE_NAME, [generateView(view.nodes, view.edges)])
