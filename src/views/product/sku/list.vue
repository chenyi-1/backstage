<template>
  <div>
    <el-card style="margin: 20px 0">
      <el-table :data="skuListL" style="width: 100%" border>
        <el-table-column type="index" label="序号" width="80">
        </el-table-column>
        <el-table-column prop="skuName" label="名称"> </el-table-column>
        <el-table-column prop="skuDesc" label="描述"> </el-table-column>
        <el-table-column label="默认图片">
          <template slot-scope="{ row }">
            <img :src="row.skuDefaultImg" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
        <el-table-column prop="weight" label="重量(KG)" width="100">
        </el-table-column>
        <el-table-column prop="price" label="价格(元)" width="100">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{ row }">
            <HintButton
              v-if="row.id !== id"
              type="success"
              size="mini"
              title="上架"
              icon="el-icon-top"
              @click="canCelSale(row.id)"
            />
            <HintButton
              v-else
              type="info"
              size="mini"
              title="下架"
              icon="el-icon-bottom"
              @click="onSaale(row.id)"
            />
            <HintButton
              type="primary"
              icon="el-icon-edit"
              size="mini"
              title="修改"
            />
            <HintButton
              type="info"
              icon="el-icon-warning"
              size="mini"
              title="查看详情"
              @click="alogVisible(row.id)"
            />
            <el-popconfirm
              :title="`这是一段${row.skuName}确定删除吗？`"
              @onConfirm="deleted(row.id)"
              style="margin-left: 10px"
            >
              <HintButton
                slot="reference"
                type="danger"
                icon="el-icon-delete"
                size="mini"
                title="删除"
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

    <div>
      <el-drawer :visible.sync="drawer" direction="rtl" size="50%">
        <el-form ref="form" style="margin-left: 100px">
          <el-form-item label="名称">{{ viewDetails.skuName }}</el-form-item>
          <el-form-item label="描述">{{ viewDetails.skuDesc }}</el-form-item>
          <el-form-item label="价格">{{ viewDetails.price }}</el-form-item>
          <el-form-item label="平台属性">
            <el-tag
              >{{ skuValueList.attrId }}-{{ skuValueList.valueId }}</el-tag
            >
          </el-form-item>
          <el-form-item label="商品图片">
            <div class="block">
              <el-carousel trigger="click" height="400px" style="width: 400px">
                <el-carousel-item
                  v-for="item in viewDetails.skuImageList"
                  :key="item.id"
                >
                  <img :src="item.imgUrl" />
                </el-carousel-item>
              </el-carousel>
            </div>
          </el-form-item>
        </el-form>
      </el-drawer>
    </div>
  </div>
</template>

<script>
export default {
  name: "SKU",
  data() {
    return {
      page: 1,
      limit: 5,
      total: 20,
      skuListL: [],
      drawer: false,
      viewDetails: {},
      skuValueList: {},
      isShow: true,
      id: "",
    };
  },

  mounted() {
    this.getSkuList();
  },

  methods: {
    async getSkuList() {
      const {
        data: { total, records },
      } = await this.$API.sku.getList(this.page, this.limit);
      this.skuListL = records;
      this.total = total;
    },

    handleSizeChange(value) {
      this.limit = value;
      this.getSkuList();
    },
    handleCurrentChange(value) {
      this.page = value;
      this.getSkuList();
    },

    async deleted(id) {
      try {
        await this.$API.sku.remove(id);
        this.getSkuList();
        this.$message.success("删除成功");
      } catch (error) {
        this.$message.info("删除失败");
      }
    },

    async alogVisible(id) {
      this.drawer = true;
      const { data } = await this.$API.sku.get(id);
      console.log(data);
      this.viewDetails = data;
      this.skuValueList = data.skuAttrValueList;
    },

    async canCelSale(id) {
      console.log(id);
      try {
        this.id = id;
        await this.$API.sku.onSale(id);
        this.$message.success("上架成功");
      } catch (e) {
        this.$message.info("上架失败");
      }
    },

    async onSaale(id) {
      try {
        this.id = id;
        await this.$API.sku.cancelSale(id);
        this.$message.success("下架成功");
      } catch (e) {
        this.$message.info("下架失败");
      }
    },
  },
};
</script>

<style>
.block img {
  height: 400px;
  width: 400px;
}
</style>


