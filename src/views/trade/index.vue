<template>
  <div class="app-container">
    <div class="panel">
      <el-row>
        <el-button type="primary" size="small" @click="addTab">
          添加组合
        </el-button>
        <el-button type="normal" size="small" @click="addTab">
          管理组合
        </el-button>
      </el-row>

      <el-tabs
        style="margin-top: 15px"
        v-model="editableTabsValue"
        @tab-remove="removeTab"
      >
        <el-tab-pane
          v-for="item in editableTabs"
          :key="item.name"
          :label="item.title"
          :name="item.name"
          :closable="item.close"
        >
          <component :is="item.content" :objId="item.name"></component>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 添加标签页弹层 -->
    <el-dialog
      title="添加新标签"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-input v-model="addTagsValue" placeholder="请填写标签名称"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose" size="small">取 消</el-button>
        <el-button
          type="primary"
          size="small"
          @click="makeSureAddTags(editableTabsValue)"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import compose from "./compose.vue";
export default {
  data() {
    return {
      // 动态标签页配置
      editableTabsValue: "1",
      editableTabs: [
        {
          title: "会议议程",
          name: "1",
          content: compose,
          close: false,
        },
        {
          title: "会场介绍",
          name: "2",
          content: compose,
          close: false,
        },
      ],
      tabIndex: 2,
      dialogVisible: false, //添加新标签dialog状态
      addTagsValue: "", //添加新标签绑定值
    };
  },
  methods: {
    addTab() {
      this.dialogVisible = true;
    },
    removeTab(targetName) {
      let tabs = this.editableTabs;
      let activeName = this.editableTabsValue;
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
            }
          }
        });
      }

      this.editableTabsValue = activeName;
      this.editableTabs = tabs.filter((tab) => tab.name !== targetName);
    },
    makeSureAddTags(targetName) {
      console.log(targetName);
      if (this.addTagsValue === "") {
        this.$message({
          message: "标签名称不能为空",
          type: "error",
        });
        return;
      }
      if (this.addTagsValue.trim().length > 6) {
        this.$message({
          message: "标签名称最多6个字",
          type: "error",
        });
        return;
      }
      if (this.editableTabs.length > 5) {
        this.$message({
          message: "标签最多添加6个",
          type: "error",
        });
        return;
      }
      let newTabName = ++this.tabIndex + "";
      this.editableTabs.push({
        title: this.addTagsValue, //标签名
        name: newTabName,
        content: compose, //对应组件名称
        close: true,
      });
      this.editableTabsValue = newTabName;
      this.$message({
        message: "标签添加成功",
        type: "success",
      });
      this.handleClose(); // 初始化弹层
    },
    handleClose() {
      this.dialogVisible = false;
      this.addTagsValue = "";
    },
  },
};
</script>