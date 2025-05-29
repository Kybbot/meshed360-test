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
	TFHr,
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

import { BillLine } from "@/@types/purchaseOrders";
import { CreditNoteFormValues, DefaultCreditNoteLine } from "@/@types/purchaseOrder/creditNote";

type Props = {
	taxInclusive: boolean;
	disabledStatus: boolean;
	currentOrderLines?: BillLine[];
	errors: FieldErrors<CreditNoteFormValues>;
	control: Control<CreditNoteFormValues, unknown>;
	register: UseFormRegister<CreditNoteFormValues>;
	setValue: UseFormSetValue<CreditNoteFormValues>;
};

export const Lines: FC<Props> = ({
	errors,
	control,
	taxInclusive,
	disabledStatus,
	currentOrderLines,
	register,
	setValue,
}) => {
	const { update, remove, append, fields } = useFieldArray({
		name: "lines",
		control,
	});

	const allValues = useWatch({
		name: "lines",
		control,
	});

	const { totalQuantity, totalPrice, total } = calculateFooterValues(allValues);

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
								<TFTh style={{ width: "15%" }}>Product</TFTh>
								<TFTh>Comment</TFTh>
								<TFTh>Quantity</TFTh>
								<TFTh>Price</TFTh>
								<TFTh>Discount %</TFTh>
								<TFTh style={{ width: "15%" }}>Account</TFTh>
								<TFTh isRight>Total</TFTh>
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
											taxInclusive={taxInclusive}
											orderLinesObj={orderLinesObj}
											disabledStatus={disabledStatus}
											currentOrderLines={currentOrderLines}
										/>
									))}
								</TFTbody>
								<TFTfoot>
									<TFTr>
										<TFThFoot>Total</TFThFoot>
										<TFThFoot></TFThFoot>
										<TFThFoot>{totalQuantity}</TFThFoot>
										<TFThFoot>{totalPrice}</TFThFoot>
										<TFThFoot></TFThFoot>
										<TFThFoot></TFThFoot>
										<TFThFoot isRight>{total}</TFThFoot>
										<TFThFoot isActions></TFThFoot>
									</TFTr>
								</TFTfoot>
							</>
						) : (
							<TFTbody>
								<TFTr>
									<TFTd isEmpty colSpan={8}>
										Copy Lines from Bill
									</TFTd>
								</TFTr>
							</TFTbody>
						)}
					</TFTable>
				</TFOverflow>
			</TFWrapper>

			{!disabledStatus && currentOrderLines && (
				<>
					<TFAddRow>
						<Button type="button" isSecondary onClick={() => append(DefaultCreditNoteLine)}>
							<svg width="18" height="18" focusable="false" aria-hidden="true">
								<use xlinkHref="/icons/icons.svg#plus" />
							</svg>
							Add Row
						</Button>
					</TFAddRow>
					<TFHr />
				</>
			)}
		</TF>
	);
};
