<script setup>
import AdminLinkRouter from "./components/AdminLinkRouter.vue";
import Footer from "./components/FooterComponent.vue";
import store from "./store/store.js";
import ButtonSubmit from "../src/components/ButtonSubmit.vue";
import api from "./api/api";

//import api from "../src/api/api.js";
</script>

<template>
  <div class="app-container" style="">
    <FlashMessage time="3000" position="right top" strategy="single" />
    <header>
      <nav class="header-container">
        <div class="menu-wrapper" v-show="isLoggedIn">
          <h1 @click="openNavbar = !openNavbar" class="menu_button">
            <i class="fa-solid fa-bars"></i>
          </h1>
        </div>
        <div class="logo-container">
          <a class="unselectable">
            <img :src="logoPath" class="brand-logo" alt="Brand Logo" />
            <!-- <img
              v-if="showDefaultLogo"
              src='./assets/images/app_logo2.png'
              class="brand-logo"
              alt="Brand Logo"
            /> -->
          </a>
        </div>

        <div class="surveSubjectName">
          <div v-if="headerSubjectFullName === 'none'"></div>
          <div v-else-if="headerSubjectFullName !== ''">
            Survey for: {{ headerSubjectFullName }}
          </div>
        </div>

        <div class="user-welcome" v-if="isLoggedIn">
          <form class="form-inline">
            <div>
              Welcome!
              <span v-if="userData.first_name == null"
                >{{ userData.last_name }}
              </span>
              <span v-if="userData.last_name == null">
                {{ userData.first_name }}
              </span>
              <span v-if="userData.first_name != null && userData.last_name != null">
                {{ userData.first_name }} {{ userData.last_name }}
              </span>
              ({{ userData.email }})
            </div>
          </form>
          <!-- <form class="form-inline-login" v-else>
            <button class="btn">
              <i
                class="icon-color fa-regular fa-question-circle"
                aria-hidden="true"
              ></i>
            </button>
          </form> -->
          <div
            id="logout-menu"
            v-show="toggle"
            style="color: #54575b"
            v-on:click="clickOutside()"
          >
            <div style="margin-bottom: 10px">
              Are you sure you want to Log out?
            </div>
            <div>
              <ButtonSubmit label="Yes! Log me out." @click="logOut" />
            </div>
          </div>

          <!-- Announcement box -->
          <div v-if="showAnnouncements" class="announcement-box">
            <ul>
              <li v-for="(announcement, index) in sortedAnnouncements" :key="announcement.announcement_id">
                <div class="announcement-header">
                  <button
                    :class="{ 'unread': announcement.unread === 1, 'announcement-link': announcement.unread === 0 }"
                    @click="markAsRead(announcement, index + 1); toggleAnnouncement(index + 1)"
                  >
                    {{ announcement.title }}
                  </button>
                  <button @click="markAsRead(announcement, index + 1); toggleAnnouncement(index + 1)" class="expand-button">
                    {{ expandedAnnouncements.includes(index + 1) ? '🡡' : '🡣' }}
                  </button>
                  <div class="date-container">
                    <p>{{ formatDateTime(announcement.release_date) }} (UTC) from {{ announcement.announcement_from }}</p>
                  </div>
                </div>
                <div v-if="expandedAnnouncements.includes(index + 1)" class="announcement-content">
                  <div v-html="announcement.description"></div>
                  <br>
                  <button @click="markAsUnread(announcement, index + 1)">Mark as Unread</button>
                </div>
              </li>
            </ul>
          </div>

        </div>

        <div class="buttons-wrapper" v-if="isLoggedIn">
          <!-- <button class="btn" to="/change_website_language">
            <router-link to="/change_website_language">
              <div class="icon_container">
                <i class="icon-color fa-solid fa-earth-americas"></i>
              </div>
            </router-link>
          </button> -->
          <button class="btn" @click="toggleAnnouncements">
              <div class="icon-container">
                <i class="icon-color fa-solid fa-bullhorn" aria-hidden="true"></i>
                <span class="badge" v-if="notificationCount > 0">{{ notificationCount }}</span>
              </div>
          </button>
          <button class="btn">
            <i
              class="icon-color fa-regular fa-question-circle"
              aria-hidden="true"
            ></i>
          </button>
          <button class="btn" @click.prevent="toggle = !toggle; if (showAnnouncements) showAnnouncements = false;">
            <i class="icon-color fa-regular fa-user" aria-hidden="true"></i>
          </button>
        </div>
      </nav>
    </header>
    <div class="flex-parent">
      <div v-show="openNavbar" class="SideNav">
        <AdminLinkRouter v-if="isLoggedIn" @navbarclick="clickOutside" />
      </div>
      <div class="flex-child" v-on:click="clickOutside()">
        <router-view
          @authenticate="setAuthenticated"
          :userData="userData"
          @passAnnouncementsUp="setGetAnnouncements"
          @passLoginUp="setLoginData"
          @passBrandUp="setBrandData"
          :brandData="brandData"
          @passHeaderSubjectFullName="setHeaderSubjectFullName"
          @passUserMachineDetailsUp="setUserMachineDetails"
          :userMachineDetails="userMachineDetails"
        ></router-view>
      </div>
    </div>
    <Footer class="footer" v-on:click="clickOutside()" />
  </div>
