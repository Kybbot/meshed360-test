import { GetPurchaseDefaults, UpdatePurchaseDefaults } from "@/@types/purchaseDefaults";

export const normalizePurchaseDefaults = (data: GetPurchaseDefaults): UpdatePurchaseDefaults => ({
	allowOverReceive: data.allowOverReceive,
	billFirst: data.billFirst,
	isDefaultTaxRateInclusive: data.isDefaultTaxRateInclusive,
	limitProductBySupplier: data.limitProductBySupplier,
});

export const denormalizePurchaseDefaults = (data: GetPurchaseDefaults): GetPurchaseDefaults => ({
	allowOverReceive: data.allowOverReceive ?? false,
	billFirst: data.billFirst ?? false,
	isDefaultTaxRateInclusive: data.isDefaultTaxRateInclusive ?? false,
	limitProductBySupplier: data.limitProductBySupplier ?? false,
});
