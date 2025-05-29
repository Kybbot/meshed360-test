import { FC } from "react";
import { useStore } from "zustand";
import { useNavigate } from "react-router";
import { useMutationState } from "@tanstack/react-query";

import { Loader } from "@/components/shared/Loader";
import { Button } from "@/components/shared/Button";
import { ErrorMessage } from "@/components/shared/ErrorMessage";

import { SupplierForm } from "@/components/widgets/Purchases";
import { CommonPage, CommonPageActions, CommonPageHeader, CommonPageTitle } from "@/components/widgets/Page";

import { orgStore } from "@/app/stores/orgStore";

import { useGetSupplierSettings } from "@/entities/suppliers";

const NewSupplier: FC = () => {
	const navigate = useNavigate();
	const { orgId } = useStore(orgStore);

	const createStatus = useMutationState({
		filters: { mutationKey: ["create-supplier"] },
		select: (mutation) => mutation.state.status,
	});

	const isPending = createStatus.includes("pending");

	const {
		data: settingsData,
		error: settingsError,
		isError: isSettingsError,
		isLoading: isSettingsLoading,
		isSuccess: isSettingsSuccess,
	} = useGetSupplierSettings({ organisationId: orgId });

	return (
		<CommonPage>
			<div className="main__container">
				<CommonPageHeader>
					<CommonPageTitle>Add Supplier</CommonPageTitle>
					<CommonPageActions>
						<Button type="button" isSecondary onClick={() => navigate(-1)}>
							<svg width="18" height="18" focusable="false" aria-hidden="true">
								<use xlinkHref="/icons/icons.svg#list" />
							</svg>
							Back to List
						</Button>
						<Button type="submit" form="newSupplierForm" isLoading={isPending} disabled={isPending}>
							<svg width="18" height="18" focusable="false" aria-hidden="true">
								<use xlinkHref="/icons/icons.svg#plus" />
							</svg>
							Create
						</Button>
					</CommonPageActions>
				</CommonPageHeader>
				{isSettingsLoading ? (
					<Loader isFullWidth />
				) : isSettingsError && settingsError ? (
					<ErrorMessage error={settingsError} />
				) : isSettingsSuccess && settingsData.data ? (
					<SupplierForm isEdit={false} settingsData={settingsData.data} />
				) : (
					<p className="empty_list">No data available</p>
				)}
			</div>
		</CommonPage>
	);
};

export default NewSupplier;
