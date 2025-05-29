import ReportsList from "../ReportsList";
import { IReportItem } from "../ReportItem";

const SalesReports = () => {
	const sales: IReportItem[] = [
		{
			url: "/reports/sales/by-product-details",
			title: "Sales by Product Details",
			content:
				"This report shows quantities, profit and additional financial summary for sales by product. It shows product quantity, amount invoiced, COGS, journal amount, tax and profit. The output can be customised using product details Use this report to view product sales by customer location (state, country, etc.).",
			isFavourite: false,
		},
		{
			url: "/reports/sales/invoices-and-credit-notes",
			title: "Sale Invoices & Credit Notes",
			content:
				"This report shows all authorised sale invoices and credit notes applicable to the selected time period. Use this report to see invoices and credit notes for each customer, what products it relates to and amount, tax and total. Amounts can be shown in customer currency or your base currency.",
			isFavourite: false,
		},
		{
			url: "/reports/sales/profit-by-sales-representatives",
			title: "Profit by Sales Representatives",
			content:
				"This report shows profit and additional financial summary by sales representatives. Use this report to see the amount invoiced, paid, COGS, profit, markup, gross margin for each sales representative’s sales per order or per customer. The output does not show product details.",
			isFavourite: false,
		},
	];

	return <ReportsList data={sales} name="Sales Reports" />;
};

export default SalesReports;
