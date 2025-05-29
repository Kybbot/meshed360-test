export type CarrierType = {
	id: string;
	name: string;
};

export type GetAllCarriesResponseType = {
	carriers: CarrierType[];
	totalCount: number;
	totalPages: number;
};

export type CreateCarrierBody = {
	name: string;
};
