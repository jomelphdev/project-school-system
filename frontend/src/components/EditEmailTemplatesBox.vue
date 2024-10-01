<script setup>
import DescriptionInline from './DescriptionInline.vue';
import ButtonSubmit from './ButtonSubmit.vue'
import Header from "./Header.vue";
import api from '../api/api'
import { replaceTokens, flashMessage } from "../functions.js";
import CryptoJS from 'crypto-js'
import Editor from '@tinymce/tinymce-vue'
import moment from 'moment'

</script>

<template>
    <div>
        <div class="emailTemplateContainer">
            <div class="formBox">
                <label>
                    <DescriptionInline label="Organisation " />
                </label>
                <select class="input" disabled>
                    <option>{{ orgName }}</option>
                </select>

                <label>
                    <DescriptionInline label="Sub-organisation " />
                </label>
                <select class="input" disabled>
                    <option>{{ subOrgName }}</option>
                </select>

                <label>
                    <DescriptionInline label="Programs " />
                </label>
                <select class="input" disabled>
                    <option>{{ programName }}</option>
                </select>
            </div>
        </div>

        <div class="formBox">
            <div>
                <div>
                    <div class="label-div">
                        <div>
                            <strong>Available tokens:</strong>
                        </div>
                        <button class="label-btn" @click.prevent="toggle = !toggle" v-show="!toggle">
                            Show
                        </button>
                        <button class="label-btn" @click.prevent="toggle = !toggle" v-show="toggle">
                            Hide
                        </button>
                    </div>
                    <div class="tokensTemplateBox" v-html="tokenHtml" v-show="toggle"></div>
                </div>

                <div class="tokensTemplateBox">
                    <div>
                        <h3 class="headerButton mt-0" v-if="status == 'update'">Editing: '{{ templateType }}' for {{ orgName
                        }}
                        </h3>
                    </div>
                    <form>
                        <div>
                            <label>
                                <DescriptionInline label="Subject*" />
                            </label><br>
                            <textarea v-model="subject" class="subjectTextArea font-size-14" ref="textarea" @focus="resize"
                                @keyup="resize"></textarea>
                        </div>
                        <div>
                            <label>
                                <DescriptionInline label="Body*" />
                            </label><br>
                            <Editor api-key="APIkey" v-model="email_body" :init="{
                                toolbar_mode: 'sliding',
                                // plugins: 'tinycomments mentions anchor autolink charmap codesample emoticons image link lists searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed permanentpen advtable advcode powerpaste tinymcespellchecker a11ychecker hr',
                                plugins: 'anchor autolink charmap codesample emoticons image link lists searchreplace table visualblocks wordcount',
                                toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | tinycomments | checklist numlist bullist indent outdent | emoticons charmap | removeformat | hr',
                                tinycomments_mode: 'embedded',
                                height: 480,
                                width: '100%',
                            }" />
                        </div>
                    </form>
                </div>
            </div>

            <div class="mt-1">
                <div>
                    <ButtonSubmit label="Add" v-if="status == 'add'" @click="addEmailTemplate" />
                    <ButtonSubmit label="Update" v-else @click="updateEmailTemplate" />
                    <ButtonSubmit label="Cancel" @click="goToManageEmailTemplates" style="margin-left: 15px;"/>
                </div>
            </div>
        </div>

        <div class="formBox">
            <Header class="mb-0" label="Survey Preview"></Header>
            <p class="font-size-14 ">Search and select an assigned survey then click the preview button to show a preview
                with the substituted values of the tokens </p>

            <input v-model="searchData" placeholder="Search a User" class="searchInput" ref="search" />
            <div>
                <ButtonSubmit label="Find" @click="searchResult" />
            </div>
            <br>

            <div class="formBox mt-0">

                <!-- pagination -->
                <div v-show="isPagination" class="pagination">
                    <div class="d-flex">
                        <div>
                            <button type="button" :disabled="isInFirstPage" @click="page--"> Previous </button>
                        </div>

                        <div v-for="pageNumber in pageLength ? pages.slice(page - 1, page + 5) : pages" :key="pageNumber"
                            @click="page = pageNumber">
                            <button style="background-color:#0e5071; color:white;" v-if="pageNumber == page">{{ pageNumber
                            }}</button>
                            <button v-else>{{ pageNumber }}</button>
                        </div>

                        <div>
                            <button type="button" @click="page++" :disabled="isInLastPage"> Next </button>
                        </div>
                    </div>
                    <div>
                        <p class="font-size-14">{{ resultsFound }} results found</p>
                    </div>
                </div>
                <!-- end of pagination -->

                <table id="table">
                    <tr>
                        <th class="text-right">#</th>
                        <th>Survey Template</th>
                        <th>Individual Full Name</th>
                        <th>Sub Org</th>
                        <th>Program</th>
                        <th>Iteration</th>
                        <th>Action</th>
                    </tr>
                    <tr v-for="(data, i) in displayEmailTemplates" :key="data.survey_assignment_id"
                        style="cursor: pointer;">
                        <td class="text-right">{{ perPage * (page - 1) + i + 1 }}</td>
                        <td>{{ data.survey_template_name }}</td>
                        <td>{{ data.user_full_name }}</td>
                        <td>{{ data.suborg_name }}</td>
                        <td>{{ data.program_name }}</td>
                        <td>{{ data.iteration_name }}</td>
                        <td style="width:100px; text-align:center;">
                            <button style="width:85px; margin-bottom:10px;"
                                @click="preview(data.survey_assignment_id)">Preview</button>
                            <button @click="sendEmail(data.survey_assignment_id)">Send Email</button>
                        </td>
                    </tr>
                </table>
                <p class="font-size-14 text-center" v-show="noResultFound">No result found.</p>
            </div>

            <Header v-show="isPreview" class="mb-0" label="Preview"></Header>
            <div v-show="isPreview" class="formBox">
                <pre style="white-space: pre-line" v-html="rawSubject"></pre>
                <pre style="white-space: pre-line" v-html="rawEmailBody"></pre>
            </div>
        </div>

    </div>
