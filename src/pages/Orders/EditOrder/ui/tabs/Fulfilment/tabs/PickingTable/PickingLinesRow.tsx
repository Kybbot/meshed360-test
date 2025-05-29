import { FC, useMemo } from "react";
import {
	Control,
	Controller,
	FieldArrayWithId,
	UseFieldArrayRemove,
	UseFieldArrayUpdate,
	useFormContext,
	useWatch,
} from "react-hook-form";

import { TableInputRhf } from "@/components/shared/form/TableInputRhf.tsx";

import { EmptyFulfilmentPickingLine, PickingFulfilmentFormValues } from "@/@types/salesOrders/local.ts";
import { useGetAllWarehouses } from "@/pages/Settings/Warehouses/api/queries/useGetAllWarehouses.ts";
import { useStore } from "zustand";
import { orgStore } from "@/app/stores/orgStore.ts";
import { CustomTableSelect } from "@/components/shared/CustomTableSelect.tsx";
import { useGetProductAvailability } from "@/pages/StockControl/StockAdjustment/api/queries/useGetProductAvailability.ts";
import { TFTd, TFTr } from "@/components/widgets/Table";
import { ProductForSelect, validateQuantity } from "@/pages/Orders/EditOrder/hooks/useProductsSelect.ts";
import { FormTableProductSelectWithCount } from "@/components/widgets/Selects/ui/FormTableProductSelectWithCount.tsx";

type Props = {
	index: number;
	remove: UseFieldArrayRemove;
	control: Control<PickingFulfilmentFormValues, unknown>;
	update: UseFieldArrayUpdate<PickingFulfilmentFormValues, "lines">;
	fields: FieldArrayWithId<PickingFulfilmentFormValues, "lines", "id">[];
	productsSelect: { products: ProductForSelect[]; isLoading: boolean };
	isAuthorized: boolean;
};

