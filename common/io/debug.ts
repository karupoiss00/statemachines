import {inspect} from "util";

function deepLog<T>(data: T, depth = 2) {
	console.log(inspect(data, true, depth, true))
}

export {
	deepLog
}