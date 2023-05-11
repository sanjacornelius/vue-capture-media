<template>
  <div>
    <Loader v-show="isLoading"></Loader>
      <div v-show="!isLoading">
          <div class="capture" :class="{'flash' : isShotPhoto}">
              <div class="camera-shutter" :class="{'flash' : isShotPhoto}"></div>
              <video v-show="!isPhotoTaken" ref="camera" class="camera" :width="450" :height="337.5" :class="mode" muted autoplay />
              <canvas v-show="mode === 'photo' && isPhotoTaken" ref="canvas" :width="450" :height="337.5" class="preview" />
          </div>
          <div class="controls">
            <button
              v-if="mode === 'photo'"
              class="btn btn-photo "
              @click.prevent="takePhoto"
              alt="Capture Photo">
              <i :class="captureBtnIcon"></i> Photo
            </button>
            <button v-if="mode === 'video' && !isRecording && !isUploadReady" @click="recordVideo" class="btn btn-record flex-center"><i :class="recordBtnIcon"></i> Rec</button>
            <button v-if="mode === 'video' && isRecording" @click="stopVideo" class="btn btn-stop"><i :class="stopBtnIcon"></i> Stop</button>
            <button v-if="mode === 'video' && !isRecording && isUploadReady" @click="resetVideo" class="btn btn-retake"><i :class="retakeBtnIcon"></i> Retake</button>
            <button
              v-if="isUploadReady"
              class="btn btn-upload"
              @click.prevent="uploadFile"
              alt="Upload">
              <i :class="uploadBtnIcon"></i> Upload
            </button>

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
  props: ['captureBtnIcon', 'mode', 'uploadBtnIcon', 'stopBtnIcon', 'recordBtnIcon', 'retakeBtnIcon'],
  data() {
    return {
      isLoading: false,
      isPhotoTaken: false,
      isShotPhoto: false,
      isRecording: false,
      recorder: null,
      stream: null,
      videoUrl: null,
      isUploadReady: false,
    };
  },
  
  mounted() {
    this.createCameraElement();  
  },
  methods: {
     createCameraElement() {
      this.isLoading = true;
      navigator.mediaDevices
      .getUserMedia({audio: true,
				video: true})
      .then(stream => {
        this.isLoading = false;
        this.$refs.camera.srcObject = stream;
        if (this.mode === 'video') {
          let chunks = [];
          this.$refs.camera.srcObject = stream;

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
      })
      .catch(error => {
        setTimeout(() => {
          this.isLoading = false;
        }, 1000);
        
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
      this.createCameraElement();
      
    }
  },
  destroyed() {
    this.stream.getTracks().forEach(function(track) {
      track.stop();
    });
  }
}
</script>