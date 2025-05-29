import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { CreateWarehousBody, WarehousType } from "@/@types/warehouses";

export const useCreateWarehouse = () => {
	const queryClient = useQueryClient();

	return useMutation<
		ApiResult<WarehousType>,
		AxiosError<ApiError>,
		{
			body: CreateWarehousBody;
		}
	>({
		mutationFn: async ({ body }) => {
			const { data } = await axiosInstance.post<ApiResult<WarehousType>>(
				`/api/warehouses`,
				JSON.stringify(body),
			);

			return data;
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ["get-all-warehouses"],
			});
			toast.success("New Warehouse was successfully added");
		},
	});
};
