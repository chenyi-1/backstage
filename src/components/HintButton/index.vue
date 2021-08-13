<template>
  <el-tooltip class="item" effect="dark" :content="title" placement="top-start">
    <el-button v-on="$listeners" v-bind="$attrs"></el-button>
  </el-tooltip>
</template>

<script>
export default {
  name: "HintButton",
  props: ["title"],
};
</script>

<style lang="less" scoped>
</style>
