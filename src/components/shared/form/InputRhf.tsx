import { FieldValues, Path, RegisterOptions, UseFormRegister } from "react-hook-form";

import { Input, InputProps } from "./Input";

type InputRhfProps<TFormValues extends FieldValues> = {
	label: string;
	name: Path<TFormValues>;
	error?: string;
	rules?: RegisterOptions<TFormValues, Path<TFormValues>>;
	register: UseFormRegister<TFormValues>;
} & Omit<InputProps, "name">;

export const InputRhf = <TFormValues extends FieldValues>({
	name,
	label,
	error,
	rules,
	register,
	...props
}: InputRhfProps<TFormValues>) => {
	return <Input id={name} label={label} error={error} {...props} {...register(name, rules)} />;
};
