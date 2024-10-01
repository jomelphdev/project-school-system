<script setup>
import api from '../api/api'
import ButtonSubmit from './ButtonSubmit.vue'
import ButtonCancel from './ButtonCancel.vue'
import DescriptionInline from './DescriptionInline.vue';
import Header from './Header.vue';
import {flashMessage} from "../functions.js";
</script>

<template>
    <div class="brandSection">  

        <!-- add and update form -->
        <div>
            <Header v-if="status == 'add' " label="Add Brand"></Header>
            <Header v-else label="Edit Brand"></Header>
            <form class="formBox">
                <label><DescriptionInline label="Organization " /></label>
                <input type="text" disabled class="input" v-model="orgName">

                <label><DescriptionInline label="Select sub-organization " /></label>
                <select class="input" v-model="chosenSubOrg">
                    <option value="0">Select sub-organization</option>
                    <option
                    v-for="suborganization in subOrgList"
                    :value="suborganization.suborg_id"
                    :key="suborganization.suborg_id"
                    :selected="suborganization.suborg_id == chosenSubOrg"
                    >
                    {{ suborganization.suborg_name }}
                    </option>
                </select>

                <label><DescriptionInline label="Brand name* " /></label>
                <input type="text" class="input" v-model="brandName">

                <label><DescriptionInline label="Font* " /></label>
                <select class="input" v-model="font">
                    <option disabled>Select Font</option>
                    <option :selected="font == 'Open Sans'" value="Open Sans">Open Sans</option>
                    <option :selected="font == 'Arial'" value="Arial">Arial</option>
                    <option :selected="font == 'Verdana'" value="Verdana">Verdana</option>
                    <option :selected="font == 'Helvetica'" value="Helvetica">Helvetica</option>
                    <option :selected="font == 'Tahoma'" value="Tahoma">Tahoma</option>  
                    <option :selected="font == 'Trebuchet MS'" value="Trebuchet MS">Trebuchet MS</option>
                    <option :selected="font == 'Times New Roman'" value="Times New Roman">Times New Roman</option>
                    <option :selected="font == 'Georgia'" value="Georgia">Georgia</option>
                    <option :selected="font == 'Garamond'" value="Garamond">Garamond</option>
                    <option :selected="font == 'Courier New'" value="Courier New">Courier New</option>
                    <option :selected="font == 'Brush Script MT'" value="Brush Script MT">Brush Script MT</option>
                </select>

                <label for="pacifierText">Pacifier Text (Please use HTML)</label>
                <textarea id="pacifierText" class="input" v-model="pacifierText" rows="4"></textarea>

                <label><DescriptionInline label="Font title size(px)* " /></label>
                <input type="number" class="input" v-model="fontTitleSize">

                <label><DescriptionInline label="Font title color" /></label>
                <input type="text" class="input" v-model="fontTitleColor">

                <label><DescriptionInline label="Font text size(px)* " /></label>
                <input type="number" class="input" v-model="fontTextSize">

                <label><DescriptionInline label="Font text color" /></label>
                <input type="text" class="input" v-model="fontTextColor">

                <label><DescriptionInline label="Main color 1 " /></label>
                <input type="text" class="input" v-model="mainColor1">

                <label><DescriptionInline label="Main color 2 " /></label>
                <input type="text" class="input" v-model="mainColor2">

                <label><DescriptionInline label="Main color 3 " /></label>
                <input type="text" class="input" v-model="mainColor3">

                <label><DescriptionInline label="Accent color 1 " /></label>
                <input type="text" class="input" v-model="accentColor1">

                <label><DescriptionInline label="Button text color " /></label>
                <input type="text" class="input" v-model="buttonTextColor">

                <label><DescriptionInline label="Flash message text color " /></label>
                <input type="text" class="input" v-model="flashTextColor">

                <label><DescriptionInline label="Header background color " /></label>
                <input type="text" class="input" v-model="headerBgColor">

                <label><DescriptionInline label="Header text color " /></label>
                <input type="text" class="input" v-model="headerTextColor">

                <label><DescriptionInline label="Header text size " /></label>
                <input type="number" class="input" v-model="headerTextSize">

                <label><DescriptionInline label="Footer background color " /></label>
                <input type="text" class="input" v-model="footerBgColor">

                <label><DescriptionInline label="Footer text color " /></label>
                <input type="text" class="input" v-model="footerTextColor">

                <label><DescriptionInline label="Footer text size " /></label>
                <input type="number" class="input" v-model="footerTextSize">

                <label><DescriptionInline label="Website URL" /></label>
                <input type="text" class="input" v-model="websiteURL">

                <label><DescriptionInline label="Website sender email" /></label>
                <input type="text" class="input" v-model="websiteSenderEmail">

                <label><DescriptionInline label="Website contact email" /></label>
                <input type="text" class="input" v-model="websiteContactEmail">

                <label><DescriptionInline label="Website terms URL" /></label>
                <input type="text" class="input" v-model="websiteTermsURL">

                <label><DescriptionInline label="Website privacy URL" /></label>
                <input type="text" class="input" v-model="websitePrivacyURL">

                <label><DescriptionInline label="Max search results" /></label>
                <input type="number" min="20" class="input" v-model="maxSearchResults"><br>

                <div>
                    <ButtonSubmit v-if="status == 'add' " @click.prevent="addBrand" label="Add"/>
                    <ButtonSubmit v-else @click.prevent="updateBrand" label="Update" />
                    <ButtonCancel @click.prevent="goToBrand" label="Cancel"/>
                </div>


            </form>
        </div>

    </div>
