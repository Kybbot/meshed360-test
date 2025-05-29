import { FC, useEffect } from "react";
import { useStore } from "zustand";
import { useForm } from "react-hook-form";

import { useLogin } from "../api/useLogin";

import { Button } from "@/components/shared/Button";
import { InputRhf } from "@/components/shared/form/InputRhf";
import { ErrorMessage } from "@/components/shared/ErrorMessage";

import { authStore } from "@/app/stores/authStore";

type FormValues = {
	email: string;
	password: string;
};

export const LoginForm: FC = () => {
	const setLoggedIn = useStore(authStore, (state) => state.setLoggedIn);

	const { isSuccess, isPending, isError, error, data, mutate } = useLogin();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormValues>({
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit = (formData: FormValues) => {
		mutate({ body: formData });
	};

	useEffect(() => {
		if (isSuccess && data.data.accessToken && data.data.refreshToken) {
			localStorage.setItem("accessToken", data.data.accessToken);
			localStorage.setItem("refreshToken", data.data.refreshToken);

			setLoggedIn(true);
		}
	}, [isSuccess, data, setLoggedIn]);

	return (
		<form className="loginForm" onSubmit={handleSubmit(onSubmit)}>
			<img
				width={198}
				height={122}
				src="/imgs/logo.png"
				className="loginForm__img"
				srcSet="/imgs/logo@2x.png 2x"
				alt="Meshed360 evolving enterprise | expanding excellence"
			/>

			<h1 className="loginForm__title">Login</h1>

			<div className="loginForm__inputs">
				<InputRhf<FormValues>
					type="email"
					name="email"
					id="emailId"
					autoComplete="email"
					label="Username or Email*"
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
					autoComplete="current-password"
					register={register}
					rules={{
						required: "Required",
					}}
					error={errors.password?.message}
				/>
			</div>

			<Button type="submit" className="loginForm__btn" isLoading={isPending} disabled={isPending}>
				Login
			</Button>
			{isError && <ErrorMessage useTopMargin error={error} />}
		</form>
	);
};
