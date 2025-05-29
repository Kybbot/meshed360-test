export type WarehousType = {
	id: string;
	name: string;
	comments: string;
	organisationId: string;

	addressDetails: {
		addressLine1: string;
		addressLine2: string;
		city: string;
		postalCode: string;
		state: string;
		country: string;
	};
};

export type GetAllWarehousesResponseType = {
	warehouses: WarehousType[];
	totalCount: number;
	totalPages: number;
};

export type CreateWarehousBody = {
	name: string;
	comments: string;
	organisationId: string;

	addressDetails: {
		addressLine1: string;
		addressLine2: string;
		city: string;
		postalCode: string;
		state: string;
		country: string;
	};
};
