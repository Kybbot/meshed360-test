import { calculateTotal } from "./calculate";

import {
	GetAdditionalExpenseType,
	AdditionalExpenseAllocate,
	AdditionalExpenseFormValues,
	CreateAdditionalExpenseType,
	DefaultAdditionalExpenseLine,
	AdditionalExpenseLineFormType,
} from "@/@types/purchaseOrder/additionalExpense";
import { BillType } from "@/@types/purchaseOrders";
import { getDateFromDayPickerDate, getFormDayPickerDate } from "@/utils/date";

export const getNormalizedResetData = (
	data: GetAdditionalExpenseType,
	bills: BillType[],
	taxInclusive: boolean,
): AdditionalExpenseFormValues => {
	if (!data || data.lines.length <= 0)
		return {
			lines: [DefaultAdditionalExpenseLine],
		};

	return {
		lines: data.lines.map((line) => ({
			lineId: line.id,
			expenseAccount: line.expenseAccount,
			reference: line.reference,
			date: getDateFromDayPickerDate(line.date),
			amount: line.amount,
			allocation: line.allocation.map((item) => {
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
						allocateAdditionalCost: item.allocateAdditionalCost,
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
						allocateAdditionalCost: item.allocateAdditionalCost,
					};
				}
			}),
		})),
	};
};

export const getNormalizedCopyBillData = (data: BillType, taxInclusive: boolean) => {
	const arr: AdditionalExpenseAllocate[] = data.lines.map((line) => {
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
			allocateAdditionalCost: "",
		};
	});

	return arr;
};

const getNormalizedLinesData = (data: AdditionalExpenseLineFormType) => {
	const expenseAccount = data.expenseAccount!;

	return {
		...(data.lineId ? { id: data.lineId } : {}),
		expenseAccountId: expenseAccount.id,
		...(data.reference ? { reference: data.reference } : {}),
		...(data.date ? { date: getFormDayPickerDate(data.date, true) } : {}),
		amount: data.amount,
		allocation: data.allocation.map((item) => {
			const product = item.product!;

			return {
				billId: item.billId,
				billLineId: item.billLineId,
				productId: product.id,
				...(item.reference ? { reference: item.reference } : {}),
				allocateAdditionalCost: item.allocateAdditionalCost || "0",
			};
		}),
	};
};

export const getNormalizedCreateAdditionalExpenseData = (
	data: AdditionalExpenseFormValues,
): Omit<CreateAdditionalExpenseType, "orderId"> => {
	return {
		lines: data.lines.map(getNormalizedLinesData),
	};
};
