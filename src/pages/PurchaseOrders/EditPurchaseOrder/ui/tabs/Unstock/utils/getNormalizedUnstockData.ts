import {
	UnstockType,
	CreateUnstockLine,
	CreateUnstockType,
	UnstockFormValues,
	UnstockLineFormType,
} from "@/@types/purchaseOrder/unstock";
import { GetAllProductsResponseType } from "@/@types/products";
import { ReceivingType } from "@/@types/purchaseOrder/receiving";
import { CreditNoteLineType, CreditNoteType } from "@/@types/purchaseOrder/creditNote";

import { getDateFromDayPickerDate, getFormDayPickerDate } from "@/utils/date";

export const getNormalizedResetData = (data: UnstockType): UnstockFormValues => {
	return {
		date: getDateFromDayPickerDate(data.unstockDate) || new Date(),
		lines: data.lines.map((line) => ({
			lineId: line.id,
			orderLineId: line.orderLineId,
			product: {
				product: line.product,
				quantity: +line.quantity,
				orderLineId: line.orderLineId,
			},
			batchOrSerialNumber: line.batchOrSerialNumber,
			unitOfMeasure: line.unitOfMeasure,
			quantity: line.quantity,
			unstockLocation: line.unstockLocation,
			expiryDate: getDateFromDayPickerDate(line.expiryDate) || undefined,
		})),
	};
};

export const getCreditNoteItemData = (
	creditNoteItem: CreditNoteLineType,
	receivingsArr: ReceivingType[],
	products?: GetAllProductsResponseType,
): UnstockLineFormType => {
	const lines = receivingsArr.map((receiving) => receiving.lines).flat();
	const receivingItem = lines.find((item) => item.orderLineId === creditNoteItem.orderLineId);
	const productItem = products?.allProducts.find((product) => product.id === creditNoteItem.product.id);

	return {
		lineId: "",
		orderLineId: creditNoteItem.orderLineId,
		product: {
			product: creditNoteItem.product,
			quantity: +creditNoteItem.quantity,
			orderLineId: creditNoteItem.orderLineId,
		},
		batchOrSerialNumber: receivingItem?.batchOrSerialNumber || "",
		unitOfMeasure: productItem?.unitOfMeasure || undefined,
		quantity: creditNoteItem.quantity,
		unstockLocation: receivingItem?.warehouse || undefined,
		expiryDate: getDateFromDayPickerDate(receivingItem?.expiryDate) || undefined,
	};
};

export const getNormalizedCopyCreditNoteData = (
	creditNote: CreditNoteType,
	receivingsArr: ReceivingType[],
	products?: GetAllProductsResponseType,
) => {
	const lines: UnstockLineFormType[] = creditNote.lines.map((item) => {
		const lines = receivingsArr.map((receiving) => receiving.lines).flat();
		const receivingItem = lines.find((line) => line.orderLineId === item.orderLineId);
		const productItem = products?.allProducts.find((product) => product.id === item.product.id);

		return {
			lineId: "",
			orderLineId: item.orderLineId,
			product: {
				product: item.product,
				quantity: +item.quantity,
				orderLineId: item.orderLineId,
			},
			batchOrSerialNumber: receivingItem?.batchOrSerialNumber || "",
			unitOfMeasure: productItem?.unitOfMeasure || undefined,
			quantity: item.quantity,
			unstockLocation: receivingItem?.warehouse || undefined,
			expiryDate: getDateFromDayPickerDate(receivingItem?.expiryDate) || undefined,
		};
	});

	return { lines };
};

const getNormalizedCreateLinesData = (data: UnstockLineFormType): CreateUnstockLine => {
	const unstockLocation = data.unstockLocation;
	const unitOfMeasure = data.unitOfMeasure;

	return {
		...(data.lineId ? { id: data.lineId } : {}),
		orderLineId: data.orderLineId,
		batchOrSerialNumber: data.batchOrSerialNumber,
		...(data.expiryDate ? { expiryDate: getFormDayPickerDate(data.expiryDate, true) } : {}),
		quantity: data.quantity,
		...(unstockLocation ? { warehouseId: unstockLocation.id } : {}),
		...(unitOfMeasure ? { uomId: unitOfMeasure.id } : {}),
	};
};

export const getNormalizedCreateUnstockData = (
	data: UnstockFormValues,
	creditNoteId: string,
): Omit<CreateUnstockType, "orderId"> => {
	return {
		creditNoteId: creditNoteId,
		unstockDate: getFormDayPickerDate(data.date, true),
		lines: data.lines.map(getNormalizedCreateLinesData),
	};
};
