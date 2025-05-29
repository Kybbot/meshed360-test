import { FC, useEffect, useMemo } from "react";
import {
	Control,
	useWatch,
	FieldErrors,
	useFieldArray,
	UseFormRegister,
	UseFormSetValue,
	UseFormWatch,
} from "react-hook-form";

import { useGetUserAndOrgInfo } from "@/hooks/useGetUserInfo";

import {
	StockTakeFormValues,
	ProductNamesResponseType,
	DefaultStockTakeModificationLine,
	ModificationStockTakeLineFormValue,
} from "@/@types/stockControl";

import {
	TF,
	TFTr,
	TFTh,
	TFTd,
	TFTable,
	TFThead,
	TFTbody,
	TFWrapper,
	TFOverflow,
} from "@/components/widgets/Table";

import { CommonPageHeader, CommonPageTitle, CommonPageWrapper } from "@/components/widgets/Page";

import StockTakeModificationLinesRow from "./StockTakeModificationLinesRow";

export type ProductBatchRow = {
	productId: string;
	productName: string;
	batchNumber: string | null;
};

interface Props {
	status?: string;
	includeOnHand: boolean;
	control: Control<StockTakeFormValues>;
	watch: UseFormWatch<StockTakeFormValues>;
	errors: FieldErrors<StockTakeFormValues>;
	setValue: UseFormSetValue<StockTakeFormValues>;
	register: UseFormRegister<StockTakeFormValues>;
	productsData: ProductNamesResponseType[] | undefined;
}

const StockTaketModificationLines: FC<Props> = ({
	status,
	errors,
	watch,
	control,
	register,
	setValue,
	productsData,
	includeOnHand,
}) => {
	const userAndOrgInfo = useGetUserAndOrgInfo();

	const brandId = useWatch({ control, name: "brand.id" });
	const categoryId = useWatch({ control, name: "category.id" });

	const { fields } = useFieldArray({ control, name: "modificationLines" });

	useEffect(() => {
		if (!productsData || status !== "IN_PROGRESS") return;

		const currentLines = watch("modificationLines");

		const makeLineKey = (productId?: string, batch?: string | null) => `${productId}_${batch || "null"}`;

		const currentMap = new Map(
			currentLines.map((line) => [makeLineKey(line.product?.id, line.batchNumber?.name), line]),
		);

		const mergedLines: ModificationStockTakeLineFormValue[] = [];
		const uniqueKeys = new Set<string>();

		for (const product of productsData) {
			for (const { batchNumber } of product.availability) {
				const key = makeLineKey(product.productId, batchNumber);
				if (uniqueKeys.has(key)) continue;
				uniqueKeys.add(key);

				const existing = currentMap.get(key);
				if (existing) {
					mergedLines.push(existing);
				} else {
					mergedLines.push({
						...DefaultStockTakeModificationLine,
						product: {
							id: product.productId,
							name: product.productName,
						},
						batchNumber: {
							name: batchNumber ?? "",
						},
					});
				}
			}
		}
		setValue("modificationLines", mergedLines);
	}, [productsData, watch, status, setValue]);

	const filteredFields = useMemo(() => {
		return fields
			.map((field, index) => ({ field, index }))
			.filter(({ field }) => {
				const product = productsData?.find((p) => p.productId === field.product?.id);
				const matchesBrand = !brandId || product?.brand?.id === brandId;
				const matchesCategory = !categoryId || product?.category?.id === categoryId;
				return matchesBrand && matchesCategory;
			});
	}, [fields, productsData, brandId, categoryId]);

	const colWidth =
		[!!userAndOrgInfo?.trackingCategoryA, !!userAndOrgInfo?.trackingCategoryB, includeOnHand].filter(Boolean)
			.length === 3
			? "11%"
			: [!!userAndOrgInfo?.trackingCategoryA, !!userAndOrgInfo?.trackingCategoryB, includeOnHand].filter(
						Boolean,
				  ).length === 2
				? "12.5%"
				: [!!userAndOrgInfo?.trackingCategoryA, !!userAndOrgInfo?.trackingCategoryB, includeOnHand].some(
							Boolean,
					  )
					? "14%"
					: "17%";

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
									{includeOnHand && <TFTh style={{ width: colWidth }}>On Hand</TFTh>}
									<TFTh style={{ width: colWidth }}>New Quantity</TFTh>
									<TFTh style={{ width: colWidth }}>Variance</TFTh>
									{userAndOrgInfo?.trackingCategoryA && (
										<TFTh style={{ width: colWidth }}>{userAndOrgInfo.trackingCategoryA.name}</TFTh>
									)}
									{userAndOrgInfo?.trackingCategoryB && (
										<TFTh style={{ width: colWidth }}>{userAndOrgInfo.trackingCategoryB.name}</TFTh>
									)}
									<TFTh style={{ width: colWidth }}>Comments</TFTh>
								</TFTr>
							</TFThead>
							{status !== "IN_PROGRESS" && status !== "COMPLETED" ? (
								<TFTbody>
									<TFTr>
										<TFTd isEmpty colSpan={9}>
											Stock data will appear once the stock take is started
										</TFTd>
									</TFTr>
								</TFTbody>
							) : filteredFields.length > 0 ? (
								<TFTbody>
									{filteredFields.map(({ field, index }) => (
										<StockTakeModificationLinesRow
											key={field.id}
											index={index}
											errors={errors}
											status={status}
											control={control}
											register={register}
											setValue={setValue}
											includeOnHand={includeOnHand}
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
			</TF>
		</CommonPageWrapper>
	);
};

export default StockTaketModificationLines;
