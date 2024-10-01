<script setup>
import Home from "./HomeComponent.vue";
import api from "../api/api.js";
import api2 from "../api/api2.js";
import store from "../store/store.js";
import CryptoJS from "crypto-js";
import ButtonSubmit from "./ButtonSubmit.vue";
import { flashMessage } from "../functions.js";
import Bowser from "bowser";
</script>

<template>
  <div v-if="isLoggedIn">
    <div>
      <Home />
    </div>
  </div>
  <div v-else>
    <div class="login-form">
      <div>
        <form @submit.prevent="handleLogin()" method="post">
          <h3>Welcome! <br />Sign in here to grow your leadership skills.</h3>
          <div class="form-group">
            <input
              type="text"
              name="username"
              v-model="username"
              class="form-control"
              placeholder="Email Address "
              required="required"
              id="emailInput"
            />
          </div>
          <div class="form-group">
            <input
              type="password"
              name="password"
              v-model="password"
              class="form-control"
              placeholder="Password  (8+ characters)"
              required="required"
              id="passwordInput"
            />
            <span @click="showPassword()">
              <i class="fa fa-eye" aria-hidden="true" id="eye"></i>
            </span>
          </div>
          <div class="form-group button-div">
            <ButtonSubmit
              label="Sign In"
              style="border: 1px; box-shadow: 2px 4px #ccc"
            />
          </div>
        </form>
        <div class="forgot-password">
          <p>
            <router-link to="/forgot_password_screen"
              >Forgot password?</router-link
            >
          </p>
        </div>
        <div class="btm-msg">
          <h5>
            2023 TalentSage, LLC. All rights reserved. No part of this platform may be reproduced, distributed, or transmitted in any form or by any means including recording, or other electronic or mechanical methods, without the prior written permission of the copyright holder.  <br /><br />By signing in you consent to these uses and agree with TalentSage's
            <a :href="dynamicDomain">Terms of Service</a> and acknowledge that
            TalentSage's <router-link to="/privacy_page">Privacy Policy</router-link>
            applies to you.
          </h5>

        </div>
      </div>
    </div>
  </div>
</template>

