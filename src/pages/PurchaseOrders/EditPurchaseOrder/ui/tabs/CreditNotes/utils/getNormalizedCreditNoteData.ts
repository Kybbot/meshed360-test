import {
	CreditNoteType,
	CreditNoteFormValues,
	CreditNoteLineFormType,
	CreditNoteServiceLineFormType,
	CreateCreditNoteType,
	CreateCreditNoteLine,
	CreateCreditNoteServiceLine,
} from "@/@types/purchaseOrder/creditNote";
import { ProductType } from "@/@types/products";
import { BillLine, BillType } from "@/@types/purchaseOrders";

import { getDateFromDayPickerDate, getFormDayPickerDate } from "@/utils/date";

export const getNormalizedResetData = (data: CreditNoteType): CreditNoteFormValues => {
	return {
		total: "",
		date: getDateFromDayPickerDate(data.date) || new Date(),
		lines: data.lines.map((item) => ({
			lineId: item.id,
			orderLineId: item.orderLineId,
			product: item.product,
			comment: item.comment,
			quantity: item.quantity,
			unitPrice: item.unitPrice,
			discount: item.discount,
			account: item.account,
			total: "",
		})),
		serviceLines: data.serviceLines.map((item) => ({
			lineId: item.id,
			...(item.description
				? { product: { id: "", name: item.description } as ProductType }
				: { product: item.product }),
			comment: item.comment,
			quantity: item.quantity,
			unitPrice: item.unitPrice,
			discount: item.discount,
			tax: item.tax,
			account: item.account,
			total: "",
		})),
	};
};

export const getNormalizedCurrentOrderLines = (bills: BillType[], billIds: string[]) => {
	return Object.values(
		billIds.reduce(
			(acc, billId) => {
				const bill = bills.find((item) => item.id === billId);

				if (bill) {
					for (const line of bill.lines) {
						acc[line.orderLineId] = acc[line.orderLineId]
							? {
									...acc[line.orderLineId],
									quantity: (+acc[line.orderLineId].quantity + +line.quantity).toString(),
								}
							: {
									id: line.id,
									orderLineId: line.orderLineId,
									product: line.product,
									comment: line.comment,
									supplierSku: line.supplierSku,
									quantity: line.quantity.toString(),
									unitPrice: line.unitPrice,
									discount: line.discount,
									taxRate: line.taxRate,
									account: line.account,
									trackingCategory1: line.trackingCategory1,
									trackingCategory2: line.trackingCategory2,
									total: "",
								};
					}
				}

				return acc;
			},
			{} as { [key: string]: BillLine },
		),
	);
};

export const getNormalizedCopyBillData = (data: BillType, linesValues: CreditNoteLineFormType[]) => {
	const formLines = Object.values(
		data.lines.reduce(
			(acc, item) => {
				acc[item.orderLineId] = acc[item.orderLineId]
					? {
							...acc[item.orderLineId],
							quantity: ((+acc[item.orderLineId].quantity || 0) + +item.quantity).toString(),
						}
					: {
							lineId: "",
							orderLineId: item.orderLineId,
							product: item.product,
							comment: item.comment,
							quantity: item.quantity,
							unitPrice: item.unitPrice,
							discount: item.discount,
							account: item.account,
							total: item.total,
						};

				return acc;
			},
			{} as { [key: string]: CreditNoteLineFormType },
		),
	);

	const combinedArr = [...formLines, ...linesValues];

	const lines = Object.values(
		combinedArr.reduce(
			(acc, item) => {
				if (!acc[item.orderLineId]) {
					acc[item.orderLineId] = {
						...item,
						quantity: item.quantity,
					};
				} else {
					acc[item.orderLineId] = {
						...acc[item.orderLineId],
						quantity: ((+acc[item.orderLineId].quantity || 0) + +item.quantity).toString(),
					};
				}

				return acc;
			},
			{} as { [key: string]: CreditNoteLineFormType },
		),
	);

	const serviceLines: CreditNoteServiceLineFormType[] = data.serviceLines.map((item) => {
		return {
			lineId: "",
			...(item.description
				? { product: { id: "", name: item.description } as ProductType }
				: { product: item.product }),
			comment: item.comment,
			quantity: item.quantity,
			unitPrice: item.unitPrice,
			discount: item.discount,
			tax: item.taxRate,
			account: item.account,
			total: item.total,
		};
	});

	return {
		lines,
		serviceLines,
	};
};

const getNormalizedCreateLinesData = (data: CreditNoteLineFormType): CreateCreditNoteLine => {
	const product = data.product!;
	const account = data.account!;

	return {
		...(data.lineId ? { id: data.lineId } : {}),
		orderLineId: data.orderLineId,
		productId: product.id,
		comment: data.comment,
		quantity: data.quantity,
		unitPrice: data.unitPrice,
		discount: data.discount || "0",
		accountId: account.id,
	};
};

const getNormalizedCreateServiceLinesData = (
	data: CreditNoteServiceLineFormType,
): CreateCreditNoteServiceLine => {
	const product = data.product!;
	const tax = data.tax!;
	const account = data.account!;

	return {
		...(data.lineId ? { id: data.lineId } : {}),
		...(product.id ? { productId: product.id } : { description: product.name }),
		comment: data.comment,
		quantity: data.quantity,
		unitPrice: data.unitPrice,
		discount: data.discount || "0",
		taxRateId: tax.id,
		accountId: account.id,
	};
};

export const getNormalizedCreateCreditNoteData = (
	data: CreditNoteFormValues,
	billIds: string[],
): Omit<CreateCreditNoteType, "orderId"> => {
	return {
		billIds,
		total: "",
		date: getFormDayPickerDate(data.date, true),
		lines: data.lines.map(getNormalizedCreateLinesData),
		serviceLines: data.serviceLines.map(getNormalizedCreateServiceLinesData),
	};
};
