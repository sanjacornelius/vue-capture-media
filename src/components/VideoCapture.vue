<template>
   <div class="video-container">
      <mobile-component  v-show="isMobile" mode="video" @uploadFile="uploadFile"></mobile-component>
      <desktop-component v-show="!isMobile" mode="video" :captureBtnIcon="captureBtnIcon" @uploadFile="uploadFile"></desktop-component>
    </div>
</template>

<script>
import MobileComponent from "./MobileComponent.vue";
import DesktopComponent from "./DesktopComponent.vue";
import MobileDetection from '../mixins/MobileDetection';
export default {
  name: "VideoCapture",
  mixins: [MobileDetection],
  components: {
    MobileComponent,
    DesktopComponent,
  },
  data() {
    return {
    };
  },
  methods: {
    uploadFile(event) {
      this.$emit('uploadFile', event);
    }
  },
};
</script>

