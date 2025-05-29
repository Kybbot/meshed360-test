import toast from "react-hot-toast";

import { calculateTotalQuantity } from "./calculate";

import { AssemblyFormValues } from "@/@types/assembly/assembly";

const hasDuplicateStrings = (arr: string[]) => new Set(arr).size !== arr.length;

export const validateData = (data: AssemblyFormValues) => {
	const lines = data.lines;
	const serviceLines = data.serviceLines;

	const lineStrings = lines.map((item) => {
		const { lineId, ...rest } = item;
		return JSON.stringify({ ...rest });
	});

	const serviceLineStrings = serviceLines.map((item) => {
		const { lineId, ...rest } = item;
		return JSON.stringify({ ...rest });
	});

	if (hasDuplicateStrings(lineStrings)) {
		toast.error("There are duplicates in the Lines!");
		return false;
	}

	if (hasDuplicateStrings(serviceLineStrings)) {
		toast.error("There are duplicates in the Services!");
		return false;
	}

	return true;
};

export const validateTotalQuantity = (data: AssemblyFormValues, quantityToProduce: string) => {
	const result = data.lines
		.map((line) =>
			calculateTotalQuantity(
				+quantityToProduce,
				+line.quantity,
				+line.wastagePercentage,
				+line.wastageQuantity,
				+line.available,
			),
		)
		.some((item) => !!item.totalQuantityError);

	return !result;
};
