<script setup>
import DescriptionInline from "./DescriptionInline.vue";
import Header from "./Header.vue";
import ButtonSubmit from "./ButtonSubmit.vue";
import ButtonCancel from "./ButtonCancel.vue";
import api from "../api/api";
import { flashMessage } from "../functions.js";
</script>
<template>
  <section>
    <!-- Select Program -->
    <label for="selectMainIteration"
      ><DescriptionInline label="Select program*"
    /></label>
    <select
      class="formControl"
      id="selectMainIteration"
      v-model="selectToManageProgram"
      @change="toManageProgram($event)"
    >
      <option disabled selected>Select program</option>
      <option
        v-for="program in sortProgramList"
        :value="program.program_name"
        :key="program.program_id"
      >
        {{ program.program_name }}
      </option>
    </select>

    <!-- Manage Iteration Section -->
    <div class="iterationBox">
      <Header label="Manage iteration" />

      <div class="formBox">
        <div>
          <label for="IterationName"
            ><DescriptionInline label="Iteration name"
          /></label>
          <input
            id="IterationName"
            class="formControl"
            :disabled="!selectToManageProgram"
            v-model="addIterationinput"
          />
        </div>

        <div class="buttonBox">
          <ButtonSubmit
            label="Add"
            :disabled="!addIterationinput"
            @click="addIteration()"
          />
          <ButtonCancel
            label="Cancel"
            :disabled="!addIterationinput"
            @click="clearAddField()"
          />
        </div>
      </div>

      <div class="formBox">
        <div>
          <label for="selectIteration"
            ><DescriptionInline label="Select iteration*"
          /></label>
          <select
            class="formControl"
            id="selectIteration"
            :disabled="!selectToManageProgram"
            v-model="chosenIteration"
            @change="selectIteration($event)"
          >
            <option disabled>Select iteration</option>
            <option v-for="data in sortIterationList" :key="data.iteration_id">
              {{ data.iteration_name }}
            </option>
          </select>

          <label for="newIterationName"
            ><DescriptionInline label="Iteration name*"
          /></label>
          <input
            id="newIterationName"
            class="formControl"
            :disabled="!chosenIteration"
            v-model.lazy="chosenIteration"
          />

          <label for="selectTimezone"
            ><DescriptionInline label="Select time zone*"
          /></label>
          <select
            class="formControl"
            id="selectTimezone"
            :disabled="!selectToManageProgram"
            v-model="chosenTimezone"
            @change="selectTimezone($event)"
          >
            <option disabled>Select time zone</option>
            <option
              v-for="data in sortTimezoneList"
              :key="data"
              :value="data.value"
            >
              {{ data.label }}
            </option>
          </select>

          <label for="finalDeadlineDate"
            ><DescriptionInline label="Final Deadline Date*"
          /></label>
          <input
            type="datetime-local"
            id="finalDeadlineDate"
            class="formControl"
            :disabled="!chosenIteration"
            v-model="finalDeadlineDate"
          />

          <div class="tooltip">
            Never Run Iteration*
            <span class="tooltiptext"
              >This switch inhibits an Iteration 
              Run and so no Cohort data will 
              be calculated for this Iteration.</span
            >
          </div>
          <!-- <label for="doNotRunCohort"
            ><DescriptionInline label="Never Run Iteration*"
          /></label> -->
          <select
            class="formControl"
            id="doNotRunCohort"
            :disabled="!chosenIteration"
            v-model="cohortRunOptions"
          >
            <option value="1">Yes</option>
            <option selected value="0">No</option>
          </select>
        </div>

        <div class="buttonBox">
          <ButtonSubmit
            label="Update"
            :disabled="!chosenIteration"
            @click="updateIteration()"
          />
          <ButtonCancel
            label="Cancel"
            :disabled="!chosenIteration"
            @click="clearUpdateFields()"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "ManageIterationBox",
  component: [DescriptionInline, Header, ButtonSubmit, ButtonCancel],
  props: ["userData", "brandData", "suborgId", "newProgram"],

  data: () => ({
    cohortRunOptions: 0,
    programList: [],
    iterationList: [],
    selectToManageProgram: "",
    chosenProgramId: "",
    addIterationinput: "",
    chosenIteration: "",
    chosenIterationId: "",
    chosenTimezone: "",
    finalDeadlineDate: "",
    timezoneList: [],
    chosenSuborgId: "",
    addClick: null,
  }),
  async mounted() {
    try {
      const res = await api.get("get-time-zone");
      if (res.status === 200) {
        this.timezoneList = res.data.map((data) => {
          return {
            value: data.timezone_name,
            label: `${data.timezone_name} | ${data.timezone_offset}`,
          };
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
  watch: {
    suborgId: {
      handler: function (newValue) {
        api.get(`programs/suborg/${newValue}`).then((res) => {
          this.programList = res.data;
          this.addIterationinput = "";
          this.selectToManageProgram = "";
          this.chosenIteration = "";
          this.chosenSuborgId = newValue;
        });
      },
    },
    newProgram: {
      handler: function () {
        api.get(`programs/suborg/${this.chosenSuborgId}`).then((res) => {
          this.programList = res.data;
        });
      },
    },
  },
  computed: {
    sortProgramList() {
      return this.programList.sort((a, b) =>
        a.program_name.toUpperCase() < b.program_name.toUpperCase()
          ? -1
          : b.program_name.toUpperCase() > a.program_name.toUpperCase()
          ? 1
          : 0
      );
    },
    sortIterationList() {
      return this.iterationList.sort((a, b) =>
        a.iteration_name.toUpperCase() < b.iteration_name.toUpperCase()
          ? -1
          : b.iteration_name.toUpperCase() > a.iteration_name.toUpperCase()
          ? 1
          : 0
      );
    },
    sortTimezoneList() {
      return this.timezoneList.sort();
    },
  },
  methods: {
    async getTimezone() {
      try {
        const res = await api.get(
          `/iterations/final-deadline-date/${this.chosenIterationId}`
        );
        if (res) {
          this.chosenTimezone = res.data.time_zone;
          this.finalDeadlineDate = res.data.final_deadline_date;
          this.cohortRunOptions = res.data.never_run_iteration;
        }
      } catch (error) {
        console.log(error);
      }
    },
    async toManageProgram(e) {
      this.addIterationinput = "";
      this.chosenIteration = "";
      let chosenProgram = e.target.value;
      for (const data of this.programList) {
        if (data.program_name === chosenProgram) {
          this.chosenProgramId = data.program_id;
        }
      }

      try {
        const res = await api.get(
          `iterations/programs/${this.chosenProgramId}`
        );
        if (res) {
          this.iterationList = res.data;
        }
      } catch (error) {
        flashMessage(
          this.$flashMessage,
          this.brandData.accent_color1
            ? this.brandData.accent_color1
            : "#F47820",
          this.brandData.flash_text_color
            ? this.brandData.flash_text_color
            : "#ffffff",
          error.message
        );
      }
      this.$emit("passedProgramId", this.chosenProgramId);
    },

    async addIteration() {
      let duplication = false;
      for (const data of this.iterationList) {
        if (
          data.iteration_name.toUpperCase() ===
          this.addIterationinput.toUpperCase()
        ) {
          flashMessage(
            this.$flashMessage,
            this.brandData.accent_color1
              ? this.brandData.accent_color1
              : "#F47820",
            this.brandData.flash_text_color
              ? this.brandData.flash_text_color
              : "#ffffff",
            this.addIterationinput + " already exist!"
          );
          duplication = true;
        }
      }
      if (!duplication) {
        try {
          const res = await api.post("iterations", {
            iteration_name: this.addIterationinput.trim(),
            org_id: this.userData.org_id,
            suborg_id: this.suborgId,
            program_id: this.chosenProgramId,
            created_by: this.userData.ind_id,
            modified_by: this.userData.ind_id,
          });
          if (res) {
            flashMessage(
              this.$flashMessage,
              this.brandData.accent_color1
                ? this.brandData.accent_color1
                : "#F47820",
              this.brandData.flash_text_color
                ? this.brandData.flash_text_color
                : "#ffffff",
              "Successfully added iteration!"
            );
          }
        } catch (error) {
          flashMessage(
            this.$flashMessage,
            this.brandData.accent_color1
              ? this.brandData.accent_color1
              : "#F47820",
            this.brandData.flash_text_color
              ? this.brandData.flash_text_color
              : "#ffffff",
            error.message
          );
        }
      }

      try {
        const res = await api.get(
          `iterations/programs/${this.chosenProgramId}`
        );
        if (res) {
          this.iterationList = res.data;
        }
      } catch (error) {
        flashMessage(
          this.$flashMessage,
          this.brandData.accent_color1
            ? this.brandData.accent_color1
            : "#F47820",
          this.brandData.flash_text_color
            ? this.brandData.flash_text_color
            : "#ffffff",
          error.message
        );
      }
      this.addClick++;
      this.$emit("addIteration", this.addClick);
    },

    selectIteration(e) {
      let chosenIteration = e.target.value;
      for (const data of this.iterationList) {
        if (data.iteration_name === chosenIteration) {
          this.chosenIterationId = data.iteration_id;
        }
      }
      console.log(this.chosenIterationId);
      console.log(this.iterationList);
      this.getTimezone();
    },

    selectTimezone(e) {
      this.chosenTimezone = e.target.value;
    },

    async updateIteration() {
      let duplication = false;
      let noSpacesEnd = this.chosenIteration.endsWith(" ");
      let noSpacesStart = this.chosenIteration.startsWith(" ");
      console.log(this.iterationList);
      for (const data of this.iterationList) {
        if (
          data.iteration_name.toUpperCase() ===
            this.chosenIteration.toUpperCase() &&
          this.chosenTimezone === data.time_zone &&
          this.finalDeadlineDate === data.final_deadline_date &&
          this.cohortRunOptions === data.never_run_iteration
        ) {
          this.$flashMessage.show({
            type: "error",
            title: `${this.chosenIteration} already exist!`,
            message: "",
          });
          flashMessage(
            this.$flashMessage,
            this.brandData.accent_color1
              ? this.brandData.accent_color1
              : "#F47820",
            this.brandData.flash_text_color
              ? this.brandData.flash_text_color
              : "#ffffff",
            this.chosenIteration + " already exist!"
          );
          duplication = true;
        }
      }
      if (!duplication) {
        if (noSpacesEnd === false && noSpacesStart === false) {
          try {
            const res = await api.put(`iterations/${this.chosenIterationId}`, {
              iteration_name: this.chosenIteration.trim(),
              time_zone: this.chosenTimezone,
              final_deadline_date: this.finalDeadlineDate,
              never_run_iteration: this.cohortRunOptions,
              modified_by: this.userData.ind_id,
            });
            if (res) {
              flashMessage(
                this.$flashMessage,
                this.brandData.accent_color1
                  ? this.brandData.accent_color1
                  : "#F47820",
                this.brandData.flash_text_color
                  ? this.brandData.flash_text_color
                  : "#ffffff",
                "Successfully updated iteration!"
              );
            }
          } catch (error) {
            flashMessage(
              this.$flashMessage,
              this.brandData.accent_color1
                ? this.brandData.accent_color1
                : "#F47820",
              this.brandData.flash_text_color
                ? this.brandData.flash_text_color
                : "#ffffff",
              error.message
            );
            // console.log(error)
          }
        } else {
          flashMessage(
            this.$flashMessage,
            this.brandData.accent_color1
              ? this.brandData.accent_color1
              : "#F47820",
            this.brandData.flash_text_color
              ? this.brandData.flash_text_color
              : "#ffffff",
            "Please remove extra spaces in the beginning or end of the iteration name"
          );
        }

        try {
          const res = await api.get(
            `iterations/programs/${this.chosenProgramId}`
          );
          if (res) {
            this.iterationList = res.data;
          }
        } catch (error) {
          flashMessage(
            this.$flashMessage,
            this.brandData.accent_color1
              ? this.brandData.accent_color1
              : "#F47820",
            this.brandData.flash_text_color
              ? this.brandData.flash_text_color
              : "#ffffff",
            error.message
          );
        }
      }
      this.addClick++;
      this.$emit("updateIteration", this.addClick);
    },

    clearAddField() {
      this.addIterationinput = "";
    },

    clearUpdateFields() {
      this.chosenIteration = "";
      this.chosenTimezone = "";
      this.finalDeadlineDate = "";
    },
  },
};
</script>

<style scoped>
.iterationBox {
  padding-bottom: 30px;
  margin-bottom: 40px;
  border-bottom: 2px solid black;
  font-size: 14px;
}
.formControl {
  font-weight: 400;
  line-height: 1.5;
  color: #212529;
  background-color: #fff;
  background-clip: padding-box;
  border-width: 0 0 1px;
  border-color: grey;
  padding: 2px 5px;
  margin-bottom: 1em;
  outline: 0;
  width: -webkit-fill-available;
}

.tooltip {
  position: relative;
  display: inline-block;
  cursor: pointer;
  color: #212529;
  margin-bottom: 0.5rem;
}

.tooltip .tooltiptext {
  visibility: hidden;
  width: 200px;
  background-color: black;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;

  /* Position the tooltip */
  position: absolute;
  z-index: 1;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
}
input, select, option, textarea {
  border: 1px solid grey;
}
</style>
