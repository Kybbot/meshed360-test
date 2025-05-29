import { FC } from "react";
import {
	Control,
	FieldErrors,
	useFieldArray,
	UseFormRegister,
	UseFormSetValue,
	UseFormTrigger,
	useWatch,
} from "react-hook-form";

import { OrderLinesRow } from "./OrderLinesRow.tsx";

import { calculateWoolworthsFooterValues } from "@/pages/Orders/EditOrder/ui/tabs/Quote/utils/calculate.ts";

import { Button } from "@/components/shared/Button.tsx";

import { EmptyWoolworthsOrderLine, OrderFormValues } from "@/@types/salesOrders/local.ts";
import { useGetUserAndOrgInfo } from "@/hooks/useGetUserInfo.ts";

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

type Props = {
	errors: FieldErrors<OrderFormValues>;
	control: Control<OrderFormValues, unknown>;
	register: UseFormRegister<OrderFormValues>;
	setValue: UseFormSetValue<OrderFormValues>;
	priceListContentData: Record<string, number> | null;
	isSubmitted: boolean;
	trigger: UseFormTrigger<OrderFormValues>;
};

export const OrderLines: FC<Props> = ({
	errors,
	control,
	register,
	setValue,
	priceListContentData,
	isSubmitted,
	trigger,
}) => {
	const userAndOrgInfo = useGetUserAndOrgInfo();

	const { update, remove, append, fields } = useFieldArray({
		name: "woolworthsQuoteLines",
		control,
	});

	const allValues = useWatch({
		name: "woolworthsQuoteLines",
		control,
	});

	const currentTaxRate = useWatch({
		name: "taxRate",
		control,
	});

	const total = calculateWoolworthsFooterValues(allValues);

	return (
		<TF>
			<TFWrapper>
				<TFOverflow>
					<TFTable>
						<TFThead>
							<TFTr>
								<TFTh style={{ minWidth: "140px" }}>Product</TFTh>
								<TFTh>Comment</TFTh>
								<TFTh>Pack order</TFTh>
								<TFTh>XS/S Lugs</TFTh>
								<TFTh>L Lugs</TFTh>
								<TFTh>Quantity</TFTh>
								<TFTh>Mass</TFTh>
								<TFTh>Avg KG</TFTh>
								<TFTh>Price</TFTh>
								<TFTh>Discount %</TFTh>
								<TFTh style={{ minWidth: "140px" }}>Tax</TFTh>
								<TFTh>Margin</TFTh>
								{!!userAndOrgInfo?.trackingCategoryAFiltered?.categories.length && (
									<TFTh style={{ minWidth: "140px" }}>{userAndOrgInfo.trackingCategoryAFiltered.name}</TFTh>
								)}
								{!!userAndOrgInfo?.trackingCategoryBFiltered?.categories.length && (
									<TFTh style={{ minWidth: "140px" }}>{userAndOrgInfo.trackingCategoryBFiltered.name}</TFTh>
								)}
								<TFTh style={{ minWidth: "140px" }}>Account</TFTh>
								<TFTh isRight>Total</TFTh>
								<TFTh isActions></TFTh>
							</TFTr>
						</TFThead>

						{fields.length > 0 ? (
							<>
								<TFTbody>
									{fields.map((field, index) => (
										<OrderLinesRow
											key={field.id}
											index={index}
											fields={fields}
											isSubmitted={isSubmitted}
											errors={errors}
											update={update}
											remove={remove}
											control={control}
											setValue={setValue}
											register={register}
											priceListContentData={priceListContentData}
											trigger={trigger}
										/>
									))}
								</TFTbody>
								<TFTfoot>
									<TFTr>
										<TFThFoot>Total</TFThFoot>
										<TFThFoot />
										<TFThFoot />
										<TFThFoot>{total.totalSLugs}</TFThFoot>
										<TFThFoot>{total.totalLLugs}</TFThFoot>
										<TFThFoot>{total.totalQuantity}</TFThFoot>
										<TFThFoot>{total.totalMass}</TFThFoot>
										<TFThFoot>{total.totalAvgMass}</TFThFoot>
										<TFThFoot>{total.totalPrice}</TFThFoot>
										<TFThFoot />
										<TFThFoot />
										<TFThFoot />
										<TFThFoot />
										{!!userAndOrgInfo?.trackingCategoryAFiltered?.categories.length && <TFThFoot />}
										{!!userAndOrgInfo?.trackingCategoryBFiltered?.categories.length && <TFThFoot />}
										<TFThFoot isRight>{total.total}</TFThFoot>
										<TFThFoot isActions />
									</TFTr>
								</TFTfoot>
							</>
						) : (
							<TFTbody>
								<TFTr>
									<TFTd isEmpty>No data available</TFTd>
								</TFTr>
							</TFTbody>
						)}
					</TFTable>
				</TFOverflow>
			</TFWrapper>

			<TFAddRow>
				<Button
					type="button"
					isSecondary
					onClick={() => append({ ...EmptyWoolworthsOrderLine, taxType: currentTaxRate })}
				>
					<svg width="18" height="18" focusable="false" aria-hidden="true">
						<use xlinkHref="/icons/icons.svg#plus" />
					</svg>
					Add Row
				</Button>
			</TFAddRow>
			<TFHr />
		</TF>
	);
};
