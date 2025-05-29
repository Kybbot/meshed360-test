export type RoleType = {
	id: string;
	name: string;
	organisationId: string;
	permissions: Record<string, string>;
};

export type GetAllRolesResponseType = RoleType[];

export type RolesNameType = {
	id: string;
	name: string;
};

export type GetRolesNameResponseType = RolesNameType[];
