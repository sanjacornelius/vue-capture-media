<template>
  <div>
      <Loader v-if="isLoading"></Loader>
      <div v-show="!isLoading && mode === 'photo'">
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

      <div v-show="!isLoading && mode === 'video'">
        <video ref="videoPreview" class="video-preview" muted loop autoplay />
        
        <div class="controls">
          <button v-if="!isRecording" @click="recordVideo" class="btn flex-center">RECORD</button>
          <button v-else @click="stopVideo" class="btn">STOP</button>
          <!-- <button type="button" class="btn" @click.prevent="resetVideo">reset</button>
          <button type="button" class="btn" @click.prevent="done">done</button> -->
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
  props: ['captureBtnIcon', 'mode'],
  data() {
    return {
      isLoading: false,
      isCameraOpen: false,
      isPhotoTaken: false,
      isShotPhoto: false,
      isRecording: false,
      recorder: null,
      videoPreview: null,
      cameraElement: null,
      canvasElement: null,
      videoRecorder: null,
      stream: null,
    };
  },
  mounted() {
    let constraints = {};
    if (this.mode === 'photo') {
      this.cameraElement = this.$refs.camera;
      this.canvasElement = this.$refs.canvas;
      constraints = {
        audio: false,
				video: true
      }
    } else if(this.mode === 'video') {
      this.videoRecorder = this.$refs.videoRecorder;
      this.videoPreview = this.$refs.videoPreview;
      constraints = {
        audio: true,
				video: true
      }
    }
    this.createCameraElement(constraints);
  },
  methods: {
    createCameraElement(constraints) {
      this.isLoading = true;
      navigator.mediaDevices
      .getUserMedia(constraints)
      .then(stream => {
        this.isLoading = false;
        switch (this.mode) {
          case 'photo':
            this.cameraElement.srcObject = stream;
            break;
        
          case 'video':
            let chunks = [];
            this.$refs.videoPreview.srcObject = stream;
            this.stream = stream;
            const options = {
              mimeType: "video/webm",
              audioBitsPerSecond: 128000
            }; 
            this.recorder = new MediaRecorder(new MediaStream(stream.getVideoTracks()), options);

            this.recorder.ondataavailable = (e) => {
              chunks.push(e.data);
            };
            
            this.recorder.onstop = (e) => {
              this.$refs.videoPreview.controls = true;
              const blob = new Blob(chunks, { type: 'video/webm' });
              chunks = [];
              const videoUrl = URL.createObjectURL(blob);
              this.$refs.videoPreview.src = videoUrl;
            };
            break;   
        }
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
      context.drawImage(this.cameraElement, 0, 0, 450, 337.5);
      this.$nextTick(() => {
        this.$emit("uploadFile", this.$refs.canvas.toDataURL());
      });
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
      this.$refs.videoPreview.srcObject = null;
      this.isRecording = false;
    }
  }
}
</script>