export type SalesRepType = {
	id: string;
	name: string;
	email: string;
	phone: string;
	organisationId: string;
};

export type GetAllSalesRepsResponseType = {
	salesReps: SalesRepType[];
	totalCount: number;
	totalPages: number;
};

export type CreateSalesRepBody = {
	name: string;
	email: string;
	contactNumber: string;
	organisationId: string;
};
