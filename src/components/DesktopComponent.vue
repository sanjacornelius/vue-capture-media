<template>
    <div>
        <Loader v-show="isLoading"></Loader>
        <div v-show="!isLoading">
            <div class="photo-capture" :class="{'flash' : isShotPhoto}">
                <div class="camera-shutter" :class="{'flash' : isShotPhoto}"></div>
                <video  v-show="!isPhotoTaken" ref="camera" class="camera"  :width="450" :height="337.5" autoplay />
                <canvas v-show="isPhotoTaken" ref="canvas" :width="450" :height="337.5" class="preview" />
            </div>
            <div class="controls">
            <button
                :class="'btn flex-center '  + buttonsClasses"
                @click.prevent="takePhoto"
                alt="Capture Photo"
                ><i :class="captureBtnIcon"></i></button>
            </div>
        </div>
    </div>
</template>


<script>
import Loader from "./Loader.vue";

export default {
  name: "PhotoCapture",
  components:{
    Loader,
  },
  props: {
    captureBtnIcon: {
      default: 'fa fa-camera'
    }
  },
  data() {
    return {
      isLoading: false,
      isCameraOpen: false,
      isPhotoTaken: false,
      isShotPhoto: false,
    };
  },
  mounted() {
    this.videoPlayer = this.$refs.player;
    this.canvasElement = this.$refs.canvas;
    this.createCameraElement();
  },
  methods: {
    createCameraElement() {
      this.isLoading = true;

      const constraints = (window.constraints = {
				audio: false,
				video: true
			});

      navigator.mediaDevices
      .getUserMedia(constraints)
      .then(stream => {
        this.isLoading = false;
        this.$refs.camera.srcObject = stream;
      })
      .catch(error => {
        this.isLoading = false;
        alert("The browser didn't support or there is some errors.");
      });
    },
    takePhoto() {
      if(!this.isPhotoTaken) {
        this.isShotPhoto = true;

        const FLASH_TIMEOUT = 50;

        setTimeout(() => {
          this.isShotPhoto = false;
        }, FLASH_TIMEOUT);
      }
      
      this.isPhotoTaken = !this.isPhotoTaken;
      
      const context = this.$refs.canvas.getContext('2d');
      context.drawImage(this.$refs.camera, 0, 0, 450, 337.5);
      this.$nextTick(() => {
        this.$emit("uploadFile", this.$refs.canvas.toDataURL());
      });
    },
    done() {
      this.$emit("uploadPhoto", this.picture);
      this.showVideo = true;
      this.streamUserMediaVideo();
    },
    cancel() {
      this.showVideo = true;
      this.streamUserMediaVideo();
    },
    stopCameraStream() {
      let tracks = this.$refs.camera.srcObject.getTracks();

			tracks.forEach(track => {
				track.stop();
			});
      // if (!(this.$refs.camera && this.$refs.camera.srcObject)) return;
      // this.$refs.camera.srcObject.getVideoTracks().forEach(track => {
      //   track.stop();
      // });
    }
  }
}
</script>