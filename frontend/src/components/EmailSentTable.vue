<script setup>
import api from "../api/api";
import ButtonSubmit from "./ButtonSubmit.vue";
import EmailSentTableModal from './EmailSentTableModal.vue';
</script>

<template>
  <div
    v-if="closed"
    class="shadowed drop-down-info"
    @click="expand()"
    style="cursor: pointer"
  >
    {{ label }}
  </div>
  <div v-else class="drop-down-info shadowed md-height">
    {{ label }}
    <table id="table">
      <tr>
        <th style="text-align: right">#</th>
        <th v-for="head in table_headers" :key="head">
          <a>
            {{
              head == "datetime_sent_utc"
                ? "Date (UTC)"
                : head == "send_from"
                ? "From"
                : head == "send_to"
                ? "To"
                : head == "template_type"
                ? "Email Template"
                : head == "subject"
                ? "Email Subject"
                : null
            }}
            <!-- // head == "email_sent_status"
                // ? "Sent Status"
                // : null -->
          </a>
        </th>
        <th>Email body</th>
      </tr>
      <tr v-for="(data, index) in sendEmailData" :key="data" :value="data">
        <td style="text-align: right">{{ incrementIndex(index) }}</td>
        <td v-for="head in table_headers" :key="head">
          {{
            head == "datetime_sent_utc"
              ? data[head]
              : head == "send_from"
              ? data[head]
              : head == "send_to"
              ? data[head]
              : head == "template_type"
              ? data[head]
              : head == "subject"
              ? data[head]
              : null
          }}
          <!-- // head == "email_sent_status"
              // ? data[head]
              // : null -->
        </td>
        <td><ButtonSubmit label="View" @click="sendProps(data.body)" /></td>
      </tr>
    </table>
    <EmailSentTableModal  v-if="showModal == true" @close-modal="showModal = false" :emailBody="sendEmailBody"/>
  </div>
</template>

<script>
export default {
  name: "EmailSentTable",
  components: [ButtonSubmit, EmailSentTableModal],
  props: ["label", "tableData"],
  data: () => ({
    table_headers: [
      "datetime_sent_utc",
      "send_from",
      "send_to",
      "template_type",
      "subject",
      // "body",
      // "email_sent_status",
    ],
    sendEmailData: "",
    closed: true,
    showModal: false,
    sendEmailBody: ""
  }),
  async mounted() {
    await api.get(`sendemail-by-email/${this.tableData.email}`).then((result) => {
      this.sendEmailData = result.data;
    });
  },
  methods: {
    expand: function () {
      this.closed = !this.closed;
    },

    incrementIndex(index) {
      return index + 1;
    },

    sendProps(data) {
      this.sendEmailBody = data
      this.showModal = true
    },
  },
};
</script>

<style scoped>
.drop-down-info {
  width: 100%;
  min-height: 20px;
  margin: 10px 0;
  padding: 5px;
  color: #e67829;
  background-color: #ddd;
}
.shadowed {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.07),
    0 4px 8px rgba(0, 0, 0, 0.07), 0 8px 16px rgba(0, 0, 0, 0.07),
    0 16px 32px rgba(0, 0, 0, 0.07), 0 32px 64px rgba(0, 0, 0, 0.07);
}
.md-height {
  min-height: 250px;
}

#table {
  width: 100%;
  /* table-layout: fixed; */
  border-collapse: collapse;
}

#table td,
#table th {
  border: 1px solid #ddd;
  padding: 8px;
  height: auto;
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
  word-break: word-wrap;
  font-size: 1vw;
}

#table td {
  text-align: left;
  vertical-align: middle;
  word-break: word-wrap;
  font-size: 0.8vw;
}
</style>