</template>

<script>

export default {
    component: [DescriptionInline, ButtonSubmit, Header, Editor],
    name: "EditEmailTemplatesBox",
    props: ['userData', 'brandData'],
    data: () => ({
        page: 1,
        perPage: 0,
        pages: [],
        filteredEmailTemplatesList: [],
        isPagination: false,
        toggle: true,
        passedDetails: [],
        templateType: '',
        orgName: '',
        subOrgName: '',
        programName: '',
        orgId: 0,
        emailTemplateId: 0,
        subOrgId: 0,
        programId: 0,
        indId: 0,
        subject: '',
        email_body: '',
        orgList: [],
        subOrgList: [],
        programList: [],
        resultsFound: '',
        chosenOrg: 0,
        status: '',
        emailTokenList: [],
        filteredTokenList: [],
        searchData: "",
        previewSubject: '',
        rawSubject: '',
        rawEmailBody: '',
        isPreview: false,
        noResultFound: false,
        survey_active_reminders: '',
        report_images: ``,
        tokens: {
            recipient_email: '', website_url: '', nominee_salutation: '', nominee_message: '', program_name: '', org_name: '', suborg_name: '', website_sender_email: '', website_terms_url: '', website_privacy_url: '', website_contact_email: '', survey_close_date: '', days_until_survey_close_date: '', survey_template_name: '', survey_description: '', user_full_name: '', survey_subject_first_name: '', survey_subject_full_name: '', iteration_name: '', email: '',
            report_title: '', participant_report_release_date: '', pdf_date_created: '', pdf_time_created: ''
        },
    }),
    computed: {
        tokenHtml() {
            return `
                <p style="margin-top:0px;margin-bottom:0px;font-size:14px"><span style="font-weight:bold;">$RECIPIENT_EMAIL$</span> - The email address of the nominee</p>
                <p style="margin-top:0px;margin-bottom:0px;font-size:14px"><span style="font-weight:bold;">$WEBSITE_URL$</span> - The URL for the website homepage, a direct link to a survey panel, or a set password link, whichever is most relevant</p>
                <p style="margin-top:0px;margin-bottom:0px;font-size:14px"><span style="font-weight:bold;">$WEBSITE_CONTACT_EMAIL$</span> - The most relevant contact email address, taking into account the current URL and whitelabel brand</p>
                <p style="margin-top:0px;margin-bottom:0px;font-size:14px"><span style="font-weight:bold;">$WEBSITE_SENDER_EMAIL$</span> - The email address of the sender (the website) which can be used to ask people to whitelist it</p>
                <p style="margin-top:0px;margin-bottom:0px;font-size:14px"><span style="font-weight:bold;">$WEBSITE_TERMS_URL$</span> - The URL for the terms and conditions page</p>
                <p style="margin-top:0px;margin-bottom:0px;font-size:14px"><span style="font-weight:bold;">$WEBSITE_PRIVACY_URL$</span> - The URL for the privacy page</p>
                <p style="margin-top:0px;margin-bottom:0px;font-size:14px"><span style="font-weight:bold;">$DAYS_UNTIL_SURVEY_CLOSE_DATE$</span> - The number of days until the survey closes</p>
                <p style="margin-top:0px;margin-bottom:0px;font-size:14px"><span style="font-weight:bold;">$SURVEY_INITIAL_CLOSE_DATE$</span> - The initial close date of the survey</p>
                <p style="margin-top:0px;margin-bottom:0px;font-size:14px"><span style="font-weight:bold;">$SURVEY_DESCRIPTION$</span> - A survey template-specific description</p>
                <p style="margin-top:0px;margin-bottom:0px;font-size:14px"><span style="font-weight:bold;">$SURVEY_SUBJECT_FULL_NAME$</span>  - The full name of the subject of the survey</p>
                <p style="margin-top:0px;margin-bottom:0px;font-size:14px"><span style="font-weight:bold;">$SURVEY_SUBJECT_FIRST_NAME$</span>  - The first name of the subject of the survey</p>
                <p style="margin-top:0px;margin-bottom:0px;font-size:14px"><span style="font-weight:bold;">$SURVEY_SUB_ORGANIZATION_NAME$</span> - The sub-organisation associated with the survey</p>
                <p style="margin-top:0px;margin-bottom:0px;font-size:14px"><span style="font-weight:bold;">$SURVEY_PROGRAM_NAME$</span>  - The program associated with the survey</p>
                <p style="margin-top:0px;margin-bottom:0px;font-size:14px"><span style="font-weight:bold;">$SURVEY_ITERATION_NAME$</span>  - The iteration associated with the survey</p>
                <p style="margin-top:0px;margin-bottom:0px;font-size:14px"><span style="font-weight:bold;">$SURVEY_TEMPLATE_NAME$</span>  - The name of the survey template</p>
                <p style="margin-top:0px;margin-bottom:0px;font-size:14px"><span style="font-weight:bold;">$SURVEY_ACTIVE_REMINDERS$</span>  - A comma separated list of active reminders for this survey, e.g. 'submit your survey, make more nominations, nominate a supervisor'</p>
                <p style="margin-top:0px;margin-bottom:0px;font-size:14px"><span style="font-weight:bold;">$NOMINEE_SALUTATION$</span> - If the nominee has already provided their own name, we use that, otherwise this will be the name provided for this nominee at the time of nomination</p>
                <p style="margin-top:0px;margin-bottom:0px;font-size:14px"><span style="font-weight:bold;">$NOMINEE_MESSAGE$</span> - The message entered for this nomination by the subject of the survey. If no message was entered, this will be omitted. A new line will be added for you, both before and after this token</p>
                <p style="margin-top:0px;margin-bottom:0px;font-size:14px"><span style="font-weight:bold;">$USER_FULL_NAME$</span> - The full name of the recipient, if the nominee has not  provided their own name, this will be the name provided for this nominee at the time of nomination</p>
                <p style="margin-top:0px;margin-bottom:0px;font-size:14px"><span style="font-weight:bold;">$USER_EMAIL$</span> - The email address/login user of the individual</p>
                <p style="margin-top:0px;margin-bottom:0px;font-size:14px"><span style="font-weight:bold;">$CHOOSE_PASSWORD_LINK$</span> - The url that a first time user will use to be able to get his password.</p>
                <p style="margin-top:0px;margin-bottom:0px;font-size:14px"><span style="font-weight:bold;">$LOGO$</span> - The logo URL</p>
                <p style="margin-top:0px;margin-bottom:0px;font-size:14px"><span style="font-weight:bold;">$REPORT_TITLE$</span> - The title of report.</p>
                <p style="margin-top:0px;margin-bottom:0px;font-size:14px"><span style="font-weight:bold;">$PARTICIPANT_REPORT_RELEASE_DATE$</span> - The date of participant's report released.</p>
                <p style="margin-top:0px;margin-bottom:0px;font-size:14px"><span style="font-weight:bold;">$PDF_DATE_CREATED$</span> - The date of pdf created.</p>
                <p style="margin-top:0px;margin-bottom:0px;font-size:14px"><span style="font-weight:bold;">$PDF_TIME_CREATED$</span> - The time of pdf created.</p>
                <p style="margin-top:0px;margin-bottom:0px;font-size:14px"><span style="font-weight:bold;">The logo for this organization or sub-org </span> - ${this.brandData.website_url}${this.brandData.brand_path}/logo.png</p>
                <p style="margin-top:0px;margin-bottom:0px;font-size:14px"><span style="font-weight:bold;">Powered by TalentSage</span> - https://ts.talentsage.com/1ccaa508-f5eb-11ec-bb65-06c5d6b8da7c/logo.png</p>
                <p style="margin-top:0px;margin-bottom:0px;font-size:14px"><span style="font-weight:bold;">The report type infographics:</span></p>
                ${this.report_images}
            `
        },
        displayEmailTemplates() {
            return this.paginate(this.filteredEmailTemplatesList);
        },
        isInFirstPage() {
            return this.page == 1
        },
        isInLastPage() {
            return this.page >= this.pages.length
        },
        pageLength() {
            return this.pages.length > 5
        },
    },
    mounted() {
        this.passedDetails = JSON.parse(this.$route.params.data)
        this.orgName = this.passedDetails.orgName
        this.subOrgName = this.passedDetails.subOrgName
        this.programName = this.passedDetails.programName
        this.templateType = this.passedDetails.templateType
        this.orgId = this.passedDetails.orgId
        this.subOrgId = this.passedDetails.subOrgId
        this.programId = this.passedDetails.programId
        this.indId = this.passedDetails.indId
        this.status = this.passedDetails.status
        // console.log("USER_DATA:", this.userData)
        if (this.userData.suborgs === '0') {
            this.report_images = `
                <p style="margin-top:0px;margin-bottom:0px;font-size:14px"><span style="font-weight:bold;">Big 5 Survey Logo</span> - ${this.brandData.website_url}survey_logo/big5_survey_logo.png</p>
                    <p style="margin-top:0px;margin-bottom:0px;font-size:14px"><span style="font-weight:bold;">Pressure Point Logo</span> - ${this.brandData.website_url}survey_logo/pressure_point_logo.png</p>
                    <p style="margin-top:0px;margin-bottom:0px;font-size:14px"><span style="font-weight:bold;">Tipping Point Logo</span> - ${this.brandData.website_url}survey_logo/tipping_point_logo.png</p>
                    <p style="margin-top:0px;margin-bottom:0px;font-size:14px"><span style="font-weight:bold;">360 Survey Logo</span> - ${this.brandData.website_url}survey_logo/360_survey_logo.png</p>
                    <p style="margin-top:0px;margin-bottom:0px;font-size:14px"><span style="font-weight:bold;">VFP Logo</span> - ${this.brandData.website_url}survey_logo/VFP_logo.png</p>
                    <p style="margin-top:0px;margin-bottom:0px;font-size:14px"><span style="font-weight:bold;">qSort BEP Logo</span> - ${this.brandData.website_url}survey_logo/qSort_BEP.png</p>
                    <p style="margin-top:0px;margin-bottom:0px;font-size:14px"><span style="font-weight:bold;">qSort GDP Logo</span> - ${this.brandData.website_url}survey_logo/qSort_GDP.png</p>
                    <p style="margin-top:0px;margin-bottom:0px;font-size:14px"><span style="font-weight:bold;">qSort OCM Logo</span> - ${this.brandData.website_url}survey_logo/qSort_OCM.png</p>
                    <p style="margin-top:0px;margin-bottom:0px;font-size:14px"><span style="font-weight:bold;">Research Survey Logo</span> - ${this.brandData.website_url}survey_logo/research_survey_logo.png</p>
            `
        } else {
            // uncommented because the survey type should be globally available
            this.report_images = `
                <p style="margin-top:0px;margin-bottom:0px;font-size:14px"><span style="font-weight:bold;">Big 5 Survey Logo</span> - ${this.brandData.website_url}survey_logo/big5_survey_logo.png</p>
                    <p style="margin-top:0px;margin-bottom:0px;font-size:14px"><span style="font-weight:bold;">Pressure Point Logo</span> - ${this.brandData.website_url}survey_logo/pressure_point_logo.png</p>
                    <p style="margin-top:0px;margin-bottom:0px;font-size:14px"><span style="font-weight:bold;">Tipping Point Logo</span> - ${this.brandData.website_url}survey_logo/tipping_point_logo.png</p>
                    <p style="margin-top:0px;margin-bottom:0px;font-size:14px"><span style="font-weight:bold;">360 Survey Logo</span> - ${this.brandData.website_url}survey_logo/360_survey_logo.png</p>
                    <p style="margin-top:0px;margin-bottom:0px;font-size:14px"><span style="font-weight:bold;">VFP Logo</span> - ${this.brandData.website_url}survey_logo/VFP_logo.png</p>
                    <p style="margin-top:0px;margin-bottom:0px;font-size:14px"><span style="font-weight:bold;">qSort BEP Logo</span> - ${this.brandData.website_url}survey_logo/qSort_BEP.png</p>
                    <p style="margin-top:0px;margin-bottom:0px;font-size:14px"><span style="font-weight:bold;">qSort GDP Logo</span> - ${this.brandData.website_url}survey_logo/qSort_GDP.png</p>
                    <p style="margin-top:0px;margin-bottom:0px;font-size:14px"><span style="font-weight:bold;">qSort OCM Logo</span> - ${this.brandData.website_url}survey_logo/qSort_OCM.png</p>
                    <p style="margin-top:0px;margin-bottom:0px;font-size:14px"><span style="font-weight:bold;">Research Survey Logo</span> - ${this.brandData.website_url}survey_logo/research_survey_logo.png</p>
            `
        }
        if (this.subOrgId == '') this.subOrgId = 0
        if (this.programId == '') this.programId = 0


        //get email template to display in Subject and Body
        this.getEmailTemplate(this.templateType, this.orgId, this.subOrgId, this.programId)


        // email tokens - get all data
        api
            .get(`survey-assignments/org/${this.userData.org_id}`)
            .then((response) => {
                // console.log(response)
                this.emailTokenList = response.data
            })

        // get brand max_search_results column
        api
            .get(`brands-max-limit/org/${this.userData.org_id}`)
            .then((response) => {
                this.perPage = response.data.max_search_results
                if (this.perPage == undefined) this.perPage = 25
            })

        this.resize()
    },
    methods: {
        goToManageEmailTemplates() {
            this.$router.push({ path: '/manage_email_templates' });
        },
        encrypt(src, passphrase) {
            return CryptoJS.AES.encrypt(src, passphrase).toString()
        },
        getEmailTemplate(templateType, orgId, subOrgId, programId) {
            api
                .get(`email-templates/template-type/${templateType}/org/${orgId}/suborg/${subOrgId}/program/${programId}`)
                .then((response) => {
                    this.emailTemplateId = response.data.email_template_id
                    this.subject = response.data.subject
                    this.email_body = response.data.email_body
                })
        },
        paginate(surveyLists) {
            const from = (this.page * this.perPage) - this.perPage;
            const to = (this.page * this.perPage);
            return surveyLists.slice(from, to);
        },
        searchResult() {
            this.pages = []
            this.page = 1
            api
                .get(`survey-assignments/org/${this.userData.org_id}`)
                .then((response) => {

                    const res = response.data

                    this.filteredEmailTemplatesList = res.filter((data) => {
                        this.noResultFound = false

                        if (data.user_full_name == null || data.user_full_name == "") {
                            return (
                                data.recipient_email.toLowerCase().includes(this.searchData.toLowerCase())
                            );
                        }
                        else {
                            return (
                                data.user_full_name.toLowerCase().includes(this.searchData.toLowerCase()) ||
                                data.recipient_email.toLowerCase().includes(this.searchData.toLowerCase()) ||
                                data.survey_template_name.toLowerCase().includes(this.searchData.toLowerCase())
                            );
                        }
                    });

                    this.resultsFound = this.filteredEmailTemplatesList.length

                    if (this.filteredEmailTemplatesList.length == 0) {
                        this.noResultFound = true
                        this.isPagination = false
                        return
                    }

                    let numberOfPages = Math.ceil(this.filteredEmailTemplatesList.length / this.perPage);
                    for (let index = 1; index <= numberOfPages; index++) {
                        this.pages.push(index)
                    }
                    this.isPagination = true
                })
        },
        async updateEmailTemplate() {
            if (this.subject == '' || this.subject == null) {
                return flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', "Subject Field is required")
            }
            else if (this.email_body == '' || this.email_body == null) {
                return flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', "Body Field is required")
            }
            else {
                const data = {
                    'subject': this.subject,
                    'email_body': this.email_body,
                    'modified_by': this.indId,
                }

                await api
                    .put(`email-templates/template-type/${this.templateType}/org/${this.orgId}/suborg/${this.subOrgId}/program/${this.programId}`, data)
                    .then((res) => {
                        if (res.status) {
                            flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', "Email Template has been updated")
                        }
                    })
                    .catch((e) => {
                        flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', e.message)
                    })
            }

        },
        async addEmailTemplate() {

            if (this.subject == '' || this.subject == null) {
                return flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', "Subject Field is required")
            }
            else if (this.email_body == '' || this.email_body == null) {
                return flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', "Body Field is required")
            }
            else {
                const data = {
                    "template_type": this.templateType,
                    "org_id": this.orgId,
                    "suborg_id": this.subOrgId,
                    "program_id": this.programId,
                    "subject": this.subject,
                    "email_body": this.email_body,
                    "created_by": this.indId,
                    "modified_by": this.indId
                }
                await api
                    .post('email-template', data)
                    .then((res) => {
                        if (res.status) {
                            this.getEmailTemplate(this.templateType, this.orgId, this.subOrgId, this.programId)
                            this.status = 'update'
                            flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', "New Email Template has been added")
                        }
                    })
                    .catch((e) => {
                        flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', e.message)
                    })
            }
        },
        sendEmail(id) {
            const pdf_date_created = moment().format('MMM D, YYYY')
            const pdf_time_created = moment().format('h:mmA');

            if (this.subject == undefined || this.subject == '') {
                return flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color, "Subject Field has no content")
            }
            else if (this.email_body == undefined || this.email_body == '') {
                return flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color, "Body Field has no content")
            }

            // survey active reminders token
            api
                .get(`survey-assignments/active-reminders/${id}`)
                .then((response) => {
                    this.survey_active_reminders = response.data.survey_active_reminders
                })

            // email tokens - get single data
            api
                .get(`survey-assignments/${id}`)
                .then((response) => {
                    let res = response.data;
                    const participantReportReleaseDate = moment(res.participant_report_start_date).format('MMM D, YYYY [at] h:mmA')

                    //emailTokens: {result: {key: value}}
                    this.tokens.recipient_email = res.recipient_email
                    const data = {
                        result: {
                            first_name: res.first_name, header_bg_color: res.header_bg_color, brand_path: res.brand_path, recipient_email: res.recipient_email, website_url: res.website_url, nominee_salutation: res.nominee_salutation, nominee_message: res.nominee_message, program_name: res.program_name, suborg_name: res.suborg_name, website_sender_email: res.website_sender_email, website_terms_url: res.website_terms_url, website_privacy_url: res.website_privacy_url, website_contact_email: res.website_contact_email, survey_close_date: res.survey_close_date, days_until_survey_close_date: res.days_until_survey_close_date, survey_template_name: res.survey_template_name, survey_description: res.survey_description, user_full_name: res.user_full_name, survey_subject_first_name: res.survey_subject_first_name, survey_subject_full_name: res.survey_subject_full_name, iteration_name: res.iteration_name, email: res.email,
                            participant_report_release_date: participantReportReleaseDate, report_title: res.report_template_name, pdf_date_created: pdf_date_created, pdf_time_created: pdf_time_created
                        }
                    } //emil guide 12.27.2023
                    this.tokens = { ...data.result }
                    api.get(`individuals/email/${this.tokens.recipient_email.toString()}`)
                        .then((response) => {
                            let res = response.data
                            let password_link = ""
                            if (res.logged_in === 0) {
                                const encryptedID = this.encrypt(res.ind_id.toString(), "seed")
                                password_link = "<a href =" + this.tokens.website_url + '#/set_password?ind_id=' + encodeURIComponent(encryptedID) + "> Click Here </a>"
                            }
                            else if (res.logged_in === 1) {
                                password_link = "<a href =" + this.tokens.website_url + "> Click Here </a>"
                            }

                            const convertedSubject = replaceTokens(this.subject, this.tokens, password_link);
                            const convertedBody = replaceTokens(this.email_body, this.tokens, password_link);

                            this.rawSubject = convertedSubject
                            this.rawEmailBody = convertedBody

                            // console.log(convertedBody);

                            this.getEmailTemplate(this.templateType, this.orgId, this.subOrgId, this.programId)
                            const data2 = {
                                send_from: this.tokens.website_sender_email,
                                // send_from: "help@talentsage.com",
                                send_to: this.tokens.recipient_email, // emil commented 12.27.2023
                                // send_to: "emiljasondatuin@gmail.com",
                                // send_to: "jomel.gcm3@gmail.com",
                                send_cc: "",
                                send_bcc: "",
                                subject: this.rawSubject,
                                body: this.rawEmailBody,
                                org_id: this.orgId,
                                suborg_id: this.subOrgId,
                                email_template_id: this.emailTemplateId,
                                survey_assignment_id: res.survey_assignment_id,
                                ind_id: res.ind_id
                            }

                            // console.log(data2);

                            // send email
                            api
                                .post('sendemail', data2)
                                .then((res) => {
                                    flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color, res.data.message)
                                })
                                .catch((e) => {
                                    flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color, e.message)
                                })
                        })
                })
        },
        preview(id) {
            const pdf_date_created = moment().format('MMM D, YYYY')
            const pdf_time_created = moment().format('h:mmA');

            if (this.subject == undefined || this.subject == '') {
                return flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color, "Subject Field has no content")
            }
            else if (this.email_body == undefined || this.email_body == '') {
                return flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color, "Body Field has no content")
            }

            // survey active reminders token
            api
                .get(`survey-assignments/active-reminders/${id}`)
                .then((response) => {
                    this.survey_active_reminders = response.data.survey_active_reminders
                })

            // email tokens - get single data
            api
                .get(`survey-assignments/${id}`)
                .then((response) => {
                    let res = response.data;
                    const participantReportReleaseDate = moment(res.participant_report_start_date).format('MMM D, YYYY [at] h:mmA')

                    //emailTokens: {result: {key: value}}
                    this.tokens.recipient_email = res.recipient_email
                    const data = {
                        result: {
                            first_name: res.first_name, header_bg_color: res.header_bg_color, brand_path: res.brand_path, recipient_email: res.recipient_email, website_url: res.website_url, nominee_salutation: res.nominee_salutation, nominee_message: res.nominee_message, program_name: res.program_name, suborg_name: res.suborg_name, website_sender_email: res.website_sender_email, website_terms_url: res.website_terms_url, website_privacy_url: res.website_privacy_url, website_contact_email: res.website_contact_email, survey_close_date: res.survey_close_date, days_until_survey_close_date: res.days_until_survey_close_date, survey_template_name: res.survey_template_name, survey_description: res.survey_description, user_full_name: res.user_full_name, survey_subject_first_name: res.survey_subject_first_name, survey_subject_full_name: res.survey_subject_full_name, iteration_name: res.iteration_name, email: res.email,
                            participant_report_release_date: participantReportReleaseDate, report_title: res.report_template_name, pdf_date_created: pdf_date_created, pdf_time_created: pdf_time_created
                        }
                    } // emil - guide 12.27.2023
                    this.tokens = { ...data.result }
                    api.get(`individuals/email/${this.tokens.recipient_email.toString()}`)
                        .then((response) => {
                            let res = response.data
                            let password_link = ""
                            if (res.logged_in === 0) {
                                const encryptedID = this.encrypt(res.ind_id.toString(), "seed")
                                password_link = "<a href =" + this.tokens.website_url + '#/set_password?ind_id=' + encodeURIComponent(encryptedID) + "> Click Here </a>"
                            }
                            else if (res.logged_in === 1) {
                                password_link = "<a href =" + this.tokens.website_url + "> Click Here </a>"
                            }
                            const convertedSubject = replaceTokens(this.subject, this.tokens, password_link);
                            const convertedBody = replaceTokens(this.email_body, this.tokens, password_link, this.brandData.brand_path);

                            this.rawSubject = convertedSubject
                            this.rawEmailBody = convertedBody
                            this.isPreview = true
                        })
                })
        },
        resize() {
            const { textarea } = this.$refs;
            // textarea.style.height = textarea.scrollHeight - 4 + 'px'; // emil commented 12.28.2023
            textarea.style.height = textarea.scrollHeight
        },
    }
};
</script>

