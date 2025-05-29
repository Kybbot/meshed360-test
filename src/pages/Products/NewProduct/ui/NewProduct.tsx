import { FC } from "react";
import { useStore } from "zustand";
import { useNavigate } from "react-router";
import { useMutationState } from "@tanstack/react-query";

import { Loader } from "@/components/shared/Loader";
import { Button } from "@/components/shared/Button";
import { ErrorMessage } from "@/components/shared/ErrorMessage";

import { ProductForm } from "@/components/widgets/Products";
import { CommonPage, CommonPageActions, CommonPageHeader, CommonPageTitle } from "@/components/widgets/Page";

import { orgStore } from "@/app/stores/orgStore";

import { useGetProductSettings } from "@/entities/products";

const NewProduct: FC = () => {
	const navigate = useNavigate();
	const { orgId } = useStore(orgStore);

	const createProductStatus = useMutationState({
		filters: { mutationKey: ["create-product"] },
		select: (mutation) => mutation.state.status,
	});

	const isPending = createProductStatus.includes("pending");

	const {
		data: productSettingsData,
		error: productSettingsError,
		isError: isProductSettingsError,
		isLoading: isProductSettingsLoading,
		isSuccess: isProductSettingsSuccess,
	} = useGetProductSettings({ organisationId: orgId });

	return (
		<CommonPage>
			<div className="main__container">
				<CommonPageHeader>
					<CommonPageTitle>Add Product</CommonPageTitle>
					<CommonPageActions>
						<Button type="button" isSecondary onClick={() => navigate(-1)}>
							<svg width="18" height="18" focusable="false" aria-hidden="true">
								<use xlinkHref="/icons/icons.svg#list" />
							</svg>
							Back to List
						</Button>
						<Button type="submit" form="newProductForm" isLoading={isPending} disabled={isPending}>
							<svg width="18" height="18" focusable="false" aria-hidden="true">
								<use xlinkHref="/icons/icons.svg#plus" />
							</svg>
							Create
						</Button>
					</CommonPageActions>
				</CommonPageHeader>
				{isProductSettingsLoading ? (
					<Loader isFullWidth />
				) : isProductSettingsError && productSettingsError ? (
					<ErrorMessage error={productSettingsError} />
				) : isProductSettingsSuccess && productSettingsData.data ? (
					<ProductForm isEdit={false} productSettingsData={productSettingsData.data} />
				) : (
					<p className="empty_list">No data available</p>
				)}
			</div>
		</CommonPage>
	);
};

export default NewProduct;
