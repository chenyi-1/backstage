<template>
  <div>
    <el-card style="margin: 20px 0"
      ><CategorySelector @changeCategory="changeCategory" :isShow="isShow"
    /></el-card>
    <div v-show="isShow">
      <el-card>
        <el-button
          style="margin-bottom: 20px"
          type="primary"
          icon="el-icon-plus"
          @click="showAttrForm"
          >添加属性</el-button
        >
        <el-table :data="attrList" style="width: 100%" border>
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150">
          </el-table-column>
          <el-table-column prop="address" label="属性值列表">
            <template slot-scope="{ row }">
              <el-tag
                v-for="attrValueList in row.attrValueList"
                :key="attrValueList.id"
                style="margin-right: 10px"
                >{{ attrValueList.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="{ row }">
              <HintButton
                size="mini"
                title="编辑"
                type="primary"
                icon="el-icon-edit"
                @click="showAttrForm(row)"
              ></HintButton>
              <el-popconfirm
                :title="`你确定要删除${row.attrName}`"
                @onConfirm="deleteAtt(row.id)"
              >
                <HintButton
                  size="mini"
                  title="删除"
                  type="danger"
                  icon="el-icon-delete"
                  slot="reference"
                ></HintButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

    <div v-show="!isShow">
      <el-card>
        <el-form label-width="80px" style="width: 30%" :model="attrForm">
          <el-form-item label="属性名">
            <el-input
              v-model="attrForm.attrName"
              placeholder="请输入属性名"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          style="margin-bottom: 20px"
          type="primary"
          icon="el-icon-plus"
          :disabled="!attrForm.attrName"
          @click="addAttrValue"
          >添加属性</el-button
        >
        <el-button @click="show">取消</el-button>
        <el-table :data="attrForm.attrValueList" style="width: 100%" border>
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称">
            <template slot-scope="{ row }">
              <el-input
                ref="editInput"
                v-if="row.isEdit"
                v-model="row.valueName"
                placeholder="请输入属性值"
                @blur="toLook(row)"
              ></el-input>
              <div @click="toEdir(row)" v-else>{{ row.valueName }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{ row, $index }">
              <el-popconfirm
                :title="`你确定要删除${row.valueName}`"
                @onConfirm="deleteAttrValue($index)"
              >
                <HintButton
                  slot="reference"
                  size="mini"
                  title="删除"
                  type="danger"
                  icon="el-icon-delete"
                ></HintButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" style="margin-top: 20px" @click="seve"
          >保存</el-button
        >
        <el-button style="margin-top: 20px" @click="show">取消</el-button>
      </el-card>
    </div>
  </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";
const resetAttrForm = () => ({
  attrName: "",
  attrValueList: [],
  categoryId: 0,
  categoryLevel: 3,
});
export default {
  name: "Attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      attrList: [],
      isShow: true,
      attrForm: resetAttrForm(),
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
        this.getAttr();
      }
    },
    async getAttr() {
      const { category1Id, category2Id, category3Id } = this;
      const { data } = await this.$API.attr.attrInfoList(
        category1Id,
        category2Id,
        category3Id
      );
      this.attrList = data;
    },
    addAttrValue() {
      this.attrForm.attrValueList.push({
        attrId: this.attrForm.id,
        valueName: "",
        isEdit: true,
      });
    },
    showAttrForm(row) {
      if (row.id) {
        this.attrForm = cloneDeep(row);
        // lodash cloneDeep
        this.attrForm.attrValueList.forEach((item) => {
          this.$set(item, "isEdit", false);
        });
      }
      this.isShow = false;
    },
    show() {
      this.isShow = true;
    },
    toLook(row) {
      const valueName = row.valueName;
      const isReactive = this.attrForm.attrValueList.some((item) => {
        console.log(item);
        if (item !== row) {
          return item.valueName === valueName;
        }
      });

      if (isReactive) {
        this.$message.info("属性值名称已存在");
        return;
      }

      if (valueName) {
        row.isEdit = false;
        console.log(row.isEdit);
        return;
      }

      this.$message.info("属性值名称不能为空");
    },
    toEdir(row) {
      row.isEdit = true;
      console.log(row.isEdit);
      this.$nextTick(() => {
        this.$refs.editInput.focus();
      });
    },
    deleteAttrValue($index) {
      this.attrForm.attrValueList.splice($index, 1);
    },

    async seve() {
      const { category3Id, attrForm } = this;
      attrForm.categoryId = category3Id;

      if (!attrForm.attrName) {
        this.$message.info("属性名不能为空");
        return;
      }

      if (!attrForm.attrValueList.length !== 0) {
        this.$message.info("至少需要一个属性值");
        return;
      }

      attrForm.attrValueList.forEach((item) => {
        delete item.isEdit;
      });

      try {
        await this.$API.attr.addOrUpdate(attrForm);

        this.isShow = true;

        this.$message.success("保存成功");
        this.getAttr();
      } catch (error) {
        this.$message.info("保存失败");
      }
    },
    async deleteAtt(id) {
      try {
        await this.$API.attr.deleteAttr(id);
        this.$message.success("删除成功");
        this.getAttr();
      } catch (error) {
        this.$message.info("删除失败");
      }
    },
  },
  watch: {
    isShow(newValue) {
      if (newValue) {
        this.attrForm = resetAttrForm();
      }
    },
  },
};
</script>

<style lang="less" scoped>
</style>
