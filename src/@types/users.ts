export type UserType = {
	user: {
		id: string;
		name: string;
		email: string;
		status: string;
	};
	roles: {
		id: string;
		name: string;
		organisationId: string;
		permissions: null;
	}[];
};

export type GetAllUsersResponseType = {
	users: UserType[];
	totalCount: number;
	totalPages: number;
};

export type CreateUserBody = {
	name: string;
	email: string;
	password: string;
	organisationId: string;
	roleIds: string[];
	status: "active" | "inactive";
};

export type UpdateUserBody = {
	name: string;
	email: string;
	password?: string;
	roleIds: string[];
	organisationId: string;
	status: "active" | "inactive";
};
