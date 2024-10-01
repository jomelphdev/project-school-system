<script setup></script>

<template>
  <div class="wrapper">
    <div class="sidenav">
      <ul>
        <li>
          <router-link @click.prevent="menuClicked()" to="/">
            <div class="icon_container">
              <i class="icon-color-sidebar fa-solid fa-house"></i>
            </div>
            Home
          </router-link>
        </li>

        <!-- <li v-if="this.SidenavItems.MySkillBuildingActionsTiles">
          <router-link @click.prevent="menuClicked()" to="/my_skill_building_actions_tiles">
            <div class="icon_container">
              <i class="icon-color-sidebar fa-solid fa-clipboard-list"></i>
            </div>
            My Surveys
          </router-link>
        </li> -->

        <li v-if="this.SidenavItems.MyProfile">
          <router-link @click.prevent="menuClicked()" to="/my_profile">
            <div class="icon_container">
              <i class="icon-color-sidebar fa-solid fa-address-card"></i>
            </div>
            My Profile
          </router-link>
        </li>

        <!-- <li v-if="this.SidenavItems.SurveyTile">
          <router-link @click.prevent="menuClicked()" to="/survey_tile">
            <div class="icon_container">
              <i class="icon-color-sidebar fa-solid fa-file-pen"></i>
            </div>
            Take Survey
          </router-link>
        </li> -->

        <!-- <li v-if="this.SidenavItems.PDNTile">
          <router-link @click.prevent="menuClicked()" to="/pdn_tile">
            <div class="icon_container">
              <i class="icon-color-sidebar fa-solid fa-file-pen"></i>
            </div>
            Take PDN
          </router-link>
        </li> -->

        <!-- <li v-if="this.SidenavItems.MyReportsAvailableTiles">
          <router-link @click.prevent="menuClicked()" to="/my_reports_available_tiles">
            <div class="icon_container">
              <i class="icon-color-sidebar fa-solid fa-chart-pie"></i>
            </div>
            My Reports
          </router-link>
        </li> -->

        <li v-if="this.SidenavItems.ManageOrgAdminUsers">
          <router-link @click.prevent="menuClicked()" to="/manage_org_admin_users">
            <div class="icon_container">
              <i class="icon-color-sidebar fa-solid fa-user-group"></i>
            </div>
            Manage Org Admin Users
          </router-link>
        </li>

        <li v-if="this.SidenavItems.ManageUser">
          <router-link @click.prevent="menuClicked()" to="/manage_user">
            <div class="icon_container">
              <i class="icon-color-sidebar fa-solid fa-user-group"></i>
            </div>
            Manage Users
          </router-link>
        </li>

        <li v-if="this.SidenavItems.UploadManyUsersAtOnce">
          <router-link @click.prevent="menuClicked()" to="/upload_many_users_at_once">
            <div class="icon_container">
              <i class="icon-color-sidebar fa-solid fa-people-group"></i>
            </div>
            Upload Bulk Users
          </router-link>
        </li>

        <li v-if="this.SidenavItems.ManageEmailTemplates">
          <router-link @click.prevent="menuClicked()" to="/manage_email_templates">
            <div class="icon_container">
              <i class="icon-color-sidebar fa-solid fa-envelope"></i>
            </div>
            Manage Templates
          </router-link>
        </li>

        <!-- <li v-if="this.SidenavItems.EditEmailTemplates">
          <router-link @click.prevent="menuClicked()" to="/edit_email_templates">
            <div class="icon_container">
              <i class="icon-color-sidebar fa-solid fa-envelope"></i>
            </div>
            Edit Email Templates
          </router-link>
        </li> -->

        <li v-if="this.SidenavItems.ViewBillingInformation">
          <router-link @click.prevent="menuClicked()" to="/view_billing_information">
            <div class="icon_container">
              <i class="icon-color-sidebar fa-solid fa-credit-card"></i>
            </div>
            View Billing Information
          </router-link>
        </li>

        <!-- <li v-if="this.SidenavItems.ViewActiveSurveys">
          <router-link @click.prevent="menuClicked()" to="/view_active_surveys">
            <div class="icon_container">
              <i class="icon-color-sidebar fa-solid fa-graduation-cap"></i>
            </div>
            Active Surveys
          </router-link>
        </li> -->

        <!-- <li v-if="this.SidenavItems.AssignSurveysToAGroup">
          <router-link @click.prevent="menuClicked()" to="/assign_surveys_to_a_group">
            <div class="icon_container">
              <i class="icon-color-sidebar fa-solid fa-notes-medical"></i>
            </div>
            Bulk Assign Surveys
          </router-link>
        </li> -->

        <!-- <li v-if="this.SidenavItems.ViewSurveyPreview">
          <router-link @click.prevent="menuClicked()" to="/view_survey_preview">
            <div class="icon_container">
              <i class="icon-color-sidebar fa-solid fa-clipboard-list"></i>
            </div>
            View Survey Preview
          </router-link>
        </li> -->

        <li v-if="this.SidenavItems.ManageOrg">
          <router-link @click.prevent="menuClicked()" to="/manage-org">
            <div class="icon_container">
              <i class="icon-color-sidebar fa-solid fa-building"></i>
            </div>
            Manage Org
          </router-link>
        </li>

        <li v-if="this.SidenavItems.ManageSubOrganizations">
          <router-link @click.prevent="menuClicked()" to="/manage_sub_organizations">
            <div class="icon_container">
              <i class="icon-color-sidebar fa-solid fa-building"></i>
            </div>
            Manage Sub Org
          </router-link>
        </li>

        <li v-if="this.SidenavItems.ViewElevatedUsers">
          <router-link @click.prevent="menuClicked()" to="/elevated-users">
            <div class="icon_container">
              <i class="icon-color-sidebar fa-solid fa-arrows-down-to-people"></i>
            </div>
            View Elevated Users
          </router-link>
        </li>

        <li v-if="this.SidenavItems.AdminDashboard">
          <router-link @click.prevent="menuClicked()" to="/iteration_control_center">
            <div class="icon_container">
              <i class="icon-color-sidebar fa-solid fa-clipboard-list"></i>
            </div>
            Iteration Control Center
          </router-link>
        </li>

        <!-- <li v-if="this.SidenavItems.ViewIterationReports">
          <router-link @click.prevent="menuClicked()" to="/view_iteration_dashboard_report">
            <div class="icon_container">
              <i class="icon-color-sidebar fa-solid fa-chart-bar"></i>
            </div>
            View Iteration Reports
          </router-link>
        </li> -->
        <!-- 
        <li v-if="this.SidenavItems.ViewCoachingGroupReports">
          <router-link @click.prevent="menuClicked()" to="/view_coaching_group_reports">
            <div class="icon_container">
              <i class="icon-color-sidebar fa-solid fa-people-group"></i>
            </div>
            View Coaching Group Reports
          </router-link>
        </li> -->

        <li v-if="this.SidenavItems.ManageAnnouncements">
          <router-link @click.prevent="menuClicked()" to="/manage_announcements">
            <div class="icon_container">
              <i class="icon-color-sidebar fa-solid fa-bullhorn"></i>
            </div>
            Manage Announcements
          </router-link>
        </li>

        <!-- <li v-if="this.SidenavItems.ForcedMultiFactorAuthentication">
          <router-link @click.prevent="menuClicked()" to="/forced_multifactor_authentication">
            <div class="icon_container">
              <i class="icon-color-sidebar fa-solid fa-circle-exclamation"></i>
            </div>
            Forced Multi-Factor Authentication
          </router-link>
        </li> -->

        <li v-if="this.SidenavItems.CreateReport">
          <router-link @click.prevent="menuClicked()" to="/create_report">
            <div class="icon_container">
              <i class="icon-color-sidebar fa-solid fa-clipboard-list"></i>
            </div>
            Create Report
          </router-link>
        </li>

        <li v-if="this.SidenavItems.CreateSurvey">
          <router-link @click.prevent="menuClicked()" to="/create_survey">
            <div class="icon_container">
              <i class="icon-color-sidebar fa-solid fa-folder-plus"></i>
            </div>
            Create Survey
          </router-link>
        </li>

        <li v-if="this.SidenavItems.ManageSurveys">
          <router-link @click.prevent="menuClicked()" to="/manage_surveys">
            <div class="icon_container">
              <i class="icon-color-sidebar fa-solid fa-clipboard-list"></i>
            </div>
            Manage Surveys
          </router-link>
        </li>

        <li v-if="this.SidenavItems.ManageReports">
          <router-link @click.prevent="menuClicked()" to="/manage_reports">
            <div class="icon_container">
              <i class="icon-color-sidebar fa-solid fa-clipboard-list"></i>
            </div>
            Manage Reports
          </router-link>
        </li>

        <li v-if="this.SidenavItems.createHTML">
          <router-link @click.prevent="menuClicked()" to="/createHTML">
            <div class="icon_container">
              <i class="icon-color-sidebar fa-solid fa-file-code"></i>
            </div>
            Create HTML
          </router-link>
        </li>

        <li v-if="this.SidenavItems.DragnDrop">
          <a href="https://mnetdemo.gcm3.com/dragdrop.html">
            <div class="icon_container">
              <i class="icon-color-sidebar fa-solid fa-bars"></i>
            </div>
            Drag and Drop
          </a>
        </li>

        <li v-if="this.SidenavItems.BrandScreen">
          <router-link @click.prevent="menuClicked()" to="/manage-brand">
            <div class="icon_container">
              <i class="icon-color-sidebar fa-solid fa-building"></i>
            </div>
            Manage Brand
          </router-link>
        </li>

        <li v-if="this.SidenavItems.ClientAdminDashboard">
          <router-link @click.prevent="menuClicked()" to="/admin_dashboard">
            <div class="icon_container">
              <i class="icon-color-sidebar fa-solid fa-clipboard-list"></i>
            </div>
            Admin Dashboard
          </router-link>
        </li>

        <li v-if="this.SidenavItems.LibraryEditor">
          <router-link @click.prevent="menuClicked()" to="/library_editor">
            <div class="icon_container">
              <i class="icon-color-sidebar fa-solid fa-clipboard-list"></i>
            </div>
            360 Library Editor
          </router-link>
        </li>

        <li v-if="this.SidenavItems.SurveyBuilder">
          <router-link @click.prevent="menuClicked()" to="/survey-builder">
            <div class="icon_container">
              <i class="icon-color-sidebar fa-solid fa-clipboard-list"></i>
            </div>
            360 Survey Builder
          </router-link>
        </li>

        <li v-if="this.SidenavItems.ReportBuilder">
          <router-link @click.prevent="menuClicked()" to="/report_builder">
            <div class="icon_container">
              <i class="icon-color-sidebar fa-solid fa-clipboard-list"></i>
            </div>
            360 Report Builder
          </router-link>
        </li>

      </ul>
    </div>
  </div>
