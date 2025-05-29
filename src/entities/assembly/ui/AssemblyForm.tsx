import { FC, useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { isAxiosError } from "axios";
import { Controller, UseFormReturn } from "react-hook-form";

import { useGetAssemblyProduct } from "../api/queries/useGetAssemblyProduct";

import { getNormalizedResetAssemblyProduct } from "../utils/getNormalizedAssemblyData";

import { Spinner } from "@/components/shared/Spinner";
import { InputRhf } from "@/components/shared/form/InputRhf";
import { CustomSelect } from "@/components/shared/CustomSelect";
import { TextareaRhf } from "@/components/shared/form/TextareaRhf";
import { FormDayPickerRhf } from "@/components/shared/form/FormDayPickerRhf";

import { showError } from "@/utils/showError";
import { axiosInstance } from "@/utils/axios";

import { ApiResult } from "@/@types/api";
import { SelectOption } from "@/@types/selects";
import { GetAllWarehousesResponseType } from "@/@types/warehouses";
import { GetAllProductsResponseType, ProductType } from "@/@types/products";
import { AssemblyByIdType, AssemblyFormValues } from "@/@types/assembly/assembly";

type Props = {
	products: GetAllProductsResponseType;
	form: UseFormReturn<AssemblyFormValues>;
	warehouses: GetAllWarehousesResponseType;
} & ({ isEdit?: false; assemblyData?: never } | { isEdit: true; assemblyData: AssemblyByIdType });

export const AssemblyForm: FC<Props> = ({ form, isEdit = false, products, warehouses, assemblyData }) => {
	const [changeProductData, setChangeProductData] = useState(false);
	const [loadingMaxQuantity, setLoadingMaxQuantity] = useState(false);
	const [product, setProduct] = useState<SelectOption | undefined>(
		isEdit && assemblyData ? { id: assemblyData.product.id, name: assemblyData.product.sku } : undefined,
	);

	const disableSku = isEdit && assemblyData && assemblyData.status !== "DRAFT";
	const disableField = !product || (isEdit && assemblyData && assemblyData.status !== "DRAFT");

	const updatedProducts = useMemo(
		() =>
			products.allProducts
				.filter((item) => item.bomType === "ASSEMBLY_BOM")
				.map((item) => ({ ...item, name: item.sku })),
		[products],
	);

	const {
		data: assemblyProduct,
		error: assemblyProductError,
		isError: isAssemblyProductError,
		isLoading: isAssemblyProductLoading,
		isSuccess: isAssemblyProductSuccess,
	} = useGetAssemblyProduct({ productId: product?.id });

	const {
		watch,
		reset,
		control,
		register,
		setValue,
		formState: { errors },
	} = form;

	const formProduct = watch("product");
	const formWarehouse = watch("warehouse");

	const handleGetMaxQuantity = useCallback(
		async (productId: string, warehouseId: string) => {
			setLoadingMaxQuantity(true);

			try {
				const { data } = await axiosInstance.get<ApiResult<{ maxQuantity: number }>>(
					`/api/assemblies/max-quantity?productId=${productId}&warehouseId=${warehouseId}`,
				);

				if (data.data) {
					setValue("maxQuantity", data.data.maxQuantity.toString());
				}
			} catch (error) {
				if (isAxiosError(error)) {
					showError(error);
				} else if (error instanceof Error) {
					toast.error(error.message);
				} else {
					toast.error("Something went wrong");
				}
			} finally {
				setLoadingMaxQuantity(false);
			}
		},
		[setValue],
	);

	useEffect(() => {
		const getData = async () => {
			if (product && assemblyProduct && isAssemblyProductSuccess && !isEdit) {
				const resetData = getNormalizedResetAssemblyProduct(product, assemblyProduct.data);
				reset(resetData, { keepDefaultValues: true });

				if (assemblyProduct.data.defaultLocation) {
					await handleGetMaxQuantity(product.id, assemblyProduct.data.defaultLocation.id);
				}
			}
		};

		getData();
	}, [product, assemblyProduct, isAssemblyProductSuccess, isEdit, reset, handleGetMaxQuantity]);

	useEffect(() => {
		const getData = async () => {
			if (product && assemblyProduct && changeProductData && isAssemblyProductSuccess && isEdit) {
				const resetData = getNormalizedResetAssemblyProduct(product, assemblyProduct.data);
				reset(resetData, { keepDefaultValues: true });

				if (assemblyProduct.data.defaultLocation) {
					await handleGetMaxQuantity(product.id, assemblyProduct.data.defaultLocation.id);
				}
			}
		};

		getData();
	}, [
		isEdit,
		product,
		assemblyProduct,
		changeProductData,
		isAssemblyProductSuccess,
		reset,
		handleGetMaxQuantity,
	]);

	useEffect(() => {
		if (isAssemblyProductError && assemblyProductError) {
			showError(assemblyProductError);
		}
	}, [isAssemblyProductError, assemblyProductError]);

	return (
		<form className="form form--two">
			<fieldset className="form__fieldset">
				<Controller
					name="product"
					control={control}
					rules={{
						required: "Required",
						async onChange(event) {
							const target = event.target.value as ProductType;
							if (formProduct?.id !== target.id) {
								if (target) setProduct(target);
								if (isEdit) setChangeProductData(true);
							}
						},
					}}
					render={({ field }) => (
						<CustomSelect
							id="skuId"
							useSearch
							{...field}
							placeholder="SKU*"
							value={field.value}
							disabled={disableSku}
							onValueChange={field.onChange}
							customValues={updatedProducts}
							error={errors.product?.message}
						/>
					)}
				/>
				<InputRhf<AssemblyFormValues>
					type="text"
					name="productName"
					id="productNameId"
					register={register}
					label="Product Name*"
					disabled={disableField}
					rules={{
						required: "Required",
					}}
					error={errors.productName?.message}
				/>
				<Controller
					name="warehouse"
					control={control}
					rules={{
						required: "Required",
						async onChange(event) {
							const value = event.target.value as SelectOption;

							if (formProduct) {
								await handleGetMaxQuantity(formProduct.id, value.id);
							}
						},
					}}
					render={({ field }) => (
						<CustomSelect
							useSearch
							{...field}
							id="warehouseId"
							value={field.value}
							onValueChange={field.onChange}
							placeholder="Default Location*"
							error={errors.warehouse?.message}
							customValues={warehouses.warehouses}
							isLoading={isAssemblyProductLoading}
							disabled={disableField || isAssemblyProductLoading}
						/>
					)}
				/>
				<Controller
					name="workInProgressAccount"
					control={control}
					rules={{
						required: "Required",
					}}
					render={({ field }) => (
						<CustomSelect
							useSearch
							{...field}
							value={field.value}
							id="workInProgressAccountId"
							onValueChange={field.onChange}
							isLoading={isAssemblyProductLoading}
							placeholder="Work in Progress Account*"
							error={errors.workInProgressAccount?.message}
							disabled={disableField || isAssemblyProductLoading}
							customValues={assemblyProduct?.data.workInProgressAccounts}
						/>
					)}
				/>
				<Controller
					name="finishedGoodsAccount"
					control={control}
					rules={{
						required: "Required",
					}}
					render={({ field }) => (
						<CustomSelect
							useSearch
							{...field}
							value={field.value}
							id="finishedGoodsAccountIdId"
							onValueChange={field.onChange}
							isLoading={isAssemblyProductLoading}
							placeholder="Finished Goods Account*"
							error={errors.finishedGoodsAccount?.message}
							disabled={disableField || isAssemblyProductLoading}
							customValues={assemblyProduct?.data.finishedGoodsAccounts}
						/>
					)}
				/>
			</fieldset>
			<fieldset className="form__fieldset">
				<InputRhf<AssemblyFormValues>
					step={0.01}
					type="number"
					name="quantity"
					id="quantityId"
					register={register}
					disabled={disableField}
					label="Quantity to Produce*"
					rules={{
						required: "Required",
						min: { value: 0.01, message: "Min value is 0.01" },
						onChange(event) {
							const value = +event.target.value;

							if (value < 0) {
								setValue("quantity", "0");
							}
						},
					}}
					error={errors.quantity?.message}
				/>
				<div className="form__combinedInput">
					<InputRhf<AssemblyFormValues>
						disabled
						type="text"
						name="maxQuantity"
						id="maxQuantityId"
						register={register}
						label="Maximum Quantity"
						error={errors.maxQuantity?.message}
					/>

					<button
						type="button"
						className="form__inputBtn"
						disabled={disableField || loadingMaxQuantity}
						onClick={async () => {
							if (formWarehouse) {
								await handleGetMaxQuantity(formProduct.id, formWarehouse.id);
							}
						}}
					>
						{loadingMaxQuantity ? (
							<Spinner width="24" height="24" />
						) : (
							<svg width="24" height="24" focusable="false" aria-hidden="true">
								<use xlinkHref="/icons/icons.svg#reset" />
							</svg>
						)}
					</button>
				</div>
				<Controller
					control={control}
					name="workInProgressDate"
					render={({ field }) => {
						return (
							<FormDayPickerRhf
								{...field}
								value={field.value}
								disabled={disableField}
								onValueChange={field.onChange}
								placeholder="Work in Progress Date"
								error={errors.workInProgressDate?.message}
							/>
						);
					}}
				/>
				<Controller
					control={control}
					name="completionDate"
					render={({ field }) => {
						return (
							<FormDayPickerRhf
								{...field}
								value={field.value}
								disabled={disableField}
								placeholder="Completion Date"
								onValueChange={field.onChange}
								error={errors.completionDate?.message}
							/>
						);
					}}
				/>
			</fieldset>
			<div className="form__comments-3">
				<TextareaRhf<AssemblyFormValues>
					name="comments"
					id="commentsId"
					label="Comments"
					register={register}
					disabled={disableField}
					error={errors.comments?.message}
				/>
			</div>
		</form>
	);
};
