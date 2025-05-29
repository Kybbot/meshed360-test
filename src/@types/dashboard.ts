export type GetDashboardDataResponseType = {
	grossProfit: number;
	salesOrders: number;
	averageRevenuePerSale: number;
	createdPurchaseOrderValue: number;
	unitsSold: number;
	totalCustomers: number;
	assemblyCosts: number;
	recentSales: {
		name: string;
		date: string;
		amount: number;
		status: "PAID" | "PENDING";
	}[];
	productRevenueByBrand: {
		name: string;
		revenue: number;
	}[];
};
