import { FieldValues, Path, RegisterOptions, UseFormRegister } from "react-hook-form";

import { Textarea, TextareaProps } from "./Textarea";

type TextareaRhfProps<TFormValues extends FieldValues> = {
	label: string;
	name: Path<TFormValues>;
	error?: string;
	rules?: RegisterOptions<TFormValues, Path<TFormValues>>;
	register: UseFormRegister<TFormValues>;
} & Omit<TextareaProps, "name">;

export const TextareaRhf = <TFormValues extends FieldValues>({
	name,
	label,
	error,
	rules,
	register,
	...props
}: TextareaRhfProps<TFormValues>) => {
	return <Textarea id={name} label={label} error={error} {...props} {...register(name, rules)} />;
};
