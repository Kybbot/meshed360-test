import { Dispatch, FC, SetStateAction, useEffect } from "react";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";

import { useUpdateUser } from "../../api/mutations/useUpdateUser";

import { Button } from "@/components/shared/Button";
import { InputRhf } from "@/components/shared/form/InputRhf";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { CheckboxRhf } from "@/components/shared/form/CheckboxRhf";
import { FormSelect, SelectItem } from "@/components/shared/form/FormSelect";
import { DialogClose, DialogContent, DialogRoot, DialogTitle } from "@/components/shared/Dialog";

import { useGetRolesName } from "@/entities/roles";

import { UserType } from "@/@types/users";

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

type EditDialogProps = {
	orgId?: string;
	dialogState: boolean;
	currentItem: UserType;
	handleClearCurrentItem: () => void;
	setDialogState: Dispatch<SetStateAction<boolean>>;
};

export const EditDialog: FC<EditDialogProps> = ({
	orgId,
	dialogState,
	currentItem,
	setDialogState,
	handleClearCurrentItem,
}) => {
	const {
		isLoading: isRolesLoading,
		isError: isRolesError,
		isSuccess: isRolesSuccess,
		error: rolesError,
		data: rolesData,
	} = useGetRolesName({ organisationId: orgId });

	const {
		isPending: isUpdateUserPending,
		isSuccess: isUpdateUserSuccess,
		isError: isUpdateUserError,
		error: updateUserError,
		mutate: updateUserMutate,
		reset: resetUpdateUser,
	} = useUpdateUser();

	const {
		control,
		setError,
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormValues>({
		defaultValues: {
			password: "",
			name: currentItem.user.name,
			email: currentItem.user.email,
			roleId: currentItem?.roles?.[0]?.id,
			status: currentItem.user.status === "active",
		},
	});

	const handleCloseModal = () => {
		resetUpdateUser();
		handleClearCurrentItem();
	};

	const onSubmit = (formData: FormValues) => {
		if (currentItem.user.id && orgId) {
			if (formData.password && passwordSchema.safeParse(formData.password).error) {
				const message = passwordSchema.safeParse(formData.password).error?.issues?.[0]?.message || "Required";
				setError("password", { type: "required", message });
			} else {
				updateUserMutate({
					userId: currentItem.user.id,
					body: {
						name: formData.name,
						email: formData.email,
						organisationId: orgId,
						roleIds: [formData.roleId],
						status: formData.status ? "active" : "inactive",
						...(formData.password ? { password: formData.password } : {}),
					},
				});
			}
		}
	};

	useEffect(() => {
		if (isUpdateUserSuccess) {
			handleClearCurrentItem();
			setDialogState(false);
		}
	}, [isUpdateUserSuccess, handleClearCurrentItem, setDialogState]);

	return (
		<DialogRoot open={dialogState} onOpenChange={setDialogState}>
			<DialogContent onInteractOutside={handleCloseModal} onEscapeKeyDown={handleCloseModal}>
				<div className="commonDialog">
					<div className="commonDialog__header">
						<DialogTitle asChild>
							<h3 className="commonDialog__title">Edit User</h3>
						</DialogTitle>
					</div>
					<form className="commonDialog__form" onSubmit={handleSubmit(onSubmit)}>
						<InputRhf<FormValues>
							type="text"
							name="name"
							id="nameId"
							label="Name*"
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
							label="Password"
							isShowPasswordBtn
							autoComplete="new-password"
							register={register}
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
								isLoading={isUpdateUserPending}
								disabled={isUpdateUserPending || isRolesError || isRolesLoading || !orgId}
							>
								<svg width="18" height="18" focusable="false" aria-hidden="true">
									<use xlinkHref="/icons/icons.svg#save" />
								</svg>
								Save
							</Button>
						</div>
						{isRolesError && rolesError && <ErrorMessage error={rolesError} />}
						{isUpdateUserError && updateUserError && <ErrorMessage error={updateUserError} />}
					</form>
				</div>
			</DialogContent>
		</DialogRoot>
	);
};
