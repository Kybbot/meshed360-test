import { FC, useState } from "react";
import { useStore } from "zustand";
import toast from "react-hot-toast";

import { Button } from "@/components/shared/Button";
import { Spinner } from "@/components/shared/Spinner";

import { CommonPageH2, CommonPageMain } from "@/components/widgets/Page";

import { orgStore } from "@/app/stores/orgStore";

import { useSyncXero } from "@/entities/xero";

import { showError } from "@/utils/showError";
import { axiosInstance } from "@/utils/axios";

import { ApiResult } from "@/@types/api";

const names = ["Organisation Details", "Contacts", "Items", "Tax Types", "Ledger Accounts", "Tracking"];

export const Sync: FC = () => {
	const { orgId } = useStore(orgStore);

	const [isLoadingAll, setLoadingAll] = useState(false);

	const { syncData: syncOrgDetails, isLoadingSync: isSyncOrgDetailsFetching } = useSyncXero(
		"OrganisationDetails",
		orgId,
	);
	const { syncData: syncContacts, isLoadingSync: isSyncContactsFetching } = useSyncXero("Contacts", orgId);
	const { syncData: syncItems, isLoadingSync: isSyncItemsFetching } = useSyncXero("Items", orgId);
	const { syncData: syncTaxTypes, isLoadingSync: isSyncTaxTypesFetching } = useSyncXero("TaxTypes", orgId);
	const { syncData: syncLedgerAccounts, isLoadingSync: isSyncLedgerAccountsFetching } = useSyncXero(
		"LedgerAccounts",
		orgId,
	);
	const { syncData: syncTracking, isLoadingSync: isSyncTrackingFetching } = useSyncXero("Tracking", orgId);
	const { syncData: syncCurrencies, isLoadingSync: isSyncCurrenciesFetching } = useSyncXero(
		"Currencies",
		orgId,
	);

	const handleSyncAllData = async () => {
		try {
			setLoadingAll(true);

			const all = await Promise.allSettled([
				axiosInstance.get<ApiResult<"ok">>(`/api/integrations/sync-organisation-details/${orgId}`),
				axiosInstance.get<ApiResult<"ok">>(`/api/integrations/sync-xero-contacts/${orgId}`),
				axiosInstance.get<ApiResult<"ok">>(`/api/integrations/sync-xero-products/${orgId}`),
				axiosInstance.get<ApiResult<"ok">>(`/api/integrations/sync-tax-types/${orgId}`),
				axiosInstance.get<ApiResult<"ok">>(`/api/integrations/sync-xero-accounts/${orgId}`),
				axiosInstance.get<ApiResult<"ok">>(`/api/integrations/sync-tracking-categories/${orgId}`),
			]);

			const rejected = all
				.map((item, index) => ({ ...item, name: names[index] }))
				.filter((item) => item.status === "rejected");

			for (const item of rejected) {
				showError(item.reason, `${item.name} - `);
			}

			if (rejected.length < 1) {
				toast.success("Xero Masterdata was successfully synchronized");
			}
		} catch (error) {
			console.error("sync", error);
		} finally {
			setLoadingAll(false);
		}
	};

	return (
		<CommonPageMain>
			<CommonPageH2>Sync Xero Masterdata</CommonPageH2>
			<div className="sync__btns">
				<Button
					isSecondary
					isUseSpinner
					type="button"
					onClick={() => syncOrgDetails()}
					disabled={isSyncOrgDetailsFetching || isLoadingAll}
				>
					{isSyncOrgDetailsFetching || isLoadingAll ? (
						<Spinner />
					) : (
						<svg width="18" height="18" focusable="false" aria-hidden="true">
							<use xlinkHref="/icons/icons.svg#emptyFile" />
						</svg>
					)}
					Sync Organisation Details
				</Button>
				<Button
					isSecondary
					isUseSpinner
					type="button"
					onClick={() => syncContacts()}
					disabled={isSyncContactsFetching || isLoadingAll}
				>
					{isSyncContactsFetching || isLoadingAll ? (
						<Spinner />
					) : (
						<svg width="18" height="18" focusable="false" aria-hidden="true">
							<use xlinkHref="/icons/icons.svg#users" />
						</svg>
					)}
					Sync Contacts
				</Button>
				<Button
					isSecondary
					isUseSpinner
					type="button"
					onClick={() => syncItems()}
					disabled={isSyncItemsFetching || isLoadingAll}
				>
					{isSyncItemsFetching || isLoadingAll ? (
						<Spinner />
					) : (
						<svg width="18" height="18" focusable="false" aria-hidden="true">
							<use xlinkHref="/icons/icons.svg#inventory" />
						</svg>
					)}
					Sync Items
				</Button>
				<Button
					isSecondary
					isUseSpinner
					type="button"
					onClick={() => syncTaxTypes()}
					disabled={isSyncTaxTypesFetching || isLoadingAll}
				>
					{isSyncTaxTypesFetching || isLoadingAll ? (
						<Spinner />
					) : (
						<svg width="18" height="18" focusable="false" aria-hidden="true">
							<use xlinkHref="/icons/icons.svg#emptyFile" />
						</svg>
					)}
					Sync Tax Types
				</Button>
				<Button
					isSecondary
					isUseSpinner
					type="button"
					onClick={() => syncLedgerAccounts()}
					disabled={isSyncLedgerAccountsFetching || isLoadingAll}
				>
					{isSyncLedgerAccountsFetching || isLoadingAll ? (
						<Spinner />
					) : (
						<svg width="18" height="18" focusable="false" aria-hidden="true">
							<use xlinkHref="/icons/icons.svg#emptyFile" />
						</svg>
					)}
					Sync Ledger Accounts
				</Button>
				<Button
					isSecondary
					isUseSpinner
					type="button"
					onClick={() => syncTracking()}
					disabled={isSyncTrackingFetching || isLoadingAll}
				>
					{isSyncTrackingFetching || isLoadingAll ? (
						<Spinner />
					) : (
						<svg width="18" height="18" focusable="false" aria-hidden="true">
							<use xlinkHref="/icons/icons.svg#mapPoint" />
						</svg>
					)}
					Sync Tracking
				</Button>
				<Button
					isSecondary
					isUseSpinner
					type="button"
					onClick={() => syncCurrencies()}
					disabled={isSyncCurrenciesFetching || isLoadingAll}
				>
					{isSyncCurrenciesFetching || isLoadingAll ? (
						<Spinner />
					) : (
						<svg width="18" height="18" focusable="false" aria-hidden="true">
							<use xlinkHref="/icons/icons.svg#usd" />
						</svg>
					)}
					Sync Currencies
				</Button>
				<Button isUseSpinner type="button" onClick={handleSyncAllData} disabled={isLoadingAll}>
					{isLoadingAll ? (
						<Spinner />
					) : (
						<svg width="18" height="18" focusable="false" aria-hidden="true">
							<use xlinkHref="/icons/icons.svg#reset" />
						</svg>
					)}
					Sync All
				</Button>
			</div>
		</CommonPageMain>
	);
};
