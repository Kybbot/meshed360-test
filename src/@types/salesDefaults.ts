import { SelectOption } from "./selects";

export type GetSalesDefaultsResponseType = {
	automatedServiceFee: boolean;
	automatedServiceFeePercentage: string;
	account?: SelectOption;
	accounts: SelectOption[];
	taxType?: SelectOption;
	taxTypes: SelectOption[];
	pickingIsAutomatic: boolean;
	packingIsManual: boolean;
	shippingIsManual: boolean;
	marginThreshold: boolean;
	marginThresholdPercentage: string;
	marginThresholdBasedOn: "AVERAGE_COST" | "LAST_COST";
	quoteFirst: boolean;
	isDefaultTaxRateInclusive: boolean;
};

export type UpdateSalesDefaultsRequestBody = {
	automatedServiceFee: boolean;
	automatedServiceFeePercentage: string;
	accountId: string | null;
	taxTypeId: string | null;
	pickingIsAutomatic: boolean;
	packingIsManual: boolean;
	shippingIsManual: boolean;
	marginThreshold: boolean;
	marginThresholdPercentage: string;
	marginThresholdBasedOn: "AVERAGE_COST" | "LAST_COST";
	quoteFirst: boolean;
	defaultTaxRule: "EXCLUSIVE" | "INCLUSIVE";
};

export const marginThresholdBasedOnOptions = [
	{ id: "AVERAGE_COST", name: "Average Cost" },
	{ id: "LAST_COST", name: "Last Cost" },
];

export const marginThresholdByKey: Record<string, SelectOption> = {
	AVERAGE_COST: { id: "AVERAGE_COST", name: "Average Cost" },
	LAST_COST: { id: "LAST_COST", name: "Last Cost" },
};

export type SalesDefaultsFormValues = {
	automatedServiceFee: boolean;
	automatedServiceFeePercentage: string;
	account?: SelectOption;
	accounts: SelectOption[];
	taxType?: SelectOption;
	taxTypes: SelectOption[];
	pickingIsAutomatic: boolean;
	packingIsManual: boolean;
	shippingIsManual: boolean;
	marginThreshold: boolean;
	marginThresholdPercentage: string;
	marginThresholdBasedOn: SelectOption;
	quoteFirst: boolean;
	isDefaultTaxRateInclusive: boolean;
};
