<template>
  <div>
    <Loader v-show="isLoading"></Loader>
    <div v-show="!isLoading && !showErrorMessage">
      <div class="capture" :style="{ height: cameraHeight + 'px', width: cameraWidth + 'px' }">
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
          <div class="overlay-container"  :style="{height: '100%', width: '100%'}">
            <img ref="overlayImg" v-if="overlayFile" class="overlayImg"/>
            <canvas
              v-if="overlayFile"
              ref="overlay" 
              class="overlay"  
              :width="`${cameraWidth}px`" 
              :height="`${cameraHeight}px`"
            ></canvas>
          </div>
          <!-- canvas element for photo preview -->
          <canvas
            v-show="mode === 'photo' && isPhotoTaken"   
            ref="canvas"
            class="preview"
            :width="`${cameraWidth}px`" 
            :height="`${cameraHeight}px`"
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
    };
  },
  mounted() {
    this.setupCamera();
  },
  methods: {
    setupCamera() {
      this.isLoading = true;
      navigator.mediaDevices
      .getUserMedia({
        audio: true,
				video: true
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
        this.setupOverlay();
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
      this.isPhotoTaken = !this.isPhotoTaken;
      
      const context = this.$refs.canvas.getContext('2d');
      context.drawImage(this.$refs.camera, 0, 0, this.cameraWidth, this.cameraHeight);
      this.isUploadReady = true;
    },
    uploadFile() {
      if (this.mode === 'video') {
        this.$emit("uploadFile", {"url": this.videoUrl, "mimeType": "video/webm", "blob": this.blob});  
      } else {
        this.$emit("uploadFile", this.$refs.canvas.toDataURL());
      }
      this.isUploadReady = false;
    },
    recordVideo() {
      this.recorder.start();
      this.isRecording = true;
    },
    stopVideo() {
      this.recorder.stop();
      for (const track of this.stream.getTracks()) {
          track.stop();
      }
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
      context.drawImage(this.$refs.overlay, 0, 0, this.cameraWidth, this.cameraHeight);
    }
  },
  destroyed() {
    if (this.stream) {
      this.stream.getTracks().forEach(function(track) {
        track.stop();
      });
    }
  }
}
</script>