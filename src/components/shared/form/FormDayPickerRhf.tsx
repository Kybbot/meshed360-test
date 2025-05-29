import { Dispatch, forwardRef, SetStateAction } from "react";
import { DayPicker } from "react-day-picker";

import { Popover, PopoverContent, PopoverTrigger } from "../Popover";

import { getFormDayPickerDate } from "@/utils/date";

type FormDayPickerRhfProps = {
	value?: Date;
	error?: string;
	disabled?: boolean;
	placeholder: string;
	disableBefore?: Date;
	btnWrapperClassName?: string;
	onValueChange: Dispatch<SetStateAction<Date | undefined | null>>;
};

type FormDayPickerRhf = HTMLButtonElement;

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const FormDayPickerRhf = forwardRef<FormDayPickerRhf, FormDayPickerRhfProps>(
	(
		{ value, error, disabled, placeholder, disableBefore, btnWrapperClassName, onValueChange },
		forwardedRef,
	) => {
		const hasError = !!error;

		return (
			<Popover>
				<PopoverTrigger asChild>
					<button
						type="button"
						ref={forwardedRef}
						disabled={disabled}
						className={`
							customDayPicker
							${hasError ? "customDayPicker--error" : ""}
							${btnWrapperClassName ? btnWrapperClassName : ""}
						`}
					>
						<div className="customDayPicker__wrapper">
							<span
								className={`customDayPicker__placeholder ${value ? "customDayPicker__placeholder--active" : ""}`}
							>
								{placeholder}
							</span>
							<span className="customDayPicker__value">{getFormDayPickerDate(value)}&#8203;</span>
							<span className="customDayPicker__svg">
								<svg width="24" height="24" focusable="false" aria-hidden="true">
									<use xlinkHref="/icons/icons.svg#calendar" />
								</svg>
							</span>
						</div>
						{hasError && (
							<p role="alert" className="customDayPicker__error">
								{error}
							</p>
						)}
					</button>
				</PopoverTrigger>
				<PopoverContent customClassName="customDayPicker__popover">
					<DayPicker
						classNames={{ root: "customDayPicker__dayPicker" }}
						mode="single"
						formatters={{
							formatWeekdayName(weekday) {
								return daysOfWeek[weekday.getDay()];
							},
						}}
						components={{
							PreviousMonthButton(props) {
								return (
									<button type="button" {...props}>
										<svg width="24" height="24" focusable="false" aria-hidden="true">
											<use xlinkHref="/icons/icons.svg#arrowDown" />
										</svg>
									</button>
								);
							},
							NextMonthButton(props) {
								return (
									<button type="button" {...props}>
										<svg width="24" height="24" focusable="false" aria-hidden="true">
											<use xlinkHref="/icons/icons.svg#arrowDown" />
										</svg>
									</button>
								);
							},
						}}
						showOutsideDays
						selected={value}
						onSelect={(date) => {
							onValueChange(date ?? null);
						}}
						disabled={disableBefore && { before: disableBefore }}
					/>
				</PopoverContent>
			</Popover>
		);
	},
);