</template>

<script>
import store from "../store/store.js";
export default {
  data: () => ({
    SidenavItems: {
      ViewAnnouncements: false,
      ChangeWebsiteLanguage: false,
      MySkillBuildingActionsTiles: false,
      SurveyTile: false,
      PDNTile: false,
      MyReportsAvailableTiles: false,
      MyProfile: false,
      ManageEmailTemplates: false,
      EditEmailTemplates: false,
      ManageAnnouncements: false,
      ViewSurveyPreview: false,
      ManageUser: false,
      UploadManyUsersAtOnce: false,
      AssignSurveysToAGroup: false,
      AdminDashboard: false,
      ViewIterationReports: false,
      ViewCoachingGroupReports: false,
      ViewElevatedUsers: false,
      ViewBillingInformation: false,
      ViewActiveSurveys: false,
      ManageSubOrganizations: false,
      ManageOrgAdminUsers: false,
      ForcedMultiFactorAuthentication: false,
      ManageOrg: false,
      CreateReport: false,
      ManageSurveys: false,
      ManageReports: false,
      ReportBuilder: false,
      CreateSurvey: false,
      BrandScreen: false,
      ClientAdminDashboard: false,
      SurveyBuilder: false,
      LibraryEditor: false,
    },
    isClicked: true,
  }),
  props: {},
  methods: {
    menuClicked() {
      this.isClicked = false;
      this.$emit("navbarclick", this.isClicked);
    },
  },
  mounted() {
    const authString = store.getters.getAuthString;
    this.SidenavItems.ViewAnnouncements =
      authString[0].toString().substring(1, 2) == "1";
    this.SidenavItems.ChangeWebsiteLanguage =
      authString[0].toString().substring(2, 3) == "1";
    this.SidenavItems.MySkillBuildingActionsTiles =
      authString[0].toString().substring(5, 6) == "1";
    this.SidenavItems.SurveyTile =
      authString[0].toString().substring(6, 7) == "1";
    this.SidenavItems.PDNTile = authString[0].toString().substring(7, 8) == "1";
    this.SidenavItems.MyReportsAvailableTiles =
      authString[0].toString().substring(8, 9) == "1";
    this.SidenavItems.MyProfile =
      authString[0].toString().substring(9, 10) == "1";
    this.SidenavItems.EditEmailTemplates =
      authString[0].toString().substring(10, 11) == "1";
    this.SidenavItems.ManageEmailTemplates =
      authString[0].toString().substring(10, 11) == "1";
    this.SidenavItems.ManageAnnouncements =
      authString[0].toString().substring(11, 12) == "1";
    this.SidenavItems.ViewSurveyPreview =
      authString[0].toString().substring(12, 13) == "1";
    this.SidenavItems.ManageUser =
      authString[0].toString().substring(14, 15) == "1"; // fix coach disable manager user
    this.SidenavItems.UploadManyUsersAtOnce =
      authString[0].toString().substring(24, 25) == "1";
    this.SidenavItems.AssignSurveysToAGroup =
      authString[0].toString().substring(25, 26) == "1";
    this.SidenavItems.AdminDashboard =
      authString[0].toString().substring(26, 27) == "1";
    this.SidenavItems.ManageReports =
      authString[0].toString().substring(26, 27) == "1";
    this.SidenavItems.ViewIterationReports =
      authString[0].toString().substring(27, 28) == "1";
    this.SidenavItems.ViewCoachingGroupReports =
      authString[0].toString().substring(47, 48) == "1";
    this.SidenavItems.ViewElevatedUsers =
      authString[0].toString().substring(48, 49) == "1";
    this.SidenavItems.ViewBillingInformation =
      authString[0].toString().substring(49, 50) == "1";
    this.SidenavItems.ViewActiveSurveys =
      authString[0].toString().substring(50, 51) == "1";
    this.SidenavItems.ManageSubOrganizations =
      authString[0].toString().substring(51, 52) == "1";
    this.SidenavItems.ManageOrgAdminUsers =
      authString[0].toString().substring(52, 53) == "1";
    this.SidenavItems.ForcedMultiFactorAuthentication =
      authString[0].toString().substring(53, 54) == "1";
    this.SidenavItems.ManageOrg =
      authString[0].toString().substring(54, 55) == "1";
    this.SidenavItems.CreateReport =
      authString[0].toString().substring(55, 56) == "1";
    this.SidenavItems.ManageSurveys =
      authString[0].toString().substring(56, 57) == "1";
    this.SidenavItems.ReportBuilder =
      authString[0].toString().substring(54, 55) == "1";
    this.SidenavItems.createHTML =
      authString[0].toString().substring(56, 57) == "1";
    this.SidenavItems.DragnDrop =
      authString[0].toString().substring(56, 57) == "1";
    this.SidenavItems.CreateSurvey =
      authString[0].toString().substring(56, 57) == "1";
    this.SidenavItems.BrandScreen =
      authString[0].toString().substring(57, 58) == "1";
    this.SidenavItems.ClientAdminDashboard =
      authString[0].toString().substring(58, 59) == "1";
    this.SidenavItems.SurveyBuilder =
      authString[0].toString().substring(54, 55) == "1";
    this.SidenavItems.LibraryEditor =
      authString[0].toString().substring(54, 55) == "1";
  },
};
</script>

<style scoped>
* {
  padding: 0px;
  list-style: none;
  text-decoration: none;
  font-family: "Arial";
  transition: all 150ms ease;
  font-weight: bold;
}

.wrapper {
  height: 100%;
}

.wrapper .sidenav {
  width: 240px;
  box-shadow: 10px -5px 20px -0.7px rgba(0, 0, 0, 0.2);
  border-style: solid;
  border-color: #54575b20;
  border-width: 1px;
  background-color: white;
  height: inherit;
  position: absolute;
  z-index: 99;
}

ul {
  padding-top: 5px;
}

.wrapper .sidenav ul li {
  padding: 4px;
}

.wrapper .sidenav ul li a {
  color: #252525af;
  display: block;
}

.wrapper .sidenav ul li a .icon_container {
  padding-bottom: 1px;
  color: #252525af;
  float: left;
  width: 34px;
  text-align: center;
  font-size: 15.5px;
}

.wrapper .sidenav ul li:hover {
  background-color: #54575b20;
}

.wrapper .sidenav ul li:hover a {
  color: #252525af;
}
</style>
