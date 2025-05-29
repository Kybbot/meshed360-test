import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { GetAllOrgBillsResponseType } from "@/@types/purchaseOrders";

export const useGetOrganisationBills = ({ orgId }: { orgId?: string }) => {
	return useQuery<ApiResult<GetAllOrgBillsResponseType>, AxiosError<ApiError>>({
		queryKey: ["get-organisation-bills", orgId],
		queryFn: async () => {
			const { data } = await axiosInstance.get<ApiResult<GetAllOrgBillsResponseType>>(
				`/api/purchase-orders/bills/by-org?organisationId=${orgId}`,
			);

			return data;
		},
		enabled: !!orgId,
	});
};
