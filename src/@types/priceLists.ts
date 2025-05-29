export type PriceListType = {
	id: string;
	name: string;
	currencyId: string;
	currencyDescription: string;
	priceListContent: { productid: string; price: number }[] | null;
};

export type GetAllPriceListsResponseType = {
	priceLists: PriceListType[];
	totalCount: number;
	totalPages: number;
};

export type GetPriceListByIdResponseType = {
	priceList: PriceListType;
};

export type CreatePriceListBody = {
	name: string;
	currencyId: string;
	organisationId: string;
};

export type SetProductPricesRequestType = {
	priceLists: {
		id: string;
		price: number;
	}[];
};
