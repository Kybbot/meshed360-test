import { calculateTotal } from "./calculate";

import {
	BillType,
	BillAllocate,
	BillLineFormType,
	BillAdditionalCostFormType,
} from "@/@types/purchaseOrders";

export const getNormalizedResetData = (
	lines: BillLineFormType[],
	serviceLineValues: BillAdditionalCostFormType,
	taxInclusive: boolean,
	currentBill?: BillType,
): BillAllocate[] => {
	return lines.map((item) => {
		const currentAllocation = serviceLineValues.allocation.find((a) => a.billLineId === item.lineId);

		const { total, totalTax } = calculateTotal(
			+item.unitPrice,
			+item.quantity,
			+item.discount,
			taxInclusive,
			item.taxRate,
		);

		return {
			id: "",
			name: "",
			billId: currentAllocation?.billId || currentBill?.id || "",
			billLineId: item.lineId,
			product: item.product?.product || item.blindProduct,
			reference: currentBill?.billNumber || "",
			billTotal: (+total - +totalTax).toFixed(2),
			cost: currentAllocation?.cost || "",
		};
	});
};

export const getNormalizedServiceLineAllocationData = (
	serviceLine: BillAdditionalCostFormType,
	data: BillAllocate[],
): BillAdditionalCostFormType => {
	const newAllocations = data.map((item) => ({
		billId: item.billId,
		cost: item.cost || "0",
		billLineId: item.billLineId,
	}));

	return {
		...serviceLine,
		allocation: newAllocations,
	};
};
