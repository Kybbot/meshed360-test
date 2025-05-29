import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { GetUserInfoResponseType } from "@/@types/user";
import { UpdateSalesDefaultsRequestBody, GetSalesDefaultsResponseType } from "@/@types/salesDefaults";
import { showError } from "@/utils/showError";

export const useUpdateSalesDefaults = ({ organisationId }: { organisationId?: string }) => {
	const queryClient = useQueryClient();

	return useMutation<
		ApiResult<GetSalesDefaultsResponseType>,
		AxiosError<ApiError>,
		{
			body: UpdateSalesDefaultsRequestBody;
		}
	>({
		mutationFn: async ({ body }) => {
			const { data } = await axiosInstance.patch<ApiResult<GetSalesDefaultsResponseType>>(
				`/api/organisation/settings/${organisationId}`,
				JSON.stringify(body),
			);

			return data;
		},
		onSuccess: async (newData) => {
			toast.success("Sales Defaults were successfully updated");

			queryClient.setQueryData<ApiResult<GetUserInfoResponseType>>(["user-info"], (oldData) => {
				if (oldData) {
					return {
						...oldData,
						data: {
							...oldData.data,
							organisations: oldData.data.organisations.map((org) =>
								org.id === organisationId
									? {
											...org,
											marginThreshold: Number(newData.data.marginThresholdPercentage),
										}
									: org,
							),
						},
					};
				}
				return oldData;
			});
		},
		onError(error) {
			showError(error);
		},
	});
};
