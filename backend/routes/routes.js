// import express
import express from "express";

import {
	  UpdateUAT,
} from "../controllers/UATregression.js";



//import from batchActions controller
import{
  showAllBatchActions
}from "../controllers/batchActions.js"

import{
  showAllTags
}from "../controllers/tags.js"
// import function from controller
import {
  showAllOrganization,
  showOrganizationById,
  createOrganization,
  updateOrganization,
  deleteOrganization,
  showLatestOrgId,
} from "../controllers/organizations.js";

import {
  showAllSubOrganization,
  showSubOrganizationBySubOrgId,
  showSubOrganizationByOrgId,
  createSubOrganization,
  updateSubOrganization,
  deleteSubOrganization,
  showLatestSuborgId,
  getSuborgForEmail,
  showMultipleSubOrganizationByOrgId,
} from "../controllers/subOrganizations.js";

import {
  showAllIndividual,
  showAllCoach,
  showIndividualById,
  showSingleIndividualById,
  showIndividualByEmail,
  showAllIndividualByIndGroupOrgSuborg,
  showAllIndividualByIndGroupOrgSuborgProgram,
  showAllIndividualByIndGroupOrgSuborgProgramIteration,
  showAllIndividualByIndGroup,
  createIndividual,
  updateIndividual,
  updateIndividualProgramIterationByIndGroup,
  updateIndividualStreamGroupByIndGroup,
  updateIndividualName,
  deleteIndividual,
  updateIndividualEmail,
  updateIndividualPassword,
  updateIndividualSuppressEmailSending,
  createIndividualMakeNomination,
  showAllIndividualByOrgId,
  showIndividualEmailExist,
  showEmailDetailsById,
  showAllIndividualByIndGroupOrg,
  createIndividualAndProgram,
  updateindividualTimezone,
  showIndividualDetailsFromIndGroup,
  showSitemanagerEmails,
  checkUserLoggedIn,
  updateUserLoggedIn,

} from "../controllers/individuals.js";

import {
  showAllProgram,
  showProgramById,
  createProgram,
  updateProgram,
  deleteProgram,
  showSuborgPrograms,
} from "../controllers/programs.js";

import {
  showAllIteration,
  showIterationById,
  showIterationByProgramId,
  createIteration,
  updateIteration,
  updateIterationFinalDeadlineDate,
  deleteIteration,
  showProgramIterations,
  getIterationFinalDeadlineDateById,
} from "../controllers/iterations.js";

import {
  showAllIterationLog,
  createIterationLog,
  showIterationLogByIterationId
} from "../controllers/iterationLogs.js";

import {
  showAllStream,
  showStreamById,
  showStreamByIterationId,
  createStream,
  updateStream,
  deleteStream,
  showIterationStreams,
} from "../controllers/streams.js";

import {
  showAllGroup,
  showGroupById,
  showGroupByStreamId,
  createGroup,
  updateGroup,
  deleteGroup,
} from "../controllers/groups.js";

import {
  showEmailTemplateByIds,
  showSingleEmailTemplateByIds,
  showSingleEmailTemplateForNomminationByIds,
  createEmailTemplate,
  deleteEmailTemplate,
  updateEmailTemplate,
} from "../controllers/emailTemplate.js";

import { showAllRole,
showRoleById, getAllRespondents } from "../controllers/roles.js";

import { 
  showAllBrand,
  showAllBrandWithSuborgByOrg,
  getBrandMaxLimitByOrgId,
  createBrandByOrg,
  updateBrandById,
  showBrandByDomain
} from "../controllers/brands.js";

import { authResultIndividual, authResultLastLogin, logResetPassword, generateResult2FACode, getResult2FAcode} from "../controllers/auths.js";

import { 
  showAllSurveyTemplates,
  showOrgSurveyTemplates,
  createSurveyTemplate,
  deleteSurveyTemplate,
  updateSurveyTemplate,
  showAllTemplates,
  showSurveyTemplateName,
  showAllDataSurveyTemplates,
  getPrepolupateEndpointTemplates,
  getCalculateEndpointTemplates,
  showSurveyTemplateBySurveyTemplateId,
  getSurveyTemplateBySurveyTemplateName,
  updateNomineeSuveytemplateId,
  getSurveyTemplateByVersion,
  checkExistSurveyTemplateByName
} from '../controllers/surveyTemplates.js';

import { 
  updateSurveyAssignmentDatesAndTime,
  createSurveyAssignment,
  showAllSurveyAssignment,
  showSingleSurveyAssignmentById,
  showSingleActiveRemindersById,
  updateStmtAnswerByAssignmentId,
  viewOneSurveyAssignmentById,
  showAllSurveyAssignmentbyIndID,
  showNominationsData,
  showNomineeData,
  updateSharedReport,
  showSurveyAssignmentNominees,
  viewSurveyAssignmentByOrgAndSuborg,
  viewSurveyAssignmentByOrg,
  viewSurveyAssignmentBySurveyAssignmentId,
  viewParticipantNameBySurveyAssignmentId,
  updateCoachGrantedByAssignmentId,
  updateCoachGroupGrantedByAssignmentId,
  updateHrGrantedByAssignmentId,
  updateNumberofRespondentsByAssignmentId,
  updateEmail,
  updateRelationshipId,
  UpdateChangeGroupNamebyID,
  UpdateStreamNamebyID,
  UpdateIterationNamebyID,
  UpdateProgramNamebyID,
  UpdateSubOrgNamebyID,
  UpdateDropandUndropbyID,
  UpdateSubmitSurveybyID,
  UpdateCoachNameByID,
  showSurveyAssignmentTag,
  showSingleSurveyAssignmentByEmailAndParentID,
  viewSurveyAssignmentByOrgAndSuborgAndProgram,
  viewSurveyAssignmentByOrgAndSuborgAndProgramAndIteration,
  viewSurveyAssignmentByOrgAndSuborgAndProgramAndIterationAndStream,
  viewSurveyAssignmentByOrgSuborgProgramIterationStreamSurveyTemplate,
  viewSurveyAssignmentByOrgSuborgProgramIterationSurveyTemplate,
  viewSurveyAssignmentByOrgSuborgProgramSurveyTemplate,
  viewSurveyAssignmentByOrgSuborgSurveyTemplate,
  updateCoachPermissionStatus,
  updateSurveyOpenedStatusBySurveyAssignmentId,
  updateCompleteSurveyStatusBySurveyAssignmentId,
  updateNoDuplicateStatusBySurveyAssignmentId,
  updateCompleteCalcualtionBySurveyAssignmentId,
  changeSuborgByParentSurveyAssignmentId,
  changeProgramByParentSurveyAssignmentId,
  changeIterationByParentSurveyAssignmentId,
  changeStreamByParentSurveyAssignmentId,
  changeGroupByParentSurveyAssignmentId,
  showSurveyStatisticsByIteration,
  showSurveyStatisticsByIterationAndTemplate,
  viewClientSurveyAssignmentByOrg,
  viewClientSurveyAssignmentByOrgAndSuborg,
  viewClientSurveyAssignmentByOrgAndSuborgAndProgram,
  viewClientSurveyAssignmentByOrgAndSuborgAndProgramAndIteration,
  viewClientSurveyAssignmentByOrgAndSuborgAndProgramAndIterationAndStream,
  viewClientSurveyAssignmentByOrgSuborgProgramIterationStreamSurveyTemplate,
  viewClientSurveyAssignmentByOrgSuborgProgramIterationSurveyTemplate,
  viewClientSurveyAssignmentByOrgSuborgProgramSurveyTemplate,
  viewClientSurveyAssignmentByOrgSuborgSurveyTemplate,
  getDataforCreatingCSV,
  getRailroadStatus,
  updateRailroadStatus,
  changeRecipentEmailByIndId,
  getEarliestFinalDeadlineDateByIterationId,
  updateIsPdfAvailableBySurveyAssignmentId,
  updateSurveyPdfAvailable
} from '../controllers/surveyAssignments.js';

