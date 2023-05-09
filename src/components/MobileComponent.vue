<template>
    <div>
        <input v-show="mode === 'video'" type="file" accept="video/*;capture=camcorder" @change="uploadFile"/>
        <input v-show="mode === 'photo'" type="file" accept="image/*;capture=camera" @change="uploadFile"/>
    </div>
</template>

<script>
export default {
  name: "MobileComponent",
  props: ['mode'],
  data() {
    return {
    };
  },
  methods: {
    uploadFile(event) {
        this.$emit("uploadFile", event);
    },
  }
};
</script>