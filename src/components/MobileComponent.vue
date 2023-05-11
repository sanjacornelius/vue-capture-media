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
      this.$emit('uploadFile', event);
    }
  }
};
</script>
