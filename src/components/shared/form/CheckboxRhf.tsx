import { FieldValues, Path, RegisterOptions, UseFormRegister } from "react-hook-form";

import { Checkbox, CheckboxProps } from "./Checkbox";

type CheckboxRhfProps<TFormValues extends FieldValues> = {
	label: string;
	name: Path<TFormValues>;
	error?: string;
	rules?: RegisterOptions<TFormValues, Path<TFormValues>>;
	register: UseFormRegister<TFormValues>;
} & Omit<CheckboxProps, "name">;

export const CheckboxRhf = <TFormValues extends FieldValues>({
	name,
	label,
	rules,
	error,
	register,
	...props
}: CheckboxRhfProps<TFormValues>) => {
	return <Checkbox id={name} label={label} error={error} {...props} {...register(name, rules)} />;
};
