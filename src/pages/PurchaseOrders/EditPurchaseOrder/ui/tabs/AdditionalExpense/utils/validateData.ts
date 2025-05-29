import toast from "react-hot-toast";

import { CreateAdditionalExpenseType } from "@/@types/purchaseOrder/additionalExpense";

const hasDuplicateStrings = (arr: string[]) => new Set(arr).size !== arr.length;

export const validateData = (data: Omit<CreateAdditionalExpenseType, "orderId">) => {
	const lines = data.lines;

	const lineStrings = lines.map((item) => {
		const { id, allocation, ...rest } = item;
		return JSON.stringify({ ...rest });
	});

	if (hasDuplicateStrings(lineStrings)) {
		toast.error("There are duplicates in the Lines!");
		return false;
	}

	return true;
};
