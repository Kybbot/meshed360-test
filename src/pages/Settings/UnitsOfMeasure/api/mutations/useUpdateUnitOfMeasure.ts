import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { CreateUnitOfMeasureBody, UnitOfMeasureType } from "@/@types/unitsOfMeasure";

export const useUpdateUnitOfMeasure = () => {
	const queryClient = useQueryClient();

	return useMutation<
		ApiResult<UnitOfMeasureType>,
		AxiosError<ApiError>,
		{
			unitOfMeasureId: string;
			body: CreateUnitOfMeasureBody;
		}
	>({
		mutationFn: async ({ unitOfMeasureId, body }) => {
			const { data } = await axiosInstance.patch<ApiResult<UnitOfMeasureType>>(
				`/api/organisation/unit-of-measure/${unitOfMeasureId}`,
				JSON.stringify(body),
			);

			return data;
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ["get-all-units-of-measure"],
			});
			toast.success("Unit of Measure was successfully updated");
		},
	});
};
