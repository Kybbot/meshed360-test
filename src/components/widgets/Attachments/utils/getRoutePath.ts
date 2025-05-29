import { AttachmentEntityType } from "@/@types/attachments";

export const getRoutePath = (type: AttachmentEntityType) => {
	switch (type) {
		case "customer":
			return "api/customers/attachment";
		case "salesOrder":
			return "api/orders/sales/attachment";
		case "supplier":
			return "api/suppliers/attachment";
		case "purchaseOrder":
			return "api/orders/purchase/attachment";
		case "product":
			return "api/organisation/products/attachment";
		case "assembly":
			return "api/assemblies/attachments";
		default:
			return "";
	}
};
