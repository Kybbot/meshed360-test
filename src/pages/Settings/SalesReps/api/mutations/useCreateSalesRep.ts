import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { CreateSalesRepBody, SalesRepType } from "@/@types/salesReps";

export const useCreateSalesRep = () => {
	const queryClient = useQueryClient();

	return useMutation<
		ApiResult<SalesRepType>,
		AxiosError<ApiError>,
		{
			body: CreateSalesRepBody;
		}
	>({
		mutationFn: async ({ body }) => {
			const { data } = await axiosInstance.post<ApiResult<SalesRepType>>(
				`/api/organisation/sales-rep`,
				JSON.stringify(body),
			);

			return data;
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ["get-all-salesReps"],
			});
			toast.success("New sales rep was successfully added");
		},
	});
};
