import { OrderStatus } from "@/@types/salesOrders/api.ts";
import { tabsNames } from "@/pages/Orders/EditOrder/ui/EditOrder.tsx";

export default (orderStatus: OrderStatus): Array<keyof typeof tabsNames> => {
	switch (orderStatus) {
		case OrderStatus.DRAFT:
			return ["quote"];
		case OrderStatus.ORDERING:
			return ["fulfilment"];
		case OrderStatus.ORDERED:
			return ["fulfilment"];
		case OrderStatus.PARTIALLY_PICKED:
			return ["fulfilment"];
		case OrderStatus.PICKED:
			return ["fulfilment"];
		case OrderStatus.PARTIALLY_PACKED:
			return ["fulfilment"];
		case OrderStatus.PACKED:
			return ["fulfilment"];
		case OrderStatus.PARTIALLY_SHIPPED:
			return ["fulfilment"];
		case OrderStatus.SHIPPED:
			return ["fulfilment", "restock", "invoicing"];
		case OrderStatus.INVOICING:
			return ["restock", "invoicing"];
		case OrderStatus.INVOICED:
			return ["restock", "invoicing", "creditNotes"];
		case OrderStatus.CREDITING:
			return ["restock", "creditNotes"];
		case OrderStatus.PARTIALLY_CREDITED:
			return ["restock", "creditNotes"];
		case OrderStatus.CREDITED:
			return ["creditNotes", "restock"];
		case "CLOSED":
		case "LOST":
			return [];
		default:
			return [];
	}
};
