import { UnstockLineFormType } from "@/@types/purchaseOrder/unstock";

export const calculateFooterValues = (data: UnstockLineFormType[]) => {
	const totalQuantity = data.reduce((prev, curr) => {
		if (curr.quantity) {
			return +curr.quantity + prev;
		}
		return prev;
	}, 0);

	return { totalQuantity };
};
