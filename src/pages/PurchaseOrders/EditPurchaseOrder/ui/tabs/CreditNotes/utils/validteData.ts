import toast from "react-hot-toast";

import { CreateCreditNoteType } from "@/@types/purchaseOrder/creditNote";

const hasDuplicateStrings = (arr: string[]) => new Set(arr).size !== arr.length;

export const validateData = (data: Omit<CreateCreditNoteType, "orderId">) => {
	const lines = data.lines;
	const serviceLines = data.serviceLines;

	const lineStrings = lines.map((item) => {
		const { id, ...rest } = item;
		return JSON.stringify({ ...rest });
	});

	const serviceLineStrings = serviceLines.map((item) => {
		const { id, ...rest } = item;
		return JSON.stringify({ ...rest });
	});

	if (hasDuplicateStrings(lineStrings)) {
		toast.error("There are duplicates in the Lines!");
		return false;
	}

	if (hasDuplicateStrings(serviceLineStrings)) {
		toast.error("There are duplicates in the Additional Costs!");
		return false;
	}

	return true;
};
