import { FC } from "react";

import GeneralSettingsCard from "./GeneralSettingsCard";

const generalSettingsCards = [
	{
		iconName: "organisation",
		title: "Organisation",
		links: [
			{
				name: "Profile",
				url: "/settings/general-settings/profile",
				description: "General organisation detail including contact information and addresses.",
			},
			{
				name: "Currencies",
				url: "/settings/general-settings/currencies",
				description: "Manage the currencies that you use in your organisation.",
			},
		],
	},
	{
		iconName: "financial",
		title: "Financial",
		links: [
			{
				name: "Default Account Mapping",
				url: "/settings/general-settings/default-account-mapping",
				description: "Configure mapping between chart of accounts and related processes.",
			},
			// {
			// 	name: "Chart of Accounts",
			// 	url: "/settings/general-settings/chart-of-accounts",
			// 	description: "Configure and maintain ledger accounts.",
			// },
			{
				name: "Payment Terms",
				url: "/settings/general-settings/payment-terms",
				description: "Configure payment terms for customer invoices and supplier bills.",
			},
			// {
			// 	name: "Tax Types",
			// 	url: "/settings/general-settings/tax-types",
			// 	description: "Configure tax types to be used in customer invoices and supplier bills.",
			// },
		],
	},
	{
		iconName: "stock",
		title: "Stock",
		links: [
			{
				name: "Warehouses",
				url: "/settings/general-settings/warehouses",
				description: "Create and manage details of your warehouses / locations of where you keep your stock.",
			},
			{
				name: "Categories",
				url: "/settings/general-settings/categories",
				description: "Create and update categories by which your stock can be categorised.",
			},
			{
				name: "Brands",
				url: "/settings/general-settings/brands",
				description: "Create and update brand names by which your stock can be branded.",
			},
			{
				name: "Units of Measure",
				url: "/settings/general-settings/units-of-measure",
				description: "Create and update units of measurement to be applied to your stock items.",
			},
			{
				name: "Stock Pickers",
				url: "/settings/general-settings/stock-pickers",
				description: "Create and update stock pickers to whom stock can be assigned.",
			},
			{
				name: "Carriers",
				url: "/settings/general-settings/carriers",
				description: "Create and update carriers to whom stock can be assigned to for shipping.",
			},
		],
	},
	{
		iconName: "sales",
		title: "Sales",
		links: [
			{
				name: "Pricelist Names",
				url: "/settings/general-settings/pricelist-names",
				description: "Manage the names of your pricelists.",
			},
			{
				name: "Sales Defaults",
				url: "/settings/general-settings/sales-defaults",
				description:
					"Configure and maintain default sales event settings like invoice number generation and assignment.",
			},
			{
				name: "Sales Reps",
				url: "/settings/general-settings/sales-reps",
				description: "Create and update sales representatives for your organisation.",
			},
		],
	},
	{
		iconName: "purchases",
		title: "Purchases",
		links: [
			{
				name: "Purchase Defaults",
				url: "/settings/general-settings/purchase-defaults",
				description:
					"Configure and maintain default purchase event settings like invoice number generation and assignment.",
			},
		],
	},
	{
		iconName: "transactionDocuments",
		title: "Transaction Documents",
		links: [
			{
				name: "Document Numbering",
				url: "/settings/general-settings/document-numbering",
				description:
					"Configure document numbering format and next sequence numbering for documents like sales orders, purchase orders, credit notes and more.",
			},
			{
				name: "Document Templates",
				url: "/settings/general-settings/document-templates",
				description: "Customize the look and feel of all stationery and documents.",
			},
		],
	},
];

const GeneralSetting: FC = () => {
	return (
		<section className="generalSettings">
			<div className="main__container">
				<div className="generalSettings__cards">
					{generalSettingsCards.map((card) => (
						<GeneralSettingsCard key={card.iconName} {...card} />
					))}
				</div>
			</div>
		</section>
	);
};

export default GeneralSetting;
