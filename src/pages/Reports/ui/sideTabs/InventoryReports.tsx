import ReportsList from "../ReportsList";
import { IReportItem } from "../ReportItem";

const InventoryReports = () => {
	const inventories: IReportItem[] = [
		{
			url: "/reports/inventory/movement-details",
			title: "Inventory Movement Details",
			content:
				"This report shows a summary of stock movements in a specified timeframe. Use this report to see inventory movement details for specific transactions including transaction reference, date, quantity in and out and cost in and out.",
			isFavourite: false,
		},
		{
			url: "/reports/inventory/product-stock-level",
			title: "Products Stock Level",
			content:
				"This report shows the current stock level of all active products in all locations. Use this report to see available, on-hand, allocated, on-order, reordered and minimum before reorder quantities. You can also check the stock on hand value and unit cost of products.",
			isFavourite: false,
		},
	];

	return <ReportsList data={inventories} name="Inventory Reports" />;
};

export default InventoryReports;
