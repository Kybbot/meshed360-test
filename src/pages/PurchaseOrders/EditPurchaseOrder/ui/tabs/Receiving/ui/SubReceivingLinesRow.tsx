import { FC, useMemo } from "react";
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
import { FormTableWarehouseSelect } from "@/components/widgets/Selects";

import { GetOrderLineType, GetPurchaseOrderByIdResponseType } from "@/@types/purchaseOrder/order";
import { ReceivingType, DefaultReceivingRow, ReceivingFormValues } from "@/@types/purchaseOrder/receiving";

type Props = {
	index: number;
	orderLinesObj: {
		[key: string]: number;
	};
	disabledStatus: boolean;
	remove: UseFieldArrayRemove;
	currentOrderLines?: GetOrderLineType[];
	errors: FieldErrors<ReceivingFormValues>;
	orderData: GetPurchaseOrderByIdResponseType;
	control: Control<ReceivingFormValues, unknown>;
	register: UseFormRegister<ReceivingFormValues>;
	setValue: UseFormSetValue<ReceivingFormValues>;
	billLinesQuantity: Record<string, number> | null;
	currentReceiving: ReceivingType | null | undefined;
	update: UseFieldArrayUpdate<ReceivingFormValues, "lines">;
	fields: FieldArrayWithId<ReceivingFormValues, "lines", "id">[];
};

export const SubReceivingLinesRow: FC<Props> = ({
	index,
	fields,
	errors,
	control,
	orderData,
	orderLinesObj,
	disabledStatus,
	currentReceiving,
	billLinesQuantity,
	currentOrderLines,
	remove,
	update,
	register,
	setValue,
}) => {
	const warehouse = orderData.warehouse;
	const currentReceivingStatus = currentReceiving?.status;

	const disableField =
		disabledStatus || currentReceivingStatus === "VOID" || currentReceivingStatus === "AUTHORIZED";

	const allValues = useWatch({
		name: `lines.${index}`,
		control,
	});

	const { orderLineId, product, supplierSku, quantity, blindProduct } = allValues;

	const { maxQuantity, finalQuantity } = useMemo(() => {
		if (orderLineId) {
			const finalQuantity = billLinesQuantity?.[orderLineId] || 0;

			const maxQuantity =
				currentReceivingStatus === "AUTHORIZED"
					? finalQuantity
					: Math.max(finalQuantity - orderLinesObj[orderLineId], 0);

			return { maxQuantity, finalQuantity };
		}

		return { maxQuantity: 0, finalQuantity: 0 };
	}, [orderLineId, orderLinesObj, currentReceivingStatus, billLinesQuantity]);

	return (
		<TFTr>
			<TFTd>
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
						max: {
							value: +quantity + maxQuantity,
							message: `Max quantity is ${+quantity + maxQuantity}`,
						},
						onChange(event) {
							const value = +event.target.value;

							if (value < 0) {
								setValue(`lines.${index}.quantity`, "0");
							}
							if (value > +quantity + maxQuantity) {
								setValue(`lines.${index}.quantity`, (+quantity + maxQuantity).toString());
							}
						},
					}}
					id="orderLinesquantityId"
					name={`lines.${index}.quantity`}
					error={errors?.lines?.[index]?.quantity?.message}
				/>
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
