<script setup>
  import api from '../api/api'
  import DescriptionInline from './DescriptionInline.vue';
  import ButtonSubmit from './ButtonSubmit.vue'
</script>

<template>
  <div class="brandSection">

    <h2 class>{{ brandName }}</h2>
    <h4 style="opacity: 0.8">Organization : {{ orgName }}</h4>

    <div style="display:flex; flex-direction:column">
      <input v-model="searchData" placeholder="Enter the brand name or sub-org and click 'Find' " class="searchInput" ref="search" />
      <span style="font-size: 12px; color: grey; margin-bottom: 20px; padding-left: 5px;">Click the 'Find' button to see a list of all brands available</span>
    </div>

    <div class="d-flex">
      <div>
        <ButtonSubmit label="Find" @click="searchResult" />
      </div>
      <div class="ml-1">
        <ButtonSubmit @click="sendAddProps('add')" label="Add" />
      </div>
    </div>

    <br>

    <!-- pagination -->
    <div v-show="isPagination" class="pagination">
        <div class="d-flex">
            <div>
                <button type="button" :disabled="isInFirstPage" @click="page--"> Previous </button>
            </div>

            <div v-for="pageNumber in pageLength ? pages.slice(page-1, page+5) : pages" :key="pageNumber" @click="page = pageNumber">
                <button style="background-color:#0e5071; color:white;" v-if="pageNumber == page">{{pageNumber}}</button>
                <button v-else>{{pageNumber}}</button>
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
        <th>Brand Name</th>
        <th>Sub organization</th>
        <th>Font</th>
        <th>Pacifier Text (Please use HTML)</th>
        <th>Font size</th>
        <th>Font text size</th>
        <th>Max search results</th>
        <th>Action</th>
      </tr>
      <tr v-for="(data, i) in displayBrands" :key="data.brand_id">
        <td class="text-right">{{ perPage *(page-1)+i+1 }}</td>
        <td>{{ data.suborg_name }}</td>
        <td>{{ data.brand_name }}</td>
        <td>{{ data.font }}</td>
        <td>{{ data.pacifier_text }}</td>
        <td>{{ data.font_title_size }}</td>
        <td>{{ data.font_text_size }}</td>
        <td>{{ data.max_search_results }}</td>
        <td>
            <button @click="sendUpdateProps('update', data.pacifier_text, data.flash_text_color, data.button_text_color, data.font_title_color, data.header_bg_color, data.header_text_color, data.header_text_size, data.footer_bg_color, data.footer_text_color, data.footer_text_size, data.brand_id, data.brand_name, data.font, data.font_title_size, data.font_text_size, data.font_text_color, data.main_color1, data.main_color2, data.main_color3, data.accent_color1, data.logo_path, data.website_url, data.website_sender_email, data.website_contact_email, data.website_terms_url, data.website_privacy_url, data.max_search_results, data.suborg_id )">
                Edit <font-awesome-icon icon="pencil" />
            </button>
        </td>
      </tr>
    </table>
    <p class="font-size-14 text-center" v-show="noResultFound">No result found.</p>
  </div>
</template>

