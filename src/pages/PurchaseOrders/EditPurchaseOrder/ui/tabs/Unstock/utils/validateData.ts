import toast from "react-hot-toast";

import { CreateUnstockType } from "@/@types/purchaseOrder/unstock";

const hasDuplicateStrings = (arr: string[]) => new Set(arr).size !== arr.length;

export const validateData = (data: Omit<CreateUnstockType, "orderId">) => {
	const lines = data.lines;

	const lineStrings = lines.map((item) => {
		return JSON.stringify(item);
	});

	if (hasDuplicateStrings(lineStrings)) {
		toast.error("There are duplicates in the Lines!");
		return false;
	}

	return true;
};
