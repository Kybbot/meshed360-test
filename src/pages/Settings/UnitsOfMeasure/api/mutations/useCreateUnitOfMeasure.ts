import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { CreateUnitOfMeasureBody, UnitOfMeasureType } from "@/@types/unitsOfMeasure";

export const useCreateUnitOfMeasure = () => {
	const queryClient = useQueryClient();

	return useMutation<
		ApiResult<UnitOfMeasureType>,
		AxiosError<ApiError>,
		{
			body: CreateUnitOfMeasureBody;
		}
	>({
		mutationFn: async ({ body }) => {
			const { data } = await axiosInstance.post<ApiResult<UnitOfMeasureType>>(
				`/api/organisation/unit-of-measure`,
				JSON.stringify(body),
			);

			return data;
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ["get-all-units-of-measure"],
			});
			toast.success("New Unit of Measure was successfully added");
		},
	});
};
