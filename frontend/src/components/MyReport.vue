<script setup>
import ButtonSubmit from "./ButtonSubmit.vue";
</script>

<template>
  <div>
    <div>
      <ButtonSubmit label="Download Report PDF" @click="downloadPDF" style="margin: 0.5% 50% 0.5% 50%; border: 1px; box-shadow: 2px 4px #ccc;"/>
      <iframe
        :src="`${passedRouteParams.report_link}?sex=${passedRouteParams.sex}&country=${passedRouteParams.country}&viewer_fullname=${passedRouteParams.viewer_fullname}&report_for_fullname=${passedRouteParams.report_for_fullname}&survey_assignment_id=${passedRouteParams.survey_assignment_id}&org_id=${passedRouteParams.org_id}&subOrg_id=${passedRouteParams.suborg_id}&program_id=${passedRouteParams.program_id}&iteration_id=${passedRouteParams.iteration_id}&survey_template_id=${passedRouteParams.survey_template_id}&coach_id=${passedRouteParams.coach_id}&rand=${rand}&org_name=${passedRouteParams.org_name}&suborg_name=${passedRouteParams.suborg_name}&program_name=${passedRouteParams.program_name}&iteration_name=${passedRouteParams.iteration_name}&qsort_type=${passedRouteParams.qsort_type}&is_pdf_available=${passedRouteParams.is_pdf_available}`"
        frameborder="0"
        id="myiframe"
        name="myiframe"
      ></iframe>
    </div>
  </div>
</template>

<script>
export default {
  component: [ButtonSubmit],
  data: () => ({
    passedRouteParams: {},
    rand: '',
  }),
  mounted() {
    this.passedRouteParams = JSON.parse(this.$route.params.data);
    this.rand = Math.random()
    console.log(this.passedRouteParams);
  },
  methods: {
    downloadPDF(){
      this.printFrame("myiframe")
    },
    printFrame(id) {
      var frm = document.getElementById(id).contentWindow;
      frm.focus();// focus on contentWindow is needed on some ie versions
      frm.print();
      return false;
  }
  }
  ,
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
