import { FC } from "react";
import {
	Control,
	FieldErrors,
	useFieldArray,
	UseFormRegister,
	UseFormSetValue,
	useWatch,
} from "react-hook-form";

import { SubReceivingLinesRow } from "./SubReceivingLinesRow";

import { Button } from "@/components/shared/Button";

import {
	TF,
	TFAddRow,
	TFOverflow,
	TFTable,
	TFTbody,
	TFTd,
	TFTh,
	TFThead,
	TFTr,
	TFWrapper,
} from "@/components/widgets/Table";

import { GetOrderLineType, GetPurchaseOrderByIdResponseType } from "@/@types/purchaseOrder/order";
import { ReceivingType, DefaultReceivingRow, ReceivingFormValues } from "@/@types/purchaseOrder/receiving";

type Props = {
	disabledStatus: boolean;
	currentOrderLines?: GetOrderLineType[];
	errors: FieldErrors<ReceivingFormValues>;
	orderData: GetPurchaseOrderByIdResponseType;
	control: Control<ReceivingFormValues, unknown>;
	register: UseFormRegister<ReceivingFormValues>;
	setValue: UseFormSetValue<ReceivingFormValues>;
	billLinesQuantity: Record<string, number> | null;
	currentReceiving: ReceivingType | null | undefined;
};

export const SubReceivingLines: FC<Props> = ({
	errors,
	control,
	orderData,
	disabledStatus,
	currentReceiving,
	billLinesQuantity,
	currentOrderLines,
	register,
	setValue,
}) => {
	const disableBtn = disabledStatus || !currentOrderLines?.length;

	const { update, remove, append, fields } = useFieldArray({
		name: "lines",
		control,
	});

	const allValues = useWatch({
		name: "lines",
		control,
	});

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
								<TFTh style={{ width: "14%" }}>Product</TFTh>
								<TFTh style={{ width: "14%" }}>Batch/Serial</TFTh>
								<TFTh style={{ width: "14%" }}>Expiry Date</TFTh>
								<TFTh style={{ width: "14%" }}>Supplier SKU</TFTh>
								<TFTh style={{ width: "14%" }}>Quantity</TFTh>
								<TFTh style={{ width: "14%" }}>Outstanding</TFTh>
								<TFTh style={{ width: "14%" }}>Location</TFTh>
								<TFTh isActions></TFTh>
							</TFTr>
						</TFThead>
						{fields.length > 0 ? (
							<>
								<TFTbody>
									{fields.map((field, index) => (
										<SubReceivingLinesRow
											index={index}
											key={field.id}
											fields={fields}
											errors={errors}
											update={update}
											remove={remove}
											control={control}
											setValue={setValue}
											register={register}
											orderData={orderData}
											orderLinesObj={orderLinesObj}
											disabledStatus={disabledStatus}
											currentReceiving={currentReceiving}
											billLinesQuantity={billLinesQuantity}
											currentOrderLines={currentOrderLines}
										/>
									))}
								</TFTbody>
							</>
						) : (
							<TFTbody>
								<TFTr>
									<TFTd isEmpty colSpan={8}>
										Select Bill
									</TFTd>
								</TFTr>
							</TFTbody>
						)}
					</TFTable>
				</TFOverflow>
			</TFWrapper>
			{!disableBtn && (
				<TFAddRow>
					<Button isSecondary type="button" onClick={() => append(DefaultReceivingRow)}>
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
