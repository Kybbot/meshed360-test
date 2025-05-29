import { FC, useEffect } from "react";
import { useStore } from "zustand";

import {
	Control,
	useWatch,
	Controller,
	FieldErrors,
	UseFormSetValue,
	UseFormRegister,
	UseFieldArrayUpdate,
	UseFieldArrayRemove,
} from "react-hook-form";

import { useGetProductAvailability } from "../../api/queries/useGetProductAvailability";

import { SelectOption, SelectOptionOnlyWithName } from "@/@types/selects";
import {
	DefaultModificationLine,
	StockAdjustmentFormValues,
	ModificationLineFormValue,
} from "@/@types/stockControl";

import { TFRemove, TFTd, TFTr } from "@/components/widgets/Table";
import { TableInputRhf } from "@/components/shared/form/TableInputRhf";
import { CustomTableSelect } from "@/components/shared/CustomTableSelect";

import { useGetUserAndOrgInfo } from "@/hooks/useGetUserInfo";

import { orgStore } from "@/app/stores/orgStore";
import { getFormDayPickerDate } from "@/utils/date";

interface Props {
	index: number;
	isDisabled: boolean;
	remove: UseFieldArrayRemove;
	productOptions: SelectOption[];
	lines: ModificationLineFormValue[];
	batchOptions: SelectOptionOnlyWithName[];
	control: Control<StockAdjustmentFormValues>;
	errors: FieldErrors<StockAdjustmentFormValues>;
	setValue: UseFormSetValue<StockAdjustmentFormValues>;
	register: UseFormRegister<StockAdjustmentFormValues>;
	update: UseFieldArrayUpdate<StockAdjustmentFormValues, "modificationLines">;
}

