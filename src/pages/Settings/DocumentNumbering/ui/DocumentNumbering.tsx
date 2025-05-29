import { FC, useEffect } from "react";
import { useStore } from "zustand";
import { Link } from "react-router";
import { useFieldArray, useForm } from "react-hook-form";

import { useGetAllDocumentNumbering } from "../api/queries/useGetAllDocumentNumbering";
import { useUpdateDocumentNumbering } from "../api/mutations/useUpdateDocumentNumbering";

import { Button } from "@/components/shared/Button";
import { Loader } from "@/components/shared/Loader";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { TableInputRhf } from "@/components/shared/form/TableInputRhf";

import {
	CommonPage,
	CommonPageActions,
	CommonPageHeader,
	CommonPageMain,
	CommonPageTitle,
	CommonPageWrapper,
} from "@/components/widgets/Page";

import { orgStore } from "@/app/stores/orgStore";

import { DocumentNumberingFormValues } from "@/@types/documentNumbering";

const DocumentNumbering: FC = () => {
	const { orgId } = useStore(orgStore);

	const { data, error, isLoading, isError, isSuccess } = useGetAllDocumentNumbering({
		organisationId: orgId,
	});

	const { isPending, mutate } = useUpdateDocumentNumbering();

	const {
		reset,
		control,
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<DocumentNumberingFormValues>({
		defaultValues: {
			arr: [],
		},
	});

	const { fields } = useFieldArray({
		name: "arr",
		control,
	});

	const onSubmit = async (formData: DocumentNumberingFormValues) => {
		if (orgId) {
			mutate({
				organisationId: orgId,
				body: formData.arr,
			});
		}
	};

	useEffect(() => {
		if (isSuccess && data.data) {
			reset({ arr: data.data });
		}
	}, [isSuccess, data, reset]);

	return (
		<CommonPage>
			<div className="main__container">
				{isLoading ? (
					<Loader isFullWidth />
				) : isError && error ? (
					<ErrorMessage error={error} />
				) : isSuccess && data.data ? (
					<CommonPageWrapper>
						<CommonPageHeader>
							<CommonPageTitle>Document Numbering</CommonPageTitle>
							<CommonPageActions>
								<Button type="submit" form="documentNumberingForm" isLoading={isPending} disabled={isPending}>
									<svg width="18" height="18" focusable="false" aria-hidden="true">
										<use xlinkHref="/icons/icons.svg#save" />
									</svg>
									Save
								</Button>
								<Link to="/settings/general-settings" className="link">
									Back to Settings
								</Link>
							</CommonPageActions>
						</CommonPageHeader>
						<CommonPageMain>
							<form id="documentNumberingForm" className="formTable" onSubmit={handleSubmit(onSubmit)}>
								<div className="formTable__row">
									<p className="formTable__header">Document</p>
									<p className="formTable__header">Prefix</p>
									<p className="formTable__header">Next Number</p>
								</div>
								{fields.length > 0 ? (
									<div className="formTable__rows">
										{fields.map((field, index) => {
											return (
												<div className="formTable__row" key={field.id}>
													<div className="formTable__data">
														<p className="formTable__text formTable__text--capitalize">
															{field.type.replaceAll("_", " ")}
														</p>
													</div>
													<div className="formTable__data">
														<TableInputRhf<DocumentNumberingFormValues>
															type="text"
															id="prefixId"
															label="Prefix"
															register={register}
															rules={{
																required: "Required",
															}}
															name={`arr.${index}.prefix`}
															error={errors?.arr?.[index]?.prefix?.message}
														/>
													</div>
													<div className="formTable__data">
														<TableInputRhf<DocumentNumberingFormValues>
															min={1}
															step={0.01}
															type="number"
															id="nextNumberId"
															label="Next NUmber"
															register={register}
															rules={{
																valueAsNumber: true,
																required: "Required",
															}}
															name={`arr.${index}.nextNumber`}
															error={errors?.arr?.[index]?.nextNumber?.message}
														/>
													</div>
												</div>
											);
										})}
									</div>
								) : (
									<p className="formTable__empty">No data available</p>
								)}
							</form>
						</CommonPageMain>
					</CommonPageWrapper>
				) : (
					<p className="empty_list">No data available</p>
				)}
			</div>
		</CommonPage>
	);
};

export default DocumentNumbering;
