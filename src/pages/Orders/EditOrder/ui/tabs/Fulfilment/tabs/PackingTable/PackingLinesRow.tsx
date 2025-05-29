import { FC, useMemo } from "react";
import {
	Control,
	FieldArrayWithId,
	FieldErrors,
	UseFieldArrayRemove,
	UseFieldArrayUpdate,
	UseFormRegister,
	UseFormSetValue,
	useWatch,
} from "react-hook-form";

import { TableInputRhf } from "@/components/shared/form/TableInputRhf.tsx";

import { PackingFulfilmentFormValues } from "@/@types/salesOrders/local.ts";
import { useStore } from "zustand";
import { orgStore } from "@/app/stores/orgStore.ts";
import { useGetProductAvailability } from "@/pages/StockControl/StockAdjustment/api/queries/useGetProductAvailability.ts";
import { TFTd, TFTr } from "@/components/widgets/Table";

type Props = {
	index: number;
	remove: UseFieldArrayRemove;
	errors: FieldErrors<PackingFulfilmentFormValues>;
	control: Control<PackingFulfilmentFormValues, unknown>;
	register: UseFormRegister<PackingFulfilmentFormValues>;
	setValue: UseFormSetValue<PackingFulfilmentFormValues>;
	update: UseFieldArrayUpdate<PackingFulfilmentFormValues, "lines">;
	fields: FieldArrayWithId<PackingFulfilmentFormValues, "lines", "id">[];
	disabled: boolean;
};

export const PackingLinesRow: FC<Props> = ({ index, errors, control, register, setValue }) => {
	const { orgId } = useStore(orgStore);

	const allValues = useWatch({
		name: "lines",
		control,
	});

	const { product, location, batch, quantity } = allValues[index];

	const { data: availabilityData } = useGetProductAvailability({
		organisationId: orgId,
		productId: product ? String(product.id) : "",
		warehouseId: location ? String(location.id) : "",
		isDisabled: !product || !location,
	});

	const batches = useMemo(() => {
		if (!availabilityData?.data) {
			return [];
		} else {
			return availabilityData.data
				.map(({ batchNumber }) => batchNumber)
				.filter((v) => !!v)
				.map((v) => ({ id: v, name: v }));
		}
	}, [availabilityData]);

	const expiryDate = useMemo(() => {
		if (availabilityData?.data?.length) {
			if (batches.length) {
				const res =
					availabilityData.data.filter(({ batchNumber }) => batchNumber === batch?.id)?.[0]?.expiryDate ||
					null;
				setValue(`lines.${index}.expiryDate`, res);
				return res || "N/A";
			} else {
				const res = availabilityData.data[0]?.available || null;
				setValue(`lines.${index}.expiryDate`, res);
				return res || "N/A";
			}
		} else {
			setValue(`lines.${index}.expiryDate`, null);
			return "N/A";
		}
	}, [availabilityData?.data, batches.length, setValue, index, batch?.id]);

	return (
		<TFTr>
			<TFTd isText>{product?.name}</TFTd>
			{batches.length ? <TFTd isText>{batch?.id}</TFTd> : <TFTd isText>{product ? "N/A" : ""}</TFTd>}
			<TFTd isText>{product ? expiryDate : ""}</TFTd>
			<TFTd isText>{quantity}</TFTd>
			<TFTd>
				<TableInputRhf<PackingFulfilmentFormValues>
					type="text"
					label="Package #"
					register={register}
					rules={{
						required: "Required",
					}}
					id="orderLinesPackageNumber"
					name={`lines.${index}.packingNumber`}
					error={errors?.lines?.[index]?.packingNumber?.message}
				/>
			</TFTd>
			<TFTd isText>{location?.name}</TFTd>
		</TFTr>
	);
};