<style scoped>
.label-btn {
    color: #fff;
    background-color: #0e5071;
}

.label-div {
    padding: 10px;
    border: 1px solid #0e5071;
    background-color: #0e5071;
    color: #fff;
    display: flex;
    justify-content: space-between;
}

.emailTemplateContainer {
    width: 35vw;
}

.tokensTemplateBox {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex-wrap: wrap;
    padding: 15px 10px 10px;
    margin: 1em 0 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
}

.searchButton {
    width: 98%;
}

.searchInput {
    width: 97%;
    outline: 0;
    border-width: 0 0 1px;
    border-color: grey;
    padding: 2px 5px;
    margin: 10px 0px;
    font-size: 14px;
}

.subjectTextArea {
    width: 100%;
    border: 1px solid #ccc;
    border-radius: 3px;
    box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
    height: 40px;
}

.mt-1 {
    margin-top: 1rem;
}

.ml-1 {
    margin-left: 1rem;
}

.mr-1 {
    margin-right: 1rem;
}

.font-size-14 {
    font-size: 14px;
}

.font-bold {
    font-weight: bold;
}

.text-black {
    color: #000000;
}

.mb-0 {
    margin-bottom: 0;
}

.mt-0 {
    margin-top: 0;
}

.text-center {
    text-align: center;
}

.swal-wide {
    width: 850px !important;
}

.d-flex {
    display: flex;
}

.justify-between {
    justify-content: space-between;
}

.align-items-center {
    align-items: center;
}

.text-right {
    text-align: right !important;
}

.headerButton {
    font: -webkit-control;
    font-weight: bold;
    font-size: large;
}

.pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: .5rem;
    margin-left: 3px;
    margin-right: 3px;
}

input,
select,
option,
textarea {
    border: 1px solid grey;
}
</style>
