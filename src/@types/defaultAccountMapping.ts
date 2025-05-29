import { z } from "zod";
import { SelectOption } from "./selects";

export type OrganisationDefaultAccountMappingResponse = {
	id: string;
	organisationId: string;
	inventoryControlAccountId: string | null;
	defaultRevenueAccountId: string | null;
	whipAccountId: string | null;
	customerControlAccountId: string | null;
	wastageAccountId: string | null;
	roundingCostAccountId: string | null;
	cogsAccountId: string | null;
	taxLiabilityAccountId: string | null;
	inTransitAccountId: string | null;
	supplierAccountId: string | null;
	finishedGoodsAccountId: string | null;
	customerAccountId: string | null;
	defaultExpenseDisbursementAccountId: string | null;
};

export interface XeroAccount extends SelectOption {
	code?: string;
	xeroId?: string;
	type?: string;
	systemAccount?: string;
	taxType?: string;
	description?: string;
	class?: string;
	reportingCode?: string;
	reportingCodeName?: string;
	status?: string;
	organisationId: string;
}

export type GetOrganisationXeroAccountsAllTypesResponse = {
	inventoryControlAccounts: XeroAccount[];
	defaultRevenueAccounts: XeroAccount[];
	whipAccounts: XeroAccount[];
	customerControlAccounts: XeroAccount[];
	wastageAccounts: XeroAccount[];
	roundingCostAccounts: XeroAccount[];
	cogsAccounts: XeroAccount[];
	taxLiabilityAccounts: XeroAccount[];
	inTransit: XeroAccount[];
	supplier: XeroAccount[];
	finishedGoodsAccounts: XeroAccount[];
	customer: XeroAccount[];
	defaultExpenseDisbursementAccount: XeroAccount[];
};

export type UpdateDefaultAccountMappingBody = Partial<{
	inventoryControlAccountId: string | null;
	defaultRevenueAccountId: string | null;
	whipAccountId: string | null;
	customerControlAccountId: string | null;
	wastageAccountId: string | null;
	roundingCostAccountId: string | null;
	cogsAccountId: string | null;
	taxLiabilityAccountId: string | null;
	inTransitAccountId: string | null;
	supplierAccountId: string | null;
	finishedGoodsAccountId: string | null;
	customerAccountId: string | null;
	defaultExpenseDisbursementAccountId: string | null;
}>;

export interface DAMFormInput {
	code: string;
	name: string;
	xeroId: string;
}

export const FormSchemaOption = z
	.object({
		id: z.string(),
		name: z.string(),
	})
	.optional();

export const DAMFormSchema = z
	.object({
		inventoryAccount: FormSchemaOption,
		defaultRevenueAccount: FormSchemaOption,
		workInProgressAccount: FormSchemaOption,
		customerControlAccount: FormSchemaOption,
		wastageAccount: FormSchemaOption,
		roundingAccount: FormSchemaOption,
		goodsReceivedNotBilled: FormSchemaOption,
		costOfGoodsSoldAccount: FormSchemaOption,
		taxLiabilityAccount: FormSchemaOption,
		inTransitAccount: FormSchemaOption,
		supplierControlAccount: FormSchemaOption,
		finishedGoodsAccount: FormSchemaOption,
		defaultEDAccount: FormSchemaOption,
		goodsBilledNotShipped: FormSchemaOption,
	})
	.partial();

export type DAMFormValues = z.infer<typeof DAMFormSchema>;
