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

import { useGetProductNames } from "../../api/queries/useGetProductNames";

import { SelectOption, SelectOptionOnlyWithName } from "@/@types/selects";
import { DefaultModificationLine, StockAdjustmentFormValues } from "@/@types/stockControl";

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

import StockAdjustmentModificationLinesRow from "./StockAdjustmentModificationLinesRow";

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

const StockAdjustmentModificationLines: FC<Props> = ({
	isAdd,
	watch,
	errors,
	control,
	register,
	setValue,
	isDisabled,
}) => {
	const { orgId } = useStore(orgStore);
	const userAndOrgInfo = useGetUserAndOrgInfo();

	const [productOptions, setProductOptions] = useState<SelectOption[]>([]);
	const [batchOptionsMap, setBatchOptionsMap] = useState<Record<string, SelectOptionOnlyWithName[]>>({});

	const { fields, append, update, remove } = useFieldArray({
		control,
		name: "modificationLines",
	});

	const lines = useWatch({ control, name: "modificationLines" });
	const locationId = useWatch({
		control,
		name: "warehouse.id",
	});

	const selectedProducts = watch("modificationLines")?.map((line) => line?.product?.id);

	const { data: productsData, isSuccess } = useGetProductNames({ organisationId: orgId, locationId });

	useEffect(() => {
		if (isSuccess && productsData) {
			const products = Array.from(
				new Map(
					productsData.data.map((item) => [item.productId, { id: item.productId, name: item.productName }]),
				).values(),
			);

			const batchNumbers = Object.fromEntries(
				productsData.data.map((product) => {
					const uniqueBatches = Array.from(
						new Set(product.availability.map((av) => av.batchNumber).filter((b): b is string => b !== null)),
					);

					return [product.productId, uniqueBatches.map((batch) => ({ name: batch }))];
				}),
			);

			setProductOptions(products);
			setBatchOptionsMap(batchNumbers);
		}
	}, [productsData, isSuccess]);

	useEffect(() => {
		lines.forEach((line, index) => {
			if (!line.product?.id && line.batchNumber?.name) {
				const matched = Object.entries(batchOptionsMap).find(([, batches]) =>
					batches.some((b) => b.name === line.batchNumber?.name),
				);
				if (matched) {
					const [productId] = matched;
					const productOption = productOptions.find((p) => p.id === productId);
					if (productOption) {
						setValue(`modificationLines.${index}.product`, productOption);
					}
				}
			}
		});
	}, [lines, batchOptionsMap, setValue, productOptions]);

	useEffect(() => {
		if (isAdd) {
			setValue("modificationLines", [DefaultModificationLine]);
		}
	}, [isAdd, locationId, setValue]);

	const colWidth =
		[!!userAndOrgInfo?.trackingCategoryA, !!userAndOrgInfo?.trackingCategoryB].filter(Boolean).length === 2
			? "10%"
			: [userAndOrgInfo?.trackingCategoryA, userAndOrgInfo?.trackingCategoryB].some(Boolean)
				? "11%"
				: "12.5%";

	return (
		<CommonPageWrapper>
			<CommonPageHeader>
				<CommonPageTitle>Adjust Current Stock</CommonPageTitle>
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
									<TFTh style={{ width: colWidth }}>On Hand</TFTh>
									<TFTh style={{ width: colWidth }}>Available</TFTh>
									<TFTh style={{ width: colWidth }}>New Quantity</TFTh>
									<TFTh style={{ width: colWidth }}>Variance</TFTh>
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
									{fields.map((field, index) => {
										const selectedProductId = selectedProducts[index];
										const batchOptions =
											selectedProductId && batchOptionsMap[selectedProductId]
												? batchOptionsMap[selectedProductId]
												: Object.values(batchOptionsMap).flat();

										return (
											<StockAdjustmentModificationLinesRow
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
												batchOptions={batchOptions}
												productOptions={productOptions}
											/>
										);
									})}
								</TFTbody>
							) : (
								<TFTbody>
									<TFTr>
										<TFTd isEmpty colSpan={11}>
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
							onClick={() => append(DefaultModificationLine)}
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

export default StockAdjustmentModificationLines;
