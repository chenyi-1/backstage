<template>
  <div>
    <el-form :model="cForm" :inline="true" :disabled="!isShow">
      <el-form-item label="一级分类">
        <el-select
          v-model="cForm.category1Id"
          placeholder="请选择"
          @change="c1Ateg"
        >
          <el-option
            v-for="c1 in category1List"
            :key="c1.id"
            :label="c1.name"
            :value="c1.id"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="二级分类">
        <el-select
          v-model="cForm.category2Id"
          placeholder="请选择"
          @change="c2Ateg"
        >
          <el-option
            v-for="c2 in category2List"
            :key="c2.id"
            :label="c2.name"
            :value="c2.id"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="三级分类">
        <el-select
          v-model="cForm.category3Id"
          placeholder="请选择"
          @change="c3Ateg"
        >
          <el-option
            v-for="c3 in category3List"
            :key="c3.id"
            :label="c3.name"
            :value="c3.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "CategorySelector",
  data() {
    return {
      cForm: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
      category1List: [],
      category2List: [],
      category3List: [],
    };
  },
  props:{
    isShow: Boolean
  },
  mounted() {
    this.category1Id();
  },

  methods: {
    async category1Id() {
      const { data } = await this.$API.category.getCategory1();
      this.category1List = data;
    },

    async category2Id() {
      const { data } = await this.$API.category.getCategory2(
        this.cForm.category1Id
      );
      this.category2List = data;
    },
    async category3Id() {
      const { data } = await this.$API.category.getCategory3(
        this.cForm.category2Id
      );
      this.category3List = data;
    },

    c1Ateg() {
      this.category2Id();
      this.cForm.category2Id = "";
      this.cForm.category3Id = "";
      this.category2List = [];
      this.category3List = [];
      this.$emit("changeCategory", { id: this.cForm.category1Id, level: 1 });
    },
    c2Ateg() {
      this.category3Id();
      this.cForm.category3Id = "";
      this.category3List = [];
      this.$emit("changeCategory", { id: this.cForm.category2Id, level: 2 });
    },
    c3Ateg() {
      this.$emit("changeCategory", { id: this.cForm.category3Id, level: 3 });
    },
  },
};
</script>

<style lang="less" scoped>
</style>
