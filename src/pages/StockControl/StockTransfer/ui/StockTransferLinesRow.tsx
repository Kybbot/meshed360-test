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

import { useGetProductAvailability } from "../../StockAdjustment/api/queries/useGetProductAvailability";

import { SelectOption, SelectOptionOnlyWithName } from "@/@types/selects";
import {
	StockTransferFormValues,
	DefaultStockTransferLine,
	StockTransferLineFormValue,
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
	lines: StockTransferLineFormValue[];
	batchOptions: SelectOptionOnlyWithName[];
	control: Control<StockTransferFormValues>;
	errors: FieldErrors<StockTransferFormValues>;
	setValue: UseFormSetValue<StockTransferFormValues>;
	register: UseFormRegister<StockTransferFormValues>;
	update: UseFieldArrayUpdate<StockTransferFormValues, "lines">;
}

const StockTransferLinesRow: FC<Props> = ({
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

	const locationId = useWatch({ control, name: "sourceLocation.id" });
	const productId = useWatch({ control, name: `lines.${index}.product.id` });
	const batchNumber = useWatch({ control, name: `lines.${index}.batchNumber.name` });

	const { data, isSuccess } = useGetProductAvailability({
		organisationId: orgId,
		productId: productId,
		warehouseId: locationId,
		batchNumber: batchNumber,
		isDisabled,
	});

	const expiryDate = useWatch({ control, name: `lines.${index}.expiryDate` });
	const onHand = useWatch({ control, name: `lines.${index}.onHand` });

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
						setValue(`lines.${index}.batchNumber`, { name: availability.batchNumber });
					}
				}
			}
			if (availability) {
				setValue(`lines.${index}.expiryDate`, getFormDayPickerDate(availability.expiryDate));
				setValue(`lines.${index}.onHand`, availability.onHand);
			}
		}
	}, [isSuccess, data, index, setValue, batchNumber, isDisabled]);

	return (
		<TFTr>
			<TFTd>
				<Controller
					control={control}
					name={`lines.${index}.product`}
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
									setValue(`lines.${index}.batchNumber`, { name: "" });
									setValue(`lines.${index}.expiryDate`, "");
									setValue(`lines.${index}.onHand`, "0");
									setValue(`lines.${index}.quantity`, "0");
									setValue(`lines.${index}.comment`, "");
								}
								field.onChange(val);
							}}
							error={errors?.lines?.[index]?.product?.message}
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
					name={`lines.${index}.batchNumber`}
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
									setValue(`lines.${index}.quantity`, "0");
									setValue(`lines.${index}.comment`, "");
								}
								field.onChange(val);
							}}
							error={errors?.lines?.[index]?.batchNumber?.message}
							disabled={!locationId || isDisabled}
						/>
					)}
				/>
			</TFTd>
			<TFTd isText>{expiryDate || "N/A"}</TFTd>
			<TFTd isText>{Number(onHand)}</TFTd>
			<TFTd>
				<TableInputRhf<StockTransferFormValues>
					type="number"
					min={0}
					step={0.01}
					label="New Quantity"
					register={register}
					disabled={!productId || isDisabled}
					rules={{
						required: productId ? "Required" : false,
						min: 0,
						onChange(event) {
							if (+event.target.value < 0) {
								setValue(`lines.${index}.quantity`, "0");
							}
						},
					}}
					id={`quantityNew-${index}`}
					name={`lines.${index}.quantity`}
					error={errors?.lines?.[index]?.quantity?.message}
				/>
			</TFTd>
			{userAndOrgInfo?.trackingCategoryA && (
				<TFTd>
					<Controller
						control={control}
						name={`lines.${index}.trackingCategoryA`}
						render={({ field }) => (
							<CustomTableSelect
								{...field}
								useSearch
								value={field.value}
								placeholder="Select"
								disabled={!productId || isDisabled}
								onValueChange={field.onChange}
								id={`linesTrackingCategoryAId-${index}`}
								customValues={userAndOrgInfo.trackingCategoryA?.categories}
								error={errors?.lines?.[index]?.trackingCategoryA?.message}
							/>
						)}
					/>
				</TFTd>
			)}
			{userAndOrgInfo?.trackingCategoryB && (
				<TFTd>
					<Controller
						control={control}
						name={`lines.${index}.trackingCategoryB`}
						render={({ field }) => (
							<CustomTableSelect
								{...field}
								useSearch
								value={field.value}
								placeholder="Select"
								disabled={!productId || isDisabled}
								onValueChange={field.onChange}
								id={`linesTrackingCategoryBId-${index}`}
								customValues={userAndOrgInfo.trackingCategoryB?.categories}
								error={errors?.lines?.[index]?.trackingCategoryB?.message}
							/>
						)}
					/>
				</TFTd>
			)}
			<TFTd>
				<TableInputRhf<StockTransferFormValues>
					type="text"
					label="Comment"
					register={register}
					disabled={!productId || isDisabled}
					id={`comment-${index}`}
					name={`lines.${index}.comment`}
					error={errors?.lines?.[index]?.comment?.message}
				/>
			</TFTd>
			<TFTd>
				{!isDisabled && (
					<TFRemove
						onClick={() => {
							if (lines.length === 1 && index === 0) {
								update(index, DefaultStockTransferLine);
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

export default StockTransferLinesRow;
