export type StockAvailabilityType = {
	productId: string;
	category: string | null;
	brand: string | null;
	product: string;
	unit: string | null;
	location: string;
	locationName: string;
	batch: string | null;
	expiryDate: string | null;
	stockValue: string;
	onHand: string;
	available: string;
	onOrder: string;
	allocated: string;
	nextDelivery: string;
};

export type GetStockAvailabilityResponseType = {
	data: StockAvailabilityType[];
	totalCount: number;
	totalPages: number;
};

export type GetOnOrderDetailsResponseType = {
	data: {
		purchaseOrderId: string;
		purchaseOrderNumber: string;
		effectiveDate: string;
		quantity: string;
	}[];
	totalCount: number;
	totalPages: number;
};

export type GetAllocatedDetailsResponseType = {
	data: {
		salesOrderId: string;
		salesOrderNumber: string;
		customer: string;
		effectiveDate: string;
		quantity: string;
	}[];
	totalCount: number;
	totalPages: number;
};
