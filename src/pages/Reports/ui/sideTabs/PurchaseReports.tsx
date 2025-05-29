import ReportsList from "../ReportsList";
import { IReportItem } from "../ReportItem";

const PurchaseReports = () => {
	const purchases: IReportItem[] = [
		{
			url: "/reports/purchase/purchase-order-details",
			title: "Purchase Order Details",
			content:
				"This report shows details of purchase orders. This detailed view breaks down purchase orders by product. Use this report to see details of which products are ordered and item quantity, product cost and total product cost per order.",
			isFavourite: false,
		},
		{
			url: "/reports/purchase/purchase-order-vs-invoice",
			title: "Purchase Order vs Invoice",
			content:
				"This report compares what has been ordered vs what has been invoiced. Use this report to view discrepancies between order and invoice item quantity, order and invoice cost per item, and order and invoice total.",
			isFavourite: false,
		},
		{
			url: "/reports/purchase/stock-received-vs-invoiced",
			title: "Stock Received vs Invoice",
			content:
				"This report compares stock received vs invoice. Use this report to see what has been received but not invoiced or what has been invoiced but not received, along with the order total. You can choose the currency in which to display the order total.",
			isFavourite: false,
		},
		{
			url: "/reports/purchase/cost-analysis",
			title: "Purchase Cost Analysis",
			content:
				"Purchase Cost Analysis Report detailing the costs associated with purchasing every product during a given period. Use this report to view quantity, main cost, additional cost, journal cost and tax for every product purchased over the report period. The output can be customised to show product details, PO no., supplier, location, status and time period.",
			isFavourite: false,
		},
	];

	return <ReportsList data={purchases} name="Purchase Reports" />;
};

export default PurchaseReports;
