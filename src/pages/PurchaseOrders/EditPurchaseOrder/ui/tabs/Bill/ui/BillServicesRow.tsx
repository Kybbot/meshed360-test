import { FC, useEffect, useState } from "react";
import {
	Control,
	Controller,
	FieldArrayWithId,
	FieldErrors,
	UseFieldArrayRemove,
	UseFieldArrayUpdate,
	UseFormRegister,
	UseFormSetValue,
	useWatch,
} from "react-hook-form";

import { AllocateModal } from "./AllocateModal";
import { MultipleAllocateModal } from "./MultipleAllocateModal";

import { calculateTotal } from "../utils/calculate";
import { getNormalizedServiceLineAllocationData } from "../utils/getNormalizedModalData";

import { SwitchRhf } from "@/components/shared/form/SwitchRhf";
import { TableInputRhf } from "@/components/shared/form/TableInputRhf";
import { CustomTableSelect } from "@/components/shared/CustomTableSelect";

import {
	FormTableAccountSelect,
	FormTableTaxRatesSelect,
	FormTableProductSelectWithInput,
} from "@/components/widgets/Selects";
import { TFRemove, TFTd, TFTr } from "@/components/widgets/Table";

import { useGetUserAndOrgInfo } from "@/hooks/useGetUserInfo";

import { GetPurchaseOrderByIdResponseType } from "@/@types/purchaseOrder/order";
import { BillAllocate, BillFormValues, BillType, DefaultBillAdditionalCost } from "@/@types/purchaseOrders";

type Props = {
	index: number;
	currentBill?: BillType;
	disabledServices: boolean;
	remove: UseFieldArrayRemove;
	errors: FieldErrors<BillFormValues>;
	control: Control<BillFormValues, unknown>;
	register: UseFormRegister<BillFormValues>;
	setValue: UseFormSetValue<BillFormValues>;
	orderData: GetPurchaseOrderByIdResponseType;
	update: UseFieldArrayUpdate<BillFormValues, "serviceLines">;
	fields: FieldArrayWithId<BillFormValues, "serviceLines", "id">[];
};

