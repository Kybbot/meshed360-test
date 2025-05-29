import ReportTamplate from "../ReportTamplate";

const SalesInvoicesAndCreditNotes = () => {
	return (
		<ReportTamplate
			reportApiKey="getSalesInvoicesAndCreditNotes"
			layoutOptionsName="invoicesCreditLayoutOptions"
			title="Sale Invoices & Credit Notes"
		/>
	);
};

export default SalesInvoicesAndCreditNotes;