</template>

<script>
export default {
  data: () => ({
    component: { AdminLinkRouter, Footer, ButtonSubmit },
    openNavbar: false,
    isLoggedIn: false,
    toggle: false,
    userData: {},
    brandData: {},
    userMachineDetails: {},
    logoPath: "",
    headerSubjectFullName: "",
    notificationCount: 0,
    showAnnouncements: false,
    expandedAnnouncements: [],
    announcementsData: "",
  }),
  updated() {
    if (this.isLoggedIn == true) {
      let website_url = this.brandData.website_url
        ? this.brandData.website_url
        : "https://ts.talentsage.com/";
      let brand_path = this.brandData.brand_path
        ? this.brandData.brand_path
        : "1ccaa508-f5eb-11ec-bb65-06c5d6b8da7c";
      this.logoPath = website_url + brand_path + "/logo.png";
    }
  },
  mounted() {
    let myDomain = document.domain;
    if (
      (myDomain == "lbs.gcm3.com" || myDomain == "lbs.talentsage.com") &&
      this.isLoggedIn == false
    ) {
      //header
      this.brandData.header_text_color = "#FFFFFF";
      this.brandData.header_text_size = "14px";
      this.brandData.header_bg_color = "#031B61";
      //footer
      this.brandData.footer_text_color = "#FFFFFF";
      this.brandData.footer_text_size = "14px";
      this.brandData.footer_bg_color = "#031B61";
      //colors
      this.brandData.main_color1 = "#031B61";
      this.brandData.main_color2 = "#031B61";
      this.brandData.main_color3 = "#031B61";
      this.brandData.accent_color1 = "#C80F2E";
      this.brandData.button_text_color = "#FFFFFF";
      this.brandData.font_text_color = "#54575B";
      //font
      this.brandData.font = "Open Sans";
      this.brandData.font_title_size = "27px";
      //logo
      this.logoPath =
        "https://ts.talentsage.com/2c3d627c-f6e8-11ec-bb65-06c5d6b8da7c/logo.png";
    } else if (
      (myDomain == "ts.gcm3.com" || myDomain == "ts.talentsage.com") &&
      this.isLoggedIn == false
    ) {
      //header
      this.brandData.header_text_color = "#0E5071";
      this.brandData.header_text_size = "14px";
      this.brandData.header_bg_color = "#FFFFFF";
      //footer
      this.brandData.footer_text_color = "#0E5071";
      this.brandData.footer_text_size = "14px";
      this.brandData.footer_bg_color = "#FFFFFF";
      //colors
      this.brandData.main_color1 = "#0E5071";
      this.brandData.main_color2 = "#B2C225";
      this.brandData.main_color3 = "#2F7BA8";
      this.brandData.accent_color1 = "#F47820";
      this.brandData.button_text_color = "#0E5071";
      this.brandData.font_text_color = "#0E5071";
      //font
      this.brandData.font = "Open Sans";
      this.brandData.font_title_size = "27px";
      //logo
      this.logoPath =
        "https://ts.talentsage.com/1ccaa508-f5eb-11ec-bb65-06c5d6b8da7c/logo.png";
    } else if (
      (myDomain == "chicagobooth.gcm3.com" ||
        myDomain == "chicagobooth.talentsage.com") &&
      this.isLoggedIn == false
    ) {
      //header
      this.brandData.header_text_color = "#0E5071";
      this.brandData.header_text_size = "14px";
      this.brandData.header_bg_color = "#FFFFFF";
      //footer
      this.brandData.footer_text_color = "#FFFFFF";
      this.brandData.footer_text_size = "14px";
      this.brandData.footer_bg_color = "#800101";
      //colors
      this.brandData.main_color1 = "#800101";
      this.brandData.main_color2 = "#B21133";
      this.brandData.main_color3 = "#800101";
      this.brandData.accent_color1 = "#737F8B";
      this.brandData.button_text_color = "#FFFFFF";
      this.brandData.font_text_color = "#01163A";
      //font
      this.brandData.font = "Open Sans";
      this.brandData.font_title_size = "27px";
      //logo
      this.logoPath =
        "https://chicagobooth.talentsage.com/1c1e8da7-027a-11ed-a337-062734f9244f/logo.png";
    } else if (
      (myDomain == "alba.gcm3.com" || myDomain == "alba.talentsage.com") &&
      this.isLoggedIn == false
    ) {
      //header
      this.brandData.header_text_color = "#FFFFFF";
      this.brandData.header_text_size = "14px";
      this.brandData.header_bg_color = "#01163A";
      //footer
      this.brandData.footer_text_color = "#FFFFFF";
      this.brandData.footer_text_size = "14px";
      this.brandData.footer_bg_color = "#01163A";
      //colors
      this.brandData.main_color1 = "#01163A";
      this.brandData.main_color2 = "#31425E";
      this.brandData.main_color3 = "#01163A";
      this.brandData.accent_color1 = "#01163A";
      this.brandData.button_text_color = "#FFFFFF";
      this.brandData.font_text_color = "#0E5071";
      //font
      this.brandData.font = "Open Sans";
      this.brandData.font_title_size = "27px";
      //logo
      this.logoPath =
        "https://alba.talentsage.com/e1aeb3c6-fc0b-11ec-bb65-06c5d6b8da7c/logo.png";
    } else if (
      (myDomain == "smartcollaboration.gcm3.com" ||
        myDomain == "smartcollaboration.talentsage.com") &&
      this.isLoggedIn == false
    ) {
      //header
      this.brandData.header_text_color = "#FFFFFF";
      this.brandData.header_text_size = "14px";
      this.brandData.header_bg_color = "#020840";
      //footer
      this.brandData.footer_text_color = "#FFFFFF";
      this.brandData.footer_text_size = "14px";
      this.brandData.footer_bg_color = "#020840";
      //colors
      this.brandData.main_color1 = "#020840";
      this.brandData.main_color2 = "#020840";
      this.brandData.main_color3 = "#020840";
      this.brandData.accent_color1 = "#C80F2E";
      this.brandData.button_text_color = "#FFFFFF";
      this.brandData.font_text_color = "#54575B";
      //font
      this.brandData.font = "Open Sans";
      this.brandData.font_title_size = "27px";
      //logo
      this.logoPath =
        "https://ts.talentsage.com/1d52d28f-0665-11ed-a84d-0aab292fc3a4/logo.png";
    }
  },
  methods: {
    async markAsRead(announcement) {
      try {
        const res = await api.post("/update-read", {
          ind_id: this.userData.ind_id,
          announcement_id: announcement.announcement_id,
        });
        if (res.status === 200) {
          // pass HTML via session
          localStorage.setItem("myAnnouncement", announcement.description);
          // Log response and update the unread status locally
          console.log(res);
          announcement.unread = 0;
          this.setGetAnnouncements(this.announcementsData)
        }
      } catch (error) {
        console.log(error);
      }
    },
    async markAsUnread(announcement) {
      try {
        const res = await api.post("/update-unread", {
          ind_id: this.userData.ind_id,
          announcement_id: announcement.announcement_id,
        });
        if (res.status === 200) {
          // Log response and update the unread status locally
          console.log(res);
          announcement.unread = 1;
          this.setGetAnnouncements(this.announcementsData)
        }
      } catch (error) {
        console.log(error);
      }
    },
    formatDateTime(dateTimeString) {
      const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
      };

      const dateTime = new Date(dateTimeString);
      return dateTime.toLocaleString(undefined, options);
    },
    toggleAnnouncements() {
      this.showAnnouncements = !this.showAnnouncements;
    },
    toggleAnnouncement(index) {
      const indexInArray = this.expandedAnnouncements.indexOf(index);

      if (indexInArray === -1) {
        this.expandedAnnouncements.push(index);
      } else {
        this.expandedAnnouncements.splice(indexInArray, 1);
      }
    },
    setAuthenticated(status) {
      this.isLoggedIn = status;
    },
    deleteCookie(name) {
      document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      console.log("Cookie deleted:", name);
    },
    logOut() {
      // remove the cookie, so the report should not be access
      this.deleteCookie('a3b3dd4702b847b440c49c1198d77f85')

      this.$router.replace("/login");
      this.toggle = false;
      this.isLoggedIn = false;
      store.getters.removeAuthString;
      let myDomain = document.domain;
      if (
        (myDomain == "lbs.gcm3.com" || myDomain == "lbs.talentsage.com") &&
        this.isLoggedIn == false
      ) {
        //header
        this.brandData.header_text_color = "#FFFFFF";
        this.brandData.header_text_size = "14px";
        this.brandData.header_bg_color = "#031B61";
        //footer
        this.brandData.footer_text_color = "#FFFFFF";
        this.brandData.footer_text_size = "14px";
        this.brandData.footer_bg_color = "#031B61";
        //colors
        this.brandData.main_color1 = "#031B61";
        this.brandData.main_color2 = "#031B61";
        this.brandData.main_color3 = "#031B61";
        this.brandData.accent_color1 = "#C80F2E";
        this.brandData.button_text_color = "#FFFFFF";
        this.brandData.font_text_color = "#54575B";
        //font
        this.brandData.font = "Open Sans";
        this.brandData.font_title_size = "27px";
        //logo
        this.logoPath =
          "https://ts.talentsage.com/2c3d627c-f6e8-11ec-bb65-06c5d6b8da7c/logo.png";
      } else if (
        (myDomain == "ts.gcm3.com" || myDomain == "ts.talentsage.com") &&
        this.isLoggedIn == false
      ) {
        //header
        this.brandData.header_text_color = "#0E5071";
        this.brandData.header_text_size = "14px";
        this.brandData.header_bg_color = "#FFFFFF";
        //footer
        this.brandData.footer_text_color = "#0E5071";
        this.brandData.footer_text_size = "14px";
        this.brandData.footer_bg_color = "#FFFFFF";
        //colors
        this.brandData.main_color1 = "#0E5071";
        this.brandData.main_color2 = "#B2C225";
        this.brandData.main_color3 = "#2F7BA8";
        this.brandData.accent_color1 = "#F47820";
        this.brandData.button_text_color = "#0E5071";
        this.brandData.font_text_color = "#0E5071";
        //font
        this.brandData.font = "Open Sans";
        this.brandData.font_title_size = "27px";
        //logo
        this.logoPath =
          "https://ts.talentsage.com/1ccaa508-f5eb-11ec-bb65-06c5d6b8da7c/logo.png";
      } else if (
        (myDomain == "chicagobooth.gcm3.com" ||
          myDomain == "chicagobooth.talentsage.com") &&
        this.isLoggedIn == false
      ) {
        //header
        this.brandData.header_text_color = "#0E5071";
        this.brandData.header_text_size = "14px";
        this.brandData.header_bg_color = "#FFFFFF";
        //footer
        this.brandData.footer_text_color = "#FFFFFF";
        this.brandData.footer_text_size = "14px";
        this.brandData.footer_bg_color = "#800101";
        //colors
        this.brandData.main_color1 = "#800101";
        this.brandData.main_color2 = "#B21133";
        this.brandData.main_color3 = "#800101";
        this.brandData.accent_color1 = "#737F8B";
        this.brandData.button_text_color = "#FFFFFF";
        this.brandData.font_text_color = "#01163A";
        //font
        this.brandData.font = "Open Sans";
        this.brandData.font_title_size = "27px";
        //logo
        this.logoPath =
          "https://chicagobooth.talentsage.com/1c1e8da7-027a-11ed-a337-062734f9244f/logo.png";
      } else if (
        (myDomain == "alba.gcm3.com" || myDomain == "alba.talentsage.com") &&
        this.isLoggedIn == false
      ) {
        //header
        this.brandData.header_text_color = "#FFFFFF";
        this.brandData.header_text_size = "14px";
        this.brandData.header_bg_color = "#01163A";
        //footer
        this.brandData.footer_text_color = "#FFFFFF";
        this.brandData.footer_text_size = "14px";
        this.brandData.footer_bg_color = "#01163A";
        //colors
        this.brandData.main_color1 = "#01163A";
        this.brandData.main_color2 = "#31425E";
        this.brandData.main_color3 = "#01163A";
        this.brandData.accent_color1 = "#01163A";
        this.brandData.button_text_color = "#FFFFFF";
        this.brandData.font_text_color = "#0E5071";
        //font
        this.brandData.font = "Open Sans";
        this.brandData.font_title_size = "27px";
        //logo
        this.logoPath =
          "https://alba.talentsage.com/e1aeb3c6-fc0b-11ec-bb65-06c5d6b8da7c/logo.png";
      } else if (
        (myDomain == "smartcollaboration.gcm3.com" ||
          myDomain == "smartcollaboration.talentsage.com") &&
        this.isLoggedIn == false
      ) {
        //header
        this.brandData.header_text_color = "#FFFFFF";
        this.brandData.header_text_size = "14px";
        this.brandData.header_bg_color = "#020840";
        //footer
        this.brandData.footer_text_color = "#FFFFFF";
        this.brandData.footer_text_size = "14px";
        this.brandData.footer_bg_color = "#020840";
        //colors
        this.brandData.main_color1 = "#020840";
        this.brandData.main_color2 = "#020840";
        this.brandData.main_color3 = "#020840";
        this.brandData.accent_color1 = "#C80F2E";
        this.brandData.button_text_color = "#FFFFFF";
        this.brandData.font_text_color = "#54575B";
        //font
        this.brandData.font = "Open Sans";
        this.brandData.font_title_size = "27px";
        //logo
        this.logoPath =
          "https://ts.talentsage.com/1d52d28f-0665-11ed-a84d-0aab292fc3a4/logo.png";
      }
    },
    sendUserData(data) {
      this.userData = data;
    },
    async setLoginData(data) {
      this.userData = data;
      console.log('userData e2 ', this.userData)
    },
    async setGetAnnouncements(data) {
      console.log('app announcement data:', data);
      this.announcementsData = data;
      this.notificationCount = data.filter(announcement => announcement.unread === 1).length;
    },
    async setUserMachineDetails(data) {
      this.userMachineDetails = data;
    },
    clickOutside(status) {
      this.openNavbar = status;
      this.toggle = false;
      this.showAnnouncements = false;
    },
    async setBrandData(data) {
      this.brandData = data;
    },
    setHeaderSubjectFullName(data) {
      this.headerSubjectFullName = data;
      console.log("laman", this.headerSubjectFullName);
      console.log("haba", this.headerSubjectFullName.length);
    },
  },
  computed: {
    sortedAnnouncements() {
      // Check if there is data before sorting
      if (this.announcementsData.length === 0) {
        return [];
      }

      // Sort announcements by release_date in descending order
      return this.announcementsData.slice().sort((a, b) => {
        return new Date(b.release_date) - new Date(a.release_date);
      });
    },
  }
};
</script>

