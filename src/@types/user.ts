export type GetUserInfoResponseType = {
	user: {
		id: string;
		name: string;
	};
	organisations: {
		id: string;
		name: string;
		marginThreshold: number;
		trackingCategories?: {
			id: string;
			name: string;
			categories: {
				id: string;
				name: string;
				status: string;
			}[];
		}[];
		roles: {
			id: string;
			name: string;
		}[];
	}[];
};
