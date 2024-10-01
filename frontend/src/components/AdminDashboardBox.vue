<script setup>
import DescriptionInline from "./DescriptionInline.vue";
import DropDownInfo from "./DropDownInfo.vue";
import DropDownInfoNumbered from "./DropDownInfoNumbered.vue";
import HeaderReport from "./HeaderReport.vue";
import FieldNameInline from "./FieldNameInline.vue";
import api from "../api/api";
import Swal from "sweetalert2";
import ButtonSubmit from "./ButtonSubmit.vue";
import Multiselect from "@vueform/multiselect";
import { flashMessage } from "../functions.js";
import ClipLoader from "vue-spinner/src/ClipLoader.vue";
import AdminDashboardNominationModal from "./AdminDashboardNominationModal.vue";
import AdminDashboardNomineeDetailsModal from "./AdminDashboardNomineeDetailsModal.vue";
</script>

<template>
  <div>
    <form @submit.prevent="handleSubmit">
      <div class="main-div">
        <label style="color: #ccc" for="organization"
          ><DescriptionInline label="Your organization"
        /></label>
        <p id="organization">{{ org_id }}</p>

        <label style="color: #ccc" for="selectSubOrganization"
          ><DescriptionInline label="Select sub-organization "
        /></label>
        <select
          class="input"
          id="selectSubOrganization"
          name="sub_organization"
          v-model="survey.suborg_id"
          @change="clearData"
        >
          <option selected :value="null">Select sub-organization</option>
          <option
            v-for="suborg in filteredSubOrg"
            v-bind:key="suborg.suborg_id"
            v-bind:value="suborg.suborg_id"
          >
            {{ suborg.suborg_name }}
          </option>
        </select>

        <label style="color: #ccc" for="selectProgram"
          ><DescriptionInline label="Select program "
        /></label>
        <select
          class="input"
          id="selectProgram"
          name="program"
          v-model="survey.program_id"
          @change="clearData"
        >
          <option selected :value="null">Select program</option>
          <option
            v-for="program in filteredProgram"
            v-bind:key="program.program_id"
            v-bind:value="program.program_id"
          >
            {{ program.program_name }}
          </option>
        </select>

        <label style="color: #ccc" for="selectIteration"
          ><DescriptionInline label="Select iteration "
        /></label>
        <select
          class="input"
          id="selectIteration"
          name="iteration"
          v-model="survey.iteration_id"
          @change="clearData"
        >
          <option selected :value="null">Select iteration</option>
          <option
            v-for="iteration in filteredIteration"
            v-bind:key="iteration.iteration_id"
            v-bind:value="iteration.iteration_id"
          >
            {{ iteration.iteration_name }}
          </option>
        </select>

        <label style="color: #ccc" for="selectStream"
          ><DescriptionInline label="Select stream "
        /></label>
        <select
          class="input"
          id="selectStream"
          name="stream"
          v-model="survey.stream_id"
          @change="clearData"
        >
          <option selected :value="null">Select stream</option>
          <option
            v-for="stream in filteredStream"
            v-bind:key="stream.stream_id"
            v-bind:value="stream.stream_id"
          >
            {{ stream.stream_name }}
          </option>
        </select>

        <label style="color: #ccc" for="selectTemplate"
          ><DescriptionInline label="Select survey template "
        /></label>
        <select
          class="input"
          id="selectTemplate"
          name="template"
          v-model="template_id"
          @change="
            showSurveyType();
            clearData();
          "
        >
          <option selected :value="null">Select survey template</option>
          <option
            v-for="template in filteredSurveyTemplate"
            v-bind:key="template.survey_template_id"
            v-bind:value="template.survey_template_id"
          >
            {{ template.survey_template_name }} - {{ template.survey_file }}
          </option>
        </select>

        <br />
        <div style="display: flex">
          <input
            type="checkbox"
            v-model="showIndividualRecords"
            @change="clearData"
          />
          <label style="margin: 0 0 0 2px">Show only individual records.</label>
        </div>
        <br />
        <ButtonSubmit
          class="search-btn"
          label="Search"
          @click.prevent="searchResult"
          :disabled="disableSearchButton"
        />
        <br />
        <br />

        <div class="boxStatistics" style="padding: 0 10px 0 10px; width: 10%">
          <div>
            <p style="color: #f47820"><strong>Statistics</strong></p>
            <clip-loader
              v-if="survey.iteration_id != null"
              :loading="setLoading"
              :color="setColor"
              :size="setSize"
            ></clip-loader>
            <div v-for="stat in statisticsData" :key="stat">
              <div v-if="setLoading == false && survey.iteration_id != null">
                <label class="statistics-label"
                  >Participants: {{ stat.participants_count }}</label
                >
                <br />
                <label class="statistics-label"
                  >Participants registered:
                  {{ stat.participants_registered }} ({{
                    participantsRegisteredPercentage.toFixed(1)
                  }}%)</label
                ><br />
                <label class="statistics-label"
                  >Participants submitted: {{ stat.participants_submitted }} ({{
                    participantsSubmittedPercentage.toFixed(1)
                  }}%)</label
                ><br />
                <label class="statistics-label"
                  >Participants eligible for report:
                  {{ stat.participants_eligible }} ({{
                    participantsEligiblePercentage.toFixed(1)
                  }}%)</label
                ><br />
                <label class="statistics-label"
                  >Total nominees: {{ stat.nominees_count }} ({{
                    totalNomineesPercentage.toFixed(1)
                  }}
                  per participant)</label
                ><br />
                <label class="statistics-label"
                  >Total nominees submitted: {{ stat.nominees_submitted }} ({{
                    totalNomineesSubmittedPercentage.toFixed(1)
                  }}
                  per participant)</label
                ><br />
              </div>
            </div>
          </div>
          <br />
        </div>

        <br />
        <br />
        <div
          class="boxReports"
          style="
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            flex-wrap: wrap;
          "
        >
          <div class="label-div">
            <div>
              <strong>Iteration History</strong>
            </div>
            <button
              class="label-btn"
              @click.prevent="toggleIterationLog = !toggleIterationLog"
              v-show="!toggleIterationLog"
            >
              Show
            </button>
            <button
              class="label-btn"
              @click.prevent="toggleIterationLog = !toggleIterationLog"
              v-show="toggleIterationLog"
            >
              Hide
            </button>
          </div>
          <div
            class="box-div"
            v-show="toggleIterationLog"
            style="padding: 0 10px 0 10px"
          >
            <br />
            <div id="iteration-log-table-container">
              <clip-loader
                v-if="survey.iteration_id !== null"
                :loading="setLoading"
                :color="setColor"
                :size="setSize"
              ></clip-loader>
              <table
                id="iteration-log-table"
                v-if="setLoading === false && survey.iteration_id !== null"
              >
                <tr>
                  <th>Action</th>
                  <th>When</th>
                  <th>Who</th>
                  <th>Status</th>
                </tr>
                <tr v-for="row in iterationLogTableRows" :key="row">
                  <td>{{ row.batch_action_name }}</td>
                  <td>{{ readDate(row.action_when) }}</td>
                  <td>{{ row.action_by }}</td>
                  <td>
                    {{ row.STATUS }}
                    <a v-if="row.STATUS === 'Success'"
                      ><i class="fa-solid fa-star"></i
                    ></a>
                    <a v-else
                      ><i class="fas fa-info-circle icon-background1"></i
                    ></a>
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </div>

        <br />
        <br />
        <div
          class="boxReports"
          style="
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            flex-wrap: wrap;
          "
        >
          <div class="label-div">
            <div>
              <strong>Status definitions</strong>
            </div>
            <button
              class="label-btn"
              @click.prevent="toggle2 = !toggle2"
              v-show="!toggle2"
            >
              Show
            </button>
            <button
              class="label-btn"
              @click.prevent="toggle2 = !toggle2"
              v-show="toggle2"
            >
              Hide
            </button>
          </div>
          <div class="box-div" v-show="toggle2" style="padding: 0 10px 0 10px">
            <br />
            <div>
              <FieldNameInline label="Not yet launched: "></FieldNameInline>
              <span
                >The assessment is in the system but has not been made available
                to the participant yet.</span
              >
              <br />
              <FieldNameInline label="Ready to start: "></FieldNameInline>
              <span
                >The assessment is available for the participant to begin.</span
              >
              <br />
              <FieldNameInline label="Started: "></FieldNameInline>
              <span>The participant has started the assessment.</span>
              <br />
              <FieldNameInline label="Open (submitted): "></FieldNameInline>
              <span
                >The assessment deadline has not been reached, but the
                individual has submitted the survey.</span
              >
              <br />
              <FieldNameInline label="Closed (submitted): "></FieldNameInline>
              <span
                >The assessment deadline has been reached, and the participant
                completed and submitted it.</span
              >
              <br />
              <FieldNameInline label="Closed (unsubmitted): "></FieldNameInline>
              <span
                >The assessment deadline has been reached, but the participant
                did not complete and submit it.</span
              >
              <br />
              <FieldNameInline label="Report released immediately: "></FieldNameInline>
              <span
                >The iteration's 'Never Run Iteration' is set to 'Yes'. 
                The assessment has a tag 'immediate_report_release', 
                this releases report to the participant and coach (assigned to the participant) 
                instantaneously after the participant submits the survey.</span
              >
              <br />
              <FieldNameInline label="Report available: "></FieldNameInline>
              <span
                >The final assessment report is available for both the
                participant and the coach (provided the participant has opted to
                share with the coach).</span
              >
              <br />
              <FieldNameInline
                label="Report available for participant: "
              ></FieldNameInline>
              <span
                >The final assessment report is available for the participant
                only.</span
              >
              <br />
              <FieldNameInline
                label="Report available for coach: "
              ></FieldNameInline>
              <span
                >The final assessment report is available for the coach
                only(provided the participant has opted to share with the
                coach).</span
              >
              <br />
              <FieldNameInline label="Report expired: "></FieldNameInline>
              <span
                >The assessment report is no longer available to the participant
                or the coach.</span
              >
              <br />
              <FieldNameInline label="Dropped: "></FieldNameInline>
              <span>The participant dropped the program.</span>
              <br />
              <!-- <FieldNameInline label="Undropped: "></FieldNameInline>
              <span
                >The participant who previously dropped the program and
                iteration, decided to re-enrol in the program and be included in
                this iteration.</span
              >
              <br /> -->
              <FieldNameInline
                label="Check survey assignment dates: "
              ></FieldNameInline>
              <span
                >A "catch all" description indicating unknown status not meeting
                any of the other status listed here.</span
              >
              <br />
              <br />
            </div>
          </div>
        </div>
        <br />
        <clip-loader
          :loading="setLoading"
          :color="setColor"
          :size="setSize"
        ></clip-loader>
        <div
          v-if="firstFetchUserData.length > 0 && showIndividualRecords == true"
        >
          <table id="table">
            <tr>
              <th style="text-align: center">
                <input
                  type="checkbox"
                  name="tableCheckBox"
                  v-model="allSelected"
                  @change="selectAll"
                  style="cursor: pointer"
                />
              </th>
              <th style="text-align: right">#</th>
              <th v-for="head in table_headers" :key="head">
                <a
                  @click="sort(head)"
                  :class="{ active: sortBy == head }"
                  style="display: flex; flex-direction: row; cursor: pointer"
                >
                  {{
                    head == "NAME"
                      ? "Name"
                      : head == "program_name"
                      ? "Program"
                      : head == "iteration_name"
                      ? "Iteration"
                      : head == "stream_name"
                      ? "Stream"
                      : head == "group_name"
                      ? "Group"
                      : null
                  }}

                  <div class="sort-icon" v-if="sortBy == head">
                    <a v-if="sortDirection == 1"
                      ><i class="fa-solid fa-sort-up"></i
                    ></a>
                    <a v-else><i class="fa-solid fa-sort-down"></i></a>
                  </div>
                </a>
              </th>
            </tr>
            <tr
              v-for="(data, index) in sortedProperties"
              :key="data"
              :value="data"
              v-memo="[selected]"
            >
              <td class="td-checkbox">
                <input
                  type="checkbox"
                  v-model="selected"
                  :value="data"
                  style="cursor: pointer"
                />
              </td>
              <td style="text-align: right">{{ incrementIndex(index) }}</td>
              <td v-for="head in table_headers" :key="head">
                {{ data[head] }}
              </td>
            </tr>
          </table>
          <!-- {{ selected }} -->
        </div>

        <div
          class="table2-container"
          v-if="
            secondFetchUserData.length > 0 && showIndividualRecords == false
          "
        >
          <table id="table2">
            <tr>
              <th style="width: 1%">
                <input
                  type="checkbox"
                  name="tableCheckBox"
                  v-model="allSelected"
                  @change="secondSelectAll"
                  style="cursor: pointer"
                />
              </th>
              <th style="text-align: right; width: 1%">#</th>
              <th v-for="head in table2_headers" :key="head">
                <a
                  @click="sort(head)"
                  :class="{ active: sortBy == head }"
                  style="display: flex; flex-direction: row; cursor: pointer"
                >
                  {{
                    head == "full_name"
                      ? "Full Name"
                      : head == "logged_in"
                      ? "Logged In"
                      : head == "survey_template_name"
                      ? "Template"
                      : head == "tag_names"
                      ? "Tags"
                      : head == "launch_date"
                      ? "Launch"
                      : head == "survey_reminder_date"
                      ? "Deadline reminder"
                      : head == "initial_deadline_date"
                      ? "Deadline"
                      : head == "final_deadline_date"
                      ? "Final deadline"
                      : head == "coach_report_start_date"
                      ? "Coach report start"
                      : head == "coach_report_end_date"
                      ? "Coach report end"
                      : head == "participant_report_start_date"
                      ? "User report"
                      : head == "stream_name"
                      ? "Stream"
                      : head == "group_name"
                      ? "Group"
                      : head == "coach_email"
                      ? "Coach"
                      : head == "coach_access_granted"
                      ? "Coach access granted"
                      : head == "coach_group_access_granted"
                      ? "Coaching group access granted"
                      : head == "STATUS"
                      ? `Status (Based on iteration)`
                      : head == "undropped"
                      ? "Undrop"
                      : head == "nominations_submitted"
                      ? "Nominations submitted"
                      : head
                  }}
                  <div class="sort-icon" v-if="sortBy == head">
                    <a v-if="sortDirection == 1"
                      ><i class="fa-solid fa-sort-up"></i
                    ></a>
                    <a v-else><i class="fa-solid fa-sort-down"></i></a>
                  </div>
                </a>
              </th>
            </tr>
            <tr
              v-for="(data, index) in table2SortedProperties"
              :key="data.survey_assignment_id"
              :value="data.survey_assignment_id"
              v-memo="[selected]"
            >
              <td class="td-checkbox">
                <input
                  type="checkbox"
                  :value="data.survey_assignment_id"
                  v-model="selected"
                  style="cursor: pointer"
                  number
                />
              </td>
              <td style="text-align: right">{{ incrementIndex(index) }}</td>
              <td>
                {{ data.full_name }}
                <a
                  @click="
                    showNomineeModal(data.ind_id, data.survey_assignment_id)
                  "
                  style="cursor: pointer"
                  ><i class="fa-solid fa-pencil"></i
                ></a>
              </td>
              <td>
                {{ data.logged_in }}
                <a v-if="data.logged_in == 'Yes'"
                  ><i class="fa-solid fa-star"></i
                ></a>
                <a v-else
                  ><i class="fas fa-info-circle icon-background1"></i
                ></a>
              </td>
              <!-- <td>{{data.survey_template_name}}</td>
              <td>{{data.tag_names}}</td>
              <td>{{data.launch_date}}</td>
              <td>{{data.survey_reminder_date}}</td>
              <td>{{data.initial_deadline_date}}</td>
              <td>{{data.final_deadline_date}}</td>
              <td>{{data.coach_report_start_date}}</td>
              <td>{{data.participant_report_start_date}}</td>
              <td>{{data.stream_name}}</td>
              <td>{{data.group_name}}</td>
              <td>{{data.coach_email}}</td>
              <td>{{data.coach_access_granted}}</td>
              <td>{{data.coach_group_access_granted}}</td> -->
              <td v-for="head in table2_headers_data" :key="head">
                {{
                  head == "survey_template_name"
                    ? data[head]
                    : head == "tag_names"
                    ? data[head]
                    : head == "stream_name"
                    ? data[head]
                    : head == "group_name"
                    ? data[head]
                    : head == "coach_email"
                    ? data[head]
                    : head == "coach_access_granted"
                    ? data[head]
                    : head == "coach_group_access_granted"
                    ? data[head]
                    : readDate(data[head])
                }}
              </td>
              <td>
                {{ data.STATUS }}
                <a
                  v-if="
                    data.STATUS != 'Closed (unsubmitted)' &&
                    data.STATUS != 'Not yet launched' &&
                    data.STATUS != 'Dropped' &&
                    data.STATUS != 'Report expired' &&
                    data.STATUS != 'Check survey assignment dates'
                  "
                  ><i class="fa-solid fa-star"></i
                ></a>
                <a v-else
                  ><i class="fas fa-info-circle icon-background1"></i
                ></a>
              </td>
              <td>
                {{ readDate(data.undropped_date) }}
                <a v-if="data.undropped == 'Yes' && data.undropped_date == null"
                  >{{ data.undropped }} <i class="fa-solid fa-star"></i
                ></a>
                <a
                  v-else-if="
                    data.undropped == 'No' && data.undropped_date == null
                  "
                  >{{ data.undropped }}
                  <i class="fas fa-info-circle icon-background1"></i
                ></a>
              </td>
              <td>
                <a
                  @click="showNominationModal(data.survey_assignment_id)"
                  style="cursor: pointer"
                  ><i class="fa-solid fa-magnifying-glass"></i
                ></a>
                {{ data.nominations_submitted }}
                <a
                  v-if="
                    data.nominations_submitted != `${0}/${0}` &&
                    data.nominations_submitted != `${0}/${1}` &&
                    data.nominations_submitted != `${0}/${2}` &&
                    data.nominations_submitted != `${0}/${3}` &&
                    data.nominations_submitted != `${0}/${4}` &&
                    data.nominations_submitted != `${0}/${5}` &&
                    data.nominations_submitted != `${0}/${6}` &&
                    data.nominations_submitted != `${0}/${7}` &&
                    data.nominations_submitted != `${0}/${8}` &&
                    data.nominations_submitted != `${0}/${9}` &&
                    data.nominations_submitted != `${0}/${10}` &&
                    data.nominations_submitted != `${0}/${11}` &&
                    data.nominations_submitted != `${0}/${12}` &&
                    data.nominations_submitted != `${0}/${13}` &&
                    data.nominations_submitted != `${0}/${14}` &&
                    data.nominations_submitted != `${0}/${15}` &&
                    data.nominations_submitted != `${0}/${16}` &&
                    data.nominations_submitted != `${0}/${17}` &&
                    data.nominations_submitted != `${0}/${18}` &&
                    data.nominations_submitted != `${0}/${19}` &&
                    data.nominations_submitted != `${0}/${20}`
                  "
                  ><i class="fa-solid fa-star"></i
                ></a>
                <a v-else
                  ><i class="fas fa-info-circle icon-background1"></i
                ></a>
              </td>
            </tr>
          </table>
          <!-- {{ selected.join(", ") }} -->
        </div>
        <br />

        <div class="actions-container">
          <ButtonSubmit
            v-if="firstFetchUserData.length != 0"
            :disabled="selected.length == 0"
            label="Batch Actions"
            id="batchAction"
            @click.prevent="toggle = !toggle"
          />

          <ButtonSubmit
            v-if="secondFetchUserData.length != 0"
            :disabled="selected.length == 0"
            label="Batch Actions"
            id="batchAction"
            @click.prevent="toggle = !toggle"
          />

          <div
            v-if="
              toggle == true &&
              firstFetchUserData.length > 0 &&
              selected.length > 0
            "
            class="batchAction-btn"
          >
            <label style="color: #ccc" for="selectBatchAction"
              ><DescriptionInline
                class="batch-action-desc"
                label="Select batch action "
            /></label>
            <select
              id="selectBatchAction"
              name="batchAction"
              v-model="actions"
              @change="clearInput"
            >
              <option selected :value="null">Select action</option>

              <option :value="19">Add survey</option>
              <option :value="21">Update program/iteration</option>
              <option
                v-for="action in filteredAssignGroup"
                v-bind:key="action.batch_action_id"
                v-bind:value="action.batch_action_id"
              >
                {{ action.batch_action_type }}
              </option>
            </select>
          </div>

          <div
            v-if="
              toggle == true &&
              secondFetchUserData.length > 0 &&
              selected.length > 0
            "
            class="batchAction-btn"
          >
            <label style="color: #ccc" for="selectBatchAction"
              ><DescriptionInline
                class="batch-action-desc"
                label="Select batch action "
            /></label>
            <select
              class="batch-action-input2"
              id="selectBatchAction"
              name="batchAction"
              v-model="actions"
              @change="clearInput"
            >
              <option selected :value="null">Select action</option>
              <option
                v-for="action in filteredBatchActions"
                v-bind:key="action.batch_action_id"
                v-bind:value="action.batch_action_id"
              >
                {{ action.batch_action_type }}
              </option>
            </select>
          </div>

          <div
            v-if="toggle == true && actions == 24 && selected.length > 0"
            class="batch-action-input"
          >
            <div class="input1">
              <Multiselect
                class="multiselect-input"
                id="tags-multiselect"
                v-model="survey.action_tag"
                placeholder="Select tag(s)"
                mode="tags"
                :searchable="true"
                :options="filteredRemoveTags"
              />
            </div>
          </div>

          <div
            v-if="toggle == true && actions == 22 && selected.length > 0"
            class="batch-action-input"
          >
            <div class="input1">
              <Multiselect
                class="multiselect-input"
                id="stream-multiselect"
                v-model="survey.action_stream_id"
                placeholder="Select/Add Stream"
                :searchable="true"
                :options="filteredStreamActions"
                :createOption="true"
              />
            </div>
          </div>

          <div
            v-if="toggle == true && actions == 22 && selected.length > 0"
            class="batch-action-input"
          >
            <div class="input1">
              <Multiselect
                class="multiselect-input"
                id="group-multiselect"
                v-model="survey.group_id"
                placeholder="Select/Add Group"
                :searchable="true"
                :options="filteredGroupMultiSelectActions"
                :createOption="true"
              />
            </div>
          </div>

          <div
            v-if="toggle == true && actions == 21 && selected.length > 0"
            class="batch-action-input"
          >
            <div class="input1">
              <Multiselect
                class="multiselect-input"
                id="program-multiselect"
                v-model="survey.action_program_id"
                placeholder="Select/Add Program"
                :searchable="true"
                :options="filteredProgramActions"
                :createOption="true"
              />
            </div>
          </div>

          <div
            v-if="toggle == true && actions == 21 && selected.length > 0"
            class="batch-action-input"
          >
            <div class="input1">
              <Multiselect
                class="multiselect-input"
                id="iteration-multiselect"
                v-model="survey.action_iteration_id"
                placeholder="Select/Add Iteration"
                :searchable="true"
                :options="filteredIterationMultiSelectActions"
                :createOption="true"
              />
            </div>
          </div>

          <div
            v-if="toggle == true && actions == 20 && selected.length > 0"
            style="width: 25%"
          >
            <label style="color: #ccc" for="selectTag"
              ><DescriptionInline class="batch-action-desc" label="Select Tag "
            /></label>
            <select class="input1" id="selectTag" name="tags" v-model="tags">
              <option selected :value="null">Select tag</option>
              <option
                v-for="tag in filteredTags"
                v-bind:key="tag.tag_id"
                v-bind:value="tag.tag_id"
              >
                {{ tag.tag_type }}
              </option>
            </select>
          </div>

          <div
            v-if="toggle == true && actions == 19 && selected.length > 0"
            style="width: 25%"
          >
            <label style="color: #ccc" for="selectSurveyTemplate"
              ><DescriptionInline
                class="batch-action-desc"
                label="Select Survey Template "
            /></label>
            <select
              class="input1"
              id="selectSurveyTemplate"
              name="surveyTemplate"
              v-model="survey.survey_template_id"
            >
              <option selected :value="null">Select survey template</option>
              <option
                v-for="template in filteredUserSurveyTemplate"
                v-bind:key="template.survey_template_id"
                v-bind:value="template.survey_template_id"
              >
                {{ template.survey_template_name }} - {{ template.survey_file }}
              </option>
            </select>
          </div>

          <div
            v-if="toggle == true && survey.survey_template_id != null"
            style="margin-right: 20px; width: 25%"
          >
            <label
              v-if="
                filteredIteration.length == 0 || survey.iteration_id == null
              "
              style="color: #ccc"
              class="batch-action-desc"
            >
              No iteration selected
            </label>
            <div v-for="iteration in filteredIteration" :key="iteration">
              <label
                v-if="
                  iteration.time_zone == null ||
                  iteration.time_zone == '' ||
                  iteration.time_zone == 'undefined'
                "
                style="color: #ccc"
                class="batch-action-desc"
              >
                Iteration timezone is not set
              </label>
              <label
                v-else-if="survey.iteration_id == iteration.iteration_id"
                style="color: #ccc"
                class="batch-action-desc"
              >
                Dates and time are based in timezone: {{ iteration.time_zone }}
              </label>
            </div>
            <br />
            <label style="color: #ccc" for="launch"
              ><DescriptionInline
                class="batch-action-desc"
                label="Launch" /></label
            ><br />
            <input
              class="input1"
              type="datetime-local"
              id="launch"
              :value="survey.launch"
              @input="survey.launch = $event.target.value"
              required
            />
            <br />
            <label style="color: #ccc" for="reminder"
              ><DescriptionInline
                class="batch-action-desc"
                label="Survey Reminder" /></label
            ><br />
            <input
              class="input1"
              type="datetime-local"
              id="reminder"
              :value="survey.reminder"
              @input="survey.reminder = $event.target.value"
            />
            <br />
            <label style="color: #ccc" for="deadline_initial"
              ><DescriptionInline
                class="batch-action-desc"
                label="Initial deadline" /></label
            ><br />
            <input
              class="input1"
              type="datetime-local"
              id="deadline_initial"
              required
              :value="survey.deadline_initial"
              @input="survey.deadline_initial = $event.target.value"
            />
            <br />
            <label style="color: #ccc" for="deadline_final"
              ><DescriptionInline
                class="batch-action-desc"
                label="Final deadline" /></label
            ><br />
            <input
              class="input1"
              type="datetime-local"
              id="deadline_final"
              required
              :value="survey.deadline_final"
              @input="survey.deadline_final = $event.target.value"
            />
            <br />
            <label style="color: #ccc" for="coach_report_start"
              ><DescriptionInline
                class="batch-action-desc"
                label="Coach report start" /></label
            ><br />
            <input
              class="input1"
              type="datetime-local"
              id="coach_report_start"
              :value="survey.coach_report_start"
              @input="survey.coach_report_start = $event.target.value"
            />
            <br />
            <label style="color: #ccc" for="coach_report_end"
              ><DescriptionInline
                class="batch-action-desc"
                label="Coach report end" /></label
            ><br />
            <input
              class="input1"
              type="datetime-local"
              id="coach_report_end"
              :value="survey.coach_report_end"
              @input="survey.coach_report_end = $event.target.value"
            />
            <br />
            <label style="color: #ccc" for="participant_report_start"
              ><DescriptionInline
                class="batch-action-desc"
                label="Participant report start" /></label
            ><br />
            <input
              class="input1"
              type="datetime-local"
              id="participant_report_start"
              :value="survey.participant_report_start"
              @input="survey.participant_report_start = $event.target.value"
            />
          </div>

          <div
            v-if="toggle == true && actions == 1"
            style="width: 30% !important"
            class="batch-action-input"
          >
            <div class="input1">
              <Multiselect
                class="multiselect-input"
                v-model="suborg_inp"
                placeholder="Change sub-organization"
                :options="filteredSubOrgActions"
              />
            </div>
          </div>

          <div
            v-if="toggle == true && actions == 2"
            style="width: 30% !important"
            class="batch-action-input"
          >
            <div class="input1">
              <Multiselect
                class="multiselect-input"
                v-model="program_inp"
                placeholder="Change program name"
                :options="filteredProgramActions"
              />
            </div>
          </div>

          <div
            v-if="toggle == true && actions == 3"
            style="width: 30% !important"
            class="batch-action-input"
          >
            <div class="input1">
              <Multiselect
                class="multiselect-input"
                v-model="iteration_inp"
                placeholder="Change iteration name"
                :options="filteredIterationActions"
              />
            </div>
          </div>

          <div
            v-if="toggle == true && actions == 4"
            style="width: 30% !important"
            class="batch-action-input"
          >
            <div class="input1">
              <Multiselect
                class="multiselect-input"
                v-model="stream_inp"
                placeholder="Change stream name"
                :options="filteredStreamActions"
              />
            </div>
          </div>

          <div
            v-if="toggle == true && actions == 5"
            style="width: 30% !important"
            class="batch-action-input"
          >
            <div class="input1">
              <Multiselect
                class="multiselect-input"
                v-model="group_inp"
                placeholder="Change group name"
                :options="filteredGroupActions"
              />
            </div>
          </div>

          <div
            v-if="toggle == true && actions == 6"
            style="width: 30% !important"
            class="batch-action-input"
          >
            <div class="input1">
              <Multiselect
                class="multiselect-input"
                v-model="coach_email_inp"
                placeholder="Change coach email"
                :searchable="true"
                :options="filteredCoachEmailActions"
              />
            </div>
          </div>

          <div v-if="toggle == true && actions == 7" style="width: 25%">
            <label style="color: #ccc" for="final-deadline-date"
              ><DescriptionInline
                class="batch-action-desc"
                label="New final deadline date* "
            /></label>
            <input
              type="datetime-local"
              class="input1"
              id="final-deadline-date"
              v-model="dates.deadline_final"
            />
          </div>

          <div v-if="toggle == true && actions == 8" style="width: 25%">
            <label style="color: #ccc" for="launch-date"
              ><DescriptionInline
                class="batch-action-desc"
                label="New launch date* "
            /></label>
            <input
              type="datetime-local"
              class="input1"
              id="launch-date"
              v-model="dates.launch"
            />
          </div>

          <div v-if="toggle == true && actions == 9" style="width: 25%">
            <label style="color: #ccc" for="survey-reminder-date"
              ><DescriptionInline
                class="batch-action-desc"
                label="New survey reminder date* "
            /></label>
            <input
              type="datetime-local"
              class="input1"
              id="survey-reminder-date"
              v-model="dates.reminder"
            />
          </div>

          <div v-if="toggle == true && actions == 10" style="width: 25%">
            <label style="color: #ccc" for="coach-report-start-date"
              ><DescriptionInline
                class="batch-action-desc"
                label="New coach report start date* "
            /></label>
            <input
              type="datetime-local"
              class="input1"
              id="coach-report-start-date"
              v-model="dates.coach_report_start"
            />
          </div>

          <div v-if="toggle == true && actions == 11" style="width: 25%">
            <label style="color: #ccc" for="coach-report-end-date"
              ><DescriptionInline
                class="batch-action-desc"
                label="New coach report end date* "
            /></label>
            <input
              type="datetime-local"
              class="input1"
              id="coach-report-end-date"
              v-model="dates.coach_report_end"
            />
          </div>

          <div v-if="toggle == true && actions == 12" style="width: 25%">
            <label style="color: #ccc" for="participant-report-start-date"
              ><DescriptionInline
                class="batch-action-desc"
                label="New participant report start date* "
            /></label>
            <input
              type="datetime-local"
              class="input1"
              id="participant-report-start-date"
              v-model="dates.participant_report_start"
            />
          </div>

          <div v-if="toggle == true && actions == 13" style="width: 25%">
            <label style="color: #ccc" for="participant-report-start-date"
              ><DescriptionInline
                class="batch-action-desc"
                label="New initial deadline date* "
            /></label>
            <input
              type="datetime-local"
              class="input1"
              id="initial-deadline-date"
              v-model="dates.initial_deadline"
            />
          </div>

          <ButtonSubmit
            label="Go"
            id="batchAction"
            :disabled="disableGoButton == false"
            @click="swalValidation"
            v-if="toggle == true && firstFetchUserData.length > 0"
          />

          <ButtonSubmit
            label="Go"
            id="batchAction"
            :disabled="disableGoButton == false"
            @click="secondHandleSave"
            v-if="
              toggle == true &&
              secondFetchUserData.length > 0 &&
              actions != 14 &&
              actions != 15 &&
              actions != 23 &&
              actions != 25 &&
              actions != 58 &&
              actions != 59 &&
              actions != 60
            "
          />

          <!--drop-->
          <ButtonSubmit
            label="Go"
            id="batchAction"
            @click="secondHandleSave"
            :disabled="selected.length == 0"
            v-if="
              toggle == true && secondFetchUserData.length > 0 && actions == 14
            "
          />

          <!--Run iteration-->
          <ButtonSubmit
            label="Go"
            id="batchAction"
            @click="secondHandleSave"
            :disabled="selected.length == 0"
            v-if="
              toggle == true && secondFetchUserData.length > 0 && actions == 25
            "
          />


          <!--Calculate selected participants scores-->
          <ButtonSubmit
            label="Go"
            id="batchAction"
            @click="secondHandleSave"
            :disabled="selected.length == 0"
            v-if="
              toggle == true && secondFetchUserData.length > 0 && actions == 58
            "
          />

          <ButtonSubmit
            label="Go"
            id="batchAction"
            @click="secondHandleSave"
            :disabled="selected.length == 0"
            v-if="
              toggle == true && secondFetchUserData.length > 0 && actions == 59
            "
          />

          <ButtonSubmit
            label="Go"
            id="batchAction"
            @click="secondHandleSave"
            :disabled="selected.length == 0"
            v-if="
              toggle == true && secondFetchUserData.length > 0 && actions == 60
            "
          />

          <!--undrop-->
          <ButtonSubmit
            label="Go"
            id="batchAction"
            @click="secondHandleSave"
            :disabled="selected.length == 0"
            v-if="
              toggle == true && secondFetchUserData.length > 0 && actions == 15
            "
          />

          <!--Unsubmit survey-->
          <ButtonSubmit
            label="Go"
            id="batchAction"
            @click="secondHandleSave"
            :disabled="selected.length == 0"
            v-if="
              toggle == true && secondFetchUserData.length > 0 && actions == 23
            "
          />
        </div>
      </div>
    </form>
    <AdminDashboardNominationModal
      v-if="show_nomination_modal == true"
      @close-modal="show_nomination_modal = false"
      :surveyAssignmentId="surveyAssignmentId"
      :brandData="brandData"
      :userData="userData"
    />
    <AdminDashboardNomineeDetailsModal
      v-if="show_nominee_modal == true"
      @close-modal="show_nominee_modal = false"
      :nominee_ind_id="nominee_ind_id"
      :survey_assignment_id="nominee_survey_assignment_id"
      :brandData="brandData"
      :userData="userData"
    />
  </div>