<style>
.flex-parent {
  display: flex;
  flex-direction: row;
}

.flex-child {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 81vh;
  padding: 0;
}

.app-container {
  width: 100%;
  /* height: 100vh; */
  position: relative;
  display: flex;
  align-content: stretch;
  flex-direction: column;
  background-color: #f2f2f2;
  overflow: hidden;
}

.body-container {
  background: white;
  margin: 20px;
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 20px;
  box-shadow: 0px 2px 10px -4px #000000;
  border-radius: 20px;
  align-self: center;
  /* min-height: 80vh; */
  /* min-width: 75vw; */
}

.body-form-container {
  background: white;
  margin: 50px 0 30px 0;
  box-shadow: 0px 2px 10px -4px #000000;
  border-radius: 20px;
  align-self: center;
  width: 95%;
  /* min-height: 80vh;
  margin-left: auto;
  margin-right: auto; */
}

button > i {
  pointer-events: none;
}

.buttons-wrapper {
  /* order: 4; */
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 0 10px 0 0;
  /* width: 0; */
}

.btn {
  margin: 0 5px 0 0;
  position: relative;
  border: 1px solid grey;
  padding-right: 5px;
  padding-left: 5px;
  padding-top: 2px;
  padding-bottom: 2px;
  background-color: white;
}

