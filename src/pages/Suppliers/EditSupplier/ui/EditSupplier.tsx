import { FC } from "react";
import { useStore } from "zustand";
import { Link, useParams } from "react-router";
import * as Tabs from "@radix-ui/react-tabs";
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
import { SupplierForm } from "@/components/widgets/Purchases";
import { Attachments } from "@/components/widgets/Attachments";

import { orgStore } from "@/app/stores/orgStore";

import { usePageDetails } from "@/hooks/useAddPageDetails";
import { useOrganisationError } from "@/hooks/useOrganisationError";

import { useGetSupplierById, useGetSupplierSettings } from "@/entities/suppliers";

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

const EditSupplier: FC = () => {
	const { supplierId } = useParams();
	const { orgId } = useStore(orgStore);

	const updateStatus = useMutationState({
		filters: { mutationKey: ["update-supplier"] },
		select: (mutation) => mutation.state.status,
	});

	const isPending = updateStatus.includes("pending");

	const {
		data: settingsData,
		error: settingsError,
		isError: isSettingsError,
		isLoading: isSettingsLoading,
		isSuccess: isSettingsSuccess,
	} = useGetSupplierSettings({ organisationId: orgId });

	const {
		data: supplierData,
		error: supplierError,
		isError: isSupplierError,
		isLoading: isSupplierLoading,
		isSuccess: isSupplierSuccess,
	} = useGetSupplierById({
		organisationId: orgId,
		supplierId: supplierId,
	});

	useOrganisationError(isSupplierError, supplierError);

	const [contentRef, isOpen, height, handleOpenClose] = usePageDetails(true, "fit-content");

	return (
		<div className="main__sections">
			<CommonPage>
				<div className="main__container">
					<CommonPageHeader withoutDec>
						<CommonPageTitle>Edit Supplier</CommonPageTitle>
						<CommonPageActions>
							<Link to="/purchases/suppliers" className="link link--secondary">
								<svg width="18" height="18" focusable="false" aria-hidden="true">
									<use xlinkHref="/icons/icons.svg#list" />
								</svg>
								Back to List
							</Link>
							<Button type="submit" form="newSupplierForm" isLoading={isPending} disabled={isPending}>
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
						{isSettingsLoading || isSupplierLoading ? (
							<Loader isFullWidth />
						) : isSettingsError && settingsError ? (
							<ErrorMessage error={settingsError} />
						) : isSupplierError && supplierError ? (
							<ErrorMessage error={supplierError} />
						) : isSettingsSuccess && isSupplierSuccess && settingsData.data && supplierData.data ? (
							<SupplierForm isEdit supplierData={supplierData.data} settingsData={settingsData.data} />
						) : (
							<p className="empty_list">No data available</p>
						)}
					</CommonPageMain>
				</div>
			</CommonPage>
			<CommonPage>
				<div className="main__container">
					{supplierId && (
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
								{isSettingsLoading || isSupplierLoading ? <Loader isFullWidth /> : <Addresses />}
							</Tabs.Content>
							<Tabs.Content className="tabs__content" value={tabsNames.contacts}>
								{isSettingsLoading || isSupplierLoading ? <Loader isFullWidth /> : <Contacts />}
							</Tabs.Content>
							<Tabs.Content className="tabs__content" value={tabsNames.attachments}>
								<Attachments type="supplier" entityId={supplierId} />
							</Tabs.Content>
						</Tabs.Root>
					)}
				</div>
			</CommonPage>
		</div>
	);
};

export default EditSupplier;
