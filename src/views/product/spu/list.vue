<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySelector @changeCategory="changeCategory" :isShow="isShow" />
    </el-card>

    <div v-show="isShow">
      <el-card style="margin: 20px 0">
        <el-button
          style="margin-bottom: 20px"
          type="primary"
          icon="el-icon-plus"
          @click="addTo"
          >添加spu</el-button
        >

        <el-table :data="recspu" style="width: 100%" border>
          <el-table-column type="index" label="序号" width="80">
          </el-table-column>
          <el-table-column prop="spuName" label="SPU名称"> </el-table-column>
          <el-table-column prop="description" label="SPU描述">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{ row }">
              <HintButton
                type="success"
                icon="el-icon-plus"
                size="mini"
                title="添加SKU"
                @click="addTot(row)"
              />
              <HintButton
                type="primary"
                icon="el-icon-edit"
                size="mini"
                title="修改SPU"
                @click="addTo(row)"
              />

              <HintButton
                type="info"
                icon="el-icon-warning"
                size="mini"
                title="查看SKU列表"
                @click="alogVisible(row)"
              />
              <el-popconfirm
                :title="`这是一段${row.spuName}确定删除吗？`"
                @onConfirm="deleteSpu(row.id)"
              >
                <HintButton
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除SPU"
                />
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          style="text-align: center"
          :current-page="page"
          :page-sizes="[2, 5, 10]"
          :page-size="limit"
          layout="prev, pager, next, jumper,->,sizes,total"
          :total="total"
        >
        </el-pagination>
      </el-card>
    </div>

    <div>
      <el-dialog
        :title="`${spu.spuName}=>SKU列表`"
        :visible.sync="dialogVisible"
        width="50%"
      >
        <el-table :data="skuList" style="width: 100%" border>
          <el-table-column prop="skuName" label="名称" width="180">
          </el-table-column>
          <el-table-column prop="price" label="价格(元)" width="180">
          </el-table-column>
          <el-table-column prop="weight" label="重量(KG)" width="180">
          </el-table-column>
          <el-table-column label="默认图片" width="180">
            <template slot-scope="{ row }">
              <img
                :src="row.skuDefaultImg"
                style="width: 100px; height: 100px"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </div>

    <SkuForm v-show="isShowSku" ref="skuForm" :visible.sync="isShowSku" />
    <SpuForm
      v-show="isShowSpu"
      ref="spuForm"
      :category3Id="category3Id"
      :visible.sync="isShowSpu"
      @success="successSpuForm"
      @cancel="cancelSpuForm"
    />
  </div>
</template>

<script>
import SkuForm from "./components/SkuForm.vue";
import SpuForm from "./components/SpuForm.vue";
export default {
  name: "SPU",
  components: {
    SkuForm,
    SpuForm,
  },
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      page: 1,
      limit: 5,
      total: 20,
      recspu: [],
      isShowSku: false,
      isShowSpu: false,
      dialogVisible: false,
      skuList: [],
      spu: {},
    };
  },

  methods: {
    changeCategory({ id, level }) {
      if (level === 1) {
        this.category1Id = id;
        this.category2Id = "";
        this.category3Id = "";
      } else if (level === 2) {
        this.category2Id = id;
        this.category3Id = "";
      } else if (level === 3) {
        this.category3Id = id;
        this.changeSpu();
      }
    },
    async changeSpu() {
      const {
        data: { total, records },
      } = await this.$API.spu.getSpuList(
        this.page,
        this.limit,
        this.category3Id
      );
      this.recspu = records;
      this.total = total;
    },
    handleSizeChange(value) {
      this.limit = value;
      this.changeSpu();
    },
    handleCurrentChange(value) {
      this.page = value;
      this.changeSpu();
    },
    addTo(row) {
      this.isShowSpu = true;

      if (row.id) {
        this.flag = true;
        this.$refs.spuForm.initUpdateSpuForm(row);
      } else {
        this.$refs.spuForm.initAddSpuForm();
      }
    },
    successSpuForm() {
      if (this.flag) {
        this.changeSpu();
      } else {
        this.changeSpu(1);
      }
      this.flag = null;
    },
    cancelSpuForm() {
      this.flag = null;
    },
    addTot(row) {
      this.isShowSku = true;
      const { category1Id, category2Id, category3Id } = this;
      this.$refs.skuForm.initAddSkuForm(
        row,
        category1Id,
        category2Id,
        category3Id
      );
    },
    async deleteSpu(id) {
      try {
        await this.$API.spu.deleteSpu(id);
        this.$message.success("删除成功");
        this.changeSpu();
      } catch (error) {
        this.$message.info("删除失败");
      }
    },

    async alogVisible(row) {
      this.dialogVisible = true;
      this.spu = row;
      const { data } = await this.$API.sku.getSkuList(row.id);

      this.skuList = data;
    },
  },

  computed: {
    isShow() {
      const { isShowSku, isShowSpu } = this;
      return !isShowSku && !isShowSpu;
    },
  },
};
</script>

<style lang="less" scoped>
</style>
