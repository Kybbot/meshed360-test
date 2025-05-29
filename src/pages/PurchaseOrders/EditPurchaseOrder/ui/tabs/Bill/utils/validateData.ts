import toast from "react-hot-toast";

import { CreateBillType } from "@/@types/purchaseOrders";

const hasDuplicateStrings = (arr: string[]) => new Set(arr).size !== arr.length;

export const validateData = (data: Omit<CreateBillType, "orderId">) => {
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
		toast.error("There are duplicates in the Additional Charges & Services!");
		return false;
	}

	return true;
};
