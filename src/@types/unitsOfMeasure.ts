export type UnitOfMeasureType = {
	id: string;
	name: string;
	organisationId: string;
};

export type GetAllUnitsOfMeasureResponseType = {
	unitsOfMeasure: UnitOfMeasureType[];
	totalCount: number;
	totalPages: number;
};

export type CreateUnitOfMeasureBody = {
	name: string;
	organisationId: string;
};
