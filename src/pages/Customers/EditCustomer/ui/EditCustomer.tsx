import { FC } from "react";
import { useStore } from "zustand";
import * as Tabs from "@radix-ui/react-tabs";
import { Link, useParams } from "react-router";
import { useMutationState } from "@tanstack/react-query";

import { Addresses } from "./tabs/Addresses/Addresses";
import { Contacts } from "./tabs/Contacts/Contacts";

import { Loader } from "@/components/shared/Loader";
import { Button } from "@/components/shared/Button";
import { ErrorMessage } from "@/components/shared/ErrorMessage";

import {
	CommonPage,
	CommonPageActions,
	CommonPageArrow,
	CommonPageHeader,
	CommonPageLine,
	CommonPageMain,
	CommonPageTitle,
} from "@/components/widgets/Page";
import { CustomerForm } from "@/components/widgets/Sales";
import { Attachments } from "@/components/widgets/Attachments";

import { orgStore } from "@/app/stores/orgStore";

import { useGetCustomerById, useGetCustomerSettings } from "@/entities/customers";

import { usePageDetails } from "@/hooks/useAddPageDetails";
import { useOrganisationError } from "@/hooks/useOrganisationError";

const tabsNames = {
	addresses: "addresses",
	contacts: "contacts",
	attachments: "attachments",
};

const tabsNav = [
	{ content: "Addresses", name: tabsNames.addresses, iconName: "mapPoint" },
	{ content: "Contacts", name: tabsNames.contacts, iconName: "users" },
	{ content: "Attachments", name: tabsNames.attachments, iconName: "attachments" },
];

const EditCustomer: FC = () => {
	const { customerId } = useParams();
	const { orgId } = useStore(orgStore);

	const updateStatus = useMutationState({
		filters: { mutationKey: ["update-customer"] },
		select: (mutation) => mutation.state.status,
	});

	const isPending = updateStatus.includes("pending");

	const {
		data: customerSettingsData,
		error: customerSettingsError,
		isError: isCustomerSettingsError,
		isLoading: isCustomerSettingsLoading,
		isSuccess: isCustomerSettingsSuccess,
	} = useGetCustomerSettings({ organisationId: orgId });

	const {
		data: customerData,
		error: customerError,
		isError: isCustomerError,
		isLoading: isCustomerLoading,
		isSuccess: isCustomerSuccess,
	} = useGetCustomerById({ customerId, organisationId: orgId });

	useOrganisationError(isCustomerError, customerError);

	const [contentRef, isOpen, height, handleOpenClose] = usePageDetails(true, "fit-content");

	return (
		<div className="main__sections">
			<CommonPage>
				<div className="main__container">
					<CommonPageHeader withoutDec>
						<CommonPageTitle>Edit Customer</CommonPageTitle>
						<CommonPageActions>
							<Link to="/sales/customers" className="link link--secondary">
								<svg width="18" height="18" focusable="false" aria-hidden="true">
									<use xlinkHref="/icons/icons.svg#list" />
								</svg>
								Back to List
							</Link>
							<Button type="submit" form="newCustomerForm" isLoading={isPending} disabled={isPending}>
								<svg width="18" height="18" focusable="false" aria-hidden="true">
									<use xlinkHref="/icons/icons.svg#save" />
								</svg>
								Save
							</Button>
							<CommonPageLine />
							<CommonPageArrow type="button" isOpen={isOpen} onClick={handleOpenClose} />
						</CommonPageActions>
					</CommonPageHeader>
					<CommonPageMain ref={contentRef} isActive height={height} isOpen={isOpen}>
						{isCustomerSettingsLoading || isCustomerLoading ? (
							<Loader isFullWidth />
						) : isCustomerError && customerError ? (
							<ErrorMessage error={customerError} />
						) : isCustomerSettingsError && customerSettingsError ? (
							<ErrorMessage error={customerSettingsError} />
						) : isCustomerSettingsSuccess &&
						  isCustomerSuccess &&
						  customerSettingsData.data &&
						  customerData.data ? (
							<CustomerForm
								isEdit
								customerData={customerData.data}
								customerSettingsData={customerSettingsData.data}
							/>
						) : (
							<p className="empty_list">No data available</p>
						)}
					</CommonPageMain>
				</div>
			</CommonPage>
			<CommonPage>
				<div className="main__container">
					{customerId && (
						<Tabs.Root className="tabs" defaultValue={tabsNav[0].name}>
							<div className="tabs__header">
								<Tabs.List className="tabs__nav" aria-label="Manage users & roles">
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
							<Tabs.Content className="tabs__content" value={tabsNames.addresses}>
								{isCustomerSettingsLoading || isCustomerLoading ? <Loader isFullWidth /> : <Addresses />}
							</Tabs.Content>
							<Tabs.Content className="tabs__content" value={tabsNames.contacts}>
								{isCustomerSettingsLoading || isCustomerLoading ? <Loader isFullWidth /> : <Contacts />}
							</Tabs.Content>
							<Tabs.Content className="tabs__content" value={tabsNames.attachments}>
								<Attachments type="customer" entityId={customerId} />
							</Tabs.Content>
						</Tabs.Root>
					)}
				</div>
			</CommonPage>
		</div>
	);
};

export default EditCustomer;
