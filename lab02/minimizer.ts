import {readLines} from "../common/io/readlines.ts";
import {writeLines} from "../common/io/writelines.ts"
import {generateView} from "../common/view/generateView.ts";
import {createMooreViewData, mooreToString} from "../common/view/moore.ts";
import {createMealyTable, createMooreTable} from "../common/io/readStatemachine.ts";
import {createMealyViewData, mealyToString} from "../common/view/mealy.ts";
import {minimizeMealy} from "./mealy/mealy.ts";
import {minimizeMoore} from "./moore/moore.ts";

const INPUT_FILE_NAME = 'input.txt'
const OUTPUT_FILE_NAME = 'output.txt'
const OUTPUT_VIEW_FILE_NAME = 'view.generated.js'

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
	const [states] = createMooreTable(inputLines, colsCount, rowsCount)
	const minimizedStates = minimizeMoore(states)

	outputLines = mooreToString(minimizedStates)

	const [nodes, edges] = createMooreViewData(states)
	const [minimizedNodes, minimizedEdges] = createMooreViewData(minimizedStates, nodes.length)

	view.edges = [...edges, ...minimizedEdges]
	view.nodes = [...nodes, ...minimizedNodes]
}

if (machineType === 'mealy') {
	const [states] = createMealyTable(inputLines, colsCount, rowsCount)
	const minimizedStates = minimizeMealy(states)

	outputLines = mealyToString(minimizedStates)

	const [nodes, edges] = createMealyViewData(states)
	const [minimizedNodes, minimizedEdges] = createMealyViewData(minimizedStates, nodes.length)
	view.edges = [...edges, ...minimizedEdges]
	view.nodes = [...nodes, ...minimizedNodes]
}

if (!outputLines.length) {
	throw new Error('incorrect input data')
}

writeLines(OUTPUT_FILE_NAME, outputLines)
writeLines(OUTPUT_VIEW_FILE_NAME, [generateView(view.nodes, view.edges)])
