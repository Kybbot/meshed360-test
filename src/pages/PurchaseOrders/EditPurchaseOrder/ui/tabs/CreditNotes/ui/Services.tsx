import { FC } from "react";
import {
	Control,
	FieldErrors,
	useFieldArray,
	UseFormRegister,
	UseFormSetValue,
	useWatch,
} from "react-hook-form";

import { ServicesRow } from "./ServicesRow";

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
	TFTitle,
	TFTr,
	TFWrapper,
} from "@/components/widgets/Table";

import { GetPurchaseOrderByIdResponseType } from "@/@types/purchaseOrder/order";
import { CreditNoteFormValues, DefaultCreditNoteServiceLine } from "@/@types/purchaseOrder/creditNote";

type Props = {
	disabledServices: boolean;
	errors: FieldErrors<CreditNoteFormValues>;
	orderData: GetPurchaseOrderByIdResponseType;
	control: Control<CreditNoteFormValues, unknown>;
	register: UseFormRegister<CreditNoteFormValues>;
	setValue: UseFormSetValue<CreditNoteFormValues>;
};

export const Services: FC<Props> = ({ errors, control, orderData, disabledServices, register, setValue }) => {
	const { remove, append, fields } = useFieldArray({
		name: "serviceLines",
		control,
	});

	const allValues = useWatch({
		name: "serviceLines",
		control,
	});

	const { totalQuantity, totalPrice, total } = calculateFooterValues(allValues);

	return (
		<TF>
			<TFTitle>Additional Costs</TFTitle>

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
								<TFTh style={{ width: "15%" }}>Tax</TFTh>
								<TFTh style={{ width: "15%" }}>Account</TFTh>
								<TFTh isRight>Total</TFTh>
								<TFTh isActions></TFTh>
							</TFTr>
						</TFThead>
						{fields.length > 0 ? (
							<>
								<TFTbody>
									{fields.map((field, index) => (
										<ServicesRow
											index={index}
											key={field.id}
											errors={errors}
											remove={remove}
											control={control}
											setValue={setValue}
											register={register}
											orderData={orderData}
											disabledServices={disabledServices}
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
										<TFThFoot></TFThFoot>
										<TFThFoot isRight>{total}</TFThFoot>
										<TFThFoot isActions></TFThFoot>
									</TFTr>
								</TFTfoot>
							</>
						) : (
							<TFTbody>
								<TFTr>
									<TFTd isEmpty colSpan={9}>
										No data available
									</TFTd>
								</TFTr>
							</TFTbody>
						)}
					</TFTable>
				</TFOverflow>

				{!disabledServices && (
					<>
						<TFAddRow>
							<Button type="button" isSecondary onClick={() => append(DefaultCreditNoteServiceLine)}>
								<svg width="18" height="18" focusable="false" aria-hidden="true">
									<use xlinkHref="/icons/icons.svg#plus" />
								</svg>
								Add Row
							</Button>
						</TFAddRow>
						<TFHr />
					</>
				)}
			</TFWrapper>
		</TF>
	);
};
