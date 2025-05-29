import { FC } from "react";
import {
	Control,
	Controller,
	FieldArrayWithId,
	FieldErrors,
	UseFieldArrayRemove,
	UseFieldArrayUpdate,
	UseFormRegister,
	UseFormSetValue,
	useWatch,
} from "react-hook-form";

import { TableInputRhf } from "@/components/shared/form/TableInputRhf.tsx";

import { ShippingFulfilmentFormValues } from "@/@types/salesOrders/local.ts";
import { useStore } from "zustand";
import { orgStore } from "@/app/stores/orgStore.ts";
import { useGetAllCarriers } from "@/pages/Settings/Carriers/api/queries/useGetAllCarriers.ts";
import { TableDayPickerRhf } from "@/components/shared/form/TableDayPickerRhf.tsx";
import { CustomTableSelect } from "@/components/shared/CustomTableSelect.tsx";
import { TFTd, TFTr } from "@/components/widgets/Table";

type Props = {
	index: number;
	remove: UseFieldArrayRemove;
	errors: FieldErrors<ShippingFulfilmentFormValues>;
	control: Control<ShippingFulfilmentFormValues, unknown>;
	register: UseFormRegister<ShippingFulfilmentFormValues>;
	setValue: UseFormSetValue<ShippingFulfilmentFormValues>;
	update: UseFieldArrayUpdate<ShippingFulfilmentFormValues, "lines">;
	fields: FieldArrayWithId<ShippingFulfilmentFormValues, "lines", "id">[];
	disabled: boolean;
};

export const ShippingLinesRow: FC<Props> = ({ index, errors, control, register }) => {
	const { orgId } = useStore(orgStore);

	const { data: carriersData, isLoading: isLoadingCarriers } = useGetAllCarriers({
		organisationId: orgId,
		pageNumber: "1",
		pageSize: "999",
		searchValue: "",
	});

	const allValues = useWatch({
		name: "lines",
		control,
	});

	const { packageNumber } = allValues[index];

	return (
		<TFTr>
			<TFTd>
				<Controller
					control={control}
					name={`lines.${index}.shipDate`}
					rules={{ required: "Required" }}
					render={({ field }) => {
						return (
							<TableDayPickerRhf
								{...field}
								value={field.value}
								placeholder="dd/mm/yyyy"
								onValueChange={field.onChange}
								error={errors?.lines?.[index]?.shipDate?.message}
							/>
						);
					}}
				/>
			</TFTd>
			<TFTd>
				<Controller
					name={`lines.${index}.carrier`}
					control={control}
					render={({ field }) => (
						<CustomTableSelect
							isLoading={isLoadingCarriers}
							useSearch
							{...field}
							id="batch"
							useNameAsId
							value={field.value}
							placeholder="Carrier"
							onValueChange={field.onChange}
							error={errors?.lines?.[index]?.carrier?.message}
							customValues={carriersData?.data?.carriers}
						/>
					)}
				/>
			</TFTd>
			<TFTd>
				<TableInputRhf<ShippingFulfilmentFormValues>
					type="text"
					label="Waybill #"
					register={register}
					id="orderLinesWaybillNumber"
					name={`lines.${index}.waybillNumber`}
					error={errors?.lines?.[index]?.waybillNumber?.message}
				/>
			</TFTd>
			<TFTd>
				<TableInputRhf<ShippingFulfilmentFormValues>
					type="text"
					label="Tracking Link"
					register={register}
					id="orderLinesTrackingLink"
					name={`lines.${index}.trackingLink`}
					error={errors?.lines?.[index]?.trackingLink?.message}
				/>
			</TFTd>
			<TFTd isText>{packageNumber}</TFTd>
		</TFTr>
	);
};