.icon-container {
  position: relative;
}

.badge {
  position: absolute;
  bottom: 90%;
  left: 30%;
  background-color: red;
  color: #ffffff;
  border-radius: 50%;
  padding: 3px 8px;
  font-size: 12px;
  z-index: 999;
}

.announcement-box {
  position: absolute;
  min-width: 300px;
  z-index: 999;
  right: 10px;
  top: 55px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  color: black;
}

.announcement-box ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.announcement-box li {
  padding: 10px;
  border-bottom: 1px solid #ddd;
  transition: background-color 0.3s;
}

.announcement-box li:last-child {
  border-bottom: none;
}

.announcement-box li:hover {
  background-color: #f0f0f0;
}


.announcement-box li small {
  color: #888;
}

.announcement-box li .announcement-content {
  max-width: 500px;
  margin-left: 5px;
}

.announcement-link {
  text-decoration: none !important; /* Remove default link underline */
  color: inherit !important;        /* Use the default text color */
  font-weight: normal !important;   /* Set default font weight */
  cursor: pointer;
  margin-left: 5px; /* Adjust margin as needed */
  padding: 0; /* Remove padding */
  border: none; /* Remove border */
  background: none; /* Remove background */
  font-size: 16px; /* Adjust font size as needed */
}

.unread {
  text-decoration: none !important; /* Remove default link underline */
  color: inherit !important;    
  font-weight: bold !important;     /* Set font weight for unread announcements */
  cursor: pointer;
  margin-left: 5px; /* Adjust margin as needed */
  padding: 0; /* Remove padding */
  border: none; /* Remove border */
  background: none; /* Remove background */
  font-size: 16px; /* Adjust font size as needed */
}

