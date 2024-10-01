<script setup>
import api from "../api/api";
import DescriptionInline from "./DescriptionInline.vue";
import ButtonSubmit from "./ButtonSubmit.vue";
import Swal from "sweetalert2";
import { flashMessage } from "../functions.js";
</script>

<template>
  <div class="surveyTemplateSection">
    <div>
      <input
        v-model="searchData"
        placeholder="Search for"
        class="searchInput"
        ref="search"
      />
    </div>

    <div class="d-flex">
      <div>
        <ButtonSubmit label="Find" @click="searchResult" />
      </div>
      <div class="ml-1">
        <ButtonSubmit @click="sendAddProps('add')" label="Add" />
      </div>
    </div>

    <br />

    <!-- pagination -->
    <div v-show="isPagination" class="pagination">
      <div class="d-flex">
        <div>
          <button type="button" :disabled="isInFirstPage" @click="page--">
            Previous
          </button>
        </div>

        <div
          v-for="pageNumber in pageLength
            ? pages.slice(page - 1, page + 5)
            : pages"
          :key="pageNumber"
          @click="page = pageNumber"
        >
          <button
            style="background-color: #0e5071; color: white"
            v-if="pageNumber == page"
          >
            {{ pageNumber }}
          </button>
          <button v-else>{{ pageNumber }}</button>
        </div>

        <div>
          <button type="button" @click="page++" :disabled="isInLastPage">
            Next
          </button>
        </div>
      </div>
      <div>
        <p class="font-text-size">{{ resultsFound }} results found</p>
      </div>
    </div>
    <!-- end of pagination -->

    <table id="table">
      <tr>
        <th class="th-text-right">#</th>
        <th>Report Name</th>
        <th>Report Description</th>
        <th>Report .html</th>
        <th>Survey Name</th>
        <th>Survey File</th>
        <th>Survey Type</th>
        <th>Coach Report</th>
        <th>Group Report</th>
        <th>Faculty Report</th>
        <th>Action</th>
      </tr>
      <tr
        v-for="(data, i) in displaySurveyTemplates"
        :key="data.report_template_id"
        :value="data.report_template_id"
        style="cursor: pointer"
      >
        <td class="th-text-right">{{ perPage * (page - 1) + i + 1 }}</td>
        <td>{{ data.report_template_name }}</td>
        <td>{{ data.report_description }}</td>
        <td>{{ data.report_file }}</td>
        <td>{{ data.survey_template_name }}</td>
        <td>{{ data.survey_file_name }}</td>
        <td>
          {{
            data.survey_type == 3
              ? "Research confirmation"
              : data.survey_type == 2
              ? "360 nominations"
              : data.survey_type == 1
              ? "Self assessment"
              : data.survey_type == 4
              ? "Q-sort"
              : data.survey_type == 5
              ? "VFP"
              : ""
          }}
        </td>
        <td>{{ data.is_coach_report == 1 ? "Yes" : "No" }}</td>
        <td>{{ data.is_group_report == 1 ? "Yes" : "No" }}</td>
        <td>{{ data.is_faculty_report == 1 ? "Yes" : "No" }}</td>
        <td style="width: 100px; text-align: center">
          <button
            style="width: 72px; margin-bottom: 10px"
            @click="
              sendUpdateProps(
                'update',
                data.report_template_id,
                data.report_template_name,
                data.report_description,
                data.report_file,
                data.survey_template_id,
                data.tag_type,
                data.survey_template_name,
                data.survey_file_name,
                data.survey_type,
                data.is_coach_report,
                data.is_group_report,
                data.is_faculty_report,
              )
            "
          >
            Edit <font-awesome-icon icon="pencil" />
          </button>
          <button
            @click="
              deleteSurveyTemplate(
                data.report_template_id,
                data.report_template_name
              )
            "
          >
            Delete <font-awesome-icon icon="trash" />
          </button>
        </td>
      </tr>
    </table>
    <p class="font-text-size text-center" v-show="noResultFound">
      No result found.
    </p>
  </div>
</template>

