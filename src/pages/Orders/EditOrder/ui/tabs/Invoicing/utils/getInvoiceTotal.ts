import {
	DefaultOrderLineType,
	MeatOrderLineType,
	OrderServiceLineType,
	WoolworthsOrderLineType,
} from "@/@types/salesOrders/local.ts";
import { calculateTotalTableValues } from "@/components/widgets/TotalTable/utils/calculate.ts";

export default (
	orderLines: DefaultOrderLineType[] | MeatOrderLineType[] | WoolworthsOrderLineType[],
	serviceLines: OrderServiceLineType[],
	taxInclusive: boolean,
) => {
	const total =
		calculateTotalTableValues(orderLines, taxInclusive).total +
		calculateTotalTableValues(serviceLines, taxInclusive).total;

	return total.toFixed(2);
};
