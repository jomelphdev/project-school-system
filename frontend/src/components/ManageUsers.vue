<script setup>
import Header from "./Header.vue";
import Description from "./Description.vue";
import api from "../api/api";
import FindUserSearchBox from "./FindUserSearchBox.vue";
</script>

<template>
  <div class="body-container">
    <div
      style="
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 30px;
      "
    >
      <div>
        <Header label="Manage user"></Header>
        <div class="org-label">
          <Description label="Your organization is:"></Description>
          <p>{{ organization }}</p>
        </div>

        <FindUserSearchBox :userData="userData" :brandData="brandData" buttonLabel="Find" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  component: [FindUserSearchBox, Header, Description],
  props: {
    userData: Object,
    brandData: Object,
  },
  name: "ManageUsers",
  data: () => ({
    organization: "",
  }),
  async mounted() {
    await api.get("individuals/" + this.userData.ind_id).then((result) => {
      this.organization = result.data.org_name;
    });
  },
};
</script>

<style scoped>
.org-label {
  display: flex;
}

.org-label p {
  margin-left: 5px;
}
</style>