export const BillServicesRow: FC<Props> = ({
	index,
	errors,
	fields,
	control,
	orderData,
	currentBill,
	disabledServices,
	update,
	remove,
	register,
	setValue,
}) => {
	const taxRule = orderData.taxRule;
	const taxInclusive = orderData.taxInclusive;
	const inventoryAccount = orderData.inventoryAccount;
	const additionalExpense = orderData.additionalExpense;

	const disableField = disabledServices;

	const userAndOrgInfo = useGetUserAndOrgInfo();

	const [multipleAllocateModal, setMultipleAllocateModal] = useState(false);

	const allValues = useWatch({
		name: "serviceLines",
		control,
	});

	const allLinesValues = useWatch({
		name: "lines",
		control,
	});

	const currentValues = allValues[index];
	const { quantity, unitPrice, discount, addToLandedCost, taxRate, allocation } = currentValues;

	const { total, totalTax, totalErrorMesssage } = calculateTotal(
		+unitPrice,
		+quantity,
		+discount,
		taxInclusive,
		taxRate,
	);

	const handleAddAllocation = (data: BillAllocate[]) => {
		const newLine = getNormalizedServiceLineAllocationData(currentValues, data);
		setValue(`serviceLines.${index}`, newLine);
	};

	useEffect(() => {
		if (total) {
			setValue(`serviceLines.${index}.total`, total);
		}
	}, [index, total, setValue]);

	return (
		<TFTr>
			<TFTd>
				<Controller
					name={`serviceLines.${index}.product`}
					control={control}
					rules={{
						required: "Required",
						onChange() {
							setValue(`serviceLines.${index}.unitPrice`, "0");
							setValue(`serviceLines.${index}.taxRate`, taxRule);
							setValue(`serviceLines.${index}.account`, inventoryAccount);
						},
					}}
					render={({ field }) => (
						<FormTableProductSelectWithInput
							{...field}
							type="service"
							value={field.value}
							disabled={disableField}
							id="additionalLinesproductId"
							onValueChange={field.onChange}
							error={errors?.serviceLines?.[index]?.product?.message}
						/>
					)}
				/>
			</TFTd>
			<TFTd>
				<TableInputRhf<BillFormValues>
					type="text"
					label="Reference"
					register={register}
					disabled={disableField}
					id="additionalLinesReferenceId"
					name={`serviceLines.${index}.comment`}
					error={errors?.serviceLines?.[index]?.comment?.message}
				/>
			</TFTd>
			<TFTd>
				<TableInputRhf<BillFormValues>
					min={0}
					step={0.01}
					type="number"
					label="Quantity"
					register={register}
					rules={{
						min: 0,
						required: "Required",
						onChange(event) {
							const value = +event.target.value as number;
							if (value < 0) {
								setValue(`serviceLines.${index}.quantity`, "0");
							}
						},
					}}
					disabled={disableField}
					id="additionalLinesquantityId"
					name={`serviceLines.${index}.quantity`}
					error={errors?.serviceLines?.[index]?.quantity?.message}
				/>
			</TFTd>
			<TFTd>
				<TableInputRhf<BillFormValues>
					min={0}
					step={0.01}
					type="number"
					label="Price"
					register={register}
					rules={{
						min: 0,
						required: "Required",
					}}
					disabled={disableField}
					id="additionalLinesunitPriceId"
					name={`serviceLines.${index}.unitPrice`}
					error={errors?.serviceLines?.[index]?.unitPrice?.message || totalErrorMesssage}
				/>
			</TFTd>
			<TFTd>
				<TableInputRhf<BillFormValues>
					min={0}
					step={0.01}
					type="number"
					label="Discount"
					register={register}
					rules={{
						min: 0,
						max: 100,
						onChange(event) {
							const value = +event.target.value as number;
							if (value < 0 || value > 100) {
								setValue(`serviceLines.${index}.discount`, "0");
							}
						},
					}}
					disabled={disableField}
					id="additionalLinesdiscountId"
					name={`serviceLines.${index}.discount`}
					error={errors?.serviceLines?.[index]?.discount?.message}
				/>
			</TFTd>
			{!additionalExpense && (
				<TFTd isCenter>
					<SwitchRhf<BillFormValues>
						hideLabel
						register={register}
						disabled={disableField}
						label="Add To Landed Cost"
						id={`serviceLines.${index}.addToLandedCost`}
						name={`serviceLines.${index}.addToLandedCost`}
						rules={{
							onChange() {
								setValue(`serviceLines.${index}.account`, undefined);
							},
						}}
						error={errors?.serviceLines?.[index]?.addToLandedCost?.message}
					/>
				</TFTd>
			)}
			<TFTd>
				<Controller
					name={`serviceLines.${index}.taxRate`}
					control={control}
					rules={{
						required: "Required",
					}}
					render={({ field }) => (
						<FormTableTaxRatesSelect
							{...field}
							type="purchase"
							value={field.value}
							disabled={disableField}
							id="additionalLinesTaxTypeId"
							onValueChange={field.onChange}
							error={errors?.serviceLines?.[index]?.taxRate?.message}
						/>
					)}
				/>
			</TFTd>
			<TFTd>
				{addToLandedCost && !additionalExpense ? (
					<AllocateModal
						currentBill={currentBill}
						taxInclusive={taxInclusive}
						linesValues={allLinesValues}
						serviceLineValues={currentValues}
						amount={(+total - +totalTax).toString()}
						handleAddAllocation={handleAddAllocation}
						disabled={disableField || !total || +total <= 0}
					/>
				) : !addToLandedCost && additionalExpense ? (
					<button
						type="button"
						className="formTable__btn"
						onClick={() => setMultipleAllocateModal(true)}
						disabled={disableField || !total || +total <= 0}
					>
						Allocate
					</button>
				) : (
					<Controller
						control={control}
						name={`serviceLines.${index}.account`}
						rules={{
							required: "Required",
						}}
						render={({ field }) => (
							<FormTableAccountSelect
								{...field}
								value={field.value}
								type="expenseAccounts"
								disabled={disableField}
								id="additionalLinesAccountId"
								onValueChange={field.onChange}
								error={errors?.serviceLines?.[index]?.account?.message}
							/>
						)}
					/>
				)}
			</TFTd>
			{userAndOrgInfo?.trackingCategoryA && (
				<TFTd>
					<Controller
						control={control}
						name={`serviceLines.${index}.trackingCategory1`}
						render={({ field }) => (
							<CustomTableSelect
								{...field}
								useSearch
								value={field.value}
								placeholder="Select"
								disabled={disableField}
								onValueChange={field.onChange}
								id="additionalLinesTrackingCategoryAId"
								customValues={userAndOrgInfo.trackingCategoryA?.categories}
								error={errors?.serviceLines?.[index]?.trackingCategory1?.message}
							/>
						)}
					/>
				</TFTd>
			)}
			{userAndOrgInfo?.trackingCategoryB && (
				<TFTd>
					<Controller
						control={control}
						name={`serviceLines.${index}.trackingCategory2`}
						render={({ field }) => (
							<CustomTableSelect
								{...field}
								useSearch
								value={field.value}
								placeholder="Select"
								disabled={disableField}
								onValueChange={field.onChange}
								id="additionalLinesTrackingCategoryBId"
								customValues={userAndOrgInfo.trackingCategoryB?.categories}
								error={errors?.serviceLines?.[index]?.trackingCategory2?.message}
							/>
						)}
					/>
				</TFTd>
			)}
			<TFTd isRight>{total}</TFTd>
			<TFTd>
				{!disableField && (
					<TFRemove
						onClick={() => {
							if (fields.length === 1 && index === 0 && additionalExpense) {
								update(index, DefaultBillAdditionalCost);
							} else {
								remove(index);
							}
						}}
					/>
				)}
			</TFTd>

			<MultipleAllocateModal
				allocation={allocation}
				taxInclusive={taxInclusive}
				open={multipleAllocateModal}
				onOpenChange={setMultipleAllocateModal}
				amount={(+total - +totalTax).toString()}
				handleAddAllocation={handleAddAllocation}
				disabled={disableField || !total || +total <= 0}
			/>
		</TFTr>
	);
};
