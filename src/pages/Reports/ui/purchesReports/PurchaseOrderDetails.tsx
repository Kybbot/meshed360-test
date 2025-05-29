import ReportTamplate from "../ReportTamplate";

const PurchaseOrderDetails = () => {
	return (
		<ReportTamplate
			reportApiKey="getPurchaseOrderDetails"
			layoutOptionsName="purchaseOrderDetailsLayoutOptions"
			title="Purchase Order Details"
		/>
	);
};

export default PurchaseOrderDetails;
