import { AddressFormValue } from "@/@types/customers";

export const getNormalizedNewAddressData = (data: AddressFormValue) => {
	return {
		addressLine1: data.addressLine1,
		...(data.addressLine2 ? { addressLine2: data.addressLine2 } : {}),
		...(data.addressLine3 ? { addressLine3: data.addressLine3 } : {}),
		...(data.addressLine4 ? { addressLine4: data.addressLine4 } : {}),
		addressType: data.addressType.id,
		...(data.city ? { city: data.city } : {}),
		...(data.country ? { country: data.country } : {}),
		...(data.postalCode ? { postalCode: data.postalCode } : {}),
		...(data.region ? { region: data.region } : {}),
		isDefault: false,
	};
};
