import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { CarrierType, CreateCarrierBody } from "@/@types/carriers";

export const useCreateCarrier = () => {
	const queryClient = useQueryClient();

	return useMutation<
		ApiResult<CarrierType>,
		AxiosError<ApiError>,
		{
			organisationId: string;
			body: CreateCarrierBody;
		}
	>({
		mutationFn: async ({ body, organisationId }) => {
			const { data } = await axiosInstance.post<ApiResult<CarrierType>>(
				`/api/organisation/carriers/${organisationId}`,
				JSON.stringify(body),
			);

			return data;
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ["get-all-carriers"],
			});
			toast.success("New Carrier was successfully added");
		},
	});
};
