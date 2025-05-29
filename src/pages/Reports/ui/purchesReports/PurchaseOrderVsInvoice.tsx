import ReportTamplate from "../ReportTamplate";

const PurchaseOrderVsInvoice = () => {
	return (
		<ReportTamplate
			reportApiKey="getPurchaseOrderVsInvoice"
			layoutOptionsName="purchaseOrderVsInvoiceLayoutOptions"
			title="Purchase Order vs Invoice"
		/>
	);
};

export default PurchaseOrderVsInvoice;
