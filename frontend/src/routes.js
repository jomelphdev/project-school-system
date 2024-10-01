import Home from "./components/HomeComponent.vue";
import MySurveys from "./components/MySurveys.vue";
import MyProfile from "./components/MyProfile.vue";
import MyReports from "./components/MyReports.vue";
import CreateEditUser from "./components/CreateEditUser.vue";
import AddSurvey from "./components/AddSurvey.vue";
import BulkUserUpload from "./components/BulkUserUpload.vue";
import CoachingReports from "./components/CoachingReports.vue";
import CrParticipantProgress from "./components/CrParticipantProgress.vue";
import BillingComponent from "./components/BillingComponent.vue";
import ActiveSurveys from "./components/ActiveSurveys.vue";
import BulkAssignSurveys from "./components/BulkAssignSurveys.vue";
import SurveyPreview from "./components/SurveyPreview.vue";
import TakeSurvey from "./components/TakeSurvey.vue";
import ManageAnnouncements from "./components/ManageAnnouncements.vue";
import ChangeWebsiteLanguage from "./components/ChangeWebsiteLanguage.vue";
import ViewUserDetails from "./components/ViewUserDetails.vue";
import AssignIndividualSurvey from "./components/AssignIndividualSurvey.vue";
import EditSurvey from "./components/EditSurvey.vue";
import DeleteSurvey from "./components/DeleteSurvey.vue";
import ElevatedUsers from "./components/ElevatedUsers.vue";
import ViewIndividualSurveyProgress from "./components/ViewIndividualSurveyProgress.vue";
import ViewIndividualReport from "./components/ViewIndividualReport.vue";
import ViewIndividualCoacheeReport from "./components/ViewIndividualCoacheeReport.vue";
import ViewIterationReports from "./components/ViewIterationReports.vue";
import ViewIterationProgressReports from "./components/ViewIterationProgressReports.vue";
import ViewCoachingGroupReports from "./components/ViewCoachingGroupReports.vue";
import ForcedMultiFactorAuthentication from "./components/ForcedMultiFactorAuthentication.vue";
import AdminLinkRouter from "./components/AdminLinkRouter.vue";
import LoginComponent from "./components/LoginComponent.vue";
import ManageOrganisation from "./components/ManageOrganisation";
import ManageUsers from "./components/ManageUsers";
import ManageSubOrganisation from "./components/ManageSubOrg";
import EmailTemplates from "./components/EmailTemplates";
import HelpPageComponent from "./components/HelpPageComponent.vue";
import AdminDashboard from "./components/AdminDashboard.vue";
//import FindUser from "./components/FindUserSearchBox.vue"
import EditEmailTemplates from "./components/EditEmailTemplates.vue";
import createReport from "./components/createReport.vue";
import ManageSurveys from "./components/ManageSurveys.vue";
import ManageReports from "./components/ManageReports.vue"
import ManageSurveysCreateEdit from "./components/ManageSurveysCreateEdit.vue";
import ManageReportsCreateEdit from "./components/ManageReportsCreateEdit";
import createHTMLView from "./components/createHTML.vue";
import BulkUserUploadReports from "./components/BulkUserUploadReports.vue";
import MakeNominations from "./components/MakeNominations.vue";
import PrivacyPage from "./components/PrivacyPage.vue"
import TermsOfService from "./components/TermsOfService.vue"
import ForgotPasswordScreen from "./components/ForgotPasswordScreen.vue"
import ForgotPasswordSetPassword from "./components/ForgotPasswordSetPassword.vue"
import CreateSurvey from "./components/CreateSurvey.vue"
import ManageBrand from "./components/ManageBrand.vue";
import ManageBrandCreateEdit from "./components/ManageBrandCreateEdit.vue";
import store from "./store/store.js"
import MySurvey from "./components/MySurvey.vue"
import MyReport from "./components/MyReport.vue"
import ClientAdminDashboard from "./components/AdminDashboardClientAdminViewer.vue"
import TwoFactorAuthenticator from "./components/2FA.vue"
import SurveyBuilder from "./components/SurveyBuilder/SurveyBuilder.vue"
import LibraryEditor from "./components/LibraryEditor.vue"


import ReportBuilder from "./components/ReportBuilder.vue";

