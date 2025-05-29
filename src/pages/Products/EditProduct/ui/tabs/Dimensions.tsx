import { FC } from "react";

import { useParams } from "react-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useUpdateDimensions } from "../../api/mutations/useUpdateDimensions";

import { getNormalizedDemensionData } from "../../utils/getNormalizedDemensionData";

import { Button } from "@/components/shared/Button";
import { InputRhf } from "@/components/shared/form/InputRhf";
import { FormSelect, SelectItem } from "@/components/shared/form/FormSelect";

import { CommonPageActions, CommonPageMain, CommonPageWrapper } from "@/components/widgets/Page";

import { dimensionFormSchema, DimensionFormValues, EditProductType } from "@/@types/products";

type Props = {
	productData: EditProductType;
};

export const Dimensions: FC<Props> = ({ productData }) => {
	const { productId } = useParams();

	const { isPending, mutate } = useUpdateDimensions();

	const {
		control,
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<DimensionFormValues>({
		defaultValues: {
			uom: productData?.dimensions?.uom ?? "",
			length: productData?.dimensions?.length ?? 0,
			width: productData?.dimensions?.width ?? 0,
			height: productData?.dimensions?.height ?? 0,
			uomWeight: productData?.dimensions?.uomWeight ?? "",
			weight: productData?.dimensions?.weight ?? 0,
			lugSize: productData?.dimensions?.lugSize ?? "",
			quantity: productData?.dimensions?.quantity ?? 0,
			calculatedWith: productData?.dimensions?.calculatedWith ?? "",
		},
		resolver: zodResolver(dimensionFormSchema),
	});

	const onSubmit = (formData: DimensionFormValues) => {
		const body = getNormalizedDemensionData(formData);

		if (productId && !!Object.keys(body).length) {
			mutate({
				productId,
				body,
			});
		}
	};

	return (
		<CommonPageWrapper>
			<CommonPageActions alignItem="end">
				<Button type="submit" form="dimensionsForm" isLoading={isPending} disabled={isPending}>
					<svg width="18" height="18" focusable="false" aria-hidden="true">
						<use xlinkHref="/icons/icons.svg#save" />
					</svg>
					Save
				</Button>
			</CommonPageActions>
			<CommonPageMain>
				<form className="form" id="dimensionsForm" onSubmit={handleSubmit(onSubmit)}>
					<fieldset className="form__fieldset form__fieldset--4">
						<legend className="form__legend">Item Size</legend>
						<Controller
							name="uom"
							control={control}
							render={({ field }) => (
								<FormSelect
									{...field}
									id="uomId"
									value={field.value}
									error={errors.uom?.message}
									placeholder="Unit of Measure"
									onValueChange={field.onChange}
								>
									<SelectItem value="mm">Millimetre</SelectItem>
									<SelectItem value="cm">Centimetre</SelectItem>
									<SelectItem value="m">Metre</SelectItem>
									<SelectItem value="km">Kilometre</SelectItem>
								</FormSelect>
							)}
						/>
						<InputRhf<DimensionFormValues>
							min={0}
							step={0.01}
							type="number"
							id="lengthId"
							name="length"
							label="Length"
							register={register}
							rules={{
								valueAsNumber: true,
							}}
							error={errors.length?.message}
						/>
						<InputRhf<DimensionFormValues>
							min={0}
							step={0.01}
							type="number"
							id="widthId"
							name="width"
							label="Width"
							register={register}
							rules={{
								valueAsNumber: true,
							}}
							error={errors.width?.message}
						/>
						<InputRhf<DimensionFormValues>
							min={0}
							step={0.01}
							type="number"
							id="heightId"
							name="height"
							label="Height"
							register={register}
							rules={{
								valueAsNumber: true,
							}}
							error={errors.height?.message}
						/>
					</fieldset>
					<fieldset className="form__fieldset form__fieldset--2">
						<legend className="form__legend">Item Weight</legend>
						<Controller
							name="uomWeight"
							control={control}
							render={({ field }) => (
								<FormSelect
									{...field}
									id="uomWeightId"
									value={field.value}
									placeholder="Unit of Measure"
									onValueChange={field.onChange}
									error={errors.uomWeight?.message}
								>
									<SelectItem value="mg">Milligram</SelectItem>
									<SelectItem value="g">Gram</SelectItem>
									<SelectItem value="kg">Kilogram</SelectItem>
								</FormSelect>
							)}
						/>
						<InputRhf<DimensionFormValues>
							min={0}
							step={0.01}
							type="number"
							id="weightId"
							name="weight"
							label="Weight"
							register={register}
							rules={{
								valueAsNumber: true,
							}}
							error={errors.weight?.message}
						/>
					</fieldset>
					<fieldset className="form__fieldset form__fieldset--3">
						<legend className="form__legend">Item Weight</legend>
						<Controller
							name="lugSize"
							control={control}
							render={({ field }) => (
								<FormSelect
									{...field}
									id="lugSizeId"
									value={field.value}
									placeholder="Lug size"
									onValueChange={field.onChange}
									error={errors.lugSize?.message}
								>
									<SelectItem value="s_lugs">S Lugs</SelectItem>
									<SelectItem value="l_lugs">L Lugs</SelectItem>
								</FormSelect>
							)}
						/>
						<InputRhf<DimensionFormValues>
							min={0}
							step={0.01}
							type="number"
							id="quantityId"
							name="quantity"
							label="Base Quantity"
							register={register}
							rules={{
								valueAsNumber: true,
							}}
							error={errors.quantity?.message}
						/>
						<Controller
							name="calculatedWith"
							control={control}
							render={({ field }) => (
								<FormSelect
									{...field}
									id="calculatedWithId"
									value={field.value}
									placeholder="Calculated with"
									onValueChange={field.onChange}
									error={errors.calculatedWith?.message}
								>
									<SelectItem value="quantity">Quantity</SelectItem>
									<SelectItem value="weight">Weight</SelectItem>
								</FormSelect>
							)}
						/>
					</fieldset>
				</form>
			</CommonPageMain>
		</CommonPageWrapper>
	);
};
