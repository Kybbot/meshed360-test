import { FC, useEffect } from "react";
import { useStore } from "zustand";
import { useNavigate, useParams } from "react-router";
import { Controller, useForm } from "react-hook-form";

import { getNormalizedProductData } from "../utils/getNormalizedProductData";

import { InputRhf } from "@/components/shared/form/InputRhf";
import { CustomSelect } from "@/components/shared/CustomSelect";

import { orgStore } from "@/app/stores/orgStore";

import { useCreateProduct, useUpdateProduct } from "@/entities/products";

import {
	boms,
	types,
	statuses,
	bomsByKey,
	typesByKey,
	statusesByKey,
	costingMethods,
	EditProductType,
	ProductFormValues,
	costingMethodsByKey,
	GetProductSettingsResponseType,
} from "@/@types/products";

type ProductFormProps = {
	productSettingsData: GetProductSettingsResponseType;
} & ({ isEdit: false; productData?: never } | { isEdit: true; productData: EditProductType });

export const ProductForm: FC<ProductFormProps> = ({ isEdit = false, productData, productSettingsData }) => {
	const navigate = useNavigate();
	const { productId } = useParams();
	const orgId = useStore(orgStore, (selector) => selector.orgId);

	const {
		mutate: createProduct,
		data: createProductData,
		isSuccess: isCreateProductSuccess,
	} = useCreateProduct();

	const { mutate: updateProduct } = useUpdateProduct();

	const {
		reset,
		watch,
		control,
		register,
		setValue,
		handleSubmit,
		formState: { errors },
	} = useForm<ProductFormValues>({
		defaultValues: {
			sku: "",
			name: "",
			barcode: "",
			type: undefined,
			category: undefined,
			brand: undefined,
			unitOfMeasure: undefined,
			status: { id: "active", name: "Active" },
			bom: undefined,
			costingMethod: costingMethods[0],
			defaultLocation: undefined,
			inventoryAccount: undefined,
			expenseAccount: undefined,
			revenueAccount: undefined,
			cogsAccount: undefined,
			purchaseTaxRule: undefined,
			saleTaxRule: undefined,
		},
	});

	const typeField = watch("type");

	const onSubmit = async (formData: ProductFormValues) => {
		const body = getNormalizedProductData(formData);

		if (isEdit) {
			if (productId) {
				updateProduct({ productId, body });
			}
		} else {
			if (orgId) {
				createProduct({ organisationId: orgId, body });
			}
		}
	};

	useEffect(() => {
		if (isEdit && productData) {
			reset(
				{
					sku: productData.sku,
					name: productData.name,
					barcode: productData.barcode,
					type: typesByKey[productData.type],
					category: productData.category,
					brand: productData.brand,
					unitOfMeasure: productData.unitOfMeasure,
					status: productData.isActive ? statusesByKey["active"] : statusesByKey["inactive"],
					bom: bomsByKey[productData.bom],
					costingMethod: costingMethodsByKey[productData.costingMethod],
					defaultLocation: productData.defaultLocation,
					inventoryAccount: productData.inventoryAccount,
					expenseAccount: productData.expenseAccount,
					revenueAccount: productData.revenueAccount,
					cogsAccount: productData.cogsAccount,
					purchaseTaxRule: productData.purchaseTaxRule,
					saleTaxRule: productData.saleTaxRule,
				},
				{ keepDefaultValues: true },
			);
		}
	}, [isEdit, productData, reset]);

	useEffect(() => {
		if (isCreateProductSuccess && createProductData.data) {
			reset();
			navigate(`/inventory/products/edit/${createProductData.data.id}`);
		}
	}, [isCreateProductSuccess, createProductData, reset, navigate]);

	return (
		<form className="newCustomer__form" id="newProductForm" onSubmit={handleSubmit(onSubmit)}>
			<fieldset className="form__fieldset">
				<legend className="form__legend">Product Details</legend>
				<InputRhf<ProductFormValues>
					type="text"
					name="sku"
					id="skuId"
					label="SKU*"
					disabled={isEdit}
					register={register}
					rules={{
						required: "Required",
					}}
					error={errors.sku?.message}
				/>
				<InputRhf<ProductFormValues>
					type="text"
					id="nameId"
					name="name"
					label="Product Name*"
					register={register}
					rules={{
						required: "Required",
					}}
					error={errors.name?.message}
				/>
				<InputRhf<ProductFormValues>
					type="text"
					name="barcode"
					id="barcodeId"
					label="Barcode"
					register={register}
					error={errors.barcode?.message}
				/>
				<Controller
					name="type"
					rules={{
						required: "Required",
						onChange() {
							setValue("bom", undefined);
							setValue("costingMethod", costingMethods[0]);
							setValue("defaultLocation", undefined);
							setValue("cogsAccount", undefined);
							setValue("expenseAccount", undefined);
							setValue("inventoryAccount", undefined);
						},
					}}
					control={control}
					render={({ field }) => (
						<CustomSelect
							{...field}
							id="typeId"
							disabled={isEdit}
							value={field.value}
							placeholder="Type*"
							allowUnselect={false}
							customValues={types}
							onValueChange={field.onChange}
							error={errors.type?.message}
						/>
					)}
				/>
				<Controller
					name="category"
					control={control}
					render={({ field }) => (
						<CustomSelect
							{...field}
							useSearch
							id="categoryId"
							value={field.value}
							placeholder="Category"
							onValueChange={field.onChange}
							error={errors.category?.message}
							customValues={productSettingsData.categories}
						/>
					)}
				/>
				<Controller
					name="brand"
					control={control}
					render={({ field }) => (
						<CustomSelect
							{...field}
							useSearch
							id="brandId"
							value={field.value}
							placeholder="Brand"
							error={errors.brand?.message}
							onValueChange={field.onChange}
							customValues={productSettingsData.brand}
						/>
					)}
				/>
				<Controller
					name="unitOfMeasure"
					control={control}
					render={({ field }) => (
						<CustomSelect
							{...field}
							useSearch
							value={field.value}
							id="unitOfMeasureId"
							placeholder="Unit of Measure"
							onValueChange={field.onChange}
							error={errors.unitOfMeasure?.message}
							customValues={productSettingsData.unitOfMeasure}
						/>
					)}
				/>
			</fieldset>
			<fieldset className="form__fieldset">
				<legend className="form__legend">Product Settings</legend>
				<Controller
					name="status"
					control={control}
					rules={{
						required: "Required",
					}}
					render={({ field }) => {
						return (
							<CustomSelect
								{...field}
								id="statusId"
								value={field.value}
								placeholder="Status*"
								allowUnselect={false}
								customValues={statuses}
								error={errors.status?.message}
								onValueChange={field.onChange}
							/>
						);
					}}
				/>
				{typeField?.id === "STOCK" && (
					<>
						<Controller
							name="bom"
							control={control}
							render={({ field }) => (
								<CustomSelect
									{...field}
									id="bomId"
									disabled={isEdit}
									customValues={boms}
									value={field.value}
									allowUnselect={false}
									error={errors.bom?.message}
									onValueChange={field.onChange}
									placeholder="Bill of Materials"
								/>
							)}
						/>

						<Controller
							name="costingMethod"
							control={control}
							rules={{
								required: "Required",
							}}
							render={({ field }) => (
								<CustomSelect
									{...field}
									disabled={isEdit}
									value={field.value}
									allowUnselect={false}
									id="costingMethodId"
									placeholder="Costing Method*"
									customValues={costingMethods}
									onValueChange={field.onChange}
									error={errors.costingMethod?.message}
								/>
							)}
						/>
						<Controller
							name="defaultLocation"
							control={control}
							render={({ field }) => (
								<CustomSelect
									{...field}
									useSearch
									value={field.value}
									id="defaultLocationId"
									placeholder="Default Location"
									onValueChange={field.onChange}
									error={errors.defaultLocation?.message}
									customValues={productSettingsData.warehouses}
								/>
							)}
						/>
					</>
				)}
			</fieldset>
			<fieldset className="form__fieldset">
				<legend className="form__legend">Financial Mappings</legend>
				{typeField?.id === "STOCK" && (
					<Controller
						name="inventoryAccount"
						control={control}
						render={({ field }) => (
							<CustomSelect
								{...field}
								useSearch
								value={field.value}
								id="inventoryAccountId"
								placeholder="Inventory Account"
								onValueChange={field.onChange}
								error={errors.inventoryAccount?.message}
								customValues={productSettingsData.inventoryAccounts}
							/>
						)}
					/>
				)}
				{typeField?.id === "SERVICE" && (
					<Controller
						name="expenseAccount"
						control={control}
						render={({ field }) => (
							<CustomSelect
								{...field}
								useSearch
								value={field.value}
								id="expenseAccountId"
								placeholder="Expense Account"
								onValueChange={field.onChange}
								error={errors.expenseAccount?.message}
								customValues={productSettingsData.expenseAccounts}
							/>
						)}
					/>
				)}
				<Controller
					name="revenueAccount"
					control={control}
					render={({ field }) => (
						<CustomSelect
							{...field}
							useSearch
							value={field.value}
							id="revenueAccountId"
							placeholder="Revenue Account"
							onValueChange={field.onChange}
							error={errors.revenueAccount?.message}
							customValues={productSettingsData.revenueAccounts}
						/>
					)}
				/>
				{typeField?.id === "STOCK" && (
					<Controller
						name="cogsAccount"
						control={control}
						render={({ field }) => (
							<CustomSelect
								{...field}
								useSearch
								id="cogsAccountId"
								value={field.value}
								placeholder="COGS Account"
								onValueChange={field.onChange}
								error={errors.cogsAccount?.message}
								customValues={productSettingsData.cogsAccounts}
							/>
						)}
					/>
				)}
				<Controller
					name="purchaseTaxRule"
					control={control}
					render={({ field }) => (
						<CustomSelect
							{...field}
							useSearch
							value={field.value}
							id="purchaseTaxRuleId"
							placeholder="Purchase Tax Rule"
							onValueChange={field.onChange}
							error={errors.purchaseTaxRule?.message}
							customValues={productSettingsData.purchaseTaxRules}
						/>
					)}
				/>
				<Controller
					name="saleTaxRule"
					control={control}
					render={({ field }) => (
						<CustomSelect
							{...field}
							useSearch
							id="saleTaxRuleId"
							value={field.value}
							placeholder="Sale Tax Rule"
							onValueChange={field.onChange}
							error={errors.saleTaxRule?.message}
							customValues={productSettingsData.saleTaxRules}
						/>
					)}
				/>
			</fieldset>
		</form>
	);
};