import {
  showAllSurveyResult,
  showSurveyResultByStamentNum,
  createSurveyResult,
  updateSurveyResult,
  deleteSurveyResult,
  showReOrderResult,
  showSexAndCountry,
  calculateSurveyResult,
  populateBig5,
  populateTeamLeaderParticipant,
  populateTeamLeaderNominee,
  populateGeneralManagerParticipant,
  populateGeneralManagerNominee,
  populateSeniorExecParticipant,
  populateSeniorExecNominee,
  populateTalentsagePaticipant,
  populateTalentsageNominee,
  showEmptyAnswerCount,
  showDuplicateAnswer,
  deleteDuplicateSurveyResult,
  populateHelpPaticipant,
  populateHelpNominee,
  prePopulateSurveyConfirmation,
  populateEuroNavPaticipant,
  populateEuroNavNominee,
  populateSurveyQsort,
  populateSurveyVFP,
  surveyBuilderPrepopulate,
} from "../controllers/surveyResults.js";

import {
  showAllSendEmail,
  createSendEmail,
  updateSendEmailBySurveyAssignmentId,
  sendEmailWebhook,
  viewSendEmailByIndId,
  viewSendEmailBySendTo
} from "../controllers/sendemail.js";


import {
  showSurveyActiveMessageById,
  getParticipantReportsById,
  getCoachReportsById,
  getNotEligible360,
  showParticipantReportsByIdAdmin,
  showCoachReportsByIdAdmin,
  getFacultyReportsById,
} from "../controllers/surveyActiveMessage.js";

import {
  showAllSurveyTemplateAssociation,
  showSurveyTemplateAssociationById,
  showSurveyTemplateAssociationByOrgId,
  showSurveyTemplateAssociationBySuborgId,
  showSurveyUrlByOrgIdSurveyTemplateIdSuborgId,
  createSurveyTemplateAssociation,
  updateSurveyTemplateAssociation,
  deleteSurveyTemplateAssociation,
  deleteSurveyTemplateAssociationByOrgAndSuborg,
  deleteSurveyTemplateAssociationBySuborg,
} from "../controllers/surveyTemplateAssociations.js";

import {
  showAllRelationships
} from '../controllers/relationships.js'

import {
  seedTag,
} from "../controllers/seed.js";

import { 
  showSharingTags,
  createSurveyAssignmentTag,
  removeTagBySurveyAssignmentId
} from "../controllers/surveyAssignmentTags.js";

import { 
  createSurveyResultNote,
  showAllSurveyResultNoteBySurveyIdAndSectionAndResolvedStatus,
  updateSurveyResultNote,
  updateSurveyResultNoteResolvedStatus
} from "../controllers/surveyResultNote.js";

import {
  processScheduledEmail,
  getScheduledSurveys,
  getScheduledSurveys1,					   
  getScheduledSurveys2,
  getScheduledSurveys3,
  getScheduledParticipantReport,		
  getScheduledParticipantReportByNeverRunIteration,						
  getETSubjectBody,
  getTokenValues,
  getEmailTemplateByTemplateType,
  scheduledEmailSending,						
  scheduledSurveyReminder,
  scheduledSurveyReminder2,
  scheduledSurveyReminder3,
  scheduledEmailParticipantReport,
  scheduledEmailCoachReport,
  getSingleSurveyAssignmentSubmitted,
  submitSurveyEmail,
  getScheduledCoachReport,
  getTimeZone,
} from "../controllers/sendscheduledemail.js";
import { updateIndividualSuppressEmailSendingById } from "../models/Individual.js";

import {
  b5Delete,
  b5Delete2,
  b5GetFinalDeadline,
  b5NormRawInsert,
  b5CohortInsert,
  b5Processing2,
  b5ReportData,
  b5ReportData2,
  b5CoachReportData,
  b5GetDuplicateStatement1,
  b5DeleteDuplicateStatement2,
  b5DeleteSubtraitSupertrait3,
  b5DeleteSubtraitSupertrait3a,
  b5GetSubmittedSurvey4,
  b5InsertSubtrait6,
  b5GetSurveyResult,
  b5InsertSurveyResultTraits,
  b5SurveyResultReprocessing,
  b5SurveyResultReprocessing2,
  b5FacultyReportData,
  b5GetSurveyAssignmentForSRReprocessing,		
  b5GetCountries,					 
} from "../controllers/big5.js";

import {
  R360Delete,
  R360Delete2,
  R360GetFinalDeadline,
  R360RawInsert,
  R360CohortInsert,
  R360Processing2,
  R360ReportData2,
  R360GenerateData,
  R360ReportData2a,
  R360ReportData2b,
  R360ReportData2c,
  R360Processing3,
  R360RawInsert3,		 
  R360CoachReportData,
  R360CoachReportData2c,
  R360FacultyReportData,
  R360Histogram1,
  R360HistogramPerSA, //2024-01-09 per participant survey_assignment_id
  R360HistogramReportEndpoint,
  R360HistogramReportEndpointFaculty,
  updateR360RawRelationship,
} from "../controllers/R360.js";

import {
  Get360SurveyResult,
  teamLeaderInsertSurveyResultTraits,
  teamLeaderSurveyResultReprocessing,
  generalManagerInsertSurveyResultTraits,
  generalManagerSurveyResultReprocessing,
  seniorExecProgramInsertSurveyResultTraits,
  seniorExecProgramSurveyResultReprocessing,
  talentsageInsertSurveyResultTraits,
  talentsageSurveyResultReprocessing,
  generalManagerInsertRawCalc,
  generalManagerCalculation,
  teamLeaderInsertRawCalc,
  teamLeaderCalculation,
  seniorExecProgramInsertRawCalc,
  seniorExecProgramCalculation,
  talentSageInsertRawCalc,
  talentSageCalculation,
  helpInsertRawCalc,
  helpCalculation,
  euroNavInsertRawCalc,
  euroNavCalculation,
  forceCalulation360, //do not use
  delete360Raw,
  surveyBuilderCalc,
  calculate360,
  smartCollabCalc, // USED ONLY FOR SMART COLLAB ORG
  calculateSmartCollab360, // USED ONLY FOR SMART COLLAB ORG
  reCalculate360Raw //? RE RUN SURVEY CREATED IN SURVEY BUILDER
} from "../controllers/process360Calc.js";

import {
  GetBig5SurveyResult,
  big5InsertSurveyResultTraits,
  big5SurveyResultReprocessing,
  big5InsertRawCalc,
  big5Calculation,
  getAllSurveyAssignmentBig5,
  deleteBig5Raw,
  big5InsertRawCalcModified,
  modifiedBig5Calculation,
  big5UpdateSurveyResult,
  updateSurveyResultBig5,
} from "../controllers/processBig5Calc.js"

import {
  getQsortSurveyResults,
  deleteQsortRaw,
  insertQsortRawCalc,
  qsortCalculation,
  getQsortRaw,
  getQsortReportData,
  getQsortCoachReportData,
  getQsortCoefficientCorrelation,
} from "../controllers/processQsortCalc.js"

import {
  getVFPSurveyResults,
  deleteVFPRaw,
  insertVFPRawCalc,
  vfpCalculations,
} from "../controllers/processVFPCalc.js";

import {
  deleteBig5Cohort,
  getBig5FinalDeadlineDate,
  insertBig5Cohort,
  big5CohortProcessing,
  forceDeleteBig5Cohort,
  forceGetBig5IterationList,
  forceBig5CohortProcessing,
} from "../controllers/big5CohortProcessing.js"

import {
  CalculateParticipant,
  CalculateParticipantSelectScores,
  CalculateParticipantInsert,
  delete360Cohort,
  get360FinalDeadlineDate,
  updateIsProcessed,
  generate360Data,
  insert360Cohort,
  c360CohortProcessing,
  forceDelete360Cohort,
  forceUpdateIsProcessed,
  forceGet360IterationList,
  force360CohortProcessing,
  forceGenerate360Data,
  forceInsert360Cohort,
  delete360CohortPriorDays, //2024-01-09
  updateIsProcessedByIteration, //2024-01-09
  priorDays360CohortProcessing, //2024-01-09
  forceGenerateInsert360Data //2024-01-12
} from "../controllers/360CohortProcessing.js"

