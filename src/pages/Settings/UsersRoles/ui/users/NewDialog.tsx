import { Dispatch, FC, SetStateAction, useEffect } from "react";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";

import { useCreateUser } from "../../api/mutations/useCreateUser";

import {
	DialogClose,
	DialogContent,
	DialogRoot,
	DialogTitle,
	DialogTrigger,
} from "@/components/shared/Dialog";
import { Button } from "@/components/shared/Button";
import { InputRhf } from "@/components/shared/form/InputRhf";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { CheckboxRhf } from "@/components/shared/form/CheckboxRhf";
import { FormSelect, SelectItem } from "@/components/shared/form/FormSelect";

import { useGetRolesName } from "@/entities/roles";

type FormValues = { name: string; roleId: string; status: boolean; email: string; password: string };

const passwordSchema = z
	.string()
	.min(6, { message: "Password must be at least 6 characters long" })
	.refine(
		(password) => {
			const hasTwoDigits = (password.match(/\d/g) || []).length >= 2;
			const hasUpperCase = /[A-Z]/.test(password);
			const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

			return hasTwoDigits && hasUpperCase && hasSpecialChar;
		},
		{ message: "Password must contain at least 2 digits, 1 uppercase letter, and 1 special character." },
	);

type NewDialogProps = {
	orgId?: string;
	dialogState: boolean;
	setDialogState: Dispatch<SetStateAction<boolean>>;
};

export const NewDialog: FC<NewDialogProps> = ({ orgId, dialogState, setDialogState }) => {
	const {
		isLoading: isRolesLoading,
		isError: isRolesError,
		isSuccess: isRolesSuccess,
		error: rolesError,
		data: rolesData,
	} = useGetRolesName({ organisationId: orgId });

	const {
		isPending: isCreateUserPending,
		isSuccess: isCreateUserSuccess,
		isError: isCreateUserError,
		error: createUserError,
		mutate: createUserMutate,
		reset: resetCreateUser,
	} = useCreateUser();

	const {
		reset,
		control,
		setError,
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormValues>({
		defaultValues: {
			name: "",
			email: "",
			password: "",
			roleId: "",
			status: true,
		},
	});

	const handleCloseModal = () => {
		reset();
		resetCreateUser();
	};

	const onSubmit = (formData: FormValues) => {
		if (orgId) {
			if (!passwordSchema.safeParse(formData.password).error) {
				createUserMutate({
					body: {
						name: formData.name,
						email: formData.email,
						organisationId: orgId,
						password: formData.password,
						roleIds: [formData.roleId],
						status: formData.status ? "active" : "inactive",
					},
				});
			} else {
				const message = passwordSchema.safeParse(formData.password).error?.issues?.[0]?.message || "Required";
				setError("password", { type: "required", message });
			}
		}
	};

	useEffect(() => {
		if (isCreateUserSuccess) {
			reset();
			setDialogState(false);
		}
	}, [isCreateUserSuccess, reset, setDialogState]);

	return (
		<DialogRoot open={dialogState} onOpenChange={setDialogState}>
			<DialogTrigger asChild>
				<Button type="button" disabled={!orgId}>
					<svg width="18" height="18" focusable="false" aria-hidden="true">
						<use xlinkHref="/icons/icons.svg#plus" />
					</svg>
					Add
				</Button>
			</DialogTrigger>
			<DialogContent onInteractOutside={handleCloseModal} onEscapeKeyDown={handleCloseModal}>
				<div className="commonDialog">
					<div className="commonDialog__header">
						<DialogTitle asChild>
							<h3 className="commonDialog__title">Add New User</h3>
						</DialogTitle>
					</div>
					<form className="commonDialog__form" onSubmit={handleSubmit(onSubmit)}>
						<InputRhf<FormValues>
							type="text"
							name="name"
							id="nameId"
							label="Name*"
							autoComplete="given-name"
							register={register}
							rules={{
								required: "Required",
							}}
							error={errors.name?.message}
						/>

						<InputRhf<FormValues>
							type="email"
							name="email"
							id="emailId"
							autoComplete="email"
							label="Email address*"
							register={register}
							rules={{
								required: "Required",
							}}
							error={errors.email?.message}
						/>

						<InputRhf<FormValues>
							type="password"
							name="password"
							id="passwordId"
							label="Password*"
							isShowPasswordBtn
							autoComplete="new-password"
							register={register}
							rules={{
								required: "Required",
							}}
							error={errors.password?.message}
						/>

						<Controller
							name="roleId"
							control={control}
							rules={{
								required: "Required",
							}}
							render={({ field }) => (
								<FormSelect
									{...field}
									id="roleId"
									usePortal1
									value={field.value}
									placeholder="User Role*"
									isLoading={isRolesLoading}
									error={errors.roleId?.message}
									disabled={isRolesLoading || isRolesError}
									onValueChange={field.onChange}
								>
									{isRolesSuccess &&
										rolesData.data.map((role) => (
											<SelectItem key={role.id} value={role.id}>
												{role.name}
											</SelectItem>
										))}
								</FormSelect>
							)}
						/>

						<CheckboxRhf<FormValues>
							name="status"
							id="isActiveId"
							label="Is Active"
							register={register}
							error={errors.status?.message}
						/>

						<div className="commonDialog__btns">
							<DialogClose asChild>
								<Button type="button" isSecondary onClick={handleCloseModal}>
									<svg width="18" height="18" focusable="false" aria-hidden="true">
										<use xlinkHref="/icons/icons.svg#cancel" />
									</svg>
									Cancel
								</Button>
							</DialogClose>
							<Button
								type="submit"
								isLoading={isCreateUserPending}
								disabled={isCreateUserPending || isRolesError || isRolesLoading}
							>
								<svg width="18" height="18" focusable="false" aria-hidden="true">
									<use xlinkHref="/icons/icons.svg#save" />
								</svg>
								Save
							</Button>
						</div>
						{isRolesError && rolesError && <ErrorMessage error={rolesError} />}
						{isCreateUserError && createUserError && <ErrorMessage error={createUserError} />}
					</form>
				</div>
			</DialogContent>
		</DialogRoot>
	);
};
