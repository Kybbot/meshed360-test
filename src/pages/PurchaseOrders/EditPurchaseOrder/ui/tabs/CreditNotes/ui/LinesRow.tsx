import { FC, useEffect, useMemo } from "react";

import {
	Control,
	useWatch,
	Controller,
	FieldErrors,
	UseFormRegister,
	UseFormSetValue,
	FieldArrayWithId,
	UseFieldArrayRemove,
	UseFieldArrayUpdate,
} from "react-hook-form";

import { BillProductSelect } from "./BillProductSelect";

import { calculateTotal } from "../utils/calculate";

import { TableInputRhf } from "@/components/shared/form/TableInputRhf";

import { TFRemove, TFTd, TFTr } from "@/components/widgets/Table";
import { FormTableAccountSelect } from "@/components/widgets/Selects";

import { BillLine } from "@/@types/purchaseOrders";
import { CreditNoteFormValues, DefaultCreditNoteLine } from "@/@types/purchaseOrder/creditNote";

type Props = {
	index: number;
	taxInclusive: boolean;
	orderLinesObj: {
		[key: string]: number;
	};
	disabledStatus: boolean;
	remove: UseFieldArrayRemove;
	currentOrderLines?: BillLine[];
	errors: FieldErrors<CreditNoteFormValues>;
	control: Control<CreditNoteFormValues, unknown>;
	register: UseFormRegister<CreditNoteFormValues>;
	setValue: UseFormSetValue<CreditNoteFormValues>;
	update: UseFieldArrayUpdate<CreditNoteFormValues, "lines">;
	fields: FieldArrayWithId<CreditNoteFormValues, "lines", "id">[];
};

export const LinesRow: FC<Props> = ({
	index,
	fields,
	errors,
	control,
	taxInclusive,
	orderLinesObj,
	disabledStatus,
	currentOrderLines,
	remove,
	update,
	register,
	setValue,
}) => {
	const disableField = disabledStatus || !currentOrderLines;

	const allValues = useWatch({
		name: "lines",
		control,
	});

	const currentValues = allValues[index];
	const { orderLineId, quantity, unitPrice, discount } = currentValues;

	const { total, totalErrorMesssage } = calculateTotal(+unitPrice, +quantity, +discount, taxInclusive);

	const maxQuantity = useMemo(() => {
		if (orderLineId && currentOrderLines) {
			const orderLineQuantity = currentOrderLines
				? currentOrderLines.find((line) => line.orderLineId === orderLineId)?.quantity
				: 0;

			return Math.max(+(orderLineQuantity || 0) - orderLinesObj[orderLineId], 0);
		}

		return 0;
	}, [currentOrderLines, orderLineId, orderLinesObj]);

	useEffect(() => {
		if (total) {
			setValue(`lines.${index}.total`, total);
		}
	}, [index, total, setValue]);

	return (
		<TFTr>
			<TFTd>
				<Controller
					control={control}
					name={`lines.${index}.product`}
					rules={{
						required: "Required",
						onChange(event) {
							const value = event.target.value as BillLine;

							const quantity = Math.max(
								+value.quantity - (orderLinesObj?.[value.orderLineId] || 0),
								0,
							).toString();

							update(index, {
								lineId: "",
								orderLineId: value.orderLineId,
								product: value.product,
								comment: value.comment,
								quantity: quantity,
								unitPrice: value.unitPrice,
								discount: value.discount,
								account: value.account,
								total: "",
							});
						},
					}}
					render={({ field }) => (
						<BillProductSelect
							{...field}
							value={field.value}
							disabled={disableField}
							id="orderLinesproductId"
							orderLineId={orderLineId}
							onValueChange={field.onChange}
							customValues={currentOrderLines}
							error={errors?.lines?.[index]?.product?.message}
						/>
					)}
				/>
			</TFTd>
			<TFTd>
				<TableInputRhf<CreditNoteFormValues>
					type="text"
					label="Comment"
					register={register}
					disabled={disableField}
					id="orderLinescommentId"
					name={`lines.${index}.comment`}
					error={errors?.lines?.[index]?.comment?.message}
				/>
			</TFTd>
			<TFTd>
				<TableInputRhf<CreditNoteFormValues>
					min={0}
					step={0.01}
					type="number"
					label="Quantity"
					register={register}
					rules={{
						min: 0,
						required: "Required",
						max: {
							value: +quantity + maxQuantity,
							message: `Max quantity is ${+quantity + maxQuantity}`,
						},
						onChange(event) {
							const value = +event.target.value as number;

							if (value < 0) {
								setValue(`lines.${index}.quantity`, "0");
							}
							if (value > +quantity + maxQuantity) {
								setValue(`lines.${index}.quantity`, (+quantity + maxQuantity).toString());
							}
						},
					}}
					disabled={disableField}
					id="orderLinesquantityId"
					name={`lines.${index}.quantity`}
					error={errors?.lines?.[index]?.quantity?.message}
				/>
			</TFTd>
			<TFTd>
				<TableInputRhf<CreditNoteFormValues>
					min={0}
					step={0.01}
					type="number"
					label="Price"
					register={register}
					rules={{
						min: 0,
						required: "Required",
					}}
					disabled={disableField}
					id="orderLinesunitPriceId"
					name={`lines.${index}.unitPrice`}
					error={errors?.lines?.[index]?.unitPrice?.message || totalErrorMesssage}
				/>
			</TFTd>
			<TFTd>
				<TableInputRhf<CreditNoteFormValues>
					min={0}
					step={0.01}
					type="number"
					label="Discount"
					register={register}
					rules={{
						min: 0,
						max: 100,
						onChange(event) {
							const value = +event.target.value as number;
							if (value < 0 || value > 100) {
								setValue(`lines.${index}.discount`, "0");
							}
						},
					}}
					disabled={disableField}
					id="orderLinesdiscountId"
					name={`lines.${index}.discount`}
					error={errors?.lines?.[index]?.discount?.message}
				/>
			</TFTd>
			<TFTd>
				<Controller
					control={control}
					name={`lines.${index}.account`}
					rules={{
						required: "Required",
					}}
					render={({ field }) => (
						<FormTableAccountSelect
							{...field}
							value={field.value}
							type="expenseAccounts"
							disabled={disableField}
							id="orderLinesAccountId"
							onValueChange={field.onChange}
							error={errors?.lines?.[index]?.account?.message}
						/>
					)}
				/>
			</TFTd>
			<TFTd isRight>{total}</TFTd>
			<TFTd>
				{!disableField && (
					<TFRemove
						onClick={() => {
							if (fields.length === 1 && index === 0) {
								update(index, DefaultCreditNoteLine);
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
