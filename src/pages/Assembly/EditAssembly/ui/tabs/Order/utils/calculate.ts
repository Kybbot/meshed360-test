import { AssemblyLineFormType, AssemblyServiceFormType } from "@/@types/assembly/assembly";

export const calculateTotal = (price: number = 0, quantity: number = 0) => {
	if (isNaN(price) || isNaN(quantity)) {
		return {
			total: "0.00",
		};
	}

	if (price < 0 || quantity < 0) {
		return {
			total: "0.00",
			totalErrorMesssage: "Negative",
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

export const calculateTotalQuantity = (
	quantityToProduce: number,
	quantityToUse: number,
	wastagePercentage: number,
	wastageQuantity: number,
	available: number,
) => {
	if (
		isNaN(quantityToProduce) ||
		isNaN(quantityToUse) ||
		isNaN(wastagePercentage) ||
		isNaN(wastageQuantity)
	) {
		return {
			totalQuantity: "0.00",
		};
	}
	if (quantityToProduce < 0 || quantityToUse < 0 || wastagePercentage < 0 || wastageQuantity < 0) {
		return {
			totalQuantity: "0.00",
		};
	}

	if (quantityToProduce === 0) {
		return {
			totalQuantity: "0.00",
		};
	}

	const wastageType = wastagePercentage > 0 ? "percentage" : "quantity";
	const wastage = wastageType === "quantity" ? wastageQuantity : (wastagePercentage / 100) * quantityToUse;

	const finalValue = (quantityToUse + wastage) * quantityToProduce;
	const isError = available < finalValue;

	return {
		totalQuantity: finalValue.toFixed(2),
		...(isError ? { totalQuantityError: `Maximum quantity is ${available}` } : {}),
	};
};

export const calculateFooterValues1 = (data: AssemblyLineFormType[]) => {
	const total = data
		.reduce((prev, curr) => {
			if (curr.total) {
				return +curr.total + prev;
			}
			return prev;
		}, 0)
		.toFixed(2);

	return { total };
};

export const calculateFooterValues2 = (data: AssemblyServiceFormType[]) => {
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
