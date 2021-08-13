<template>
  <div>
    <el-button
      style="margin-top: 20px"
      type="primary"
      icon="el-icon-plus"
      @click="showDialog"
      >添加</el-button
    >
    <el-table :data="trademarkList" border style="width: 100%; margin: 20px 0">
      <el-table-column label="序号" type="index" width="80" align="center">
      </el-table-column>
      <el-table-column label="品牌名称" prop="tmName"> </el-table-column>
      <el-table-column label="品牌LOGO">
        <template slot-scope="{ row }">
          <img
            :src="row.logoUrl"
            style="width: 100px; height: 80px"
            alt=""
            srcset=""
          />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{ row }">
          <el-button
            type="warning"
            size="mini"
            icon="el-icon-edit"
            @click="showDialog(row)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="delelArr(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!--
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange" -->
    <el-pagination
      style="text-align: center"
      :current-page="page"
      :page-sizes="[2, 3, 10]"
      :page-size="limit"
      layout="prev, pager, next, jumper, -> , sizes, total"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    >
    </el-pagination>

    <el-dialog
      :title="tmForm.id ? '修改品牌' : '添加品牌'"
      style="width: 80%"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="tmForm" :rules="rules">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input v-model="tmForm.tmName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <!-- 此处的action需要填写图片上传的网络路径,但是记得加上前缀/dev-api -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div class="el-upload__tip" slot="tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "TradeMark",
  data() {
    return {
      page: 1,
      limit: 3,
      total: 15,
      dialogFormVisible: false,
      trademarkList: [],
      tmForm: {
        tmName: "",
        logoUrl: "",
      },
      imageUrl: "",
      rules: {
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        logoUrl: [{ required: true, message: "请选择图片", trigger: "blur" }],
      },
    };
  },
  mounted() {
    this.getTradeMarkList();
  },
  methods: {
    async getTradeMarkList(page) {
      const {
        data: { total, records },
      } = await this.$API.trademark.getTradeMarkList(
        page ? page : this.page,
        this.limit
      );
      this.total = c;
      if (page) {
        this.page = page;
      }
      this.trademarkList = records;
      console.log(records);
    },
    handleCurrentChange(vaule) {
      this.page = vaule;
      this.getTradeMarkList();
    },
    handleSizeChange(vaule) {
      this.limit = vaule;
      this.getTradeMarkList();
    },
    handleAvatarSuccess(res, file) {
      this.tmForm.logoUrl = res.data;
    },
    beforeAvatarUpload(file) {
      const types = ["image/jpeg", "image/jpg", "image/png"];
      const isJPG = types.includes(file.type);
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },

    showDialog(row) {
      if (row.id) {
        this.tmForm = {
          ...row,
        };
      }
      console.log("row", row);
      this.dialogFormVisible = true;
    },
    async save() {
      try {
        await this.$API.trademark.addOrUpdate(this.tmForm);
        this.getTradeMarkList();
        this.$message({
          message: "保存成功!!!",
          type: "success",
        });

        this.dialogFormVisible = false;

        this.tmForm = {
          tmName: "",
          logoUrl: "",
        };
      } catch (error) {
        this.$message("保存失败!!!");
      }
    },

    cancel() {
      this.dialogFormVisible = false;
      this.tmForm = {
        tmName: "",
        logoUrl: "",
      };
    },
    delelArr(row) {
      this.$confirm(`此操作将永久删除${row.tmName}, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          try {
            await this.$API.trademark.deleteTradeMark(row.id);
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getTradeMarkList(
              this.trademarkList.length > 1 ? this.page : this.page - 1
            );
          } catch (error) {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          }
        })
        .catch(() => {
          // 如果用户点击取消按钮,会执行.catch内部的代码
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
