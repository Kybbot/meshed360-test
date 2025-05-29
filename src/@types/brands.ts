export type BrandType = {
	id: string;
	name: string;
	organisationId: string;
};

export type GetAllBrandsResponseType = {
	brands: BrandType[];
	totalCount: number;
	totalPages: number;
};

export type CreateBrandBody = {
	name: string;
	organisationId: string;
};
