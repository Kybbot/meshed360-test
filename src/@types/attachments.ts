export type AttachmentEntityType =
	| "customer"
	| "salesOrder"
	| "supplier"
	| "purchaseOrder"
	| "product"
	| "assembly";

export type AttachmentType = {
	id: string;
	fileName: string;
	link: string;
	date: string;
};

export type GetAttachmentsResponseType = {
	attachments: AttachmentType[];
	totalCount: number;
	totalPages: number;
};

export type DeletedAttachmentResponseType = {
	id: string;
	organisationId: string;
	fileName: string;
	createdAt: string;
	createdBy: string;
	originId: string;
	originType: string;
};
