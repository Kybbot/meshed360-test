import { FC } from "react";
import { useStore } from "zustand";
import * as Tabs from "@radix-ui/react-tabs";
import { Link, useParams } from "react-router";
import { useMutationState } from "@tanstack/react-query";

import { useGetProductById, useGetProductSettings } from "@/entities/products";

import { PriceLists } from "./tabs/PriceLists";
import { Dimensions } from "./tabs/Dimensions";
import { BillOfMaterials } from "./tabs/Bom/BillOfMaterials";

import { Loader } from "@/components/shared/Loader";
import { Button } from "@/components/shared/Button";
import { ErrorMessage } from "@/components/shared/ErrorMessage";

import {
	CommonPage,
	CommonPageActions,
	CommonPageArrow,
	CommonPageHeader,
	CommonPageLine,
	CommonPageMain,
	CommonPageTitle,
} from "@/components/widgets/Page";
import { ProductForm } from "@/components/widgets/Products";
import { Attachments } from "@/components/widgets/Attachments";

import { orgStore } from "@/app/stores/orgStore";

import { usePageDetails } from "@/hooks/useAddPageDetails";
import { useOrganisationError } from "@/hooks/useOrganisationError";

const tabsNames = {
	priceLists: "priceLists",
	dimensions: "dimensions",
	attachments: "attachments",
	bom: "bom",
};

const tabsNav = [
	{ content: "Price Lists", name: tabsNames.priceLists, iconName: "priceLists" },
	{ content: "Dimensions", name: tabsNames.dimensions, iconName: "dimensions" },
	{ content: "Attachments", name: tabsNames.attachments, iconName: "attachments" },
	{ content: "Bill of Materials", name: tabsNames.bom, iconName: "emptyFile" },
];

const EditProduct: FC = () => {
	const { productId } = useParams();
	const { orgId } = useStore(orgStore);

	const createCustomerStatus = useMutationState({
		filters: { mutationKey: ["update-product"] },
		select: (mutation) => mutation.state.status,
	});

	const isPending = createCustomerStatus.includes("pending");

	const {
		data: productSettingsData,
		error: productSettingsError,
		isError: isProductSettingsError,
		isLoading: isProductSettingsLoading,
		isSuccess: isProductSettingsSuccess,
	} = useGetProductSettings({ organisationId: orgId });

	const {
		data: productData,
		error: productError,
		isError: isProductError,
		isLoading: isProductLoading,
		isSuccess: isProductSuccess,
	} = useGetProductById({
		productId,
		organisationId: orgId,
	});

	useOrganisationError(isProductError, productError);

	const [contentRef, isOpen, height, handleOpenClose] = usePageDetails(true, "fit-content");

	return (
		<div className="main__sections">
			<CommonPage>
				<div className="main__container">
					<CommonPageHeader withoutDec>
						<CommonPageTitle>Edit Product</CommonPageTitle>
						<CommonPageActions>
							<Link to="/inventory/products" className="link link--secondary">
								<svg width="18" height="18" focusable="false" aria-hidden="true">
									<use xlinkHref="/icons/icons.svg#list" />
								</svg>
								Back to List
							</Link>
							<Button type="submit" form="newProductForm" isLoading={isPending} disabled={isPending}>
								<svg width="18" height="18" focusable="false" aria-hidden="true">
									<use xlinkHref="/icons/icons.svg#save" />
								</svg>
								Save
							</Button>
							<CommonPageLine />
							<CommonPageArrow type="button" isOpen={isOpen} onClick={handleOpenClose} />
						</CommonPageActions>
					</CommonPageHeader>
					<CommonPageMain ref={contentRef} isActive height={height} isOpen={isOpen}>
						{isProductSettingsLoading || isProductLoading ? (
							<Loader isFullWidth />
						) : isProductSettingsError && productSettingsError ? (
							<ErrorMessage error={productSettingsError} />
						) : isProductError && productError ? (
							<ErrorMessage error={productError} />
						) : isProductSettingsSuccess &&
						  isProductSuccess &&
						  productSettingsData.data &&
						  productData.data ? (
							<ProductForm
								isEdit
								productData={productData.data}
								productSettingsData={productSettingsData.data}
							/>
						) : (
							<p className="empty_list">No data available</p>
						)}
					</CommonPageMain>
				</div>
			</CommonPage>
			<CommonPage>
				<div className="main__container">
					{productId && (
						<Tabs.Root className="tabs" defaultValue={tabsNav[0].name}>
							<div className="tabs__header">
								<Tabs.List className="tabs__nav" aria-label="Manage users & roles">
									{tabsNav
										.filter(
											(item) =>
												item.name !== tabsNames.bom ||
												productData?.data?.bom === "ASSEMBLY_BOM" ||
												productData?.data?.bom === "DISASSEMBLY_BOM",
										)
										.map((item) => (
											<Tabs.Trigger key={item.name} className="tabs__btn" value={item.name}>
												<svg focusable="false" aria-hidden="true" width="18" height="18">
													<use xlinkHref={`/icons/icons.svg#${item.iconName}`} />
												</svg>
												{item.content}
											</Tabs.Trigger>
										))}
								</Tabs.List>
							</div>
							<Tabs.Content className="tabs__content" value={tabsNames.priceLists}>
								{isProductSettingsLoading || isProductLoading ? <Loader isFullWidth /> : <PriceLists />}
							</Tabs.Content>
							<Tabs.Content className="tabs__content" value={tabsNames.dimensions}>
								{isProductSettingsLoading || isProductLoading ? (
									<Loader isFullWidth />
								) : isProductError && productError ? (
									<ErrorMessage error={productError} />
								) : isProductSuccess && productData ? (
									<Dimensions productData={productData.data} />
								) : (
									<p className="empty_list">No data available</p>
								)}
							</Tabs.Content>
							<Tabs.Content className="tabs__content" value={tabsNames.attachments}>
								<Attachments type="product" entityId={productId} />
							</Tabs.Content>
							<Tabs.Content className="tabs__content" value={tabsNames.bom}>
								<Tabs.Content className="tabs__content" value={tabsNames.bom}>
									<BillOfMaterials isAssembly={productData?.data.bom === "ASSEMBLY_BOM"} />
								</Tabs.Content>
							</Tabs.Content>
						</Tabs.Root>
					)}
				</div>
			</CommonPage>
		</div>
	);
};

export default EditProduct;
