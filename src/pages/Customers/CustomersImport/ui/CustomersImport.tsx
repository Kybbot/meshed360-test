import { FC, useEffect, useMemo } from "react";
import { useStore } from "zustand";
import { Link } from "react-router";

import { useUploadContactsCsv } from "../api/mutations/useUploadContactsCsv";
import { useUploadCustomersCsv } from "../api/mutations/useUploadCustomersCsv";
import { useUploadAddressesCsv } from "../api/mutations/useUploadAddressesCsv";

import { Button } from "@/components/shared/Button";
import { ImportError } from "@/components/shared/ImportError";

import {
	CommonPage,
	CommonPageActions,
	CommonPageHeader,
	CommonPageMain,
	CommonPageTitle,
} from "@/components/widgets/Page";

import { orgStore } from "@/app/stores/orgStore";

import { useDropFile } from "@/hooks/useDropFile";
import { useGetExportData } from "@/hooks/useGetCsvData";
import { useGetCsvTemplate } from "@/hooks/useGetCsvTemplate";

type CustomersImportProps = {
	isContacts?: boolean;
	isCustomers?: boolean;
	isAddresses?: boolean;
};

const CustomersImport: FC<CustomersImportProps> = ({ isContacts, isCustomers, isAddresses }) => {
	const { orgId } = useStore(orgStore);

	const [
		fileInputRef,
		dragActive,
		currentFile,
		handleClearFile,
		handleFileButton,
		handleFileChange,
		handleDrag,
		handleDrop,
	] = useDropFile();

	// GET DATA
	const { isLoadingExportData: isCustomersDataFetching, getExportData: getCustomersCsvData } =
		useGetExportData("CustomersData", orgId);
	const { isLoadingExportData: isContactDataFetching, getExportData: getCustomerContactsCsvData } =
		useGetExportData("CustomerContactsData", orgId);
	const { isLoadingExportData: isAddressesDataFetching, getExportData: getCustomerAddressesCsvData } =
		useGetExportData("CustomerAddressesData", orgId);

	// GET TEMPLATES
	const { isLoadingCsvTemplate: isCustomerTemplateFetching, getCsvTemplate: getCustomerCsvTemplate } =
		useGetCsvTemplate("CustomerTemplate");
	const { isLoadingCsvTemplate: isContactTemplateFetching, getCsvTemplate: getCustomerContactCsvTemplate } =
		useGetCsvTemplate("CustomerContactTemplate");
	const { isLoadingCsvTemplate: isAddressesTemplateFetching, getCsvTemplate: getCustomerAddressCsvTemplate } =
		useGetCsvTemplate("CustomerAddressTemplate");

	// UPLOAD CSV FILE
	const {
		mutate: uploadContactsCsv,
		error: uploadContactsCsvError,
		isError: isUploadContactsCsvError,
		isPending: isUploadContactsCsvPending,
		isSuccess: isUploadContactsCsvSuccess,
	} = useUploadContactsCsv();

	const {
		mutate: uploadCustomersCsv,
		error: uploadCustomersCsvError,
		isError: isUploadCustomersCsvError,
		isPending: isUploadCustomersCsvPending,
		isSuccess: isUploadCustomersCsvSuccess,
	} = useUploadCustomersCsv();

	const {
		mutate: uploadAddressesCsv,
		error: uploadAddressesCsvError,
		isError: isUploadAddressesCsvError,
		isPending: isUploadAddressesCsvPending,
		isSuccess: isUploadAddressesCsvSuccess,
	} = useUploadAddressesCsv();

	const currentName = useMemo(() => {
		if (isContacts) return "contacts";
		if (isCustomers) return "customers";
		if (isAddresses) return "addresses";
	}, [isContacts, isCustomers, isAddresses]);

	// GET DATA
	const handleDownloadData = async () => {
		if (isCustomers) {
			await getCustomersCsvData();
		}

		if (isContacts) {
			await getCustomerContactsCsvData();
		}

		if (isAddresses) {
			await getCustomerAddressesCsvData();
		}
	};

	// GET TEMPLATES
	const handleDownloadTemplate = async () => {
		if (isCustomers) {
			await getCustomerCsvTemplate();
		}

		if (isContacts) {
			await getCustomerContactCsvTemplate();
		}

		if (isAddresses) {
			await getCustomerAddressCsvTemplate();
		}
	};

	// UPLOAD CSV FILE
	const handleUploadFile = () => {
		if (orgId && currentFile) {
			const formData = new FormData();
			formData.append("file", currentFile);

			if (isContacts) {
				uploadContactsCsv({ organisationId: orgId, body: formData });
			}

			if (isCustomers) {
				uploadCustomersCsv({ organisationId: orgId, body: formData });
			}

			if (isAddresses) {
				uploadAddressesCsv({ organisationId: orgId, body: formData });
			}
		}
	};

	useEffect(() => {
		if (
			isUploadContactsCsvError ||
			isUploadAddressesCsvError ||
			isUploadCustomersCsvError ||
			isUploadContactsCsvSuccess ||
			isUploadCustomersCsvSuccess ||
			isUploadAddressesCsvSuccess
		) {
			handleClearFile();
		}
	}, [
		isUploadContactsCsvError,
		isUploadCustomersCsvError,
		isUploadAddressesCsvError,
		isUploadContactsCsvSuccess,
		isUploadCustomersCsvSuccess,
		isUploadAddressesCsvSuccess,
		handleClearFile,
	]);

	return (
		<CommonPage>
			<div className="main__container">
				<CommonPageHeader>
					<CommonPageTitle>Import {currentName}</CommonPageTitle>
					<CommonPageActions>
						<Link to="/sales/customers" className="link link--secondary">
							<svg width="18" height="18" focusable="false" aria-hidden="true">
								<use xlinkHref="/icons/icons.svg#cancel" />
							</svg>
							Cancel
						</Link>
					</CommonPageActions>
				</CommonPageHeader>
				<CommonPageMain isSimple>
					<h2 className="import__title">Step 1</h2>
					<div className="import__top">
						<div className="import__card">
							<div className="import__icon">
								<svg width="140" height="140" focusable="false" aria-hidden="true">
									<use xlinkHref="/icons/illustrations.svg#users" />
								</svg>
							</div>
							<h3 className="import__subTitle">Export {currentName}</h3>
							<p className="import__description">
								Download your {currentName} in a CSV file to add or edit {currentName}.
							</p>
							<Button
								type="button"
								onClick={handleDownloadData}
								disabled={isContactDataFetching || isCustomersDataFetching || isAddressesDataFetching}
								isLoading={isContactDataFetching || isCustomersDataFetching || isAddressesDataFetching}
							>
								<svg width="18" height="18" focusable="false" aria-hidden="true">
									<use xlinkHref="/icons/icons.svg#export" />
								</svg>
								Export
							</Button>
						</div>
						<p className="import__or">-OR-</p>
						<div className="import__card">
							<div className="import__icon">
								<svg width="140" height="140" focusable="false" aria-hidden="true">
									<use xlinkHref="/icons/illustrations.svg#template" />
								</svg>
							</div>
							<h3 className="import__subTitle">Download Template</h3>
							<p className="import__description">Download a blank CSV template to add your {currentName}.</p>
							<Button
								type="button"
								onClick={handleDownloadTemplate}
								disabled={
									isContactTemplateFetching || isCustomerTemplateFetching || isAddressesTemplateFetching
								}
								isLoading={
									isContactTemplateFetching || isCustomerTemplateFetching || isAddressesTemplateFetching
								}
							>
								<svg width="18" height="18" focusable="false" aria-hidden="true">
									<use xlinkHref="/icons/icons.svg#export" />
								</svg>
								Download
							</Button>
						</div>
					</div>

					<h2 className="import__title">Step 2</h2>
					<div className="import__bottom">
						<form
							onDrop={handleDrop}
							onDragOver={handleDrag}
							onDragEnter={handleDrag}
							onDragLeave={handleDrag}
							onSubmit={(e) => e.preventDefault()}
							className={`import__card import__card--drop ${dragActive ? "import__card--active" : ""}`}
						>
							<div className="import__icon">
								<svg width="140" height="140" focusable="false" aria-hidden="true">
									<use xlinkHref="/icons/illustrations.svg#upload" />
								</svg>
							</div>
							<h3 className="import__subTitle">Upload File</h3>
							<p className="import__description">
								{currentFile
									? `${currentFile.name}`
									: "Drag and drop a file to upload or click on button to select a file."}
							</p>
							<div className="import__btns">
								<Button
									type="button"
									isSecondary
									onClick={handleFileButton}
									disabled={
										isUploadContactsCsvPending || isUploadCustomersCsvPending || isUploadAddressesCsvPending
									}
								>
									<svg width="18" height="18" focusable="false" aria-hidden="true">
										<use xlinkHref="/icons/icons.svg#import" />
									</svg>
									Select File
								</Button>
								<Button
									type="button"
									onClick={handleUploadFile}
									disabled={
										isUploadContactsCsvPending ||
										isUploadCustomersCsvPending ||
										isUploadAddressesCsvPending ||
										!currentFile
									}
									isLoading={
										isUploadContactsCsvPending || isUploadCustomersCsvPending || isUploadAddressesCsvPending
									}
								>
									<svg width="18" height="18" focusable="false" aria-hidden="true">
										<use xlinkHref="/icons/icons.svg#import" />
									</svg>
									Upload
								</Button>
							</div>

							<input
								type="file"
								name="file"
								id="fileId"
								accept=".csv"
								className="srOnly"
								ref={fileInputRef}
								onChange={handleFileChange}
							/>
						</form>
						{isUploadContactsCsvError && uploadContactsCsvError && (
							<div className="import__errors">
								<h2 className="import__text">Error</h2>
								<ImportError error={uploadContactsCsvError} />
							</div>
						)}
						{isUploadCustomersCsvError && uploadCustomersCsvError && (
							<div className="import__errors">
								<h2 className="import__text">Error</h2>
								<ImportError error={uploadCustomersCsvError} />
							</div>
						)}
						{isUploadAddressesCsvError && uploadAddressesCsvError && (
							<div className="import__errors">
								<h2 className="import__text">Error</h2>
								<ImportError error={uploadAddressesCsvError} />
							</div>
						)}
					</div>
				</CommonPageMain>
			</div>
		</CommonPage>
	);
};

export default CustomersImport;
