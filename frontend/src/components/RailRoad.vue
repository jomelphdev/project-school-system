<script setup>
</script>


<template>
  <div class="container">
    <div class="progress-container">
      <div class="progress" :style="{ width: progressWidth }"></div>
      <div
        v-for="(step, index) in steps"
        :key="index"
        :class="['circle', { active: index < activeStep }]"
      >
        <div class="caption">{{ step.content }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "RailRoad",
  props: ["steps", "activeStep", "progressWidth"],
  computed: {
  },
  methods: {
  },
};
</script>

<style scoped>

.container {
  text-align: center;
}

.progress-container {
  display: flex;
  justify-content: space-between;
  position: relative;
  margin-bottom: 60px;
  max-width: 100%;
  min-width: 75vw;
}

.progress-container::before {
  content: "";
  background-color: #ebe2e2;
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  height: 4px;
  width: 100%;
  z-index: 1;
}

.progress {
  background-color: #1da1f2;
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  height: 4px;
  width: 0%;
  z-index: 2;
  transition: 0.4s ease;
}

.circle {
  background: #c7c7c7;
  color: #c7c7c7;
  border-radius: 50%;
  height: 10px;
  width: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid #c7c7c7;
  transition: 0.4s ease;
  z-index: 3;
}

.circle.active {
  border-color: #4e4b4b;
  background-color: lightseagreen;
  color: var(--accent-color);
  scale: 1.1;
}

.circle .caption {
  position: absolute;
  font-size: 12px;
  font-weight: bolder;
  bottom: -20px;
}

@media only screen and (max-width: 400px) {
  .container {
    width: 85%;
  }
}

</style>