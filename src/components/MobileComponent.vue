<template>
  <div>
    <input :type="mode === 'video' ? 'file' : 'hidden'" 
           accept="video/*" capture="camcorder"
           @change="handleFileInput"/>
    <input :type="mode === 'photo' ? 'file' : 'hidden'" 
           accept="image/*" capture="capture"
           @change="handleFileInput"/>
  </div>
</template>

<script>
export default {
  name: 'MobileComponent',
  props: ['mode'],
  methods: {
    handleFileInput(event) {
      const files = event.target.files;
      const file = files[0];
      const reader = new FileReader();
      const that = this;
      reader.onload = function(event) {
        const base64url = event.target.result;
        // send the base64url to the server
        that.$emit('uploadFile', base64url);
      };
      reader.readAsDataURL(file);
    }
  }
};
</script>
