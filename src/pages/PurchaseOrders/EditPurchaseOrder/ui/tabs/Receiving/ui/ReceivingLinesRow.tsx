import { FC, useEffect, useMemo } from "react";
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

import { ProductSelect } from "./ProductSelect";

import { TableInputRhf } from "@/components/shared/form/TableInputRhf";
import { TableDayPickerRhf } from "@/components/shared/form/TableDayPickerRhf";

import { TFRemove, TFTd, TFTr } from "@/components/widgets/Table";
import { FormTableProductSelect, FormTableWarehouseSelect } from "@/components/widgets/Selects";

import {
	ReceivingType,
	DefaultReceivingRow,
	ReceivingFormValues,
	GetAllReceivingResponseType,
} from "@/@types/purchaseOrder/receiving";
import { ProductType } from "@/@types/products";
import { GetOrderLineType, GetPurchaseOrderByIdResponseType } from "@/@types/purchaseOrder/order";

type Props = {
	index: number;
	orderLinesObj: {
		[key: string]: number;
	};
	disabledStatus: boolean;
	remove: UseFieldArrayRemove;
	data: GetAllReceivingResponseType;
	currentOrderLines?: GetOrderLineType[];
	errors: FieldErrors<ReceivingFormValues>;
	orderData: GetPurchaseOrderByIdResponseType;
	control: Control<ReceivingFormValues, unknown>;
	register: UseFormRegister<ReceivingFormValues>;
	setValue: UseFormSetValue<ReceivingFormValues>;
	currentReceiving: ReceivingType | null | undefined;
	update: UseFieldArrayUpdate<ReceivingFormValues, "lines">;
	fields: FieldArrayWithId<ReceivingFormValues, "lines", "id">[];
};

