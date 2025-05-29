import { FC, useEffect, useState } from "react";
import { useStore } from "zustand";
import {
	useFieldArray,
	useWatch,
	Control,
	FieldErrors,
	UseFormSetValue,
	UseFormRegister,
	UseFormWatch,
} from "react-hook-form";

import { useGetProductNames } from "../../StockAdjustment/api/queries/useGetProductNames";

import { SelectOption, SelectOptionOnlyWithName } from "@/@types/selects";
import { DefaultStockTransferLine, StockTransferFormValues } from "@/@types/stockControl";

import StockTransferLinesRow from "./StockTransferLinesRow";

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
import { CommonPageWrapper } from "@/components/widgets/Page";

import { useGetUserAndOrgInfo } from "@/hooks/useGetUserInfo";

import { orgStore } from "@/app/stores/orgStore";

type Props = {
	isAdd: boolean;
	isDisabled: boolean;
	control: Control<StockTransferFormValues>;
	watch: UseFormWatch<StockTransferFormValues>;
	errors: FieldErrors<StockTransferFormValues>;
	setValue: UseFormSetValue<StockTransferFormValues>;
	register: UseFormRegister<StockTransferFormValues>;
};

const StockTransferLines: FC<Props> = ({ isAdd, watch, errors, control, register, setValue, isDisabled }) => {
	const { orgId } = useStore(orgStore);
	const userAndOrgInfo = useGetUserAndOrgInfo();

	const [productOptions, setProductOptions] = useState<SelectOption[]>([]);
	const [batchOptionsMap, setBatchOptionsMap] = useState<Record<string, SelectOptionOnlyWithName[]>>({});

	const { fields, append, update, remove } = useFieldArray({
		control,
		name: "lines",
	});
	const lines = useWatch({ control, name: "lines" });
	const sourceLocationId = useWatch({ control, name: "sourceLocation.id" });

	const selectedProducts = watch("lines")?.map((line) => line?.product?.id);

	const { data: productsData, isSuccess } = useGetProductNames({
		organisationId: orgId,
		locationId: sourceLocationId,
	});

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
						setValue(`lines.${index}.product`, productOption);
					}
				}
			}
		});
	}, [lines, batchOptionsMap, setValue, productOptions]);

	useEffect(() => {
		if (isAdd) {
			setValue("lines", [DefaultStockTransferLine]);
		}
	}, [isAdd, sourceLocationId, setValue]);

	const colWidth =
		[!!userAndOrgInfo?.trackingCategoryA, !!userAndOrgInfo?.trackingCategoryB].filter(Boolean).length === 2
			? "12.5%"
			: [userAndOrgInfo?.trackingCategoryA, userAndOrgInfo?.trackingCategoryB].some(Boolean)
				? "14%"
				: "17%";

	return (
		<CommonPageWrapper>
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
									<TFTh style={{ width: colWidth }}>Amount To Transfer</TFTh>
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
											<StockTransferLinesRow
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
							onClick={() => append(DefaultStockTransferLine)}
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

export default StockTransferLines;