import {
  deleteQsortCohort,
  getQsortFinalDeadlineDate,
  insertQsortCohort,
  qsortCohortProcessing,
  forceDeleteQsortCohort,
  forceGetQsortIterationList,
  forceQsortCohortProcessing,
  getQsortCohort,
} from "../controllers/qsortCohortProcessing.js";

import {
  createUserLog,
  getLogByIndIdAndisLoggedIn,
} from "../controllers/userLogs.js"

import {
  getVFPReport,
} from "../controllers/vfp.js"

import{
  showAllReportTemplates
} from "../controllers/reportTemplate.js"

import { get360Behavior, get360BehaviorByCompetencyID, update360Behavior, insert360Behavior, delete360Behavior, borrowBehavior } from "../controllers/360Behavior.js";
import { get360Competency, update360Competency, insert360Competency, borrowCompetency } from "../controllers/360Competency.js";
import { get360Cii } from "../controllers/360Cii.js";
import { get360Oeq, insert360Oeq, update360Oeq, borrowOeq } from "../controllers/360Oeq.js";
import { get360OrgClimate, insert360OrgClimate, update360OrgClimate, borrowOrgClimate } from "../controllers/360OrganizationalClimate.js";
import { get360SharingOptions, insert360SharingOptions, update360SharingOptions, borrowSharingOptions  } from "../controllers/360SharingOptions.js";
import { get360NetPromoterScore, insert360NetPromoterScore, update360NetPromoterScore, borrowNetPromoterScore,
  get360NetPromoterScoreById
} from "../controllers/360NetPromoterScore.js";
import { get360Likert } from "../controllers/360Likert.js";
import { get360Instruction } from "../controllers/360Instruction.js";


import { createReportTemplate, checkExistReportTemplateByName, updateReportTemplate, updateReportTemplateById, deleteReportTemplate } from "../controllers/reportTemplate.js";

import { get360Section, get360withGlobalSection, getAll360Section, insert360Section, update360Section } from "../controllers/360Sections.js";

import{
  convertURLtoPDF,
  getPdfList,
  cronConvertURLtoPDF,
  getPdfContent,
  createPDF,
  uploadPDF,
  insertPDFdata,
  generateS3PDFIteration,
  createPDFbySurveyAssignmentID,
  generateS3PDFSurveyAssignment,
  processGeneratePdf,
  showPdfGeneratedForCoachScreen
} from "../controllers/convertURLtoPDF.js"

import{
  showAllAnnouncement, showAnnouncementByGOSPIandRole, updateUnReadAnnouncements, updateReadAnnouncements, deleteAnnouncements, insertAnnouncement, updateAnnouncement
} from "../controllers/announement.js"
// init express router
const router = express.Router();
//!Batch Actions
router.get("/batch-actions", showAllBatchActions);

//!Tags
router.get("/tags", showAllTags);

//! Role
// View all roles
router.get("/roles", showAllRole);
router.get("/role/:id", showRoleById);
router.get("/respondents", getAllRespondents);

//! Brand 
// view all brands
router.get("/brands", showAllBrand);
// view all brands using domain
router.get("/brands/:domain", showBrandByDomain);
// view all brands with suborg by org
router.get("/brandswithsuborg/:id", showAllBrandWithSuborgByOrg);
// get max search results 
router.get("/brands-max-limit/org/:id", getBrandMaxLimitByOrgId);
// create new brand when creating org
router.post("/brands", createBrandByOrg);
// update brand
router.put("/brands/:id", updateBrandById);

//! Organization
// view all organization
router.get("/organizations", showAllOrganization);
// view latest org_id
router.get("/organizations/latest", showLatestOrgId);
// view organization with ID
router.get("/organizations/:id", showOrganizationById);
// create new organization
router.post("/organizations", createOrganization);
// update organization
router.put("/organizations/:id", updateOrganization);
// delete organization
router.delete("/organizations/:id", deleteOrganization);

//! Sub-Organization 
// view all sub-organization
router.get("/sub-organizations", showAllSubOrganization);
// view latest org_id
router.get("/sub-organizations/latest", showLatestSuborgId);
// view sub-organization by ID
router.get("/sub-organizations-by-suborg/:id", showSubOrganizationBySubOrgId);
// view sub-organization by org_id
router.get("/sub-organizations/:id", showSubOrganizationByOrgId);
// create new sub-organization
router.post("/sub-organizations", createSubOrganization);
// update sub-organization
router.put("/sub-organizations/:id", updateSubOrganization);
//delete sub-organization
router.delete("/sub-organizations/:id", deleteSubOrganization);
//
router.post("/sub-organizations/add-user-email", getSuborgForEmail);
//Show multiple suborg using WHERE IN
router.get("/multiple-sub-organizations-by-suborg/:id", showMultipleSubOrganizationByOrgId);

//! Program
// view all program
router.get("/programs", showAllProgram);
// view program with ID
router.get("/programs/:id", showProgramById);
// create new program
router.post("/programs", createProgram);
// update program
router.put("/programs/:id", updateProgram);
//delete program
router.delete("/programs/:id", deleteProgram);
//get program by suborg
router.get("/programs/suborg/:id", showSuborgPrograms);

//! Iteration
// view all organization
router.get("/iterations", showAllIteration);
// view organization with ID
router.get("/iterations/:id", showIterationById);
// get all iteration by program_id
router.get("/iterations/programs/:id", showIterationByProgramId);
// create new organization
router.post("/iterations", createIteration);
// update organization
router.put("/iterations/:id", updateIteration);
//update iteration final deadline date, used in run iteration
router.put("/iterations/final-deadline-date-update/:id", updateIterationFinalDeadlineDate);
// delete organization
router.delete("/iterations/:id", deleteIteration);
//get iterations by program
router.get("/iterations/program/:id", showProgramIterations);
//get iterations Final deadline date
router.get("/iterations/final-deadline-date/:id", getIterationFinalDeadlineDateById);

//!Iteration Log
//get/view all iteration log
router.get("/iteration-log", showAllIterationLog);
//show iteration_log by iteration_id
router.get("/iteration-log/:id", showIterationLogByIterationId);
//create new row iteration log
router.post("/iteration-log", createIterationLog);

//! Stream
// view all Stream
router.get("/streams", showAllStream);
// view Stream with ID
router.get("/streams/:id", showStreamById);
// get all Stream by iteration_id
router.get("/streams/iteration/:id", showStreamByIterationId);
// create new Stream
router.post("/streams", createStream);
// update Stream
router.put("/streams/:id", updateStream);
// delete Stream
router.delete("/streams/:id", deleteStream);
//get streams by iteration_id
router.get("/streams/iteration/:iteration_id", showIterationStreams);

//! Group
// view all Group
router.get("/groups", showAllGroup);
// view Group with ID
router.get("/groups/:id", showGroupById);
// get all Group by stream_id
router.get("/groups/stream/:id", showGroupByStreamId);
// create new Group
router.post("/groups", createGroup);
// update Group
router.put("/groups/:id", updateGroup);
// delete Group
router.delete("/groups/:id", deleteGroup);

