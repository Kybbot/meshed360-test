import { FC, useMemo } from "react";
import {
	Control,
	FieldErrors,
	useFieldArray,
	UseFormRegister,
	UseFormSetValue,
	useWatch,
} from "react-hook-form";

import { OrderLinesRow } from "./OrderLinesRow";

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

import { useGetUserAndOrgInfo } from "@/hooks/useGetUserInfo";

import { GetPurchaseOrderByIdResponseType } from "@/@types/purchaseOrder/order";
import { DefaultOrderLine, OrderLinesFormValues } from "@/@types/purchaseOrder/orderLines";

type Props = {
	errors: FieldErrors<OrderLinesFormValues>;
	lineStatus: "DRAFT" | "NEW" | "AUTHORISED";
	orderData: GetPurchaseOrderByIdResponseType;
	control: Control<OrderLinesFormValues, unknown>;
	register: UseFormRegister<OrderLinesFormValues>;
	setValue: UseFormSetValue<OrderLinesFormValues>;
};

export const OrderLines: FC<Props> = ({ errors, control, orderData, lineStatus, register, setValue }) => {
	const userAndOrgInfo = useGetUserAndOrgInfo();

	const colSpan = useMemo(() => {
		const { trackingCategoryA, trackingCategoryB } = userAndOrgInfo || {};

		if (trackingCategoryA && trackingCategoryB) return 12;
		if (trackingCategoryA || trackingCategoryB) return 11;
		return 10;
	}, [userAndOrgInfo]);

	const { update, remove, append, fields } = useFieldArray({
		name: "orderLines",
		control,
	});

	const allValues = useWatch({
		name: "orderLines",
		control,
	});

	const { totalQuantity, totalPrice, total } = calculateFooterValues(allValues);

	return (
		<TF>
			<TFWrapper>
				<TFOverflow>
					<TFTable>
						<TFThead>
							<TFTr>
								<TFTh style={{ width: "10%" }}>Product</TFTh>
								<TFTh>Comment</TFTh>
								<TFTh>Supplier SKU</TFTh>
								<TFTh style={{ width: "10%" }}>UOM</TFTh>
								<TFTh>Quantity</TFTh>
								<TFTh>Price</TFTh>
								<TFTh>Discount %</TFTh>
								<TFTh style={{ width: "10%" }}>Tax</TFTh>
								{userAndOrgInfo?.trackingCategoryA && (
									<TFTh style={{ width: "8%" }}>{userAndOrgInfo.trackingCategoryA.name}</TFTh>
								)}
								{userAndOrgInfo?.trackingCategoryB && (
									<TFTh style={{ width: "8%" }}>{userAndOrgInfo.trackingCategoryB.name}</TFTh>
								)}
								<TFTh isRight>Total</TFTh>
								<TFTh isActions></TFTh>
							</TFTr>
						</TFThead>
						{fields.length > 0 ? (
							<>
								<TFTbody>
									{fields.map((field, index) => (
										<OrderLinesRow
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
											lineStatus={lineStatus}
										/>
									))}
								</TFTbody>
								<TFTfoot>
									<TFTr>
										<TFThFoot>Total</TFThFoot>
										<TFThFoot></TFThFoot>
										<TFThFoot></TFThFoot>
										<TFThFoot></TFThFoot>
										<TFThFoot>{totalQuantity}</TFThFoot>
										<TFThFoot>{totalPrice}</TFThFoot>
										<TFThFoot></TFThFoot>
										<TFThFoot></TFThFoot>
										{userAndOrgInfo?.trackingCategoryA && <TFThFoot></TFThFoot>}
										{userAndOrgInfo?.trackingCategoryB && <TFThFoot></TFThFoot>}
										<TFThFoot isRight>{total}</TFThFoot>
										<TFThFoot isActions></TFThFoot>
									</TFTr>
								</TFTfoot>
							</>
						) : (
							<TFTbody>
								<TFTr>
									<TFTd isEmpty colSpan={colSpan}>
										No data available
									</TFTd>
								</TFTr>
							</TFTbody>
						)}
					</TFTable>
				</TFOverflow>
			</TFWrapper>

			{lineStatus !== "AUTHORISED" && (
				<>
					<TFAddRow>
						<Button type="button" isSecondary onClick={() => append(DefaultOrderLine)}>
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
