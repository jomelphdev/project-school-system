<script setup>
// eslint-disable-next-line
/* eslint-disable */
import api from "../api/api.js";
import Header from './Header.vue'
import Editor from '@tinymce/tinymce-vue'
import Multiselect from "@vueform/multiselect";
import Swal from "sweetalert2";
import APIkey from "../libraries/tiny-cloud.js";


</script>

<template>
  <div class="body-container">
    <div>
      <Header label="Manage Announcements"></Header>
      <br>
    </div>

    <v-data-table
    :headers="headers"
    :items="filteredAnnouncements"
    items-per-page="12"
    return-object
    show-select
    :sort-by="[{ key: 'release_date', order: 'asc' }]"
    v-model= "selected"
    :loading="isLoading"
    density="compact"
    loading-text="Loading... Please wait"
    class="custom-data-table"
  >


  <!-- Edit the css of items in the table -->
  <!-- <template v-for="header in headers" v-slot:[`item.${header.key}`]="{ item }">
    <div class="table-items">
      {{ item[header.key] }}
    </div>
  </template> -->
    
    <template v-slot:top>
      <v-toolbar style="margin-bottom: 15px; background-color: white;">
        <v-dialog 
        v-model="dialog" 
        min-width="80%" 
        min-height="80%" 
        z-index="1" 
        persistent
        :retain-focus="false"
        >
          <template v-slot:activator="{ props }">
          <div style="max-width: 35px; margin-left: 12px;">
            <v-btn
              :ripple="false"
              class="menu-buttons"
              color="rgb(84, 87, 91)"
              icon="fa-solid fa-trash-can"
              @click="deleteItems(selected)"
            >
            </v-btn>
          </div>
          <div style="max-width: 35px;">
            <v-btn
              :ripple="false"
              class="menu-buttons"
              color="rgb(84, 87, 91)"
              v-bind="props"
              icon="fa-solid fa-plus"
              @click="getOrgData()"
            >
            </v-btn>
          </div>

          </template>
          <v-card class="pa-10">
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>
            <!-- contents of form -->
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.title"
                      density="compact"
                      variant="outlined"
                      label="Announcement Title"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="30" sm="10" md="10">
                    <v-list-subheader>Announcements have a limit of 160 characters. Please click on the Word Count on the bottom left of the input form to see a character count.</v-list-subheader>
                    <Editor
                      api-key="APIkey"
                      v-model="editedItem.description"
                      :init="{
                          toolbar_mode: 'sliding',
                          plugins: 'anchor autolink charmap codesample emoticons image link lists searchreplace table visualblocks wordcount',
                          // plugins: 'tinycomments mentions anchor autolink charmap codesample emoticons image link lists searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed permanentpen advtable advcode powerpaste tinymcespellchecker a11ychecker hr',
                          toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | tinycomments | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
                          tinycomments_mode: 'embedded',
                          height: '300',
                          width: '100%'
                      }"
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.announcement_from"
                      density="compact"
                      variant="outlined"
                      label="From"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <Multiselect
                      v-model="editedItem.roles"
                      class="input1"
                      placeholder="Add Roles"
                      mode="tags"
                      :searchable="true"
                      :options="rolesOptions"
                      :allow-empty="true"
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.for_email"
                      density="compact"
                      variant="outlined"
                      label="For Email"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <Multiselect
                      v-model="editedItem.respondents"
                      class="input2"
                      placeholder="Add Respondent"
                      mode="tags"
                      :searchable="true"
                      :options="respondentsOptions"
                      :allow-empty="true"
                    />
                  </v-col>
                </v-row>
                <div class="gospi-container">
                  <label for="gospi-container"> <b>GOSPI Picker</b></label>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-radio-group v-model="selectedGlobal" inline>
                        <v-radio :label="global[0].globalName" :value="global[0].globalID"></v-radio>
                        <v-radio :label="global[1].globalName" :value="global[1].globalID"></v-radio>
                      </v-radio-group>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-select
                        v-model="selectedOrg"
                        :items="org"
                        :item-title="'orgName'"
                        :item-value="'orgId'"
                        item-text="orgName"
                        density="compact"
                        variant="outlined"
                        label="Select Org"
                        class="mr-3"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-select
                        v-model="selectedSubOrg"
                        :items="sortedSubOrgs"
                        :item-title="'subOrgName'"
                        :item-value="'subOrgId'"
                        item-text="subOrgName"
                        density="compact"
                        variant="outlined"
                        label="Select Sub-Org"
                        class="mr-3"
                        @update:modelValue="getProgramData(selectedSubOrg)"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-select
                        v-model="selectedProgram"
                        :items="sortedPrograms"
                        :item-title="'programName'"
                        :item-value="'programId'"
                        item-text="programName"
                        density="compact"
                        variant="outlined"
                        label="Select Program"
                        class="mr-3"
                        @update:modelValue="getIterationData(selectedProgram)"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-select
                        v-model="selectedIteration"
                        :items="sortedIterations"
                        :item-title="'iterationName'"
                        :item-value="'iterationId'"
                        item-text="iterationName"
                        density="compact"
                        variant="outlined"
                        label="Select Iteration"
                        class="mr-3"
                      ></v-select>
                    </v-col>
                  </v-row>
                </div>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <label for="release_date">Release Date <b>(UTC)</b> :</label>
                    <input
                      class="inputDateTime"
                      type="datetime-local"
                      id="release_date"
                      :value="editedItem.release_date"
                      @input="editedItem.release_date = $event.target.value"
                    />
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <label for="expired_at">Expiry Date <b>(UTC)</b> :</label>
                    <input
                      class="inputDateTime"
                      type="datetime-local"
                      id="expired_at"
                      :value="editedItem.expired_at"
                      @input="editedItem.expired_at = $event.target.value"
                    />
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <!-- actions are centered -->
            <v-card-actions class="justify-center">
              <v-btn class="dialog-buttons" color="primary" @click="save">
                Save
              </v-btn>
              <v-btn class="dialog-buttons" color="red" @click="close">
                Cancel
              </v-btn>
            </v-card-actions>

          </v-card>
        </v-dialog>

        <v-dialog v-model="dialogDelete" max-width="45%" class="text-center">
          <v-card class="pa-4">
            <v-card-title class="text-h5">
              Are you sure you want to delete the selected item or items?
            </v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                class="dialog-buttons"
                color="primary"
                @click="deleteItemConfirm(selected.announcement_id)"
                elevated
              >
                OK
              </v-btn>
              <v-btn
                class="dialog-buttons"
                color="red"
                @click="closeDelete"
                elevated
              >
                Cancel
              </v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>

      </v-toolbar>
    </template>
    
    <template v-slot:item.actions="{ item }">
      <v-icon size="small" class="me-2" @click="editItem(item)">
        mdi-pencil
      </v-icon>
    </template>

    <template v-slot:item.description="{ item }">
      <div v-html="item.description"></div>
    </template>

    <!-- Filtering Code -->
    <template v-for="header in headers" v-slot:[`header.${header.key}`]="{ column }">
      <thead class="v-data-table-header">
        <tr>
          <th
            v-bind:class="[column.sortable ? 'sortable' : '', pagination.sortBy == column.value ? 'active': '', pagination.descending ? 'desc':'asc']"
            @click="column.sortable ? changeSort(column.value) : ''"
          >
            <div>
              <span>{{ column.title }}</span>
              <v-icon v-if="column.sortable" class="v-data-table-header__icon" small>
                {{ pagination.descending ? 'mdi-arrow-down' : 'mdi-arrow-up' }}
              </v-icon>
            </div>
          </th>
          <th v-if="column.value !== 'actions'">
            <v-autocomplete
              multiple
              chips
              variant="underlined"
              clearable
              density="compact"
              style="margin-top: 10px; margin-bottom: 10px; padding: 0;"
              :items="columnValueList(column.value)"
              v-model="filters[column.value]"
              @click.stop="{/* Stop click event propagation */}"
            >
              <template v-slot:selection="{ item, index }">
                <v-chip v-if="index < 5">
                  <span>{{ item }}</span>
                </v-chip>
                <span v-if="index === 5">(+{{ filters[header.value].length - 5 }} others)</span>
              </template>
            </v-autocomplete>
          </th>
        </tr>  
      </thead>
    </template>

    <template v-slot:item.roles="{ item }">
      {{ item.roles }}
      <v-tooltip
          activator="parent"
          location="start"
        >{{ mapValueToText(item.roles) }}</v-tooltip>
    </template>

    <template v-slot:item.release_date="{ item }">
      {{ readDate(item.release_date) }}
      <v-tooltip activator="parent" location="start">
        Expired At: {{ item.expired_at !== '1970-01-01T00:00' ? readDate(item.expired_at) : 'No expiry date entered' }}
      </v-tooltip>
    </template>

    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize"> Reload Table </v-btn>
    </template>
  </v-data-table>
  </div>
  
