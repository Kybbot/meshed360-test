import toast from "react-hot-toast";

import { CreatePurchaseOrderLinesBodyType } from "@/@types/purchaseOrder/orderLines";

const hasDuplicateStrings = (arr: string[]) => new Set(arr).size !== arr.length;

export const validateData = (data: CreatePurchaseOrderLinesBodyType) => {
	const lines = data.orderLines;
	const serviceLines = data.additionalLines;

	const lineStrings = lines.map((item) => {
		const { id, ...rest } = item;
		return JSON.stringify({ ...rest });
	});

	const serviceLineStrings = serviceLines.map((item) => {
		const { id, ...rest } = item;
		return JSON.stringify({ ...rest });
	});

	if (hasDuplicateStrings(lineStrings)) {
		toast.error("There are duplicates in the Order Lines!");
		return false;
	}

	if (hasDuplicateStrings(serviceLineStrings)) {
		toast.error("There are duplicates in the Additional Charges & Services!");
		return false;
	}

	return true;
};
