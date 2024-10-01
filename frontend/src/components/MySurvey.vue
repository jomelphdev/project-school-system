<script setup>
import api from "../api/api";
</script>

<template>
  <div class="main-survey-box">
    <div>
      <iframe
        :src="`${passedRouteParams.surveyTemplateLink}?survey_assignment_id=${passedRouteParams.surveyAssignmentLink}&ind_id=${passedRouteParams.indId}&org_id=${passedRouteParams.orgId}&subOrg_id=${passedRouteParams.suborgId}&first_name=${userData.first_name}&last_name=${userData.last_name}&rand=${rand}&survey_template_id=${passedRouteParams.surveyTemplateId}&run_mode=${passedRouteParams.runMode}`"
        frameborder="0"
      ></iframe>
    </div>
  </div>
</template>

<script>
export default {
  component: [],
  props: {
    userData: Object,
    brandData: Object,
  },
  data: () => ({
    passedRouteParams: {},
    rand: "",
    surveyOpenStatus: null,
    prepolulateEndpoint: "",
    surveyVersion: null,
    prepopulateData: [],
  }),
  async mounted() {
    this.passedRouteParams = JSON.parse(this.$route.params.data)
    console.log(this.passedRouteParams)
    this.rand = Math.random()

    if (this.passedRouteParams.runMode === "ReadOnly") {
      console.log("DONT RUN ANYTHING")
    } else { 
      console.log("RUN PREPOPULATE")
      // get survey assignment data
      try {
        const res = await api.get(
          `survey-assignment/view-one/${this.passedRouteParams.surveyAssignmentLink}`
        );
        if (res.status === 200) {
          this.surveyOpenStatus = res.data.survey_opened
        }
      } catch (e) { 
        console.log(e)
      }

      // get prepopulate endpoint
      try {
        const res = await api.get(`survey-templates/prepopulate/${this.passedRouteParams.surveyTemplateId}`)
        if (res.status === 200) { 
          this.prepolulateEndpoint = res.data.pre_populate_survey_endpoint
        }
      } catch (e) {
        console.log(e)
      }

      // get survey version
      try {
        const res = await api.get(`/survey-templates/survey-type/${this.passedRouteParams.surveyTemplateId}`)
        if (res.status === 200) {
          this.surveyVersion = res.data.survey_version
          this.prepopulateData = res.data.prepopulate_data
        }
      } catch (error) {
        console.log(error)
      }

      if (this.surveyOpenStatus === 0) {
        if (this.surveyVersion === 1) { 
          try {
            const res = await api.post(`survey-results/populate/${this.prepolulateEndpoint}`, {
              survey_assignment_id: this.passedRouteParams.surveyAssignmentLink,
              org_id: this.passedRouteParams.orgId,
              suborg_id: this.passedRouteParams.suborgId,
            });
            if (res.status === 200) {
              try {
                api.put(`survey-assignment/survey-opened/${this.passedRouteParams.surveyAssignmentLink}`,
                  {
                    survey_opened: 1,
                    modified_by: this.passedRouteParams.indId,
                  }
                );
              } catch (e) {
                console.log(e)
              }
            }
          } catch (e) {
            console.log(e)
          }
        }
        if (this.surveyVersion === 2) { 
          try {
            const res = await api.post(`/survey-results/populate/${this.passedRouteParams.surveyAssignmentLink}/${this.passedRouteParams.orgId}/${this.passedRouteParams.suborgId}`, this.prepopulateData)
            if (res.status === 200) { 
              try {
                api.put(`survey-assignment/survey-opened/${this.passedRouteParams.surveyAssignmentLink}`,
                  {
                    survey_opened: 1,
                    modified_by: this.passedRouteParams.indId,
                  }
                );
              } catch (e) {
                console.log(e)
              }
            }
          } catch (error) {
            console.log(error)
          }
        }
      }
    }
  },
  unmounted() {
    this.$emit("passHeaderSubjectFullName", "");
  },
};
</script>

<style scoped>
iframe {
  width: 100%;
  height: 78vh;
  overflow: hidden;
  margin: 5px 0;
}
</style>
