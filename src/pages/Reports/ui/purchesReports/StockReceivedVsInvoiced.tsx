import ReportTamplate from "../ReportTamplate";

const StockReceivedVsInvoiced = () => {
	return (
		<ReportTamplate
			reportApiKey="getStockReceivedVsInvoiced"
			layoutOptionsName="stockReceivedVsInvoicedLayoutOptions"
			title="Stock Received vs Invoice"
		/>
	);
};

export default StockReceivedVsInvoiced;
