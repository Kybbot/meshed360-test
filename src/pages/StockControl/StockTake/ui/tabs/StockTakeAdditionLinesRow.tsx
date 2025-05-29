import { FC } from "react";

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

import { useGetUserAndOrgInfo } from "@/hooks/useGetUserInfo";

import { ProductType } from "@/@types/products";
import {
	AdditionStockTakeLineFormValue,
	DefaultStockTakeAdditionLine,
	StockTakeFormValues,
} from "@/@types/stockControl";

import { TFRemove, TFTd, TFTr } from "@/components/widgets/Table";
import { TableInputRhf } from "@/components/shared/form/TableInputRhf";
import { CustomTableSelect } from "@/components/shared/CustomTableSelect";
import { TableDayPickerRhf } from "@/components/shared/form/TableDayPickerRhf";

type ProductSelectOption = ProductType & { id: string; name: string };

interface Props {
	index: number;
	isDisabled: boolean;
	remove: UseFieldArrayRemove;
	productOptions: ProductSelectOption[];
	lines: AdditionStockTakeLineFormValue[];
	control: Control<StockTakeFormValues>;
	errors: FieldErrors<StockTakeFormValues>;
	setValue: UseFormSetValue<StockTakeFormValues>;
	register: UseFormRegister<StockTakeFormValues>;
	update: UseFieldArrayUpdate<StockTakeFormValues, "additionLines">;
}

const StockTakeAdditionLinesRow: FC<Props> = ({
	index,
	errors,
	lines,
	remove,
	update,
	control,
	register,
	setValue,
	isDisabled,
	productOptions,
}) => {
	const userAndOrgInfo = useGetUserAndOrgInfo();
	const locationId = useWatch({ control, name: "warehouse.id" });
	const productId = useWatch({ control, name: `additionLines.${index}.product.id` });

	const modificationLines = useWatch({ control, name: "modificationLines" });

	const selectedProduct = productOptions.find((p) => p.id === productId);
	const disableBatch = selectedProduct?.costingMethod === "FIFO" || selectedProduct?.costingMethod === "FEFO";

	return (
		<TFTr>
			<TFTd>
				<Controller
					control={control}
					name={`additionLines.${index}.product`}
					render={({ field }) => (
						<CustomTableSelect
							{...field}
							useSearch
							id={`additionLines-productSelector-${index}`}
							value={field.value}
							placeholder="Select Product"
							customValues={productOptions}
							onValueChange={(val) => {
								if (field.value?.id !== val?.id) {
									setValue(`additionLines.${index}.batchNumber`, "");
									setValue(`additionLines.${index}.expiryDate`, undefined);
									setValue(`additionLines.${index}.quantity`, "0");
									setValue(`additionLines.${index}.unitCost`, "0");
									setValue(`additionLines.${index}.comment`, "");
								}
								field.onChange(val);
							}}
							error={errors?.additionLines?.[index]?.product?.message}
							disabled={!locationId || isDisabled}
						/>
					)}
				/>
			</TFTd>
			<TFTd>
				<TableInputRhf<StockTakeFormValues>
					type="text"
					label="Batch #"
					register={register}
					disabled={!productId || isDisabled || disableBatch}
					id={`additionLines-batchSelector-${index}`}
					name={`additionLines.${index}.batchNumber`}
					rules={{
						validate: () => {
							const current = lines[index];
							const currentProductId = current.product?.id;
							const currentBatch = (current.batchNumber ?? "null").trim();

							if (
								lines.some(
									(line, i) =>
										i !== index &&
										line.product?.id === currentProductId &&
										(line.batchNumber ?? "null").trim() === currentBatch,
								)
							) {
								return "Batch number already exists";
							}

							if (
								modificationLines?.some(
									(line) =>
										line.product?.id === currentProductId &&
										(line.batchNumber?.name ?? "null").trim() === currentBatch,
								)
							) {
								return "Batch number already exists in current stock";
							}

							return true;
						},
					}}
					error={errors?.additionLines?.[index]?.batchNumber?.message}
				/>
			</TFTd>
			<TFTd>
				<Controller
					control={control}
					name={`additionLines.${index}.expiryDate`}
					render={({ field }) => {
						return (
							<TableDayPickerRhf
								{...field}
								value={field.value}
								disabled={!productId || isDisabled || disableBatch}
								placeholder="dd/mm/yyyy"
								onValueChange={field.onChange}
								error={errors?.additionLines?.[index]?.expiryDate?.message}
							/>
						);
					}}
				/>
			</TFTd>
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
								setValue(`additionLines.${index}.quantity`, "0");
							}
						},
					}}
					id={`additionLines-quantity-${index}`}
					name={`additionLines.${index}.quantity`}
					error={errors?.additionLines?.[index]?.quantity?.message}
				/>
			</TFTd>
			<TFTd>
				<TableInputRhf<StockTakeFormValues>
					step={0.01}
					type="number"
					label="Unit Cost"
					register={register}
					disabled={!productId || isDisabled}
					rules={{
						...(productId && {
							min: {
								value: 0.01,
								message: "Unable to use 0 cost",
							},
							required: "Required",
						}),
						onChange(event) {
							const value = +event.target.value;
							if (value < 0) {
								setValue(`additionLines.${index}.unitCost`, "0");
							}
						},
					}}
					id={`additionLines-unitCost-${index}`}
					name={`additionLines.${index}.unitCost`}
					error={errors?.additionLines?.[index]?.unitCost?.message}
				/>
			</TFTd>
			{userAndOrgInfo?.trackingCategoryA && (
				<TFTd>
					<Controller
						control={control}
						name={`additionLines.${index}.trackingCategoryA`}
						render={({ field }) => (
							<CustomTableSelect
								{...field}
								useSearch
								value={field.value}
								placeholder="Select"
								disabled={!productId || isDisabled}
								onValueChange={field.onChange}
								id={`additionLines-categoryB-${index}`}
								customValues={userAndOrgInfo.trackingCategoryA?.categories}
								error={errors?.additionLines?.[index]?.trackingCategoryA?.message}
							/>
						)}
					/>
				</TFTd>
			)}
			{userAndOrgInfo?.trackingCategoryB && (
				<TFTd>
					<Controller
						control={control}
						name={`additionLines.${index}.trackingCategoryB`}
						render={({ field }) => (
							<CustomTableSelect
								{...field}
								useSearch
								value={field.value}
								placeholder="Select"
								disabled={!productId || isDisabled}
								onValueChange={field.onChange}
								id={`additionLines-categoryB-${index}`}
								customValues={userAndOrgInfo.trackingCategoryB?.categories}
								error={errors?.additionLines?.[index]?.trackingCategoryB?.message}
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
					id={`additionLines-comment-${index}`}
					name={`additionLines.${index}.comment`}
					error={errors?.additionLines?.[index]?.comment?.message}
				/>
			</TFTd>
			<TFTd>
				{!isDisabled && (
					<TFRemove
						onClick={() => {
							if (lines.length === 1 && index === 0) {
								update(index, DefaultStockTakeAdditionLine);
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

export default StockTakeAdditionLinesRow;
