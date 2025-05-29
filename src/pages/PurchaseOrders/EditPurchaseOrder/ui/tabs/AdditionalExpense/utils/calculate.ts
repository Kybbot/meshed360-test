import { TaxRateType } from "@/@types/selects";

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