//! individual
//view all individual
router.get("/individuals", showAllIndividual);
//view all coach by org id
router.get("/individuals/get-coach-by-org/:org_id", showAllCoach);
//view individual Join Org by id
//view individual by id
router.get("/individuals/email/:email", showIndividualByEmail);
//view individual by email
router.get("/individuals/:id", showIndividualById);
//view single individual by id
router.get("/individuals-single/:id", showSingleIndividualById);
//view individual by org_id
router.get("/individuals/org/:org_id", showAllIndividualByOrgId);
//get individual details from ind group, using ind_id
router.get("/individual-details-from-ig/:id", showIndividualDetailsFromIndGroup);
//view individual by ind_group
router.get("/individuals/ind_group/org/:org_id/suborg/:suborg_id/program/:program_id/iteration/:iteration_id/stream/:stream_id", showAllIndividualByIndGroup);
router.get("/individuals/ind_group/org/:org_id/suborg/:suborg_id/program/:program_id/iteration/:iteration_id", showAllIndividualByIndGroupOrgSuborgProgramIteration);
router.get("/individuals/ind_group/org/:org_id", showAllIndividualByIndGroupOrg);
router.get("/individuals/ind_group/org/:org_id/suborg/:suborg_id", showAllIndividualByIndGroupOrgSuborg);
router.get("/individuals/ind_group/org/:org_id/suborg/:suborg_id/program/:program_id", showAllIndividualByIndGroupOrgSuborgProgram);
//create new individual
router.post("/individuals", createIndividual);
router.post("/individuals-and-program", createIndividualAndProgram);
//update individual
router.put("/individuals/:id", updateIndividual);
router.put("/individuals-name/:id", updateIndividualName);
router.put("/individuals-email/:id", updateIndividualEmail);
router.put("/individuals-password/:id", updateIndividualPassword);
router.put("/individuals-suppress_sending/:id", updateIndividualSuppressEmailSending);
router.put("/individuals/ind-group-program-iteration/:id", updateIndividualProgramIterationByIndGroup);
router.put("/individuals/ind-group-stream-group/:id", updateIndividualStreamGroupByIndGroup)
//delete individual
router.delete("/individuals/:id", deleteIndividual);
// create an individual for making nomination 
router.post("/individuals-make-nomination", createIndividualMakeNomination)
//check email if already exist
router.get("/individuals-check-email-exist/:email", showIndividualEmailExist);
//get individual email details
router.get("/individuals/emaildetails/:id", showEmailDetailsById);
// update individual timezone
router.put("/individuals/timezone/:id", updateindividualTimezone);
// get sitemanager emails by org id
router.get("/get-sitemanager-emails/:id", showSitemanagerEmails);

// check if user is logged in to access reports and surveys
router.get("/check-user-logged-in/:id", checkUserLoggedIn);

// update individual status when the user is logged in or logged out
router.put("/update-user-logged-in/:id/:status", updateUserLoggedIn);


//! Auth
// router.get('/auths', showAllAuthIndividual)
router.post("/auths", authResultIndividual);
router.put("/auths/lastlogin", authResultLastLogin);
// log the password reset process
router.post("/logresetpasswordprocess", logResetPassword);
// generate 2FA code
router.put("/generate2FAcode/:id", generateResult2FACode)
// get generated 2FA code
router.get("/get2FAcode/:id", getResult2FAcode)

//! Email Template
// get all data by IDs
router.get("/email-templates/org/:org_id/suborg/:suborg_id/program/:program_id", showEmailTemplateByIds);
// view single Email Tempalte with IDs
router.get("/email-templates/template-type/:template_type/org/:org_id/suborg/:suborg_id/program/:program_id", showSingleEmailTemplateByIds);
// view single Email Tempalte for making a nomination
router.get("/email-templates-make-nomination/template-type/:template_type/org/:org_id/suborg/:suborg_id/program/:program_id", showSingleEmailTemplateForNomminationByIds);
// create new email template
router.post("/email-template", createEmailTemplate);
// update Stream
router.put("/email-templates/template-type/:template_type/org/:org_id/suborg/:suborg_id/program/:program_id", updateEmailTemplate);
// delete email template
router.delete("/email-templates/template-type/:template_type/org/:org_id/suborg/:suborg_id/program/:program_id", deleteEmailTemplate);


//! Survey Templates
// Get all Survey Templates
router.get("/survey-templates", showAllTemplates);
// Get only survey_template_id and survey_template_name
router.get("/survey-templates/survey-template-name", showSurveyTemplateName);
// get all survey-templates
router.get('/survey-templates/org/:id', showAllSurveyTemplates);
//get survey template by survey template id
router.get('/survey-templates/survey-type/:id', showSurveyTemplateBySurveyTemplateId);
// get all Data
router.get('/survey-templates-survey_template_name/', showAllDataSurveyTemplates);
// create new survey template
router.post("/survey-templates", createSurveyTemplate);
// delete survey template
router.delete("/survey-templates/:id", deleteSurveyTemplate);
// update Stream
router.put("/survey-templates/:id", updateSurveyTemplate);
//get org survey-templates
router.get('/survey-templates/org/:id/suborg/:suborg_id', showOrgSurveyTemplates);
//get prepopulate endpoint
router.get('/survey-templates/prepopulate/:surveyTemplateId', getPrepolupateEndpointTemplates);
//get calculation endpoint
router.get('/survey-templates/calculate/:surveyTemplateId', getCalculateEndpointTemplates);
// get survey_template_id by survey_template_name
router.get('/survey-templates/:survey_template_name', getSurveyTemplateBySurveyTemplateName);
// update nominee_survey_template_id
router.put('/survey-template/nominee-survey-template-id/:survey_template_id', updateNomineeSuveytemplateId);
// Get All verrsion 2 survey template
router.get("/survey-templates/v2", getSurveyTemplateByVersion);
// check if survey template name exist
router.get("/survey-template-check-exist/:survey_template_name", checkExistSurveyTemplateByName);
router.get("/survey-templates/get-version/2", getSurveyTemplateByVersion);

//!Report templates
router.get("/report-templates", showAllReportTemplates);

//! Survey Assignments
router.put('/survey-assignment/dates/:id', updateSurveyAssignmentDatesAndTime)
//create router template
router.post("/survey-assignments", createSurveyAssignment);
//get survey assignment by survey_assignment_id
router.get("/survey-assignments/:id", showSingleSurveyAssignmentById);
//get all survey assignment by joining other tables
router.get("/survey-assignments/org/:id", showAllSurveyAssignment);
//get all survey assignment by admin dashboard
router.get("/survey-assignments-admin-dashboard/org/:org_id", viewSurveyAssignmentByOrg);
router.get("/survey-assignments/org/:org_id/suborg/:suborg_id", viewSurveyAssignmentByOrgAndSuborg);
router.get("/survey-assignments/org/:org_id/suborg/:suborg_id/program/:program_id", viewSurveyAssignmentByOrgAndSuborgAndProgram);
router.get("/survey-assignments/org/:org_id/suborg/:suborg_id/program/:program_id/iteration/:iteration_id", viewSurveyAssignmentByOrgAndSuborgAndProgramAndIteration);
router.get("/survey-assignments/org/:org_id/suborg/:suborg_id/program/:program_id/iteration/:iteration_id/stream/:stream_id", viewSurveyAssignmentByOrgAndSuborgAndProgramAndIterationAndStream);
//view admin dashboard tree with survey template id
router.get("/survey-assignments-survey-template/org/:org_id/suborg/:suborg_id/program/:program_id/iteration/:iteration_id/stream/:stream_id/template/:template_id", viewSurveyAssignmentByOrgSuborgProgramIterationStreamSurveyTemplate);
router.get("/survey-assignments-survey-template/org/:org_id/suborg/:suborg_id/program/:program_id/iteration/:iteration_id/template/:template_id", viewSurveyAssignmentByOrgSuborgProgramIterationSurveyTemplate);
router.get("/survey-assignments-survey-template/org/:org_id/suborg/:suborg_id/program/:program_id/template/:template_id", viewSurveyAssignmentByOrgSuborgProgramSurveyTemplate);
router.get("/survey-assignments-survey-template/org/:org_id/suborg/:suborg_id/template/:template_id", viewSurveyAssignmentByOrgSuborgSurveyTemplate);
router.get("/survey-assignments-admin-dashboard/survey-assignment-id/:id", viewSurveyAssignmentBySurveyAssignmentId);

