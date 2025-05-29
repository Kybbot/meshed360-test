import { FC, useMemo } from "react";
import {
	Control,
	FieldErrors,
	useFieldArray,
	UseFormRegister,
	UseFormSetValue,
	useWatch,
} from "react-hook-form";

import { SubBillLinesRow } from "./SubBillLinesRow";

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

import { BillStatus, BillFormValues, DefaultBillLine } from "@/@types/purchaseOrders";
import { GetOrderLineType, GetPurchaseOrderByIdResponseType } from "@/@types/purchaseOrder/order";

type Props = {
	disabledStatus: boolean;
	currentBillStatus?: BillStatus;
	errors: FieldErrors<BillFormValues>;
	currentOrderLines?: GetOrderLineType[];
	control: Control<BillFormValues, unknown>;
	register: UseFormRegister<BillFormValues>;
	setValue: UseFormSetValue<BillFormValues>;
	orderData: GetPurchaseOrderByIdResponseType;
	receivingLinesQuantity: Record<string, number> | null;
};

export const SubBillLines: FC<Props> = ({
	errors,
	control,
	orderData,
	disabledStatus,
	currentBillStatus,
	currentOrderLines,
	receivingLinesQuantity,
	register,
	setValue,
}) => {
	const billFirst = orderData.billFirst;
	const disableBtn = disabledStatus || (!billFirst && !currentOrderLines?.length);

	const userAndOrgInfo = useGetUserAndOrgInfo();

	const colSpan = useMemo(() => {
		const { trackingCategoryA, trackingCategoryB } = userAndOrgInfo || {};

		if (trackingCategoryA && trackingCategoryB) return 13;
		if (trackingCategoryA || trackingCategoryB) return 12;
		return 11;
	}, [userAndOrgInfo]);

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
								<TFTh style={{ width: "10%" }}>Product</TFTh>
								<TFTh>Comment</TFTh>
								<TFTh>Supplier SKU</TFTh>
								<TFTh>Quantity</TFTh>
								<TFTh>Outstanding</TFTh>
								<TFTh>Price</TFTh>
								<TFTh>Discount %</TFTh>
								<TFTh style={{ width: "10%" }}>Tax</TFTh>
								<TFTh style={{ width: "10%" }}>Account</TFTh>
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
										<SubBillLinesRow
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
											currentBillStatus={currentBillStatus}
											currentOrderLines={currentOrderLines}
											receivingLinesQuantity={receivingLinesQuantity}
										/>
									))}
								</TFTbody>
								<TFTfoot>
									<TFTr>
										<TFThFoot>Total</TFThFoot>
										<TFThFoot></TFThFoot>
										<TFThFoot></TFThFoot>
										<TFThFoot>{totalQuantity}</TFThFoot>
										<TFThFoot></TFThFoot>
										<TFThFoot>{totalPrice}</TFThFoot>
										<TFThFoot></TFThFoot>
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
										{!billFirst ? "Select Receiving" : "No data available"}
									</TFTd>
								</TFTr>
							</TFTbody>
						)}
					</TFTable>
				</TFOverflow>
			</TFWrapper>
			{!disableBtn && (
				<>
					<TFAddRow>
						<Button type="button" isSecondary onClick={() => append(DefaultBillLine)}>
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
