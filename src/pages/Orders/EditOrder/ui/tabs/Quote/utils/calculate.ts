import {
	DefaultOrderLineType,
	MeatOrderLineType,
	OrderServiceLineType,
	WoolworthsOrderLineType,
} from "@/@types/salesOrders/local.ts";

export const calculateMargin = (
	price: number = 0,
	cost: number,
	discount: number = 0,
	marginThreshold: number = 0,
) => {
	if (isNaN(price) || isNaN(cost)) {
		return {
			marginPercentage: "0.00",
			marginPercentageErrorMessage: "",
		};
	}

	if (price < 0) {
		return {
			marginPercentage: "0.00",
			marginErrorMesssage: "Negative",
			marginPercentageErrorMessage: "",
		};
	}

	if (price === 0) {
		return {
			marginPercentage: "0.00",
			marginPercentageErrorMessage: "",
		};
	}

	const discountValue = isNaN(discount) ? 0 : discount / 100;
	const discountedPrice = price - price * discountValue;

	if (discountedPrice === 0) {
		return {
			marginPercentage: "-100",
			marginPercentageErrorMessage: " ",
		};
	}

	const absoluteMargin = discountedPrice - cost;
	const marginPercentage = (absoluteMargin / discountedPrice) * 100;

	return {
		marginPercentage: marginPercentage.toFixed(2),
		...(marginPercentage < 0 || marginPercentage < marginThreshold
			? { marginPercentageErrorMessage: " " }
			: {}),
	};
};

export const calculateTotal = (price: number = 0, quantity: number = 0, discount: number = 0) => {
	if (isNaN(price) || isNaN(quantity)) {
		return {
			total: "0.00",
		};
	}

	if (price < 0) {
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

	const discountValue = isNaN(discount) ? 0 : discount / 100;

	const totalBeforeDiscount = price * quantity;
	const discountAmount = totalBeforeDiscount * discountValue;
	const totalAfterDiscount = totalBeforeDiscount - discountAmount;

	return {
		total: totalAfterDiscount.toFixed(2),
	};
};

export const calculatePrice = (total: number = 0, quantity: number = 0, discount: number = 0) => {
	if (isNaN(total) || isNaN(quantity)) {
		return {
			price: "0.00",
		};
	}

	if (total < 0) {
		return {
			price: "0.00",
			priceErrorMesssage: "Negative",
		};
	}

	if (total === 0 || quantity === 0) {
		return {
			price: "0.00",
		};
	}

	const discountValue = isNaN(discount) ? 0 : discount / 100;

	const divisor = quantity * (1 - discountValue);

	if (divisor === 0) {
		return {
			price: "0.00",
			priceErrorMesssage: "Invalid discount or quantity",
		};
	}

	const computedPrice = total / divisor;

	return {
		price: computedPrice.toFixed(2),
	};
};

export const calculateWoolworthTotal = (
	price: number = 0,
	quantity: number = 0,
	discount: number = 0,
	mass: number = 0,
) => {
	if (isNaN(price) || (isNaN(quantity) && isNaN(mass))) {
		return {
			total: "0.00",
		};
	}

	if (price < 0) {
		return {
			total: "0.00",
			totalErrorMesssage: "Negative",
		};
	}

	if (price === 0 || (quantity === 0 && mass === 0)) {
		return {
			total: "0.00",
		};
	}

	const discountValue = isNaN(discount) ? 0 : discount / 100;

	let totalBeforeDiscount = 0;

	if (mass) {
		totalBeforeDiscount = mass * price;
	}
	if (quantity) {
		totalBeforeDiscount = quantity * price;
	}

	const discountAmount = totalBeforeDiscount * discountValue;
	const totalAfterDiscount = totalBeforeDiscount - discountAmount;

	return {
		total: totalAfterDiscount.toFixed(2),
	};
};

export const calculateFooterValues = (data: (DefaultOrderLineType | OrderServiceLineType)[]) => {
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

export const calculateMeatFooterValues = (data: MeatOrderLineType[]) => {
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

	const totalMass = data
		.reduce((prev, curr) => {
			if (curr.mass) {
				return +curr.mass + prev;
			}
			return prev;
		}, 0)
		.toFixed(2);

	const totalAvgMass = data
		.reduce((prev, curr) => {
			if (curr.mass && curr.quantity) {
				return Number(curr.mass) / Number(curr.quantity) + prev;
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

	return { totalQuantity, totalPrice, totalMass, total, totalAvgMass };
};

export const calculateWoolworthsFooterValues = (data: WoolworthsOrderLineType[]) => {
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

	const totalMass = data
		.reduce((prev, curr) => {
			if (curr.mass) {
				return +curr.mass + prev;
			}
			return prev;
		}, 0)
		.toFixed(2);

	const totalAvgMass = data
		.reduce((prev, curr) => {
			if (curr.avgMass) {
				return +curr.avgMass + prev;
			}
			return prev;
		}, 0)
		.toFixed(2);

	const totalSLugs = data.reduce((prev, curr) => {
		if (curr.sLugs) {
			return +curr.sLugs + prev;
		}
		return prev;
	}, 0);

	const totalLLugs = data.reduce((prev, curr) => {
		if (curr.lLugs) {
			return +curr.lLugs + prev;
		}
		return prev;
	}, 0);

	const total = data
		.reduce((prev, curr) => {
			if (curr.total) {
				return +curr.total + prev;
			}
			return prev;
		}, 0)
		.toFixed(2);

	return { totalQuantity, totalPrice, totalMass, total, totalAvgMass, totalSLugs, totalLLugs };
};
