import ReportTamplate from "../ReportTamplate";

const ProfitBySalesRepresentative = () => {
	return (
		<ReportTamplate
			reportApiKey="getProfitBySalesRepresentative"
			layoutOptionsName="profitBySalesRepresentativeLayoutOptions"
			title="Profit by Sales Representatives"
		/>
	);
};

export default ProfitBySalesRepresentative;
