import { FC, useEffect, useRef } from "react";
import { useStore } from "zustand";
import { useForm } from "react-hook-form";
import * as Tabs from "@radix-ui/react-tabs";
import { Link, useParams } from "react-router";

import { Order } from "./tabs/Order/Order";
import { Pick } from "./tabs/Pick/Pick";
import { Result } from "./tabs/Result/Result";
import { AdditionalExpenses } from "./tabs/AdditionalExpense/AdditionalExpense";

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
	CommonPageStatus,
	CommonPageSubWrapper,
	CommonPageTitle,
} from "@/components/widgets/Page";
import { Attachments } from "@/components/widgets/Attachments";

import { orgStore } from "@/app/stores/orgStore";

import { useGetProducts } from "@/entities/products";
import { useGetWarehoueses } from "@/entities/selects";
import { AssemblyForm, useGetAssemblyById, getNormalizedResetAssemblyData } from "@/entities/assembly";

import { useGetPrintUrl } from "@/hooks/useGetPrintUrl";
import { usePageDetails } from "@/hooks/useAddPageDetails";
import { useOrganisationError } from "@/hooks/useOrganisationError";

import { AssemblyFormValues, AssemblyStatuses, DefaultAssemblyLine } from "@/@types/assembly/assembly";

const tabsNames = {
	order: "order",
	pick: "pick",
	result: "result",
	additionalExpense: "additionalExpense",
	attachments: "attachments",
};

const tabsNav = [
	{ content: "Order", name: tabsNames.order, iconName: "factory" },
	{ content: "Pick", name: tabsNames.pick, iconName: "handUp" },
	{ content: "Result", name: tabsNames.result, iconName: "checkInCircle" },
	{ content: "Additional Expenses", name: tabsNames.additionalExpense, iconName: "emptyFile" },
	{ content: "Attachments", name: tabsNames.attachments, iconName: "attachments" },
];

const EditAssembly: FC = () => {
	const { assemblyId } = useParams();
	const { orgId } = useStore(orgStore);

	const isFirstResetRef = useRef(true);

	const { isLoadingPrintUrl, getPrintUrlData } = useGetPrintUrl("AssemblyOrder");

	const {
		data: assembly,
		error: assemblyError,
		isError: isAssemblyError,
		isLoading: isAssemblyLoading,
		isSuccess: isAssemblySuccess,
	} = useGetAssemblyById({ assemblyId, organisationId: orgId });

	useOrganisationError(isAssemblyError, assemblyError);

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

	const [contentRef, isOpen, height, handleOpenClose] = usePageDetails(true, "fit-content");

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

	useEffect(() => {
		if (isFirstResetRef.current && isAssemblySuccess && assembly) {
			const resetData = getNormalizedResetAssemblyData(assembly.data);
			form.reset(resetData, { keepDefaultValues: true });

			isFirstResetRef.current = false;
		}
	}, [isAssemblySuccess, assembly, form]);

	return (
		<div className="main__sections">
			<CommonPage>
				<div className="main__container">
					{isAssemblyLoading || isProductsLoading || isWarehousesLoading ? (
						<Loader isFullWidth />
					) : isAssemblyError && assemblyError ? (
						<ErrorMessage error={assemblyError} />
					) : isProductsError && productsError ? (
						<ErrorMessage error={productsError} />
					) : isWarehousesError && warehousesError ? (
						<ErrorMessage error={warehousesError} />
					) : isAssemblySuccess &&
					  isProductsSuccess &&
					  isWarehousesSuccess &&
					  assembly.data &&
					  products.data &&
					  warehouses.data ? (
						<>
							<CommonPageHeader withoutDec>
								<CommonPageSubWrapper>
									<CommonPageStatus
										isGreen={assembly.data.status === "CLOSED"}
										isYellow={assembly.data.status !== "CLOSED"}
									>
										{AssemblyStatuses[assembly.data.status]}
									</CommonPageStatus>
									<CommonPageTitle isSingle>
										{assembly.data.assemblyNumber ? (
											<>
												{`Assembly ${assembly.data.assemblyNumber}`}{" "}
												<span className="commonPage__title--noCapitalize">of</span>{" "}
												{assembly.data.product.sku}
											</>
										) : (
											<>Edit Assembly of {assembly.data.product.sku}</>
										)}
									</CommonPageTitle>
								</CommonPageSubWrapper>
								<CommonPageActions>
									{assemblyId && (
										<Button
											isSecondary
											type="button"
											disabled={isLoadingPrintUrl}
											isLoading={isLoadingPrintUrl}
											onClick={() => getPrintUrlData(assemblyId)}
										>
											<svg width="18" height="18" focusable="false" aria-hidden="true">
												<use xlinkHref="/icons/icons.svg#print" />
											</svg>
											Print
										</Button>
									)}
									<Link to="/production/assembly" className="link link--secondary">
										<svg width="18" height="18" focusable="false" aria-hidden="true">
											<use xlinkHref="/icons/icons.svg#list" />
										</svg>
										Back to List
									</Link>
									<CommonPageLine />
									<CommonPageArrow type="button" isOpen={isOpen} onClick={handleOpenClose} />
								</CommonPageActions>
							</CommonPageHeader>
							<CommonPageMain ref={contentRef} isActive height={height} isOpen={isOpen}>
								<AssemblyForm
									isEdit
									form={form}
									products={products.data}
									warehouses={warehouses.data}
									assemblyData={assembly.data}
								/>
							</CommonPageMain>
						</>
					) : (
						<p className="empty_list">No data available</p>
					)}
				</div>
			</CommonPage>
			<CommonPage>
				<div className="main__container">
					{isAssemblyLoading || isProductsLoading || isWarehousesLoading ? (
						<Loader isFullWidth />
					) : isAssemblyError && assemblyError ? (
						<ErrorMessage error={assemblyError} />
					) : isProductsError && productsError ? (
						<ErrorMessage error={productsError} />
					) : isWarehousesError && warehousesError ? (
						<ErrorMessage error={warehousesError} />
					) : isAssemblySuccess &&
					  isProductsSuccess &&
					  isWarehousesSuccess &&
					  assembly.data &&
					  products.data &&
					  warehouses.data ? (
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
								<Order form={form} assemblyData={assembly.data} />
							</Tabs.Content>
							<Tabs.Content className="tabs__content" value={tabsNames.pick}>
								<Pick assemblyData={assembly.data} products={products.data.allProducts} />
							</Tabs.Content>
							<Tabs.Content className="tabs__content" value={tabsNames.result}>
								<Result assemblyData={assembly.data} products={products.data.allProducts} />
							</Tabs.Content>
							<Tabs.Content className="tabs__content" value={tabsNames.additionalExpense}>
								<AdditionalExpenses assemblyData={assembly.data} />
							</Tabs.Content>
							<Tabs.Content className="tabs__content" value={tabsNames.attachments}>
								<Attachments type="assembly" entityId={assembly.data.id} />
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

export default EditAssembly;
