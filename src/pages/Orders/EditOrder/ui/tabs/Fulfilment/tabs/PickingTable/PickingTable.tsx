import { FC, useEffect, useRef } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";

import {
	DropdownMenu,
	DropdownMenuItem,
	DropdownMenuRoot,
	DropdownMenuTrigger,
} from "@/components/shared/DropdownMenu.tsx";
import { Button } from "@/components/shared/Button.tsx";

import {
	CommonPageActions,
	CommonPageMain,
	CommonPageStatus,
	CommonPageSubWrapper,
	CommonPageTitle,
	CommonPageWrapper,
} from "@/components/widgets/Page";

import {
	EmptyFulfilmentPickingLine,
	orderStatusDictionary,
	PickingFulfilmentFormValues,
} from "@/@types/salesOrders/local.ts";
import { ExtendedSalesOrder, FulfilmentType } from "@/@types/salesOrders/api.ts";
import { PickingLines } from "@/pages/Orders/EditOrder/ui/tabs/Fulfilment/tabs/PickingTable/PickingLines.tsx";
import { FormDayPickerRhf } from "@/components/shared/form/FormDayPickerRhf.tsx";
import { useGetAllStockPickers } from "@/pages/Settings/StockPickers/api/queries/useGetAllStockPickers.ts";
import { useStore } from "zustand";
import { orgStore } from "@/app/stores/orgStore.ts";
import { CustomSelect } from "@/components/shared/CustomSelect.tsx";

import { useCreateFulfilment } from "@/entities/orders/api/mutations/fulfilment/useCreateFulfilment.ts";
import { getNormalizedPickingData } from "@/pages/Orders/EditOrder/ui/tabs/Fulfilment/utils/getNormalizedPickingData.ts";
import { ProductType } from "@/@types/products.ts";
import { useSavePicking } from "@/entities/orders/api/mutations/fulfilment/picking/useSavePicking.ts";
import { useAuthorisePicking } from "@/entities/orders/api/mutations/fulfilment/picking/useAuthorisePicking.ts";
import { useVoidPicking } from "@/entities/orders/api/mutations/fulfilment/picking/useVoidPicking.ts";
import { useUndoPicking } from "@/entities/orders/api/mutations/fulfilment/picking/useUndoPicking.ts";
import { getDateFromDayPickerDate } from "@/utils/date";

type Props = {
	fulfilment?: FulfilmentType;
	orderInfo: ExtendedSalesOrder;
	isListShown: boolean;
	setIsListShown: (value: boolean) => void;
	setSelectedFulfilmentId: (value: string | null) => void;
};

