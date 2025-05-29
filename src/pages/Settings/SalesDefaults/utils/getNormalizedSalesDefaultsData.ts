import {
	marginThresholdByKey,
	SalesDefaultsFormValues,
	GetSalesDefaultsResponseType,
	UpdateSalesDefaultsRequestBody,
} from "@/@types/salesDefaults";

export const normalizeSalesDefaults = (data: SalesDefaultsFormValues): UpdateSalesDefaultsRequestBody => ({
	automatedServiceFee: data.automatedServiceFee,
	automatedServiceFeePercentage: data.automatedServiceFeePercentage,
	pickingIsAutomatic: data.pickingIsAutomatic,
	packingIsManual: data.packingIsManual,
	shippingIsManual: data.shippingIsManual,
	marginThreshold: data.marginThreshold,
	marginThresholdPercentage: data.marginThresholdPercentage,
	quoteFirst: data.quoteFirst,
	defaultTaxRule: data.isDefaultTaxRateInclusive ? "INCLUSIVE" : "EXCLUSIVE",
	accountId: data.account?.id ?? null,
	taxTypeId: data.taxType?.id ?? null,
	marginThresholdBasedOn: data.marginThresholdBasedOn.id as "AVERAGE_COST" | "LAST_COST",
});

export const denormalizeSalesDefaults = (data: GetSalesDefaultsResponseType): SalesDefaultsFormValues => ({
	automatedServiceFee: data.automatedServiceFee,
	automatedServiceFeePercentage: data.automatedServiceFeePercentage,
	account: data.account,
	accounts: data.accounts,
	taxType: data.taxType,
	taxTypes: data.taxTypes,
	pickingIsAutomatic: data.pickingIsAutomatic,
	packingIsManual: data.packingIsManual,
	shippingIsManual: data.shippingIsManual,
	marginThreshold: data.marginThreshold,
	marginThresholdPercentage: data.marginThresholdPercentage,
	marginThresholdBasedOn: marginThresholdByKey[data.marginThresholdBasedOn],
	quoteFirst: data.quoteFirst,
	isDefaultTaxRateInclusive: data.isDefaultTaxRateInclusive,
});