.expand-button {
  cursor: pointer;
  margin-left: 5px; /* Adjust margin as needed */
  padding: 0; /* Remove padding */
  border: none; /* Remove border */
  background: none; /* Remove background */
  font-size: 16px; /* Adjust font size as needed */
}

.date-container{
  margin-left: 5px;
}

.form-inline {
  padding-right: 20px;
}

.form-inline-login {
  padding-right: 20px;
}

.fa-regular {
  background: #fff;
}

.form-inline button {
  margin: 0 5px 0 5px;
}

#logout-menu {
  position: absolute;
  min-width: 250px;
  z-index: 999;
  right: 0;
  text-align: center;
  background-color: #fff;
  padding: 20px;
  margin: 10px;
  border-radius: 2px;
  box-shadow: 0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0 rgb(0 0 0 / 14%),
    0 1px 5px 0 rgb(0 0 0 / 12%);
}

#logout-menu,
.sn-sidenav {
  top: 55px;
}

.logo-container {
  /* order: 2; */
  padding-left: 10px;
  /* flex-grow: 2; */
  /* width: 171px; */
  height: 63px;
  margin-right: 10px;
}

.logo-container img {
  height: 100%;
  object-fit: cover;
  padding: 0;
  margin: 0;
}
.surveSubjectName {
  /* order: 3; */
  flex-grow: 2;
}

