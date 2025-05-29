import ReportTamplate from "../ReportTamplate";

const SalesByProductDetails = () => {
	return (
		<ReportTamplate
			reportApiKey="getSalesByProductDetails"
			layoutOptionsName="salesByProductsLayoutOptions"
			title="Sales by Product Detail"
		/>
	);
};

export default SalesByProductDetails;