//view client admin dashboard tree
router.get("/survey-assignments-client-admin-dashboard/org/:org_id", viewClientSurveyAssignmentByOrg);
router.get("/survey-assignments-client/org/:org_id/suborg/:suborg_id", viewClientSurveyAssignmentByOrgAndSuborg);
router.get("/survey-assignments-client/org/:org_id/suborg/:suborg_id/program/:program_id", viewClientSurveyAssignmentByOrgAndSuborgAndProgram);
router.get("/survey-assignments-client/org/:org_id/suborg/:suborg_id/program/:program_id/iteration/:iteration_id", viewClientSurveyAssignmentByOrgAndSuborgAndProgramAndIteration);
router.get("/survey-assignments-client/org/:org_id/suborg/:suborg_id/program/:program_id/iteration/:iteration_id/stream/:stream_id", viewClientSurveyAssignmentByOrgAndSuborgAndProgramAndIterationAndStream);
//view client admin dashboard tree with survey template id
router.get("/survey-assignments-client-survey-template/org/:org_id/suborg/:suborg_id/program/:program_id/iteration/:iteration_id/stream/:stream_id/template/:template_id", viewClientSurveyAssignmentByOrgSuborgProgramIterationStreamSurveyTemplate);
router.get("/survey-assignments-client-survey-template/org/:org_id/suborg/:suborg_id/program/:program_id/iteration/:iteration_id/template/:template_id", viewClientSurveyAssignmentByOrgSuborgProgramIterationSurveyTemplate);
router.get("/survey-assignments-client-survey-template/org/:org_id/suborg/:suborg_id/program/:program_id/template/:template_id", viewClientSurveyAssignmentByOrgSuborgProgramSurveyTemplate);
router.get("/survey-assignments-client-survey-template/org/:org_id/suborg/:suborg_id/template/:template_id", viewClientSurveyAssignmentByOrgSuborgSurveyTemplate);
// make pdf available
router.put("/update-survey-pdf-available/:survey_assignment_id", updateSurveyPdfAvailable);

//view participant name who nominated the nominee by survey_assignment_id
router.get("/survey-assignments-nominee-details/:id", viewParticipantNameBySurveyAssignmentId);
//get survey active reminders by survey_assignment_id
router.get("/survey-assignments/active-reminders/:id", showSingleActiveRemindersById);
// update Statement Answer, submitted status in survey_assignment table
router.put('/survey-assignment/:id', updateStmtAnswerByAssignmentId)
// view single survey assignment by survey_assignment_id
router.get('/survey-assignment/view-one/:id', viewOneSurveyAssignmentById)
//get active surveys by individual id
router.get("/survey-assignments/individuals/:ind_id", showAllSurveyAssignmentbyIndID);
//get data to use in making a nomination
router.get("/survey-assignments/make-nomination/:survey_assignment_id", showNominationsData);
//get data of all nominated users
router.get("/survey-assignments/nominee/:survey_assignment_id", showNomineeData);
//show survey assignment statistics
router.get("/survey-assignments/statistics-by-iteration/:iteration_id", showSurveyStatisticsByIteration);
router.get("/survey-assignments/statistics-by-iterationAndTemplate/:iteration_id/:template_id/:nominee_template_id", showSurveyStatisticsByIterationAndTemplate);
// update shared report with coach
router.put('/survey-assignment/shared-report/:id', updateSharedReport)
//get nominees by parent_survey_assignment_id
router.get("/survey-assignments/nominees/:id", showSurveyAssignmentNominees);
// update coach_access_granted
router.put('/survey-assignment/coach-granted/:id', updateCoachGrantedByAssignmentId)
// update coach_access_granted
router.put('/survey-assignment/coach-group-granted/:id', updateCoachGroupGrantedByAssignmentId)
// update coach_access_granted
router.put('/survey-assignment/hr-granted/:id', updateHrGrantedByAssignmentId)
// update coach_access_granted
router.put('/survey-assignment/number-of-respondents/:id', updateNumberofRespondentsByAssignmentId)
// update email and recipient_email in individual and survey assignment
router.put('/survey-assignment/email/:id', updateEmail)
// update group name by survey assignment id 
router.put('/survey-assignment/group-name/:id', UpdateChangeGroupNamebyID)
// update coach access granted
router.put('/survey-assignment/coach-access-granted/:id', updateCoachPermissionStatus)
// update stream name by survey assignment id
router.put('/survey-assignment/stream-name/:id', UpdateStreamNamebyID)
// update iteration name by survey assignment id
router.put('/survey-assignment/iteration-name/:id', UpdateIterationNamebyID)
// update program name by survey assignment id
router.put('/survey-assignment/program-name/:id', UpdateProgramNamebyID)
// update suborg name by survey assignment id
router.put('/survey-assignment/change-suborg/:id', UpdateSubOrgNamebyID)
// update drop and undrop by survey assignment id
router.put('/survey-assignment/drop-undrop/:id', UpdateDropandUndropbyID)
// update submit survey status by survey assignment id
router.put('/survey-assignment/un-submit-survey/:id', UpdateSubmitSurveybyID)
// update coach email
router.put('/survey-assignment/coach-email/:id', UpdateCoachNameByID)

// update relationship_id in survey assignment
router.put('/survey-assignment/relationship/:id', updateRelationshipId)
// check tags if existing in survey_assignment for hide/show shared reports
router.get("/survey-assignments/tag/:sharedreport/:id", showSurveyAssignmentTag);

// check email and parent survey assigment id if exist
router.get('/survey-assignments/parent/:id/email/:email', showSingleSurveyAssignmentByEmailAndParentID);

// update survey_opened
router.put('/survey-assignment/survey-opened/:survey_assignment_id', updateSurveyOpenedStatusBySurveyAssignmentId)
// update survey_complete
router.put('/survey-assignment/survey-complete/:survey_assignment_id', updateCompleteSurveyStatusBySurveyAssignmentId)
// update no_duplicates
router.put('/survey-assignment/survey-duplicate/:survey_assignment_id', updateNoDuplicateStatusBySurveyAssignmentId)
// update complete_calculation
router.put('/survey-assignment/complete-calculation/:survey_assignment_id', updateCompleteCalcualtionBySurveyAssignmentId)
// update suborg of nominee by parent survey assignment id
router.put('/survey-assignment/change-nominee-suborg/:id', changeSuborgByParentSurveyAssignmentId)
// update program of nominee by parent survey assignment id
router.put('/survey-assignment/change-nominee-program/:id', changeProgramByParentSurveyAssignmentId)
// update iteration of nominee by parent survey assignment id
router.put('/survey-assignment/change-nominee-iteration/:id', changeIterationByParentSurveyAssignmentId)
// update stream of nominee by parent survey assignment id
router.put('/survey-assignment/change-nominee-stream/:id', changeStreamByParentSurveyAssignmentId)
// update group of nominee by parent survey assignment id
router.put('/survey-assignment/change-nominee-group/:id', changeGroupByParentSurveyAssignmentId)

// for creating CSV 
router.get("/getDataforCreatingCSV/survey_assignment/:iteration_id/:survey_template_id", getDataforCreatingCSV);
// Get railroad_status
router.get('/survey-assignment/railroad-status/:survey_assignment_id', getRailroadStatus)
router.put('/survey-assignment/update-railroad-status/:survey_assignment_id', updateRailroadStatus)
router.put('/survey-assignment/recipient-email/:id', changeRecipentEmailByIndId)
router.get('/survey-assignment/earliest-final-deadline-date/:id', getEarliestFinalDeadlineDateByIterationId)
router.put('/survey-assignment/pdf-available/:id', updateIsPdfAvailableBySurveyAssignmentId)

//! Survey Result 
// view all Survey Result by survey_assignment_id
router.get("/survey-results/:survey_assignment_id", showAllSurveyResult);
// view all survey_result by survey_assignment_id and statement_num
router.get("/survey-results/:survey_assignment_id/:statement_num", showSurveyResultByStamentNum);
// create new Survey Result
router.post("/survey-results", createSurveyResult);
// update Survey Result
router.put("/survey-results/:survey_assignment_id/:statement_num", updateSurveyResult);
// delete Survey Result
router.delete("/survey-results/:id", deleteSurveyResult);
//re-calculate survey_results
router.delete("/survey-results-recalculate/:id", calculateSurveyResult);
// view all Survey Result by survey_assignment_id
router.get("/survey-results/reorder/:survey_assignment_id/:record_type", showReOrderResult);
// get sex and country by survey_assignment_id
router.get("/survey-results-sex-country/:survey_assignment_id", showSexAndCountry);
// Pre Populate Big 5 Answers
router.post("/survey-results/populate/big5", populateBig5);
router.post("/survey-results/populate/team-leader-participant", populateTeamLeaderParticipant);
router.post("/survey-results/populate/team-leader-nominee", populateTeamLeaderNominee);
router.post("/survey-results/populate/general-manager-participant", populateGeneralManagerParticipant);
router.post("/survey-results/populate/general-manager-nominee", populateGeneralManagerNominee);
router.post("/survey-results/populate/senior-exec-program-participant", populateSeniorExecParticipant);
router.post("/survey-results/populate/senior-exec-program-nominee", populateSeniorExecNominee);
router.post("/survey-results/populate/talentsage-participant", populateTalentsagePaticipant);
router.post("/survey-results/populate/talentsage-nominee", populateTalentsageNominee);
router.post("/survey-results/missing-answer", showEmptyAnswerCount);
router.post("/survey-results/duplicate-answer", showDuplicateAnswer);
router.delete("/survey-results/delete/duplicate", deleteDuplicateSurveyResult);
router.post("/survey-results/populate/help-participant", populateHelpPaticipant);
router.post("/survey-results/populate/help-nominee", populateHelpNominee);
router.post("/survey-results/populate/confirmation", prePopulateSurveyConfirmation);
router.post("/survey-results/populate/EURONAV-participant", populateEuroNavPaticipant);
router.post("/survey-results/populate/EURONAV-nominee", populateEuroNavNominee);
router.post("/survey-results/populate/Qsort", populateSurveyQsort);
router.post("/survey-results/populate/VFP", populateSurveyVFP);
router.post("/survey-results/populate/:survey_assignment_id/:org_id/:suborg_id", surveyBuilderPrepopulate);


