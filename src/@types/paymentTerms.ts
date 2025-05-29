export type PaymentTermType = {
	id: string;
	description: string;
	method: number;
	durationDays: number | null;
	status: null;
	default: boolean;
	organisationId: string;
};

export type GetAllPaymentTermsResponseType = {
	paymentTerms: PaymentTermType[];
	totalCount: number;
	totalPages: number;
};

export type CreatePaymentTermBody = {
	description: string;
	method: number;
	durationDays?: number | null;
	default: boolean;
	organisationId: string;
};

export const PaymentTermsMethods: Record<number, string> = {
	1: "of the following month",
	2: "day(s) after the invoice date",
	3: "day(s) after the invoice month",
	4: "of the current month",
	5: "Last day of next month",
	6: "Last day in 2 months",
};
