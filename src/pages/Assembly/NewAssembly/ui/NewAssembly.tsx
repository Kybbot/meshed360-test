import { FC } from "react";
import { useStore } from "zustand";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import * as Tabs from "@radix-ui/react-tabs";

import { Order } from "../../EditAssembly/ui/tabs/Order/Order";

import { Loader } from "@/components/shared/Loader";
import { Button } from "@/components/shared/Button";
import { ErrorMessage } from "@/components/shared/ErrorMessage";

import { CommonPage, CommonPageActions, CommonPageHeader, CommonPageTitle } from "@/components/widgets/Page";

import { orgStore } from "@/app/stores/orgStore";

import { AssemblyForm } from "@/entities/assembly";
import { useGetProducts } from "@/entities/products";
import { useGetWarehoueses } from "@/entities/selects";

import { AssemblyFormValues, DefaultAssemblyLine } from "@/@types/assembly/assembly";

const tabsNames = {
	order: "order",
};

const tabsNav = [{ content: "Order", name: tabsNames.order, iconName: "factory" }];

const NewAssembly: FC = () => {
	const navigate = useNavigate();
	const { orgId } = useStore(orgStore);

	const {
		data: products,
		error: productsError,
		isError: isProductsError,
		isLoading: isProductsLoading,
		isSuccess: isProductsSuccess,
	} = useGetProducts({ organisationId: orgId, searchValue: "", type: "stock" });

	const {
		data: warehouses,
		error: warehousesError,
		isError: isWarehousesError,
		isLoading: isWarehousesLoading,
		isSuccess: isWarehousesSuccess,
	} = useGetWarehoueses({ organisationId: orgId, searchValue: "" });

	const form = useForm<AssemblyFormValues>({
		defaultValues: {
			product: undefined,
			productName: "",
			warehouse: undefined,
			workInProgressAccount: undefined,
			finishedGoodsAccount: undefined,
			quantity: "",
			maxQuantity: "",
			workInProgressDate: undefined,
			completionDate: undefined,
			comments: "",
			lines: [DefaultAssemblyLine],
			serviceLines: [],
		},
	});

	return (
		<div className="main__sections">
			<CommonPage>
				<div className="main__container">
					{isProductsLoading || isWarehousesLoading ? (
						<Loader isFullWidth />
					) : isProductsError && productsError ? (
						<ErrorMessage error={productsError} />
					) : isWarehousesError && warehousesError ? (
						<ErrorMessage error={warehousesError} />
					) : isProductsSuccess && isWarehousesSuccess && products.data && warehouses.data ? (
						<>
							<CommonPageHeader>
								<CommonPageTitle>Add Assembly</CommonPageTitle>
								<CommonPageActions>
									<Button type="button" isSecondary onClick={() => navigate(-1)}>
										<svg width="18" height="18" focusable="false" aria-hidden="true">
											<use xlinkHref="/icons/icons.svg#list" />
										</svg>
										Back to List
									</Button>
								</CommonPageActions>
							</CommonPageHeader>
							<AssemblyForm form={form} products={products.data} warehouses={warehouses.data} />
						</>
					) : (
						<p className="empty_list">No data available</p>
					)}
				</div>
			</CommonPage>
			<CommonPage>
				<div className="main__container">
					{isProductsLoading || isWarehousesLoading ? (
						<Loader isFullWidth />
					) : isProductsError && productsError ? (
						<ErrorMessage error={productsError} />
					) : isWarehousesError && warehousesError ? (
						<ErrorMessage error={warehousesError} />
					) : isProductsSuccess && isWarehousesSuccess && products.data && warehouses.data ? (
						<Tabs.Root className="tabs" defaultValue={tabsNav[0].name}>
							<div className="tabs__header">
								<Tabs.List className="tabs__nav" aria-label="Manage users & roles">
									{tabsNav.map((item) => (
										<Tabs.Trigger key={item.name} className="tabs__btn" value={item.name}>
											<svg focusable="false" aria-hidden="true" width="18" height="18">
												<use xlinkHref={`/icons/icons.svg#${item.iconName}`} />
											</svg>
											{item.content}
										</Tabs.Trigger>
									))}
								</Tabs.List>
							</div>
							<Tabs.Content className="tabs__content" value={tabsNames.order}>
								<Order form={form} />
							</Tabs.Content>
						</Tabs.Root>
					) : (
						<p className="empty_list">No data available</p>
					)}
				</div>
			</CommonPage>
		</div>
	);
};

export default NewAssembly;
