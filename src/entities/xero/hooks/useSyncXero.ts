import { useCallback, useState } from "react";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";

import { showError } from "@/utils/showError";
import { axiosInstance } from "@/utils/axios";

import { ApiResult } from "@/@types/api";

type RouteType =
	| "OrganisationDetails"
	| "Contacts"
	| "Items"
	| "TaxTypes"
	| "LedgerAccounts"
	| "Tracking"
	| "Currencies";

const Endpoints = {
	OrganisationDetails: "/api/integrations/sync-organisation-details",
	Contacts: "/api/integrations/sync-xero-contacts",
	Items: "/api/integrations/sync-xero-products",
	TaxTypes: "/api/integrations/sync-tax-types",
	LedgerAccounts: "/api/integrations/sync-xero-accounts",
	Tracking: "/api/integrations/sync-tracking-categories",
	Currencies: "/api/integrations/sync-xero-currencies",
};

const SuccessMessages = {
	OrganisationDetails: "Organisation Details was successfully synchronized",
	Contacts: "Contacts were successfully synchronized",
	Items: "Items were successfully synchronized",
	TaxTypes: "Tax Types were successfully synchronized",
	LedgerAccounts: "Ledger Accounts were successfully synchronized",
	Tracking: "Tracking was successfully synchronized",
	Currencies: "Currencies were successfully synchronized",
};

export const useSyncXero = (routeType: RouteType, organisationId?: string) => {
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);

	const syncData = useCallback(async () => {
		if (organisationId) {
			setLoading(true);
			setSuccess(false);

			try {
				const { data } = await axiosInstance.get<ApiResult<unknown>>(
					`${Endpoints[routeType]}/${organisationId}`,
				);

				if (data.data) {
					setSuccess(true);
					toast.success(SuccessMessages[routeType]);
				}
			} catch (error) {
				if (isAxiosError(error)) {
					showError(error);
				} else if (error instanceof Error) {
					toast.error(error.message);
				} else {
					toast.error("Something went wrong");
				}
			} finally {
				setLoading(false);
			}
		}
	}, [organisationId, routeType]);

	return { isLoadingSync: loading, isSyncSuccess: success, syncData };
};
