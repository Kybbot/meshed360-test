export type GetPurchaseDefaults = {
	allowOverReceive: boolean;
	billFirst: boolean;
	isDefaultTaxRateInclusive: boolean;
	limitProductBySupplier: boolean;
};

export type UpdatePurchaseDefaults = GetPurchaseDefaults;
