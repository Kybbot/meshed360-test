import { FC, useMemo } from "react";

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

import { UnstockProductSelect } from "./UnstockProductSelect";

import { TableInputRhf } from "@/components/shared/form/TableInputRhf";

import { TFRemove, TFTd, TFTr } from "@/components/widgets/Table";

import { getFormDayPickerDate } from "@/utils/date";

import { CreditNoteLineType } from "@/@types/purchaseOrder/creditNote";
import { UnstockFormValues, DefaultUnstockLine, UnstockLineFormType } from "@/@types/purchaseOrder/unstock";

type Props = {
	index: number;
	orderLinesObj: {
		[key: string]: number;
	};
	disabledStatus: boolean;
	remove: UseFieldArrayRemove;
	errors: FieldErrors<UnstockFormValues>;
	currentOrderLines?: CreditNoteLineType[];
	control: Control<UnstockFormValues, unknown>;
	register: UseFormRegister<UnstockFormValues>;
	setValue: UseFormSetValue<UnstockFormValues>;
	update: UseFieldArrayUpdate<UnstockFormValues, "lines">;
	fields: FieldArrayWithId<UnstockFormValues, "lines", "id">[];
	handleCopyCreditNoteItem: (creditNoteItem: CreditNoteLineType) => UnstockLineFormType | undefined;
};

export const LinesRow: FC<Props> = ({
	index,
	fields,
	errors,
	control,
	orderLinesObj,
	disabledStatus,
	currentOrderLines,
	remove,
	update,
	register,
	setValue,
	handleCopyCreditNoteItem,
}) => {
	const disableField = disabledStatus || !currentOrderLines;

	const allValues = useWatch({
		name: "lines",
		control,
	});

	const currentValues = allValues[index];
	const { orderLineId, batchOrSerialNumber, unitOfMeasure, quantity, unstockLocation, expiryDate } =
		currentValues;

	const maxQuantity = useMemo(() => {
		if (orderLineId && currentOrderLines) {
			const orderLineQuantity = currentOrderLines
				? currentOrderLines.find((line) => line.orderLineId === orderLineId)?.quantity
				: 0;

			return Math.max(+(orderLineQuantity || 0) - orderLinesObj[orderLineId], 0);
		}

		return 0;
	}, [currentOrderLines, orderLineId, orderLinesObj]);

	return (
		<TFTr>
			<TFTd>
				<Controller
					control={control}
					name={`lines.${index}.product`}
					rules={{
						required: "Required",
						onChange(event) {
							const value = event.target.value as CreditNoteLineType;
							const data = handleCopyCreditNoteItem(value);

							const quantity = Math.max(
								+value.quantity - (orderLinesObj?.[value.orderLineId] || 0),
								0,
							).toFixed(2);

							setValue(`lines.${index}.orderLineId`, value.orderLineId);
							setValue(`lines.${index}.quantity`, quantity);
							if (data) {
								setValue(`lines.${index}.batchOrSerialNumber`, data.batchOrSerialNumber);
								setValue(`lines.${index}.unitOfMeasure`, data.unitOfMeasure);
								setValue(`lines.${index}.unstockLocation`, data.unstockLocation);
								setValue(`lines.${index}.expiryDate`, data.expiryDate);
							}
						},
					}}
					render={({ field }) => (
						<UnstockProductSelect
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
			<TFTd isText>{batchOrSerialNumber}</TFTd>
			<TFTd isText>{unitOfMeasure?.name || ""}</TFTd>
			<TFTd>
				<TableInputRhf<UnstockFormValues>
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
								setValue(`lines.${index}.quantity`, (+quantity + maxQuantity).toFixed(2));
							}
						},
					}}
					disabled={disableField}
					id="orderLinesquantityId"
					name={`lines.${index}.quantity`}
					error={errors?.lines?.[index]?.quantity?.message}
				/>
			</TFTd>
			<TFTd isText>{unstockLocation?.name}</TFTd>
			<TFTd isText>{getFormDayPickerDate(expiryDate, true) || "-"}</TFTd>
			<TFTd>
				{!disableField && (
					<TFRemove
						onClick={() => {
							if (fields.length === 1 && index === 0) {
								update(index, DefaultUnstockLine);
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
