import { FC } from "react";
import {
	Control,
	FieldErrors,
	useFieldArray,
	UseFormRegister,
	UseFormSetValue,
	useWatch,
} from "react-hook-form";

import { LinesRow } from "./LinesRow";

import { calculateFooterValues } from "../utils/calculate";

import { Button } from "@/components/shared/Button";

import {
	TF,
	TFAddRow,
	TFOverflow,
	TFTable,
	TFTbody,
	TFTd,
	TFTfoot,
	TFTh,
	TFThead,
	TFThFoot,
	TFTr,
	TFWrapper,
} from "@/components/widgets/Table";

import { CreditNoteLineType } from "@/@types/purchaseOrder/creditNote";
import { UnstockFormValues, DefaultUnstockLine, UnstockLineFormType } from "@/@types/purchaseOrder/unstock";

type Props = {
	disabledStatus: boolean;
	errors: FieldErrors<UnstockFormValues>;
	currentOrderLines?: CreditNoteLineType[];
	control: Control<UnstockFormValues, unknown>;
	register: UseFormRegister<UnstockFormValues>;
	setValue: UseFormSetValue<UnstockFormValues>;
	handleCopyCreditNoteItem: (creditNoteItem: CreditNoteLineType) => UnstockLineFormType | undefined;
};

export const Lines: FC<Props> = ({
	errors,
	control,
	disabledStatus,
	currentOrderLines,
	register,
	setValue,
	handleCopyCreditNoteItem,
}) => {
	const { update, remove, append, fields } = useFieldArray({
		name: "lines",
		control,
	});

	const allValues = useWatch({
		name: "lines",
		control,
	});

	const { totalQuantity } = calculateFooterValues(allValues);

	const orderLinesObj = allValues.reduce((acc: { [key: string]: number }, line) => {
		acc[line.orderLineId] = acc[line.orderLineId] ? acc[line.orderLineId] + +line.quantity : +line.quantity;

		return acc;
	}, {});

	return (
		<TF>
			<TFWrapper>
				<TFOverflow>
					<TFTable>
						<TFThead>
							<TFTr>
								<TFTh style={{ width: "16.5%" }}>Product</TFTh>
								<TFTh style={{ width: "16.5%" }}>Batch/Serial</TFTh>
								<TFTh style={{ width: "16.5%" }}>Unit</TFTh>
								<TFTh style={{ width: "16.5%" }}>Quantity</TFTh>
								<TFTh style={{ width: "16.5%" }}>Unstock Location</TFTh>
								<TFTh style={{ width: "16.5%" }}>Expiry Date</TFTh>
								<TFTh isActions></TFTh>
							</TFTr>
						</TFThead>
						{fields.length > 0 ? (
							<>
								<TFTbody>
									{fields.map((field, index) => (
										<LinesRow
											index={index}
											key={field.id}
											fields={fields}
											errors={errors}
											update={update}
											remove={remove}
											control={control}
											setValue={setValue}
											register={register}
											orderLinesObj={orderLinesObj}
											disabledStatus={disabledStatus}
											currentOrderLines={currentOrderLines}
											handleCopyCreditNoteItem={handleCopyCreditNoteItem}
										/>
									))}
								</TFTbody>
								<TFTfoot>
									<TFTr>
										<TFThFoot>Total</TFThFoot>
										<TFThFoot></TFThFoot>
										<TFThFoot></TFThFoot>
										<TFThFoot>{totalQuantity.toFixed(2)}</TFThFoot>
										<TFThFoot></TFThFoot>
										<TFThFoot></TFThFoot>
										<TFThFoot isActions></TFThFoot>
									</TFTr>
								</TFTfoot>
							</>
						) : (
							<TFTbody>
								<TFTr>
									<TFTd isEmpty colSpan={7}>
										No data available
									</TFTd>
								</TFTr>
							</TFTbody>
						)}
					</TFTable>
				</TFOverflow>
			</TFWrapper>

			{!disabledStatus && !!currentOrderLines?.length && (
				<TFAddRow>
					<Button type="button" isSecondary onClick={() => append(DefaultUnstockLine)}>
						<svg width="18" height="18" focusable="false" aria-hidden="true">
							<use xlinkHref="/icons/icons.svg#plus" />
						</svg>
						Add Row
					</Button>
				</TFAddRow>
			)}
		</TF>
	);
};
