import ReportTamplate from "../ReportTamplate";

const PurchaseCostAnalysis = () => {
	return (
		<ReportTamplate
			reportApiKey="getPurchaseCostAnalysis"
			layoutOptionsName="purchaseCostAnalysisLayoutOptions"
			title="Purchase Cost Analysis"
		/>
	);
};

export default PurchaseCostAnalysis;
