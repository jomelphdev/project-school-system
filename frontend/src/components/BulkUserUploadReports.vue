<script setup>
import Header from "./Header.vue";
import Description from "./Description.vue";
import AdminDashboardBox from "./AdminDashboardBox.vue";
import ButtonSubmit from "./ButtonSubmit.vue";

</script>

<template>
  <div class="body-container">
    <div
      style="
        display: flex;
        flex-direction: column;
        justify-content: left;
        align-items: center;
        margin: 30px;
      "
    >
      <div v-if="passParseData.length != 0">
        <Header label="Upload report"></Header>
        <Description label=""></Description>
        <table id="table">
          <tr>
            <th>Status</th>
            <th>First name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Roles</th>
          </tr>
          <tr
            v-for="data in passParseData"
            :key="data.ind_id"
            :value="data.ind_id"
          >
            <td
              v-if="
                existingEmailData.filter(
                  (x) => data.email.toLowerCase().includes(x.email.toLowerCase())
                ).length > 0
              "
              style="color: red;"
            >
              <i class="fa-solid fa-ban" aria-hidden="true"></i> Email already exist.
            </td>
            <td v-else style="color: green;"><i class="fa-solid fa-circle-check" aria-hidden="true"></i> Upload Successful.</td>
            <td>{{ data.first_name }}</td>
            <td>{{ data.last_name }}</td>
            <td>{{ data.email }}</td>
            <td>{{ data.role }}</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  component: [AdminDashboardBox, Header, Description, ButtonSubmit],
  name: "BulkUserUploadReports",
  props: {
    passParseData: Array,
    existingEmailData: Array,
  },
  data: () => ({
  }),

  async mounted() {
  },

  methods:{
  }
};
</script>


<style scoped>
#table {
  width: 100%;
  word-break: break-all;
  table-layout: fixed;
}

#table td,
#table th {
  border: 1px solid #ddd;
  padding: 8px;
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
</style>