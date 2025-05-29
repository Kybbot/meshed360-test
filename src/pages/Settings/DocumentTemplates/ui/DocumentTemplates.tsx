import { FC, MouseEvent, KeyboardEvent, useCallback, useState } from "react";
import { useStore } from "zustand";
import { Link } from "react-router";

import { Template } from "./components/Template";
import { NewDialog } from "./components/NewDialog";
import { DefaultTemplate } from "./components/DefaultTemplate";
import { TemplatesDetails } from "./components/TemplatesDetails";
import { TemplatesSubDetails } from "./components/TemplatesSubDetails";

import { useGetAllTemplates } from "../api";

import { Loader } from "@/components/shared/Loader";
import { ErrorMessage } from "@/components/shared/ErrorMessage";

import {
	CommonPage,
	CommonPageMain,
	CommonPageTitle,
	CommonPageHeader,
	CommonPageWrapper,
	CommonPageActions,
} from "@/components/widgets/Page";

import { orgStore } from "@/app/stores/orgStore";

import { documentTemplates, TemplateTypes } from "@/@types/documentTemplates";

const DocumentTemplates: FC = () => {
	const { orgId } = useStore(orgStore);

	const [newDiaglog, setNewDiaglog] = useState(false);
	const [currentTemplateType, setCurrentTemplateTupe] = useState<TemplateTypes>();

	const { data, error, isLoading, isError, isSuccess } = useGetAllTemplates({
		organisationId: orgId,
	});

	const handlePlusButton = (
		event: MouseEvent<HTMLDivElement> | KeyboardEvent<HTMLDivElement>,
		type: TemplateTypes,
	) => {
		event.stopPropagation();
		setCurrentTemplateTupe(type);
		setNewDiaglog(true);
	};

	const handleClearCurrentTemplateType = useCallback(() => {
		setCurrentTemplateTupe(undefined);
	}, []);

	return (
		<CommonPage>
			<div className="main__container">
				{isLoading ? (
					<Loader isFullWidth />
				) : isError && error ? (
					<ErrorMessage error={error} />
				) : isSuccess && data ? (
					<CommonPageWrapper>
						<CommonPageHeader>
							<CommonPageTitle>Document Templates</CommonPageTitle>
							<CommonPageActions>
								<Link to="/settings/general-settings" className="link">
									Back to Settings
								</Link>
							</CommonPageActions>
						</CommonPageHeader>
						<CommonPageMain isSimple>
							{newDiaglog && currentTemplateType && (
								<NewDialog
									orgId={orgId}
									dialogState={newDiaglog}
									setDialogState={setNewDiaglog}
									currentTemplateType={currentTemplateType}
									handleClearCurrentTemplateType={handleClearCurrentTemplateType}
								/>
							)}
							<TemplatesDetails id="salesCycle" name="Sales Cycle" isOpenValue={false} heightValue="0px">
								{documentTemplates.sales.map((template) => (
									<TemplatesSubDetails
										id={template.id}
										heightValue="0px"
										key={template.id}
										isOpenValue={false}
										name={template.name}
										handlePlusButton={handlePlusButton}
									>
										<DefaultTemplate type={template.id} uploadedTemplates={data[template.id]} />
										{data[template.id]
											? data[template.id].map((item) => <Template key={item.id} item={item} />)
											: null}
									</TemplatesSubDetails>
								))}
							</TemplatesDetails>
							<TemplatesDetails
								heightValue="0px"
								id="purchaseCycle"
								isOpenValue={false}
								name="Purchase Cycle"
							>
								{documentTemplates.purchase.map((template) => (
									<TemplatesSubDetails
										id={template.id}
										heightValue="0px"
										key={template.id}
										isOpenValue={false}
										name={template.name}
										handlePlusButton={handlePlusButton}
									>
										<DefaultTemplate type={template.id} uploadedTemplates={data[template.id]} />
										{data[template.id]
											? data[template.id].map((item) => <Template key={item.id} item={item} />)
											: null}
									</TemplatesSubDetails>
								))}
							</TemplatesDetails>
							<TemplatesDetails id="inventory" name="Inventory" isOpenValue={false} heightValue="0px">
								{documentTemplates.inventory.map((template) => (
									<TemplatesSubDetails
										id={template.id}
										heightValue="0px"
										key={template.id}
										isOpenValue={false}
										name={template.name}
										handlePlusButton={handlePlusButton}
									>
										<DefaultTemplate type={template.id} uploadedTemplates={data[template.id]} />
										{data[template.id]
											? data[template.id].map((item) => <Template key={item.id} item={item} />)
											: null}
									</TemplatesSubDetails>
								))}
							</TemplatesDetails>
							<TemplatesDetails id="production" name="Production" isOpenValue={false} heightValue="0px">
								{documentTemplates.production.map((template) => (
									<TemplatesSubDetails
										id={template.id}
										heightValue="0px"
										key={template.id}
										isOpenValue={false}
										name={template.name}
										handlePlusButton={handlePlusButton}
									>
										<DefaultTemplate type={template.id} uploadedTemplates={data[template.id]} />
										{data[template.id]
											? data[template.id].map((item) => <Template key={item.id} item={item} />)
											: null}
									</TemplatesSubDetails>
								))}
							</TemplatesDetails>
						</CommonPageMain>
					</CommonPageWrapper>
				) : (
					<p className="empty_list">No data available</p>
				)}
			</div>
		</CommonPage>
	);
};

export default DocumentTemplates;
