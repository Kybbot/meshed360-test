import { FC, useEffect, useRef } from "react";
import { useStore } from "zustand";
import { UseFormReturn } from "react-hook-form";
import { useNavigate, useParams } from "react-router";

import { OrderLines } from "./ui/OrderLines";
import { OrderServices } from "./ui/OrderServices";

import { validateData, validateTotalQuantity } from "./utils/validateData";

import {
	DropdownMenu,
	DropdownMenuItem,
	DropdownMenuRoot,
	DropdownMenuTrigger,
} from "@/components/shared/DropdownMenu";
import { Button } from "@/components/shared/Button";

import {
	CommonPageMain,
	CommonPageTitle,
	CommonPageHeader,
	CommonPageStatus,
	CommonPageWrapper,
	CommonPageActions,
	CommonPageSubWrapper,
} from "@/components/widgets/Page";

import { orgStore } from "@/app/stores/orgStore";

import {
	useCreateAssembly,
	useUpdateAssembly,
	useVoidAssemblyOrder,
	useUndoAssemblyOrder,
	getNormalizedAssemblyData,
	useAuthoriseAssemblyOrder,
} from "@/entities/assembly";

import { AssemblyByIdType, AssemblyFormValues } from "@/@types/assembly/assembly";

type Props = {
	assemblyData?: AssemblyByIdType;
	form: UseFormReturn<AssemblyFormValues>;
};

export const Order: FC<Props> = ({ form, assemblyData }) => {
	const navigate = useNavigate();
	const { assemblyId } = useParams();
	const { orgId } = useStore(orgStore);

	const assemblyStatus = assemblyData?.status;

	const formRef = useRef<HTMLFormElement>(null);
	const currentStateRef = useRef<"save" | "authorise">();

	const { mutateAsync: update } = useUpdateAssembly();
	const { mutate: undo, isPending: isUndoPending } = useUndoAssemblyOrder();
	const { mutate: authorise, isPending: isAuthorisePending } = useAuthoriseAssemblyOrder();
	const { mutate: create, data: createData, isSuccess: isCreateSuccess } = useCreateAssembly();
	const { mutate: mutateVoid, isPending: isVoidPending, isSuccess: isSuccessVoid } = useVoidAssemblyOrder();

	const isActionLoading = isUndoPending || isAuthorisePending || isVoidPending;

	const {
		watch,
		control,
		setValue,
		register,
		handleSubmit,
		formState: { errors },
	} = form;

	const product = watch("product");
	const warehouse = watch("warehouse");
	const quantityToProduce = watch("quantity");

	const disabledStatus =
		(assemblyData && assemblyData?.status !== "DRAFT") || !product || !warehouse || !quantityToProduce;
	const disabledActions =
		assemblyData && assemblyData?.status !== "AUTHORISED" && assemblyData?.status !== "DRAFT";

	const handleActions = async (type: "undo" | "void") => {
		if (assemblyId) {
			switch (type) {
				case "undo":
					undo({ body: { id: assemblyId } });
					break;
				case "void":
					mutateVoid({ body: { id: assemblyId } });
					break;
			}
		}
	};

	const onSubmit = async (formData: AssemblyFormValues) => {
		const normalizedData = getNormalizedAssemblyData(formData);

		const isValidData = validateData(formData);
		const isValidTotalQuantity = validateTotalQuantity(formData, quantityToProduce);

		if (assemblyId && isValidData && isValidTotalQuantity) {
			await update({ body: { ...normalizedData, id: assemblyId } });

			if (currentStateRef.current === "authorise") {
				authorise({ body: { id: assemblyId } });
			}
		} else {
			if (orgId && isValidData && isValidTotalQuantity) {
				create({ body: { ...normalizedData, organisationId: orgId } });
			}
		}
	};

	useEffect(() => {
		if (isSuccessVoid) {
			navigate("/production/assembly");
		}
	}, [isSuccessVoid, navigate]);

	useEffect(() => {
		if (isCreateSuccess && createData.data) {
			navigate(`/production/assembly/edit/${createData.data.order.id}`);
		}
	}, [isCreateSuccess, createData, navigate]);

	return (
		<CommonPageWrapper>
			<CommonPageHeader>
				<CommonPageSubWrapper>
					{assemblyData && (
						<CommonPageStatus
							isGreen={assemblyData.status !== "DRAFT"}
							isYellow={assemblyData.status === "DRAFT"}
						>
							{assemblyData.status === "DRAFT" ? "Draft" : "Authorised"}
						</CommonPageStatus>
					)}
					<CommonPageTitle>Order</CommonPageTitle>
				</CommonPageSubWrapper>
				<CommonPageActions>
					{!disabledActions && (
						<DropdownMenuRoot modal={false}>
							<DropdownMenuTrigger asChild>
								<Button type="button" isLoading={isActionLoading} disabled={isActionLoading}>
									<svg width="18" height="18" focusable="false" aria-hidden="true">
										<use xlinkHref="/icons/icons.svg#dotsInCicle" />
									</svg>
									Actions
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenu className="dropDown__content" sideOffset={10} align="end">
								{(!assemblyStatus || assemblyStatus === "DRAFT") && (
									<DropdownMenuItem
										className="dropDown__item"
										onSelect={() => {
											if (formRef.current) {
												currentStateRef.current = "save";
												formRef.current.requestSubmit();
											}
										}}
									>
										Save
									</DropdownMenuItem>
								)}
								{assemblyStatus === "DRAFT" && (
									<DropdownMenuItem
										className="dropDown__item"
										onSelect={() => {
											if (formRef.current) {
												currentStateRef.current = "authorise";
												formRef.current.requestSubmit();
											}
										}}
									>
										Authorise
									</DropdownMenuItem>
								)}
								{assemblyStatus && assemblyStatus !== "CLOSED" && assemblyStatus !== "DRAFT" && (
									<DropdownMenuItem className="dropDown__item" onClick={() => handleActions("undo")}>
										Undo
									</DropdownMenuItem>
								)}
								{assemblyStatus === "DRAFT" && (
									<DropdownMenuItem className="dropDown__item" onClick={() => handleActions("void")}>
										Void
									</DropdownMenuItem>
								)}
							</DropdownMenu>
						</DropdownMenuRoot>
					)}
				</CommonPageActions>
			</CommonPageHeader>
			<CommonPageMain>
				<form
					ref={formRef}
					id="assemblyOrderForm"
					className="commonPage__main"
					onSubmit={handleSubmit(onSubmit)}
				>
					<OrderLines
						errors={errors}
						control={control}
						register={register}
						setValue={setValue}
						warehouse={warehouse}
						disabledStatus={disabledStatus}
						quantityToProduce={quantityToProduce}
					/>
					<OrderServices
						errors={errors}
						control={control}
						register={register}
						setValue={setValue}
						disabledStatus={disabledStatus}
					/>
				</form>
			</CommonPageMain>
		</CommonPageWrapper>
	);
};
