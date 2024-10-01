<script setup>
import Header from './Header.vue';
import ButtonSubmit from './ButtonSubmit.vue'
import ButtonCancel from './ButtonCancel.vue'
import DescriptionInline from './DescriptionInline.vue';
import api from '../api/api'
import CryptoJS from 'crypto-js'
import MakeNominationInstruction from './MakeNominationInstruction.vue';
import {replaceTokensForNomination, replaceTokensForUpdateEmail, flashMessage, mailFormat} from "../functions.js";
</script>

<template>
    <div style="margin-left:60px; margin-right:60px;" >
        <Header label="Individual Survey"></Header>

        <MakeNominationInstruction />
        <br />
        
        <div class="nominationSection">
            <p class="font-size-14 font-bold">{{ passedRouteParams.surveyName }}</p>
            <div class="bg-success p-1" v-if="relationshipObj.submittedStatus == 1">
                <i style="color:green" class="fa-solid fa-check"></i><span class="font-size-14"> You have successfully submitted your self-assessment.</span>
            </div>

            <div class="plainBox mt-1">
                <div class="d-flex w-100">
                    <p class="font-size-14 font-bold w-11 mb-0">Deadline: </p>
                    <p class="font-size-14 mb-0" >{{ readDate(relationshipObj.initialDeadlineDate) }}</p>
                </div>
                <div class="d-flex w-100">
                    <p class="font-size-14 font-bold w-11 mt-0">Status:</p>
                    <p class="font-size-14 mt-0" v-if="relationshipObj.submittedStatus == 1">Submitted</p>
                    <p class="font-size-14 mt-0" v-else>Not yet Submitted</p>
                </div>
            </div>

            <!-- shared report with coach  -->
            <div v-show="!isCoachReportHasTag && relationshipObj.submittedStatus == 1">
                <div v-show="isSharedReportWithCoach" class="plainBox d-flex justify-space-between align-items-center mt-1">
                    <p class="font-size-14 font-bold" v-if="isSharedReportWithCoachLabel">You have shared your report with your coach</p>
                    <p class="font-size-14 font-bold" v-else>You haven't shared your report with your coach</p>
                    <p><ButtonSubmit label="Change" @click="openSharedReportWithCoach" /></p>
                </div>

                <div v-show="!isSharedReportWithCoach" class="plainBox mt-1">
                    <p class="font-size-14 font-bold text-warning">Please change my report sharing choice</p>
                    <p class="font-size-13">On further consideration, I would like to change my decision for my coach's access to my report.</p>

                    <div class="d-flex">
                        <input id="accessReportWithCoach" type="radio" name="sharedReportWithCoach" :checked="isSharedReportWithCoachCheck" value="1" v-model="chosenRadioWithCoach" >
                        <label for="accessReportWithCoach" class="font-size-14"> Yes, grant my Coach access to my report.</label>
                    </div>
                    <div class="d-flex">
                        <input id="noAccessReportWithCoach" type="radio" name="sharedReportWithCoach" :checked="!isSharedReportWithCoachCheck" value="0" v-model="chosenRadioWithCoach">
                        <label for="noAccessReportWithCoach" class="font-size-14"> No, remove my Coach's access to my report.</label>
                    </div>

                    <p class="font-size-12 text-gray">I understand my Coach will now have access to my personal report for the duration of this program.</p>

                    <div class="mt-1 mb-1">
                        <ButtonSubmit @click="updateSharedReportWithCoach" label="Update" />
                        <ButtonCancel @click="cancelSharedReportWithCoach" label="Cancel" />
                    </div>
                </div>
            </div>

            <!-- shared report with coach group -->
            <div v-show="isCoachGroupReportHasTag && relationshipObj.submittedStatus == 1">
                <div v-show="isSharedReportWithCoachGroup" class="plainBox d-flex justify-space-between align-items-center mt-1">
                    <p class="font-size-14 font-bold" v-if="isSharedReportWithCoachGroupLabel">You have shared your report with your coach group</p>
                    <p class="font-size-14 font-bold" v-else>You haven't shared your report with your coach group</p>
                    <p><ButtonSubmit label="Change" @click="openSharedReportWithCoachGroup" /></p>
                </div>

                <div v-show="!isSharedReportWithCoachGroup" class="plainBox mt-1">
                    <p class="font-size-14 font-bold text-warning">Please change my report sharing choice</p>
                    <p class="font-size-13">On further consideration, I would like to change my decision for my coach's access to my report.</p>

                    <div class="d-flex">
                        <input id="accessReportWithCoachGroup" type="radio" name="sharedReportWithCoachGroup" :checked="isSharedReportWithCoachGroupCheck" value="1" v-model="chosenRadioWithCoachGroup" >
                        <label for="accessReportWithCoachGroup" class="font-size-14"> Yes, grant my Coach group access to my report.</label>
                    </div>
                    <div class="d-flex">
                        <input id="noAccessReportWithCoachGroup" type="radio" name="sharedReportWithCoachGroup" :checked="!isSharedReportWithCoachGroupCheck" value="0" v-model="chosenRadioWithCoachGroup">
                        <label for="noAccessReportWithCoachGroup" class="font-size-14"> No, remove my Coach group's access to my report.</label>
                    </div>

                    <p class="font-size-12 text-gray">I understand my Coach will now have access to my personal report for the duration of this program.</p>

                    <div class="mt-1 mb-1">
                        <ButtonSubmit @click="updateSharedReportWithCoachGroup" label="Update" />
                        <ButtonCancel @click="cancelSharedReportWithCoachGroup" label="Cancel" />
                    </div>
                </div>
            </div>

            <!-- shared report with HR  -->
            <div v-show="isHrReportHasTag && relationshipObj.submittedStatus == 1">
                <div v-show="isSharedReportWithHR" class="plainBox d-flex justify-space-between align-items-center mt-1">
                    <p class="font-size-14 font-bold" v-if="isSharedReportWithHRLabel">You have shared your report with your HR</p>
                    <p class="font-size-14 font-bold" v-else>You haven't shared your report with your HR</p>
                    <p><ButtonSubmit label="Change" @click="openSharedReportWithHR" /></p>
                </div>

                <div v-show="!isSharedReportWithHR" class="plainBox mt-1">
                    <p class="font-size-14 font-bold text-warning">Please change my report sharing choice</p>
                    <p class="font-size-13">On further consideration, I would like to change my decision for my coach's access to my report.</p>

                    <div class="d-flex">
                        <input id="accessReportWithHR" type="radio" name="sharedReportWithHR" :checked="isSharedReportWithHRCheck" value="1" v-model="chosenRadioWithHR" >
                        <label for="accessReportWithHR" class="font-size-14"> Yes, grant my HR access to my report.</label>
                    </div>
                    <div class="d-flex">
                        <input id="noAccessReportWithHR" type="radio" name="sharedReportWithHR" :checked="!isSharedReportWithHRCheck" value="0" v-model="chosenRadioWithHR">
                        <label for="noAccessReportWithHR" class="font-size-14"> No, remove my HR's access to my report.</label>
                    </div>

                    <p class="font-size-12 text-gray">I understand my Coach will now have access to my personal report for the duration of this program.</p>

                    <div class="mt-1 mb-1">
                        <ButtonSubmit @click="updateSharedReportWithHR" label="Update" />
                        <ButtonCancel @click="cancelSharedReportWithHR" label="Cancel"/>
                    </div>
                </div>
            </div>

            <p class="font-size-14 font-bold">Nominations made: {{ relationshipObj.nominationsMade }} </p>
            <div class="bg-warning p-1" v-show="isReachRecommendedNumberOfNominations">
                <i style="color:orange" class="fa-solid fa-triangle-exclamation"></i><span class="font-size-14"> Please make more nominations. We recommend at least: {{ relationshipObj.recommendedNumberOfNominations }}</span>
            </div>

            <!-- Make a nomination  -->
            <div v-show="isReachMaxNumberOfNominations">
                <div v-show="isMakeNominationButton" class="d-flex flex-column mt-1 mb-1">
                    <ButtonSubmit @click="makeNomination" label="Make a nomination" />
                </div>

                <div v-show="isMakeNomination">
                    <form class="formBox mt-1">
                        <p class="font-size-14 font-bold text-warning">Make a nomination</p>

                        <p class="font-size-14">
                            Nominees provide feedback as a courtesy, and are not required to contribute.
                            To protect nominees' privacy, we do not disclose the status of individual submissions.
                        </p>

                        <label><DescriptionInline label="This person is: " /></label>
                        <select class="input" v-model="nomineeRelationship">
                            <option disabled>Select Relationship</option>
                            <option
                                v-for="relationship in relationshipList"
                                :value="relationship.relationship_id"
                                :key="relationship.relationship_id"
                            >
                            {{ relationship.relationship_name }}
                            </option>
                        </select>

                        <label><DescriptionInline label="Name (Used when emailing nominee)* " /></label>
                        <input type="text" class="input" v-model="nomineeName"> 

                        <label><DescriptionInline label="Email* " /></label>
                        <input type="email" class="input" v-model="nomineeEmail">

                        <label><DescriptionInline label="Add a personal message " /></label>
                        <input type="text" class="input" v-model="nomineeMessage">
                        <span class="font-size-12">
                            Adding a personal message can help the nominee to understand why they are 
                            receiving an email, especially if they are not expecting one from us.
                        </span>

                        <div class="mt-1">
                            <ButtonSubmit :disabled="isDisabledButton" @click.prevent="addNomination" label="Add nominee and send an email now" />
                            <ButtonCancel @click.prevent="cancelNomination" label="Cancel"/>
                        </div>
                    </form>
                </div>
            </div>

            <!-- <p class="font-size-14 font-bold">Respondents: {{ relationshipObj.respondents }}</p> -->

            <div class="bg-success p-1" v-if="relationshipObj.enoughRespondentsEligibleForRent == 'yes' ">
                <i style="color:green" class="fa-solid fa-check"></i><span class="font-size-14"> You have enough respondents to be eligible for a report</span>
            </div>
            <div class="bg-warning p-1 mt-1" v-else>
                <i style="color:orange" class="fa-solid fa-triangle-exclamation"></i><span class="font-size-14"> You don't have enough respondents to be eligible for a report</span>
            </div>

            <!-- Show / Hide Nomination  -->
            <div>
                <div class="showHideNomination mt-1">
                    <div><strong>Show/hide nominations</strong></div>
                    <button class="label-btn" @click.prevent="toggle = !toggle" v-show="!toggle">Show</button>
                    <button class="label-btn" @click.prevent="toggle = !toggle" v-show="toggle">Hide</button>
                </div>

                <div v-show="toggle" class="plainBox">
                    <p class="font-size-12">You will be able to edit any failed email addressess before the survey deadline.</p>
                    
                    <div class="w-100 d-flex" 
                        v-for="(nominees, i) in nomineesList"
                        :key="nominees.survey_assignment_id"
                    >
                        <div class="w-4">
                            <p class="font-size-13">{{ i+1 }}.</p>
                        </div>
                        <div>
                            <p class="font-size-13 mb-0"><span class="font-bold">{{ nominees.nominee_salutation }}</span> <span class="font-size-12">&#60;{{ nominees.recipient_email }}&#62;</span> - <span class="text-blue font-size-12 cursor-pointer" @click="editEmail(nominees.recipient_email, nominees.survey_assignment_id, nominees.recipient_email)">Edit</span></p>
                            <p v-if="nominees.email_check=='Valid'" class="font-size-12 mt-0"><i class="text-success fa-solid fa-envelope"></i> This email address appears to be accepting messages</p>
                            <p v-else-if="nominees.email_check=='Invalid'" class="font-size-12 mt-0"><i class="text-warning fa-solid fa-envelope"></i> This email address is pending verification</p>
                            <p v-else class="font-size-12 mt-0"><i class="text-danger fa-solid fa-envelope"></i> We have been unable to send emails to this address</p>
                            <p v-if="nominees.email_check != 'Valid'" class="font-size-12"><span class="font-bold text-gray">Next reminder due: </span> Next Reminder Due Date </p>
                            <p @click="editRelationship(nominees.survey_assignment_id, nominees.relationship_name, nominees.relationship_id)" class="font-size-12 cursor-pointer"><span class="font-bold text-gray">Relationship: </span><span>{{ nominees.relationship_name }} - </span><span class="text-blue">Edit</span></p>
                            <p class="font-size-12"><span class="font-bold text-gray">Nominated on: </span>{{ readDate(nominees.nominated_on) }}</p>
                        </div>
                    </div>

                </div>
            </div>

            <div class="mt-1">
                <router-link class="font-size-13 text-decoration-none text-blue" to="/">My surveys</router-link>
            </div>
            <br />

        </div>

        <!-- Edit Relationship Modal -->
        <div class="modal" v-show="isEditRelationship" @click.self="closeModal">
            <!-- Modal content -->
            <div class="modal-content">
                <div class="d-flex justify-space-between">
                    <Header label="Edit Relationship"></Header>
                    <span @click="closeModal" class="close">&times;</span>
                </div>
                
                <div>
                    <label><DescriptionInline label="This person is: " /></label>
                    <select class="input w-100" @change="selectedRelationship($event)">
                        <option
                            v-for="relationship in relationshipList"
                            :value="relationship.relationship_id"
                            :key="relationship.relationship_id"
                            :selected="relationship.relationship_name == relationshipNameModal"
                        >
                            {{ relationship.relationship_name }}
                        </option>
                    </select>
                    <p class="font-size-12">People at your level, colleagues you work alongside</p>
                    <div class="mt-2 mb-1">
                        <ButtonSubmit @click="updateRelationship" label="Update" />
                        <ButtonCancel @click="closeModal" label="Cancel" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Edit Email Modal -->
        <div class="modal" v-show="isEditEmail" @click.self="closeModal">
            <!-- Modal content -->
            <div class="modal-content">
                <div class="d-flex justify-space-between">
                    <Header label="Edit email"></Header>
                    <span @click="closeModal" class="close">&times;</span>
                </div>
                
                <div>
                    <p class="font-size-12">Please enter a valid email address for this nominee and we will attempt contact again.</p>
                    
                    <div>
                        <label><DescriptionInline label="Email " /></label>
                        <input type="text" v-model="emailModal" class="input w-100">
                    </div>
                    
                    <div class="mt-2 mb-1">
                        <ButtonSubmit @click="updateEmail" label="Update" />
                        <ButtonCancel @click="closeModal" label="Cancel" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    component: [Header, ButtonSubmit, ButtonCancel, DescriptionInline, MakeNominationInstruction],
    props: ['userData','brandData'],
    data: () => ({
        toggle: false,
        relationshipObj : {},
        nominationList : [],
        nomineesList : [],
        isEditRelationship : false,
        isEditEmail : false,
        isDisabledButton : false,

        isReachRecommendedNumberOfNominations : true,
        isReachMaxNumberOfNominations : true,

        isMakeNomination : false,
        isMakeNominationButton : true,

        isSharedReportWithCoach : true,
        isSharedReportWithCoachGroup : true,
        isSharedReportWithHR : true,

        isSharedReportWithCoachLabel : false,
        isSharedReportWithCoachGroupLabel : false,
        isSharedReportWithHRLabel : false,

        isSharedReportWithCoachCheck : false,
        isSharedReportWithCoachGroupCheck : false,
        isSharedReportWithHRCheck : false,

        isCoachReportHasTag : false,
        isCoachGroupReportHasTag : false,
        isHrReportHasTag : false,

        chosenRadioWithCoach : 0,
        chosenRadioWithCoachGroup : 0,
        chosenRadioWithHR : 0,

        //route params from HomeSkillBuilding.vue
        passedRouteParams : {},

        //form make nomination 
        oldemail : '',
        nomineeName : '',
        nomineeEmail : '',
        nomineeMessage : '',
        nomineeRelationship : '',
        selectedRelationshipIdModel : '',

        orgName : '',

        userDetails: {
            seed: "",
            roles : '2' //default role for participant - use in nomination
        },

        subject : '',
        email_body : '',
        email_template_id : 0,
        rawSubject : '',
        rawEmailBody : '',
        tokens : {},

        isEmailExist : 'no',
        isUpdateEmailExist : 'no',

        emailModal : '',
        relationshipNameModal : '',
        relationshipIdModal : '',
        surveyAssignmentIDModal : 0,

        userAuthStringResult: "0000000000000000000000000000000000000000000000000000000000", // 58 items
        userAuthString:
        {
                 Participant: "1111111111000000000000000000000000000000000000000000000000",
                  Respondent: "1111111111000000000000000000000000000000000000000000000000",
             SurveyPreviewer: "1111111111001000000000000000000000000000000000000000010000",
                       Coach: "1111111111000100000000010001111111111111111111110000010000",
               FacultyViewer: "1111111111000000000000000001111110111111111111100000010000",
        HRProfessionalViewer: "1111111111000000000000000001111111111111111111100000010000",
   ClientAdministratorViewer: "1111111111000000000000000001111110111111111111100000010000",
   ClientAdministratorEditor: "1111111111001111111111111111111110111111111111110010010000",
   ClientEmailTemplateEditor: "1111111111101111111111111111111110111111111111110010010000",
                         CXM: "1111111111001111111111100011111110111111111111110010010000",
         MasterAdministrator: "1111111111001111111111111111111111111111111111111110010000",
   MasterAdministratorEmails: "1111111111101111111111111111111111111111111111111110010000",
               SubOrgManager: "1111111111101111111111111111111111111111111111111111010001", //58th item is brand screen
         AnnouncementManager: "1111111111111111111111111111111111111111111111111111010001",
                 SiteManager: "1000000000000110000000001000000000000000000000000000101000",
               SurveyCreator: "1000000000000000000000000000000000000000000000000000000100",
               SurveyManager: "1000000000000000000000000000000000000000000000000000000110", //56th item is csv parser, 57th item is manage survey
        }
    }),
    mounted() {
        this.passedRouteParams = JSON.parse(this.$route.params.data)
    
        this.getRelationships()
        this.getNominationsData()
        this.getNominees()
        this.getHrReportTag()
        this.getCoachGroupReportTag()
        this.getCoachReportTag()

        // console.log(this.passedRouteParams);
        api
            .get(`organizations/${this.passedRouteParams.orgID}`)
            .then((response) => {
                this.orgName = response.data.org_name
            })


    },
    methods: {
        randomString(length, chars) {
            var result = '';
            for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
            return result;
        },
        encrypt (src, passphrase) {
            return CryptoJS.AES.encrypt(src, passphrase).toString()
        },

        // use for making a new user - use for making a nomination
        getAuthString() {
            var compareAuth = this.userDetails.roles
            if(compareAuth.includes(1))
            {
                const sourceStr = this.userAuthString.Participant;
                const searchStr = '1';
                const indexes = [...sourceStr.matchAll(new RegExp(searchStr, 'gi'))].map(a => a.index);
                for (let i = 0; i < indexes.length; i++) 
                {
                const str = this.userAuthStringResult;
                const replacement = "1";
                const replaced = str.substring(indexes[0], indexes[i])+replacement+str.substring(indexes[i] + 1)
                this.userAuthStringResult = replaced; 
                }
            }
            if(compareAuth.includes(2))
            {
                const sourceStr = this.userAuthString.Respondent;
                const searchStr = '1';
                const indexes = [...sourceStr.matchAll(new RegExp(searchStr, 'gi'))].map(a => a.index);
                for (let i = 0; i < indexes.length; i++) 
                {
                const str = this.userAuthStringResult;
                const replacement = "1";
                const replaced = str.substring(indexes[0], indexes[i])+replacement+str.substring(indexes[i] + 1)
                this.userAuthStringResult = replaced; 
                }
            }
            if(compareAuth.includes(3))
            {
                const sourceStr = this.userAuthString.SurveyPreviewer;
                const searchStr = '1';
                const indexes = [...sourceStr.matchAll(new RegExp(searchStr, 'gi'))].map(a => a.index);
                for (let i = 0; i < indexes.length; i++) 
                {
                const str = this.userAuthStringResult;
                const replacement = "1";
                const replaced = str.substring(indexes[0], indexes[i])+replacement+str.substring(indexes[i] + 1)
                this.userAuthStringResult = replaced; 
                }
            }
            if(compareAuth.includes(4))
            {
                const sourceStr = this.userAuthString.Coach;
                const searchStr = '1';
                const indexes = [...sourceStr.matchAll(new RegExp(searchStr, 'gi'))].map(a => a.index);
                for (let i = 0; i < indexes.length; i++) 
                {
                const str = this.userAuthStringResult;
                const replacement = "1";
                const replaced = str.substring(indexes[0], indexes[i])+replacement+str.substring(indexes[i] + 1)
                this.userAuthStringResult = replaced; 
                }
            }
            if(compareAuth.includes(5))
            {
                const sourceStr = this.userAuthString.FacultyViewer;
                const searchStr = '1';
                const indexes = [...sourceStr.matchAll(new RegExp(searchStr, 'gi'))].map(a => a.index);
                for (let i = 0; i < indexes.length; i++) 
                {
                const str = this.userAuthStringResult;
                const replacement = "1";
                const replaced = str.substring(indexes[0], indexes[i])+replacement+str.substring(indexes[i] + 1)
                this.userAuthStringResult = replaced; 
                }
            }
            if(compareAuth.includes(6))
            {
                const sourceStr = this.userAuthString.HRProfessionalViewer;
                const searchStr = '1';
                const indexes = [...sourceStr.matchAll(new RegExp(searchStr, 'gi'))].map(a => a.index);
                for (let i = 0; i < indexes.length; i++) 
                {
                const str = this.userAuthStringResult;
                const replacement = "1";
                const replaced = str.substring(indexes[0], indexes[i])+replacement+str.substring(indexes[i] + 1)
                this.userAuthStringResult = replaced; 
                }
            }
            if(compareAuth.includes(7))
            {
                const sourceStr = this.userAuthString.ClientAdministratorViewer;
                const searchStr = '1';
                const indexes = [...sourceStr.matchAll(new RegExp(searchStr, 'gi'))].map(a => a.index);
                for (let i = 0; i < indexes.length; i++) 
                {
                const str = this.userAuthStringResult;
                const replacement = "1";
                const replaced = str.substring(indexes[0], indexes[i])+replacement+str.substring(indexes[i] + 1)
                this.userAuthStringResult = replaced; 
                }
            }
            if(compareAuth.includes(8))
            {
                const sourceStr = this.userAuthString.ClientAdministratorEditor;
                const searchStr = '1';
                const indexes = [...sourceStr.matchAll(new RegExp(searchStr, 'gi'))].map(a => a.index);
                for (let i = 0; i < indexes.length; i++) 
                {
                const str = this.userAuthStringResult;
                const replacement = "1";
                const replaced = str.substring(indexes[0], indexes[i])+replacement+str.substring(indexes[i] + 1)
                this.userAuthStringResult = replaced; 
                }
            }
            if(compareAuth.includes(9))
            {
                const sourceStr = this.userAuthString.ClientEmailTemplateEditor;
                const searchStr = '1';
                const indexes = [...sourceStr.matchAll(new RegExp(searchStr, 'gi'))].map(a => a.index);
                for (let i = 0; i < indexes.length; i++) 
                {
                const str = this.userAuthStringResult;
                const replacement = "1";
                const replaced = str.substring(indexes[0], indexes[i])+replacement+str.substring(indexes[i] + 1)
                this.userAuthStringResult = replaced; 
                }
            }
            if(compareAuth.includes(10))
            {
                const sourceStr = this.userAuthString.CXM;
                const searchStr = '1';
                const indexes = [...sourceStr.matchAll(new RegExp(searchStr, 'gi'))].map(a => a.index);
                for (let i = 0; i < indexes.length; i++) 
                {
                const str = this.userAuthStringResult;
                const replacement = "1";
                const replaced = str.substring(indexes[0], indexes[i])+replacement+str.substring(indexes[i] + 1)
                this.userAuthStringResult = replaced; 
                }
            }
            if(compareAuth.includes(11))
            {
                const sourceStr = this.userAuthString.MasterAdministrator;
                const searchStr = '1';
                const indexes = [...sourceStr.matchAll(new RegExp(searchStr, 'gi'))].map(a => a.index);
                for (let i = 0; i < indexes.length; i++) 
                {
                const str = this.userAuthStringResult;
                const replacement = "1";
                const replaced = str.substring(indexes[0], indexes[i])+replacement+str.substring(indexes[i] + 1)
                this.userAuthStringResult = replaced; 
                }
            }
            if(compareAuth.includes(12))
            {
                const sourceStr = this.userAuthString.MasterAdministratorEmails;
                const searchStr = '1';
                const indexes = [...sourceStr.matchAll(new RegExp(searchStr, 'gi'))].map(a => a.index);
                for (let i = 0; i < indexes.length; i++) 
                {
                const str = this.userAuthStringResult;
                const replacement = "1";
                const replaced = str.substring(indexes[0], indexes[i])+replacement+str.substring(indexes[i] + 1)
                this.userAuthStringResult = replaced; 
                }
            }
            if(compareAuth.includes(13))
            {
                const sourceStr = this.userAuthString.SubOrgManager;
                const searchStr = '1';
                const indexes = [...sourceStr.matchAll(new RegExp(searchStr, 'gi'))].map(a => a.index);
                for (let i = 0; i < indexes.length; i++) 
                {
                const str = this.userAuthStringResult;
                const replacement = "1";
                const replaced = str.substring(indexes[0], indexes[i])+replacement+str.substring(indexes[i] + 1)
                this.userAuthStringResult = replaced; 
                }
            }
            if(compareAuth.includes(14))
            {
                const sourceStr = this.userAuthString.AnnouncementManager;
                const searchStr = '1';
                const indexes = [...sourceStr.matchAll(new RegExp(searchStr, 'gi'))].map(a => a.index);
                for (let i = 0; i < indexes.length; i++) 
                {
                const str = this.userAuthStringResult;
                const replacement = "1";
                const replaced = str.substring(indexes[0], indexes[i])+replacement+str.substring(indexes[i] + 1)
                this.userAuthStringResult = replaced; 
                }
            }
            if(compareAuth.includes(16))
            {
                const sourceStr = this.userAuthString.SiteManager;
                const searchStr = '1';
                const indexes = [...sourceStr.matchAll(new RegExp(searchStr, 'gi'))].map(a => a.index);
                for (let i = 0; i < indexes.length; i++) 
                {
                const str = this.userAuthStringResult;
                const replacement = "1";
                const replaced = str.substring(indexes[0], indexes[i])+replacement+str.substring(indexes[i] + 1)
                this.userAuthStringResult = replaced; 
                }
            }
            if(compareAuth.includes(17))
            {
                const sourceStr = this.userAuthString.SurveyCreator;
                const searchStr = '1';
                const indexes = [...sourceStr.matchAll(new RegExp(searchStr, 'gi'))].map(a => a.index);
                for (let i = 0; i < indexes.length; i++) 
                {
                const str = this.userAuthStringResult;
                const replacement = "1";
                const replaced = str.substring(indexes[0], indexes[i])+replacement+str.substring(indexes[i] + 1)
                this.userAuthStringResult = replaced; 
                }
            }
            if(compareAuth.includes(18))
            {
                const sourceStr = this.userAuthString.SurveyManager;
                const searchStr = '1';
                const indexes = [...sourceStr.matchAll(new RegExp(searchStr, 'gi'))].map(a => a.index);
                for (let i = 0; i < indexes.length; i++) 
                {
                const str = this.userAuthStringResult;
                const replacement = "1";
                const replaced = str.substring(indexes[0], indexes[i])+replacement+str.substring(indexes[i] + 1)
                this.userAuthStringResult = replaced; 
                }
            }
            if(compareAuth==[])
            {
                this.userAuthStringResult = "000000000000000000000000000000000000000000000000000000000"
            }
            this.userDetails.auth_string = this.encrypt(this.userAuthStringResult, this.userDetails.seed)
        },
        getNominationsData() {
            api
            .get(`survey-assignments/make-nomination/${this.passedRouteParams.surveyAssignmentID}`)
            .then((response) => {
                this.nominationList = response.data
                this.relationshipObj.submittedStatus = this.nominationList[0].submitted_status
                this.relationshipObj.initialDeadlineDate = this.nominationList[0].initial_deadline_date
                this.relationshipObj.nominationsMade = this.nominationList[0].nominations_made
                this.relationshipObj.recommendedNumberOfNominations = this.nominationList[0].recommended_number_of_nominations
                this.relationshipObj.respondents = this.nominationList[0].respondents
                this.relationshipObj.enoughRespondentsEligibleForRent = this.nominationList[0].enough_respondents_eligible_for_report
                this.relationshipObj.launch_date = this.nominationList[0].launch_date
                this.relationshipObj.survey_reminder_date = this.nominationList[0].survey_reminder_date
                this.relationshipObj.initial_deadline_date = this.nominationList[0].initial_deadline_date
                this.relationshipObj.final_deadline_date = this.nominationList[0].final_deadline_date

                // shared report 
                if(this.nominationList[0].coach_access_granted == 1) {
                    this.isSharedReportWithCoachCheck = true
                    this.chosenRadioWithCoach = 1
                    this.isSharedReportWithCoachLabel = true
                } else {
                    this.isSharedReportWithCoachCheck = false
                    this.chosenRadioWithCoach = 0
                    this.isSharedReportWithCoachLabel = false
                }

                if(this.nominationList[0].coach_group_access_granted == 1) {
                    this.isSharedReportWithCoachGroupCheck = true
                    this.chosenRadioWithCoachGroup = 1
                    this.isSharedReportWithCoachGroupLabel = true
                } else {
                    this.isSharedReportWithCoachGroupCheck = false
                    this.chosenRadioWithCoachGroup = 0
                    this.isSharedReportWithCoachGroupLabel = false
                }

                if(this.nominationList[0].hr_access_granted == 1) {
                    this.isSharedReportWithHRCheck = true
                    this.chosenRadioWithHR = 1
                    this.isSharedReportWithHRLabel = true
                } else {
                    this.isSharedReportWithHRCheck = false
                    this.chosenRadioWithHR = 0
                    this.isSharedReportWithHRLabel = false
                }
                // end of shared report

                // check if reach the recommended number of nominations
                if(this.nominationList[0].number_of_nominations >= this.nominationList[0].recommended_number_of_nominations) {
                    this.isReachRecommendedNumberOfNominations = false
                }

                // check if reach the max number of nominations
                if(this.nominationList[0].number_of_nominations == null || this.nominationList[0].max_number_of_nominations == null) {
                    this.isReachMaxNumberOfNominations = true
                }
                else if(this.nominationList[0].number_of_nominations >= this.nominationList[0].max_number_of_nominations) {
                    this.isReachMaxNumberOfNominations = false
                }
            })
        },  
        getRelationships() {
            api
            .get(`relationships`)
            .then((response) => {
                this.relationshipList = response.data
            })
        },  
        getNominees() {
            api
            .get(`survey-assignments/nominees/${this.passedRouteParams.surveyAssignmentID}`)
            .then((response) => {
                this.nomineesList = response.data
                // console.log(this.nomineesList);
            })
        },  
        // check hr_report tag_type if existing in tag for hide/show shared reports
        getHrReportTag() {
            api
            .get(`survey-assignments/tag/hr_report/${this.passedRouteParams.surveyAssignmentID}`)
            .then((response) => {
                const res = response.data
                if(res == 'no_result') return this.isHrReportHasTag = false
                this.isHrReportHasTag = true
            })
        },  
        // check coach_group_report tag_type if existing in tag for hide/show shared reports
        getCoachGroupReportTag() {
            api
            .get(`survey-assignments/tag/coach_group_report/${this.passedRouteParams.surveyAssignmentID}`)
            .then((response) => {
                const res = response.data
                if(res == 'no_result') return this.isCoachGroupReportHasTag = false
                this.isCoachGroupReportHasTag = true
            })
        },  
        // check coach_report / disable_coach_sharing tag_type if existing in tag for hide/show shared reports
        getCoachReportTag() {
            api
            .get(`survey-assignments/tag/disable_coach_sharing/${this.passedRouteParams.surveyAssignmentID}`)
            .then((response) => {
                const res = response.data
                // reverse condition is in the html see the code above
                if(res == 'no_result') return this.isCoachReportHasTag = false
                this.isCoachReportHasTag = true
            })
        },  

        makeNomination() {
            this.isMakeNomination = true
            this.isMakeNominationButton = false
        },
        cancelNomination() {
            this.isMakeNominationButton = true
            this.isMakeNomination = false
        },

        openSharedReportWithCoach() {
            this.isSharedReportWithCoach = false
        },
        cancelSharedReportWithCoach() {   
            this.isSharedReportWithCoach = true
        },
        updateSharedReportWithCoach() {
            const data = {
                'whoAccess' : 'coach_access_granted',
                'accessValue' : this.chosenRadioWithCoach,
            }
            this.updateSharedReport(data)
        },

        openSharedReportWithCoachGroup() {
            this.isSharedReportWithCoachGroup = false
        },
        cancelSharedReportWithCoachGroup() {   
            this.isSharedReportWithCoachGroup = true
        },
        updateSharedReportWithCoachGroup() {
            const data = {
                'whoAccess' : 'coach_group_access_granted',
                'accessValue' : this.chosenRadioWithCoachGroup,
            }
            this.updateSharedReport(data)
        },

        openSharedReportWithHR() {
            this.isSharedReportWithHR = false
        },
        cancelSharedReportWithHR() {   
            this.isSharedReportWithHR = true
        },
        updateSharedReportWithHR() {
             const data = {
                'whoAccess' : 'hr_access_granted',
                'accessValue' : this.chosenRadioWithHR,
            }
            this.updateSharedReport(data)
        },

        //update shared report function
        updateSharedReport(data) {
            api
                .put(`survey-assignment/shared-report/${this.passedRouteParams.surveyAssignmentID}`, data)
                .then((res) => {
                    if (res.status) {
                        this.getNominationsData()
                        flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', "Successfully Updated!")
                    }
                })
                .catch((e) => {
                    flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', e.message)
                })
        },
        //add nomination
        addNomination() {
            if(this.passedRouteParams.iterationID == 0) {
                return this.$flashMessage.show({
                    html: `<div style="background-color: ${this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820' }; width:100%;">
                        <div style="position: absolute; right:13px;"><span style="color: #000;font-size: 28px;font-weight: bold;">&times;</span></div>
                        <p style="margin-left:1rem; margin-right:1rem; margin-top:2rem; color: ${this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff'};">
                            Oops! That didn't go to plan. Please email your own name, program and email address to help@talentsage.com. We'll review it and let you know when it's fine to continue nominating.
                        </p>
                    </div>`,
                    clickable: true,
                    time: 10000000000
                })
            }

            if(this.nomineeRelationship == '' || this.nomineeRelationship == undefined) {
                return flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', "Please select a Relationship")
            }
            else if(this.nomineeName == '' || this.nomineeName == undefined) {
                return flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', "Name is required")
            }
            else if(!mailFormat.test(this.nomineeEmail)) {
                return flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', "Please enter a valid email address")
            }  
            else if(this.nomineeMessage == '' || this.nomineeMessage == undefined) {
                return flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', "Personal Message is required")
            }   

            this.isDisabledButton = true
            this.userDetails.seed = this.randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
            this.getAuthString()

            if(this.passedRouteParams.recipientEmail == this.nomineeEmail) {
                this.isDisabledButton = false
                return flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', "You cannot nominate yourself.")
            }

            api
            .get(`survey-assignments/parent/${this.passedRouteParams.surveyAssignmentID}/email/${this.nomineeEmail}`)
            .then((response) => {

                if(response.data.message == 'exist') {
                    this.isDisabledButton = false
                    return flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', `${this.nomineeEmail} is already nominated for this survey.`)
                }

                // check email if already exist
                api
                .get(`individuals-check-email-exist/${this.nomineeEmail}`)
                .then((response) => {
                    this.isEmailExist = response.data.message == 'exist' ? 'yes' : 'no'

                    // get subject and body for sending an email in making a nomination
                    api
                    .get(`get-email-template-by-template-type/Nominee survey launch/org/${this.passedRouteParams.orgID}/suborg/${this.passedRouteParams.suborgID}/program/${this.passedRouteParams.programID}`)
                    .then((response) => {

                        // console.log(response.data);

                        this.subject = response.data.subject
                        this.email_body = response.data.email_body
                        this.email_template_id = response.data.email_template_id

                        // email tokens - get single data
                        api
                            .get(`survey-assignments/${this.passedRouteParams.surveyAssignmentID}`)
                            .then((response) => {
                                let res = response.data;
                                
                                //emailTokens: {result: {key: value}}
                                this.tokens.recipient_email = res.recipient_email
                                const data = {result: {header_bg_color: res.header_bg_color, brand_path: res.brand_path, first_name: res.first_name,email:res.email,recipient_email: res.recipient_email,website_url: res.website_url,nominee_salutation: res.nominee_salutation,nominee_message: res.nominee_message,program_name: res.program_name,suborg_name: res.suborg_name,website_sender_email: res.website_sender_email,website_terms_url: res.website_terms_url,website_privacy_url: res.website_privacy_url,website_contact_email: res.website_contact_email,survey_close_date: res.survey_close_date,days_until_survey_close_date: res.days_until_survey_close_date,survey_template_name: res.survey_template_name,survey_description: res.survey_description,user_full_name: res.user_full_name,survey_subject_first_name: res.survey_subject_first_name,survey_subject_full_name: res.survey_subject_full_name,iteration_name: res.iteration_name}}
                                this.tokens = {...data.result}

                                const nominee_salutation = this.nomineeName
                                const nominee_message = this.nomineeMessage
                                const nominee_email = this.nomineeEmail

                                let num = 1;
                                const encryptedID = this.encrypt(num.toString(), "seed")
                                const password_link = "<a href =" + this.tokens.website_url+'#/set_password?ind_id='+encodeURIComponent(encryptedID) + "> Click Here </a>"

                                const convertedSubject = replaceTokensForNomination(this.subject, this.tokens, password_link, nominee_salutation, nominee_message, nominee_email);
                                const convertedBody = replaceTokensForNomination(this.email_body, this.tokens, password_link, nominee_salutation, nominee_message, nominee_email);

                                this.rawSubject = convertedSubject
                                this.rawEmailBody = convertedBody

                                const datas = {
                                    "roles" : this.userData.roles,
                                    "nominee_salutation" : this.nomineeName,
                                    "nominee_message" : this.nomineeMessage,
                                    "recipient_email" : this.nomineeEmail,
                                    "relationship_id" : this.nomineeRelationship,
                                    "parent_survey_assignment_id" : this.passedRouteParams.surveyAssignmentID,
                                    "survey_template_id" : this.passedRouteParams.surveyTemplateID,
                                    "survey_template_association_id" : this.passedRouteParams.surveyTemplateAssociationID,
                                    "org_id" : this.passedRouteParams.orgID,
                                    "suborg_id" : this.passedRouteParams.suborgID,
                                    "program_id" : this.passedRouteParams.programID,
                                    "iteration_id" : this.passedRouteParams.iterationID,
                                    "stream_id" : this.passedRouteParams.streamID,
                                    "group_id" : this.passedRouteParams.groupID,
                                    "created_by" : this.passedRouteParams.indID,
                                    "modified_by" : this.passedRouteParams.indID,
                                    "seed" : this.userDetails.seed,
                                    "auth_string" : this.userDetails.auth_string,
                                    "send_from": this.tokens.website_sender_email,
                                    "send_to": this.nomineeEmail,
                                    "send_cc": "",
                                    "send_bcc": "",
                                    "subject": this.rawSubject,
                                    "body": this.rawEmailBody,
                                    "email_template_id" : this.email_template_id,
                                    "is_email_exist" : this.isEmailExist,
                                    "survey_name" : this.passedRouteParams.surveyName,
                                    "org_name" : this.orgName
                                }
                                // console.log(datas);

                                // insert in individual, survey_assignment, send email then send an email using clicksend
                                api
                                    .post(`individuals-make-nomination`, datas)
                                    .then((resData) => {
                                        if(resData.data.status == "failed") {
                                            this.isDisabledButton = false
                                            return flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color, resData.data.message)
                                        }

                                        const encryptedID = this.encrypt(resData.data.ind_id.toString(), "seed")
                                        const password_link = "<a href =" + this.tokens.website_url+'#/set_password?ind_id='+encodeURIComponent(encryptedID) + "> Click Here </a>"

                                        const convertedSubject = replaceTokensForNomination(this.subject, this.tokens, password_link, nominee_salutation, nominee_message, nominee_email);
                                        const convertedBody = replaceTokensForNomination(this.email_body, this.tokens, password_link, nominee_salutation, nominee_message, nominee_email);

                                        this.rawSubject = convertedSubject
                                        this.rawEmailBody = convertedBody

                                        const dataSendEmail = {
                                            "org_id" : this.passedRouteParams.orgID,
                                            "suborg_id" : this.passedRouteParams.suborgID,
                                            "send_from": this.tokens.website_sender_email,
                                            "send_to": this.nomineeEmail,
                                            "send_cc": "",
                                            "send_bcc": "",
                                            "subject": this.rawSubject,
                                            "body": this.rawEmailBody,
                                            "ind_id" : resData.data.ind_id,
                                            "email_template_id" : this.email_template_id,
                                            "survey_assignment_id" : resData.data.survey_assignment_id
                                        }

                                        // console.log(dataSendEmail);

                                        // send email
                                        api
                                            .post('sendemail', dataSendEmail)
                                            .then((res) => {
                                                this.nomineeName = ''
                                                this.nomineeEmail = ''
                                                this.nomineeMessage = ''
                                                this.nomineeRelationship = ''

                                                this.isMakeNominationButton = true
                                                this.isMakeNomination = false
                                                
                                                this.getNominationsData()
                                                this.getRelationships()

                                                setTimeout(this.getNominees, 2000)
                                                this.toggle = true
                                                flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color, res.data.message)
                                                this.isDisabledButton = false
                                            })
                                            .catch((e) => {
                                                flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color, e.message)
                                            })

                                        setTimeout(this.getNominees, 5000)
                                        
                                        
                                    })
                                    .catch((e) => {
                                        this.isDisabledButton = false
                                        flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', e.message)
                                    })

                        })
                    })
                })
                
            });
        },
        closeModal() {
            this.isEditRelationship = false
            this.isEditEmail = false
        },
        // open the relationship modal
        editRelationship(survey_assignment_id, relationship_name, relationship_id) {
            this.surveyAssignmentIDModal = survey_assignment_id
            this.relationshipNameModal = relationship_name
            this.relationshipIdModal = relationship_id
            this.isEditRelationship = true

            // if(email_status == 'Valid') {
            //     this.relationshipNameModal = name
            //     this.isEditRelationship = true
            // }
            // else {
            //     this.emailModal = email
            //     this.isEditEmail = true
            // }
        },
        // open the email modal
        editEmail(oldemail, survey_assignment_id, email) {
            this.oldemail = oldemail
            this.surveyAssignmentIDModal = survey_assignment_id
            this.emailModal = email
            this.isEditEmail = true
        },
        selectedRelationship(e) {
            this.selectedRelationshipIdModel = e.target.value
        },
        updateRelationship() {
            const data = {
                'old_relationship_id' : this.relationshipIdModal,
                'new_relationship_id' : this.selectedRelationshipIdModel = this.selectedRelationshipIdModel == '' ? this.relationshipIdModal : this.selectedRelationshipIdModel,
                "parent_survey_assignment_id" : this.passedRouteParams.surveyAssignmentID,
                'relationship_id' : this.selectedRelationshipIdModel = this.selectedRelationshipIdModel == '' ? this.relationshipIdModal : this.selectedRelationshipIdModel //for update in r360_raw
            }

            api
                .put(`r360-relationship/nomination-survey-assignment/${this.surveyAssignmentIDModal}/survey-assignment/${this.passedRouteParams.surveyAssignmentID}`, data)
                .then((res) => {
                    console.log(res);
                })
                .catch((e) => {
                    flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', e.message)
                })

            api
                .put(`survey-assignment/relationship/${this.surveyAssignmentIDModal}`, data)
                .then((res) => {
                    if (res.status) {
                        this.getNominees()
                        this.isEditRelationship = false
                        flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', "Relationship has been updated!")
                    }
                })
                .catch((e) => {
                    flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', e.message)
                })
        },
        // update the email on modal 
        updateEmail() {
            if(this.passedRouteParams.recipientEmail == this.emailModal) {
                this.isDisabledButton = false
                return flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', "You cannot update the email to your own email.")
            }

            if(!mailFormat.test(this.emailModal)) {
                return flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', "Please enter a valid email address")
            }  

            // check email first if already exist
            api
                .get(`individuals-check-email-exist/${this.emailModal}`)
                .then((response) => {

                    this.isUpdateEmailExist = response.data.message == "exist" ? "yes" : "no"

                    // get subject and body for sending an email in making a nomination
                    api
                    .get(`get-email-template-by-template-type/Nominee survey launch/org/${this.passedRouteParams.orgID}/suborg/${this.passedRouteParams.suborgID}/program/${this.passedRouteParams.programID}`)
                    .then((response) => {

                    this.subject = response.data.subject
                    this.email_body = response.data.email_body
                    this.email_template_id = response.data.email_template_id

                    // email tokens - get single data
                    api
                        .get(`survey-assignments/${this.surveyAssignmentIDModal}`)
                        .then((response) => {
                        let res = response.data;

                        // console.log(res);
                        
                        //emailTokens: {result: {key: value}}
                        this.tokens.recipient_email = res.recipient_email
                        const data = {result: {header_bg_color: res.header_bg_color, brand_path: res.brand_path, first_name: res.first_name,email:res.email,recipient_email: res.recipient_email,website_url: res.website_url,nominee_salutation: res.nominee_salutation,nominee_message: res.nominee_message,program_name: res.program_name,suborg_name: res.suborg_name,website_sender_email: res.website_sender_email,website_terms_url: res.website_terms_url,website_privacy_url: res.website_privacy_url,website_contact_email: res.website_contact_email,survey_close_date: res.survey_close_date,days_until_survey_close_date: res.days_until_survey_close_date,survey_template_name: res.survey_template_name,survey_description: res.survey_description,user_full_name: res.user_full_name,survey_subject_first_name: res.survey_subject_first_name,survey_subject_full_name: res.survey_subject_full_name,iteration_name: res.iteration_name}}
                        this.tokens = {...data.result}
                        api.get(`individuals/email/${this.oldemail.toString()}`)
                            .then((response) => {
                                let res = response.data
                                let password_link = ""

                                if(res.logged_in === 0){
                                    const encryptedID = this.encrypt(res.ind_id.toString(), "seed")
                                    password_link = "<a href =" + this.tokens.website_url+'#/set_password?ind_id='+encodeURIComponent(encryptedID) + "> Click Here </a>"
                                }
                                else if (res.logged_in === 1) {
                                    password_link = "<a href =" + this.tokens.website_url + "> Click Here </a>"
                                }

                                const convertedSubject = replaceTokensForUpdateEmail(this.subject, this.tokens, password_link, this.emailModal);
                                const convertedBody = replaceTokensForUpdateEmail(this.email_body, this.tokens, password_link, this.emailModal);

                                this.rawSubject = convertedSubject
                                this.rawEmailBody = convertedBody

                                const datas = {
                                    "org_id" : this.passedRouteParams.orgID,
                                    "suborg_id" : this.passedRouteParams.suborgID,
                                    "send_from": this.tokens.website_sender_email,
                                    "send_to": this.emailModal,
                                    "send_cc": "",
                                    "send_bcc": "",
                                    "subject": this.rawSubject,
                                    "body": this.rawEmailBody,
                                    "ind_id" : res.ind_id, //ind_id of the survey
                                    "email_template_id" : this.email_template_id,
                                    "email" : this.emailModal,
                                    "survey_assignment_id" : this.surveyAssignmentIDModal,
                                    "isUpdateEmailExist" : this.isUpdateEmailExist,
                                    "login_ind_id" : this.userData.ind_id,
                                }

                                // if send email was success, update the email
                                api
                                .post('sendemail', datas)
                                .then((res) => {
                                    // console.log(res);
                                    flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color, res.data.message)
                                    if(res.data.type == "success") {
                                        api
                                            .put(`survey-assignment/email/${this.surveyAssignmentIDModal}`, datas)
                                            .then((res) => {
                                                if (res.status) {
                                                    this.getNominees()
                                                    this.isEditEmail = false
                                                    // console.log(res.data);
                                                    // flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', res.data.message)
                                                }
                                            })
                                            .catch((e) => {
                                                console.log(e.message);
                                                // flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', e.message)
                                            })
                                    }
                                })
                                .catch((e) => {
                                    flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color, e.message)
                                })

                        })
                    })

                })
        
            })
        
        },
        readDate(data) {
            const humanReadableDateTime = new Date(data).toLocaleString();
            return humanReadableDateTime;
        },
       
    }
}
</script>

