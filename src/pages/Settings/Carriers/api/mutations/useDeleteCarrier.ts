import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { CarrierType } from "@/@types/carriers";
import { ApiError, ApiResult } from "@/@types/api";

export const useDeleteCarrier = () => {
	const queryClient = useQueryClient();

	return useMutation<ApiResult<CarrierType>, AxiosError<ApiError>, { carrierId: string }>({
		mutationFn: async ({ carrierId }) => {
			const { data } = await axiosInstance.delete<ApiResult<CarrierType>>(
				`api/organisation/carriers/${carrierId}`,
			);

			return data;
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ["get-all-carriers"],
			});
			toast.success("Carrier was successfully deleted");
		},
	});
};
