export type TenantType = {
	id: string;
	name: string;
	status: "active" | "inactive";
	xeroOrganisationId: string | null;
};
