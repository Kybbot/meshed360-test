import { FieldValues, Path, RegisterOptions, UseFormRegister } from "react-hook-form";

import { TableInput, TableInputProps } from "./TableInput";

type TableInputRhfProps<TFormValues extends FieldValues> = {
	label: string;
	name: Path<TFormValues>;
	error?: string;
	rules?: RegisterOptions<TFormValues, Path<TFormValues>>;
	register: UseFormRegister<TFormValues>;
	disabled?: boolean;
} & Omit<TableInputProps, "name">;

export const TableInputRhf = <TFormValues extends FieldValues>({
	name,
	label,
	error,
	rules,
	register,
	disabled,
	...props
}: TableInputRhfProps<TFormValues>) => {
	return (
		<TableInput
			id={name}
			label={label}
			error={error}
			{...props}
			{...register(name, rules)}
			disabled={disabled}
		/>
	);
};
