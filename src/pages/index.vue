<template>
  <div class="block bg-color">
    8888 <span class="block_text">block_text</span>
    <img src="../assets/pay_logo.png" />
    <img src="../assets/pay_logo.svg" />
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  created() {
    console.log(3333);
    this.testPromise();
  },
  methods: {
    testPromise() {
      new Promise((resolve, reject) => {
        console.log(22);
        resolve(1);
      });
    },
  },
};
</script>
<style lang="less" scoped>
@color: red;
.block {
  &_text {
    color: @color;
    position: absolute;
    transform: translate(-50%, -50%);
  }
}
</style>
