import * as Tabs from "@radix-ui/react-tabs";

import Favourites from "./Favourites";
import PurchaseReports from "./PurchaseReports";
import SalesReports from "./SalesReports";
import InventoryReports from "./InventoryReports";
import FinancialReports from "./FinancialReports";
import AuditReports from "./AuditReports";
import ProductionReports from "./ProductionReports";

const tabsNames = {
	favourites: "favourites",
	purchaseReports: "purchaseReports",
	salesReports: "salesReports",
	inventoryReports: "inventoryReports",
	financialReports: "financialReports",
	auditReports: "auditReports",
	productionReports: "productionReports",
};

const tabsNav = [
	// { content: "Favourites", name: tabsNames.favourites },
	{ content: "Purchase Reports", name: tabsNames.purchaseReports },
	{ content: "Sales Reports", name: tabsNames.salesReports },
	{ content: "Inventory Reports", name: tabsNames.inventoryReports },
	// { content: "Financial Reports", name: tabsNames.financialReports },
	// { content: "Audit Reports", name: tabsNames.auditReports },
	// { content: "Production Reports", name: tabsNames.productionReports },
];

const SideTabs = () => {
	return (
		<div className="side-tabs__container" style={{ marginTop: "40px" }}>
			<Tabs.Root className="tabs vertical-tabs" defaultValue={tabsNav[0].name} orientation="vertical">
				<div className="tabs__header tabs__header--simple">
					<Tabs.List className="tabs__nav" aria-label="All Reports">
						{tabsNav.map((item) => (
							<Tabs.Trigger key={item.name} className="tabs__btn" value={item.name}>
								{item.content}
							</Tabs.Trigger>
						))}
					</Tabs.List>
				</div>
				<Tabs.Content className="tabs__content" value={tabsNames.favourites}>
					<Favourites />
				</Tabs.Content>
				<Tabs.Content className="tabs__content" value={tabsNames.purchaseReports}>
					<PurchaseReports />
				</Tabs.Content>
				<Tabs.Content className="tabs__content" value={tabsNames.salesReports}>
					<SalesReports />
				</Tabs.Content>
				<Tabs.Content className="tabs__content" value={tabsNames.inventoryReports}>
					<InventoryReports />
				</Tabs.Content>
				<Tabs.Content className="tabs__content" value={tabsNames.financialReports}>
					<FinancialReports />
				</Tabs.Content>
				<Tabs.Content className="tabs__content" value={tabsNames.auditReports}>
					<AuditReports />
				</Tabs.Content>
				<Tabs.Content className="tabs__content" value={tabsNames.productionReports}>
					<ProductionReports />
				</Tabs.Content>
			</Tabs.Root>
		</div>
	);
};

export default SideTabs;
