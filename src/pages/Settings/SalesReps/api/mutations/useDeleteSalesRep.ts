import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { SalesRepType } from "@/@types/salesReps";
import { ApiError, ApiResult } from "@/@types/api";

export const useDeleteSalesRep = () => {
	const queryClient = useQueryClient();

	return useMutation<ApiResult<SalesRepType>, AxiosError<ApiError>, { salesRepId: string }>({
		mutationFn: async ({ salesRepId }) => {
			const { data } = await axiosInstance.delete<ApiResult<SalesRepType>>(
				`api/organisation/sales-rep/${salesRepId}`,
			);

			return data;
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ["get-all-salesReps"],
			});
			toast.success("Sales Rep was successfully deleted");
		},
	});
};
