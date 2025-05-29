import { RestockFormValues } from "@/@types/salesOrders/local.ts";
import { UpdateRestockType } from "@/@types/salesOrders/api.ts";

export const getNormalizedRestockData = (data: RestockFormValues): UpdateRestockType => {
	return {
		lines: data.lines.map((line) => ({
			productId: line.product!.id,
			batchNumber: line.batch?.id || null,
			expiryDate: line.expiryDate,
			quantity: line.quantity,
			warehouseId: line.location!.id,
		})),
	};
};
