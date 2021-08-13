<template>
  <div>
    <el-card style="margin: 20px 0">
      <!-- :model="form" -->
      <el-form ref="form" label-width="80px">
        <el-form-item label="SPU名称">{{ spuForm.spuName }} </el-form-item>
        <el-form-item label="SKU名称">
          <!-- v-model="form.name" -->
          <el-input v-model="skuForm.skuName"></el-input>
        </el-form-item>
        <el-form-item label="价格(元)">
          <!-- v-model="form.name" -->
          <el-input type="number" v-model="skuForm.price"></el-input>
        </el-form-item>
        <el-form-item label="重量(千克)">
          <!-- v-model="form.name" -->
          <el-input type="number" v-model="skuForm.weight"></el-input>
        </el-form-item>
        <el-form-item label="规格描述">
          <!-- v-model="form.name" -->
          <el-input
            type="textarea"
            :rows="2"
            v-model="skuForm.skuDesc"
          ></el-input>
        </el-form-item>

        <el-form-item label="平台属性">
          <el-form-item
            :label="attr.attrName"
            v-for="attr in brand"
            :key="attr.id"
          >
            <!-- v-model="form.region" -->
            <el-select
              placeholder="请选择活动区域"
              v-model="attr.attrIdValueId"
            >
              <el-option
                :label="attrValue.valueName"
                :value="`${attr.id}:${attrValue.id}`"
                v-for="attrValue in attr.attrValueList"
                :key="attrValue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form-item>

        <el-form-item label="销售属性">
          <!-- :model="form" -->
          <el-form ref="form" label-width="80px" :inline="true">
            <el-form-item
              :label="salet.saleAttrName"
              v-for="salet in spuSaleAttrList"
              :key="salet.id"
            >
              <el-select
                placeholder="请选择活动区域"
                v-model="salet.attrIdValueId"
              >
                <el-option
                  :label="saletAttr.saleAttrValueName"
                  :value="`${salet.id}:${saletAttr.id}`"
                  v-for="saletAttr in salet.spuSaleAttrValueList"
                  :key="saletAttr.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-form-item>

        <el-form-item label="图片列表">
          <el-table
            :data="imagest"
            style="width: 100%"
            border
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column label="图片">
              <template slot-scope="{ row }">
                <img :src="row.imgUrl" style="height: 100px; width: 100px" />
              </template>
            </el-table-column>
            <el-table-column prop="imgName" label="名称"> </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="{ row }">
                <el-button
                  type="primary"
                  v-if="row.isDefault === '0'"
                  @click="isShows(row)"
                  >设为默认</el-button
                >
                <el-tag type="success" v-else>默认</el-tag>
              </template>
            </el-table-column>
          </el-table>

          <el-button type="primary" style="margin-top: 20px" @click="save"
            >保存</el-button
          >
          <el-button style="margin-top: 20px" @click="comrt">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { validUsername } from "@/utils/validate";
export default {
  name: "SkuForm",
  data() {
    return {
      skuForm: {
        category3Id: 0,
        tmId: "",
        spuId: "",

        //v-model
        skuName: "",
        price: "",
        weight: "",
        skuDesc: "",

        skuAttrValueList: [],
        skuDefaultImg: "",
        skuImageList: [],
        skuSaleAttrValueList: [],
      },
      category1Id: "",
      category2Id: "",
      category3Id: "",
      spuForm: {},
      brand: [],
      spuSaleAttrList: [],
      imagest: [],
      selectedImageList: [],
    };
  },
  props: ["visible"],

  methods: {
    async initAddSkuForm(spu, category1Id, category2Id, category3Id) {
      this.spuForm = spu;
      this.category1Id = category1Id;
      this.category2Id = category2Id;
      this.category3Id = category3Id;

      const promise1 = this.$API.attr.attrInfoList(
        category1Id,
        category2Id,
        category3Id
      );

      const promise2 = this.$API.sku.getSpuSaleAttrList(spu.id);

      const promise3 = this.$API.sku.getSpuImageList(spu.id);
      console.log(promise3);

      const result = await Promise.all([promise1, promise2, promise3]);

      this.brand = result[0].data;
      this.spuSaleAttrList = result[1].data;
      const imagest = result[2].data;
      imagest.forEach((item) => {
        item.isDefault = "0";
      });

      this.imagest = imagest;
      console.log(this.imagest);
    },

    comrt() {
      this.$emit("update:visible", false);
      this.$emit("comrt");
    },

    isShows(row) {
      row.isDefault = "1";
      console.log(this.imagest);
      this.skuForm.skuDefaultImg = row.imgUrl;
    },

    handleSelectionChange(val) {
      console.log(validUsername);
      this.selectedImageList = val;
    },

    async save() {
      const {
        skuForm,
        spuForm,
        category3Id,
        spuSaleAttrList,
        selectedImageList,
        brand,
      } = this;
      skuForm.category3Id = category3Id;
      skuForm.tmId = spuForm.tmId;
      skuForm.spuId = spuForm.id;

      skuForm.skuAttrValueList = brand.reduce((pre, attr) => {
        const attrIdValueId = attr.attrIdValueId;

        if (attrIdValueId) {
          const [attrId, valueId] = attrIdValueId.split(":");
          pre.push({
            attrId,
            valueId,
          });
        }
        return pre;
      }, []);
      skuForm.skuSaleAttrValueList = spuSaleAttrList.reduce((pre, saleAttr) => {
        const attrIdValueId = saleAttr.attrIdValueId;
        if (attrIdValueId) {
          const [saleAttrId, saleAttrValueId] = attrIdValueId.split(":");
          pre.push({
            saleAttrId,
            saleAttrValueId,
          });
        }
        return pre;
      }, []);

      skuForm.skuImageList = selectedImageList.map((item) => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id,
        };
      });

      try {
        await this.$API.sku.addOrUpdate(skuForm);
        this.$message.success("保存成功");
        this.$emit("update:visible", false);
        this.resetData();
      } catch (error) {
        console.log(error);
      }
    },

    resetData() {
      Object.assign(this.$data, this.$options.data());
    },
  },
};
</script>

<style lang="less" scoped>
</style>
