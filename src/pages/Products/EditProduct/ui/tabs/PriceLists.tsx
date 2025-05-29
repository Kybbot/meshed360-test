import { FC, useEffect, useState } from "react";
import { useStore } from "zustand";
import { useParams } from "react-router";
import { useFieldArray, useForm } from "react-hook-form";

import { useGetAllPriceLists } from "@/entities/priceLists";
import { SetProductPricesRequestType } from "@/@types/priceLists";
import { useSetProductPrices } from "../../api/mutations/useSetProductPrices";

import { Loader } from "@/components/shared/Loader";
import { Button } from "@/components/shared/Button";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { TableInputRhf } from "@/components/shared/form/TableInputRhf";

import { TablePagination } from "@/components/widgets/Table";
import { CommonPageActions } from "@/components/widgets/Page";

import { orgStore } from "@/app/stores/orgStore";

export const PriceLists: FC = () => {
	const { productId } = useParams();
	const { orgId } = useStore(orgStore);

	const [{ page, limit }, setPageAndLimit] = useState({ page: "1", limit: "10" });

	const { data, error, isLoading, isError, isSuccess } = useGetAllPriceLists({
		organisationId: orgId,
		pageNumber: page,
		pageSize: limit,
		searchValue: "",
	});

	const { mutate: setPrices, isPending } = useSetProductPrices();

	const {
		reset,
		control,
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<SetProductPricesRequestType>({
		defaultValues: {
			priceLists: [
				{
					id: "",
					price: 0,
				},
			],
		},
	});

	const { fields } = useFieldArray({ control, name: "priceLists" });

	useEffect(() => {
		if (isSuccess && data?.data) {
			reset({
				priceLists: data.data.priceLists.map((item) => ({
					id: item.id,
					price: item.priceListContent?.find((p) => p.productid === productId)?.price ?? 0,
				})),
			});
		}
	}, [isSuccess, data, productId, reset]);

	const onSubmit = (values: SetProductPricesRequestType) => {
		if (!productId) return;

		setPrices({
			productId,
			body: values,
		});
	};

	const handlePageAndLimit = (page: string, limit: string) => {
		setPageAndLimit({ page, limit });
	};

	return (
		<div className="commonPage__main" style={{ gap: "16px" }}>
			<CommonPageActions alignItem="end">
				<Button type="submit" form="priceListsForm" isLoading={isPending} disabled={isPending}>
					<svg width="18" height="18" focusable="false" aria-hidden="true">
						<use xlinkHref="/icons/icons.svg#save" />
					</svg>
					Save
				</Button>
			</CommonPageActions>
			{isLoading ? (
				<Loader isFullWidth />
			) : isError && error ? (
				<ErrorMessage error={error} />
			) : isSuccess && data.data ? (
				<>
					<form id="priceListsForm" onSubmit={handleSubmit(onSubmit)}>
						<div className="formTable">
							<div className="formTable__rows">
								<div className="formTable__row">
									<p className="formTable__header">Price List Name</p>
									<p className="formTable__header">Price</p>
								</div>
								{fields.length > 0 ? (
									fields.map((field, index) => (
										<div className="formTable__row" key={field.id}>
											<div className="formTable__data">
												<p className="formTable__text">{data?.data?.priceLists?.[index]?.name ?? ""}</p>
											</div>
											<div className="formTable__data">
												<TableInputRhf<SetProductPricesRequestType>
													type="number"
													min={0}
													step={0.01}
													label="Price"
													register={register}
													id={`priceId-${index}`}
													rules={{ required: "Required", valueAsNumber: true }}
													name={`priceLists.${index}.price`}
													error={errors?.priceLists?.[index]?.price?.message}
												/>
											</div>
										</div>
									))
								) : (
									<p className="formTable__empty">No data available</p>
								)}
							</div>
						</div>
					</form>
					<TablePagination
						page={page}
						limit={limit}
						total={data.data.totalCount}
						totalPages={data.data.totalPages}
						handlePageAndLimit={handlePageAndLimit}
					/>
				</>
			) : (
				<p className="empty_list">No data available</p>
			)}
		</div>
	);
};
