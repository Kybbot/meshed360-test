import { DimensionFormValues } from "@/@types/products";

export const getNormalizedDemensionData = (data: DimensionFormValues) => {
	return {
		...(data.uom ? { uom: data.uom } : {}),
		...(data.length && data.length > 0 ? { length: data.length } : {}),
		...(data.width && data.width > 0 ? { width: data.width } : {}),
		...(data.height && data.height > 0 ? { height: data.height } : {}),
		...(data.uomWeight ? { uomWeight: data.uomWeight } : {}),
		...(data.weight && data.weight > 0 ? { weight: data.weight } : {}),
		...(data.lugSize ? { lugSize: data.lugSize } : {}),
		...(data.quantity && data.quantity > 0 ? { quantity: data.quantity } : {}),
		...(data.calculatedWith ? { calculatedWith: data.calculatedWith } : {}),
	};
};
