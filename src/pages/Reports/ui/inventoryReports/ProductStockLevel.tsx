import ReportTamplate from "../ReportTamplate";

const ProductStockLevel = () => {
	return (
		<ReportTamplate
			reportApiKey="getProductStockLevel"
			layoutOptionsName="productStockLevelLayoutOptions"
			title="Products Stock Level"
		/>
	);
};

export default ProductStockLevel;
