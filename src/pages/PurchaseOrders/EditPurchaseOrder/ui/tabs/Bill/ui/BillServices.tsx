import { FC, useMemo } from "react";
import {
	Control,
	FieldErrors,
	useFieldArray,
	UseFormRegister,
	UseFormSetValue,
	useWatch,
} from "react-hook-form";

import { BillServicesRow } from "./BillServicesRow";

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

import { useGetUserAndOrgInfo } from "@/hooks/useGetUserInfo";

import { GetPurchaseOrderByIdResponseType } from "@/@types/purchaseOrder/order";
import { DefaultBillAdditionalCost, BillFormValues, BillType } from "@/@types/purchaseOrders";

type Props = {
	currentBill?: BillType;
	disabledServices: boolean;
	errors: FieldErrors<BillFormValues>;
	control: Control<BillFormValues, unknown>;
	register: UseFormRegister<BillFormValues>;
	setValue: UseFormSetValue<BillFormValues>;
	orderData: GetPurchaseOrderByIdResponseType;
	handleCopyServiceLinesFromOrder: () => void;
};

export const BillServices: FC<Props> = ({
	errors,
	control,
	orderData,
	currentBill,
	disabledServices,
	register,
	setValue,
	handleCopyServiceLinesFromOrder,
}) => {
	const billFirst = orderData.billFirst;
	const blindBill = orderData.blindBill;
	const additionalExpense = orderData.additionalExpense;

	const userAndOrgInfo = useGetUserAndOrgInfo();

	const colSpan = useMemo(() => {
		const { trackingCategoryA, trackingCategoryB } = userAndOrgInfo || {};

		if (trackingCategoryA && trackingCategoryB) return 12;
		if (trackingCategoryA || trackingCategoryB) return 11;
		return 10;
	}, [userAndOrgInfo]);

	const { remove, append, update, fields } = useFieldArray({
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
			<TFTitle>Additional Charges & Services</TFTitle>

			<TFWrapper>
				<TFOverflow>
					<TFTable>
						<TFThead>
							<TFTr>
								<TFTh style={{ width: "10%" }}>Description</TFTh>
								<TFTh>Reference</TFTh>
								<TFTh>Quantity</TFTh>
								<TFTh>Price</TFTh>
								<TFTh>Discount %</TFTh>
								{!additionalExpense && <TFTh>Add To Landed Cost</TFTh>}
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
										<BillServicesRow
											index={index}
											key={field.id}
											fields={fields}
											errors={errors}
											remove={remove}
											update={update}
											control={control}
											setValue={setValue}
											register={register}
											orderData={orderData}
											currentBill={currentBill}
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
										{!additionalExpense && <TFThFoot></TFThFoot>}
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

			{!disabledServices && (
				<>
					<TFAddRow>
						{!billFirst && !blindBill && !additionalExpense && (
							<Button isSecondary type="button" onClick={handleCopyServiceLinesFromOrder}>
								<svg width="18" height="18" focusable="false" aria-hidden="true">
									<use xlinkHref="/icons/icons.svg#copy" />
								</svg>
								Copy From Order
							</Button>
						)}
						<Button isSecondary type="button" onClick={() => append(DefaultBillAdditionalCost)}>
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
