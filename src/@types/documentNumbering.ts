export type DocumentNumberingType = {
	organisationId: string;
	type: string;
	prefix: string;
	nextNumber: number;
};

export type GetAllDocumentNumberingResponseType = DocumentNumberingType[];

export type DocumentNumberingFormValues = {
	arr: DocumentNumberingType[];
};
