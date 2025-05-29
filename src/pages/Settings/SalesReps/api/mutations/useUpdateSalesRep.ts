import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { CreateSalesRepBody, SalesRepType } from "@/@types/salesReps";

export const useUpdateSalesRep = () => {
	const queryClient = useQueryClient();

	return useMutation<
		ApiResult<SalesRepType>,
		AxiosError<ApiError>,
		{
			salesRepId: string;
			body: Omit<CreateSalesRepBody, "organisationId">;
		}
	>({
		mutationFn: async ({ salesRepId, body }) => {
			const { data } = await axiosInstance.patch<ApiResult<SalesRepType>>(
				`/api/organisation/sales-rep/${salesRepId}`,
				JSON.stringify(body),
			);

			return data;
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ["get-all-salesReps"],
			});
			toast.success("Sales Rep was successfully updated");
		},
	});
};
