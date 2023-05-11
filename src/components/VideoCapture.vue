<template>
   <div class="media-container">
      <mobile-component  v-if="isMobile" mode="video" @uploadFile="uploadFile"></mobile-component>
      <desktop-component 
        v-if="!isMobile" 
        mode="video" 
        :cameraWidth="cameraWidth"
        :cameraHeight="cameraHeight"
        :playBtnIcon="playBtnIcon" 
        :captureBtnIcon="captureBtnIcon" 
        :recordBtnIcon="recordBtnIcon" 
        :stopBtnIcon="stopBtnIcon" 
        :retakeBtnIcon="retakeBtnIcon" 
        :uploadBtnIcon="uploadBtnIcon"
        :photoText="photoText"
        :stopText="stopText"
        :retakeText="retakeText"
        :uploadText="uploadText"
        @uploadFile="uploadFile">
      </desktop-component>
    </div>
</template>

<script>
import MobileComponent from "./MobileComponent.vue";
import DesktopComponent from "./DesktopComponent.vue";
import MobileDetection from '../mixins/MobileDetection';
export default {
  name: "VideoCapture",
  mixins: [MobileDetection],
  props: [
    'cameraWidth',
    'cameraHeight',
    'captureBtnIcon', 
    'uploadBtnIcon', 
    'stopBtnIcon', 
    'recordBtnIcon', 
    'retakeBtnIcon',
    'photoText',
    'stopText',
    'retakeText',
    'uploadText'
  ],
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
  mounted() {
    console.log('VIDEO CAPTURE MOUNTED');
  }
};
</script>

