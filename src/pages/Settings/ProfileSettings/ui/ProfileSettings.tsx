import { useStore } from "zustand";
import { Link } from "react-router";
import { FC, useEffect } from "react";
import { useForm } from "react-hook-form";
import { orgStore } from "@/app/stores/orgStore";

import { GetProfileSettingsType } from "@/@types/profileSettings";
import { useGetProfileSettings } from "../api/queries/useGetProfileSettings";
import { useUpdateProfileSettings } from "../api/mutations/useUpdateProfileSettings";

import {
	denormalizeProfileSettings,
	normalizeProfileSettings,
} from "../utils/gNormalizedProfileSettingsData";

import { Button } from "@/components/shared/Button";
import { Loader } from "@/components/shared/Loader";
import { ErrorMessage } from "@/components/shared/ErrorMessage";

import {
	CommonPage,
	CommonPageMain,
	CommonPageTitle,
	CommonPageHeader,
	CommonPageActions,
	CommonPageWrapper,
} from "@/components/widgets/Page";
import { InputRhf } from "@/components/shared/form/InputRhf";
import { CheckboxRhf } from "@/components/shared/form/CheckboxRhf";

const ProfileSettings: FC = () => {
	const { orgId } = useStore(orgStore);

	const {
		reset,
		watch,
		setValue,
		register,
		getValues,
		handleSubmit,
		formState: { errors },
	} = useForm<GetProfileSettingsType>({
		defaultValues: {
			name: "",
			legalTradingName: "",
			registrationNumber: "",
			vatNumber: "",
			contactNumber: "",
			fax: "",
			email: "",
			baseCurrency: "",
			physicalAddress: {
				street: "",
				city: "",
				state: "",
				country: "",
				isDefault: false,
			},
			postalAddress: {
				street: "",
				city: "",
				state: "",
				country: "",
				isDefault: false,
			},
		},
	});

	const { data, isLoading, isError, error, isSuccess, refetch } = useGetProfileSettings({
		organisationId: orgId,
	});
	const { mutate: updateProfileSettings, isPending } = useUpdateProfileSettings({ organisationId: orgId });

	const onSubmit = (formData: GetProfileSettingsType) => {
		const data = normalizeProfileSettings(formData);

		if (!data.physicalAddress) {
			setValue("physicalAddress.isDefault", false);
		}
		if (!data.postalAddress) {
			setValue("postalAddress.isDefault", false);
		}
		updateProfileSettings({ body: data });
	};

	const handleChangeCheckbox = (
		values: GetProfileSettingsType,
		addressKey: "physicalAddress" | "postalAddress",
		checked: boolean,
	) => {
		updateProfileSettings({
			body: normalizeProfileSettings({
				...values,
				[addressKey]: {
					...values[addressKey],
					isDefault: checked,
				},
			}),
		});
	};

	useEffect(() => {
		if (isSuccess && data?.data) {
			reset(denormalizeProfileSettings(data.data), { keepDefaultValues: true });
		}
	}, [isSuccess, data, reset]);

	return (
		<CommonPage>
			<div className="main__container">
				<CommonPageWrapper>
					{isLoading ? (
						<Loader isFullWidth />
					) : isError && error ? (
						<ErrorMessage error={error} />
					) : isSuccess && data.data ? (
						<>
							<CommonPageHeader>
								<CommonPageTitle>Profile Settings</CommonPageTitle>
								<CommonPageActions>
									<Button
										isSecondary
										type="button"
										onClick={async () => {
											const newData = await refetch();
											if (newData.data?.data) {
												reset(denormalizeProfileSettings(newData.data.data), { keepDefaultValues: true });
											}
										}}
									>
										<svg width="18" height="18">
											<use xlinkHref="/icons/icons.svg#cancel" />
										</svg>
										Cancel
									</Button>
									<Button type="submit" form="ProfileSettingsFrom" isLoading={isPending} disabled={isPending}>
										<svg width="18" height="18">
											<use xlinkHref="/icons/icons.svg#save" />
										</svg>
										Save
									</Button>
									<Link to="/settings/general-settings" className="link">
										Back to Settings
									</Link>
								</CommonPageActions>
							</CommonPageHeader>
							<CommonPageMain isSimple>
								<form
									className="profileForm__form"
									id="ProfileSettingsFrom"
									onSubmit={handleSubmit(onSubmit)}
								>
									<fieldset className="form__fieldset">
										<legend className="form__legend">Profile</legend>
										<InputRhf<GetProfileSettingsType>
											type="text"
											id="nameId"
											name="name"
											label="Name*"
											register={register}
											rules={{
												required: "Required",
											}}
											error={errors.name?.message}
										/>
										<InputRhf<GetProfileSettingsType>
											type="text"
											id="legalTradingNameId"
											name="legalTradingName"
											label="Legal Trading Name*"
											register={register}
											rules={{ required: "Required" }}
											error={errors.legalTradingName?.message}
										/>
										<InputRhf<GetProfileSettingsType>
											type="text"
											id="registrationNumberId"
											name="registrationNumber"
											label="Registration Number"
											register={register}
											error={errors.registrationNumber?.message}
										/>
										<InputRhf<GetProfileSettingsType>
											type="text"
											id="vatNumberId"
											name="vatNumber"
											label="VAT Number*"
											register={register}
											rules={{ required: "Required" }}
											error={errors.vatNumber?.message}
										/>
									</fieldset>
									<fieldset className="form__fieldset">
										<legend className="form__legend">&#8203;</legend>
										<InputRhf<GetProfileSettingsType>
											type="text"
											id="contactNumberId"
											name="contactNumber"
											label="Contact Number"
											register={register}
											error={errors.contactNumber?.message}
										/>
										<InputRhf<GetProfileSettingsType>
											type="text"
											id="faxId"
											name="fax"
											label="Fax"
											register={register}
											error={errors.fax?.message}
										/>
										<InputRhf<GetProfileSettingsType>
											type="email"
											name="email"
											id="emailId"
											label="Email"
											register={register}
											autoComplete="email"
											error={errors.email?.message}
										/>
										<InputRhf<GetProfileSettingsType>
											disabled
											type="text"
											name="baseCurrency"
											id="baseCurrencyId"
											label="Base Currency"
											register={register}
											error={errors.baseCurrency?.message}
										/>
									</fieldset>
									<fieldset className="form__fieldset">
										<legend className="form__legend">Physical Address</legend>
										<InputRhf<GetProfileSettingsType>
											type="text"
											id="physicalStreetId"
											name="physicalAddress.street"
											label="Street"
											register={register}
											error={errors.physicalAddress?.street?.message}
										/>
										<InputRhf<GetProfileSettingsType>
											type="text"
											id="physicalCityId"
											name="physicalAddress.city"
											label="City/Town"
											register={register}
											error={errors.physicalAddress?.city?.message}
										/>
										<InputRhf<GetProfileSettingsType>
											type="text"
											id="physicalStateId"
											name="physicalAddress.state"
											label="State/Region"
											register={register}
											error={errors.physicalAddress?.state?.message}
										/>
										<InputRhf<GetProfileSettingsType>
											type="text"
											id="physicalCountryId"
											name="physicalAddress.country"
											label="Country"
											register={register}
											error={errors.physicalAddress?.country?.message}
										/>
										<CheckboxRhf<GetProfileSettingsType>
											register={register}
											name="physicalAddress.isDefault"
											id="physicalAddressDefaultId"
											label="Default"
											disabled={
												!watch("physicalAddress.street") &&
												!watch("physicalAddress.city") &&
												!watch("physicalAddress.state") &&
												!watch("physicalAddress.country")
											}
											rules={{
												onChange(event) {
													handleChangeCheckbox(getValues(), "physicalAddress", event.target.checked);
												},
											}}
											error={errors.physicalAddress?.isDefault?.message}
										/>
									</fieldset>
									<fieldset className="form__fieldset">
										<legend className="form__legend">Postal Address</legend>
										<InputRhf<GetProfileSettingsType>
											type="text"
											id="postalStreetId"
											name="postalAddress.street"
											label="Street"
											register={register}
											error={errors.postalAddress?.street?.message}
										/>
										<InputRhf<GetProfileSettingsType>
											type="text"
											id="postalCityId"
											name="postalAddress.city"
											label="City/Town"
											register={register}
											error={errors.postalAddress?.city?.message}
										/>
										<InputRhf<GetProfileSettingsType>
											type="text"
											id="postalStateId"
											name="postalAddress.state"
											label="State/Region"
											register={register}
											error={errors.postalAddress?.state?.message}
										/>
										<InputRhf<GetProfileSettingsType>
											type="text"
											id="postalCountryId"
											name="postalAddress.country"
											label="Country"
											register={register}
											error={errors.postalAddress?.country?.message}
										/>
										<CheckboxRhf<GetProfileSettingsType>
											register={register}
											name="postalAddress.isDefault"
											id="postalDefaultId"
											label="Default"
											disabled={
												!watch("postalAddress.street") &&
												!watch("postalAddress.city") &&
												!watch("postalAddress.state") &&
												!watch("postalAddress.country")
											}
											rules={{
												onChange(event) {
													handleChangeCheckbox(getValues(), "postalAddress", event.target.checked);
												},
											}}
											error={errors.postalAddress?.isDefault?.message}
										/>
									</fieldset>
								</form>
							</CommonPageMain>
						</>
					) : (
						<p className="empty_list">No data available</p>
					)}
				</CommonPageWrapper>
			</div>
		</CommonPage>
	);
};

export default ProfileSettings;
