<template>
  <div class="vcomments"></div>
</template>

<script>
import AV from "leancloud-storage";
import Valine from "valine";
window.AV = AV;
export default {
  mounted() {
    new Valine({
      el: ".vcomments",
      appId: "VGAH9YphWjHPUOsQVHCtI0fQ-9Nh9j0Va",
      appKey: "89I4BuQ0oI5NYeYCvf2NPOrH",
      path: "window.location.pathname",
      notify: false,
      verify: false,
      avatar: "",
      placeholder: "添加你的评论..."
    });
  }
};
</script>

<style>
.vcomments {
  margin: 30px 0;
}
</style>
