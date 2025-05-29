import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { axiosInstance } from "@/utils/axios";

import { ApiError, ApiResult } from "@/@types/api";
import { CreateWarehousBody, WarehousType } from "@/@types/warehouses";

export const useUpdateWarehouse = () => {
	const queryClient = useQueryClient();

	return useMutation<
		ApiResult<WarehousType>,
		AxiosError<ApiError>,
		{
			warehousesId: string;
			body: Omit<CreateWarehousBody, "organisationId">;
		}
	>({
		mutationFn: async ({ warehousesId, body }) => {
			const { data } = await axiosInstance.patch<ApiResult<WarehousType>>(
				`/api/warehouses/${warehousesId}`,
				JSON.stringify(body),
			);

			return data;
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ["get-all-warehouses"],
			});
			toast.success("Warehouse was successfully updated");
		},
	});
};
