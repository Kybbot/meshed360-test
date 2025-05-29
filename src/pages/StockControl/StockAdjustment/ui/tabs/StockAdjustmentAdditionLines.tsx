import { FC, useEffect, useState } from "react";
import { useStore } from "zustand";
import {
	Control,
	useWatch,
	FieldErrors,
	UseFormWatch,
	useFieldArray,
	UseFormSetValue,
	UseFormRegister,
} from "react-hook-form";

import { useGetProducts } from "@/entities/products";

import { ProductType } from "@/@types/products";
import { DefaultAdditionLine, StockAdjustmentFormValues } from "@/@types/stockControl";

import StockAdjustmentAdditionLinesRow from "./StockAdjustmentAdditionLinesRow";

import {
	TF,
	TFTr,
	TFTh,
	TFTd,
	TFTable,
	TFThead,
	TFTbody,
	TFAddRow,
	TFWrapper,
	TFOverflow,
} from "@/components/widgets/Table";

import { Button } from "@/components/shared/Button";
import { CommonPageHeader, CommonPageTitle, CommonPageWrapper } from "@/components/widgets/Page";

import { useGetUserAndOrgInfo } from "@/hooks/useGetUserInfo";

import { orgStore } from "@/app/stores/orgStore";

interface Props {
	isAdd: boolean;
	isDisabled: boolean;
	control: Control<StockAdjustmentFormValues>;
	watch: UseFormWatch<StockAdjustmentFormValues>;
	errors: FieldErrors<StockAdjustmentFormValues>;
	setValue: UseFormSetValue<StockAdjustmentFormValues>;
	register: UseFormRegister<StockAdjustmentFormValues>;
}

const StockAdjustmentAdditionLines: FC<Props> = ({
	isAdd,
	errors,
	control,
	register,
	setValue,
	isDisabled,
}) => {
	const { orgId } = useStore(orgStore);
	const userAndOrgInfo = useGetUserAndOrgInfo();

	const [productOptions, setProductOptions] = useState<ProductType[]>([]);

	const { fields, append, update, remove } = useFieldArray({
		control,
		name: "additionLines",
	});

	const lines = useWatch({ control, name: "additionLines" });
	const locationId = useWatch({ control, name: "warehouse.id" });

	const { data: allProductData, isSuccess: isAllProductSuccess } = useGetProducts({
		organisationId: orgId,
		type: "stock",
	});

	useEffect(() => {
		if (isAllProductSuccess && allProductData) {
			setProductOptions(allProductData.data.allProducts);
		}
	}, [allProductData, isAllProductSuccess]);

	useEffect(() => {
		if (isAdd) {
			setValue("additionLines", [DefaultAdditionLine]);
		}
	}, [isAdd, locationId, setValue]);

	const colWidth =
		[!!userAndOrgInfo?.trackingCategoryA, !!userAndOrgInfo?.trackingCategoryB].filter(Boolean).length === 2
			? "12.5%"
			: [userAndOrgInfo?.trackingCategoryA, userAndOrgInfo?.trackingCategoryB].some(Boolean)
				? "14%"
				: "17%";

	return (
		<CommonPageWrapper>
			<CommonPageHeader>
				<CommonPageTitle>Add New Stock</CommonPageTitle>
			</CommonPageHeader>
			<TF>
				<TFWrapper>
					<TFOverflow>
						<TFTable>
							<TFThead>
								<TFTr>
									<TFTh style={{ width: colWidth }}>Product</TFTh>
									<TFTh style={{ width: colWidth }}>Batch #</TFTh>
									<TFTh style={{ width: colWidth }}>Expiry Date</TFTh>
									<TFTh style={{ width: colWidth }}>New Quantity</TFTh>
									<TFTh style={{ width: colWidth }}>Unit Cost</TFTh>
									{userAndOrgInfo?.trackingCategoryA && (
										<TFTh style={{ width: colWidth }}>{userAndOrgInfo.trackingCategoryA.name}</TFTh>
									)}
									{userAndOrgInfo?.trackingCategoryB && (
										<TFTh style={{ width: colWidth }}>{userAndOrgInfo.trackingCategoryB.name}</TFTh>
									)}
									<TFTh style={{ width: colWidth }}>Comments</TFTh>
									<TFTh isActions></TFTh>
								</TFTr>
							</TFThead>
							{fields.length > 0 ? (
								<TFTbody>
									{fields.map((field, index) => (
										<StockAdjustmentAdditionLinesRow
											key={field.id}
											index={index}
											lines={lines}
											errors={errors}
											update={update}
											remove={remove}
											control={control}
											register={register}
											setValue={setValue}
											isDisabled={isDisabled}
											productOptions={productOptions}
										/>
									))}
								</TFTbody>
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

				{!isDisabled && (
					<TFAddRow>
						<Button
							isSecondary
							type="button"
							disabled={isDisabled}
							onClick={() => append(DefaultAdditionLine)}
						>
							<svg width="18" height="18" focusable="false" aria-hidden="true">
								<use xlinkHref="/icons/icons.svg#plus" />
							</svg>
							Add Row
						</Button>
					</TFAddRow>
				)}
			</TF>
		</CommonPageWrapper>
	);
};

export default StockAdjustmentAdditionLines;