</template>

<script>
export default {
  name: "AdminDashboardBox",
  component: [
    DescriptionInline,
    DropDownInfo,
    DropDownInfoNumbered,
    HeaderReport,
    FieldNameInline,
    ButtonSubmit,
    Multiselect,
    ClipLoader,
    AdminDashboardNominationModal,
    AdminDashboardNomineeDetailsModal,
  ],
  props: ["buttonLabel", "userData", "brandData"],
  data: () => ({
    disableSearchButton: false,
    setColor: "#ff6a00",
    setSize: "50px",
    showIndividualRecords: true,
    toggleIterationLog: false,
    toggle2: false,
    toggle: false,
    setLoading: false,
    surveyType: "",
    statisticsData: [],
    participantsRegisteredPercentage: 0,
    participantsSubmittedPercentage: 0,
    participantsEligiblePercentage: 0,
    totalNomineesPercentage: 0,
    totalNomineesSubmittedPercentage: 0,
    iterationLogTableRows: null,
    rowLimit: 5,
    surveyAssignmentList: [],
    table_headers: [
      "NAME",
      "program_name",
      "iteration_name",
      "stream_name",
      "group_name",
    ],
    table2_headers: [
      "full_name",
      "logged_in",
      "survey_template_name",
      "tag_names",
      "launch_date",
      "survey_reminder_date",
      "initial_deadline_date",
      "final_deadline_date",
      "coach_report_start_date",
      "coach_report_end_date",
      "participant_report_start_date",
      "stream_name",
      "group_name",
      "coach_email",
      "coach_access_granted",
      "coach_group_access_granted",
      "STATUS",
      "undropped",
      "nominations_submitted",
    ],
    table2_headers_data: [
      "survey_template_name",
      "tag_names",
      "launch_date",
      "survey_reminder_date",
      "initial_deadline_date",
      "final_deadline_date",
      "coach_report_start_date",
      "coach_report_end_date",
      "participant_report_start_date",
      "stream_name",
      "group_name",
      "coach_email",
      "coach_access_granted",
      "coach_group_access_granted",
    ],
    show_nomination_modal: false,
    show_nominee_modal: false,
    surveyAssignmentId: "",
    nominee_ind_id: "",
    nominee_survey_assignment_id: "",
    sortDirection: 1,
    sortBy: "",
    allSelected: false,
    org_id: "",
    coach_email_inp: null,
    suborg_inp: null,
    program_inp: null,
    program_id: null,
    iteration_id: null,
    iteration_inp: null,
    stream_id: null,
    stream_inp: null,
    group_inp: null,
    template_id: null,
    actions: null,
    tags: null,
    surveyTemplate: null,
    selected: [],
    firstFetchUserData: [],
    secondFetchUserData: [],
    userOrg: [],
    userSubOrg: [],
    userPrograms: [],
    coachUsers: [],
    userIterations: [],
    userStreams: [],
    userGroups: [],
    userSurveyTemplate: [],
    batchActions: [],
    batchActions2: [],
    userTags: [],
    filteredData: [],
    newNameSuborg: [],
    nomineeSurveyTemplateId: 0,
    dates: {
      launch: "",
      reminder: "",
      initial_deadline: "",
      coach_report_start: "",
      coach_report_end: "",
      deadline_final: "",
      participant_report_start: "",
      modified_by: "",
    },
    survey: {
      org_id: "",
      suborg_id: null,
      survey_template_id: null,
      survey_template_association_id: "",
      is_test: "",
      for_sample_report: "",
      program_id: null,
      iteration_id: null,
      stream_id: null,
      group_id: null,
      action_program_id: null,
      action_iteration_id: null,
      action_stream_id: null,
      action_tag: null,
      // action_group_id: null,
      start: "",
      launch: "",
      reminder: "",
      deadline_initial: "",
      deadline_final: "",
      coach_report_start: "",
      coach_report_end: "",
      participant_report_start: "",
      recommended_number_of_nominations: "",
      max_number_of_nominations: "",
      report_eligible_number_of_respondents: "",
      created_by: 1,
      modified_by: 1,
    },
  }),

  async mounted() {
    // console.log(this.brandData);
    await this.renderData();

    this.survey.org_id = this.userData.org_id;

    await api
      .get(`/individuals/get-coach-by-org/${this.survey.org_id}`)
      .then((result) => {
        // console.log(result.data)
        this.coachUsers = result.data;
      });

    await api.get("individuals/" + this.userData.ind_id).then((result) => {
      this.org_id = result.data.org_name;
    });

    await api.get("batch-actions/").then((result) => {
      this.batchActions = result.data;
      this.batchActions2 = result.data;
    });

    await api.get("tags/").then((result) => {
      this.userTags = result.data;
    });

    await api.get("organizations").then((result) => {
      result.data.map((data) => {
        this.survey.max_number_of_nominations =
          data.d_max_number_of_nominations;
        this.survey.recommended_number_of_nominations =
          data.d_recommended_number_of_nominations;
        this.survey.report_eligible_number_of_respondents =
          data.d_report_eligible_number_of_respondents;
      });
      this.userOrg = result.data;
    });

    await api.get("survey-templates-survey_template_name").then((result) => {
      this.userSurveyTemplate = result.data;
    });
  },
  methods: {
    async sort(head) {
      const sorted = `Sorted ${
        head == "NAME"
          ? "Name"
          : head == "program_name"
          ? "Program"
          : head == "iteration_name"
          ? "Iteration"
          : head == "full_name"
          ? "Full Name"
          : head == "logged_in"
          ? "Logged In"
          : head == "survey_template_name"
          ? "Template"
          : head == "tag_names"
          ? "Tags"
          : head == "launch_date"
          ? "Launch"
          : head == "survey_reminder_date"
          ? "Deadline reminder"
          : head == "initial_deadline_date"
          ? "Deadline"
          : head == "final_deadline_date"
          ? "Final deadline"
          : head == "coach_report_start_date"
          ? "Coach report"
          : head == "participant_report_start_date"
          ? "User report"
          : head == "stream_name"
          ? "Stream"
          : head == "group_name"
          ? "Group"
          : head == "coach_email"
          ? "Coach"
          : head == "coach_access_granted"
          ? "Coach access granted"
          : head == "coach_group_access_granted"
          ? "Coaching group access granted"
          : head == "STATUS"
          ? "Status"
          : head == "nominations_submitted"
          ? "Nominations submitted"
          : head
      } column successfully.`;
      this.sortBy = head;
      this.sortDirection *= -1;

      if (head == "" && head == undefined) {
        this.searchResult();
      } else {
        this.searchResult(sorted);
      }
    },

    showNominationModal(data) {
      this.show_nomination_modal = true;
      this.surveyAssignmentId = data;
    },

    showNomineeModal(ind_id, survey_assignment_id) {
      this.show_nominee_modal = true;
      this.nominee_ind_id = ind_id;
      this.nominee_survey_assignment_id = survey_assignment_id;
    },
    // sortMethods(head, direction) {
    //   return direction === 1wSurveytype
    //     ? (a, b) => (b[head] > a[head] ? -1 : a[head] > b[head] ? 1 : 0)
    //     : (a, b) => (a[head] > b[head] ? -1 : b[head] > a[head] ? 1 : 0);
    // },

    dynamicSort(property, direction) {
      if (property[0] === "-") {
        property = property.substr(1);
      }
      return function (a, b) {
        var result =
          a[property] < b[property] ? 1 : a[property] > b[property] ? -1 : 0;
        // console.log(result)
        if (a[property] === "" || a[property] === null) return 1;
        if (b[property] === "" || b[property] === null) return -1;
        if (a[property] === b[property]) return 0;
        return result * direction;
        // console.log(result * direction);
        // return result * direction;
      };
    },

    async showSurveyType() {
      this.disableSearchButton = true;
      await api
        .get(`/survey-templates/survey-type/${this.template_id}`)
        .then((result) => {
            console.log(result.data);
            this.surveyType = result.data.survey_type;
            if (result.data.nominee_survey_template_id != null) {
              this.nomineeSurveyTemplateId = result.data.nominee_survey_template_id;
            }
        });
      setTimeout(this.enableSearchButton, 2000);
    },

    enableSearchButton() {
      this.disableSearchButton = false;
    },

    async renderData() {
      await api.get("sub-organizations/").then((result) => {
        this.userSubOrg = result.data;
      });

      await api.get("programs").then((result) => {
        this.userPrograms = result.data;
      });

      await api.get("iterations").then((result) => {
        this.userIterations = result.data;
      });

      await api.get("streams").then((result) => {
        this.userStreams = result.data;
      });

      await api.get("groups").then((result) => {
        this.userGroups = result.data;
      });
    },

    incrementIndex(index) {
      return index + 1;
    },

    async swalValidation() {
      if (this.survey.iteration_id == null && this.actions == 19) {
        try {
          Swal.fire({
            text: `You didn't select an iteration at the top. Please select one.`,
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Ok",
          }).then((result) => {
            if (result.isConfirmed) {
              this.firstFetchUserData = [];
              this.toggle = false;
              this.allSelected = false;
              this.actions = null;
            }
          });
        } catch (error) {
          console.error(error);
        }
      } else if (this.survey.launch == "" && this.survey.launch == null) {
        try {
          Swal.fire({
            text: `Lauch date is required. Please input a date.`,
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Ok",
          }).then((result) => {
            if (result.isConfirmed) {
              this.survey.launch = "";
            }
          });
        } catch (error) {
          console.error(error);
        }
      } else if (
        this.survey.deadline_final == "" &&
        this.survey.deadline_final == null
      ) {
        try {
          Swal.fire({
            text: `Final deadline date is required. Please input a date.`,
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Ok",
          }).then((result) => {
            if (result.isConfirmed) {
              this.survey.deadline_final = "";
            }
          });
        } catch (error) {
          console.error(error);
        }
      } else {
        try {
          this.firstHandleSave();
        } catch (error) {
          console.error(error);
        }
      }
    },

    firstHandleSave: async function () {
      //Add survey
      if (this.actions == 19) {
        for (const data of this.userSurveyTemplate) {
          if (data.survey_template_id === this.survey.survey_template_id) {
            this.survey.survey_template_association_id =
              data.survey_template_association_id;
          }
        }
        if (!this.survey.deadline_initial || !this.survey.deadline_final) {
          flashMessage(
            this.$flashMessage,
            this.brandData.accent_color1
              ? this.brandData.accent_color1
              : "#F47820",
            this.brandData.flash_text_color
              ? this.brandData.flash_text_color
              : "#ffffff",
            "Initial deadline and final deadline are required fields"
          );
        } else {
          var pass = this.validateDates(
            this.survey.deadline_initial,
            this.survey.deadline_final
          );
          if (!pass) {
            return flashMessage(
              this.$flashMessage,
              this.brandData.accent_color1
                ? this.brandData.accent_color1
                : "#F47820",
              this.brandData.flash_text_color
                ? this.brandData.flash_text_color
                : "#ffffff",
              "Please make sure the deadline final date is after the deadline initial date"
            );
          }
          if (this.survey.coach_report_start && this.survey.coach_report_end) {
            pass = this.validateDates(
              this.survey.coach_report_start,
              this.survey.coach_report_end
            );
            if (!pass) {
              return flashMessage(
                this.$flashMessage,
                this.brandData.accent_color1
                  ? this.brandData.accent_color1
                  : "#F47820",
                this.brandData.flash_text_color
                  ? this.brandData.flash_text_color
                  : "#ffffff",
                "Please make sure the coach report end date is after the coach report start date"
              );
            }
          }
        }
        this.actions = null;
        this.toggle = false;

        for (var i = 0; i < this.selected.length; i++) {
          await api
            .post("survey-assignments", {
              ...this.survey,
              logged_in_user: this.userData.ind_id,
              ind_id: this.selected[i].ind_id,
              recipient_email: this.selected[i].email,
            })
            .then(() => {
              flashMessage(
                this.$flashMessage,
                this.brandData.accent_color1
                  ? this.brandData.accent_color1
                  : "#F47820",
                this.brandData.flash_text_color
                  ? this.brandData.flash_text_color
                  : "#ffffff",
                this.selected.length > 1
                  ? "Adding survey to selected users... Please wait for this message to be gone."
                  : "Successfully added survey to the selected user."
              );
            })
            .catch((error) => {
              console.log(error);
            });
        }
        //Add additional iteration
      } else if (this.actions == 21) {
        this.actions = null;
        this.toggle = false;
        if (
          this.survey.action_program_id != null &&
          this.survey.suborg_id != null
        ) {
          for (var j = 0; j < this.selected.length; j++) {
            await api
              .put(
                `individuals/ind-group-program-iteration/${this.selected[j].ind_id}`,
                {
                  ...this.survey,
                }
              )
              .then(() => {
                flashMessage(
                  this.$flashMessage,
                  this.brandData.accent_color1
                    ? this.brandData.accent_color1
                    : "#F47820",
                  this.brandData.flash_text_color
                    ? this.brandData.flash_text_color
                    : "#ffffff",
                  "Modifying selected user(s)... Please wait for this message to be gone."
                );
              })
              .catch((error) => {
                console.log(error);
              });
          }
        } else {
          try {
            Swal.fire({
              text: `You didn't select a sub-organization at the top. Please select one.`,
              confirmButtonColor: "#3085d6",
              confirmButtonText: "Ok",
            }).then((result) => {
              if (result.isConfirmed) {
                this.firstFetchUserData = [];
                this.toggle = false;
                this.allSelected = false;
                this.actions = null;
              }
            });
          } catch (error) {
            console.error(error);
          }
        }
        //Assign group
      } else if (this.actions == 22) {
        this.actions = null;
        this.toggle = false;
        if (
          this.survey.action_stream_id != null &&
          this.survey.suborg_id != null &&
          this.survey.program_id !== null &&
          this.survey.iteration_id != null
        ) {
          for (var k = 0; k < this.selected.length; k++) {
            await api
              .put(
                `individuals/ind-group-stream-group/${this.selected[k].ind_id}`,
                {
                  ...this.survey,
                }
              )
              .then(() => {
                flashMessage(
                  this.$flashMessage,
                  this.brandData.accent_color1
                    ? this.brandData.accent_color1
                    : "#F47820",
                  this.brandData.flash_text_color
                    ? this.brandData.flash_text_color
                    : "#ffffff",
                  "Modifying selected user(s)... Please wait for this message to be gone."
                );
              })
              .catch((error) => {
                console.log(error);
              });
          }
        }
      }
      this.survey.action_program_id = null;
      this.survey.action_iteration_id = null;
      this.survey.action_stream_id = null;
      this.survey.group_id = null;
      this.allSelected = false;
      this.selected = [];
      this.searchResult();
    },

    secondHandleSave: async function () {
      //Add tag
      if (this.actions == 20) {
        this.actions = null;
        this.toggle = false;

        for (var i = 0; this.selected.length > i; i++) {
          await api
            .post("survey_assignment_tags/", {
              survey_assignment_id: this.selected[i],
              tag_id: this.tags,
              org_id: this.survey.org_id,
            })
            .then(() => {
              flashMessage(
                this.$flashMessage,
                this.brandData.accent_color1
                  ? this.brandData.accent_color1
                  : "#F47820",
                this.brandData.flash_text_color
                  ? this.brandData.flash_text_color
                  : "#ffffff",
                this.selected.length > 1
                  ? "Adding tags to selected users... Please wait for this message to be gone."
                  : "Successfully added tag to the selected user."
              );
            })
            .catch((error) => {
              console.log(error);
            });
        }
        this.allSelected = false;
        this.selected = [];
        this.tags = null;
        this.searchResult();
        //Change final deadline date
      } else if (this.actions == 7) {
        this.actions = null;
        this.toggle = false;
        const newValue = this.selected.join(",");

        await api
          .put(`/survey-assignment/dates/${newValue}`, {
            deadline_final: this.dates.deadline_final,
            modified_at: "",
            modified_by: this.userData.ind_id,
          })
          .then(() => {
            api.get(`survey-assignment/earliest-final-deadline-date/${this.survey.iteration_id}`)
            .then((result)=>{
                api.put(`iterations/final-deadline-date-update/${result.data.iteration_id}`, {
                  final_deadline_date: result.data.earliest_final_deadline,
                  modified_by: this.userData.ind_id
                }).then(()=>{
                  flashMessage(
                    this.$flashMessage,
                    this.brandData.accent_color1
                      ? this.brandData.accent_color1
                      : "#F47820",
                    this.brandData.flash_text_color,
                    this.selected.length > 1
                      ? "Updating final deadline date to selected users... Please wait for this message to be gone."
                      : "Successfully update final deadline date of the selected user."
                  );
                })
            })
            this.dates.deadline_final = "";
            this.allSelected = false;
            this.selected = [];
            this.searchResult();
          })
          .catch((error) => {
            console.log(error);
          });
        //Change launch date
      } else if (this.actions == 8) {
        this.actions = null;
        this.toggle = false;
        const newValue = this.selected.join(",");

        await api
          .put(`/survey-assignment/dates/${newValue}`, {
            launch: this.dates.launch,
            modified_at: "",
            modified_by: this.userData.ind_id,
          })
          .then(() => {
            flashMessage(
              this.$flashMessage,
              this.brandData.accent_color1
                ? this.brandData.accent_color1
                : "#F47820",
              this.brandData.flash_text_color,
              this.selected.length > 1
                ? "Updating launch date to selected users... Please wait for this message to be gone."
                : "Successfully update launch date of the selected user."
            );
            this.dates.launch = "";
            this.allSelected = false;
            this.selected = [];
            this.searchResult();
          })
          .catch((error) => {
            console.log(error);
          });
        //Change survey reminder date
      } else if (this.actions == 9) {
        this.actions = null;
        this.toggle = false;
        const newValue = this.selected.join(",");

        await api
          .put(`/survey-assignment/dates/${newValue}`, {
            reminder: this.dates.reminder,
            modified_at: "",
            modified_by: this.userData.ind_id,
          })
          .then(() => {
            flashMessage(
              this.$flashMessage,
              this.brandData.accent_color1
                ? this.brandData.accent_color1
                : "#F47820",
              this.brandData.flash_text_color,
              this.selected.length > 1
                ? "Updating survey reminder date to selected users... Please wait for this message to be gone."
                : "Successfully update survey reminder date of the selected user."
            );
            this.dates.reminder = "";
            this.allSelected = false;
            this.selected = [];
            this.searchResult();
          })
          .catch((error) => {
            console.log(error);
          });
        //Change coach report start date
      } else if (this.actions == 10) {
        this.actions = null;
        this.toggle = false;
        const newValue = this.selected.join(",");

        await api
          .put(`/survey-assignment/dates/${newValue}`, {
            coach_report_start: this.dates.coach_report_start,
            modified_at: "",
            modified_by: this.userData.ind_id,
          })
          .then(() => {
            flashMessage(
              this.$flashMessage,
              this.brandData.accent_color1
                ? this.brandData.accent_color1
                : "#F47820",
              this.brandData.flash_text_color,
              this.selected.length > 1
                ? "Updating coach report start date to selected users... Please wait for this message to be gone."
                : "Successfully update coach report start date of the selected user."
            );
            this.dates.coach_report_start = "";
            this.allSelected = false;
            this.selected = [];
            this.searchResult();
          })
          .catch((error) => {
            console.log(error);
          });
        //Change coach report end date
      } else if (this.actions == 11) {
        this.actions = null;
        this.toggle = false;
        const newValue = this.selected.join(",");

        await api
          .put(`/survey-assignment/dates/${newValue}`, {
            coach_report_end: this.dates.coach_report_end,
            modified_at: "",
            modified_by: this.userData.ind_id,
          })
          .then(() => {
            flashMessage(
              this.$flashMessage,
              this.brandData.accent_color1
                ? this.brandData.accent_color1
                : "#F47820",
              this.brandData.flash_text_color,
              this.selected.length > 1
                ? "Updating coach report end date to selected users... Please wait for this message to be gone."
                : "Successfully update coach report end date of the selected user."
            );
            this.dates.coach_report_end = "";
            this.allSelected = false;
            this.selected = [];
            this.searchResult();
          })
          .catch((error) => {
            console.log(error);
          });
        //Change participant report start date
      } else if (this.actions == 12) {
        this.actions = null;
        this.toggle = false;
        const newValue = this.selected.join(",");

        await api
          .put(`/survey-assignment/dates/${newValue}`, {
            participant_report_start: this.dates.participant_report_start,
            modified_at: "",
            modified_by: this.userData.ind_id,
          })
          .then(() => {
            flashMessage(
              this.$flashMessage,
              this.brandData.accent_color1
                ? this.brandData.accent_color1
                : "#F47820",
              this.brandData.flash_text_color,
              this.selected.length > 1
                ? "Updating participant report start date to selected users... Please wait for this message to be gone."
                : "Successfully update participant report start date of the selected user."
            );

            this.dates.participant_report_start = "";
            this.allSelected = false;
            this.selected = [];
            this.searchResult();
          })
          .catch((error) => {
            console.log(error);
          });
        //Change initial deadline date
      } else if (this.actions == 13) {
        this.actions = null;
        this.toggle = false;
        const newValue = this.selected.join(",");

        await api
          .put(`/survey-assignment/dates/${newValue}`, {
            initial_deadline: this.dates.initial_deadline,
            modified_at: "",
            modified_by: this.userData.ind_id,
          })
          .then(() => {
            flashMessage(
              this.$flashMessage,
              this.brandData.accent_color1
                ? this.brandData.accent_color1
                : "#F47820",
              this.brandData.flash_text_color,
              this.selected.length > 1
                ? "Updating initial deadline date to selected users... Please wait for this message to be gone."
                : "Successfully update initial deadline date of the selected user."
            );
            this.dates.initial_deadline = "";
            this.allSelected = false;
            this.selected = [];
            this.searchResult();
          })
          .catch((error) => {
            console.log(error);
          });
      }
      // change group name
      else if (this.actions == 5) {
        this.actions = null;
        this.toggle = false;
        const newValue = this.selected.join(",");

        await api
          .put(`/survey-assignment/group-name/${newValue}`, {
            group_id: this.group_inp,
            coach_id: null,
            modified_by: this.userData.ind_id,
          })
          .then(() => {
            api
              .put(`/survey-assignment/change-nominee-group/${newValue}`, {
                group_id: this.group_inp,
                coach_id: null,
                modified_by: this.userData.ind_id,
              })
              .then(() => {
                flashMessage(
                  this.$flashMessage,
                  this.brandData.accent_color1
                    ? this.brandData.accent_color1
                    : "#F47820",
                  this.brandData.flash_text_color,
                  this.selected.length > 1
                    ? "Updating group to selected users... Please wait for this message to be gone."
                    : "Successfully update group of the selected user."
                );
                this.group_inp = null;
                this.allSelected = false;
                this.selected = [];
                this.searchResult();
              });
          })
          .catch((error) => {
            console.log(error);
          });
      }
      // change stream name
      else if (this.actions == 4) {
        this.actions = null;
        this.toggle = false;
        const newValue = this.selected.join(",");

        await api
          .put(`/survey-assignment/stream-name/${newValue}`, {
            stream_id: this.stream_inp,
            coach_id: null,
            group_id: 0,
            modified_by: this.userData.ind_id,
          })
          .then(() => {
            api
              .put(`/survey-assignment/change-nominee-stream/${newValue}`, {
                stream_id: this.stream_inp,
                coach_id: null,
                group_id: 0,
                modified_by: this.userData.ind_id,
              })
              .then(() => {
                flashMessage(
                  this.$flashMessage,
                  this.brandData.accent_color1
                    ? this.brandData.accent_color1
                    : "#F47820",
                  this.brandData.flash_text_color,
                  this.selected.length > 1
                    ? "Updating stream to selected users... Please wait for this message to be gone."
                    : "Successfully update stream of the selected user."
                );
                this.stream_inp = null;
                this.allSelected = false;
                this.selected = [];
                this.searchResult();
              });
          })
          .catch((error) => {
            console.log(error);
          });
      }
      // change iteration name
      else if (this.actions == 3) {
        this.actions = null;
        this.toggle = false;
        const newValue = this.selected.join(",");

        await api
          .put(`/survey-assignment/iteration-name/${newValue}`, {
            iteration_id: this.iteration_inp,
            coach_id: null,
            stream_id: 0,
            group_id: 0,
            modified_by: this.userData.ind_id,
          })
          .then(() => {
            api
              .put(`/survey-assignment/change-nominee-iteration/${newValue}`, {
                iteration_id: this.iteration_inp,
                coach_id: null,
                stream_id: 0,
                group_id: 0,
                modified_by: this.userData.ind_id,
              })
              .then(() => {
                flashMessage(
                  this.$flashMessage,
                  this.brandData.accent_color1
                    ? this.brandData.accent_color1
                    : "#F47820",
                  this.brandData.flash_text_color,
                  this.selected.length > 1
                    ? "Updating iteration to selected users... Please wait for this message to be gone."
                    : "Successfully update iteration of the selected user."
                );
                this.iteration_inp = null;
                this.allSelected = false;
                this.selected = [];
                this.searchResult();
              });
          })
          .catch((error) => {
            console.log(error);
          });
      }
      // change program name
      else if (this.actions == 2) {
        this.actions = null;
        this.toggle = false;
        const newValue = this.selected.join(",");

        await api
          .put(`/survey-assignment/program-name/${newValue}`, {
            program_id: this.program_inp,
            coach_id: null,
            iteration_id: 0,
            stream_id: 0,
            group_id: 0,
            modified_by: this.userData.ind_id,
          })
          .then(() => {
            api
              .put(`/survey-assignment/change-nominee-program/${newValue}`, {
                program_id: this.program_inp,
                coach_id: null,
                iteration_id: 0,
                stream_id: 0,
                group_id: 0,
                modified_by: this.userData.ind_id,
              })
              .then(() => {
                flashMessage(
                  this.$flashMessage,
                  this.brandData.accent_color1
                    ? this.brandData.accent_color1
                    : "#F47820",
                  this.brandData.flash_text_color,
                  this.selected.length > 1
                    ? "Updating program to selected users... Please wait for this message to be gone."
                    : "Successfully update program of the selected user."
                );
                this.iteration_inp = null;
                this.allSelected = false;
                this.selected = [];
                this.searchResult();
              });
          })
          .catch((error) => {
            console.log(error);
          });
      }
      // change suborg name
      else if (this.actions == 1) {
        this.actions = null;
        this.toggle = false;
        const newValue = this.selected.join(",");

        await api
          .put(`/survey-assignment/change-suborg/${newValue}`, {
            suborg_id: this.suborg_inp,
            coach_id: null,
            program_id: 0,
            iteration_id: 0,
            stream_id: 0,
            group_id: 0,
            modified_by: this.userData.ind_id,
          })
          .then(() => {
            api
              .put(`/survey-assignment/change-nominee-suborg/${newValue}`, {
                suborg_id: this.suborg_inp,
                coach_id: null,
                program_id: 0,
                iteration_id: 0,
                stream_id: 0,
                group_id: 0,
                modified_by: this.userData.ind_id,
              })
              .then(() => {
                flashMessage(
                  this.$flashMessage,
                  this.brandData.accent_color1
                    ? this.brandData.accent_color1
                    : "#F47820",
                  this.brandData.flash_text_color,
                  this.selected.length > 1
                    ? "Updating suborg to selected users... Please wait for this message to be gone."
                    : "Successfully update suborg of the selected user."
                );
                this.suborg_inp = null;
                this.allSelected = false;
                this.selected = [];
                this.searchResult();
              });
          })
          .catch((error) => {
            console.log(error);
          });
      }
      // drop
      else if (this.actions == 14) {
        this.actions = null;
        this.toggle = false;
        const newValue = this.selected.join(",");

        await api
          .put(`/survey-assignment/drop-undrop/${newValue}`, {
            dropped_status: 1,
            undropped_date: null,
            modified_by: this.userData.ind_id,
          })
          .then(() => {
            flashMessage(
              this.$flashMessage,
              this.brandData.accent_color1
                ? this.brandData.accent_color1
                : "#F47820",
              this.brandData.flash_text_color,
              this.selected.length > 1
                ? "Updating drop selected users... Please wait for this message to be gone."
                : "Successfully drop selected user."
            );
            this.allSelected = false;
            this.selected = [];
            this.searchResult();
          })
          .catch((error) => {
            console.log(error);
          });
      }
      //undrop
      else if (this.actions == 15) {
        this.actions = null;
        this.toggle = false;
        const newValue = this.selected.join(",");

        await api
          .put(`/survey-assignment/drop-undrop/${newValue}`, {
            dropped_status: 0,
            dropped_date: null,
            undropped: 1,
            modified_by: this.userData.ind_id,
          })
          .then(() => {
            flashMessage(
              this.$flashMessage,
              this.brandData.accent_color1
                ? this.brandData.accent_color1
                : "#F47820",
              this.brandData.flash_text_color,
              this.selected.length > 1
                ? "Updating undrop selected users... Please wait for this message to be gone."
                : "Successfully undrop the selected user."
            );
            this.allSelected = false;
            this.selected = [];
            this.searchResult();
          })
          .catch((error) => {
            console.log(error);
          });
      }
      //Un-Submit a Survey
      else if (this.actions == 23) {
        this.actions = null;
        this.toggle = false;
        for (var j = 0; j < this.selected.length; j++) {
          await api
            .get(`/survey-assignments/${this.selected[j]}`)
            .then((result) => {
              let selectedSubmittedStatus = result.data.submitted_status;
              let selectedFullname = result.data.user_full_name;
              // console.log(selectedSubmittedStatus);
              // console.log(selectedFullname);
              if (selectedSubmittedStatus != 1) {
                Swal.fire({
                  text: `Individual ${selectedFullname} did not submitted the survey yet.`,
                  confirmButtonColor: "#3085d6",
                  confirmButtonText: "Ok",
                });
              } else if (selectedSubmittedStatus != 0) {
                api.put(
                  `/survey-assignment/un-submit-survey/${this.selected[j]}`,
                  {
                    submitted_status: 0,
                    modified_by: this.userData.ind_id,
                  }
                );
                Swal.fire({
                  text: `Un-Submit Survey(s) Successful!`,
                  confirmButtonColor: "#3085d6",
                  confirmButtonText: "Ok",
                });
              }
            });
        }
        this.allSelected = false;
        this.selected = [];
        this.searchResult();
      }
      //remove tag
      else if (this.actions == 24) {
        this.actions = null;
        this.toggle = false;
        const survey_assignment_id = this.selected.join(",");
        const tag_id = this.survey.action_tag.join(",");

        api
          .delete(
            `del-survey_assignment_tags/survey-assignment/${survey_assignment_id}/tag/${tag_id}`
          )
          .then(() => {
            flashMessage(
              this.$flashMessage,
              this.brandData.accent_color1
                ? this.brandData.accent_color1
                : "#F47820",
              this.brandData.flash_text_color,
              this.selected.length > 1
                ? "Deleting tag(s) of selected users... Please wait for this message to be gone."
                : "Successfully delete tag(s) of the selected user."
            );
            this.allSelected = false;
            this.selected = [];
            this.searchResult();
          })
          .catch((error) => {
            console.log(error);
          });
      }
      //run iteration
      else if (this.actions == 25) {
        this.toggle = false;

        let surveyType;

        if (this.surveyType == 1) {
          surveyType = "big5";
        } else if (this.surveyType == 2) {
          surveyType = "360";
        } else if (this.surveyType == 4) {
          surveyType = "qsort";
        }

      Swal.fire({
        text: "Running the Iteration will recalculate the cohort scores and regenerate PDF's for every participant. Are you sure?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: this.brandData.accent_color1,
        confirmButtonText: "Yes",
        cancelButtonColor: this.brandData.accent_color1,
        cancelButtonText: "No",
      }).then((result) => {
        if (result.isConfirmed) {
          try {
                api.post(`/force-cohort-processing/${surveyType}`, {
                  iteration_id: this.survey.iteration_id,
                }).then((res) => {
                  if (res.status >= 200 || res.status <= 299) {
                    api.post(`/iteration-log`, {
                      iteration_id: this.survey.iteration_id,
                      action_made: this.actions,
                      action_by: this.userData.email,
                      action_by_id: this.userData.ind_id,
                      status: "Success",
                      org_id: this.survey.org_id,
                      suborg_id: this.survey.suborg_id,
                      program_id: this.survey.program_id,
                      created_by: this.userData.ind_id,
                      modified_by: this.userData.ind_id,
                    });
                  } else {
                    api.post(`/iteration-log`, {
                      iteration_id: this.survey.iteration_id,
                      action_made: this.actions,
                      action_by: this.userData.email,
                      action_by_id: this.userData.ind_id,
                      status: "Failed",
                      org_id: this.survey.org_id,
                      suborg_id: this.survey.suborg_id,
                      program_id: this.survey.program_id,
                      created_by: this.userData.ind_id,
                      modified_by: this.userData.ind_id,
                    });
                  }

                  flashMessage(
                    this.$flashMessage,
                    this.brandData.accent_color1,
                    this.brandData.flash_text_color,
                    this.selected.length > 1
                      ? "Processing iteration... Please wait for this message to be gone."
                      : "Iteration run finished."
                  );
                  this.allSelected = false;
                  this.selected = [];
                  this.searchResult("iteration");
                  this.actions = null;
                });
          } catch (error) {
            console.error(error);
          }
        }
      });
    }
      // change coach email
      else if (this.actions == 6) {
        this.actions = null;
        this.toggle = false;
        const newValue = this.selected.join(",");

        await api
          .put(`/survey-assignment/coach-email/${newValue}`, {
            coach_id: this.coach_email_inp,
            modified_by: this.userData.ind_id,
          })
          .then(() => {
            flashMessage(
              this.$flashMessage,
              this.brandData.accent_color1
                ? this.brandData.accent_color1
                : "#F47820",
              this.brandData.flash_text_color,
              this.selected.length > 1
                ? "Updating coach of the selected users... Please wait for this message to be gone."
                : "Successfully update coach of the selected user."
            );
            this.allSelected = false;
            this.selected = [];
            this.searchResult();
          })
          .catch((error) => {
            console.log(error);
          });
          //Calculate selected participants scores
      }else if(this.actions == 58){
        this.actions = null;
        this.toggle = false;
        this.surveyAssignmentList = this.selected.map((item) => ({
        survey_assignment_id: item,
      }));
        
        await api
          .post(`/CalculateParticipant`, this.surveyAssignmentList)
          .then(() => {

            flashMessage(
              this.$flashMessage,
              this.brandData.accent_color1
                ? this.brandData.accent_color1
                : "#F47820",
              this.brandData.flash_text_color,
              this.selected.length > 1
                ? "Calculating scores of the selected user(s)... Please wait for this message to be gone."
                : "Successfully calculated scores of the selected user(s)."
            );
            this.allSelected = false;
            this.selected = [];
            this.searchResult();
          })
          .catch((error) => {
            console.log(error);
          });
          //Generate PDF's
      }else if(this.actions == 59){
        this.actions = null;
        this.toggle = false;
        this.setLoading = true;
        this.surveyAssignmentList = this.selected.map((item) => ({
        survey_assignment_id: item,
      }));
        
        await api
          .post(`/process-generate-pdf-by-survey-assignment-id`, this.surveyAssignmentList)
          .then((res) => {
            console.log(res)
            flashMessage(
              this.$flashMessage,
              this.brandData.accent_color1
                ? this.brandData.accent_color1
                : "#F47820",
              this.brandData.flash_text_color,
              this.selected.length >= 1
                ? 'Generated PDF for '+ this.selected.length + ' participant(s).'
                : 'Generated PDF for '+ this.selected.length + ' participant(s).'
            );
            this.allSelected = false;
            this.selected = [];
            this.setLoading = false;
          })
          .catch((error) => {
            console.log(error);
          });
        //make pdf available
      }else if(this.actions == 60){
        this.actions = null;
        this.toggle = false;
        this.setLoading = true;

        const newValue = this.selected.join(",");
        
        await api
          .put(`/survey-assignment/pdf-available/${newValue}`,{
            modified_by: this.userData.ind_id,
          })
          .then((res) => {
            console.log(res)
            flashMessage(
              this.$flashMessage,
              this.brandData.accent_color1
                ? this.brandData.accent_color1
                : "#F47820",
              this.brandData.flash_text_color,
              "Pdf of "+ this.selected.length +" user(s) is now available."
            );
            this.allSelected = false;
            this.selected = [];
            this.setLoading = false;
          })
          .catch((error) => {
            console.log(error);
          });

      }
    },

    validateDates: function (a, b) {
      if (a && b) {
        const first = new Date(a);
        const second = new Date(b);
        if (second < first) {
          return false;
        }
      }
      return true;
    },

    readDate(data) {
      var parsedDate = Date.parse(data);

      if (isNaN(data) && !isNaN(parsedDate)) {
        const humanReadableDateTime = new Date(data).toLocaleString();
        return humanReadableDateTime;
      } else {
        return data;
      }
    },

    async searchResult(sorted) {
      this.setLoading = true;
      this.firstFetchUserData = [];
      this.secondFetchUserData = [];
      this.selected = [];
      this.allSelected = false;

      if (this.survey.iteration_id != null && this.template_id != null) {
        await api
          .get(
            `/survey-assignments/statistics-by-iterationAndTemplate/${this.survey.iteration_id}/${this.template_id}/${this.nomineeSurveyTemplateId}`
          )
          .then((res) => {
            // console.log(res.data);
            this.statisticsData = res.data;
            res.data.map((stat) => {
              this.participantsRegisteredPercentage =
                (stat.participants_registered / stat.participants_count) * 100;
              this.participantsSubmittedPercentage =
                (stat.participants_submitted / stat.participants_count) * 100;
              this.participantsEligiblePercentage =
                (stat.participants_eligible / stat.participants_count) * 100;
              this.totalNomineesPercentage =
                stat.nominees_count / stat.participants_count;
              this.totalNomineesSubmittedPercentage =
                stat.nominees_submitted / stat.participants_count;
            });
          });
      } else if (this.survey.iteration_id != null && this.template_id == null) {
        await api
          .get(
            `/survey-assignments/statistics-by-iteration/${this.survey.iteration_id}`
          )
          .then((res) => {
            // console.log(res.data);
            this.statisticsData = res.data;
            res.data.map((stat) => {
              this.participantsRegisteredPercentage =
                (stat.participants_registered / stat.participants_count) * 100;
              this.participantsSubmittedPercentage =
                (stat.participants_submitted / stat.participants_count) * 100;
              this.participantsEligiblePercentage =
                (stat.participants_eligible / stat.participants_count) * 100;
              this.totalNomineesPercentage =
                stat.nominees_count / stat.participants_count;
              this.totalNomineesSubmittedPercentage =
                stat.nominees_submitted / stat.participants_count;
            });
          });
      }

      if (this.survey.iteration_id !== null) {
        await api
          .get(`/iteration-log/${this.survey.iteration_id}`)
          .then((result) => {
            this.iterationLogTableRows = result.data;
          });
      }

      if (this.showIndividualRecords == true) {
        if (
          this.survey.suborg_id == null &&
          this.survey.program_id == null &&
          this.survey.iteration_id == null
        ) {
          await api
            .get(`individuals/ind_group/org/${this.userData.org_id}`)
            .then((res) => {
              this.firstFetchUserData = res.data;
              flashMessage(
                this.$flashMessage,
                this.brandData.accent_color1
                  ? this.brandData.accent_color1
                  : "#F47820",
                this.brandData.flash_text_color
                  ? this.brandData.flash_text_color
                  : "#ffffff",
                sorted == undefined
                  ? this.firstFetchUserData.length + " result(s) found."
                  : sorted.toString().includes("successfully")
                  ? sorted
                  : this.firstFetchUserData.length + " result(s) found."
              );
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
        } else if (
          this.survey.program_id == null &&
          this.survey.iteration_id == null
        ) {
          await api
            .get(
              `individuals/ind_group/org/${this.userData.org_id}/suborg/${this.survey.suborg_id}/`
            )
            .then((res) => {
              this.firstFetchUserData = res.data;
              flashMessage(
                this.$flashMessage,
                this.brandData.accent_color1
                  ? this.brandData.accent_color1
                  : "#F47820",
                this.brandData.flash_text_color
                  ? this.brandData.flash_text_color
                  : "#ffffff",
                sorted == undefined
                  ? this.firstFetchUserData.length + " result(s) found."
                  : sorted.toString().includes("successfully")
                  ? sorted
                  : this.firstFetchUserData.length + " result(s) found."
              );
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
        } else if (
          this.survey.iteration_id == null &&
          this.survey.stream_id == null
        ) {
          await api
            .get(
              `individuals/ind_group/org/${this.userData.org_id}/suborg/${this.survey.suborg_id}/program/${this.survey.program_id}`
            )
            .then((res) => {
              this.firstFetchUserData = res.data;
              flashMessage(
                this.$flashMessage,
                this.brandData.accent_color1
                  ? this.brandData.accent_color1
                  : "#F47820",
                this.brandData.flash_text_color
                  ? this.brandData.flash_text_color
                  : "#ffffff",
                sorted == undefined
                  ? this.firstFetchUserData.length + " result(s) found."
                  : sorted.toString().includes("successfully")
                  ? sorted
                  : this.firstFetchUserData.length + " result(s) found."
              );
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
        } else if (this.survey.stream_id == null) {
          await api
            .get(
              `individuals/ind_group/org/${this.userData.org_id}/suborg/${this.survey.suborg_id}/program/${this.survey.program_id}/iteration/${this.survey.iteration_id}`
            )
            .then((res) => {
              this.firstFetchUserData = res.data;
              flashMessage(
                this.$flashMessage,
                this.brandData.accent_color1
                  ? this.brandData.accent_color1
                  : "#F47820",
                this.brandData.flash_text_color
                  ? this.brandData.flash_text_color
                  : "#ffffff",
                sorted == undefined
                  ? this.firstFetchUserData.length + " result(s) found."
                  : sorted.toString().includes("successfully")
                  ? sorted
                  : this.firstFetchUserData.length + " result(s) found."
              );
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
        } else {
          await api
            .get(
              `individuals/ind_group/org/${this.userData.org_id}/suborg/${this.survey.suborg_id}/program/${this.survey.program_id}/iteration/${this.survey.iteration_id}/stream/${this.survey.stream_id}`
            )
            .then((res) => {
              this.firstFetchUserData = res.data;
              flashMessage(
                this.$flashMessage,
                this.brandData.accent_color1
                  ? this.brandData.accent_color1
                  : "#F47820",
                this.brandData.flash_text_color
                  ? this.brandData.flash_text_color
                  : "#ffffff",
                sorted == undefined
                  ? this.firstFetchUserData.length + " result(s) found."
                  : sorted.toString().includes("successfully")
                  ? sorted
                  : this.firstFetchUserData.length + " result(s) found."
              );
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
      } else {
        if (
          this.survey.suborg_id == null &&
          this.survey.program_id == null &&
          this.survey.iteration_id == null &&
          this.survey.stream_id == null
        ) {
          await api
            .get(
              `survey-assignments-admin-dashboard/org/${this.userData.org_id}`
            )
            .then((res) => {
              this.secondFetchUserData = res.data;
              flashMessage(
                this.$flashMessage,
                this.brandData.accent_color1
                  ? this.brandData.accent_color1
                  : "#F47820",
                this.brandData.flash_text_color
                  ? this.brandData.flash_text_color
                  : "#ffffff",
                sorted == undefined
                  ? this.secondFetchUserData.length + " result(s) found."
                  : sorted.toString().includes("successfully")
                  ? sorted
                  : this.secondFetchUserData.length + " result(s) found."
              );
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
        } else if (
          this.survey.suborg_id != null &&
          this.survey.program_id == null &&
          this.survey.iteration_id == null &&
          this.survey.stream_id == null
        ) {
          if (this.template_id == null) {
            await api
              .get(
                `survey-assignments/org/${this.userData.org_id}/suborg/${this.survey.suborg_id}`
              )
              .then((res) => {
                this.secondFetchUserData = res.data;
                flashMessage(
                  this.$flashMessage,
                  this.brandData.accent_color1
                    ? this.brandData.accent_color1
                    : "#F47820",
                  this.brandData.flash_text_color
                    ? this.brandData.flash_text_color
                    : "#ffffff",
                  sorted == undefined
                    ? this.secondFetchUserData.length + " result(s) found."
                    : sorted.toString().includes("successfully")
                    ? sorted
                    : this.secondFetchUserData.length + " result(s) found."
                );
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
          } else {
            api
              .get(
                `survey-assignments-survey-template/org/${this.userData.org_id}/suborg/${this.survey.suborg_id}/template/${this.template_id}`
              )

              .then((res) => {
                this.secondFetchUserData = res.data;
                flashMessage(
                  this.$flashMessage,
                  this.brandData.accent_color1
                    ? this.brandData.accent_color1
                    : "#F47820",
                  this.brandData.flash_text_color
                    ? this.brandData.flash_text_color
                    : "#ffffff",
                  sorted == undefined
                    ? this.secondFetchUserData.length + " result(s) found."
                    : sorted.toString().includes("successfully")
                    ? sorted
                    : this.secondFetchUserData.length + " result(s) found."
                );
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
        } else if (
          this.survey.suborg_id != null &&
          this.survey.program_id != null &&
          this.survey.iteration_id == null &&
          this.survey.stream_id == null
        ) {
          if (this.template_id == null) {
            await api
              .get(
                `survey-assignments/org/${this.userData.org_id}/suborg/${this.survey.suborg_id}/program/${this.survey.program_id}`
              )
              .then((res) => {
                this.secondFetchUserData = res.data;
                flashMessage(
                  this.$flashMessage,
                  this.brandData.accent_color1
                    ? this.brandData.accent_color1
                    : "#F47820",
                  this.brandData.flash_text_color
                    ? this.brandData.flash_text_color
                    : "#ffffff",
                  sorted == undefined
                    ? this.secondFetchUserData.length + " result(s) found."
                    : sorted.toString().includes("successfully")
                    ? sorted
                    : this.secondFetchUserData.length + " result(s) found."
                );
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
          } else {
            await api
              .get(
                `survey-assignments-survey-template/org/${this.userData.org_id}/suborg/${this.survey.suborg_id}/program/${this.survey.program_id}/template/${this.template_id}`
              )
              .then((res) => {
                this.secondFetchUserData = res.data;
                flashMessage(
                  this.$flashMessage,
                  this.brandData.accent_color1
                    ? this.brandData.accent_color1
                    : "#F47820",
                  this.brandData.flash_text_color
                    ? this.brandData.flash_text_color
                    : "#ffffff",
                  sorted == undefined
                    ? this.secondFetchUserData.length + " result(s) found."
                    : sorted.toString().includes("successfully")
                    ? sorted
                    : this.secondFetchUserData.length + " result(s) found."
                );
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
        } else if (
          this.survey.suborg_id != null &&
          this.survey.program_id != null &&
          this.survey.iteration_id != null &&
          this.survey.stream_id == null
        ) {
          if (this.template_id == null) {
            await api
              .get(
                `survey-assignments/org/${this.userData.org_id}/suborg/${this.survey.suborg_id}/program/${this.survey.program_id}/iteration/${this.survey.iteration_id}`
              )
              .then((res) => {
                this.secondFetchUserData = res.data;
                flashMessage(
                  this.$flashMessage,
                  this.brandData.accent_color1
                    ? this.brandData.accent_color1
                    : "#F47820",
                  this.brandData.flash_text_color
                    ? this.brandData.flash_text_color
                    : "#ffffff",
                  sorted == undefined
                    ? this.secondFetchUserData.length + " result(s) found."
                    : sorted.toString().includes("successfully")
                    ? sorted
                    : this.secondFetchUserData.length + " result(s) found."
                );
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
          } else {
            await api
              .get(
                `survey-assignments-survey-template/org/${this.userData.org_id}/suborg/${this.survey.suborg_id}/program/${this.survey.program_id}/iteration/${this.survey.iteration_id}/template/${this.template_id}`
              )
              .then((res) => {
                this.secondFetchUserData = res.data;
                flashMessage(
                  this.$flashMessage,
                  this.brandData.accent_color1
                    ? this.brandData.accent_color1
                    : "#F47820",
                  this.brandData.flash_text_color
                    ? this.brandData.flash_text_color
                    : "#ffffff",
                  sorted == undefined
                    ? this.secondFetchUserData.length + " result(s) found."
                    : sorted.toString().includes("successfully")
                    ? sorted
                    : sorted.toString().includes("iteration")
                    ? "Iteration run successful"
                    : this.secondFetchUserData.length + " result(s) found."
                );
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
        } else if (
          this.survey.suborg_id != null &&
          this.survey.program_id != null &&
          this.survey.iteration_id != null &&
          this.survey.stream_id != null
        ) {
          if (this.template_id == null) {
            await api
              .get(
                `survey-assignments/org/${this.userData.org_id}/suborg/${this.survey.suborg_id}/program/${this.survey.program_id}/iteration/${this.survey.iteration_id}/stream/${this.survey.stream_id}`
              )
              .then((res) => {
                this.secondFetchUserData = res.data;
                flashMessage(
                  this.$flashMessage,
                  this.brandData.accent_color1
                    ? this.brandData.accent_color1
                    : "#F47820",
                  this.brandData.flash_text_color
                    ? this.brandData.flash_text_color
                    : "#ffffff",
                  sorted == undefined
                    ? this.secondFetchUserData.length + " result(s) found."
                    : sorted.toString().includes("successfully")
                    ? sorted
                    : this.secondFetchUserData.length + " result(s) found."
                );
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
          } else {
            await api
              .get(
                `survey-assignments-survey-template/org/${this.userData.org_id}/suborg/${this.survey.suborg_id}/program/${this.survey.program_id}/iteration/${this.survey.iteration_id}/stream/${this.survey.stream_id}/template/${this.template_id}`
              )
              .then((res) => {
                this.secondFetchUserData = res.data;
                flashMessage(
                  this.$flashMessage,
                  this.brandData.accent_color1
                    ? this.brandData.accent_color1
                    : "#F47820",
                  this.brandData.flash_text_color
                    ? this.brandData.flash_text_color
                    : "#ffffff",
                  sorted == undefined
                    ? this.secondFetchUserData.length + " result(s) found."
                    : sorted.toString().includes("successfully")
                    ? sorted
                    : this.secondFetchUserData.length + " result(s) found."
                );
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
        }
      }
      this.toggle = false;
      this.actions = null;
      this.survey.survey_template_id = null;
      this.setLoading = false;
    },

    clearData() {
      this.firstFetchUserData = [];
      this.secondFetchUserData = [];
      this.selected = [];
      this.allSelected = false;
      this.toggle = false;
      this.actions = null;
      this.surveyTemplate = null;
      this.sortBy = "";
      this.tags = null;
      this.survey.action_program_id = null;
      this.survey.action_iteration_id = null;
      this.survey.action_stream_id = null;
      this.survey.group_id = null;
      this.survey.survey_template_id = null;
      this.suborg_inp = null;
      this.program_inp = null;
      this.iteration_inp = null;
      this.stream_inp = null;
      this.group_inp = null;
      this.coach_email_inp = null;
      this.dates.deadline_final = "";
      this.dates.launch = "";
      this.dates.reminder = "";
      this.dates.coach_report_start = "";
      this.dates.coach_report_end = "";
      this.dates.participant_report_start = "";
      this.dates.initial_deadline = "";
      this.statisticsData = [];
      this.participantsRegisteredPercentage = 0;
      this.participantsSubmittedPercentage = 0;
      this.participantsEligiblePercentage = 0;
      this.totalNomineesPercentage = 0;
      this.totalNomineesSubmittedPercentage = 0;
      this.nomineeSurveyTemplateId = 0;
      this.iterationLogTableRows = null;
    },

    clearInput() {
      this.tags = null;
      this.survey.action_program_id = null;
      this.survey.action_iteration_id = null;
      this.survey.action_stream_id = null;
      this.survey.action_tag = null;
      this.survey.group_id = null;
      this.survey.survey_template_id = null;
      this.suborg_inp = null;
      this.program_inp = null;
      this.iteration_inp = null;
      this.stream_inp = null;
      this.group_inp = null;
      this.coach_email_inp = null;
      this.dates.deadline_final = "";
      this.dates.launch = "";
      this.dates.reminder = "";
      this.dates.coach_report_start = "";
      this.dates.coach_report_end = "";
      this.dates.participant_report_start = "";
      this.dates.initial_deadline = "";
    },

    selectAll() {
      if (this.allSelected) {
        const selected = this.firstFetchUserData.map((u) => u);
        this.selected = selected;
      } else {
        this.selected = [];
      }
    },

    secondSelectAll() {
      if (this.allSelected) {
        const selected = this.secondFetchUserData.map(
          (u) => u.survey_assignment_id
        );
        this.selected = selected;
      } else {
        this.selected = [];
      }
    },
  },

  computed: {
    filteredRemoveTags: function () {
      return this.mapTags.filter(function (el) {
        return el !== undefined;
      }, this);
    },

    mapTags: function () {
      return this.userTags
        .sort((a, b) => a.tag_type.localeCompare(b.tag_type))
        .map(function (el) {
          if (this.userData.org_id === el.org_id) {
            return { value: el.tag_id, label: el.tag_type };
          }
        }, this);
    },

    filteredTags: function () {
      return this.userTags
        .sort((a, b) => a.tag_type.localeCompare(b.tag_type))
        .filter(function (el) {
          if (this.userData.org_id != "") {
            return el.org_id == this.userData.org_id;
          }
        }, this);
    },

    filteredSubOrg: function () {
      return this.userSubOrg
        .sort((a, b) => a.suborg_name.localeCompare(b.suborg_name))
        .filter(function (el) {
          if (this.userData.org_id != "") {
            return el.org_id == this.userData.org_id;
          }
        }, this);
    },

    mapSubOrg: function () {
      return this.userSubOrg.map(function (el) {
        if (this.userData.org_id === el.org_id) {
          return { value: el.suborg_id, label: el.suborg_name };
        }
      }, this);
    },

    filteredSubOrgActions: function () {
      return this.mapSubOrg.filter(
        function (el) {
          return el !== undefined;
        },
        this,
        console.log(this.statisticsData)
      );
    },

    mapUserProgram: function () {
      return this.userPrograms.map(function (el) {
        if (
          this.userData.org_id === el.org_id &&
          this.survey.suborg_id == el.suborg_id
        ) {
          return { value: el.program_id, label: el.program_name };
        }
      }, this);
    },

    filteredProgramActions: function () {
      return this.mapUserProgram.filter(function (el) {
        return el !== undefined;
      }, this);
    },

    filteredProgram: function () {
      return this.userPrograms
        .sort((a, b) => a.program_name.localeCompare(b.program_name))
        .filter(function (el) {
          if (this.userData.org_id != "") {
            return (
              el.org_id == this.userData.org_id &&
              el.suborg_id == this.survey.suborg_id
            );
          }
        }, this);
    },

    mapIteration: function () {
      return this.userIterations.map(function (el) {
        if (
          this.userData.org_id === el.org_id &&
          this.survey.suborg_id == el.suborg_id &&
          this.survey.program_id == el.program_id
        ) {
          return { value: el.iteration_id, label: el.iteration_name };
        }
      }, this);
    },

    mapIterationMultiSelect: function () {
      return this.userIterations.map(function (el) {
        if (
          this.userData.org_id === el.org_id &&
          this.survey.suborg_id == el.suborg_id &&
          this.survey.action_program_id == el.program_id
        ) {
          return { value: el.iteration_id, label: el.iteration_name };
        }
      }, this);
    },

    filteredIterationActions: function () {
      return this.mapIteration.filter(function (el) {
        return el !== undefined;
      }, this);
    },

    filteredIterationMultiSelectActions: function () {
      return this.mapIterationMultiSelect.filter(function (el) {
        return el !== undefined;
      }, this);
    },

    filteredIteration: function () {
      return this.userIterations
        .sort((a, b) => a.iteration_name.localeCompare(b.iteration_name))
        .filter(function (el) {
          if (this.userData.org_id != "") {
            return (
              el.org_id == this.userData.org_id &&
              el.suborg_id == this.survey.suborg_id &&
              el.program_id == this.survey.program_id
            );
          }
        }, this);
    },

    mapStream: function () {
      return this.userStreams.map(function (el) {
        if (
          this.userData.org_id === el.org_id &&
          this.survey.suborg_id == el.suborg_id &&
          this.survey.program_id == el.program_id &&
          this.survey.iteration_id == el.iteration_id
        ) {
          return { value: el.stream_id, label: el.stream_name };
        }
      }, this);
    },

    filteredStreamActions: function () {
      return this.mapStream.filter(function (el) {
        return el !== undefined;
      }, this);
    },

    filteredStream: function () {
      return this.userStreams
        .sort((a, b) => a.stream_name.localeCompare(b.stream_name))
        .filter(function (el) {
          if (this.userData.org_id != "") {
            return (
              el.org_id == this.userData.org_id &&
              el.suborg_id == this.survey.suborg_id &&
              el.program_id == this.survey.program_id &&
              el.iteration_id == this.survey.iteration_id
            );
          }
        }, this);
    },

    mapUserGroup: function () {
      return this.userGroups.map(function (el) {
        if (
          this.userData.org_id === el.org_id &&
          this.survey.suborg_id == el.suborg_id &&
          this.survey.program_id == el.program_id &&
          this.survey.iteration_id == el.iteration_id &&
          this.survey.stream_id == el.stream_id
        ) {
          return { value: el.group_id, label: el.group_name };
        }
      }, this);
    },

    mapUserGroupMultiSelect: function () {
      return this.userGroups.map(function (el) {
        if (
          this.userData.org_id === el.org_id &&
          this.survey.suborg_id == el.suborg_id &&
          this.survey.program_id == el.program_id &&
          this.survey.iteration_id == el.iteration_id &&
          this.survey.action_stream_id == el.stream_id
        ) {
          return { value: el.group_id, label: el.group_name };
        }
      }, this);
    },

    filteredGroupActions: function () {
      return this.mapUserGroup.filter(function (el) {
        return el !== undefined;
      }, this);
    },

    filteredGroupMultiSelectActions: function () {
      return this.mapUserGroupMultiSelect.filter(function (el) {
        return el !== undefined;
      }, this);
    },

    mapCoachEmail: function () {
      return this.coachUsers.map(function (el) {
        if (
          el.suborgs != 0 &&
          el.suborgs != null &&
          el.suborgs != undefined &&
          el.suborgs != ""
        ) {
          var newValueSuborg = el.suborgs.split(", ");
          this.newNameSuborg = newValueSuborg.map(
            (r) => this.userSubOrg.find((f) => f.suborg_id == r).suborg_id
          );
        }

        var joinSuborg = this.newNameSuborg.join(", ");

        if (joinSuborg.includes(this.survey.suborg_id)) {
          return { value: el.ind_id, label: el.email };
        }
      }, this);
    },

    filteredCoachEmailActions: function () {
      return this.mapCoachEmail.filter(function (el) {
        return el !== undefined;
      }, this);
    },

    filteredSurveyTemplate: function () {
      return this.userSurveyTemplate
        .sort((a, b) =>
          a.survey_template_name.localeCompare(b.survey_template_name)
        )
        .filter(function (el) {
          if (this.userData.org_id != "") {
            return (
              el.org_id == this.userData.org_id &&
              el.suborg_id == this.survey.suborg_id
            );
          }
        }, this);
    },

    filteredBatchActions: function () {
      return this.batchActions
        .sort((a, b) => a.batch_action_type.localeCompare(b.batch_action_type))
        .filter(function (el) {
          if (this.template_id != null && this.survey.iteration_id != null) {
            return (
              el.batch_action_id != 19 &&
              el.batch_action_id != 21 &&
              el.batch_action_id != 22
            );
          } else {
            return (
              el.batch_action_id != 19 &&
              el.batch_action_id != 21 &&
              el.batch_action_id != 22 &&
              el.batch_action_id != 25
            );
          }
        }, this);
    },

    filteredAssignGroup: function () {
      return this.batchActions2
        .sort((a, b) => a.batch_action_type.localeCompare(b.batch_action_type))
        .filter(function (el) {
          if (
            this.survey.program_id != null &&
            this.survey.iteration_id != null
          ) {
            return el.batch_action_id == 22;
          }
        }, this);
    },

    filteredUserSurveyTemplate: function () {
      return this.userSurveyTemplate
        .sort((a, b) =>
          a.survey_template_name.localeCompare(b.survey_template_name)
        )
        .filter(function (el) {
          if (
            el.nominee_survey_template_id != null &&
            el.org_id == this.userData.org_id &&
            el.suborg_id == this.survey.suborg_id
          ) {
            return el;
          }
        }, this);
    },

    disableGoButton() {
      if (this.tags != null && this.tags != "") {
        return true;
      } else if (
        this.survey.action_program_id != null &&
        this.survey.action_program_id != ""
      ) {
        return true;
      } else if (
        this.survey.action_iteration_id != null &&
        this.survey.action_iteration_id != ""
      ) {
        return true;
      } else if (
        this.survey.action_stream_id != null &&
        this.survey.action_stream_id != ""
      ) {
        return true;
      } else if (this.survey.group_id != null && this.survey.group_id != "") {
        return true;
      } else if (
        this.survey.survey_template_id != null &&
        this.survey.survey_template_id != ""
      ) {
        return true;
      } else if (this.suborg_inp != null && this.suborg_inp != "") {
        return true;
      } else if (this.program_inp != null && this.program_inp != "") {
        return true;
      } else if (this.iteration_inp != null && this.iteration_inp != "") {
        return true;
      } else if (this.stream_inp != null && this.stream_inp != "") {
        return true;
      } else if (this.group_inp != null && this.group_inp != "") {
        return true;
      } else if (this.coach_email_inp != null && this.coach_email_inp != "") {
        return true;
      } else if (
        this.dates.deadline_final != null &&
        this.dates.deadline_final != ""
      ) {
        return true;
      } else if (this.dates.launch != null && this.dates.launch != "") {
        return true;
      } else if (this.dates.reminder != null && this.dates.reminder != "") {
        return true;
      } else if (
        this.dates.coach_report_start != null &&
        this.dates.coach_report_start != ""
      ) {
        return true;
      } else if (
        this.dates.coach_report_end != null &&
        this.dates.coach_report_end != ""
      ) {
        return true;
      } else if (
        this.dates.participant_report_start != null &&
        this.dates.participant_report_start != ""
      ) {
        return true;
      } else if (
        this.dates.initial_deadline != null &&
        this.dates.initial_deadline != ""
      ) {
        return true;
      } else if (
        this.survey.action_tag != null &&
        this.survey.action_tag != ""
      ) {
        return true;
      } else {
        return false;
      }
    },

    sortedProperties() {
      const direction = this.sortDirection;
      const head = this.sortBy;
      return this.firstFetchUserData.sort(this.dynamicSort(head, direction));
    },

    table2SortedProperties() {
      const direction = this.sortDirection;
      const head = this.sortBy;
      return this.secondFetchUserData.sort(this.dynamicSort(head, direction));
    },
  },
};
</script>

<style src="@vueform/multiselect/themes/default.css"></style>

<style scoped>
.icon-background1 {
  color: red;
  /* background-color: black; */
}
.fa-star {
  color: green;
}

.label-btn {
  color: #0e5071;
  background-color: #fff;
}

.label-div {
  padding: 10px;
  border: 1px solid #0e5071;
  background-color: #0e5071;
  color: #fff;
  display: flex;
  justify-content: space-between;
}
#batchAction {
  height: 10%;
  white-space: nowrap;
  text-overflow: ellipsis;
  word-wrap: break-word;
  border-color: grey;
  margin: 30px 0px;
}

.input {
  width: 100%;
  outline: 0;
  border-width: 0 0 1px;
  border-color: grey;
  padding: 2px 5px;
  margin: 10px 0px;
  font-family: Arial, Helvetica, sans-serif;
}

.box {
  border: 1px solid #ccc;
  border-top: 4px solid rgb(185, 22, 10);
  text-align: center;
  font: -webkit-control;
  margin: 0 10px;
  min-height: 400px;
  padding: 10px;
  max-width: 250px;
  min-height: 620px;
}

.boxReports {
  border: 1px solid #ccc;
  /* border-top: 4px solid rgb(185, 22, 10); */
  text-align: left;
  font: -webkit-control;
  margin: 0 10px;
  min-height: 10px;
  max-width: 100%;
  min-width: 75vw;
}

.boxStatistics {
  border: 1px solid #ccc;
  /* border-top: 4px solid rgb(185, 22, 10); */
  text-align: left;
  font: -webkit-control;
  margin: 0 10px;
  min-height: 10vh;
  max-width: 100%;
  min-width: 37.5vw;
}

.label1 {
  top: 0px;
  left: 0px;
  font-size: 18px;
  color: rgba(0, 0, 0, 0.54);
  font-family: Arial, Helvetica, sans-serif;
}

.input1 {
  width: 85%;
  outline: 0;
  border-color: grey;
  padding: 2px 5px;
  margin: 10px 0px;
}
.inputTemplate {
  width: 60%;
  outline: 0;
  border-color: grey;
  padding: 2px 5px;
  margin: 10px 0px;
}

#selectTag {
  width: 90%;
}

.batch-action-input {
  width: 30%;
  outline: 0;
  border-color: grey;
  padding: 2px 5px;
  margin: 10px 0px;
}

#selectBatchAction {
  width: 85%;
  outline: 0;
  border-color: grey;
  padding: 2px 5px;
  margin: 10px 0px;
}

.batch-action-input2 {
  width: 85%;
  outline: 0;
  border-color: grey;
  padding: 2px 5px;
  margin: 10px 0px;
}

#iteration-log-table {
  border-collapse: collapse;
  width: 100%;
}

#iteration-log-table th,
#iteration-log-table td {
  border: 1px solid black;
  text-align: left;
  padding: 8px;
}

#iteration-log-table th {
  background-color: #90d1f1;
  position: sticky;
  top: 0;
}

#iteration-log-table-container {
  height: 200px;
  overflow-y: scroll;
  margin: 0 0 20px 0;
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

#table2 {
  width: 100%;
  /* table-layout: fixed; */
  border-collapse: collapse;
}

#table2 td,
#table2 th {
  border: 1px solid #ddd;
  padding: 6px;
  height: auto;
}

#table2 tr:nth-child(even) {
  background-color: #f2f2f2;
}

#table2 tr:hover {
  background-color: #ddd;
}

#table2 th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #0e5071;
  color: white;
  word-break: word-wrap;
  font-size: 0.7vw;
}

#table2 td {
  text-align: left;
  vertical-align: middle;
  word-break: word-wrap;
  font-size: 0.7vw;
}

.td-checkbox {
  text-align: center !important;
}

.active {
  color: #f47820;
}

.statistics-label {
  margin: 0;
}

.search-btn {
  width: 20%;
}

.main-div {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-wrap: wrap;
  position: relative;
}

.actions-container {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  align-content: center;
  margin-top: 30px;
}

.batchAction-btn {
  margin-left: 20px;
  width: 20%;
}

.multiselect-input {
  --ms-tag-font-size: 1vw;
  --ms-px: 0.5rem;
}

@media only screen and (min-width: 280px) and (max-width: 900px) {
  .main-div {
    font-size: 2.5vw;
    background: white;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    position: relative;
    align-items: center;
  }

  .search-btn {
    width: 20%;
  }
  #batchAction {
    height: 10%;
    white-space: nowrap;
    text-overflow: ellipsis;
    word-wrap: break-word;
    border-color: grey;
    margin: 30px 0px;
    font-size: 1.5vw;
  }

  .input {
    width: 80%;
    outline: 0;
    border-width: 0 0 1px;
    border-color: grey;
    padding: 2px 5px;
    margin: 10px 0px;
    font-family: Arial, Helvetica, sans-serif;
  }
  .multiselect {
    font-size: 1.5vw;
  }

  .batch-action-input2 {
    font-size: 1.5vw;
  }
  .input1 {
    font-size: 1.5vw;
  }

  #table2 {
    font-size: 2vw;
    border-collapse: collapse;
    word-break: break-word;
  }

  #table {
    font-size: 1.5vw;
  }

  .table2-container {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    position: relative;
    align-items: center;
  }

  .actions-container {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    align-content: center;
    margin-top: 30px;
    width: 100%;
    font-size: 1vw;
  }
  .batch-action-input {
    width: 30%;
    outline: 0;
    border-color: grey;
    padding: 2px 5px;
    margin: 10px 0px;
  }

  .multiselect-input {
    --ms-tag-font-size: 0.6vw;
    --ms-px: 0.3rem;
  }

  #selectBatchAction[data-v-119a4ef4] {
    font-size: 1.5vw;
  }
  .batch-action-desc {
    font-size: 1.5vw;
  }
}
input, select, option, textarea {
  border: 1px solid grey;
}
</style>
