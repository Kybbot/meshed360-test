export type StockPickerType = {
	id: string;
	name: string;
};

export type GetAllStockPickersResponseType = {
	pickers: StockPickerType[];
	totalCount: number;
	totalPages: number;
};

export type CreateStockPickerBody = {
	name: string;
};
