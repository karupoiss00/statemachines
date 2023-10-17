import {readLines} from "../common/io/readlines.ts";
import {writeLines} from "../common/io/writelines.ts"
import {generateView} from "../common/view/generateView.ts";
import {createMooreViewData, mooreToString} from "../common/view/moore.ts";
import {createMealyTable, createMooreTable} from "../common/io/readStatemachine.ts";
import {createMealyViewData, mealyToString} from "../common/view/mealy.ts";

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

if (machineType === 'moore') {
	const [states, map] = createMooreTable(inputLines, colsCount, rowsCount)

	// minimize moore

	outputLines = mooreToString(states)
	const [nodes, edges] = createMooreViewData(states)
	view.edges = edges
	view.nodes = nodes
}

if (machineType === 'mealy') {
	const [states, map] = createMealyTable(inputLines, colsCount, rowsCount)

	// minimize mealy

	outputLines = mealyToString(states)
	const [nodes, edges] = createMealyViewData(states)
	view.edges = edges
	view.nodes = nodes
}

if (!outputLines.length) {
	throw new Error('incorrect input data')
}



writeLines(OUTPUT_FILE_NAME, outputLines)
writeLines(OUTPUT_VIEW_FILE_NAME, [generateView(view.nodes, view.edges)])