//! sendemail
// view all 
router.get("/sendemail", showAllSendEmail);
// create new 
router.post("/sendemail", createSendEmail);
// update the status of email of send_email and survey_assignment 
router.put("/sendemail/:survey_assignment_id", updateSendEmailBySurveyAssignmentId);
router.post("/sendemail/webhook", sendEmailWebhook);
// view send email by ind id
router.get("/sendemail/:ind_id", viewSendEmailByIndId);
router.get("/sendemail-by-email/:email", viewSendEmailBySendTo);

//! Survey Active Message
// show survey active message
router.get("/survey-active-message/:id", showSurveyActiveMessageById);
router.get("/get-participant-reports/:id", getParticipantReportsById);
router.get("/get-faculty-reports/:org_id/:suborg", getFacultyReportsById);
router.get("/get-coach-reports/:id", getCoachReportsById);
router.get("/get-not-eligible360/:id", getNotEligible360);
router.get("/get-participant-reports-by-admin/:id", showParticipantReportsByIdAdmin);
router.get("/get-coach-reports-by-admin/:id", showCoachReportsByIdAdmin);

//! Survey Template Association
// view all survey template association
router.get("/survey-template-association", showAllSurveyTemplateAssociation);
// view survey template association with ID
router.get("/survey-template-association/:id", showSurveyTemplateAssociationById);
// get survey template association by org_id
router.get("/survey-template-association/org/:id", showSurveyTemplateAssociationByOrgId);
// get survey template association by org_id and suborg_id
router.get("/survey-template-association/org/:org_id/suborg/:suborg_id", showSurveyTemplateAssociationBySuborgId);
// create new survey template association
router.get("/survey-template-association/org/:org_id/survey-template/:survey_template_id/suborg/:suborg_id", showSurveyUrlByOrgIdSurveyTemplateIdSuborgId);
// create new survey template association
router.post("/survey-template-association", createSurveyTemplateAssociation);
// update survey template association
router.put("/survey-template-association/:id", updateSurveyTemplateAssociation);
// delete survey template association
router.delete("/survey-template-association/:id", deleteSurveyTemplateAssociation);
// delete survey template association by org_id
router.delete("/survey-template-association/org/:org_id/suborg-id/:suborg_id", deleteSurveyTemplateAssociationByOrgAndSuborg);
// delete survey template association by org_id suborg_id
router.delete("/survey-template-association/org/:org_id/suborg/:suborg_id", deleteSurveyTemplateAssociationBySuborg);

//!Relationships
// view all relationships
router.get("/relationships", showAllRelationships);

//! Seed
// create tags
router.post("/seed-tag", seedTag);
//!Sruvey Assignment Tag
// view sharing tags
router.get("/survey_assignment_tags/sharing/:org_id/:survey_assignment_id", showSharingTags);
//create survey assignment tag
router.post("/survey_assignment_tags/", createSurveyAssignmentTag);
//remove tag function in Admin Dashboard
router.delete("/del-survey_assignment_tags/survey-assignment/:survey_assignment_id/tag/:tag_id", removeTagBySurveyAssignmentId);

//! schedule email
// get scheduled surveys
router.get("/get-scheduled-surveys/:id", getScheduledSurveys);
// get scheduled surveys1 - for email reminder with suppress email checking
router.get("/get-scheduled-surveys1/:id", getScheduledSurveys1);
// get scheduled surveys2 - for email reminder before initial deadline date and 5, 3, 2, 1 days before
router.get("/get-scheduled-surveys2/:id", getScheduledSurveys2);
// get scheduled surveys3 - for email reminder before initial deadline date and excluding 5, 3, 2, 1 days before
router.get("/get-scheduled-surveys3/:id", getScheduledSurveys3);
// get scheduled surveys for articipant report date
router.get("/get-scheduled-participant-report/:id", getScheduledParticipantReport); 
// get participants survey that has never_run_iteration = 1
router.get("/get-participant-report-by-never-run-iteration/:id", getScheduledParticipantReportByNeverRunIteration); 
// 2022-09-20 get scheduled surveys for articipant report date
router.get("/get-scheduled-coach-report/:id", getScheduledCoachReport); 
// send all scheduled email from survey_assignments given launch_date, reminder_date, etc.
router.get("/process-scheduled-email/:id", processScheduledEmail);
// get email template subject body
router.get("/get-et-subject-body/:id", getETSubjectBody);
// get token values
router.get("/get-token-values/:id", getTokenValues);
// vty get email template, subject, body
router.get("/get-email-template-by-template-type/:template_type/org/:org_id/suborg/:suborg_id/program/:program_id", getEmailTemplateByTemplateType);
// vty scheduled email sending - step by step endpoint call
router.get("/scheduled-email-sending", scheduledEmailSending);										   
// vty scheduled email sending - survey reminder
router.get("/scheduled-survey-reminder", scheduledSurveyReminder);												
// vty scheduled email sending - survey reminder
router.get("/scheduled-survey-reminder2", scheduledSurveyReminder2);												
// vty scheduled email sending - survey reminder												
router.get("/scheduled-survey-reminder3", scheduledSurveyReminder3);
// vty scheduled email sending - survey reminder
router.get("/scheduled-email-participant-report", scheduledEmailParticipantReport);
// vty scheduled email Coach Report
router.get("/scheduled-email-coach-report", scheduledEmailCoachReport);		   
// vty get single survey assignment submitted
router.get("/get-single-survey-assignment-submitted/:id", getSingleSurveyAssignmentSubmitted);												
// vty submit survey email -stepby step
router.get("/submit-survey-email/:id", submitSurveyEmail);
// 2022-10-11 get timezone list
router.get("/get-time-zone", getTimeZone); 

// Survey Result Note 
// create new note
router.post("/survey-result-notes", createSurveyResultNote);
// get survey result note by survey assignment id and section_num
router.get("/survey-result-notes/survey-assignment/:id/section/:section_num/resolved-status/:resolved_status", showAllSurveyResultNoteBySurveyIdAndSectionAndResolvedStatus);
// update note by id
router.put("/survey-result-notes/:id", updateSurveyResultNote);
// update note status to resolved by id
router.put("/survey-result-notes-resolved-status/:id", updateSurveyResultNoteResolvedStatus);


//! big5
// delete existing group
router.delete("/b5-delete", b5Delete);
// delete existing group2
router.delete("/b5-delete2/:id", b5Delete2);
// get list of surveys for b5 based on final deadline date column name passed
router.get("/b5-get-final-deadline/:id", b5GetFinalDeadline);
// insert b5norm raw table endpoint (pass survey assignment id)
router.post("/b5-norm-raw-insert", b5NormRawInsert);
// insert b5 cohort (pass org suborg iteration stream group)
router.post("/b5-cohort-insert", b5CohortInsert);
	// insert b5 cohort (pass org suborg iteration stream group)
