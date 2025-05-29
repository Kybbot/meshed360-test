import { FC } from "react";

const textBlocks = [
	{
		subtitle: "Chart of Accounts",
		text: "Any changes you make to the chart of accounts in Xero will automatically sync to Meshed360. The chart of accounts is read-only within Meshed360.",
	},
	{
		subtitle: "Tax Rules",
		text: "When you update tax rules in Xero, those updates will sync to Meshed360.",
	},
	{
		subtitle: "Suppliers / Customers",
		text: "Xero contacts and Meshed360 suppliers/customers stay in sync. Any changes you make in one system will be reflected in the other.",
	},
	{
		subtitle: "Items / Products",
		text: "Products created or updated in Meshed360 are pushed to Xero. You can also configure Meshed360 to pick up any item changes made in Xero (optional).",
		note: "Xero's built-in inventory functionality is not compatible with Meshed360. If you currently track stock in Xero, you'll need to remove it and recreate your inventory in Meshed360.",
	},
	{
		subtitle: "Invoices",
		text: "Invoices that are authorized in Meshed360 will automatically export to Xero. Invoices authorized in Xero can also be pulled into Meshed360 (optional).",
	},
	{
		subtitle: "Credit Notes",
		text: "Credit notes authorized in Meshed360 will be exported to Xero. Credit notes created in Xero are not brought into Meshed360.",
	},
	{
		subtitle: "Payments and Receipts",
		text: "Payments and receipts are pulled from Xero to Meshed360.",
	},
	{
		subtitle: "Manual Journals",
		text: "Meshed360 will create manual journals in Xero to reflect various transactions—such as cost of goods sold (COGS), assembly, disassembly, stock adjustments, and purchase Additional Expenses entries.",
	},
	{
		subtitle: "Tracking Categories",
		text: "You can map Xero tracking categories to Meshed360. This mapping allows you to include tracking information on invoices, credit notes, and journals when exporting to Xero.",
	},
];

const Info: FC = () => {
	return (
		<div className="xeroConfig__card">
			<div className="xeroConfig__header">
				<h2 className="xeroConfig__title">How Integration works</h2>
			</div>
			<p className="info__text">
				Integration with Xero is bidirectional. To initiate the process, simply click the Xero logo at the top
				right corner of the page and select Connect to Xero.
			</p>
			{textBlocks.map((block, index) => (
				<div key={index} className="info__textBlock">
					<h3 className="info__subTitle">{block.subtitle}</h3>
					<p className="info__text">{block.text}</p>
					{block.note && (
						<p className="info__text">
							<span className="info__text info__text--bold">Note: </span>
							{block.note}
						</p>
					)}
				</div>
			))}
		</div>
	);
};

export default Info;
