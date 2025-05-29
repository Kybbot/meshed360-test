import { FC } from "react";
// import * as Tabs from "@radix-ui/react-tabs";

import { UsersTable } from "./users/UsersTable";

import { CommonPage, CommonPageHeader, CommonPageTitle } from "@/components/widgets/Page";

// const tabsNames = {
// 	users: "users",
// 	roles: "roles",
// };

// const tabsNav = [
// 	{ content: "Users", name: tabsNames.users },
// 	{ content: "Roles", name: tabsNames.roles },
// ];

const UsersRoles: FC = () => {
	return (
		<CommonPage>
			<div className="main__container">
				<CommonPageHeader isSimple>
					<CommonPageTitle>Users</CommonPageTitle>
				</CommonPageHeader>
				<UsersTable />
				{/* <Tabs.Root className="tabs" defaultValue={tabsNav[0].name}>
					<div className="tabs__header">
						<Tabs.List className="tabs__nav" aria-label="Manage users & roles">
							{tabsNav.map((item) => (
								<Tabs.Trigger key={item.name} className="tabs__btn" value={item.name}>
									{item.content}
								</Tabs.Trigger>
							))}
						</Tabs.List>
					</div>
					<Tabs.Content className="tabs__content" value={tabsNames.users}>
						<UsersTable />
					</Tabs.Content>
					<Tabs.Content className="tabs__content" value={tabsNames.roles}>
						Roles
					</Tabs.Content>
				</Tabs.Root> */}
			</div>
		</CommonPage>
	);
};

export default UsersRoles;
