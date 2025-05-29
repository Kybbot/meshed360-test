import { TaxRateType } from "@/@types/selects";
import { CreditNoteLineFormType, CreditNoteServiceLineFormType } from "@/@types/purchaseOrder/creditNote";

export const calculateTotal = (
	price: number = 0,
	quantity: number = 0,
	discount: number = 0,
	taxInclusive: boolean,
	taxType?: TaxRateType,
) => {
	if (isNaN(price) || isNaN(quantity)) {
		return {
			total: "0.00",
			totalTax: "0.00",
		};
	}

	if (price < 0) {
		return {
			total: "0.00",
			totalTax: "0.00",
			totalErrorMesssage: "Negative",
		};
	}

	if (price === 0 || quantity === 0) {
		return {
			total: "0.00",
			totalTax: "0.00",
		};
	}

	const discountValue = isNaN(discount) ? 0 : discount / 100;
	const effectiveTaxRate = taxType ? taxType.effectiveTaxRate / 100 : 0;

	const totalBeforeDiscount = price * quantity;
	const discountAmount = totalBeforeDiscount * discountValue;
	const totalAfterDiscount = totalBeforeDiscount - discountAmount;
	const totalTax = totalAfterDiscount * effectiveTaxRate;

	const finalValue = taxInclusive ? totalAfterDiscount : totalAfterDiscount + totalTax;

	return {
		total: finalValue.toFixed(2),
		totalTax: totalTax.toFixed(2),
	};
};

export const calculateFooterValues = (data: (CreditNoteLineFormType | CreditNoteServiceLineFormType)[]) => {
	const totalQuantity = data.reduce((prev, curr) => {
		if (curr.quantity) {
			return +curr.quantity + prev;
		}
		return prev;
	}, 0);

	const totalPrice = data
		.reduce((prev, curr) => {
			if (curr.unitPrice) {
				return +curr.unitPrice + prev;
			}
			return prev;
		}, 0)
		.toFixed(2);

	const total = data
		.reduce((prev, curr) => {
			if (curr.total) {
				return +curr.total + prev;
			}
			return prev;
		}, 0)
		.toFixed(2);

	return { totalQuantity, totalPrice, total };
};

export const calculateTotalTableValues1 = (data: CreditNoteLineFormType[], taxInclusive: boolean) => {
	return data.reduce(
		(prev, curr) => {
			const { total, totalTax } = calculateTotal(
				+curr.unitPrice,
				+curr.quantity,
				+curr.discount,
				taxInclusive,
			);

			const beforeTax = prev.beforeTax + (+total - +totalTax);
			const tax = prev.tax + +totalTax;

			return {
				beforeTax,
				tax,
				total: beforeTax + tax,
			};
		},
		{ beforeTax: 0, tax: 0, total: 0 },
	);
};

export const calculateTotalTableValues2 = (data: CreditNoteServiceLineFormType[], taxInclusive: boolean) => {
	return data.reduce(
		(prev, curr) => {
			const { total, totalTax } = calculateTotal(
				+curr.unitPrice,
				+curr.quantity,
				+curr.discount,
				taxInclusive,
				curr.tax,
			);

			const beforeTax = prev.beforeTax + (+total - +totalTax);
			const tax = prev.tax + +totalTax;

			return {
				beforeTax,
				tax,
				total: beforeTax + tax,
			};
		},
		{ beforeTax: 0, tax: 0, total: 0 },
	);
};