export const PickingTable: FC<Props> = ({
	fulfilment,
	orderInfo,
	isListShown,
	setIsListShown,
	setSelectedFulfilmentId,
}) => {
	const formRef = useRef<HTMLFormElement>(null);
	const { orgId } = useStore(orgStore);
	const picking = fulfilment?.picking;

	const { data: pickersData, isLoading: isLoadingPickers } = useGetAllStockPickers({
		organisationId: orgId,
		pageNumber: "1",
		pageSize: "999",
		searchValue: "",
	});

	const { mutate: createFulfilment } = useCreateFulfilment(setSelectedFulfilmentId);
	const { mutate: savePicking } = useSavePicking();
	const { mutate: authorisePicking } = useAuthorisePicking();
	const { mutate: voidPicking } = useVoidPicking();
	const { mutate: undoPicking } = useUndoPicking();

	const form = useForm<PickingFulfilmentFormValues>({
		defaultValues: {
			lines: [{ ...EmptyFulfilmentPickingLine, location: orderInfo.warehouse }],
			picker: undefined,
			requiredBy: undefined,
		},
		disabled: picking?.status === "AUTHORIZED",
	});

	useEffect(() => {
		if (picking) {
			form.reset({
				lines: picking.lines.map((line) => ({
					product: line.product as ProductType,
					batch: line.batchNumber ? { id: line.batchNumber, name: line.batchNumber } : undefined,
					quantity: line.quantity,
					expiryDate: line.expiryDate,
					location: line.warehouse,
				})),
				picker: picking.picker,
				requiredBy: picking.requiredBy ? getDateFromDayPickerDate(picking.requiredBy) : undefined,
			});
		} else {
			form.reset({
				lines: [{ ...EmptyFulfilmentPickingLine, location: orderInfo.warehouse }],
				picker: undefined,
				requiredBy: undefined,
			});
		}
	}, [picking]);

	const onSubmit = async (formData: PickingFulfilmentFormValues, action: "save" | "authorise") => {
		const payload = getNormalizedPickingData(formData);

		if (!orgId) return;

		switch (action) {
			case "authorise":
				authorisePicking({
					orderId: orderInfo.id,
					organisationId: orgId,
					fulfillmentId: fulfilment!.id,
					body: payload,
				});
				break;
			case "save":
				if (!fulfilment?.id) {
					createFulfilment({ orderId: orderInfo.id, organisationId: orgId, body: { picking: payload } });
				} else {
					savePicking({
						orderId: orderInfo.id,
						organisationId: orgId,
						fulfillmentId: fulfilment.id,
						body: payload,
					});
				}
				break;
		}
	};

	const handleSave = form.handleSubmit((data) => onSubmit(data, "save"));
	const handleAuthorise = form.handleSubmit((data) => onSubmit(data, "authorise"));
	const handleVoid = () => {
		if (!orderInfo.id || !orgId || !fulfilment) return;
		voidPicking({ orderId: orderInfo.id, organisationId: orgId, fulfillmentId: fulfilment.id });
	};
	const handleUndo = () => {
		if (!orderInfo.id || !orgId || !fulfilment) return;
		undoPicking({ orderId: orderInfo.id, organisationId: orgId, fulfillmentId: fulfilment.id });
	};

	return (
		<FormProvider {...form}>
			<CommonPageWrapper>
				<CommonPageActions isComplex>
					<CommonPageSubWrapper>
						{picking?.status ? (
							<CommonPageStatus
								isYellow={picking.status === "DRAFT"}
								isGreen={picking.status === "AUTHORIZED"}
								isRed={picking.status === "VOID"}
							>
								{orderStatusDictionary[picking.status]}
							</CommonPageStatus>
						) : (
							<CommonPageStatus>New</CommonPageStatus>
						)}
						<CommonPageTitle>Picking</CommonPageTitle>
					</CommonPageSubWrapper>
					<CommonPageSubWrapper>
						<Button type="button" isSecondary onClick={() => setIsListShown(!isListShown)}>
							{isListShown ? (
								<>
									<svg width="18" height="18" focusable="false" aria-hidden="true">
										<use xlinkHref="/icons/icons.svg#eyeClose" />
									</svg>
									Hide Fulfilment List
								</>
							) : (
								<>
									<svg width="18" height="18" focusable="false" aria-hidden="true">
										<use xlinkHref="/icons/icons.svg#eyeOpen" />
									</svg>
									Show Fulfilment List
								</>
							)}
						</Button>
						<DropdownMenuRoot modal={false}>
							<DropdownMenuTrigger disabled={fulfilment?.packing?.status === "AUTHORIZED"} asChild>
								<Button type="button">
									<svg width="18" height="18" focusable="false" aria-hidden="true">
										<use xlinkHref="/icons/icons.svg#dotsInCicle" />
									</svg>
									Actions
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenu className="dropDown__content" sideOffset={10} align="end">
								{picking?.status !== "AUTHORIZED" ? (
									<>
										<DropdownMenuItem className="dropDown__item" onSelect={() => handleSave()}>
											Save
										</DropdownMenuItem>
										{!!fulfilment && (
											<DropdownMenuItem className="dropDown__item" onSelect={() => handleAuthorise()}>
												Authorise
											</DropdownMenuItem>
										)}
										{!!fulfilment && (
											<DropdownMenuItem className="dropDown__item" onSelect={() => handleVoid()}>
												Void
											</DropdownMenuItem>
										)}
									</>
								) : (
									<>
										<DropdownMenuItem className="dropDown__item" onSelect={() => handleUndo()}>
											Undo
										</DropdownMenuItem>
									</>
								)}
							</DropdownMenu>
						</DropdownMenuRoot>
					</CommonPageSubWrapper>
				</CommonPageActions>
				<form ref={formRef} action="pickingForm" className="commonPage__main" onSubmit={handleSave}>
					<div className="salesOrder__fulfilment-picking-fields">
						<Controller
							name="requiredBy"
							control={form.control}
							render={({ field }) => {
								return (
									<FormDayPickerRhf
										{...field}
										value={field.value}
										placeholder="Required by"
										onValueChange={field.onChange}
										error={form.formState.errors.requiredBy?.message}
									/>
								);
							}}
						/>
						<Controller
							name="picker"
							control={form.control}
							rules={{
								required: "Required",
							}}
							render={({ field }) => (
								<CustomSelect
									isLoading={isLoadingPickers}
									useSearch
									{...field}
									id="picker"
									value={field.value}
									placeholder="Picker*"
									onValueChange={field.onChange}
									error={form.formState.errors.picker?.message}
									customValues={pickersData?.data?.pickers}
								/>
							)}
						/>
					</div>
					<CommonPageMain>
						<PickingLines orderInfo={orderInfo} isAuthorized={picking?.status === "AUTHORIZED"} />
					</CommonPageMain>
				</form>
			</CommonPageWrapper>
		</FormProvider>
	);
};
