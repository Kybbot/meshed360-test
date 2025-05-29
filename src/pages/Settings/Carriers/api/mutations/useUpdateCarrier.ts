import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { CarrierType, CreateCarrierBody } from "@/@types/carriers";

export const useUpdateCarrier = () => {
	const queryClient = useQueryClient();

	return useMutation<
		ApiResult<CarrierType>,
		AxiosError<ApiError>,
		{
			carrierId: string;
			body: CreateCarrierBody;
		}
	>({
		mutationFn: async ({ carrierId, body }) => {
			const { data } = await axiosInstance.patch<ApiResult<CarrierType>>(
				`/api/organisation/carriers/${carrierId}`,
				JSON.stringify(body),
			);

			return data;
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ["get-all-carriers"],
			});
			toast.success("Carrier was successfully updated");
		},
	});
};
