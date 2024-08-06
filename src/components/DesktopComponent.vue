<template>
  <div>
    <Loader v-show="isLoading"></Loader>
    <div v-show="!isLoading && !showErrorMessage">
      <div class="capture">
        <!-- video element for camera feed -->
          <video 
            v-show="!isPhotoTaken" 
            ref="camera"
            class="camera"
            :class="mode"
            muted 
            autoplay   
            width="100%" 
            height="100%"
          ></video>
          <!-- canvas element for overlay -->
          <div v-if="overlayFile.length > 0" class="overlay-container"  :style="{height: '100%', width: '100%'}">
            <img ref="overlayImg" alt="overlay_img" class="overlayImg"/>
            <canvas
              v-if="overlayFile"
              ref="overlay" 
              class="overlay"
            ></canvas>
          </div>
          <!-- canvas element for photo preview -->
          <canvas
            v-show="mode === 'photo' && isPhotoTaken"   
            ref="canvas"
            class="preview"
          ></canvas>
      </div>

      <div class="controls">
        <button
          v-if="mode === 'photo'"
          @click.prevent="takePhoto"
          class="btn btn-photo">
          <i v-if="captureBtnIcon" :class="captureBtnIcon"></i> {{ photoText }}
        </button>
        <button 
          v-if="mode === 'video' && !isRecording && !isUploadReady" 
          @click="recordVideo" 
          class="btn btn-record flex-center">
          <i v-if="recordBtnIcon" :class="recordBtnIcon"></i> {{ recordText }}
        </button>
        <button 
          v-if="mode === 'video' && isRecording" 
          @click="stopVideo" 
          class="btn btn-stop">
          <i v-if="stopBtnIcon" :class="stopBtnIcon"></i> {{ stopText }}
        </button>
        <button 
          v-if="mode === 'video' && !isRecording && isUploadReady" 
          @click="resetVideo" 
          class="btn btn-retake">
          <i v-if="retakeBtnIcon" :class="retakeBtnIcon"></i> {{ retakeText }}
        </button>
        <!-- upload photo or video -->
        <button
          v-if="isUploadReady"
          class="btn btn-upload"
          @click.prevent="uploadFile"
          alt="Upload">
          <i v-if="uploadBtnIcon" :class="uploadBtnIcon"></i> {{ uploadText }}
        </button>
      </div>
    </div>
    <div v-if="showErrorMessage">
      {{ errorMessage }}
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
  props: [
    'mode',
    'cameraWidth',
    'cameraHeight',
    'overlayFile',    
    'captureBtnIcon', 
    'uploadBtnIcon', 
    'stopBtnIcon', 
    'recordBtnIcon', 
    'retakeBtnIcon',
    'photoText',
    'stopText',
    'retakeText',
    'uploadText',
  ],
  data() {
    return {
      isLoading: false,
      isPhotoTaken: false,
      isRecording: false,
      recorder: null,
      stream: null,
      videoUrl: null,
      blob: null,
      isUploadReady: false,
      showErrorMessage: false,
      errorMessage: null,
      canvasWidth: '100%',
      canvasHeight: '100%',
    };
  },
  methods: {
    setupCamera() {
      this.isLoading = true;
      navigator.mediaDevices
      .getUserMedia({
        audio: true,
				video: {
          width: {max: 2000},
          height: {max: 2000}
        }
      })
      .then(stream => {
        this.$refs.camera.srcObject = stream;
        if (this.mode === 'video') {
          let chunks = [];
          this.stream = stream;
          const options = {
            mimeType: "video/webm",
            audioBitsPerSecond: 128000,
          }; 
          this.recorder = new MediaRecorder(new MediaStream(stream), options);

          this.recorder.ondataavailable = (e) => {
            chunks.push(e.data);
          };
          
          this.recorder.onstop = () => {
            this.$refs.camera.controls = !this.$refs.camera.controls;
            this.$refs.camera.autoplay = !this.$refs.camera.autoplay;
            this.$refs.camera.muted = !this.$refs.camera.muted;
            this.blob = new Blob(chunks, {type: "video/webm"});
            chunks = [];
            this.videoUrl = URL.createObjectURL(this.blob);
            this.$refs.camera.src = this.videoUrl;
          };
        }
        this.isLoading = false;
        if (this.overlayFile.length > 0) {
          this.setupOverlay();
        }
      })
      .catch(error => {
        this.isLoading = false;
        const message = error.message;
        if (message === 'Requested device not found' ) {
          this.showErrorMessage = true;
          this.errorMessage = message;
        }
      });
    },
    takePhoto() {
      const camera = this.$refs.camera;
      const cameraWidth = camera.offsetWidth;
      const cameraHeight = camera.offsetHeight;

      const widthPercentage = 100;
      const heightPercentage = 100;

      // Convert the width and height percentages to pixels
      const widthPixels = Math.round((widthPercentage / 100) * cameraWidth);
      const heightPixels = Math.round((heightPercentage / 100) * cameraHeight);

      const canvas = this.$refs.canvas;
      const ctx = canvas.getContext('2d');
      
      // Set the canvas dimensions before capturing the image data
      canvas.width = widthPixels;
      canvas.height = heightPixels;

      this.canvasWidth = widthPixels;
      this.canvasHeight = heightPixels;

      // Draw the camera image on the canvas
      ctx.drawImage(camera, 0, 0, widthPixels, heightPixels);

      this.isPhotoTaken = !this.isPhotoTaken;
      this.isUploadReady = true;
    },
    uploadFile() {
      if (this.mode === 'video') {
        this.$emit("uploadFile", {
          "url": this.videoUrl, 
          "mimeType": "video/webm", 
          "blob": this.blob, 
          "width": this.canvasWidth, 
          "height": this.canvasHeight
        }); 
        this.resetVideo(); 
      } else {
        this.$emit("uploadFile", this.$refs.canvas.toDataURL());
      }
      this.isUploadReady = false;
      this.stopStream();
    },
    recordVideo() {
      this.recorder.start();
      this.isRecording = true;
    },
    stopVideo() {
      this.recorder.stop();
      this.stopStream();
      this.$refs.camera.srcObject = null;
      this.isRecording = false;
      this.isUploadReady = true;
    },
    resetVideo() {
      this.$refs.camera.controls = !this.$refs.camera.controls;
      this.$refs.camera.autoplay = !this.$refs.camera.autoplay;
      this.$refs.camera.muted = !this.$refs.camera.muted;
      this.isUploadReady = false;
      this.isRecording = false;
      this.setupCamera();
    },
    setupOverlay() {
      const context = this.$refs.overlay.getContext('2d');
      this.$refs.overlayImg.src = this.overlayFile;
      const width = this.cameraWidth ? this.cameraWidth : context.canvas.width;
      const height = this.cameraHeight ? this.cameraHeight : context.canvas.height;
      context.drawImage(this.$refs.overlay, 0, 0, width, height);
    },
    stopStream() {
      if (this.stream) {
        for (const track of this.stream.getTracks()) {
          track.stop();
        }
      }
    }
  },
  mounted() {
    this.setupCamera();
  },
  beforeDestroyed() {
    this.stopStream();
  }
}
</script>