</template>

<script>
export default {
    components: [ButtonSubmit, ButtonCancel, DescriptionInline, Header],
    props: ['userData', 'brandData'],
    data: () => ({
        passedDetails: [],
        status: '',
        brandID : '',
        brandName : '',
        font : '',
        fontTitleSize : '',
        pacifierText: '',
        fontTitleColor : '',
        fontTextSize : '',
        fontTextColor : '',
        buttonTextColor : '',
        flashTextColor : '',
        headerBgColor : '',
        headerTextColor : '',
        headerTextSize : null,
        footerBgColor : '',
        footerTextColor : '',
        footerTextSize : null,
        mainColor1 : '',
        mainColor2 : '',
        mainColor3 : '',
        accentColor1 : '',
        websiteURL : '',
        websiteSenderEmail : '',
        websiteContactEmail : '',
        websiteTermsURL : '',
        websitePrivacyURL : '',
        maxSearchResults : '',

        subOrgList: [],

        orgName : '',
        chosenSubOrg: 0,
    }),
    mounted() {

        this.passedDetails = JSON.parse(this.$route.params.data)
        this.status = this.passedDetails.status
        this.fontTitleColor = this.passedDetails.font_title_color
        this.buttonTextColor = this.passedDetails.button_text_color
        this.flashTextColor = this.passedDetails.flash_text_color
        this.headerBgColor = this.passedDetails.header_bg_color
        this.headerTextColor = this.passedDetails.header_text_color
        this.headerTextSize = this.passedDetails.header_text_size
        this.footerBgColor = this.passedDetails.footer_bg_color
        this.footerTextColor = this.passedDetails.footer_text_color
        this.footerTextSize = this.passedDetails.footer_text_size
        this.brandID = this.passedDetails.brand_id
        this.brandName = this.passedDetails.brand_name
        this.font = this.passedDetails.font
        this.fontTitleSize = this.passedDetails.font_title_size
        this.pacifierText = this.passedDetails.pacifier_text
        this.fontTextSize = this.passedDetails.font_text_size
        this.fontTextColor = this.passedDetails.font_text_color
        this.mainColor1 = this.passedDetails.main_color1
        this.mainColor2 = this.passedDetails.main_color2
        this.mainColor3 = this.passedDetails.main_color3
        this.accentColor1 = this.passedDetails.accent_color1
        this.websiteURL = this.passedDetails.website_url
        this.websiteSenderEmail = this.passedDetails.website_sender_email
        this.websiteContactEmail = this.passedDetails.website_contact_email
        this.websiteTermsURL = this.passedDetails.website_terms_url
        this.websitePrivacyURL = this.passedDetails.website_privacy_url
        this.maxSearchResults = this.passedDetails.max_search_results
        this.chosenSubOrg = this.passedDetails.suborg_id 

        api
            .get(`organizations/${this.userData.org_id}`)
            .then((response) => ( this.orgName = response.data.org_name ))

        api
            .get(`sub-organizations/${this.userData.org_id}`)
            .then((response) => ( this.subOrgList = response.data ))
    },
    methods: {
        // dynamic getting of data for add and edit
        getPostData() {
            const data = {
                'org_id' : this.userData.org_id,
                'suborg_id' : this.chosenSubOrg == undefined ? 0 : this.chosenSubOrg,
                'brand_name' : this.brandName,
                'font' : this.font,
                'pacifier_text' : this.pacifierText,
                'font_title_size' : this.fontTitleSize,
                'font_title_color' : this.fontTitleColor,
                'font_text_size' : this.fontTextSize,
                'font_text_color' : this.fontTextColor,
                'button_text_color' : this.buttonTextColor,
                'flash_text_color' : this.flashTextColor,
                'header_bg_color' : this.headerBgColor,
                'header_text_color' : this.headerTextColor,
                'header_text_size' : this.headerTextSize,
                'footer_bg_color' : this.footerBgColor,
                'footer_text_color' : this.footerTextColor,
                'footer_text_size' : this.footerTextSize,
                'main_color1' : this.mainColor1,
                'main_color2' : this.mainColor2,
                'main_color3' : this.mainColor3,
                'accent_color1' : this.accentColor1,
                'website_url' : this.websiteURL,
                'website_sender_email' : this.websiteSenderEmail,
                'website_contact_email' : this.websiteContactEmail,
                'website_terms_url' : this.websiteTermsURL,
                'website_privacy_url' : this.websitePrivacyURL,
                'max_search_results' : this.maxSearchResults,
                'created_by' : this.userData.ind_id,
                'modified_by' : this.userData.ind_id,
            }
            return data
        },
        addBrand() {
            const valid = this.formValidation()

            // process the add function
            if(valid) {
                const data = this.getPostData()

                api
                    .post('brands', data)
                    .then((res) => {
                        if (res.status) {
                            flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', "New Brand has been added")
                            this.$router.push("/manage-brand");
                        }
                    })
                    .catch((e) => {
                        flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', e.message)
                    })
            }

        },
        updateBrand() {
            const valid = this.formValidation()

            // process the add function
            if(valid) {
                const data = this.getPostData()

                api
                    .put(`brands/${this.brandID}`, data)
                    .then((res) => {
                        if (res.status) {
                            flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', "Brand has been updated")
                            this.$router.push("/manage-brand");
                        }
                    })
                    .catch((e) => {
                        flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', e.message)
                    })
            }
        },
        formValidation() {
            if(this.brandName == '' || this.brandName == undefined) return flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', "Brand name is required")
            else if(this.font == '' || this.font == undefined) return flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', "Font is required")
            else if(this.fontTitleSize == '' || this.fontTitleSize == undefined) return flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', "Font title size is required")
            else if(this.fontTextSize == '' || this.fontTextSize == undefined) return flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', "Font text size is required")
            else if(this.maxSearchResults < 20 && this.maxSearchResults != '') return flashMessage(this.$flashMessage, this.brandData.accent_color1 ? this.brandData.accent_color1 : '#F47820', this.brandData.flash_text_color ? this.brandData.flash_text_color : '#ffffff', "Max search result minimun is 20")
            return true
        },
        goToBrand() {
            this.$router.push("/manage-brand");
        }
    }
}
</script>

<style scoped>
.brandSection {
  width: 50vw;
}
input, select, option, textarea {
  border: 1px solid grey;
}
</style>