/* header css dynamic */
.header-container {
  color: v-bind(
    'brandData.header_text_color ? brandData.header_text_color : "#0E5071"'
  );
  font-size: v-bind(
    'brandData.header_text_size ? brandData.header_text_size+"px" : "14px"'
  );
  background-color: v-bind(
    'brandData.header_bg_color ? brandData.header_bg_color: "#FFFFFF"'
  );
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2) !important;
  height: 7vh;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  min-height: 64px;
  width: 100%;
}

/* footer css dynamic */
.footer-text-color {
  color: v-bind(
    'brandData.footer_text_color ? brandData.footer_text_color : "#0E5071"'
  );
  font-size: v-bind(
    'brandData.footer_text_size ? brandData.footer_text_size+"px" : "14px"'
  );
  background-color: v-bind(
    'brandData.footer_bg_color ? brandData.footer_bg_color: "#FFFFFF"'
  );
}

.footer-text-color a {
  color: v-bind(
    'brandData.footer_text_color ? brandData.footer_text_color : "#0E5071"'
  );
}

.icon_container {
  color: rgb(87, 86, 86);
}

.icon-color {
  color: v-bind(
    'brandData.accent_color1 ? brandData.accent_color1 : "#F47820"'
  );
}

/* only for icon on the sidebar  */
.icon-color-sidebar {
  color: v-bind('brandData.main_color1 ? brandData.main_color1 : "#0E5071"');
}

.menu_button {
  padding-left: 10px;
}
@font-face {
  font-family: "Open Sans";
  src: local("Open Sans"),
    url(./assets/fonts/OpenSans-Regular.ttf) format("truetype");
}
* {
  font-family: v-bind('brandData.font ? brandData.font : "Open Sans"');
}

