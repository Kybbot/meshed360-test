const reportsApis = {
	getSalesByProductDetails: {
		qweryKey: "get-sales-by-product-details",
		apiUrl: "/api/reports/sales/by-product-details/",
	},
	getSalesInvoicesAndCreditNotes: {
		qweryKey: "get-sales-invoices-and-credit-notes",
		apiUrl: "/api/reports/sales/invoices-and-credit-notes/",
	},
	getProfitBySalesRepresentative: {
		qweryKey: "get-profit-by-sales-representative",
		apiUrl: "/api/reports/sales/profit-by-sales-representative/",
	},
	getPurchaseOrderDetails: {
		qweryKey: "get-purchase-order-details",
		apiUrl: "/api/reports/purchase/purchase-order-details/",
	},
	getPurchaseOrderVsInvoice: {
		qweryKey: "get-purchase-order-vs-invoice",
		apiUrl: "/api/reports/purchase/purchase-order-vs-invoice/",
	},
	getStockReceivedVsInvoiced: {
		qweryKey: "get-stock-received-vs-invoiced",
		apiUrl: "/api/reports/purchase/stock-received-vs-invoiced/",
	},
	getPurchaseCostAnalysis: {
		qweryKey: "get-purchase-cost-analysis",
		apiUrl: "/api/reports/purchase/cost-analysis/",
	},
	getProductStockLevel: {
		qweryKey: "get-product-stock-level",
		apiUrl: "/api/reports/inventory/product-stock-level/",
	},
	getInventoryMovementDetails: {
		qweryKey: "get-inventory-movement-details",
		apiUrl: "/api/reports/inventory/movement-details/",
	},
} as const;

export default reportsApis;