const StockAdjustmentModificationLinesRow: FC<Props> = ({
	index,
	errors,
	lines,
	remove,
	update,
	control,
	register,
	setValue,
	isDisabled,
	batchOptions,
	productOptions,
}) => {
	const { orgId } = useStore(orgStore);
	const userAndOrgInfo = useGetUserAndOrgInfo();

	const locationId = useWatch({ control, name: "warehouse.id" });
	const productId = useWatch({ control, name: `modificationLines.${index}.product.id` });
	const batchNumber = useWatch({ control, name: `modificationLines.${index}.batchNumber.name` });

	const { data, isSuccess } = useGetProductAvailability({
		organisationId: orgId,
		productId: productId,
		warehouseId: locationId,
		batchNumber: batchNumber,
		isDisabled,
	});

	const expiryDate = useWatch({ control, name: `modificationLines.${index}.expiryDate` });
	const onHand = useWatch({ control, name: `modificationLines.${index}.quantityOnHand` });
	const available = useWatch({ control, name: `modificationLines.${index}.quantityAvailable` });
	const quantityNew = useWatch({ control, name: `modificationLines.${index}.quantityNew` });

	useEffect(() => {
		if (isDisabled) return;
		if (isSuccess && Array.isArray(data.data) && data.data.length > 0) {
			let availability;

			if (batchNumber) {
				availability = data.data[0];
			} else {
				availability = data.data.find((item) => item.batchNumber === null);
				if (!availability) {
					availability = data.data[0];
					if (availability?.batchNumber) {
						setValue(`modificationLines.${index}.batchNumber`, { name: availability.batchNumber });
					}
				}
			}
			if (availability) {
				setValue(`modificationLines.${index}.expiryDate`, getFormDayPickerDate(availability.expiryDate));
				setValue(`modificationLines.${index}.quantityOnHand`, availability.onHand);
				setValue(`modificationLines.${index}.quantityAvailable`, availability.available);
			}
		}
	}, [isSuccess, data, index, setValue, batchNumber, isDisabled]);

	return (
		<TFTr>
			<TFTd>
				<Controller
					control={control}
					name={`modificationLines.${index}.product`}
					render={({ field }) => (
						<CustomTableSelect
							{...field}
							useSearch
							id={`productSelector-${index}`}
							value={field.value}
							placeholder="Select Product"
							customValues={productOptions}
							onValueChange={(val) => {
								if (field.value?.id !== val?.id) {
									setValue(`modificationLines.${index}.batchNumber`, { name: "" });
									setValue(`modificationLines.${index}.expiryDate`, "");
									setValue(`modificationLines.${index}.quantityOnHand`, "0");
									setValue(`modificationLines.${index}.quantityAvailable`, "0");
									setValue(`modificationLines.${index}.quantityNew`, "0");
									setValue(`modificationLines.${index}.comment`, "");
								}
								field.onChange(val);
							}}
							error={errors?.modificationLines?.[index]?.product?.message}
							disabled={!locationId || isDisabled}
						/>
					)}
				/>
			</TFTd>
			<TFTd>
				<Controller
					control={control}
					rules={{
						validate: () => {
							const current = lines[index];

							const isDuplicate = lines.some(
								(line, i) =>
									i !== index &&
									line.product?.id === current.product?.id &&
									(line.batchNumber?.name ?? "null") === (current.batchNumber?.name ?? "null"),
							);

							return !isDuplicate || "Batch number already exists";
						},
					}}
					name={`modificationLines.${index}.batchNumber`}
					render={({ field }) => (
						<CustomTableSelect
							useSearch
							useNameAsId
							{...field}
							id={`batchSelector-${index}`}
							value={field.value}
							placeholder="Select Batch #"
							customValues={batchOptions}
							onValueChange={(val) => {
								if (val?.name !== field.value?.name) {
									setValue(`modificationLines.${index}.quantityNew`, "0");
									setValue(`modificationLines.${index}.comment`, "");
								}
								field.onChange(val);
							}}
							error={errors?.modificationLines?.[index]?.batchNumber?.message}
							disabled={!locationId || isDisabled}
						/>
					)}
				/>
			</TFTd>
			<TFTd isText>{expiryDate || "N/A"}</TFTd>
			<TFTd isText>{Number(onHand)}</TFTd>
			<TFTd isText>{Number(available)}</TFTd>
			<TFTd>
				<TableInputRhf<StockAdjustmentFormValues>
					min={0}
					step={0.01}
					type="number"
					label="New Quantity"
					register={register}
					disabled={!productId || isDisabled}
					rules={{
						min: 0,
						required: productId ? "Required" : false,
						onChange(event) {
							const value = +event.target.value;
							if (value < 0) {
								setValue(`modificationLines.${index}.quantityNew`, "0");
							}
						},
					}}
					id={`quantityNew-${index}`}
					name={`modificationLines.${index}.quantityNew`}
					error={errors?.modificationLines?.[index]?.quantityNew?.message}
				/>
			</TFTd>
			<TFTd isText>{quantityNew ? Number(quantityNew) - Number(available) : "0"}</TFTd>
			{userAndOrgInfo?.trackingCategoryA && (
				<TFTd>
					<Controller
						control={control}
						name={`modificationLines.${index}.trackingCategoryA`}
						render={({ field }) => (
							<CustomTableSelect
								{...field}
								useSearch
								value={field.value}
								placeholder="Select"
								disabled={!productId || isDisabled}
								onValueChange={field.onChange}
								id={`modificationLinesTrackingCategoryAId-${index}`}
								customValues={userAndOrgInfo.trackingCategoryA?.categories}
								error={errors?.modificationLines?.[index]?.trackingCategoryA?.message}
							/>
						)}
					/>
				</TFTd>
			)}
			{userAndOrgInfo?.trackingCategoryB && (
				<TFTd>
					<Controller
						control={control}
						name={`modificationLines.${index}.trackingCategoryB`}
						render={({ field }) => (
							<CustomTableSelect
								{...field}
								useSearch
								value={field.value}
								placeholder="Select"
								disabled={!productId || isDisabled}
								onValueChange={field.onChange}
								id={`modificationLinesTrackingCategoryBId-${index}`}
								customValues={userAndOrgInfo.trackingCategoryB?.categories}
								error={errors?.modificationLines?.[index]?.trackingCategoryB?.message}
							/>
						)}
					/>
				</TFTd>
			)}
			<TFTd>
				<TableInputRhf<StockAdjustmentFormValues>
					type="text"
					label="Comment"
					register={register}
					disabled={!productId || isDisabled}
					id={`comment-${index}`}
					name={`modificationLines.${index}.comment`}
					error={errors?.modificationLines?.[index]?.comment?.message}
				/>
			</TFTd>
			<TFTd>
				{!isDisabled && (
					<TFRemove
						onClick={() => {
							if (lines.length === 1 && index === 0) {
								update(index, DefaultModificationLine);
							} else {
								remove(index);
							}
						}}
					/>
				)}
			</TFTd>
		</TFTr>
	);
};

export default StockAdjustmentModificationLinesRow;