<script> 
export default {
  component: [Home, ButtonSubmit],
  name: "LoginComponent",
  data: () => ({
    myDomain: document.domain,
    dynamicDomain: "",
    isLoggedIn: false,
    logOutButton: true,
    is2FactorAuthDone: false,
    username: "",
    password: "",
    loginResults: [],
    routeAuthResults: [],
    Roles: {},
    currentRole: [],
    platform: "",
    browser: "",
    deviceCore: "",
    operatingSystem: "",
    ip_address: [],
    user_ip_address: "",
    machine_id: "",
    announcements: "",
  }),
  methods: {
    // getMachineID() {
    //   const userAgent = window.navigator.userAgent;
    //   const platform = window.navigator.platform;
    //   const plugins = Array.from(
    //     window.navigator.plugins,
    //     (plugin) => plugin.name
    //   ).join(",");
    //   const canvas = document.createElement("canvas");
    //   const context = canvas.getContext("2d");
    //   const canvasFingerprint = context.canvas.toDataURL();

    //   const hash = (string) => {
    //     let hash = 0,
    //       i,
    //       chr;
    //     for (i = 0; i < string.length; i++) {
    //       chr = string.charCodeAt(i);
    //       hash = (hash << 5) - hash + chr;
    //       hash |= 0;
    //     }
    //     return hash;
    //   };

    //   const machineID = hash(
    //     userAgent + platform + plugins + canvasFingerprint
    //   );
    //   this.machine_id = machineID.toString(36);
    //   return machineID.toString(36);
    // },
    // setDeviceCookie() {
    //   console.log(`saving ${this.machine_id} to cookies`);
    //   const farFutureDate = new Date("9999-12-31T23:59:59Z");
    //   document.cookie = `machineID=${
    //     this.machine_id
    //   }; path=/; expires=${farFutureDate.toUTCString()}; SameSite=Strict`;
    // },
    // checkDeviceCookie(machineID) {
    //   const cookies = document.cookie.split(";");
    //   for (let i = 0; i < cookies.length; i++) {
    //     const cookie = cookies[i].trim();
    //     if (cookie.startsWith("machineID=")) {
    //       const savedDeviceID = cookie.substring(
    //         "machineID=".length,
    //         cookie.length
    //       );
    //       return savedDeviceID === machineID;
    //     }
    //   }
    //   return false;
    // },

    setCookie(name, value, expirationDays) {
      let expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + expirationDays);
      let expires = "expires=" + expirationDate.toUTCString();
      document.cookie = name + "=" + value + ";" + expires + ";path=/";
      console.log("Cookie set:", name);
    },
    async handleLogin() {
      // this.setDeviceCookie();
      // save cookie for the report to access
      this.setCookie('a3b3dd4702b847b440c49c1198d77f85', 'f8beb37fb7fb9f0316f42142ac4382fbe94117b2', 1)
      try {
        const res = await api.post("auths", {
          email: this.username.toLowerCase().trim(),
          password: this.password,
        });
        if (res.status === 200) {
          this.loginResults = res.data;

          //get announcements
          try {
            const UserAnnouncements = await api.post("/get-announcements-by-gospi-role", {
              org_id: this.loginResults[0].org_id,
              suborg_id: this.loginResults[0].suborgs,
              roles: this.loginResults[0].roles,
              ind_id: this.loginResults[0].ind_id,
              for_email: this.loginResults[0].email
            });
            if (UserAnnouncements.status === 200) {
              console.log('Get announcements from login success!',UserAnnouncements.data)
              this.$emit("passAnnouncementsUp", UserAnnouncements.data);
            }
          } catch (error) {
            console.log(error);
          }

          if (this.loginResults.length <= 0) {
            flashMessage(
              this.$flashMessage,
              "#F47820",
              "#ffffff",
              "Wrong username or password!"
            );
            this.userLog(0, 0);
            return null;
          } else if (
            this.loginResults[0].roles == "" ||
            this.loginResults[0].roles == null
          ) {
            flashMessage(
              this.$flashMessage,
              "#F47820",
              "#ffffff",
              "Invalid user"
            );
            this.userLog(0, 0);
            return null;
          }
          try {
            const resUserLog = await api.get(
              `getUserLogByIndId/${this.loginResults[0].ind_id}`
            );
            console.log('resUserLog',resUserLog)
            if (resUserLog.status === 200) {
              if (resUserLog.data == "" || !resUserLog.data || !resUserLog || resUserLog.data == null) {
                // API did not return any result
                    const data2FA2 = {
                      loginDetails: this.loginResults[0],
                      email: this.username,
                      ind_id: this.loginResults[0].ind_id,
                      machine_id: this.machine_id,
                      ip_address: this.user_ip_address,
                      is_logged_in: 1,
                      platform: this.platform,
                      operating_system: this.operatingSystem,
                      browser: this.browser,
                      logical_processors: this.deviceCore,
                    };
                    this.$emit("passUserMachineDetailsUp", data2FA2);
                    this.$emit("passLoginUp", this.loginResults[0]);
                    this.$emit("passBrandUp", this.loginResults[0].brandData);
                    this.$router.push("/two_FA");
                    return;
              } else {
                // save IP address
                const axios = require("axios");
                try {
                  const resIP = await axios.get("https://ipapi.co/json/");
                  if (resIP.status === 200) {
                    this.user_ip_address = resIP.data.ip;
                    console.log("user ip address is ", this.user_ip_address);
                    this.ip_address = resUserLog.data.ip_address.split(",");
                    console.log("database ip address is ", this.ip_address);
                    // end of save IP address
                    // check if user's ip is in the DB (can add up to 3)
                    if (this.ip_address.includes(this.user_ip_address)) {
                      console.log("Condition 2: The users current IP is saved in the Database");
                    } else {
                      if (this.ip_address.length < 21) {
                        this.ip_address.push(this.user_ip_address);
                        const newArrIP = this.ip_address.join(",");
                        const data2FA = {
                          loginDetails: this.loginResults[0],
                          email: this.username,
                          ind_id: this.loginResults[0].ind_id,
                          machine_id: this.machine_id,
                          ip_address: newArrIP,
                          is_logged_in: 1,
                          platform: this.platform,
                          operating_system: this.operatingSystem,
                          browser: this.browser,
                          logical_processors: this.deviceCore,
                        };
                        console.log(
                          `Added ${this.user_ip_address} to the Database`
                        );
                        this.userLog(0, 0);
                          this.$emit("passUserMachineDetailsUp", data2FA);
                          this.$emit("passLoginUp", this.loginResults[0]);
                          this.$emit("passBrandUp", this.loginResults[0].brandData);
                          this.$router.push("/two_FA");
                        // check if the user's ip match the 3 ips in the database
                        if (
                          !this.ip_address.includes(this.user_ip_address)
                        ) {
                          console.log(
                            "Condition 2: The users current IP is not saved in the Database"
                          );
                          this.userLog(0, 0);
                          this.$emit("passUserMachineDetailsUp", data2FA);
                          this.$emit("passLoginUp", this.loginResults[0]);
                          this.$emit("passBrandUp", this.loginResults[0].brandData);
                          this.$router.push("/two_FA");
                          return;
                        }
                        return
                      } else {
                        console.log(
                          `Added ${this.user_ip_address} to the Database and removed the last IP`
                        );
                        // check if the user's ip match the 3 ips in the database
                        if (this.ip_address.includes(this.user_ip_address)) {
                          console.log(
                            "Condition 2: The users current IP is saved in the Database"
                          );
                        } else if (
                          !this.ip_address.includes(this.user_ip_address)
                        ) {
                          console.log(
                            "Condition 2: The users current IP is not saved in the Database"
                          );
                          this.userLog(0, 0);
                          this.ip_address.shift();
                          this.ip_address.push(this.user_ip_address);
                          const newArrIP = this.ip_address.join(",");
                          const data2FA = {
                          loginDetails: this.loginResults[0],
                          email: this.username,
                          ind_id: this.loginResults[0].ind_id,
                          machine_id: this.machine_id,
                          ip_address: newArrIP,
                          is_logged_in: 1,
                          platform: this.platform,
                          operating_system: this.operatingSystem,
                          browser: this.browser,
                          logical_processors: this.deviceCore,
                          };
                          this.$emit("passUserMachineDetailsUp", data2FA);
                          this.$emit("passLoginUp", this.loginResults[0]);
                          this.$emit("passBrandUp", this.loginResults[0].brandData);
                          this.$router.push("/two_FA");
                          return;
                        }
                        this.ip_address.shift();
                        this.ip_address.push(this.user_ip_address);
                      }
                    }
                    const newArrIP = this.ip_address.join(",");
                    const data2FA = {
                      loginDetails: this.loginResults[0],
                      email: this.username,
                      ind_id: this.loginResults[0].ind_id,
                      machine_id: this.machine_id,
                      ip_address: newArrIP,
                      is_logged_in: 1,
                      platform: this.platform,
                      operating_system: this.operatingSystem,
                      browser: this.browser,
                      logical_processors: this.deviceCore,
                    };

                    // check if user's saved cookie machine_id is same with Database
                      if (
                        this.checkDeviceCookie(resUserLog.data.machine_id) == true
                      ) {
                        console.log("Condition 1: Machine id is the same");
                      } else if (
                        this.checkDeviceCookie(resUserLog.data.machine_id) ==
                        false
                      ) {
                        console.log("Condition 1: Machine id is not same");
                        this.userLog(0, 0);
                        this.$emit("passUserMachineDetailsUp", data2FA);
                        this.$emit("passLoginUp", this.loginResults[0]);
                        this.$emit("passBrandUp", this.loginResults[0].brandData);
                        this.$router.push("/two_FA");
                        return;
                      }
                    // check if the user's ip match the 20 ips in the database
                    if (this.ip_address.includes(this.user_ip_address)) {
                      console.log(
                        "Condition 2: The users current IP is saved in the Database"
                      );
                    } else if (
                      !this.ip_address.includes(this.user_ip_address)
                    ) {
                      console.log(
                        "Condition 2: The users current IP is not saved in the Database"
                      );
                      this.userLog(0, 0);
                      this.$emit("passUserMachineDetailsUp", data2FA);
                      this.$emit("passLoginUp", this.loginResults[0]);
                      this.$emit("passBrandUp", this.loginResults[0].brandData);
                      this.$router.push("/two_FA");
                      return;
                    }
                    // check if user's last login is past 10 days
                    const inputDate = new Date(resUserLog.data.datetime);
                    const currentDate = new Date();
                    // Calculate the difference in milliseconds between the input date and the current date
                    const diffInMs =
                      currentDate.getTime() - inputDate.getTime();
                    // Convert the difference to days
                    const diffInDays = Math.floor(
                      diffInMs / (1000 * 60 * 60 * 24)
                    );
                    // Check if the difference is greater than or equal to 10
                    if (diffInDays >= 10) {
                      console.log(
                        "Condition 3: The input date is at least 10 days in the past."
                      );
                      this.userLog(0, 0);
                      this.$emit("passUserMachineDetailsUp", data2FA);
                      this.$emit("passLoginUp", this.loginResults[0]);
                      this.$emit("passBrandUp", this.loginResults[0].brandData);
                      this.$router.push("/two_FA");
                      return;
                    } else {
                      console.log(
                        "Condition 3: The input date is less than 10 days in the past."
                      );
                    }
                  }
                } catch (error) {
                  console.log(error);
                }
              }
              // save last login
              try {
                const lastLogin = await api.put("/auths/lastlogin", {
                  email: this.username.toLowerCase().trim(),
                });
                if (lastLogin.status === 200) {
                  console.log("Last login log success");
                }
              } catch (error) {
                console.log(error);
              }
              // give screens to logged in role
              this.Roles = this.loginResults[0].roles;
              try {
                const result = await api.get("roles");
                if (result.status === 200) {
                  var rolesData = result.data;
                  var newValue = this.Roles.split(", ");
                  var newRoleName = newValue.map(
                    (r) => rolesData.find((f) => f.role_id == r).role_name
                  );
                  this.currentRole = newRoleName;
                  this.$emit("passLoginUp", this.loginResults[0]);
                  this.$emit("passBrandUp", this.loginResults[0].brandData);
                  this.isLoggedIn = true;
                  this.userLog(1, this.loginResults[0].ind_id);
                  this.$router.push("/");
                  this.$emit("authenticate", this.isLoggedIn);
                  store.commit(
                    "addAuthString",
                    this.decrypt(
                      this.loginResults[0].auth_string,
                      this.loginResults[0].seed
                    )
                  );
                  this.$flashMessage.show({
                    html: `<div style="background-color: ${
                      this.loginResults[0].brandData.accent_color1
                        ? this.loginResults[0].brandData.accent_color1
                        : "#F47820"
                    }; width:100%;">
                      <p style="margin-bottom:0; margin-left:1rem; color: #fff;">Welcome ${
                        this.loginResults[0].first_name
                      } !</p>
                      <p style="margin-top:0; margin-left:1rem; color: #fff;">Role(s): ${this.currentRole.join(
                        ", "
                      )}</p>
                    </div>`,
                    clickable: true,
                  });
                }
              } catch (error) {
                console.log(error);
              }
            }
          } catch (error) {
            flashMessage(this.$flashMessage, "#F47820", "#ffffff", error.message);
            return null;
          }
        }
      } catch (error) {
        console.log(error);
          try {
          const res = await api2.post("auths", {
            email: this.username.toLowerCase().trim(),
            password: this.password,
          });
          if (res.status === 200) {
            this.loginResults = res.data;
            if (this.loginResults.length <= 0) {
              flashMessage(
                this.$flashMessage,
                "#F47820",
                "#ffffff",
                "Wrong username or password!"
              );
              this.userLog(0, 0);
              return null;
            } else if (
              this.loginResults[0].roles == "" ||
              this.loginResults[0].roles == null
            ) {
              flashMessage(
                this.$flashMessage,
                "#F47820",
                "#ffffff",
                "Invalid user"
              );
              this.userLog(0, 0);
              return null;
            }
            try {
              const resUserLog = await api2.get(
                `getUserLogByIndId/${this.loginResults[0].ind_id}`
              );
              console.log('resUserLog',resUserLog)
              if (resUserLog.status === 200) {
                try {
                  const lastLogin = await api2.put("/auths/lastlogin", {
                    email: this.username.toLowerCase().trim(),
                  });
                  if (lastLogin.status === 200) {
                    console.log("Last login log success");
                  }
                } catch (error) {
                  console.log(error);
                }
                // give screens to logged in role
                this.Roles = this.loginResults[0].roles;
                try {
                  const result = await api2.get("roles");
                  if (result.status === 200) {
                    let rolesData = result.data;
                    let newValue = this.Roles.split(", ");
                    let newRoleName = newValue.map(
                      (r) => rolesData.find((f) => f.role_id == r).role_name
                    );
                    this.currentRole = newRoleName;
                    this.$emit("passLoginUp", this.loginResults[0]);
                    this.$emit("passBrandUp", this.loginResults[0].brandData);
                    this.isLoggedIn = true;
                    this.userLog(1, this.loginResults[0].ind_id);
                    this.$router.push("/");
                    this.$emit("authenticate", this.isLoggedIn);
                    store.commit(
                      "addAuthString",
                      this.decrypt(
                        this.loginResults[0].auth_string,
                        this.loginResults[0].seed
                      )
                    );

                    this.$flashMessage.show({
                      html: `<div style="background-color: ${
                        this.loginResults[0].brandData.accent_color1
                          ? this.loginResults[0].brandData.accent_color1
                          : "#F47820"
                      }; width:100%;">
                        <p style="margin-bottom:0; margin-left:1rem; color: #fff;">Welcome ${
                          this.loginResults[0].first_name
                        } !</p>
                        <p style="margin-top:0; margin-left:1rem; color: #fff;">Role(s): ${this.currentRole.join(
                          ", "
                        )}</p>
                      </div>`,
                      clickable: true,
                    });
                  }
                } catch (error) {
                  console.log(error);
                }
              }
            } catch (error) {
              flashMessage(this.$flashMessage, "#F47820", "#ffffff", error.message);
              return null;
            }
          }
        } catch (error) {
          console.log(error);
        }
      }
    },
    showPassword() {
      var x = document.getElementById("passwordInput");
      if (x.type === "password") {
        x.type = "text";
      } else {
        x.type = "password";
      }
    },
    decrypt(src, passphrase) {
      const bytes = CryptoJS.AES.decrypt(src, passphrase);
      return bytes.toString(CryptoJS.enc.Utf8);
    },
    async userLog(loggedIn, indId) {
      const newArrIP = this.ip_address.join(",");
      try {
        const res = await api.post("insertUserLog", {
          email: this.username,
          ind_id: indId,
          machine_id: this.machine_id,
          ip_address: newArrIP,
          is_logged_in: loggedIn,
          platform: this.platform,
          operating_system: this.operatingSystem,
          browser: this.browser,
          logical_processors: this.deviceCore,
        });
        if (res) {
          console.log(res);
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
  async mounted() {

    await api.get('brands/'+this.myDomain).then((result) => {
      this.dynamicDomain = result.data[0].website_terms_url
    });

    const browser = Bowser.getParser(window.navigator.userAgent);
    this.platform = browser.getPlatformType();
    this.browser = `${browser.getBrowserName()} V.${browser.getBrowserVersion()}`;
    this.operatingSystem = `${browser.getOSName()} ${browser.getOSVersion()}`;

    const axios = require("axios");
    try {
      const resIP = await axios.get("https://ipapi.co/json/");
      if (resIP.status === 200) {
        this.user_ip_address = resIP.data.ip;
        console.log("user ip address is ", this.user_ip_address);
      }
    } catch (error) {
      console.log(error);
    }

    if (navigator.hardwareConcurrency) {
      this.deviceCore = navigator.hardwareConcurrency + " cores";
    } else {
      this.deviceCore = "N/A";
    }
    // get Machine ID
    // this.getMachineID();
    // console.log("Users machine ID is ", this.machine_id);
  },
};
</script>

<style scoped>
.login-form {
  background: white;
  border-radius: 20px;
  padding: 10px 20px 10px 20px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 20px;
  max-width: 600px;
  box-shadow: 0px 2px 10px -4px #000000;
}
.btn {
  width: 30%;
  font-size: 100%;
  line-height: 1.15;
  font-weight: 500;
  margin: 6px 0;
  cursor: pointer;
  letter-spacing: 0.03em;
  padding: 10px 26px;
  box-shadow: 0 0 2px rgb(0 0 0 / 12%), 0 2px 2px rgb(0 0 0 / 20%);
  transition: all 0.2s ease-in-out;
}
input[type="checkbox"] {
  transform: scale(2);
  background-color: initial;
  cursor: default;
  appearance: auto;
  box-sizing: border-box;
  margin: 3px 3px 3px 4px;
  padding: initial;
  border: initial;
}

.form-control {
  height: 56px;
  font-size: 1rem;
}

.form-group input {
  font-weight: 400;
  margin-bottom: 20px;
  font-size: 1rem;
  line-height: 1.4375em;
  letter-spacing: 0.00938em;
  color: rgba(0, 0, 0, 0.87);
  box-sizing: border-box;
  cursor: text;
  display: inline-flex;
  -webkit-box-align: center;
  align-items: center;
  width: 100%;
  position: relative;
  border-radius: 4px;
  padding: 16.5px 14px;
  box-shadow: 2px 4px #ccc;
  border: 2px solid #0e5071;
}
.form-group {
  position: relative;
}

h2 {
  font-weight: 400;
  font-size: 24px;
  line-height: 32px;
  margin-top: 20px;
  margin-bottom: 10px;
}

label {
  font-size: 14px;
  padding-left: 16px;
}
.btm-msg {
  text-align: center;
  margin-top: 50px;
}
span {
  position: absolute;
  top: 37%;
  left: 93%;
  transform: translate(0, -50%);
  cursor: pointer;
  right: 15px;
  color: #f47820;
  font-size: 25px;
}
span:hover {
  color: #f47820bd;
}
span:active {
  color: #ff6a00;
}
.button-div {
  display: flex;
  justify-content: center;
}
@media (max-width: 480px) {
  .fa-eye {
    margin-left: -15px;
    cursor: pointer;
    position: relative;
    z-index: 2;
  }
}
</style>
