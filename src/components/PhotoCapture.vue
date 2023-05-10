<template>
  <div>
    <div class="media-container">
      <mobile-component  v-show="isMobile" mode="photo" @uploadFile="uploadFile"></mobile-component>
      <desktop-component v-show="!isMobile" mode="photo" :captureBtnIcon="captureBtnIcon" :uploadBtnIcon="uploadBtnIcon" @uploadFile="uploadFile"></desktop-component>
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
  props: ['value', 'captureBtnIcon', 'uploadBtnIcon'],
  data() {
    return {
    };
  },
  methods: {
    uploadFile(event) {
      console.log('UPLOAD FILE EVENT', event);
      this.$emit('uploadFile', event);
    }
   },
   mounted() {
    console.log('MOIUNTED VUE CAPTURE', this.isMobile);
   }
};
</script>