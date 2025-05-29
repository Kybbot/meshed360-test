import { FC, useEffect } from "react";
import { useParams } from "react-router";
import { useForm } from "react-hook-form";

import { useGetProductBOM } from "@/entities/products";
import { useSaveProductBom } from "../../../api/mutations/useSaveProductBom";

import { ProductBomFormValues, DefaultProductBOMLineFormValues } from "@/@types/products";

import {
	denormalizeProductBOMData,
	getNormalizedProductBOMData,
} from "../../../utils/getNormalizedProductBOMData";

import { validateData } from "../../../utils/validate";

import { ProductBomLines } from "./ProductBomLines";
import { ProductBomServiceLines } from "./ProductBomServiceLines";

import { Button } from "@/components/shared/Button";
import { Loader } from "@/components/shared/Loader";
import { InputRhf } from "@/components/shared/form/InputRhf";
import { ErrorMessage } from "@/components/shared/ErrorMessage";

import { CommonPageMain, CommonPageWrapper, CommonPageActions } from "@/components/widgets/Page";

type Props = {
	isAssembly: boolean;
};

export const BillOfMaterials: FC<Props> = ({ isAssembly }) => {
	const { productId } = useParams();

	const { data, error, isError, isSuccess, isLoading } = useGetProductBOM({ productId });
	const { isPending, mutate } = useSaveProductBom();

	const {
		reset,
		control,
		register,
		setValue,
		handleSubmit,
		formState: { errors },
	} = useForm<ProductBomFormValues>({
		defaultValues: {
			quantityToProduce: "0",
			quantityToDismantle: "0",
			lines: [DefaultProductBOMLineFormValues],
			serviceLines: [],
		},
	});

	useEffect(() => {
		if (isSuccess && data) {
			reset(denormalizeProductBOMData(data.data, isAssembly), { keepDefaultValues: true });
		}
	}, [isSuccess, data, reset, isAssembly]);

	const onSubmit = (formData: ProductBomFormValues) => {
		const isValidData = validateData(formData);
		if (!isValidData) return;

		const body = getNormalizedProductBOMData(formData, isAssembly);

		if (productId) {
			mutate({
				productId,
				body,
			});
		}
	};

	return (
		<CommonPageWrapper>
			<div className="commonPage__header" style={{ justifyContent: "flex-end" }}>
				<CommonPageActions alignItem="end">
					<Button type="submit" form="assemblyForm" isLoading={isPending} disabled={isPending}>
						<svg width="18" height="18" focusable="false" aria-hidden="true">
							<use xlinkHref="/icons/icons.svg#save" />
						</svg>
						Save
					</Button>
				</CommonPageActions>
			</div>
			<CommonPageMain>
				{isLoading ? (
					<Loader isFullWidth />
				) : isError && error ? (
					<ErrorMessage error={error} />
				) : !data?.data ? (
					<p className="empty_list">No data available</p>
				) : (
					<form className="commonPage__main" id="assemblyForm" onSubmit={handleSubmit(onSubmit)}>
						<div className="commonPage__buttons">
							<div style={{ width: "270px" }}>
								{isAssembly ? (
									<InputRhf<ProductBomFormValues>
										step={0.01}
										type="number"
										name="quantityToProduce"
										id="quantityId"
										register={register}
										label="Quantity to Produce*"
										rules={{
											required: "Required",
										}}
										error={errors.quantityToProduce?.message}
									/>
								) : (
									<InputRhf<ProductBomFormValues>
										step={0.01}
										type="number"
										name="quantityToDismantle"
										id="quantityToDismantleId"
										register={register}
										label="Quantity to Dismantle*"
										rules={{ required: "Required" }}
										error={errors.quantityToDismantle?.message}
									/>
								)}
							</div>
						</div>
						<ProductBomLines
							errors={errors}
							control={control}
							register={register}
							setValue={setValue}
							isAssembly={isAssembly}
						/>
						<ProductBomServiceLines
							errors={errors}
							control={control}
							register={register}
							setValue={setValue}
						/>
					</form>
				)}
			</CommonPageMain>
		</CommonPageWrapper>
	);
};