router.post("/b5-processing2", b5Processing2);
// query b5 report data
router.post("/b5-report-data", b5ReportData);
// query b5 report data2 based on std mean
router.post("/b5-report-data2", b5ReportData2);
// query b5 coach report data based on coach_id, iteration, survey_template_id
router.post("/b5-coach-report-data", b5CoachReportData);
// survey result fix step 1
router.post("/b5-get-duplicate-statement1", b5GetDuplicateStatement1);
// survey result fix step 2
router.delete("/b5-delete-duplicate-statement2", b5DeleteDuplicateStatement2);
// survey result fix step 3
router.delete("/b5-delete-subtrait-supertrait3", b5DeleteSubtraitSupertrait3);
// survey result fix step 3a
router.delete("/b5-delete-subtrait-supertrait3a", b5DeleteSubtraitSupertrait3a);
// survey result fix step 4 GET
router.get("/b5-get-submitted-survey4", b5GetSubmittedSurvey4);
//based on big5 survey result subtrait supertrait data fix
router.get("/b5-get-survey-result/:survey_assignment_id", b5GetSurveyResult);
router.post("/b5-insert-survey-result-traits", b5InsertSurveyResultTraits);
router.post("/b5-survey-result-reprocessing", b5SurveyResultReprocessing);
router.get("/b5-get-survey_assignment_for_sr_reprocessing/:iteration_id", b5GetSurveyAssignmentForSRReprocessing);
router.post("/b5-survey-result-reprocessing2", b5SurveyResultReprocessing2);

// query b5 faculty report data based on the iteration
router.post("/b5-faculty-report-data", b5FacultyReportData);

// survey result fix step 6 INSERT SUBTRAIT
router.post("/b5-insert-subtrait6", b5InsertSubtrait6);

//get countries
router.get("/b5-get-countries", b5GetCountries);


//! 360
// delete existing group
router.delete("/r360-delete", R360Delete);
// delete existing group2
router.delete("/r360-delete2/:id", R360Delete2);
// get list of surveys for b5 based on final deadline date column name passed
router.get("/r360-get-final-deadline/:id", R360GetFinalDeadline);
// insert r360 raw table endpoint (pass survey assignment id)
router.post("/r360-raw-insert", R360RawInsert);
// insert r360 cohort (pass org suborg iteration stream group)
router.post("/r360-cohort-insert", R360CohortInsert);
	// insert r360 cohort (pass org suborg iteration stream group)
router.post("/r360-processing2", R360Processing2);
// query r360-report data2 based on std mean
router.post("/r360-report-data2", R360ReportData2);
// query R360 report data for open ended questoins
router.post("/r360-report-data2a", R360ReportData2a);
													// query R360 report data for ranking highest lowest
router.post("/r360-report-data2b", R360ReportData2b);
// query R360 report data count all elements
router.post("/r360-report-data2c", R360ReportData2c);										 
// query R360 generate data
router.post("/r360-generate-data/:id", R360GenerateData);
router.post("/r360-processing3", R360Processing3);
router.post("/r360-raw-insert3", R360RawInsert3);		

//get all individual that shared with coach
router.post("/r360-coach-report-data", R360CoachReportData);
//get all individual that shared with coach and with count
router.post("/r360-coach-report-data2c", R360CoachReportData2c);

// query 360 faculty report data based on the iteration
router.post("/r360-faculty-report-data", R360FacultyReportData);

	// histogram1 - insert r360-survey-result
router.post("/r360-histogram1/:id", R360Histogram1);
router.post("/r360-histogram-persa/:id", R360HistogramPerSA); //2024-01-09 per participant survey_assignment_id
router.post("/r360-histogram-report-endpoint/:id", R360HistogramReportEndpoint);
router.post("/r360-histogram-report-endpoint-faculty/:iteration_id", R360HistogramReportEndpointFaculty);
router.put("/r360-relationship/nomination-survey-assignment/:nominationId/survey-assignment/:parentId", updateR360RawRelationship);

//! 360 calc
router.get("/c360-get-survey-result/:survey_assignment_id", Get360SurveyResult);
router.post("/teamleader-insert-survey-result-traits/teamleader", teamLeaderInsertSurveyResultTraits);
router.post("/teamleader-survey-result-reprocessing", teamLeaderSurveyResultReprocessing);
router.post("/general-manager-insert-survey-result-traits/general-manager", generalManagerInsertSurveyResultTraits);
router.post("/general-manager-survey-result-reprocessing", generalManagerSurveyResultReprocessing);
router.post("/senior-Exec-Program-insert-survey-result-traits/senior-Exec-Program", seniorExecProgramInsertSurveyResultTraits);
router.post("/senior-Exec-Program-survey-result-reprocessing", seniorExecProgramSurveyResultReprocessing);
router.post("/talentsage-insert-survey-result-traits/talentsage", talentsageInsertSurveyResultTraits);
router.post("/talentsage-survey-result-reprocessing", talentsageSurveyResultReprocessing);

//! big5 calc
router.get("/big5-get-survey-result/:survey_assignment_id", GetBig5SurveyResult);
router.post("/big5-insert-survey-result-traits/big5", big5InsertSurveyResultTraits);
router.post("/big5-survey-result-reprocessing", big5SurveyResultReprocessing);

// get all survey_assingment with big5 survey
router.get("/get-all-survey-assignment-big5", getAllSurveyAssignmentBig5)
router.delete("/delete-raw-calculation/big5/:survey_assignment_id", deleteBig5Raw)
router.post("/insert-raw-calculation/modified/big5", big5InsertRawCalcModified)
router.post("/calculate/modified/big5", modifiedBig5Calculation) //! update b5_norm_raw 
router.post("/survey-result/update/big5", big5UpdateSurveyResult) //! update survey_result Q98 Q53 Q113
router.post("/update-survey-result/big5", updateSurveyResultBig5) //! RUN update survey_result Q98 Q53 Q113


//! Re-architecture calculation
router.post("/big5-insert-raw-calculation/big5", big5InsertRawCalc);
router.post("/calculate/big5", big5Calculation);
router.post("/insert-raw-calculation/general-manager", generalManagerInsertRawCalc);
router.post("/calculate/general-manager", generalManagerCalculation);
router.post("/insert-raw-calculation/team-leader", teamLeaderInsertRawCalc);
router.post("/calculate/team-leader", teamLeaderCalculation);
router.post("/insert-raw-calculation/senior-exec-program", seniorExecProgramInsertRawCalc);
router.post("/calculate/senior-exec-program", seniorExecProgramCalculation);
router.post("/insert-raw-calculation/talentsage", talentSageInsertRawCalc);
router.post("/calculate/talentsage", talentSageCalculation);
router.post("/insert-raw-calculation/help", helpInsertRawCalc);
router.post("/calculate/help", helpCalculation);
router.post("/insert-raw-calculation/EURONAV", euroNavInsertRawCalc);
router.post("/calculate/EURONAV", euroNavCalculation);
router.post("/calculate/force", forceCalulation360); //! do not use

router.delete("/delete360Raw/:survey_assignment_id", delete360Raw);
router.post("/surveyBuilderCalc/:survey_assignment_id", surveyBuilderCalc);
router.post("/calculate360/:survey_assignment_id", calculate360);

router.post("/calculate/SmartCollab/:survey_assignment_id", smartCollabCalc); //! USED ONLY FOR SMART COLLAB
router.post("/calculateSmartCollab360/:survey_assignment_id", calculateSmartCollab360); //! USED ONLY FOR SMART COLLAB


router.post("/reCalculateRaw", reCalculate360Raw); //! NEW CALCULATION RE CALCULATION

//! Qsort calc
router.get("/qsort-get-survey-result/:survey_assignment_id", getQsortSurveyResults);
router.delete("/delete-raw-calculation/qsort/:survey_assignment_id", deleteQsortRaw);
router.post("/insert-raw-calculation/qsort/:qsort_type/:survey_assignment_id", insertQsortRawCalc);
router.post("/calculate/qsort/:qsort_type/:survey_assignment_id", qsortCalculation);

router.get("/qsort-get-raw/:survey_assignment_id", getQsortRaw);
router.get("/qsort-get-coefficient-correlation/:survey_assignment_id", getQsortCoefficientCorrelation);

