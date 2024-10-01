<script setup>
import ButtonSubmit from "./ButtonSubmit.vue";
import DescriptionInline from "./DescriptionInline.vue";
import Swal from "sweetalert2";
import api from "../api/api";
</script>
<template>
    <div class="body-container">
        <div class="wrapper">
            <section id="reporttable">
                <h2>Report Table</h2>
                <table id="table">
                    <tr>
                        <th>Type</th>
                        <th>No</th>
                        <th>Text</th>
                        <th>Template</th>
                        <th>Add/Delete</th>
                    </tr>
                    <tr
                        v-for="(data, index) in reportData"
                        :key="index"
                        style="cursor: pointer"
                    >
                        <td>
                            <textarea
                                rows="4"
                                :title="data.Type"
                                class="type"
                                v-model="data.Type"
                            ></textarea>
                        </td>
                        <td>
                            <textarea
                                rows="4"
                                :title="data.Number"
                                class="qno"
                                v-model="data.Number"
                            ></textarea>
                        </td>
                        <td>
                            <textarea
                                rows="4"
                                cols="50"
                                :title="data.Text"
                                class="text"
                                v-model="data.Text"
                            ></textarea>
                        </td>
                        <td>
                            <textarea
                                rows="4"
                                :title="data.Template"
                                class="template"
                                v-model="data.Template"
                            ></textarea>
                        </td>
                        <td>
                            <button class="btns" @click="addRow()">
                                Add Row <i class="fa-solid fa-plus"></i>
                            </button>
                            <!-- <button style="margin-left: 10px;" @click="Update(data.Type, data.Number, data.Text, data.Template, i)">Edit <font-awesome-icon icon="pencil" /></button> -->
                            <button class="btns" @click="Delete(index)">
                                Delete Row <font-awesome-icon icon="trash" />
                            </button>
                        </td>
                    </tr>
                </table>
                <input type="file" @change="previewFiles" multiple />
                <ButtonSubmit
                    style="margin-top: 10px"
                    @click.prevent="displayJSON()"
                    label="Create JSON"
                />
                <ButtonSubmit
                    style="margin-top: 10px; margin-left: 10px"
                    @click.prevent="downloadCSV()"
                    label="Download Report Table"
                />
                <ButtonSubmit
                    style="margin-top: 10px; margin-left: 10px"
                    @click.prevent="gotoTop()"
                    label="Scroll Up"
                />
                <ButtonSubmit
                    style="margin-top: 10px; margin-left: 10px"
                    @click.prevent="createBig5CSV()"
                    label="Big5"
                />
                <ButtonSubmit
                    style="margin-top: 10px; margin-left: 10px"
                    @click.prevent="createGeneralManagerAndTeamLeaderCSV()"
                    label="Genera Manager/TeamLeader"
                    :disabled="isDisabledButton"
                />
            </section>
            <hr />
            <h2>JSON Display</h2>
            <section id="displayJSON">
                <textarea
                    class="display"
                    v-bind:value="displayreportData"
                ></textarea>
                <ButtonSubmit
                    style="margin-left: 20px"
                    @click.prevent="generateHTML()"
                    label="Create HTML"
                />
            </section>
            <section id="displayHtml">
                <textarea class="display" :value="finalHTML"></textarea>
            </section>
        </div>
    </div>
</template>

