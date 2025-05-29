export type SelectOption = {
	id: string;
	name: string;
};

export type SelectOptionOnlyWithName = {
	id?: string;
	name: string;
};

export type TaxRateType = {
	id: string;
	name: string;
	taxType: string;
	reportTaxType: string;
	canApplyToAssets: boolean;
	canApplyToEquity: boolean;
	canApplyToExpenses: boolean;
	canApplyToLiabilities: boolean;
	canApplyToRevenue: boolean;
	displayTaxRate: number;
	effectiveTaxRate: number;
	status: string;
	organisationId: string;
};

export type GetAllTaxRatesResponseType = TaxRateType[];

export type GetAllAccountsResponseType = SelectOption[];
