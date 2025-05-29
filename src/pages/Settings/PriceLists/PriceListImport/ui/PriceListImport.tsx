import { FC, useEffect } from "react";
import { useStore } from "zustand";
import { Link } from "react-router";

import { useUploadPriceListCsv } from "../../api/mutations/useUploadPriceListCsv";

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
import { useGetCsvTemplate } from "@/hooks/useGetCsvTemplate";

const PriceListImport: FC = () => {
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

	// GET TEMPLATE
	const { isLoadingCsvTemplate, getCsvTemplate } = useGetCsvTemplate("PriceListTemplate", orgId);

	// UPLOAD CSV FILE
	const {
		mutate: uploadCsv,
		error: uploadCsvError,
		isError: isUploadCsvError,
		isPending: isUploadCsvPending,
		isSuccess: isUploadCsvSuccess,
	} = useUploadPriceListCsv();

	// GET TEMPLATE
	const handleDownloadTemplate = async () => {
		await getCsvTemplate();
	};

	// UPLOAD CSV FILE
	const handleUploadFile = () => {
		if (orgId && currentFile) {
			const formData = new FormData();
			formData.append("file", currentFile);

			uploadCsv({ organisationId: orgId, body: formData });
		}
	};

	useEffect(() => {
		if (isUploadCsvError || isUploadCsvSuccess) {
			handleClearFile();
		}
	}, [isUploadCsvError, isUploadCsvSuccess, handleClearFile]);

	return (
		<CommonPage>
			<div className="main__container">
				<CommonPageHeader>
					<CommonPageTitle>Import Price List</CommonPageTitle>
					<CommonPageActions>
						<Link to="/settings/general-settings/pricelist-names" className="link link--secondary">
							<svg width="18" height="18" focusable="false" aria-hidden="true">
								<use xlinkHref="/icons/icons.svg#cancel" />
							</svg>
							Cancel
						</Link>
					</CommonPageActions>
				</CommonPageHeader>
				<CommonPageMain isSimple>
					<h2 className="import__title">Step 1</h2>
					<div className="import__top import__top--center">
						<div className="import__card">
							<div className="import__icon">
								<svg width="140" height="140" focusable="false" aria-hidden="true">
									<use xlinkHref="/icons/illustrations.svg#template" />
								</svg>
							</div>
							<h3 className="import__subTitle">Download Template</h3>
							<p className="import__description">Download a blank CSV template to add your price list.</p>
							<Button
								type="button"
								onClick={handleDownloadTemplate}
								disabled={isLoadingCsvTemplate}
								isLoading={isLoadingCsvTemplate}
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
							<p className="import__note">The file name must match the name of the Price List.</p>
							<p className="import__description">
								{currentFile
									? `${currentFile.name}`
									: "Drag and drop a file to upload or click on button to select a file."}
							</p>
							<div className="import__btns">
								<Button type="button" isSecondary onClick={handleFileButton} disabled={isUploadCsvPending}>
									<svg width="18" height="18" focusable="false" aria-hidden="true">
										<use xlinkHref="/icons/icons.svg#import" />
									</svg>
									Select File
								</Button>
								<Button
									type="button"
									onClick={handleUploadFile}
									isLoading={isUploadCsvPending}
									disabled={isUploadCsvPending || !currentFile}
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
						{isUploadCsvError && uploadCsvError && (
							<div className="import__errors">
								<h2 className="import__text">Error</h2>
								<ImportError error={uploadCsvError} />
							</div>
						)}
					</div>
				</CommonPageMain>
			</div>
		</CommonPage>
	);
};

export default PriceListImport;