const authStringFinder = [
  {
    manage_user: null,
    upload_many_users_at_once: null,
    upload_many_users_reports: null,
    manage_org_admin_users: null,
    my_skill_building_actions_tiles: null,
    my_profile: null,
    my_reports_available_tiles: null,
    view_user_details: null,
    CreateEditUserBox: null,
    add_survey: null,
    assign_survey_to_indivivdual: null,
    view_individual_coachee_report: null,
    view_billing_information: null,
    view_active_surveys: null,
    view_survey_preview: null,
    survey_tile: null,
    assign_surveys_to_a_group: null,
    view_announcements: null,
    change_website_language: null,
    edit_user_survey_details: null,
    delete_survey: null,
    view_individual_survey_progress: null,
    elevated_users: null,
    manage_user_surveys: null,
    view_iteration_dashboard_report: null,
    view_coaching_group_reports: null,
    forced_multifactor_authentication: null,
    manage_sub_organizations: null,
    manage_email_templates: null,
    pdn_tile: null,
    manage_announcements: null,
    edit_email_templates: null,
    brandscreen: null,
    brandcreateedit: null,
    makenominationscreen: null,
    mysurvey: null,
    my_client_admin_dashboard: null,
    report_builder: null,
  }
]
const routes = [
  { 
    path: "/",
    component: Home,
    beforeEnter: (to, from, next) => {
      if(store.getters.getAuthString[0] == null)
      {
        next('/login')
      }
      else next()
    }
  },
  {
    path: "/manage_user", // past name is find-user
    name: "manage_user",
    component: ManageUsers,
    beforeEnter: (to, from, next) => {
      if(store.getters.getAuthString[0] == null)
      {
        alert('You do not have access to this function. Please raise a Help Desk ticket here <help desk email link> if you need access.')
        next('/login')
      }
      else
      {
      authStringFinder.manage_user = store.getters.getAuthString[0].toString().substring(14, 15) == '1' // fix disable on coach
      if (authStringFinder.manage_user) {

        next()
      }
      else {
        alert('You do not have access to this function. Please raise a Help Desk ticket here <help desk email link> if you need access.')
        next('/')
      }
    }
    }
  },
  {
    path: "/upload_many_users_at_once", // past name is bulk-user-upload
    name: "upload_many_users_at_once",
    component: BulkUserUpload,
    beforeEnter: (to, from, next) => {
      if(store.getters.getAuthString[0] == null)
      {
        alert('You do not have access to this function. Please raise a Help Desk ticket here <help desk email link> if you need access.')
        next('/login')
      }
      else
      {
      authStringFinder.upload_many_users_at_once = store.getters.getAuthString[0].toString().substring(24, 25) == '1'
      if (authStringFinder.upload_many_users_at_once) {

        next()
      }
      else {
        alert('You do not have access to this function. Please raise a Help Desk ticket here <help desk email link> if you need access.')
        next('/')
      }
    }
  }
  },
  {
    path: "/manage_org_admin_users", // past name is = manage-users
    name: "manage_org_admin_users",
    component: CreateEditUser,
    beforeEnter: (to, from, next) => {
      if(store.getters.getAuthString[0] == null)
      {
        alert('You do not have access to this function. Please raise a Help Desk ticket here <help desk email link> if you need access.')
        next('/login')
      }
      else
      {
      authStringFinder.manage_org_admin_users = store.getters.getAuthString[0].toString().substring(52, 53) == '1'
      if (authStringFinder.manage_org_admin_users) {

        next()
      }
      else {
        alert('You do not have access to this function. Please raise a Help Desk ticket here <help desk email link> if you need access.')
        next('/')
      }
    }
  }
  },
  {
    path: "/my_skill_building_actions_tiles", // past name is = my-surveys
    name: "my_skill_building_actions_tiles",
    component: MySurveys,
    beforeEnter: (to, from, next) => {
      if(store.getters.getAuthString[0] == null)
      {
        alert('You do not have access to this function. Please raise a Help Desk ticket here <help desk email link> if you need access.')
        next('/login')
      }
      else
      {
      authStringFinder.my_skill_building_actions_tiles = store.getters.getAuthString[0].toString().substring(5, 6) == '1'
      if (authStringFinder.my_skill_building_actions_tiles) {

        next()
      }
      else {
        alert('You do not have access to this function. Please raise a Help Desk ticket here <help desk email link> if you need access.')
        next('/')
      }
    }
  }
  },
  {
    path: "/my_profile", // past name is = user-details
    name: "my_profile",
    component: MyProfile,
    beforeEnter: (to, from, next) => {
      if(store.getters.getAuthString[0] == null)
      {
        alert('You do not have access to this function. Please raise a Help Desk ticket here <help desk email link> if you need access.')
        next('/login')
      }
      else
      {
      authStringFinder.my_profile = store.getters.getAuthString[0].toString().substring(9, 10) == '1'
      if (authStringFinder.my_profile) {

        next()
      }
      else {
        alert('You do not have access to this function. Please raise a Help Desk ticket here <help desk email link> if you need access.')
        next('/')
      }
    }
  }
  },
  {
    path: "/my_reports_available_tiles", // past name is = my-reports
    name: "my_reports_available_tiles",
    component: MyReports,
    beforeEnter: (to, from, next) => {
      if(store.getters.getAuthString[0] == null)
      {
        alert('You do not have access to this function. Please raise a Help Desk ticket here <help desk email link> if you need access.')
        next('/login')
      }
      else
      {
      authStringFinder.my_reports_available_tiles = store.getters.getAuthString[0].toString().substring(8, 9) == '1'
      if (authStringFinder.my_reports_available_tiles) {

        next()
      }
      else {
        alert('You do not have access to this function. Please raise a Help Desk ticket here <help desk email link> if you need access.')
        next('/')
      }
    }
  }
  },
  {
    path: "/create-edit-user",
    name: "CreateEditUserBox",
    props: true,
    component: CreateEditUser,
    beforeEnter: (to, from, next) => {
      if(store.getters.getAuthString[0] == null)
      {
        alert('You do not have access to this function. Please raise a Help Desk ticket here <help desk email link> if you need access.')
        next('/login')
      }
      else
      {
      authStringFinder.CreateEditUserBox = store.getters.getAuthString[0].toString().substring(14, 15) == '1'
      if (authStringFinder.CreateEditUserBox) {

        next()
      }
      else {
        alert('You do not have access to this function. Please raise a Help Desk ticket here <help desk email link> if you need access.')
        next('/')
      }
    }
  }
  },
  {
    path: "/bulk-user-upload-results",
    name: "BulkUserUploadReports",
    props: true,
    component: BulkUserUploadReports,
    beforeEnter: (to, from, next) => {
      if(store.getters.getAuthString[0] == null)
      {
        alert('You do not have access to this function. Please raise a Help Desk ticket here <help desk email link> if you need access.')
        next('/login')
      }
      else
      {
      authStringFinder.upload_many_users_reports = store.getters.getAuthString[0].toString().substring(14, 15) == '1'
      if (authStringFinder.upload_many_users_reports) {

        next()
      }
      else {
        alert('You do not have access to this function. Please raise a Help Desk ticket here <help desk email link> if you need access.')
        next('/')
      }
    }
  }
  },
  {
    path: "/add_survey", // past name is add-survey
    name: "Add_survey",
    component: AddSurvey,
    props: true,
    beforeEnter: (to, from, next) => {
      if(store.getters.getAuthString[0] == null)
      {
        alert('You do not have access to this function. Please raise a Help Desk ticket here <help desk email link> if you need access.')
        next('/login')
      }
      else
      {
      authStringFinder.add_survey = store.getters.getAuthString[0].toString().substring(17, 18) == '1'
      if (authStringFinder.add_survey) {

        next()
      }
      else {
        alert('You do not have access to this function. Please raise a Help Desk ticket here <help desk email link> if you need access.')
        next('/')
      }
    }
  }
  },

  {
    path: "/view_billing_information", // past name is = /billing
    name: "view_billing_information",
    component: BillingComponent,
    beforeEnter: (to, from, next) => {
      if(store.getters.getAuthString[0] == null)
      {
        alert('You do not have access to this function. Please raise a Help Desk ticket here <help desk email link> if you need access.')
        next('/login')
      }
      else
      {
      authStringFinder.view_billing_information = store.getters.getAuthString[0].toString().substring(49, 50) == '1'
      if (authStringFinder.view_billing_information) {

        next()
      }
      else {
        alert('You do not have access to this function. Please raise a Help Desk ticket here <help desk email link> if you need access.')
        next('/')
      }
    }
  }
  },
  {
    path: "/view_active_surveys", // past name is = /active-surveys
    name: "view_active_surveys",
    component: ActiveSurveys,
    beforeEnter: (to, from, next) => {
      if(store.getters.getAuthString[0] == null)
      {
        alert('You do not have access to this function. Please raise a Help Desk ticket here <help desk email link> if you need access.')
        next('/login')
      }
      else
      {
      authStringFinder.view_active_surveys = store.getters.getAuthString[0].toString().substring(50, 51) == '1'
      if (authStringFinder.view_active_surveys) {

        next()
      }
      else {
        alert('You do not have access to this function. Please raise a Help Desk ticket here <help desk email link> if you need access.')
        next('/')
      }
    }
  }
  },
  {
    path: "/view_survey_preview", // past name is = survey-preview
    name: "view_survey_preview",
    component: SurveyPreview,
    beforeEnter: (to, from, next) => {
      if(store.getters.getAuthString[0] == null)
      {
        alert('You do not have access to this function. Please raise a Help Desk ticket here <help desk email link> if you need access.')
        next('/login')
      }
      else
      {
      authStringFinder.view_survey_preview = store.getters.getAuthString[0].toString().substring(12, 13) == '1'
      if (authStringFinder.view_survey_preview) {

        next()
      }
      else {
        alert('You do not have access to this function. Please raise a Help Desk ticket here <help desk email link> if you need access.')
        next('/')
      }
    }
  }
  },
  {
    path: "/survey_tile", // past name is = take-survey
    name: "survey_tile",
    component: TakeSurvey,
    beforeEnter: (to, from, next) => {
      if(store.getters.getAuthString[0] == null)
      {
        alert('You do not have access to this function. Please raise a Help Desk ticket here <help desk email link> if you need access.')
        next('/login')
      }
      else
      {
      authStringFinder.survey_tile = store.getters.getAuthString[0].toString().substring(6, 7) == '1'
      if (authStringFinder.survey_tile) {

        next()
      }
      else {
        alert('You do not have access to this function. Please raise a Help Desk ticket here <help desk email link> if you need access.')
        next('/')
      }
    }
  }
  },
  {
    path: "/assign_surveys_to_a_group", // past name is = bulk-assign-surveys
    name: "assign_surveys_to_a_group",
    component: BulkAssignSurveys,
    beforeEnter: (to, from, next) => {
      if(store.getters.getAuthString[0] == null)
      {
        alert('You do not have access to this function. Please raise a Help Desk ticket here <help desk email link> if you need access.')
        next('/login')
      }
      else
      {
      authStringFinder.assign_surveys_to_a_group = store.getters.getAuthString[0].toString().substring(25, 26) == '1'
      if (authStringFinder.assign_surveys_to_a_group) {

        next()
      }
      else {
        alert('You do not have access to this function. Please raise a Help Desk ticket here <help desk email link> if you need access.')
        next('/')
      }
    }
  }
  },
  {
    path: "/manage_announcements",
    name: "ManageAnnouncements",
    component: ManageAnnouncements,
    beforeEnter: (to, from, next) => {
      if(store.getters.getAuthString[0] == null)
      {
        alert('You do not have access to this function. Please raise a Help Desk ticket here <help desk email link> if you need access.')
        next('/login')
      }
      else
      {
      authStringFinder.manage_announcements = store.getters.getAuthString[0].toString().substring(11, 12) == '1'
      if (authStringFinder.manage_announcements) {

        next()
      }
      else {
        alert('You do not have access to this function. Please raise a Help Desk ticket here <help desk email link> if you need access.')
        next('/')
      }
    }
  }
  },
  {
    path: "/change_website_language",
    name: "change_website_language",
    component: ChangeWebsiteLanguage,
    beforeEnter: (to, from, next) => {
      if(store.getters.getAuthString[0] == null)
      {
        alert('You do not have access to this function. Please raise a Help Desk ticket here <help desk email link> if you need access.')
        next('/login')
      }
      else
      {
      authStringFinder.change_website_language = store.getters.getAuthString[0].toString().substring(2, 3) == '1'
      if (authStringFinder.change_website_language) {

        next()
      }
      else {
        alert('You do not have access to this function. Please raise a Help Desk ticket here <help desk email link> if you need access.')
        next('/')
      }
    }
  }
  },
  {
    path: "/view_user_details", // past name is = view-user-details
    name: "view_user_details",
    component: ViewUserDetails,
    beforeEnter: (to, from, next) => {
      if(store.getters.getAuthString[0] == null)
      {
        alert('You do not have access to this function. Please raise a Help Desk ticket here <help desk email link> if you need access.')
        next('/login')
      }
      else
      {
      authStringFinder.view_user_details = store.getters.getAuthString[0].toString().substring(15, 16) == '1'
      if (authStringFinder.view_user_details) {

        next()
      }
      else {
        alert('You do not have access to this function. Please raise a Help Desk ticket here <help desk email link> if you need access.')
        next('/')
      }
    }
  }
  },
  {
    path: "/assign_survey_to_indivivdual", // past name is = assign-individual-survey"
    name: "assign_survey_to_indivivdual",
    component: AssignIndividualSurvey,
    beforeEnter: (to, from, next) => {
      if(store.getters.getAuthString[0] == null)
      {
        alert('You do not have access to this function. Please raise a Help Desk ticket here <help desk email link> if you need access.')
        next('/login')
      }
      else
      {
      authStringFinder.assign_survey_to_indivivdual = store.getters.getAuthString[0].toString().substring(17, 18) == '1'
      if (authStringFinder.assign_survey_to_indivivdual) {

        next()
      }
      else {
        alert('You do not have access to this function. Please raise a Help Desk ticket here <help desk email link> if you need access.')
        next('/')
      }
    }
  }
  },
  {
    path: "/edit_user_survey_details", // past name is = edit-survey
    name: "edit_user_survey_details",
    component: EditSurvey,
    beforeEnter: (to, from, next) => {
      if(store.getters.getAuthString[0] == null)
      {
        alert('You do not have access to this function. Please raise a Help Desk ticket here <help desk email link> if you need access.')
        next('/login')
      }
      else
      {
      authStringFinder.edit_user_survey_details = store.getters.getAuthString[0].toString().substring(18, 19) == '1'
      if (authStringFinder.edit_user_survey_details) {

        next()
      }
      else {
        alert('You do not have access to this function. Please raise a Help Desk ticket here <help desk email link> if you need access.')
        next('/')
      }
    }
  }
  },
  {
    path: "/delete_survey", // past name is = delete-survey
    name: "delete_survey",
    component: DeleteSurvey,
    beforeEnter: (to, from, next) => {
      if(store.getters.getAuthString[0] == null)
      {
        alert('You do not have access to this function. Please raise a Help Desk ticket here <help desk email link> if you need access.')
        next('/login')
      }
      else
      {
      authStringFinder.delete_survey = store.getters.getAuthString[0].toString().substring(19, 20) == '1'
      if (authStringFinder.delete_survey) {

        next()
      }
      else {
        alert('You do not have access to this function. Please raise a Help Desk ticket here <help desk email link> if you need access.')
        next('/')
      }
    }
  }
  },
  {
    path: "/view_individual_survey_progress", // past name is = /view-individual-survey-progress
    name: "view_individual_survey_progress",
    component: ViewIndividualSurveyProgress,
    beforeEnter: (to, from, next) => {
      if(store.getters.getAuthString[0] == null)
      {
        alert('You do not have access to this function. Please raise a Help Desk ticket here <help desk email link> if you need access.')
        next('/login')
      }
      else
      {
      authStringFinder.view_individual_survey_progress = store.getters.getAuthString[0].toString().substring(20, 21) == '1'
      if (authStringFinder.view_individual_survey_progress) {

        next()
      }
      else {
        alert('You do not have access to this function. Please raise a Help Desk ticket here <help desk email link> if you need access.')
        next('/')
      }
    }
  }
  },
  {
    path: "/view_individual_coachee_report", //past name is = view-individual-coachee-report
    name: "view_individual_coachee_report",
    component: ViewIndividualCoacheeReport,
    beforeEnter: (to, from, next) => {
      if(store.getters.getAuthString[0] == null)
      {
        alert('You do not have access to this function. Please raise a Help Desk ticket here <help desk email link> if you need access.')
        next('/login')
      }
      else
      {
      authStringFinder.view_individual_coachee_report = store.getters.getAuthString[0].toString().substring(23, 24) == '1'
      if (authStringFinder.view_individual_coachee_report) {

        next()
      }
      else {
        alert('You do not have access to this function. Please raise a Help Desk ticket here <help desk email link> if you need access.')
        next('/')
      }
    }
  }
  },
  {
    path: "/elevated-users", 
    name: "elevated_users",
    component: ElevatedUsers,
    props: true,
    beforeEnter: (to, from, next) => {
      if(store.getters.getAuthString[0] == null)
      {
        alert('You do not have access to this function. Please raise a Help Desk ticket here <help desk email link> if you need access.')
        next('/login')
      }
      else
      {
      authStringFinder.elevated_users = store.getters.getAuthString[0].toString().substring(48, 49) == '1'
      if (authStringFinder.elevated_users) {

        next()
      }
      else {
        alert('You do not have access to this function. Please raise a Help Desk ticket here <help desk email link> if you need access.')
        next('/')
      }
    }
  }
  },
  {
    path: "/iteration_control_center", 
    name: "AdminDashboard",
    component: AdminDashboard,
    beforeEnter: (to, from, next) => {
      if(store.getters.getAuthString[0] == null)
      {
        alert('You do not have access to this function. Please raise a Help Desk ticket here <help desk email link> if you need access.')
        next('/login')
      }
      else
      {
      authStringFinder.admin_dashboard = store.getters.getAuthString[0].toString().substring(26, 27) == '1'
      if (authStringFinder.admin_dashboard) {

        next()
      }
      else {
        alert('You do not have access to this function. Please raise a Help Desk ticket here <help desk email link> if you need access.')
        next('/')
      }
    }
  }
  },
  {
    path: "/report_builder", 
    name: "ReportBuilder",
    component: ReportBuilder,
    beforeEnter: (to, from, next) => {
      if(store.getters.getAuthString[0] == null)
      {
        alert('You do not have access to this function. Please raise a Help Desk ticket here <help desk email link> if you need access.')
        next('/login')
      }
      else
      {
      authStringFinder.report_builder = store.getters.getAuthString[0].toString().substring(54, 55) == '1'
      if (authStringFinder.report_builder) {

        next()
      }
      else {
        alert('You do not have access to this function. Please raise a Help Desk ticket here <help desk email link> if you need access.')
        next('/')
      }
    }
  }
  },
  {
    path: "/view_iteration_dashboard_report", // past name is = view-iteration-reports
    name: "view_iteration_dashboard_report",
    component: ViewIterationReports,
    beforeEnter: (to, from, next) => {
      if(store.getters.getAuthString[0] == null)
      {
        alert('You do not have access to this function. Please raise a Help Desk ticket here <help desk email link> if you need access.')
        next('/login')
      }
      else
      {
      authStringFinder.view_iteration_dashboard_report = store.getters.getAuthString[0].toString().substring(27, 28) == '1'
      if (authStringFinder.view_iteration_dashboard_report) {

        next()
      }
      else {
        alert('You do not have access to this function. Please raise a Help Desk ticket here <help desk email link> if you need access.')
        next('/')
      }
    }
  }
  },
  {
    path: "/view_coaching_group_reports", // past name is = view-coaching-group-reports
    name: "view_coaching_group_reports",
    component: ViewCoachingGroupReports,
    beforeEnter: (to, from, next) => {
      if(store.getters.getAuthString[0] == null)
      {
        alert('You do not have access to this function. Please raise a Help Desk ticket here <help desk email link> if you need access.')
        next('/login')
      }
      else
      {
      authStringFinder.view_coaching_group_reports = store.getters.getAuthString[0].toString().substring(47, 48) == '1'
      if (authStringFinder.view_coaching_group_reports) {

        next()
      }
      else {
        alert('You do not have access to this function. Please raise a Help Desk ticket here <help desk email link> if you need access.')
        next('/')
      }
    }
  }
  },
  {
    path: "/forced_multifactor_authentication", // past name is = forced-multi-factor-auth
    name: "forced_multifactor_authentication",
    component: ForcedMultiFactorAuthentication,
    beforeEnter: (to, from, next) => {
      if(store.getters.getAuthString[0] == null)
      {
        alert('You do not have access to this function. Please raise a Help Desk ticket here <help desk email link> if you need access.')
        next('/login')
      }
      else
      {
      authStringFinder.forced_multifactor_authentication = store.getters.getAuthString[0].toString().substring(53, 54) == '1'
      if (authStringFinder.forced_multifactor_authentication) {

        next()
      }
      else {
        alert('You do not have access to this function. Please raise a Help Desk ticket here <help desk email link> if you need access.')
        next('/')
      }
    }
  }
  },
  { 
    path: "/manage-org", // past name is manage-organisation
    name: "manage-org",
    component: ManageOrganisation,
    beforeEnter: (to, from, next) => {
      if(store.getters.getAuthString[0] == null)
      {
        alert('You do not have access to this function. Please raise a Help Desk ticket here <help desk email link> if you need access.')
        next('/login')
      }
      else
      {
      authStringFinder.manage_sub_organizations = store.getters.getAuthString[0].toString().substring(54, 55) == '1'
      if (authStringFinder.manage_sub_organizations) {

        next()
      }
      else {
        alert('You do not have access to this function. Please raise a Help Desk ticket here <help desk email link> if you need access.')
        next('/')
      }
    }
  }
     }, // new add in excel authstring
  {
    path: "/manage_sub_organizations", // past name is = /manage-sub-organisation
    name: "manage_sub_organizations",
    component: ManageSubOrganisation,
    beforeEnter: (to, from, next) => {
      if(store.getters.getAuthString[0] == null)
      {
        alert('You do not have access to this function. Please raise a Help Desk ticket here <help desk email link> if you need access.')
        next('/login')
      }
      else
      {
      authStringFinder.manage_sub_organizations = store.getters.getAuthString[0].toString().substring(51, 52) == '1'
      if (authStringFinder.manage_sub_organizations) {

        next()
      }
      else {
        alert('You do not have access to this function. Please raise a Help Desk ticket here <help desk email link> if you need access.')
        next('/')
      }
    }
  }
  },
  {
    path: "/edit_email_templates",
    name: "edit_email_templates",
    component: EditEmailTemplates,
    beforeEnter: (to, from, next) => {
      if(store.getters.getAuthString[0] == null)
      {
        alert('You do not have access to this function. Please raise a Help Desk ticket here <help desk email link> if you need access.')
        next('/login')
      }
      else
      {
        authStringFinder.manage_email_templates = store.getters.getAuthString[0].toString().substring(10, 11) == '1'
        if (authStringFinder.manage_email_templates) {

          next()
        }
        else {
          alert('You do not have access to this function. Please raise a Help Desk ticket here <help desk email link> if you need access.')
          next('/')
        }
      } 
    }
  },
  {
    path: "/manage_email_templates",
    name: "manage_email_templates",
    component: EmailTemplates,
    beforeEnter: (to, from, next) => {
      if(store.getters.getAuthString[0] == null)
      {
        alert('You do not have access to this function. Please raise a Help Desk ticket here <help desk email link> if you need access.')
        next('/login')
      }
      else
      {
      authStringFinder.manage_email_templates = store.getters.getAuthString[0].toString().substring(10, 11) == '1'
      if (authStringFinder.manage_email_templates) {

        next()
      }
      else {
        alert('You do not have access to this function. Please raise a Help Desk ticket here <help desk email link> if you need access.')
        next('/')
      }
    }
  }
  },
  {
    path: "/pdn_tile",
    name: "pdn_tile",
    component: "",
    beforeEnter: (to, from, next) => {
      if(store.getters.getAuthString[0] == null)
      {
        alert('You do not have access to this function. Please raise a Help Desk ticket here <help desk email link> if you need access.')
        next('/login')
      }
      else
      {
      authStringFinder.pdn_tile = store.getters.getAuthString[0].toString().substring(7, 8) == '1'
      if (authStringFinder.pdn_tile) {

        next()
      }
      else {
        alert('You do not have access to this function. Please raise a Help Desk ticket here <help desk email link> if you need access.')
        next('/')
      }
    }
  }
  },
  {
    path: "/manage_announcements",
    name: "manage_announcements",
    component: "",
    beforeEnter: (to, from, next) => {
      if(store.getters.getAuthString[0] == null)
      {
        alert('You do not have access to this function. Please raise a Help Desk ticket here <help desk email link> if you need access.')
        next('/login')
      }
      else
      {
      authStringFinder.manage_announcements = store.getters.getAuthString[0].toString().substring(11, 12) == '1'
      if (authStringFinder.manage_announcements) {

        next()
      }
      else {
        alert('You do not have access to this function. Please raise a Help Desk ticket here <help desk email link> if you need access.')
        next('/')
      }
    }
  }
  },
  {
    path: "/manage-brand",
    name: "manage-brand",
    component: ManageBrand,
    beforeEnter: (to, from, next) => {
      if(store.getters.getAuthString[0] == null)
      {
        alert('You do not have access to this function. Please raise a Help Desk ticket here <help desk email link> if you need access.')
        next('/login')
      }
      else
      {
      authStringFinder.brandscreen = store.getters.getAuthString[0].toString().substring(57, 58) == '1'
      if (authStringFinder.brandscreen) {

        next()
      }
      else {
        alert('You do not have access to this function. Please raise a Help Desk ticket here <help desk email link> if you need access.')
        next('/')
      }
    }
  }
  },
  {
    path: "/admin_dashboard",
    name: "/AdminDashboardClientAdminViewer",
    component: ClientAdminDashboard,
    beforeEnter: (to, from, next) => {
      if(store.getters.getAuthString[0] == null)
      {
        alert('You do not have access to this function. Please raise a Help Desk ticket here <help desk email link> if you need access.')
        next('/login')
      }
      else
      {
      authStringFinder.brandscreen = store.getters.getAuthString[0].toString().substring(58, 59) == '1'
      if (authStringFinder.brandscreen) {

        next()
      }
      else {
        alert('You do not have access to this function. Please raise a Help Desk ticket here <help desk email link> if you need access.')
        next('/')
      }
    }
  }
  },
  {
    path: "/manage-brand-create-edit",
    name:"manage-brand-create-edit",
    component: ManageBrandCreateEdit,
    beforeEnter: (to, from, next) => {
      if(store.getters.getAuthString[0] == null)
      {
        alert('You do not have access to this function. Please raise a Help Desk ticket here <help desk email link> if you need access.')
        next('/login')
      }
      else
      {
      authStringFinder.brandcreateedit = store.getters.getAuthString[0].toString().substring(57, 58) == '1'
      if (authStringFinder.brandcreateedit) {
        next()
      }
      else {
        alert('You do not have access to this function. Please raise a Help Desk ticket here <help desk email link> if you need access.')
        next('/')
      }
    }
  }
  },
  {
    path: "/make_nominations", 
    name: "make_nominations", 
    component: MakeNominations,
    beforeEnter: (to, from, next) => {
      if(store.getters.getAuthString[0] == null)
      {
        alert('You do not have access to this function. Please raise a Help Desk ticket here <help desk email link> if you need access.')
        next('/login')
      }
      else
      {
      authStringFinder.makenominationscreen = store.getters.getAuthString[0].toString().substring(0, 1) == '1'
      if (authStringFinder.makenominationscreen) {
        next()
      }
      else {
        alert('You do not have access to this function. Please raise a Help Desk ticket here <help desk email link> if you need access.')
        next('/')
      }
    }
  }
  },
  {
    path: "/survey", 
    name: "MySurvey", 
    component: MySurvey,
    beforeEnter: (to, from, next) => {
      if(store.getters.getAuthString[0] == null)
      {
        alert('You do not have access to this function. Please raise a Help Desk ticket here <help desk email link> if you need access.')
        next('/login')
      }
      else
      {
      authStringFinder.mysurvey = store.getters.getAuthString[0].toString().substring(0, 1) == '1'
      if (authStringFinder.mysurvey) {
        next()
      }
      else {
        alert('You do not have access to this function. Please raise a Help Desk ticket here <help desk email link> if you need access.')
        next('/')
      }
    }
  }
  },
  {path: "/library_editor", name: "LibraryEditor", component: LibraryEditor},
  {path: "/two_FA", name: "twoFA", component: TwoFactorAuthenticator },
  {path: "/admin-link-router", component: AdminLinkRouter },
  {path: "/login", component: LoginComponent },
  {path: "/help", name: "HelpPageComponent", component: HelpPageComponent},
  {path: "/cr-participant-progress", component: CrParticipantProgress },
  {path: "/view-iteration-progress-reports", component: ViewIterationProgressReports }, // cannot find in excel
  {path: "/view-individual-report", component: ViewIndividualReport }, // not in excel
  {path: "/coaching-reports", component: CoachingReports }, // not in excel <-------------------------------
  {path: "/create_report", component: createReport},
  {path: "/manage_surveys", component: ManageSurveys},
  {path: "/manage_reports", component: ManageReports},
  {path: "/report_builder", name: "ReportBuilder", component: ReportBuilder},
  {path: "/manage_surveys_create_edit", name:"manage_surveys_create_edit", component: ManageSurveysCreateEdit},
  {path: "/manage_reports_create_edit", name:"manage_reports_create_edit", component: ManageReportsCreateEdit},
  {path: "/createHTML", component: createHTMLView},

  {path: "/privacy_page", component: PrivacyPage},
  {path: "/tos", component: TermsOfService},
  {path: "/forgot_password_screen", name: "forgot_password_screen", component: ForgotPasswordScreen},
  {path: "/set_password", component: ForgotPasswordSetPassword},
  {path: "/create_survey", component: CreateSurvey},
  {path: "/my-report", name: "MyReport", component: MyReport},
  {path: "/survey-builder", name: "SurveyBuilder", component: SurveyBuilder},

];

export default routes;
