import { ProductBOMLineFormValues, ProductBOMServiceLineFormValues } from "@/@types/products";

export const calculateTotal = (price: number = 0, quantity: number = 0) => {
	if (isNaN(price) || isNaN(quantity)) {
		return {
			total: "0.00",
		};
	}

	if (price < 0 || quantity < 0) {
		return {
			total: "0.00",
			totalErrorMessage: "Negative",
		};
	}

	if (price === 0 || quantity === 0) {
		return {
			total: "0.00",
		};
	}

	const finalValue = price * quantity;

	return {
		total: finalValue.toFixed(2),
	};
};

export const calculateTotalCost = (
	isAssembly: boolean,
	quantityToUse: number,
	wastagePercentage: number,
	wastageQuantity: number,
	unitCost: number,
	disassemblyCostPercentage: number,
	totalServiceCost: number,
) => {
	if (
		isNaN(quantityToUse) ||
		isNaN(wastagePercentage) ||
		isNaN(wastageQuantity) ||
		isNaN(unitCost) ||
		isNaN(disassemblyCostPercentage)
	) {
		return {
			totalCost: "0.00",
		};
	}

	if (quantityToUse < 0 || wastagePercentage < 0 || wastageQuantity < 0 || unitCost < 0) {
		return {
			totalCost: "0.00",
		};
	}

	if (unitCost === 0) {
		return {
			totalCost: "0.00",
		};
	}

	if (isAssembly) {
		const wastageType = wastagePercentage > 0 ? "percentage" : "quantity";
		const wastage = wastageType === "quantity" ? wastageQuantity : (wastagePercentage / 100) * quantityToUse;

		const totalCost = ((quantityToUse + wastage) * unitCost).toFixed(2);

		return { totalCost };
	} else {
		const totalCost = (
			quantityToUse * unitCost +
			(disassemblyCostPercentage / 100) * totalServiceCost
		).toFixed(2);

		return { totalCost };
	}
};

export const calculateFooterValues1 = (data: ProductBOMLineFormValues[]) => {
	const total = data
		.reduce((prev, curr) => {
			if (curr.totalCost) {
				return +curr.totalCost + prev;
			}
			return prev;
		}, 0)
		.toFixed(2);

	return { total };
};

export const calculateFooterValues2 = (data: ProductBOMServiceLineFormValues[]) => {
	const total = data
		.reduce((prev, curr) => {
			if (curr.unitCost && curr.quantity) {
				return +curr.unitCost * +curr.quantity + prev;
			}
			return prev;
		}, 0)
		.toFixed(2);

	return { total };
};
