export type CurrencyType = {
	id: string;
	name: string;
	code: string;
};

export type CurrencyNameType = {
	id: string;
	name: string;
	code: string;
};

export type GetAllCurrenciesResponseType = {
	currencies: CurrencyType[];
	totalCount: number;
	totalPages: number;
};

export type GetAllCurrenciesNameResponseType = CurrencyNameType[];

export type CreateCurrencyBody = {
	name: string;
	code: string;
	organisationId: string;
};
