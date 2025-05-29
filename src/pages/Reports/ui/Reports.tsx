import { FC } from "react";
// import * as Tabs from "@radix-ui/react-tabs";

import { CommonPage, CommonPageHeader, CommonPageTitle } from "@/components/widgets/Page";
import AllReports from "./tabs/AllReports/AllReports";
// import Drafts from "./tabs/Drafts/Drafts";
// import Published from "./tabs/Published/Published";
// import Archived from "./tabs/Archived/Archived";

// const tabsNames = {
// 	allReports: "allreports",
// 	drafts: "drafts",
// 	published: "published",
// 	archived: "archived",
// };

// const tabsNav = [
// { content: "AllReports", name: tabsNames.allReports, iconName: "sales" },
// { content: "Drafts", name: tabsNames.drafts, iconName: "emptyFile" },
// { content: "Published", name: tabsNames.published, iconName: "sliders" },
// { content: "Archived", name: tabsNames.archived, iconName: "sliders" },
// ];

const Reports: FC = () => {
	return (
		<CommonPage>
			<div className="main__container">
				<CommonPageHeader>
					<CommonPageTitle>Reports</CommonPageTitle>
				</CommonPageHeader>
				<AllReports />
				{/* <Tabs.Root className="tabs" defaultValue={tabsNav[0].name}>
					<div className="tabs__header tabs__header--simple" style={{ borderBottom: "1px solid #e6e9f4" }}>
						<Tabs.List className="tabs__nav" aria-label="Reports">
							{tabsNav.map((item) => (
								<Tabs.Trigger key={item.name} className="tabs__btn" value={item.name}>
									<svg focusable="false" aria-hidden="true" width="18" height="18">
										<use xlinkHref={`/icons/icons.svg#${item.iconName}`} />
									</svg>
									{item.content}
								</Tabs.Trigger>
							))}
						</Tabs.List>
					</div>
					<Tabs.Content className="tabs__content" value={tabsNames.allReports}>
						<AllReports />
					</Tabs.Content>
					<Tabs.Content className="tabs__content" value={tabsNames.drafts}>
						<Drafts />
					</Tabs.Content>
					<Tabs.Content className="tabs__content" value={tabsNames.published}>
						<Published />
					</Tabs.Content>
					<Tabs.Content className="tabs__content" value={tabsNames.archived}>
						<Archived />
					</Tabs.Content>
				</Tabs.Root> */}
			</div>
		</CommonPage>
	);
};

export default Reports;
