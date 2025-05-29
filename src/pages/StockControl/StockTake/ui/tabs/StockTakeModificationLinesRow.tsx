import { FC, useEffect, useRef } from "react";
import { useStore } from "zustand";

import {
	Control,
	useWatch,
	Controller,
	FieldErrors,
	UseFormRegister,
	UseFormSetValue,
} from "react-hook-form";

import { StockTakeFormValues } from "@/@types/stockControl";

import { useGetUserAndOrgInfo } from "@/hooks/useGetUserInfo";

import { useGetProductAvailability } from "@/pages/StockControl/StockAdjustment/api/queries/useGetProductAvailability";

import { TFTd, TFTr } from "@/components/widgets/Table";
import { TableInputRhf } from "@/components/shared/form/TableInputRhf";
import { CustomTableSelect } from "@/components/shared/CustomTableSelect";

import { orgStore } from "@/app/stores/orgStore";
import { getFormDayPickerDate } from "@/utils/date";

interface Props {
	index: number;
	status?: string;
	includeOnHand: boolean;
	control: Control<StockTakeFormValues>;
	errors: FieldErrors<StockTakeFormValues>;
	setValue: UseFormSetValue<StockTakeFormValues>;
	register: UseFormRegister<StockTakeFormValues>;
}

const StockTakeModificationLinesRow: FC<Props> = ({
	index,
	errors,
	status,
	control,
	register,
	setValue,
	includeOnHand,
}) => {
	const { orgId } = useStore(orgStore);
	const userAndOrgInfo = useGetUserAndOrgInfo();

	const locationId = useWatch({ control, name: "warehouse.id" });
	const productId = useWatch({ control, name: `modificationLines.${index}.product.id` });
	const batchNumber = useWatch({ control, name: `modificationLines.${index}.batchNumber.name` });

	const isDisabled = status !== "IN_PROGRESS";

	const { data, isSuccess } = useGetProductAvailability({
		organisationId: orgId,
		productId: productId,
		warehouseId: locationId,
		batchNumber: batchNumber,
		isDisabled,
	});

	const expiryDate = useWatch({ control, name: `modificationLines.${index}.expiryDate` });
	const onHand = useWatch({ control, name: `modificationLines.${index}.quantityOnHand` });
	const quantityNew = useWatch({ control, name: `modificationLines.${index}.quantityNew` });
	const quantityNewRef = useRef(useWatch({ control, name: `modificationLines.${index}.quantityNew` }));

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
				if (!quantityNewRef.current || Number(quantityNewRef.current) === 0) {
					setValue(`modificationLines.${index}.quantityNew`, `${Math.round(+availability.onHand)}`);
				}
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
							useSearch
							{...field}
							disabled={true}
							value={field.value}
							placeholder="Select Product"
							onValueChange={field.onChange}
							id={`productSelector-${index}`}
							error={errors?.modificationLines?.[index]?.product?.message}
						/>
					)}
				/>
			</TFTd>
			<TFTd>
				<Controller
					control={control}
					name={`modificationLines.${index}.batchNumber`}
					render={({ field }) => {
						const value = !field.value?.name ? { name: "-" } : field.value;
						return (
							<CustomTableSelect
								useSearch
								{...field}
								useNameAsId
								value={value}
								disabled={true}
								placeholder="Select Batch #"
								id={`batchSelector-${index}`}
								onValueChange={field.onChange}
								error={errors?.modificationLines?.[index]?.batchNumber?.message}
							/>
						);
					}}
				/>
			</TFTd>
			<TFTd isText>{expiryDate || "N/A"}</TFTd>
			{includeOnHand && <TFTd isText>{Number(onHand)}</TFTd>}
			<TFTd>
				<TableInputRhf<StockTakeFormValues>
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
			<TFTd isText>{quantityNew ? Number(quantityNew) - Number(onHand) : "0"}</TFTd>
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
				<TableInputRhf<StockTakeFormValues>
					type="text"
					label="Comment"
					register={register}
					disabled={!productId || isDisabled}
					id={`comment-${index}`}
					name={`modificationLines.${index}.comment`}
					error={errors?.modificationLines?.[index]?.comment?.message}
				/>
			</TFTd>
		</TFTr>
	);
};

export default StockTakeModificationLinesRow;
