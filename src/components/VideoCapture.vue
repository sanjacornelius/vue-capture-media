<template>
  <div class="media-container">
    <!-- Use dynamic components to render either MobileComponent or DesktopComponent based on isMobile flag -->
    <component :is="captureComponent" 
      mode="video"
      v-bind="captureComponentProps"
      @uploadFile="uploadFile">
    </component>
  </div>
</template>

<script>
import MobileComponent from "./MobileComponent.vue";
import DesktopComponent from "./DesktopComponent.vue";
import MobileDetection from '../mixins/MobileDetection';
export default {
  name: "VideoCapture",
  mixins: [MobileDetection],
  props: {
    cameraWidth: [Number, String],
    cameraHeight: [Number, String],
    overlayFile: [Array, String],
    captureBtnIcon: String,
    uploadBtnIcon: String,
    stopBtnIcon: String,
    recordBtnIcon: String,
    retakeBtnIcon: String,
    photoText: String,
    stopText: String,
    retakeText: String,
    uploadText: String
  },
  components: {
    MobileComponent,
    DesktopComponent,
  },
  computed: {
    captureComponent() {
      // Determine which component to use based on isMobile flag
      return this.isMobile ? 'MobileComponent' : 'DesktopComponent';
    },
    captureComponentProps() {
       // Dynamically set props based on isMobile flag
       return this.isMobile ? {} : {
          cameraWidth: this.cameraWidth ? this.cameraWidth : '100%',
          cameraHeight: this.cameraHeight ? this.cameraHeight : '100%',
          overlayFile: this.overlayFile,
          playBtnIcon: this.playBtnIcon,
          captureBtnIcon: this.captureBtnIcon,
          recordBtnIcon: this.recordBtnIcon,
          stopBtnIcon: this.stopBtnIcon,
          retakeBtnIcon: this.retakeBtnIcon,
          uploadBtnIcon: this.uploadBtnIcon,
          photoText: this.photoText,
          stopText: this.stopText,
          retakeText: this.retakeText,
          uploadText: this.uploadText
        };
    }
  },
  methods: {
    uploadFile(event) {
      // Emit event up to parent component
      this.$emit('uploadFile', event);
    }
  }
};
</script>

