export interface GetProfileSettingsType {
	name: string;
	legalTradingName: string;
	registrationNumber: string;
	vatNumber: string;
	contactNumber: string;
	fax: string;
	email: string;
	baseCurrency: string;

	physicalAddress: {
		street: string;
		city: string;
		state: string;
		country: string;
		isDefault: boolean;
	};

	postalAddress: {
		street: string;
		city: string;
		state: string;
		country: string;
		isDefault: boolean;
	};
}

export interface UpdateProfileSettingsRequestBody {
	name: string;
	legalTradingName: string;
	registrationNumber: string | null;
	vatNumber: string;

	contactNumber: string | null;
	fax: string | null;
	email: string | null;

	physicalAddress: {
		street: string | null;
		city: string | null;
		state: string | null;
		country: string | null;
		isDefault: boolean;
	} | null;

	postalAddress: {
		street: string | null;
		city: string | null;
		state: string | null;
		country: string | null;
		isDefault: boolean;
	} | null;
}
