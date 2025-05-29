import toast from "react-hot-toast";

import { ProductBomFormValues } from "@/@types/products";

const hasDuplicateStrings = (arr: string[]) => new Set(arr).size !== arr.length;

export const validateData = (data: ProductBomFormValues) => {
	const lines = data.lines;
	const serviceLines = data.serviceLines;

	const lineStrings = lines.map((item) => {
		return JSON.stringify({
			materialId: item.material?.id,
			quantity: item.quantity,
			wastagePercentage: item.wastagePercentage,
			wastageQuantity: item.wastageQuantity,
			unitCost: item.unitCost,
			totalCost: item.totalCost,
		});
	});

	const serviceLineStrings = serviceLines.map((item) => {
		return JSON.stringify({
			serviceId: item.service?.id,
			quantity: item.quantity,
			expenseAccountId: item.expenseAccount?.id,
			unitCost: item.unitCost,
			totalCost: item.totalCost,
		});
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
