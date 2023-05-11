<template>
  <div>
    <Loader v-show="isLoading"></Loader>
    <div v-show="!isLoading && !showErrorMessage">
      <div class="capture">
        <!-- video element for camera feed -->
          <video 
            ref="camera"
            class="camera"
            :class="mode"
            muted 
            autoplay
            v-show="!isPhotoTaken"     
            :width="`${cameraWidth}px`" 
            :height="`${cameraHeight}px`"
          ></video>
          <!-- canvas element for photo preview -->
          <canvas 
            ref="canvas"
            class="preview"
            v-show="mode === 'photo' && isPhotoTaken"   
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
    // mode can be 'video' or 'photo'
    'mode',
    // dimensions for camera feed and photo preview
    'cameraWidth',
    'cameraHeight',
    // icons for buttons
    'captureBtnIcon', 
    'uploadBtnIcon', 
    'stopBtnIcon', 
    'recordBtnIcon', 
    'retakeBtnIcon',
    // text for buttons
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
          
          this.recorder.onstop = (e) => {
            this.$refs.camera.controls = !this.$refs.camera.controls;
            this.$refs.camera.autoplay = !this.$refs.camera.autoplay;
            this.$refs.camera.muted = !this.$refs.camera.muted;
            const blob = new Blob(chunks, {type: "video/webm"});
            chunks = [];
            this.videoUrl = URL.createObjectURL(blob);
            this.$refs.camera.src = this.videoUrl;
          };
        }
        this.isLoading = false;
      })
      .catch(error => {
        this.isLoading = false;
        const message = error.message;
        if (message === 'Requested device not found' ) {
          this.showErrorMessage = true;
          this.errorMessage = message;
        }
        console.log('Error message: ', message);
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
        this.$emit("uploadFile", this.videoUrl);  
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
    }
  },
  destroyed() {
    this.stream.getTracks().forEach(function(track) {
      track.stop();
    });
  }
}
</script>