export const ReceivingLinesRow: FC<Props> = ({
	data,
	index,
	fields,
	errors,
	control,
	orderData,
	orderLinesObj,
	disabledStatus,
	currentReceiving,
	currentOrderLines,
	remove,
	update,
	register,
	setValue,
}) => {
	const billFirst = orderData.billFirst;
	const blindBill = orderData.blindBill;
	const warehouse = orderData.warehouse;
	const currentReceivingStatus = currentReceiving?.status;

	const disableField =
		disabledStatus || currentReceivingStatus === "VOID" || currentReceivingStatus === "AUTHORIZED";

	const allValues = useWatch({
		name: `lines.${index}`,
		control,
	});

	const { orderLineId, product, supplierSku, quantity, blindProduct } = allValues;

	const { finalQuantity, maxQuantity } = useMemo(() => {
		if (!orderLineId)
			return {
				finalQuantity: 0,
				maxQuantity: 0,
			};

		const billFirst = orderData.billFirst;
		const blindBill = orderData.blindBill;
		const stockFirst = orderData.stockFirst;

		if (stockFirst && blindBill) {
			return {
				finalQuantity: 0,
				maxQuantity: 0,
			};
		}

		if (orderLineId || (!blindBill && billFirst)) {
			const orderLineQuantity = !billFirst
				? orderData.orderLines.find((line) => line.id === orderLineId)?.quantity
				: currentOrderLines
					? currentOrderLines.find((line) => line.id === orderLineId)?.quantity
					: 0;

			const receivingsQuantity = data.receivings.reduce((acc, receiving) => {
				const linesQuantity =
					receiving.status === "AUTHORIZED"
						? receiving.lines.reduce((acc, line) => {
								return acc + (line.orderLineId === orderLineId ? +line.quantity : 0);
							}, 0)
						: 0;

				return acc + linesQuantity || 0;
			}, 0);

			const finalQuantity = Math.max(+(orderLineQuantity || 0) - receivingsQuantity, 0);

			const maxQuantity =
				currentReceivingStatus === "AUTHORIZED"
					? finalQuantity
					: Math.max(finalQuantity - orderLinesObj[orderLineId], 0);

			return {
				finalQuantity,
				maxQuantity,
			};
		}

		return {
			finalQuantity: 0,
			maxQuantity: 0,
		};
	}, [data, orderData, orderLineId, orderLinesObj, currentOrderLines, currentReceivingStatus]);

	useEffect(() => {
		if (product && !quantity && maxQuantity >= 0) {
			setValue(`lines.${index}.quantity`, maxQuantity.toString());
		}
	}, [index, product, quantity, maxQuantity, setValue]);

	return (
		<TFTr>
			<TFTd>
				{!blindBill || (blindBill && billFirst) ? (
					<Controller
						control={control}
						name={`lines.${index}.product`}
						rules={{
							required: "Required",
							onChange(event) {
								const value = event.target.value as GetOrderLineType;

								setValue(`lines.${index}.orderLineId`, value.id);
								setValue(`lines.${index}.supplierSku`, value.supplierSku);
								setValue(`lines.${index}.warehouse`, warehouse || value.product.defaultWarehouse);
								setValue(`lines.${index}.billIds`, value.billIds);
							},
						}}
						render={({ field }) => (
							<ProductSelect
								{...field}
								value={field.value}
								disabled={disableField}
								id="orderLinesproductId"
								finalQuantity={finalQuantity}
								onValueChange={field.onChange}
								error={errors?.lines?.[index]?.product?.message}
								customValues={orderData.billFirst ? currentOrderLines : orderData.orderLines}
							/>
						)}
					/>
				) : (
					<Controller
						control={control}
						name={`lines.${index}.blindProduct`}
						rules={{
							required: "Required",
							onChange(event) {
								const value = event.target.value as ProductType;

								setValue(`lines.${index}.supplierSku`, value.supplierSku);
								setValue(`lines.${index}.warehouse`, warehouse || value.defaultWarehouse);
							},
						}}
						render={({ field }) => (
							<FormTableProductSelect
								{...field}
								type="stock"
								value={field.value}
								id="orderLinesproductId"
								disabled={disableField}
								onValueChange={field.onChange}
								error={errors?.lines?.[index]?.blindProduct?.message}
							/>
						)}
					/>
				)}
			</TFTd>
			<TFTd>
				<TableInputRhf<ReceivingFormValues>
					type="text"
					register={register}
					label="Batch Or Serial Number"
					id="orderLinesBatchOrSerialNumberId"
					name={`lines.${index}.batchOrSerialNumber`}
					disabled={
						disableField ||
						product?.product.costingMethod === "FIFO" ||
						product?.product.costingMethod === "FEFO" ||
						blindProduct?.costingMethod === "FIFO" ||
						blindProduct?.costingMethod === "FEFO"
					}
					rules={{
						required: {
							message: "Required",
							value:
								product?.product.costingMethod === "FIFO_BATCH" ||
								product?.product.costingMethod === "FEFO_BATCH" ||
								blindProduct?.costingMethod === "FIFO_BATCH" ||
								blindProduct?.costingMethod === "FEFO_BATCH",
						},
					}}
					error={errors?.lines?.[index]?.batchOrSerialNumber?.message}
				/>
			</TFTd>
			<TFTd>
				<Controller
					control={control}
					name={`lines.${index}.expiryDate`}
					rules={{
						required: {
							message: "Required",
							value:
								product?.product.costingMethod === "FEFO" ||
								product?.product.costingMethod === "FEFO_BATCH" ||
								blindProduct?.costingMethod === "FEFO" ||
								blindProduct?.costingMethod === "FEFO_BATCH",
						},
					}}
					render={({ field }) => {
						return (
							<TableDayPickerRhf
								{...field}
								value={field.value}
								placeholder="dd/mm/yyyy"
								onValueChange={field.onChange}
								disabled={
									disableField ||
									product?.product.costingMethod === "FIFO" ||
									product?.product.costingMethod === "FIFO_BATCH" ||
									blindProduct?.costingMethod === "FIFO" ||
									blindProduct?.costingMethod === "FIFO_BATCH"
								}
								error={errors?.lines?.[index]?.expiryDate?.message}
							/>
						);
					}}
				/>
			</TFTd>
			<TFTd isText>{supplierSku}</TFTd>
			<TFTd>
				{!blindBill || (blindBill && billFirst) ? (
					<TableInputRhf<ReceivingFormValues>
						min={0}
						step={0.01}
						type="number"
						label="Quantity"
						register={register}
						disabled={disableField}
						rules={{
							required: "Required",
							min: { value: 1, message: "Min is 1" },
							onChange(event) {
								const value = +event.target.value;

								if (value < 0) {
									setValue(`lines.${index}.quantity`, "0");
								}
								if (value > +quantity + maxQuantity) {
									setValue(`lines.${index}.quantity`, (+quantity + maxQuantity).toString());
								}
							},
							max: {
								value: +quantity + maxQuantity,
								message: `Max quantity is ${+quantity + maxQuantity}`,
							},
						}}
						id="orderLinesquantityId"
						name={`lines.${index}.quantity`}
						error={errors?.lines?.[index]?.quantity?.message}
					/>
				) : (
					<TableInputRhf<ReceivingFormValues>
						min={0}
						step={0.01}
						type="number"
						label="Quantity"
						register={register}
						disabled={disableField}
						rules={{
							min: 0,
							required: "Required",
							onChange(event) {
								const value = +event.target.value;

								if (value < 0) {
									setValue(`lines.${index}.quantity`, "0");
								}
							},
						}}
						id="orderLinesquantityId"
						name={`lines.${index}.quantity`}
						error={errors?.lines?.[index]?.quantity?.message}
					/>
				)}
			</TFTd>
			<TFTd isRight>{currentReceivingStatus !== "VOID" ? maxQuantity || 0 : ""}</TFTd>
			<TFTd>
				<Controller
					name={`lines.${index}.warehouse`}
					control={control}
					rules={{
						required: "Required",
					}}
					render={({ field }) => (
						<FormTableWarehouseSelect
							{...field}
							value={field.value}
							disabled={disableField}
							id="orderLinesWarehouseId"
							onValueChange={field.onChange}
							error={errors?.lines?.[index]?.warehouse?.message}
						/>
					)}
				/>
			</TFTd>
			<TFTd>
				{!disableField && (
					<TFRemove
						onClick={() => {
							if (fields.length === 1 && index === 0) {
								update(index, DefaultReceivingRow);
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
