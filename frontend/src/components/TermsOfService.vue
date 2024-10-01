<script setup>
</script>
<template>
<div class="choose-screen">
  <h1>Terms of Service</h1>
</div>
</template>

<script>
export default {
  name: "ForgotPasswordChoose",
  data: () => ({}),
  methods: {},
  mounted(){},
};
</script>

<style scoped>
.choose-screen {
  margin-left: auto;
  margin-right: auto;
  background: white;
  border-radius: 20px;
  padding:20px;
  margin-top: 20px;
  margin-bottom: 20px;
  max-width: 1200px;
  box-shadow: 0px 2px 10px -4px #000000;
  color: #0E5071
}
.btn {
  background-color: #e67829;
  width: 100%;
  color: #fff;
  fill: #fff;
  font-size: 100%;
  line-height: 1.15;
  font-weight: 500;
  margin: 6px 0;
  border: 0;
  outline: 0;
  border-radius: 2px;
  cursor: pointer;
  letter-spacing: 0.03em;
  padding: 10px 26px;
  box-shadow: 0 0 2px rgb(0 0 0 / 12%), 0 2px 2px rgb(0 0 0 / 20%);
  transition: all 0.2s ease-in-out;
  margin-top: 5px;
  margin-bottom: 10px;
}

h2 {
  font-weight: 400;
  font-size: 24px;
  line-height: 32px;
  margin-top: 20px;
  margin-bottom: 10px;
  text-align: center;
  color: #0E5071
}

.description {
  text-align: center;
  margin-top: 30px;
  margin-bottom: 30px;
  color: #0E5071
}
table {
  border: 1px solid;
}
td {
  border: 1px solid;
}
td {
  padding: 10px;
}
p{
  color:#0E5071
}
h1{
  color: #0E5071
}
ol>li{
  color: #0E5071  
}
</style>
