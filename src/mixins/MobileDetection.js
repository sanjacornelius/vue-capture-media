export default {
  computed: {
    isMobile() {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;

      // Regular expression to match various mobile devices
      const mobileRegex = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i;

      // Check for iPad separately
      const isIpad = /iPad/.test(userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

      if (mobileRegex.test(userAgent) || isIpad) {
          return true;
      } else {
          return false;
      }
    },
  }
};