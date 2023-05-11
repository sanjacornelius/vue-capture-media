<template>
   <div class="media-container">
      <mobile-component  v-if="isMobile" mode="video" @uploadFile="uploadFile"></mobile-component>
      <desktop-component 
        v-if="!isMobile" 
        mode="video" 
        :playBtnIcon="playBtnIcon" 
        :captureBtnIcon="captureBtnIcon" 
        :recordBtnIcon="recordBtnIcon" 
        :stopBtnIcon="stopBtnIcon" 
        :retakeBtnIcon="retakeBtnIcon" 
        :uploadBtnIcon="uploadBtnIcon"
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
  props: ['recordBtnIcon', 'captureBtnIcon', 'stopBtnIcon', 'playBtnIcon', 'retakeBtnIcon', 'uploadBtnIcon'],
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