<script>
export default {
  name: 'ManageReportsBox',
  components: [DescriptionInline, ButtonSubmit],
  props: ["userData", "brandData"],
  data: () => ({
    page: 1,
    perPage: 0,
    pages: [],
    isPagination: false,
    resultsFound: "",
    filteredSurveyTemplatesList: [],
    searchData: "",
    noResultFound: false,
  }),
  mounted() {
    api.get(`brands-max-limit/org/${this.userData.org_id}`).then((response) => {
      this.perPage = response.data.max_search_results;
      if (this.perPage == undefined) this.perPage = 25;
    });
  },
  methods: {
    paginate(surveyLists) {
      const from = this.page * this.perPage - this.perPage;
      const to = this.page * this.perPage;
      return surveyLists.slice(from, to);
    },
    searchResult() {
      this.pages = [];
      api.get(`report-templates`).then((response) => {
        this.pages = [];
        this.page = 1;
        const res = response.data;

        this.filteredSurveyTemplatesList = res.filter((data) => {
          this.noResultFound = false;

          const reportTemplateName = data.report_template_name ? data.report_template_name.toLowerCase() : ''
          const reportDescription = data.report_description ? data.report_description.toLowerCase() : ''
          const reportFile = data.report_file ? data.report_file.toLowerCase() : ''
          const surveyTemplateName = data.survey_template_name ? data.survey_template_name.toLowerCase() : ''
          const surveyFile = data.survey_file ? data.survey_file.toLowerCase() : ''
          const surveyType = data.survey_type ? data.survey_type.toLowerCase() : ''

          return (
            reportTemplateName.includes(this.searchData.toLowerCase()) ||
            reportDescription.includes(this.searchData.toLowerCase()) ||
            reportFile.includes(this.searchData.toLowerCase()) ||
            surveyTemplateName.includes(this.searchData.toLowerCase()) ||
            surveyFile.includes(this.searchData.toLowerCase()) ||
            surveyType.includes(this.searchData.toLowerCase()) 
          );
        })

        this.resultsFound = this.filteredSurveyTemplatesList.length;

        if (this.filteredSurveyTemplatesList.length == 0) {
          this.noResultFound = true;
          this.isPagination = false;
          return;
        }

        let numberOfPages = Math.ceil(
          this.filteredSurveyTemplatesList.length / this.perPage
        );
        for (let index = 1; index <= numberOfPages; index++) {
          this.pages.push(index);
        }
        this.isPagination = true;
      });
    },

    sendAddProps(status) {
      const data = { status: status };
      this.$router.push({
        name: "manage_reports_create_edit",
        params: { data: JSON.stringify(data) },
      });
    },

    sendUpdateProps(
                status,
                report_template_id,                 
                report_template_name,
                report_description,
                report_file,
                survey_template_id,
                tag_type,
                survey_template_name,
                survey_file_name,
                survey_type,
                coach_report,
                coach_group_report,
                faculty_report
                ) {
      const data = {
        status: status,
        report_template_id: report_template_id,
        report_template_name: report_template_name,
        report_description: report_description,
        report_file: report_file,
        survey_template_id: survey_template_id,
        tag_type: tag_type,
        survey_template_name: survey_template_name,
        survey_file: survey_file_name,
        survey_type: survey_type,
        is_coach_report: coach_report,
        is_group_report: coach_group_report,
        is_faculty_report: faculty_report
      };
      this.$router.push({
        name: "manage_reports_create_edit",
        params: { data: JSON.stringify(data) },
      });
    },
    deleteSurveyTemplate(id, name) {
      Swal.fire({
        text: `Are you sure you want to delete the ${name}?`,
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Ok",
      }).then((result) => {
        if (result.value) {
          api
            .delete(`report-template/${id}`)
            .then((res) => {
              console.log(res);
              if (res.status) {
                this.searchResult();
                flashMessage(
                  this.$flashMessage,
                  this.brandData.accent_color1
                    ? this.brandData.accent_color1
                    : "#F47820",
                  this.brandData.flash_text_color
                    ? this.brandData.flash_text_color
                    : "#ffffff",
                  name + " has been deleted!"
                );
              }
            })
            .catch((e) => {
              flashMessage(
                this.$flashMessage,
                this.brandData.accent_color1
                  ? this.brandData.accent_color1
                  : "#F47820",
                this.brandData.flash_text_color
                  ? this.brandData.flash_text_color
                  : "#ffffff",
                e.message
              );
            });
        }
      });
    },
  },
  computed: {
    displaySurveyTemplates() {
      return this.paginate(this.filteredSurveyTemplatesList);
    },
    isInFirstPage() {
      return this.page == 1;
    },
    isInLastPage() {
      return this.page >= this.pages.length;
    },
    pageLength() {
      return this.pages.length > 5;
    },
  },
};
</script>

<style scoped>
.surveyTemplateSection {
  width: 90vw;
}
.searchInput {
  outline: 0;
  border-width: 0 0 1px;
  border-color: grey;
  padding: 2px 5px;
  margin: 10px 0px;
  font-size: 14px;
  width: 99%;
}
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  margin-left: 3px;
  margin-right: 3px;
}

#table {
  width: 100%;
  table-layout: auto;
  border-collapse: collapse;
}

#table td,
#table th {
  border: 1px solid #ddd;
  padding: 8px;
  font-size: 1vw;
  /* word-break: word-wrap; */
}

#table tr:nth-child(even) {
  background-color: #f2f2f2;
}

#table tr:hover {
  background-color: #ddd;
}

#table th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #0e5071;
  color: white;
}

#table td {
  text-align: left;
  vertical-align: middle;
}
.th-text-right {
  text-align: right !important;
}
input, select, option, textarea {
  border: 1px solid grey;
}
</style>
