export type ReportsTable = {
	table: {
		headers: string[];
		rows: {
			columns: string[];
			isTotal: boolean;
		}[];
	};
	totalCount: number;
	totalPages: number;
};
