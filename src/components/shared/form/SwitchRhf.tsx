import { FieldValues, Path, RegisterOptions, UseFormRegister } from "react-hook-form";

import { Switch, SwitchProps } from "./Switch";

type SwitchRhfProps<TFormValues extends FieldValues> = {
	label: string;
	error?: string;
	name: Path<TFormValues>;
	rules?: RegisterOptions<TFormValues, Path<TFormValues>>;
	register: UseFormRegister<TFormValues>;
} & Omit<SwitchProps, "name">;

export const SwitchRhf = <TFormValues extends FieldValues>({
	name,
	label,
	rules,
	error,
	register,
	...props
}: SwitchRhfProps<TFormValues>) => {
	return <Switch id={name} label={label} error={error} {...props} {...register(name, rules)} />;
};
