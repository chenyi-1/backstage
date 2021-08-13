<template>
  <div>
    <el-card style="margin: 20px 0">
      <el-form ref="form" :model="spuInfo" label-width="80px">
        <el-form-item label="SPU名称">
          <el-input v-model="spuInfo.spuName"></el-input>
        </el-form-item>
        <el-form-item label="品牌">
          <el-select v-model="spuInfo.tmId" placeholder="请选择活动区域">
            <el-option
              :label="c1.tmName"
              value="shanghai"
              v-for="c1 in getTrade"
              :key="c1.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="SPU描述">
          <el-input
            type="textarea"
            v-model="spuInfo.description"
            rows="4"
          ></el-input>
        </el-form-item>

        <el-form-item label="SPU图片">
          <el-upload
            action="/dev-api/admin/product/fileUpload"
            list-type="picture-card"
            :file-list="spuImageList"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <!-- :visible.sync="dialogVisible" -->
          <el-dialog :visible.sync="dialogVisible">
            <!-- :src="dialogImageUrl" -->
            <img width="100%" alt="" :src="dialogImageUrl" />
          </el-dialog>
        </el-form-item>

        <el-form-item label="销售属性">
          <el-select
            v-model="spuSaleAttrStr"
            placeholder="请选择活动区域"
            :placeholder="
              unUseSaleAttrList.length
                ? `还有${unUseSaleAttrList.length}个未选中`
                : '没有了'
            "
          >
            <el-option
              v-for="unUseSaleAttr in unUseSaleAttrList"
              value="shanghai"
              :key="unUseSaleAttr.id"
              :label="unUseSaleAttr.name"
              :value="`${unUseSaleAttr.name}:${unUseSaleAttr.id}`"
            ></el-option>
          </el-select>
          <el-button
            type="primary"
            icon="el-icon-plus"
            @click="addSaleAttr"
            :disabled="!spuSaleAttrStr"
            >添加销售属性</el-button
          >

          <el-table :data="spuInfo.spuSaleAttrList" style="width: 100%" border>
            <el-table-column
              type="index"
              label="序号"
              align="center"
              width="80"
            >
            </el-table-column>
            <el-table-column prop="saleAttrName" label="属性名">
            </el-table-column>
            <el-table-column label="属性值名称列表">
              <template slot-scope="{ row }">
                <el-tag
                  :key="saleAttrName.id"
                  v-for="(saleAttrName, index) in row.spuSaleAttrValueList"
                  closable
                  :disable-transitions="false"
                  @close="deleteAttr(row, index)"
                >
                  {{ saleAttrName.saleAttrValueName }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="row.inputVisible"
                  v-model="row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(row)"
                  @blur="handleInputConfirm(row)"
                >
                </el-input>
                <!-- @click="showInput" -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="{ row, $index }">
                <HintButton
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除SPU"
                  @click="deleteAttr($index)"
                />
              </template>
            </el-table-column>
          </el-table>
          <el-button type="primary" @click="save">保存</el-button>
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "SpuForm",
  data() {
    return {
      spuInfo: {
        category3Id: 0,
        description: "",
        spuName: "",
        tmId: "",
        spuImageList: [],
        spuSaleAttrList: [],
      },
      inputVisible: false,
      dialogVisible: false,
      saleAttrValueName: "",
      spuSaleAttrStr: "",
      getTrade: [],
      spuImageList: [],
      spuSaleAttrList: [],
      inputValue: "",
      dialogImageUrl: "",
    };
  },
  props:["category3Id","visible"],

  methods: {
    initAddSpuForm() {
      this.getTradeMarks();
      this.getBaseSaleAttrList();
    },
    initUpdateSpuForm(row) {
      this.getSpuInfo(row.id);
      this.getSpuImageList(row.id);
      this.getTradeMarks();
      this.getBaseSaleAttrList();
    },
    async getSpuInfo(id) {
      const { data } = await this.$API.spu.getSpuInfo(id);
      this.spuInfo = data;
    },
    async getSpuImageList(id) {
      const { data } = await this.$API.sku.getSpuImageList(id);
      console.log(data);
      data.forEach((imgObj) => {
        imgObj.name = imgObj.imgName;
        imgObj.url = imgObj.imgUrl;
      });
      this.spuImageList = data;
    },
    async getBaseSaleAttrList() {
      const { data } = await this.$API.spu.getBaseSaleAttrList();
      this.spuSaleAttrList = data;
    },
    async getTradeMarks() {
      const { data } = await this.$API.trademark.getTradeMarks();
      this.getTrade = data;
    },
    handleRemove(file, fileList) {
      this.spuInfo.spuImageList = fileList;
    },
    handlePictureCardPreview(file) {
      console.log(file);
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleSuccess(response, file, fileList) {
      this.spuInfo.spuImageList = fileList;
    },
    addSaleAttr() {
      const { spuSaleAttrStr } = this;
      const [saleAttrName, baseSaleAttrId] = spuSaleAttrStr.split(":");
      this.spuInfo.spuSaleAttrList.push({
        saleAttrName,
        baseSaleAttrId,
        spuSaleAttrValueList: [],
      });
      this.spuSaleAttrStr = "";
    },
    showInput(row) {
      console.log(row);
      this.$set(row, "inputVisible", true);

      this.$nextTick((_) => {
        this.$refs.saveTagInput.focus();
      });
    },
    handleInputConfirm(row) {
      const { inputValue } = row;

      if (!inputValue.trim()) {
        this.$message.info("属性值不能为空,请注意!");
        return;
      }

      const isRepeat = row.spuSaleAttrValueList.some((item) => {
        return item.saleAttrValueName === inputValue;
      });

      if (isRepeat) {
        this.$message.info("属性值已存在,添加失败!");
        return;
      }

      row.inputVisible = false;
      const obj = {
        baseSaleAttrId: row.baseSaleAttrId,
        saleAttrValueName: row.inputValue,
      };

      row.spuSaleAttrValueList.push(obj);

      row.inputValue = "";
    },
    deleteAttr($index) {
      this.spuInfo.spuSaleAttrList.splice($index, 1);
    },
    cancel(){
      this.$emit("update:visible",false)
      this.resetData()
      this.$emit("cancel");
    },
    resetData() {
      Object.assign(this.$data, this.$options.data());
    },
    async save() {
      const { spuInfo, category3Id, spuImageList } = this;

      spuInfo.category3Id = category3Id;

      spuInfo.spuImageList = spuInfo.spuImageList || spuImageList;

      spuInfo.spuImageList = spuInfo.spuImageList.map((imgObj) => {
        if (imgObj.imgUrl) {
          delete imgObj.name;
          delete imgObj.url;
          return imgObj;
        } else {
          return {
            imgName: imgObj.name,
            imgUrl: imgObj.response.data,
          };
        }
      });

      spuInfo.spuSaleAttrList.forEach((item) => {
        delete item.inputValue;
        delete item.inputVisible;
      });

      try {
        await this.$API.spu.addOrUpdate(spuInfo);
        this.$message.success("保存成功");
        this.$emit("update:visible", false);
        this.resetData();
        this.$emit("success");
      } catch (error) {
        this.$message.info("保存失败");
      }
    },
  },

  computed: {
    unUseSaleAttrList() {
      const { spuSaleAttrList: baseSaleAttrList, spuInfo } = this;
      const { spuSaleAttrList } = spuInfo;

      const saleAttrObj = {};

      spuSaleAttrList.forEach((item) => {
        saleAttrObj[item.baseSaleAttrId] = true;
      });

      const unUseList = baseSaleAttrList.filter((item) => {
        return !saleAttrObj[item.id];
      });

      return unUseList;
    },
  },
};
</script>

<style >
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
