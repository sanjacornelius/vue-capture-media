<template>
  <div>
    <div class="media-container">
      <mobile-component  v-if="isMobile" mode="photo" @uploadFile="uploadFile"></mobile-component>
      <desktop-component 
        v-if="!isMobile" 
        mode="photo" 
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
  </div>
</template>

<script>
import MobileComponent from "./MobileComponent.vue";
import DesktopComponent from "./DesktopComponent.vue";
import MobileDetection from '../mixins/MobileDetection';
export default {
  name: "PhotoCapture",
  components:{
    MobileComponent,
    DesktopComponent,
  },
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
    console.log('MOIUNTED VUE CAPTURE', this.isMobile);
   }
};
</script>