<script>
export default {
    components: [ButtonSubmit, DescriptionInline],
    name: "CreateReport",
    data: () => ({
        reportData: [
            {
                Type: "",
                Number: "",
                Text: "",
                Template: "",
            },
        ],
        displayreportData: "",
        file: null,
        csvFile: null,
        parsedData: [],
        finalHTML: "",
        isDisabledButton: false,
    }),
    methods: {
        mounted() {},
        updated() {},
        downloadCSV() {
            const items = this.reportData;
            const replacer = (key, value) => (value === null ? "" : value); // specify how you want to handle null values here
            const header = Object.keys(items[0]);
            const csv = [
                header.join("~"), // header row first
                ...items.map((row) =>
                    header
                        .map((fieldName) => row[fieldName], replacer)
                        .join("~")
                ),
            ].join("\r\n");
            console.log(csv);
            var hiddenElement = document.createElement("a");
            hiddenElement.href =
                "data:text/csv;charset=utf-8," + encodeURI(csv);
            hiddenElement.target = "_blank";
            hiddenElement.download = "output.csv";
            hiddenElement.click();
        },

        async createBig5CSV() {
            this.isDisabledButton = true;

            try {
                const XLSX = await import("xlsx");
                const res = await api.get(
                    "getDataforCreatingCSV/survey_assignment/6/1"
                );
                let resData = res.data;

                if (resData.length <= 0) {
                    Swal.fire({
                        text: `No results found.`,
                        confirmButtonColor: "#3085d6",
                        confirmButtonText: "Ok",
                    });
                    this.isDisabledButton = false;
                } else {
                    const sortAlphaNum = (a, b) =>
                        a.q.localeCompare(b.q, "en", { numeric: true });
                    let stmt_answer = [];

                    for (let i = 0; i < resData.length; i++) {
                        let objSortStmtQuestion = JSON.parse(
                            resData[i]["stmt_answer"]
                        );
                        stmt_answer[i] = objSortStmtQuestion.sort(sortAlphaNum);
                    }

                    const items = stmt_answer.map((stmt, i) => {
                        let item = {
                            program_name: resData[i].program_name,
                            iteration_name: resData[i].iteration_name,
                            stream_name: resData[i].stream_name,
                            group_name: resData[i].group_name,
                            survey_template_name:
                                resData[i].survey_template_name,
                            survey_template_id: resData[i].survey_template_id,
                            ind_id: resData[i].ind_id,
                            recipient_email: resData[i].recipient_email,
                            submitted_status: resData[i].submitted_status,
                            submission_date: resData[i].submission_date,
                        };

                        for (let j = 0; j < stmt.length; j++) {
                            if (
                                stmt[j]["q"] !== "Q121" &&
                                stmt[j]["q"] !== "Q122" &&
                                stmt[j]["q"] !== "Q123"
                            ) {
                                item[stmt[j]["q"]] = stmt[j]["r"];
                            } else {
                                let replaceStr = stmt[j]["a"].replace(
                                    /[,'"()\\//\t]+/g,
                                    ""
                                );
                                item[stmt[j]["q"]] = replaceStr;
                            }
                        }
                        return item;
                    });

                    console.log(items);

                    const worksheet = XLSX.utils.json_to_sheet(items);
                    const workbook = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
                    const excelFileBuffer = XLSX.write(workbook, {
                        type: "array",
                    });

                    var blob = new Blob([excelFileBuffer], {
                        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    });
                    var url = URL.createObjectURL(blob);

                    var hiddenElement = document.createElement("a");
                    hiddenElement.href = url;
                    hiddenElement.target = "_blank";
                    hiddenElement.download = "output.xlsx";
                    hiddenElement.click();

                    this.isDisabledButton = false;
                }
            } catch (error) {
                console.error("Failed to load xlsx library:", error);
                this.isDisabledButton = false;
            }
        },

        // async createBig5CSV() {
        //   this.isDisabledButton = true
        //   const res = await api.get("getDataforCreatingCSV/survey_assignment/6/1");
        //   let resData = res.data

        //   if(resData.length <= 0) {
        //     Swal.fire({
        //       text: `No results found.`,
        //       confirmButtonColor: "#3085d6",
        //       confirmButtonText: "Ok",
        //     })
        //     this.isDisabledButton = false
        //   }
        //   else {
        //     const sortAlphaNum = (a, b) => a.q.localeCompare(b.q, 'en', { numeric: true })
        //     let stmt_answer = []

        //     let stringStmtAnswer = "["
        //     for(let i=0; i<resData.length; i++) {
        //       let objSortStmtQuestion = JSON.parse(resData[i]['stmt_answer'])
        //       stmt_answer[i] = objSortStmtQuestion.sort(sortAlphaNum)
        //       stringStmtAnswer += "{"
        //       stringStmtAnswer += ` "ind_id" : ${resData[i].ind_id}, `
        //       stringStmtAnswer += ` "submission_date" : "${resData[i].submission_date}", `
        //       stringStmtAnswer += ` "survey_template_id" : ${resData[i].survey_template_id}, `
        //       for(let j=0; j<stmt_answer[i].length; j++) {
        //         if (
        //           stmt_answer[i][j]['q'] !== 'Q121' &&
        //           stmt_answer[i][j]['q'] !== 'Q122' &&
        //           stmt_answer[i][j]['q'] !== 'Q123'
        //         ) {
        //           stringStmtAnswer += '"' + stmt_answer[i][j]['q'] + '"' + ":" + '"' + stmt_answer[i][j]['r'] + '"'

        //         } else if (stmt_answer[i][j]['q'] === 'Q121') {
        //           let replaceStr = stmt_answer[i][j]['a'].replace(/[,'"()\\//\t]+/g, '')
        //           stringStmtAnswer += '"' + "Q121" + '"' + ":" + '"' + replaceStr + '"'
        //         } else if (stmt_answer[i][j]['q'] === 'Q122') {
        //           let replaceStr = stmt_answer[i][j]['a'].replace(/[,'"()\\//\t]+/g, '')
        //           stringStmtAnswer += '"' + "Q122" + '"' + ":" + '"' + replaceStr + '"'
        //         } else if (stmt_answer[i][j]['q'] === 'Q123') {
        //           let replaceStr = stmt_answer[i][j]['a'].replace(/[,'"()\\//\t]+/g, '')
        //           stringStmtAnswer += '"' + "Q123" + '"' + ":" + '"' + replaceStr + '"'
        //         } else {
        //           stringStmtAnswer += '"' + stmt_answer[i][j]['q'] + '"' + ":" + '"' + stmt_answer[i][j]['r'] + '"'
        //         }

        //         if(j < (stmt_answer[i].length - 1)) {
        //           stringStmtAnswer += ","
        //         }
        //         if(j == (stmt_answer[i].length - 1)) {
        //           stringStmtAnswer += "}"
        //           if(i < (resData.length - 1)) {
        //             stringStmtAnswer += ","
        //           }
        //         }
        //       }
        //     }
        //     stringStmtAnswer += "]"

        //     // console.log(JSON.parse(stringStmtAnswer));

        //     const items = JSON.parse(stringStmtAnswer)
        //     const replacer = (key, value) => (value === null ? "" : value);
        //     const header = Object.keys(items[0]);
        //     const csv = [
        //       header.join("~"),
        //       ...items.map((row) =>
        //         header
        //           .map((fieldName) => row[fieldName], replacer)
        //           .join("~")
        //       ),
        //     ].join("\r\n");
        //     console.log(csv)
        //     console.log(items)

        //     var hiddenElement = document.createElement("a");
        //     hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
        //     hiddenElement.target = "_blank";
        //     hiddenElement.download = "output.csv";
        //     hiddenElement.click();

        //     this.isDisabledButton = false
        //   }
        // },

        async createGeneralManagerAndTeamLeaderCSV() {
            this.isDisabledButton = true;
            const res = await api.get(
                "getDataforCreatingCSV/survey_assignment/6/7"
            );
            let resData = res.data;

            if (resData.length <= 0) {
                Swal.fire({
                    text: `No results found.`,
                    confirmButtonColor: "#3085d6",
                    confirmButtonText: "Ok",
                });
                this.isDisabledButton = false;
            } else {
                const sortAlphaNum = (a, b) =>
                    a.q.localeCompare(b.q, "en", { numeric: true });
                let stmt_answer = [];

                let stringStmtAnswer = "[";
                for (let i = 0; i < resData.length; i++) {
                    let objSortStmtQuestion = JSON.parse(
                        resData[i]["stmt_answer"]
                    );
                    stmt_answer[i] = objSortStmtQuestion.sort(sortAlphaNum);
                    stringStmtAnswer += "{";
                    stringStmtAnswer += ` "ind_id" : ${resData[i].ind_id}, `;
                    stringStmtAnswer += ` "submission_date" : "${resData[i].submission_date}", `;
                    stringStmtAnswer += ` "survey_template_id" : ${resData[i].survey_template_id}, `;
                    for (let j = 0; j < stmt_answer[i].length; j++) {
                        if (
                            stmt_answer[i][j]["q"] !== "Q37" &&
                            stmt_answer[i][j]["q"] !== "Q38" &&
                            stmt_answer[i][j]["q"] !== "Q39" &&
                            stmt_answer[i][j]["q"] !== "Q40" &&
                            stmt_answer[i][j]["q"] !== "Q41" &&
                            stmt_answer[i][j]["q"] !== "Q42" &&
                            stmt_answer[i][j]["q"] !== "Q43" &&
                            stmt_answer[i][j]["q"] !== "Q44" &&
                            stmt_answer[i][j]["q"] !== "Q45" &&
                            stmt_answer[i][j]["q"] !== "Q46" &&
                            stmt_answer[i][j]["q"] !== "Q47"
                        ) {
                            if (stmt_answer[i][j]["r"] == 6) {
                                stringStmtAnswer +=
                                    '"' +
                                    stmt_answer[i][j]["q"] +
                                    '"' +
                                    ":" +
                                    '"' +
                                    0 +
                                    '"';
                            } else {
                                stringStmtAnswer +=
                                    '"' +
                                    stmt_answer[i][j]["q"] +
                                    '"' +
                                    ":" +
                                    '"' +
                                    stmt_answer[i][j]["r"] +
                                    '"';
                            }
                        } else if (stmt_answer[i][j]["q"] === "Q43") {
                            let replaceStr = stmt_answer[i][j]["a"].replace(
                                /[,'"()\\//\t]+/g,
                                ""
                            );
                            stringStmtAnswer +=
                                '"' +
                                "Q43" +
                                '"' +
                                ":" +
                                '"' +
                                replaceStr +
                                '"';
                            // console.log(stmt_answer[i][j]['a']);
                        } else if (stmt_answer[i][j]["q"] === "Q44") {
                            let replaceStr = stmt_answer[i][j]["a"].replace(
                                /[,'"()\\//\t]+/g,
                                ""
                            );
                            stringStmtAnswer +=
                                '"' +
                                "Q44" +
                                '"' +
                                ":" +
                                '"' +
                                replaceStr +
                                '"';
                            // console.log(stmt_answer[i][j]['a']);
                        } else if (stmt_answer[i][j]["q"] === "Q45") {
                            let replaceStr = stmt_answer[i][j]["a"].replace(
                                /[,'"()\\//\t]+/g,
                                ""
                            );
                            stringStmtAnswer +=
                                '"' +
                                "Q45" +
                                '"' +
                                ":" +
                                '"' +
                                replaceStr +
                                '"';
                            // console.log(stmt_answer[i][j]['a']);
                        } else if (stmt_answer[i][j]["q"] === "Q46") {
                            let replaceStr = stmt_answer[i][j]["a"].replace(
                                /[,'"()\\//\t]+/g,
                                ""
                            );
                            stringStmtAnswer +=
                                '"' +
                                "Q46" +
                                '"' +
                                ":" +
                                '"' +
                                replaceStr +
                                '"';
                            // console.log(stmt_answer[i][j]['a']);
                        } else if (stmt_answer[i][j]["q"] === "Q47") {
                            let replaceStr = stmt_answer[i][j]["a"].replace(
                                /[,'"()\\//\t]+/g,
                                ""
                            );
                            stringStmtAnswer +=
                                '"' +
                                "Q47" +
                                '"' +
                                ":" +
                                '"' +
                                replaceStr +
                                '"';
                            // console.log(stmt_answer[i][j]['a']);
                        } else {
                            stringStmtAnswer +=
                                '"' +
                                stmt_answer[i][j]["q"] +
                                '"' +
                                ":" +
                                '"' +
                                stmt_answer[i][j]["r"] +
                                '"';
                        }
                        if (j < stmt_answer[i].length - 1) {
                            stringStmtAnswer += ",";
                        }
                        if (j == stmt_answer[i].length - 1) {
                            stringStmtAnswer += "}";
                            if (i < resData.length - 1) {
                                stringStmtAnswer += ",";
                            }
                        }
                    }
                }
                stringStmtAnswer += "]";

                // console.log(JSON.parse(stringStmtAnswer));

                const items = JSON.parse(stringStmtAnswer);
                const replacer = (key, value) => (value === null ? "" : value);
                const header = Object.keys(items[0]);
                const csv = [
                    header.join("~"),
                    ...items.map((row) =>
                        header
                            .map((fieldName) => row[fieldName], replacer)
                            .join("~")
                    ),
                ].join("\r\n");
                console.log(csv);
                console.log(items);

                var hiddenElement = document.createElement("a");
                hiddenElement.href =
                    "data:text/csv;charset=utf-8," + encodeURI(csv);
                hiddenElement.target = "_blank";
                hiddenElement.download = "output.csv";
                hiddenElement.click();

                this.isDisabledButton = false;
            }
        },
        previewFiles(event) {
            const reader = new FileReader();
            reader.readAsText(event.target.files[0]);
            reader.onload = () => {
                const text = reader.result;
                this.csvFile = text;
                let lines = [];
                const linesArray = this.csvFile.split(/\r\n|\n|\r/);
                // for trimming and deleting extra space
                linesArray.forEach((e) => {
                    const row = e.replace(/[\s]+[~]+|[~]+[\s]+/g, "~").trim();
                    // const row = e.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
                    lines.push(row);
                });
                // for removing empty record
                lines.splice(lines.length - 1, 1);
                const headers = lines[0].split("~");
                for (let i = 1; i < lines.length; i++) {
                    const obj = {};
                    const currentline = lines[i].split("~");
                    for (let j = 0; j < headers.length; j++) {
                        obj[headers[j]] = currentline[j];
                    }
                    this.parsedData.push(obj);
                }
                this.reportData = this.parsedData;
                console.log(this.reportData);
            };
        },
        Delete(index) {
            Swal.fire({
                text: `Are you sure you want to delete?`,
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                confirmButtonText: "Ok",
            }).then((result) => {
                if (result.value) {
                    if (index > 0) {
                        this.reportData.splice(index, 1); // 2nd parameter means remove one item only
                        this.$flashMessage.show({
                            type: "success",
                            title: `Row has been deleted!`,
                            message: "",
                        });
                    }
                }
            });
        },
        clearJSON() {
            (this.displayreportData = ""), (this.reportData = []);
            this.$flashMessage.show({
                type: "error",
                title: "JSON cleared",
                message: "",
            });
        },
        displayJSON() {
            if (this.reportData.length == 0) {
                this.$flashMessage.show({
                    type: "error",
                    title: "No data to parse!",
                    message: "",
                });
            } else {
                this.displayreportData = JSON.stringify(
                    this.reportData,
                    null,
                    2
                );
                const el = document.getElementById("displayJSON");
                el.scrollIntoView({ behavior: "smooth" });
            }
        },
        gotoTop() {
            const el = document.getElementById("reporttable");
            el.scrollIntoView({ behavior: "smooth" });
        },
        addRow() {
            const reportData = {
                Type: "",
                Number: "",
                Text: "",
                Template: "",
            };
            this.reportData.push(reportData);
            this.$flashMessage.show({
                type: "success",
                title: "Row added successfully!",
                message: "",
            });
        },
    },
};
</script>

<style scoped>
.display {
    margin-left: 20px;
    margin-right: auto;
    width: 950px;
    height: 350px;
    margin-top: 5px;
    align-content: center;
    margin-bottom: 10px;
}

table {
    margin-top: 20px;
    margin-bottom: 10px;
    min-width: 1000px;
    max-width: 1000px;
    align-self: center;
}

#table th {
    border: 1px solid #ddd;
    padding: 8px;
    max-width: 20px;
}
#table input {
    max-height: 23px;
    overflow: hidden;
    word-wrap: break-word;
}

#table tr {
    background-color: #f2f2f2;
}

#table tr:hover #table td > input:hover {
    background-color: #ddd;
}

#table th {
    padding-top: 12px;
    padding-bottom: 12px;
    text-align: left;
    background-color: #0e5071;
    color: white;
}
#table tr:nth-child(even) {
    background-color: #f2f2f2;
}
.wrapper {
    align-self: center;
}
.template {
    outline: 0;
    width: 200px;
    margin-left: 10px;
    border-width: 0 0 0px;
    border-color: grey;
    background-color: #f2f2f2;
    font-family: Arial, Helvetica, sans-serif;
    resize: none;
}
.type {
    outline: 0;
    margin-left: 10px;
    width: 150px;
    border-width: 0 0 0px;
    border-color: grey;
    background-color: #f2f2f2;
    font-family: Arial, Helvetica, sans-serif;
    resize: none;
}
.qno {
    outline: 0;
    width: 50px;
    margin-left: 10px;
    border-width: 0 0 0px;
    border-color: grey;
    background-color: #f2f2f2;
    font-family: Arial, Helvetica, sans-serif;
    resize: none;
}
.text {
    outline: 0;
    border-width: 0 0 0px;
    border-color: grey;
    background-color: #f2f2f2;
    font-family: Arial, Helvetica, sans-serif;
    resize: none;
}
label {
    font-size: 16px;
    font-weight: 500;
    display: inline-block;
    color: #8c8c8c;
    margin-bottom: 0.5rem;
}
#displayJSON {
    margin-top: 20px;
    margin-bottom: 10px;
    min-width: 1000px;
    max-width: 1000px;
    align-self: center;
}
.btns {
    margin-left: 10px;
    margin-bottom: 10px;
}
input, select, option, textarea {
  border: 1px solid grey;
}
</style>