export const PickingLinesRow: FC<Props> = ({
	index,
	fields,
	control,
	remove,
	update,
	productsSelect,
	isAuthorized,
}) => {
	const {
		setValue,
		trigger,
		register,
		formState: { disabled, isSubmitted, errors },
	} = useFormContext<PickingFulfilmentFormValues>();

	const { orgId } = useStore(orgStore);

	const allValues = useWatch({
		name: "lines",
		control,
	});

	const { product, location, batch } = allValues[index];

	const { data: warehousesData, isLoading: isLoadingWarehouses } = useGetAllWarehouses({
		organisationId: orgId,
		pageNumber: "1",
		pageSize: "999",
		searchValue: "",
	});

	const { data: availabilityData } = useGetProductAvailability({
		organisationId: orgId,
		productId: product ? String(product.id) : "",
		warehouseId: location ? String(location.id) : "",
		isDisabled: !product || !location,
	});

	const batches = useMemo(() => {
		if (!availabilityData?.data) {
			return [];
		} else {
			return availabilityData.data
				.map(({ batchNumber }) => batchNumber)
				.filter((v) => !!v)
				.map((v) => ({ id: v, name: v }));
		}
	}, [availabilityData]);

	const availableCount = useMemo(() => {
		if (availabilityData?.data?.length) {
			if (batches.length) {
				return (
					availabilityData.data.filter(({ batchNumber }) => batchNumber === batch?.id)?.[0]?.onHand || "0"
				);
			} else {
				return availabilityData.data[0]?.onHand || "0";
			}
		} else {
			return "0";
		}
	}, [batch, availabilityData, batches]);

	const productWithCount = useMemo(() => {
		if (productsSelect.products && product) {
			return productsSelect.products.find(({ id }) => id === product.id);
		} else {
			return undefined;
		}
	}, [productsSelect.products, product]);

	const expiryDate = useMemo(() => {
		if (availabilityData?.data?.length) {
			if (batches.length) {
				const res =
					availabilityData.data.filter(({ batchNumber }) => batchNumber === batch?.id)?.[0]?.expiryDate ||
					null;
				setValue(`lines.${index}.expiryDate`, res);
				return res || "N/A";
			} else {
				const res = availabilityData.data[0]?.expiryDate || null;
				setValue(`lines.${index}.expiryDate`, res);
				return res || "N/A";
			}
		} else {
			setValue(`lines.${index}.expiryDate`, null);
			return "N/A";
		}
	}, [availabilityData?.data, batches.length, setValue, index, batch?.id]);

	const outstanding = useMemo(() => {
		if (productWithCount) {
			const currentReservedCount = allValues
				.filter((cl) => cl.product?.id === productWithCount.id)
				.reduce((sum, cl) => sum + (Number(cl.quantity) || 0), 0);

			return productWithCount.count - (isAuthorized ? 0 : currentReservedCount);
		}
	}, [productWithCount, allValues, isAuthorized]);

	return (
		<TFTr>
			<TFTd>
				<Controller
					name={`lines.${index}.product`}
					control={control}
					rules={{
						required: "Required",
					}}
					render={({ field }) => (
						<FormTableProductSelectWithCount
							{...field}
							value={field.value}
							id="orderLinesproductId"
							onValueChange={field.onChange}
							error={errors?.lines?.[index]?.product?.message}
							products={productsSelect.products}
							isLoading={productsSelect.isLoading}
						/>
					)}
				/>
			</TFTd>
			{batches.length ? (
				<TFTd>
					<Controller
						name={`lines.${index}.batch`}
						control={control}
						rules={{
							required: "Required",
						}}
						render={({ field }) => (
							<CustomTableSelect
								isLoading={isLoadingWarehouses}
								useSearch
								{...field}
								id="batch"
								useNameAsId
								value={field.value}
								placeholder="Batch/Serial"
								onValueChange={field.onChange}
								error={errors?.lines?.[index]?.batch?.message}
								customValues={batches}
							/>
						)}
					/>
				</TFTd>
			) : (
				<TFTd isText>{product ? "N/A" : ""}</TFTd>
			)}
			<TFTd isText>{product ? expiryDate : ""}</TFTd>
			<TFTd isText>{product?.unitOfMeasure?.name || "N/A"}</TFTd>
			<TFTd isText>{product ? availableCount : ""}</TFTd>
			<TFTd>
				<TableInputRhf<PickingFulfilmentFormValues>
					step={0.01}
					type="number"
					label="Quantity"
					register={register}
					rules={{
						min: {
							value: 1,
							message: "Min quantity is 1",
						},
						max: {
							value: Number(availableCount),
							message: "Unavailable quantity",
						},
						validate: (_, formValues): true | string => {
							return validateQuantity({ productWithCount, lines: formValues.lines });
						},
						required: "Required",
						onChange(event) {
							const value = +event.target.value as number;
							if (value < 0) {
								setValue(`lines.${index}.quantity`, "0");
							}
							if (isSubmitted) trigger("lines");
						},
					}}
					id="orderLinesquantityId"
					name={`lines.${index}.quantity`}
					error={errors?.lines?.[index]?.quantity?.message}
				/>
			</TFTd>
			<TFTd isText>{product ? outstanding : ""}</TFTd>
			<TFTd>
				<Controller
					name={`lines.${index}.location`}
					control={control}
					rules={{
						required: "Required",
					}}
					render={({ field }) => (
						<CustomTableSelect
							isLoading={isLoadingWarehouses}
							useSearch
							{...field}
							id="location"
							value={field.value}
							placeholder="Location"
							onValueChange={field.onChange}
							error={errors?.lines?.[index]?.location?.message}
							customValues={warehousesData?.data?.warehouses}
						/>
					)}
				/>
			</TFTd>
			<TFTd>
				<button
					disabled={disabled}
					type="button"
					aria-label="Remove row"
					className="formTable__remove"
					onClick={() => {
						if (fields.length === 1 && index === 0) {
							update(index, EmptyFulfilmentPickingLine);
						} else {
							remove(index);
						}
					}}
				>
					<svg focusable="false" aria-hidden="true" width="16" height="16">
						<use xlinkHref="/icons/icons.svg#crossInCircle" />
					</svg>
				</button>
			</TFTd>
		</TFTr>
	);
};