</template>



<script>
export default {
  component: [Header],
  props: ['userData', 'brandData'],
  name: "ManageAnnouncements",
  data: () => ({
    rolesOptions: [],
    respondentsOptions: [],
    global: [
      {globalID: 0, globalName: 'Not Global'},
      {globalID: 1, globalName: 'Global'},
    ],
    selectedGlobal: 0,
    org: [],
    selectedOrg: [{orgId: 0, orgName: 'No Org'}],
    subOrgs: [],
    selectedSubOrg: [{subOrgId: 0, subOrgName: 'No Sub-Org'}],
    programs: [],
    selectedProgram: [{programId: 0, programName: 'No Program'}],
    iterations: [],
    selectedIteration: [{iterationId: 0, iterationName: 'No iteration'}],
    isLoading: true,
    pagination: {
        sortBy: null,
        descending: false,
        page: 1,
        itemsPerPage: 5
      },
    filters: {},
    activeFilters: {},
    dialog: false,
    selected: [],
      dialogDelete: false,
      headers: [
        {
          title: '',
          align: 'start',
          sortable: false,
          key: 'actions',
        },
        { title: 'Title', key: 'title' },
        { title: 'Message', key: 'description' },
        { title: 'For', key: 'GOSPI' },
        { title: 'From', key: 'announcement_from' },
        { title: 'Roles', key: 'roles' },
        { title: 'Release (UTC)', key: 'release_date' },
      ],
      allAnnouncementsData: [],
      editedIndex: -1,
      editedItem: {
        title: '',
        description: '',
        announcement_from: '',
        roles: [0],
        respondents:[0],
        release_date: '',
        expired_at: '',
        global_id: 0,
        suborg_id: 0,
        program_id: 0,
        iteration_id: 0
      },
      defaultItem: {
        title: '',
        description: '',
        announcement_from: '',
        roles: [0],
        respondents:[0],
        release_date: '',
        expired_at: '',
        global_id: 0,
        suborg_id: 0,
        program_id: 0,
        iteration_id: 0
      },
  }),
  computed: {
    sortedIterations() {
      return this.iterations.slice().sort((a, b) => {
        // Assuming iterationName is a string, adjust the comparison as needed
        return a.iterationName.localeCompare(b.iterationName);
      });
    },
    sortedPrograms() {
      return this.programs.slice().sort((a, b) => {
        // Assuming programName is a string, adjust the comparison as needed
        return a.programName.localeCompare(b.programName);
      });
    },
    sortedSubOrgs() {
      return this.subOrgs.slice().sort((a, b) => {
        // Assuming subOrgName is a string, adjust the comparison as needed
        return a.subOrgName.localeCompare(b.subOrgName);
      });
    },
    formTitle() {
        return this.editedIndex === -1 ? 'Add New Announcement' : 'Edit Announcement'
    },
    headers() {
      // ... your existing headers configuration ...

      // Modify headers to include 'key' property for filtering
      return this.headers.map(header => ({ ...header, key: header.key || header.value }));
    },
    filteredAnnouncements() {
      return this.allAnnouncementsData.filter((d) => {
        return Object.keys(this.filters).every((f) => {
          return this.filters[f].length < 1 || this.filters[f].includes(d[f]);
        });
      });
    },
  },
  async created() {
    this.getAnnouncementsData()
    this.getOrgData()
  },
  watch: {
      dialog(val) {
        val || this.close()
      },
      dialogDelete(val) {
        val || this.closeDelete()
      },
    },
  methods: {
    async getAnnouncementsData() {
      try {
        const res = await api.get("/get-all-announcements", {});
        if (res.status === 200) {
          this.allAnnouncementsData = res.data;

          // Format dates before assigning them to the component data
          this.allAnnouncementsData.forEach(async (announcement) => {
            announcement.release_date = this.formatDate(announcement.release_date);
            announcement.expired_at = this.formatDate(announcement.expired_at);
            
            announcement.roles = announcement.roles.split(',').map(roleId => parseInt(roleId.trim(), 10));
            announcement.respondents = announcement.respondents.split(',').map(respondentId => parseInt(respondentId.trim(), 10));
          });

          console.log('allAnnouncementsData', this.allAnnouncementsData);
          this.isLoading = false;
        }
      } catch (error) {
        console.log(error);
      }
    },
    async getRoles() {
      try {
        const res = await api.get(`/roles`);
        if (res.status === 200) {

          const fetchedRoles = res.data.map(role => ({ role_id: role.role_id, role_name: role.role_name }));

          // Add default role
          const defaultRole = { role_id: 0, role_name: 'No Role' };
          fetchedRoles.unshift(defaultRole);

          // Create rolesOptions structure
          this.rolesOptions = fetchedRoles
            .sort((a, b) => a.role_name.localeCompare(b.role_name))
            .map(role => ({ value: role.role_id, label: role.role_name }));
        }
        return [];
      } catch (error) {
        console.error(error);
        return [];
      }
    },
    async getRespondents() {
      try {
        const res = await api.get(`/respondents`);
        if (res.status === 200) {

          const fetchedRespondents = res.data.map(respondent => ({ relationship_id: respondent.relationship_id, relationship_name: respondent.relationship_name }));

          // Add default role
          const defaultRespondent = { relationship_id: 0, relationship_name: 'No Respondent' };
          fetchedRespondents.unshift(defaultRespondent);

          // Create respondentsOptions structure
          this.respondentsOptions = fetchedRespondents
            .sort((a, b) => a.relationship_name.localeCompare(b.relationship_name))
            .map(respondent => ({ value: respondent.relationship_id, label: respondent.relationship_name }));
          }
        return [];
      } catch (error) {
        console.error(error);
        return [];
      }
    },
    async insertAnnouncement() {
      const rolesToString = this.editedItem.roles.join(', ')
      const respondentsToString = this.editedItem.respondents.join(', ')
      console.log('rolesToString', rolesToString)
      console.log('respondentsToString', respondentsToString)
      try {
        let orgIdToSend;
        if (Array.isArray(this.selectedOrg)) {
          orgIdToSend = this.selectedOrg[0].orgId;
        } else if (typeof this.selectedOrg === 'object') {
            orgIdToSend = this.selectedOrg.orgId;
        } else {
          orgIdToSend = this.selectedOrg;
        }
        let suborgIdToSend;
        if (Array.isArray(this.selectedSubOrg)) {
          suborgIdToSend = this.selectedSubOrg[0].subOrgId;
        } else {
          suborgIdToSend = this.selectedSubOrg;
        }
        let programIdToSend;
        if (Array.isArray(this.selectedProgram)) {
          programIdToSend = this.selectedProgram[0].programId;
        } else {
          programIdToSend = this.selectedProgram;
        }
        let iterationIdToSend;
        if (Array.isArray(this.selectedIteration)) {
          iterationIdToSend = this.selectedIteration[0].iterationId;
        } else {
          iterationIdToSend = this.selectedIteration;
        }
        const res = await api.post(`/insert-announcement`, {
          title: this.editedItem.title,
          description: this.editedItem.description,
          announcement_from: this.editedItem.announcement_from,
          release_date: this.editedItem.release_date,
          roles: rolesToString,
          respondents: respondentsToString,
          global_id: this.selectedGlobal,
          org_id: orgIdToSend,
          suborg_id: suborgIdToSend,
          program_id: programIdToSend,
          iteration_id: iterationIdToSend,
          for_email: this.editedItem.for_email,
          expired_at: this.editedItem.expired_at,
          ind_id: this.userData.ind_id,
        });
        if (res.status === 200) {
          console.log('Insert announcement successful!')
          Swal.fire({
            title: "<span style='font-family:Open Sans;'> Announcement Sucessfully Saved! </span>",
            text: "",
            icon: "success",
            confirmButtonText: "<span style='font-family:Open Sans;'> Ok </span>",
            confirmButtonColor: "#B2C225",
            allowOutsideClick: false
          })
        }
      } catch (error) {
        console.error(error);
      }
    },

    async updateAnnouncement() {
      const rolesToString = this.editedItem.roles.join(', ')
      const respondentsToString = this.editedItem.respondents.join(', ')
      try {
        let orgIdToSend;
        if (Array.isArray(this.selectedOrg)) {
          orgIdToSend = this.selectedOrg[0].orgId;
        } else if (typeof this.selectedOrg === 'object') {
            orgIdToSend = this.selectedOrg.orgId;
        } else {
          orgIdToSend = this.selectedOrg;
        }
        let suborgIdToSend;
        if (Array.isArray(this.selectedSubOrg)) {
          suborgIdToSend = this.selectedSubOrg[0].subOrgId;
        } else {
          suborgIdToSend = this.selectedSubOrg;
        }
        let programIdToSend;
        if (Array.isArray(this.selectedProgram)) {
          programIdToSend = this.selectedProgram[0].programId;
        } else {
          programIdToSend = this.selectedProgram;
        }
        let iterationIdToSend;
        if (Array.isArray(this.selectedIteration)) {
          iterationIdToSend = this.selectedIteration[0].iterationId;
        } else {
          iterationIdToSend = this.selectedIteration;
        }
        const res = await api.put(`/update-announcement`, {
          title: this.editedItem.title,
          description: this.editedItem.description,
          announcement_from: this.editedItem.announcement_from,
          release_date: this.editedItem.release_date,
          roles: rolesToString,
          respondents: respondentsToString,
          global_id: this.selectedGlobal,
          org_id: orgIdToSend,
          suborg_id: suborgIdToSend,
          program_id: programIdToSend,
          iteration_id: iterationIdToSend,
          for_email: this.editedItem.for_email,
          expired_at: this.editedItem.expired_at,
          ind_id: this.userData.ind_id,
          announcement_id: this.editedItem.announcement_id,
        });
        if (res.status === 200) {
          console.log('Update announcement successful!')
          Swal.fire({
            title: "<span style='font-family:Open Sans;'> Announcement Sucessfully Updated! </span>",
            text: "",
            icon: "success",
            confirmButtonText: "<span style='font-family:Open Sans;'> Ok </span>",
            confirmButtonColor: "#B2C225",
            allowOutsideClick: false
          })
        }
      } catch (error) {
        console.error(error);
      }
    },

    async getSubOrgName(suborg_id) {
      if(this.selectedSubOrg != []){
        try {
          const res = await api.get(`/sub-organizations-by-suborg/${suborg_id}`);
          if (res.status === 200) {
            this.subOrgs = [
              ...res.data.map(({ suborg_id, suborg_name }) => ({
                subOrgId: suborg_id,
                subOrgName: suborg_name,
              })),
            ];
            this.selectedSubOrg = this.subOrgs
            this.getProgramData(suborg_id)
          }
        } catch (error) {
          console.error(error);
        }
      }
    },
    async getProgramName(program_id) {
      if(this.selectedProgram != []){
        try {
          const res = await api.get(`/programs/${program_id}`);
          if (res.status === 200) {
            this.programs = [
              ...res.data.map(({ program_id, program_name }) => ({
                programId: program_id,
                programName: program_name,
              })),
            ];
            this.selectedProgram = this.programs
            getIterationData(program_id)
          }
        } catch (error) {
          console.error(error);
        }
      }
    },
    async getIterationName(iteration_id) {
      if(this.selectedIteration != []){
        try {
          const res = await api.get(`/iterations/${iteration_id}`);
          if (res.status === 200) {
            this.iterations = [
              ...res.data.map(({ iteration_id, iteration_name }) => ({
                iterationId: iteration_id,
                iterationName: iteration_name,
              })),
            ];
            this.selectedIteration = this.iterations
          }
        } catch (error) {
          console.error(error);
        }
      }
    },
    updateGlobal(globalValue) {
      // Find the corresponding global object based on globalValue
      const updatedGlobal = this.global.find(item => item.globalID === globalValue);

      if (updatedGlobal) {
        // Update the selectedGlobal with the new value
        this.selectedGlobal = updatedGlobal.globalID;
        console.log('GLOBAL is : ', this.selectedGlobal)
      }
    },
    async getOrgData() {
      try {
        const res = await api.get(`/organizations/${this.userData.org_id}`)
        if (res.status === 200) {
          this.org = [
            { orgId: 0, orgName: 'No Organization' },
            {
              orgId: res.data.org_id,
              orgName: res.data.org_name,
            },
          ];
        }
        console.log('org data', this.org)
      } catch (error) {
        console.log(error)
      }
      this.getRoles()
      this.getRespondents()
      this.getSubOrgData()
    },
    async getSubOrgData() {
      try {
        const res = await api.get(`/sub-organizations/${this.userData.org_id}`);
        if (res.status === 200) {
          this.subOrgs = [
            { subOrgId: 0, subOrgName: 'No Sub-Org' },
            ...res.data.map(({ suborg_id, suborg_name }) => ({
              subOrgId: suborg_id,
              subOrgName: suborg_name,
            })),
          ];
        }
        console.log('suborg data', this.subOrgs)
      } catch (error) {
        console.error(error);
      }
    },
    async getProgramData(suborg_id) {
      try {
        const res = await api.get(`/programs/suborg/${suborg_id}`);
        if (res.status === 200) {
          this.programs = [
            { programId: 0, programName: 'No Program' },
            ...res.data.map(({ program_id, program_name }) => ({
              programId: program_id,
              programName: program_name,
            })),
          ];
        }
      } catch (error) {
        console.error(error);
      }
    },
    async getIterationData(program_id) {
      try {
        const res = await api.get(`/iterations/program/${program_id}`);
        if (res.status === 200) {
          this.iterations = [
            { iterationId: 0, iterationName: 'No iteration' },
            ...res.data.map(({ iteration_id, iteration_name }) => ({
              iterationId: iteration_id,
              iterationName: iteration_name,
            })),
          ];
        }
      } catch (error) {
        console.error(error);
      }
    },
    async callDeleteAPI(announcement_ids){
      try {
        const res = await api.delete(`/delete-announcements`, {
          data: { announcement_id: announcement_ids }
        })
        if (res.status === 200) {
          Swal.fire({
            title: "<span style='font-family:Open Sans;'> Announcement Sucessfully Deleted! </span>",
            text: "",
            icon: "success",
            confirmButtonText: "<span style='font-family:Open Sans;'> Ok </span>",
            confirmButtonColor: "#B2C225",
            allowOutsideClick: false
          })
          console.log(`delete successful for ids ${announcement_ids}`)
        }
      } catch (error) {
        console.log(error)
      }
    },
    columnValueList(val) {
				return this.allAnnouncementsData.map((d) => d[val]);
    },
    formatDate(data) {
      const date = new Date(data);

      if (!isNaN(date.getTime())) {
        // Format date in "yyyy-MM-ddThh:mm" format
        const formattedDate = date.toISOString().slice(0, 16);
        return formattedDate;
      } else {
        return data;
      }
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
    mapValueToText(value) {
      // Replace this mapping with your own logic
      const mapping = {
        0: 'No Role',
        1: 'Participant',
        2: 'Respondent',
        3: 'Survey Previewer',
        4: 'Coach',
        5: 'Faculty Viewer',
        6: 'HR Professional Viewer',
        7: 'Client Administrator Viewer',
        8: 'Client Administrator Editor',
        9: 'Client Email Template Editor',
        10: 'CXM',
        11: 'Master Administrator',
        12: 'Master Administrator - Emails',
        13: 'Sub Org Manager',
        14: 'Announcement Manager',
        16: 'Site Manager',
        17: 'Survey Creator',
        18: 'Survey Manager',
      };

      // If value is an array, map each element to its textual representation
      if (Array.isArray(value)) {
        return value.map(roleId => mapping[roleId] || roleId).join(', ');
      }

      // If it's a single value, map it to its textual representation
      return mapping[value] || value;
    },
    changeSort(column) {
      if (this.pagination.sortBy === column) {
        this.pagination.descending = !this.pagination.descending;
      } else {
        this.pagination.sortBy = column;
        this.pagination.descending = false;
      }
    },
    initFilters() {
      // Initialize filters based on the items in the data
      for (const col of this.headers) {
        this.filters[col.key] = this.allAnnouncementsData.map(item => item[col.key]).filter(
          (value, index, self) => self.indexOf(value) === index
        );
      }
      // TODO restore previous activeFilters before add/remove item
      this.activeFilters = { ...this.filters };
    },

    toggleAll(col) {
      this.activeFilters[col] = this.allAnnouncementsData.map(item => item[col]).filter(
        (value, index, self) => self.indexOf(value) === index
      );
    },

    clearAll(col) {
      this.activeFilters[col] = [];
    },
    convertHtmlToPlainText(html) {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      return doc.body.textContent || "";
    },
    editItem(item) {
      this.updateGlobal(0) 
      this.editedIndex = this.allAnnouncementsData.indexOf(item)
      this.editedItem = Object.assign({}, item)
      if (this.editedItem.expired_at == "1970-01-01T00:00") {
        this.editedItem.expired_at = null;
      }
      this.dialog = true

      if(item.org_id !== 0) {
        this.getOrgData()
        this.selectedOrg = this.org[1]
      } else {
        this.selectedOrg = this.org[0]
      }
      
      if(item.suborg_id > 0) {
        this.getSubOrgName(item.suborg_id)
      }
      if(item.program_id > 0) {
        this.getProgramName(item.program_id)
      }
      if(item.iteration_id > 0) {
        this.getIterationName(item.iteration_id)
      }
      this.updateGlobal(item.global_id) 
    },

    deleteItems(selectedItems) {
      if (selectedItems.length > 0) {
        // Set the first selected item as the editedItem
        this.editedItem = Object.assign({}, selectedItems[0]);
        this.editedIndex = this.allAnnouncementsData.indexOf(this.editedItem);
        this.dialogDelete = true;
      }
    },

    deleteItemConfirm() {
      // Handle deletion for each selected item
      this.selected.forEach((item) => {
        const index = this.allAnnouncementsData.indexOf(item);
        if (index !== -1) {
          this.allAnnouncementsData.splice(index, 1);
          this.callDeleteAPI(item.announcement_id)
        }
      });

      // Reset selection and close the delete dialog
      this.dialogDelete = false;
      this.getAnnouncementsData()
    },

    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
      this.selectedOrg = [{orgId: 0, orgName: 'No Org'}]
      this.selectedSubOrg = [{subOrgId: 0, subOrgName: 'No Sub-Org'}]
      this.selectedProgram = [{programId: 0, programName: 'No Program'}]
      this.selectedIteration = [{iterationId: 0, iterationName: 'No iteration'}],

      this.editedItem.roles = [0]
      this.editedItem.respondents = [0]
      this.suborgs = []
      this.programs = []
      this.iterations = []
    },

    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    save() {
      if (this.editedItem.announcement_id) {
        // If announcement_id exists, perform update
        this.updateAnnouncement();
        console.log('updating announcement from v-dialog!');
      } else {
        // If announcement_id does not exist, perform insert
        this.insertAnnouncement();
        console.log('saving announcement from v-dialog!');
      }

      // Resetting data and closing the dialog
      this.selectedOrg = [{orgId: 0, orgName: 'No Org'}]
      this.selectedSubOrg = [{ subOrgId: 0, subOrgName: 'No Sub-Org' }];
      this.selectedProgram = [{ programId: 0, programName: 'No Program' }];
      this.selectedIteration = [{ iterationId: 0, iterationName: 'No iteration' }];
      this.suborgs = [];
      this.programs = [];
      this.iterations = [];
      this.editedItem = {};

      this.getAnnouncementsData();

      this.close();
    },
  },
  mounted() {
    console.log('Tiny URL Key = ', APIkey)
  },
}
</script>

<style scoped>
.body-container {
  background: white;
  margin: 20px;
  padding: 40px;
  box-shadow: 0px 2px 10px -4px #000000;
  border-radius: 20px;
  align-self: center;
  justify-content: center;
  align-items: center;
}

.dialog-buttons {
  border: 1px solid grey;
  font-weight: bold;
}
.menu-buttons {
  font-weight: bold;
}
.inputDateTime {
  border: 1px solid grey;
  padding: 7px;
  margin-left: 5px;
}
.gospi-container {
  border: 1px solid grey;
  padding: 10px;
  margin-right: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
}
.v-data-table-header {
  white-space: nowrap;
}

.custom-data-table {
  margin-top: 50px;
  padding: 10px;
}
.custom-data-table :deep(table) > thead {
  background-color: rgb(200, 200, 200);
}
.v-data-table-header__icon {
  margin: 10px;
  font-size: medium;
}
.custom-data-table {
  border: 1px solid rgb(200, 200, 200);
}
</style>