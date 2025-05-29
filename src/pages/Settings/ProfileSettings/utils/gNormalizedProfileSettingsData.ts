import { GetProfileSettingsType, UpdateProfileSettingsRequestBody } from "@/@types/profileSettings";

const normalizeAddress = (
	address: GetProfileSettingsType["physicalAddress"] | GetProfileSettingsType["postalAddress"],
): UpdateProfileSettingsRequestBody["physicalAddress"] => {
	const isEmpty = !address.street && !address.city && !address.state && !address.country;

	if (isEmpty) return null;

	return {
		street: address.street || null,
		city: address.city || null,
		state: address.state || null,
		country: address.country || null,
		isDefault: address.isDefault ?? false,
	};
};

export const normalizeProfileSettings = (data: GetProfileSettingsType): UpdateProfileSettingsRequestBody => ({
	name: data.name,
	legalTradingName: data.legalTradingName,
	registrationNumber: data.registrationNumber || null,
	vatNumber: data.vatNumber,
	contactNumber: data.contactNumber || null,
	fax: data.fax || null,
	email: data.email || null,

	physicalAddress: normalizeAddress(data.physicalAddress),
	postalAddress: normalizeAddress(data.postalAddress),
});

export const denormalizeProfileSettings = (data: GetProfileSettingsType) => ({
	name: data.name,
	legalTradingName: data.legalTradingName,
	registrationNumber: data.registrationNumber,
	vatNumber: data.vatNumber,
	contactNumber: data.contactNumber,
	fax: data.fax,
	email: data.email,
	baseCurrency: data.baseCurrency,

	physicalAddress: {
		street: data.physicalAddress?.street,
		city: data.physicalAddress?.city,
		state: data.physicalAddress?.state,
		country: data.physicalAddress?.country,
		isDefault: data.physicalAddress?.isDefault ?? false,
	},

	postalAddress: {
		street: data.postalAddress?.street,
		city: data.postalAddress?.city,
		state: data.postalAddress?.state,
		country: data.postalAddress?.country,
		isDefault: data.postalAddress?.isDefault ?? false,
	},
});
