import { FC } from "react";
import {
	Control,
	FieldErrors,
	useFieldArray,
	UseFormRegister,
	UseFormSetValue,
	useWatch,
} from "react-hook-form";

import { OrderServicesRow } from "./OrderServicesRow";

import { calculateFooterValues } from "@/pages/Orders/EditOrder/ui/tabs/Quote/utils/calculate.ts";

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

import { DefaultServiceLine, OrderFormValues } from "@/@types/salesOrders/local.ts";

type Props = {
	errors: FieldErrors<OrderFormValues>;
	control: Control<OrderFormValues, unknown>;
	register: UseFormRegister<OrderFormValues>;
	setValue: UseFormSetValue<OrderFormValues>;
	priceListContentData: Record<string, number> | null;
};

export const OrderServices: FC<Props> = ({ errors, control, register, setValue, priceListContentData }) => {
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
		<div>
			<h2 className="formTable__title">Additional Charges & Services</h2>
			<TF>
				<TFWrapper>
					<TFOverflow>
						<TFTable>
							<TFThead>
								<TFTr>
									<TFTh style={{ minWidth: "140px" }}>Product</TFTh>
									<TFTh>Comment</TFTh>
									<TFTh>Quantity</TFTh>
									<TFTh>Price</TFTh>
									<TFTh>Discount %</TFTh>
									<TFTh style={{ minWidth: "140px" }}>Tax</TFTh>
									<TFTh style={{ minWidth: "140px" }}>Account</TFTh>
									<TFTh isRight>Total</TFTh>
									<TFTh isActions></TFTh>
								</TFTr>
							</TFThead>

							{fields.length > 0 ? (
								<>
									<TFTbody>
										{fields.map((field, index) => (
											<OrderServicesRow
												key={field.id}
												index={index}
												errors={errors}
												remove={remove}
												control={control}
												setValue={setValue}
												register={register}
												priceListContentData={priceListContentData}
											/>
										))}
									</TFTbody>
									<TFTfoot>
										<TFTr>
											<TFThFoot>Total</TFThFoot>
											<TFThFoot />
											<TFThFoot>{totalQuantity}</TFThFoot>
											<TFThFoot>{totalPrice}</TFThFoot>
											<TFThFoot />
											<TFThFoot />
											<TFThFoot />
											<TFThFoot isRight>{total}</TFThFoot>
											<TFThFoot isActions />
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
				</TFWrapper>

				<TFAddRow>
					<Button type="button" isSecondary onClick={() => append(DefaultServiceLine)}>
						<svg width="18" height="18" focusable="false" aria-hidden="true">
							<use xlinkHref="/icons/icons.svg#plus" />
						</svg>
						Add Row
					</Button>
				</TFAddRow>
				<TFHr />
			</TF>
		</div>
	);
};
