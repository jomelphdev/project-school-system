<script setup>
import DescriptionInline from './DescriptionInline.vue';
import DropDownInfo from './DropDownInfo.vue';
import DropDownInfoNumbered from './DropDownInfoNumbered.vue';
import HeaderReport from './HeaderReport.vue';
import FieldNameInline from './FieldNameInline.vue';
import api from '../api/api'
import { flashMessage } from "../functions.js";

</script>

<template>
    <section class="emailTemplateSection">
        <form>
            <div class="formBox">
                <label>
                    <DescriptionInline label="Select organisation " />
                </label>
                <select class="input" v-model="orgName">
                    <option>{{ orgName }}</option>
                </select>

                <label>
                    <DescriptionInline label="Select sub-organisation " />
                </label>
                <select class="input" v-model="chosenSubOrg" @change="reloadPrograms">
                    <option value="0">Select sub-organization</option>
                    <option v-for="organization in subOrgList" :value="organization.suborg_id"
                        :key="organization.suborg_id">
                        {{ organization.suborg_name }}
                    </option>
                </select>

                <label>
                    <DescriptionInline label="Programs " />
                </label>
                <select class="input" v-model="chosenProgram" @change="selectProgram">
                    <option value="0">Select Programs</option>
                    <option v-for="program in programList" :value="program.program_id" :key="program.program_id">
                        {{ program.program_name }}
                    </option>
                </select>
            </div>

            <div class="formBox">
                <table>
                    <tr>
                        <th class="template">Template</th>
                    </tr>

                    <tr v-for="(template, i) in templatesList" :key="template">
                        <td>{{ template }}</td>
                        <td><a v-show="template_type_1_12[i]" @click="sendProps(template, 'update')"><font-awesome-icon
                                    icon="pencil" /></a></td>
                        <!-- <td class="px-20"><a v-show="template_type_1_12[i] && !templateTypeOrgId_1_12[i]" @click.prevent="deleteEmailTemplate(template)"><font-awesome-icon icon="trash" /></a></td> -->
                        <td class="px-20"><a v-show="template_type_1_12[i]"
                                @click.prevent="deleteEmailTemplate(template)"><font-awesome-icon icon="trash" /></a></td>
                        <td><a v-show="!template_type_1_12[i]" @click="sendProps(template, 'add')"><font-awesome-icon
                                    icon="plus" /></a></td>
                    </tr>
                </table>
            </div>
        </form>
    </section>
</template>

<script>
import Swal from 'sweetalert2'
export default {
    name: 'EmailTemplatesBox',
    component: [DescriptionInline, DropDownInfo, DropDownInfoNumbered, HeaderReport, FieldNameInline],
    props: ['buttonLabel', 'userData', 'brandData'],

    data: () => ({
        organization: '',
        sub_organization: '',
        program: '',
        iteration: '',
        stream: '',
        template: '',
        orgList: [],
        subOrgList: [],
        programList: [],
        chosenOrg: '',
        chosenOrgName: '',
        chosenSubOrg: '',
        chosenProgram: '',
        orgId: 0,
        subOrgId: 0,
        programId: 0,
        orgName: '',
        subOrgName: '',
        programName: '',
        template_type: [],
        templatesList: [
            'Admin user initiation', 'Participant survey launch', 'Nominee survey launch', 'Participant survey deadline reminder', 'Nominee survey submission confirmation', 'Coach survey report available',
            'Password reset', 'Confirm email change', 'Multi-factor authentication code', 'Nominee survey deadline reminder', 'Participant survey submission confirmation', 'Participant survey report available',
            'Front Page', 'Back Page'
        ],
        template_type_1_12: [],
        templateTypeOrgId_1_12: []
    }),
    mounted() {
        api
            .get(`organizations/${this.userData.org_id}`)
            .then((response) => {
                this.orgId = response.data.org_id
                this.orgName = response.data.org_name
                this.getEmailtemplate(this.orgId, this.subOrgId, this.programId)
            })

        api
            .get(`sub-organizations/${this.userData.org_id}`)
            .then((response) => (this.subOrgList = response.data))

    },
    methods: {
        deleteEmailTemplate(template_type) {
            if (this.chosenSubOrg == '') this.chosenSubOrg = 0
            if (this.chosenProgram == '') this.chosenProgram = 0

            Swal.fire({
                text: `Are you sure you want to delete ${template_type}?`,
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                confirmButtonText: "Ok"
            }).then((result) => {
                if (result.value) {
                    api
                        .delete(`email-templates/template-type/${template_type}/org/${this.userData.org_id}/suborg/${this.chosenSubOrg}/program/${this.chosenProgram}`)
                        .then((res) => {
                            if (res.status) {
                                flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', "Successfully Removed!")
                                this.getEmailtemplate(this.userData.org_id, this.chosenSubOrg, this.chosenProgram)
                            }
                        })
                        .catch((e) => {
                            flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', e.message)
                        })
                }
            });
        },
        reloadPrograms() {
            api
                .get(`programs/suborg/${this.chosenSubOrg}`)
                .then((response) => {
                    this.programList = response.data
                    this.getEmailtemplate(this.userData.org_id, this.chosenSubOrg, this.programId)

                    for (const data of this.subOrgList) {
                        if (data.suborg_id === this.chosenSubOrg) {
                            this.subOrgName = data.suborg_name;
                        }
                    }
                })
        },
        selectProgram() {
            this.getEmailtemplate(this.userData.org_id, this.chosenSubOrg, this.chosenProgram)

            for (const data of this.programList) {
                if (data.program_id === this.chosenProgram) {
                    this.programName = data.program_name;
                }
            }
        },
        getEmailtemplate(org_id, suborg_id, program_id) {
            api
                .get(`email-templates/org/${org_id}/suborg/${suborg_id}/program/${program_id}`)
                .then((response) => {
                    this.template_type = response.data

                    for (let i = 0; i < this.templatesList.length; i++) {
                        this.template_type_1_12[i] = this.template_type.some(data => data.template_type === this.templatesList[i]);
                        // this.templateTypeOrgId_1_12[i] = this.template_type.some(data => data.template_type === this.templatesList[i] && data.org_id === 1 && data.suborg_id === 0 && data.program_id === 0);
                    }

                })
        },
        sendProps(template_type, status) {
            const data = {
                'orgId': this.userData.org_id,
                'subOrgId': this.chosenSubOrg,
                'programId': this.chosenProgram,
                'templateType': template_type,
                'indId': this.userData.ind_id,
                'orgName': this.orgName,
                'subOrgName': this.subOrgName,
                'programName': this.programName,
                'status': status
            }
            this.$router.push({
                name: "edit_email_templates",
                params: { data: JSON.stringify(data) }
            });
        }
    }
}
</script>

<style scoped>
.emailTemplateSection {
    padding: 0 30px 30px 30px;
}

.template {
    text-align: left;
    padding-bottom: 15px;
}

.px-20 {
    padding-left: 20px;
    padding-right: 20px;
}

input,
select,
option,
textarea {
    border: 1px solid grey;
}
</style>
