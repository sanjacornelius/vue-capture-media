<template>
  <div class="media-container">
    <!-- Use dynamic components to render either MobileComponent or DesktopComponent based on isMobile flag -->
     <component :is="captureComponent" 
       mode="photo"
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
 computed: {
   captureComponent() {
     // Determin which component to use based on isMobile flag
     return this.isMobile ? 'MobileComponent' : 'DesktopComponent';
   },
   captureComponentProps() {
      // Dynamically set props based on isMobile flag
      return this.isMobile ? {} : {
         cameraWidth: this.cameraWidth,
         cameraHeight: this.cameraHeight,
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