h1,
h2,
h3,
h4,
h5,
h6,
p,
option,
select,
button,
table,
th,
tr,
td,
input,
textarea {
  color: v-bind(
    'brandData.font_text_color ? brandData.font_text_color : "#54575B"'
  );
}

/* brand text-color  */
.text-main-color1 {
  color: v-bind('brandData.main_color1 ? brandData.main_color1 : "#0E5071"');
}
.text-main-color2 {
  color: v-bind('brandData.main_color2 ? brandData.main_color2 : "#B2C225"');
}
.text-main-color3 {
  color: v-bind('brandData.main_color3 ? brandData.main_color3 : "#2F7BA8"');
}
.text-accent-color1 {
  color: v-bind(
    'brandData.accent_color1 ? brandData.accent_color1 : "#F47820"'
  );
}

/* brand background color  */
.bg-main-color1 {
  background-color: v-bind("brandData.main_color1");
}
.bg-main-color2 {
  background-color: v-bind("brandData.main_color2");
}
.bg-main-color3 {
  background-color: v-bind("brandData.main_color3");
}
.bg-accent-color1 {
  background-color: v-bind("brandData.accent_color1");
}

/* brand font text size  */
.font-text-size {
  font-size: v-bind(
    'brandData.font_text_size ? brandData.font_text_size+"px" : "14px"'
  );
}

/* brand font title size  */
.font-title-size {
  font-size: v-bind(
    'brandData.font_title_size ? brandData.font_title_size+"px" : "27px"'
  );
}

/* CSS for Header Component  */
.header {
  font-weight: bold;
  font-size: v-bind(
    'brandData.font_title_size ? brandData.font_title_size+"px" : "27px"'
  );
  color: v-bind(
    'brandData.font_title_color ? brandData.font_title_color : "#54575B"'
  );
}

/* button submit component */
.btn-submit {
  appearance: none;
  background-color: v-bind(
    'brandData.main_color2 ? brandData.main_color2 : "#b2c225"'
  );
  border: 1px solid rgba(27, 31, 35, 0.15);
  border-radius: 20px;
  box-sizing: border-box;
  color: v-bind(
    'brandData.button_text_color ? brandData.button_text_color : "#54575B"'
  );
  cursor: pointer;
  display: inline-block;
  font-size: v-bind(
    'brandData.font_text_size ? brandData.font_text_size+"px" : "14px"'
  );
  font-weight: 500;
  line-height: 20px;
  list-style: none;
  padding: 6px 16px;
  position: relative;
  transition: background-color 0.2s cubic-bezier(0.3, 0, 0.5, 1);
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  vertical-align: middle;
  white-space: nowrap;
  word-wrap: break-word;
  box-shadow: none;
}
.btn-submit:hover {
  /* background-color: v-bind('brandData.main_color2'); */
  text-decoration: none;
  background-color: v-bind(
    'brandData.main_color2 ? brandData.main_color2 : "#b2c225"'
  );
  opacity: 0.8;
  transition-duration: 0.1s;
}
.btn-submit:disabled {
  background-color: #f4782042;
  border-color: rgba(27, 31, 35, 0.034);
  color: #959da5;
  cursor: default;
  pointer-events: none;
}
.btn-submit:active {
  box-shadow: rgba(225, 228, 232, 0.2) 0 1px 0 inset;
  background-color: v-bind(
    'brandData.main_color2 ? brandData.main_color2 : "#b2c225"'
  );
  opacity: 0.6;
  transition: none 0s;
}
.btn-submit:focus {
  outline: 1px transparent;
}
.btn-submit:before {
  display: none;
}
.btn-submit:-webkit-details-marker {
  display: none;
}

/* button cancel component  */
.btn-cancel {
  appearance: none;
  background-color: #e2e2e2;
  border: 1px solid rgba(27, 31, 35, 0.15);
  border-radius: 20px;
  box-shadow: rgba(27, 31, 35, 0.04) 0 1px 0,
    rgba(255, 255, 255, 0.25) 0 1px 0 inset;
  box-sizing: border-box;
  color: #000000;
  cursor: pointer;
  display: inline-block;
  font-size: v-bind(
    'brandData.font_text_size ? brandData.font_text_size+"px" : "14px"'
  );
  font-weight: 500;
  line-height: 20px;
  list-style: none;
  padding: 6px 16px;
  position: relative;
  transition: background-color 0.2s cubic-bezier(0.3, 0, 0.5, 1);
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  vertical-align: middle;
  white-space: nowrap;
  word-wrap: break-word;
  margin-left: 20px;
}
.btn-cancel:hover {
  background-color: #eeeeee;
  text-decoration: none;
  transition-duration: 0.1s;
}
.btn-cancel:disabled {
  background-color: #fafbfc;
  border-color: rgba(27, 31, 35, 0.15);
  color: #959da5;
  cursor: default;
  pointer-events: none;
}
.btn-cancel:active {
  background-color: #e2e2e2;
  box-shadow: rgba(225, 228, 232, 0.2) 0 1px 0 inset;
  transition: none 0s;
}
.btn-cancel:focus {
  outline: 1px transparent;
}
.btn-cancel:before {
  display: none;
}
.btn-cancel:-webkit-details-marker {
  display: none;
}

