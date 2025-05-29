import { FC } from "react";
import { useStore } from "zustand";
import { useNavigate } from "react-router";
import { useMutationState } from "@tanstack/react-query";

import { Loader } from "@/components/shared/Loader";
import { Button } from "@/components/shared/Button";
import { ErrorMessage } from "@/components/shared/ErrorMessage";

import { CustomerForm } from "@/components/widgets/Sales";
import { CommonPage, CommonPageActions, CommonPageHeader, CommonPageTitle } from "@/components/widgets/Page";

import { orgStore } from "@/app/stores/orgStore";

import { useGetCustomerSettings } from "@/entities/customers";

const NewCustomer: FC = () => {
	const navigate = useNavigate();
	const { orgId } = useStore(orgStore);

	const createStatus = useMutationState({
		filters: { mutationKey: ["create-customer"] },
		select: (mutation) => mutation.state.status,
	});

	const isPending = createStatus.includes("pending");

	const {
		data: customerSettingsData,
		error: customerSettingsError,
		isError: isCustomerSettingsError,
		isLoading: isCustomerSettingsLoading,
		isSuccess: isCustomerSettingsSuccess,
	} = useGetCustomerSettings({ organisationId: orgId });

	return (
		<CommonPage>
			<div className="main__container">
				<CommonPageHeader>
					<CommonPageTitle>Add Customer</CommonPageTitle>
					<CommonPageActions>
						<Button type="button" isSecondary onClick={() => navigate(-1)}>
							<svg width="18" height="18" focusable="false" aria-hidden="true">
								<use xlinkHref="/icons/icons.svg#list" />
							</svg>
							Back to List
						</Button>
						<Button type="submit" form="newCustomerForm" isLoading={isPending} disabled={isPending}>
							<svg width="18" height="18" focusable="false" aria-hidden="true">
								<use xlinkHref="/icons/icons.svg#plus" />
							</svg>
							Create
						</Button>
					</CommonPageActions>
				</CommonPageHeader>
				{isCustomerSettingsLoading ? (
					<Loader isFullWidth />
				) : isCustomerSettingsError && customerSettingsError ? (
					<ErrorMessage error={customerSettingsError} />
				) : isCustomerSettingsSuccess && customerSettingsData.data ? (
					<CustomerForm customerSettingsData={customerSettingsData.data} />
				) : (
					<p className="empty_list">No data available</p>
				)}
			</div>
		</CommonPage>
	);
};

export default NewCustomer;