// Individual Qsort Report 
router.get("/qsort-report/survey-assignment/:survey_assignment_id/iteration/:iteration_id/:qsort_type", getQsortReportData);
// Coach Qsort Report 
router.get("/qsort-cohort-report/iteration/:iteration_id/:qsort_type", getQsortCoachReportData);

//! VFP calc
router.get("/vfp-get-survey-result/:survey_assignment_id", getVFPSurveyResults);
router.delete("/delete-raw-calculation/vfp/:survey_assignment_id", deleteVFPRaw);
router.post("/insert-raw-calculation/vfp/:survey_assignment_id", insertVFPRawCalc);
router.post("/calculate/vfp/:survey_assignment_id", vfpCalculations);


//! Re-architecture cohort processing
//todo big5 processing
router.delete("/delete-cohort/big5/:id", deleteBig5Cohort);
router.get("/get-final-deadline-date/big5/:id", getBig5FinalDeadlineDate);
router.post("/insert-cohort/big5", insertBig5Cohort);
router.post("/cohort-processing/big5", big5CohortProcessing);
router.delete("/force-delete-cohort/big5/:id", forceDeleteBig5Cohort);
router.get("/force-get-list/big5/:id", forceGetBig5IterationList);
router.post("/force-cohort-processing/big5", forceBig5CohortProcessing);

//todo 360 processing
router.delete("/delete-cohort/360/:id", delete360Cohort);
router.put("/update-is-processed/360/:id", updateIsProcessed);
router.get("/get-final-deadline-date/360/:id", get360FinalDeadlineDate);
router.post("/generate-360-data/:id", generate360Data);
router.post("/cohort-processing/360", c360CohortProcessing);

router.delete("/force-delete-cohort/360/:id", forceDelete360Cohort);
router.put("/force-update-is-processed/360/:id", forceUpdateIsProcessed);
router.get("/force-get-list/360/:id", forceGet360IterationList);
router.post("/force-generate-data/360/:id", forceGenerate360Data);
router.post("/force-cohort-processing/360", force360CohortProcessing);

router.post("/insert-cohort/360", insert360Cohort); //! insert cohort data
router.post("/force-insert-cohort/360", forceInsert360Cohort); //! force insert cohort data

//todo qsort processing
router.delete("/delete-cohort/qsort/:id", deleteQsortCohort);
router.get("/get-final-deadline-date/qsort/:id", getQsortFinalDeadlineDate);

router.post("/insert-cohort/qsort", insertQsortCohort)
router.post("/cohort-processing/qsort", qsortCohortProcessing);

router.delete("/force-delete-cohort/qsort/:iteration_id", forceDeleteQsortCohort);
router.get("/force-get-list/qsort/:iteration_id", forceGetQsortIterationList);
router.post("/force-cohort-processing/qsort", forceQsortCohortProcessing);

router.get("/qsort-get-cohort/:iteration_id", getQsortCohort);

//! User Log
router.post("/insertUserLog", createUserLog);
router.get("/getUserLogByIndId/:ind_id", getLogByIndIdAndisLoggedIn);

//! uat regression
router.post("/update-uat", UpdateUAT);

// VFP
router.get("/vfp-report/:survey_assignment_id", getVFPReport);

//! 360 Behavior
router.post("/360Behavior", get360Behavior);
router.post("/360BehaviorByCompID", get360BehaviorByCompetencyID);
router.put("/360Behavior/:id", update360Behavior);
router.post("/insert-360Behavior", insert360Behavior);
router.delete("/delete-360Behavior/:id", delete360Behavior);
router.put("/borrow-360Behavior", borrowBehavior);
//! 360 Competency
router.post("/360Competency", get360Competency);
router.put("/360Competency/:id", update360Competency);
router.post("/insert-360Competency", insert360Competency);
router.put("/borrow-360Competency", borrowCompetency);
//! 360 CII
router.post("/360Cii", get360Cii);
//! 360 OEQ
router.post("/360Oeq", get360Oeq);
router.post("/insert-360Oeq", insert360Oeq);
router.put("/360Oeq/:id", update360Oeq);
router.put("/borrow-360Oeq", borrowOeq);
//! 360 Organizational Climate
router.post("/360OrgClimate", get360OrgClimate);
router.post("/insert-360OrgClimate", insert360OrgClimate);
router.put("/360OrgClimate/:id", update360OrgClimate);
router.put("/borrow-360OrgClimate", borrowOrgClimate);
//! 360 Net Promoter Score
router.post("/360NetPromoterScore", get360NetPromoterScore);
router.post("/insert-360NetPromoterScore", insert360NetPromoterScore);
router.put("/360NetPromoterScore/:id", update360NetPromoterScore);
router.put("/borrow-360NetPromoterScore", borrowNetPromoterScore );

router.get("/360NetPromoterScore/survey_assignment/:survey_assignment_id", get360NetPromoterScoreById);

//! 360 Sharing Options
router.post("/360SharingOptions", get360SharingOptions);
router.post("/insert-360SharingOptions", insert360SharingOptions);
router.put("/360SharingOptions/:id", update360SharingOptions);
router.put("/borrow-360SharingOptions", borrowSharingOptions);
//! 360 Likert
router.get("/360Likert", get360Likert);
//! 360 Instruction
router.post("/360Instruction", get360Instruction);

//! Report Template
// add new report template 
router.post("/report-template", createReportTemplate);
// check report template name if already exist 
router.get("/report-template-check-exist/:report_template_name", checkExistReportTemplateByName);
// update report template by report template name
router.put("/report-template", updateReportTemplate);
// update report template by report template id
router.put("/report-template/:id", updateReportTemplateById);
// delete report template by report template id
router.delete("/report-template/:id", deleteReportTemplate);
// get all report template
router.get("/report-templates", showAllReportTemplates);

//sections' descriptions - for Library and Survey
router.post("/insert-360section",insert360Section)
router.post("/get-360section-gospi",get360withGlobalSection)
router.get("/get-360section/:org_id/:suborg_id/:program_id/:iteration_id",get360Section)
router.get("/get-all360section/:org_id",getAll360Section)
router.put("/update-360section",update360Section)

// convert url to pdf
router.post("/convert-url-to-pdf", convertURLtoPDF)
router.get("/get-pdf-list", getPdfList)
router.post("/get-pdf-generated-for-coach", showPdfGeneratedForCoachScreen)

router.post("/get-pdf-content", getPdfContent)
router.post("/create-pdf", createPDF)
router.post("/upload-pdf", uploadPDF)
router.post("/insert-pdf-data", insertPDFdata)
router.post("/create-pdf-by-survey-assignment-id", createPDFbySurveyAssignmentID)
router.post("/process-generate-pdf-by-survey-assignment-id", processGeneratePdf)

router.get("/cron-convert-url-to-pdf", cronConvertURLtoPDF)

router.post("/generate-s3-pdf-iteration", generateS3PDFIteration)
router.post("/generate-s3-pdf-survey-assignment", generateS3PDFSurveyAssignment)

// announcements
router.get("/get-all-announcements", showAllAnnouncement)
router.post("/get-announcements-by-gospi-role", showAnnouncementByGOSPIandRole)
router.post("/update-unread", updateUnReadAnnouncements)
router.post("/update-read", updateReadAnnouncements)
router.delete("/delete-announcements", deleteAnnouncements)
router.post("/insert-announcement", insertAnnouncement)
router.put("/update-announcement", updateAnnouncement)

// vty 2024-01-05 calculate this participant scores
router.post("/CalculateParticipant", CalculateParticipant);
router.post("/CalculateParticipantSelectScores/:id", CalculateParticipantSelectScores);
router.post("/CalculateParticipantInsert", CalculateParticipantInsert);

// 2024-01-09 360 cohort processing passing days prior as parameter
router.post("/delete-360-cohort-prior-days/:id", delete360CohortPriorDays);
router.post("/update-is-processed-by-iteration/:id", updateIsProcessedByIteration);
router.post("/prior-days-360-cohort-processing/:id", priorDays360CohortProcessing);
router.post("/force-generate-insert360/:id", forceGenerateInsert360Data);
export default router;
