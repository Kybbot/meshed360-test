import { calculateTotal } from "./calculate";

import {
	OrgBillType,
	BillAllocate,
	BillAllocationType,
	BillModalFormValues,
	GetAllOrgBillsResponseType,
} from "@/@types/purchaseOrders";

export const getNormalizedResetData = (
	allocation: BillAllocationType[],
	bills: GetAllOrgBillsResponseType,
	taxInclusive: boolean,
): BillModalFormValues => {
	return {
		additionalLines: allocation.map((item) => {
			const currentBill = bills.find((bill) => bill.id === item.billId);
			const currentBillLine = currentBill?.lines.find((line) => line.id === item.billLineId);

			if (currentBill && currentBillLine) {
				const { total, totalTax } = calculateTotal(
					+currentBillLine.unitPrice,
					+currentBillLine.quantity,
					+currentBillLine.discount,
					taxInclusive,
					currentBillLine.taxRate,
				);

				return {
					id: currentBillLine.id,
					name: `${currentBillLine.product.name} - ${currentBill.billNumber}`,
					billId: item.billId,
					billLineId: item.billLineId,
					billTotal: (+total - +totalTax).toFixed(2),
					product: {
						...currentBillLine.product,
						id: currentBillLine.id,
						productId: currentBillLine.product.id,
						name: `${currentBillLine.product.name} - ${currentBill.billNumber}`,
					},
					reference: currentBill.billNumber || "",
					cost: item.cost,
				};
			} else {
				return {
					id: "",
					name: "",
					billId: item.billId,
					billLineId: item.billLineId,
					billTotal: "",
					product: undefined,
					reference: "",
					cost: item.cost,
				};
			}
		}),
	};
};

export const getNormalizedCopyBillData = (data: OrgBillType, taxInclusive: boolean) => {
	const arr: BillAllocate[] = data.lines.map((line) => {
		const { total, totalTax } = calculateTotal(
			+line.unitPrice,
			+line.quantity,
			+line.discount,
			taxInclusive,
			line.taxRate,
		);

		return {
			id: line.id,
			name: `${line.product?.name} - ${data.billNumber}`,
			billId: data.id,
			billLineId: line.id,
			product: {
				...line.product,
				id: line.id,
				productId: line.product.id,
				name: `${line.product?.name} - ${data.billNumber}`,
			},
			reference: data.billNumber,
			billTotal: (+total - +totalTax).toFixed(2),
			cost: "",
		};
	});

	return arr;
};
