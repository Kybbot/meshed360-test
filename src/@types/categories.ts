export type CategoryType = {
	id: string;
	name: string;
	organisationId: string;
};

export type GetAllCategoriesResponseType = {
	categories: CategoryType[];
	totalCount: number;
	totalPages: number;
};

export type CreateCategoryBody = {
	name: string;
	organisationId: string;
};