/* table  */
#table {
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

/* form box  */
.formBox {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 20px 10px 10px;
  margin: 1em 0 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  border-top: 4px solid
    v-bind('brandData.main_color1 ? brandData.main_color1 : "#0E5071"');
  box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
}

/* input type  */
.input {
  outline: 0;
  border-width: 0 0 1px;
  border-color: grey;
  padding: 2px 5px;
  margin: 10px 0px;
  background: none;
}
label {
  font-size: v-bind(
    'brandData.font_text_size ? brandData.font_text_size+"px" : "14px"'
  );
  font-weight: 500;
  display: inline-block;
  color: v-bind(
    'brandData.font_text_color ? brandData.font_text_color : "#54575B"'
  );
  margin-bottom: 0.5rem;
}

/* random css design  */
.d-flex {
  display: flex;
}
.justify-content-between {
  justify-content: space-between;
}
.align-items-center {
  align-items: center;
}
.text-center {
  text-align: center;
}

/* margins  */
.ml-1 {
  margin-left: 1rem;
}
.mb-3 {
  margin-bottom: 3rem;
}
.mt-1 {
  margin-top: 1rem;
}

@media only screen and (min-width: 280px) and (max-width: 900px) {
  .app-container {
    width: 100%;
    font-size: 12px;
    position: relative;
    display: flex;
    align-content: stretch;
    flex-direction: column;
    background-color: #f2f2f2;
    overflow-x: hidden;
  }

  .body-form-container {
    font-size: 12px;
    width: 98%;
    background: white;
    margin: 40px 0 30px 0;
    box-shadow: 0px 2px 10px -4px #000000;
    border-radius: 20px;
    align-self: center;
  }

  .header-container {
    font-size: 12px;
    width: 100%;
    height: 100%;
    padding: 0 0 10px 0;
  }

  .logo-container {
    width: 50%;
  }

  .logo-container img {
    height: 100%;
    width: 30vw;
    object-fit: contain;
    padding: 0;
    margin: 0;
  }

  .buttons-wrapper {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding: 2px 0 0 0;
    margin: 0;
    width: 100%;
  }

  .user-welcome {
    width: 100%;
    display: flex;
    justify-content: center;
    margin: 0 0 0 0;
    border-top: 1px dashed #c3bcbc;
    padding: 5px 0 0 0;
    font-size: 10px;
  }

  .flex-child {
    padding: 20px 0 0 0;
    min-height: 80vh;
  }

  .form-control {
    font-size: 12px !important;
  }

  .form-inline {
    padding: 0;
  }

  .form-inline-login {
    padding: 10px 0 0 0;
  }

  .box-div {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }

  .parent {
    display: flex;
    flex-wrap: wrap;
    padding: 10px;
    justify-content: center;
  }

  #logout-menu {
    margin: 0;
    width: 100%;
    padding: 10px;
    right: unset;
  }

  .flex-parent {
    margin: 0 0 20px 0;
  }
}

/* @media only screen and (min-width: 280px) {
  .footer-text-color {
    display: none;
  }
} */

/* @media screen and (max-width: 100px) {
  .app-container {
    width: 100%;
    font-size: 10px;
    height: 80vh;
    margin: 30px;
  }

  .body-form-container {
    font-size: 10px;
    width: 100%;
    height: 80vh;
    margin: 30px;
  }

  .header-container {
    font-size: 10px;
    width: 50%;
  }

  .logo-container {
    width: 50%;
  }

  .buttons-wrapper{
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding: 0 10px 0 0;
    width: 100%;
  }

  .user-welcome{
    width: 100%;
    display: flex;
    justify-content: center;
  }

} */

/* end random css design  */
</style>
