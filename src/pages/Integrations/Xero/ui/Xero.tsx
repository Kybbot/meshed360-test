import { FC, useState } from "react";
import { useStore } from "zustand";
import * as Tabs from "@radix-ui/react-tabs";

import { Sync } from "./tabs/Sync";
import { Configuration } from "./tabs/Configuration/Configuration";

import { Loader } from "@/components/shared/Loader";
import { Button } from "@/components/shared/Button";
import { ErrorMessage } from "@/components/shared/ErrorMessage";

import {
	CommonPage,
	CommonPageActions,
	CommonPageHeader,
	CommonPageTitle,
	XeroConnectionDialog,
} from "@/components/widgets/Page";

import { orgStore } from "@/app/stores/orgStore";

import { useGetOrganisationConnectionStatus } from "@/entities/organisations";

const tabsNames = {
	configuration: "configuration",
	sync: "sync",
};

const tabsNav = [
	{ content: "Configuration", name: tabsNames.configuration, iconName: "sliders" },
	{ content: "Sync", name: tabsNames.sync, iconName: "reset" },
];

const Xero: FC = () => {
	const { orgId } = useStore(orgStore);

	const [xeroDialog, setXeroDialog] = useState(false);

	const {
		data: organisationConnectionStatusData,
		error: organisationConnectionStatusError,
		isError: isOrganisationConnectionStatusError,
		isLoading: isOrganisationConnectionStatusLoading,
		isSuccess: isOrganisationConnectionStatusSuccess,
	} = useGetOrganisationConnectionStatus({ organisationId: orgId, isError: false });

	const handleConnectXeroBtn = () => {
		setXeroDialog(true);
	};

	return (
		<CommonPage>
			<div className="main__container">
				{isOrganisationConnectionStatusLoading ? (
					<Loader isFullWidth />
				) : isOrganisationConnectionStatusError && organisationConnectionStatusError ? (
					<ErrorMessage error={organisationConnectionStatusError} />
				) : isOrganisationConnectionStatusSuccess ? (
					<>
						{isOrganisationConnectionStatusSuccess && xeroDialog && (
							<XeroConnectionDialog
								orgId={orgId}
								dialogState={xeroDialog}
								setDialogState={setXeroDialog}
								data={organisationConnectionStatusData.data}
							/>
						)}
						<CommonPageHeader>
							<CommonPageTitle withoutPadding>
								<img
									width={57}
									height={57}
									alt="Xero logo"
									src="/imgs/xeroApp.png"
									srcSet="/imgs/xeroApp@2x.png"
								/>
								Xero
							</CommonPageTitle>
							{(!organisationConnectionStatusData.data.connectionStatus ||
								organisationConnectionStatusData.data.xeroOrganisations.length > 0) && (
								<CommonPageActions>
									<Button type="button" onClick={handleConnectXeroBtn}>
										{organisationConnectionStatusData.data.organisationName &&
										organisationConnectionStatusData.data.xeroOrganisations.length > 0
											? "Switch Xero organisation"
											: "Connect to Xero organisation"}
									</Button>
								</CommonPageActions>
							)}
						</CommonPageHeader>
						<Tabs.Root className="tabs" defaultValue={tabsNav[0].name}>
							<div className="tabs__header tabs__header--simple">
								<Tabs.List className="tabs__nav" aria-label="Manage users & roles">
									{(organisationConnectionStatusData.data.connectionStatus &&
									organisationConnectionStatusData.data.organisationName
										? tabsNav
										: tabsNav.slice(0, 1)
									).map((item) => (
										<Tabs.Trigger key={item.name} className="tabs__btn" value={item.name}>
											<svg focusable="false" aria-hidden="true" width="18" height="18">
												<use xlinkHref={`/icons/icons.svg#${item.iconName}`} />
											</svg>
											{item.content}
										</Tabs.Trigger>
									))}
								</Tabs.List>
							</div>
							<Tabs.Content className="tabs__content" value={tabsNames.configuration}>
								<Configuration connectionStatus={organisationConnectionStatusData.data.connectionStatus} />
							</Tabs.Content>
							{organisationConnectionStatusData.data.connectionStatus &&
								organisationConnectionStatusData.data.organisationName && (
									<Tabs.Content className="tabs__content" value={tabsNames.sync}>
										<Sync />
									</Tabs.Content>
								)}
						</Tabs.Root>
					</>
				) : (
					<p className="empty_list">No data available</p>
				)}
			</div>
		</CommonPage>
	);
};

export default Xero;