<script>
export default {
  components: [DescriptionInline, ButtonSubmit],
  props: ['userData'],
  data: () => ({
    page: 1,
    perPage: 0,
    pages: [],	
    isPagination : false,
    resultsFound : '',
    filteredBrandList: [],
    searchData: "",
    noResultFound : false,
    orgName : '',
    brandName : '',
  }),
  mounted() {
    this.brandName = this.userData.brandData.brand_name
    api
      .get(`organizations/${this.userData.org_id}`)
      .then((response) => ( this.orgName = response.data.org_name ))

    api
      .get(`brands-max-limit/org/${this.userData.org_id}`)
      .then((response) => {
        this.perPage = response.data.max_search_results
        if(this.perPage == undefined) this.perPage = 25
      })
  },
  methods: {
    paginate (surveyLists) {
        const from = (this.page * this.perPage) - this.perPage;
        const to = (this.page * this.perPage);
        return  surveyLists.slice(from, to);
    },
    searchResult() {
      this.pages = []
      api
      .get(`brandswithsuborg/${this.userData.org_id}`)
      .then((response) => {
        this.pages = []
        this.page = 1
        const res = response.data

        this.filteredBrandList = res.filter((data) => {
          this.noResultFound = false

          if (
            data.suborg_name == null ||
            data.suborg_name == "" 
          ) {
            return (
              data.brand_name.toLowerCase().includes(this.searchData.toLowerCase())
            );
          } else {
            return (
              data.suborg_name.toLowerCase().includes(this.searchData.toLowerCase()) ||
              data.brand_name.toLowerCase().includes(this.searchData.toLowerCase())
            );
          }
        });

        this.resultsFound = this.filteredBrandList.length

        if(this.filteredBrandList.length == 0) { 
            this.noResultFound = true
            this.isPagination = false
            return
        }

        let numberOfPages = Math.ceil(this.filteredBrandList.length / this.perPage);
        for (let index = 1; index <= numberOfPages; index++) {
          this.pages.push(index);
        }
        this.isPagination = true
        
      })
    },
    sendAddProps(status) {
      const data = { 'status' : status }
      this.$router.push({ name: "manage-brand-create-edit", params: { data: JSON.stringify(data) } });
    },
    sendUpdateProps(status, pacifier_text, flash_text_color, button_text_color, font_title_color, header_bg_color, header_text_color, header_text_size, footer_bg_color, footer_text_color, footer_text_size, brand_id, brand_name, font, font_title_size, font_text_size, font_text_color, main_color1, main_color2, main_color3, accent_color1, logo_path, website_url, website_sender_email, website_contact_email, website_terms_url, website_privacy_url, max_search_results, suborg_id ) {
      const data = { 
        'status' : status,
        'pacifier_text' : pacifier_text,
        'flash_text_color' : flash_text_color,
        'button_text_color' : button_text_color,
        'font_title_color' : font_title_color,
        'header_bg_color' : header_bg_color,
        'header_text_color' : header_text_color,
        'header_text_size' : header_text_size,
        'footer_bg_color' : footer_bg_color,
        'footer_text_color' : footer_text_color,
        'footer_text_size' : footer_text_size,
        'brand_id' : brand_id,
        'brand_name' : brand_name,
        'font' : font,
        'font_title_size' : font_title_size,
        'font_text_size' : font_text_size,
        'font_text_color' : font_text_color,
        'main_color1' : main_color1,
        'main_color2' : main_color2,
        'main_color3' : main_color3,
        'accent_color1' : accent_color1,
        'logo_path' : logo_path,
        'website_url' : website_url,
        'website_sender_email' : website_sender_email,
        'website_contact_email' : website_contact_email,
        'website_terms_url' : website_terms_url,
        'website_privacy_url' : website_privacy_url,
        'max_search_results' : max_search_results,
        'suborg_id' : suborg_id,
      }
      this.$router.push({ name: "manage-brand-create-edit", params: { data: JSON.stringify(data) } });
    },
   
  },
  computed: {
    displayBrands () {
        return this.paginate(this.filteredBrandList); 
    },
    isInFirstPage () {
      return this.page == 1
    },
    isInLastPage() {
      return this.page >= this.pages.length
    },
    pageLength() {
      return this.pages.length > 5
    },
	},
}
</script>

<style scoped>
.brandSection {
  width: 90vw;
}
#table {
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

#table td,
#table th {
  border: 1px solid #ddd;
  padding: 8px;
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
}
.ml-1 {
  margin-left: 1rem;
}
.mb-1 {
  margin-bottom: 1rem;
}
.font-size-14 {
    font-size: 14px;
}
.text-center {
    text-align: center;
}
.searchInput {
  outline: 0;
  border-width: 0 0 1px;
  border-color: grey;
  padding: 2px 5px;
  /* margin: 10px 0px; */
  font-size: 14px;
}
.pagination {
    display:flex; 
    justify-content:space-between; 
    align-items:center; 
    margin-bottom: .5rem; 
    margin-left:3px; 
    margin-right:3px;
}
.d-flex {
  display: flex;
}
.font-size-14 {
    font-size: 14px;
}
.text-right {
    text-align:right !important;
}
input, select, option, textarea {
  border: 1px solid grey;
}
</style>