<style scoped>
.nominationSection {
  width: 45vw;
}
.font-size-12 {
    font-size: 12px;
}
.font-size-13 {
    font-size: 13px;
}
.font-size-14 {
    font-size: 14px;
}
.font-bold {
    font-weight: bold;
}
.mt-1 {
    margin-top: 1rem;
}
.text-decoration-none {
    text-decoration: none;
}
.mt-2 {
    margin-top: 2rem;
}
.mt-0 {
    margin-top: 0px;
}
.mb-1 {
    margin-bottom: 1rem;
}
.mb-0 {
    margin-bottom: 0px;
}
.ml-5px {
    margin-left: 5px;
}
.d-flex {
    display: flex;
}
.flex-column {
    flex-direction: column;
}
.justify-space-between {
    justify-content: space-between;
}
.align-items-center {
    align-items: center;
}
.w-100 {
    width: 100%;
}
.w-11 {
    width: 11%;
}
.w-4 {
    width: 4%;
}
.bg-danger {
    background-color: #DC3738;
}
.bg-success {
    background-color: rgb(237, 247, 237);
}
.bg-warning {
    background-color: rgb(255, 244, 229);
}
.text-warning {
    color: #E9A928;
}
.text-gray {
    color:#54575B;
}
.text-blue {
    color:#40A4D9
}
.text-success {
    color: #B2C225;
}
.text-danger {
    color: #DC3738;
}
.text-right {
    text-align: right;
}
.p-1 {
    padding: 1rem;
}
.cursor-pointer {
    cursor: pointer;
}
.plainBox {
  padding-left: .5rem;
  padding-right: .5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
}
.makeNominationBox {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  border-top: 4px solid rgb(185, 22, 10);
  box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
}
.showHideNomination {
  padding: 10px;
  border: 1px solid #0e5071;
  background-color: #0e5071;
  color: #fff;
  display: flex;
  justify-content: space-between;
}
.input{
    outline: 0;
    border-width: 0 0 1px;
    border-color: grey;
    padding: 2px 5px;
    margin: 10px 0px;
    font-family: Arial, Helvetica, sans-serif;
}

.modal {
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0,0,0); /* Fallback color */
  background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
}

/* Modal Content/Box */
.modal-content {
  background-color: #fefefe;
  margin: 15% auto; /* 15% from the top and centered */
  padding-left: 15px;
  padding-right: 15px;
  border: 1px solid #888;
  width: 25%; /* Could be more or less, depending on screen size */
  border-radius: 5px;
}

/* The Close Button */
.close {
  color: #aaa;
  font-size: 28px;
  font-weight: bold;
}
.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}
input, select, option, textarea {
  border: 1px solid grey;
}
</style>
