export type GetOrganisationConnectionStatusResponseType = {
	organisationId: string;
	organisationName: string;
	connectionStatus: boolean;
	xeroOrganisations: {
		id: string;
		name: string;
	}[];
};
