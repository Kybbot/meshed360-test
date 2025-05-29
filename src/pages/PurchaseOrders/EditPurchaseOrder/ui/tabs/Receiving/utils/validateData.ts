import toast from "react-hot-toast";

import { CreateReceivingsType, UpdateReceivingsType } from "@/@types/purchaseOrder/receiving";

const hasDuplicateStrings = (arr: string[]) => new Set(arr).size !== arr.length;

export const validateData = (
	data: Omit<CreateReceivingsType, "orderId"> | Omit<UpdateReceivingsType, "id">,
) => {
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
