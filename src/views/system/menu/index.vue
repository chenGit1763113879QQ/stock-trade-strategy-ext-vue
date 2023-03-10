<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item label="菜单名称">
        <el-input v-model="queryParams.menuName"
                  placeholder="请输入菜单名称"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="queryParams.visible"
                   placeholder="菜单状态"
                   clearable
                   size="small">
          <el-option v-for="opt in visibleOptions"
                     :key="opt.value"
                     :label="opt.label"
                     :value="opt.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   icon="el-icon-search"
                   size="mini"
                   @click="handleQuery"
                   >搜索</el-button>
        <el-button type="primary"
                   icon="el-icon-plus"
                   size="mini"
                   @click="handleAdd"
                   >新增</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading"
              :data="menuList"
              row-key="id"
              :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column prop="menuName"
                       label="菜单名称"
                       show-overflow-tooltip
                       width="230px"></el-table-column>
      <el-table-column prop="icon"
                       label="图标"
                       align="center"
                       width="100px">
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.icon" />
        </template>
      </el-table-column>
      <el-table-column prop="orderNum"
                       label="排序"
                       width="60px"></el-table-column>
      <el-table-column prop="perms"
                       label="权限标识"
                       width="300px"
                       show-overflow-tooltip></el-table-column>
      <el-table-column prop="component"
                       label="组件路径"
                       width="180px"
                       show-overflow-tooltip></el-table-column>
      <el-table-column prop="visible"
                       label="可见"
                       :formatter="visibleFormat"
                       width="80px"></el-table-column>
      <el-table-column label="创建时间"
                       align="center"
                       prop="createTime"
                       width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       align="center"
                       width="300"
                       class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini"
                     type="text"
                     icon="el-icon-edit"
                     @click="handleUpdate(scope.row)"
                     >修改</el-button>
          <el-button size="mini"
                     type="text"
                     icon="el-icon-plus"
                     @click="handleAdd(scope.row)">新增</el-button>
          <el-button size="mini"
                     type="text"
                     icon="el-icon-delete"
                     @click="handleDelete(scope.row)">删除</el-button>
          <!-- <el-button v-if="(scope.row.menuType === 'F')"
                     size="mini"
                     type="text"
                     icon="el-icon-setting"
                     @click="handleBind(scope.row)">绑定API</el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改菜单对话框 -->
    <el-dialog :title="title"
               :visible.sync="open"
               :close-on-click-modal="false"
               width="600px">
      <el-form ref="form"
               :model="form"
               :rules="rules"
               label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级菜单">
              <treeselect v-model="form.parentId"
                          :options="menuOptions"
                          :show-count="true"
                          placeholder="选择上级菜单" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="菜单类型"
                          prop="menuType">
              <el-radio-group v-model="form.menuType">
                <el-radio label="M">目录</el-radio>
                <el-radio label="C">菜单</el-radio>
                <el-radio label="F">按钮</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item v-if="form.menuType != 'F'"
                          label="菜单图标">
              <el-popover placement="bottom-start"
                          width="460"
                          trigger="click"
                          @show="$refs['iconSelect'].reset()">
                <IconSelect ref="iconSelect"
                            @selected="selected" />
                <el-input slot="reference"
                          v-model="form.icon"
                          placeholder="点击选择图标"
                          readonly>
                  <svg-icon v-if="form.icon"
                            slot="prefix"
                            :icon-class="form.icon"
                            class="el-input__icon"
                            style="height: 32px;width: 16px;" />
                  <i v-else
                     slot="prefix"
                     class="el-icon-search el-input__icon" />
                </el-input>
              </el-popover>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单名称"
                          prop="menuName">
              <el-input v-model="form.menuName"
                        placeholder="请输入菜单名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序"
                          prop="orderNum">
              <el-input-number v-model="form.orderNum"
                               controls-position="right"
                               :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.menuType != 'F'"
                          label="路由名称"
                          prop="path">
              <el-input v-model="form.routerName"
                        :disabled="!isDev"
                        placeholder="请输入路由名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.menuType != 'F'"
                          label="路由地址"
                          prop="path">
              <el-input v-model="form.path"
                        placeholder="请输入路由地址" />
            </el-form-item>
          </el-col>
          <el-col :span="12"
                  v-if="form.menuType == 'C'">
            <el-form-item label="组件路径"
                          prop="component">
              <el-input v-model="form.component"
                        placeholder="请输入组件路径" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.menuType != 'M'"
                          label="权限标识">
              <el-input v-model="form.perms"
                        placeholder="请权限标识"
                        maxlength="100" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.menuType != 'F'"
                          label="是否外链">
              <el-radio-group v-model="form.isFrame">
                <el-radio label="0">是</el-radio>
                <el-radio label="1">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item v-if="form.menuType != 'F'"
                          label="菜单状态">
              <el-radio-group v-model="form.visible">
                <el-radio :label="1">显示</el-radio>
                <el-radio :label="0">隐藏</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer">
        <el-button size="small" @click="cancel">取 消</el-button>
        <el-button type="primary"
                   size="small"
                   @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogVisible2"
               :close-on-click-modal="false"
               width="620px">
      <!-- <div class="binded-wrapper">
        <h5>已绑定APIURL列表：</h5>
        <div class="binded-item"
             v-for="(item, index) in apiBindedUrlList"
             :key="index">
          <span style="margin-right:10px;">{{ item }}</span>
          <el-button size="mini"
                     type="text"
                     icon="el-icon-delete"
                     @click="deleteBindApiUrl()">删除</el-button>
        </div>
      </div> -->
      <!-- <div class="bind-wrapper">
        <h5>新增绑定APIURL：</h5>
        <span>URL地址</span>
        <el-select v-model="apiUrlForm.url"
                   placeholder="输入 / 搜索"
                   filterable
                   size="small"
                   style="width:400px;margin:0 10px;">
          <el-option v-for="info in apiUrlInfos"
                     :key="info.value"
                     :label="info.label"
                     :value="info.value" />
        </el-select>
        <el-button type="primary"
                   @click="apiBindSubmit"
                   :loading="apiBindLoading">绑定</el-button>
      </div> -->
    </el-dialog>
  </div>
</template>

<script>
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import IconSelect from "@/components/IconSelect";


import { getMenuList,menuTreeSelectList,getMenuDetail,addMenu,updateMenu,deleteMenu } from '@/api/menu'

export default {
  name: "Menu",
  components: { Treeselect, IconSelect },
  data () {
    return {
      // 遮罩层
      loading: true,
      // 菜单表格树数据
      menuList: [],
      // 菜单树选项
      menuOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 菜单状态
      visibleOptions: [
        {
          label: '显示',
          value: '1'
        },
        {
          label: '隐藏',
          value: '0'
        }
      ],
      // 查询参数
      queryParams: {
        menuName: undefined,
        visible: undefined
      },
      // 表单参数
      form: {
        visible: 0
      },
      // 表单校验
      rules: {
        menuName: [
          { required: true, message: "菜单名称不能为空", trigger: "blur" }
        ],
        orderNum: [
          { required: true, message: "菜单顺序不能为空", trigger: "blur" }
        ]
      },

      dialogVisible2: false,
      apiBindLoading: false,
      apiUrlForm: {
        url: '',
        menuId: ''
      },
      apiUrlInfos: [],
      apiBindedUrlList: [],
      isDev: process.env.NODE_ENV === 'development'
    };
  },
  created () {
    this.getList();
  },
  methods: {
    // 选择图标
    selected (name) {
      this.form.icon = name;
    },
    /** 查询菜单列表 */
    async getList () {
      this.loading = true;
      let res = await getMenuList(this.queryParams);
      this.menuList = res.data;
      this.loading = false;
    },

    /** 查询菜单下拉树结构 */
    async getTreeselect () {
      let res = await menuTreeSelectList();
      this.menuOptions = [];
      const menu = { id: 0, label: '主类目', children: [] };
      menu.children = res.data;
      this.menuOptions.push(menu);
    },

    // 菜单显示状态字典翻译
    visibleFormat (row, column) {
      if (row.menuType == "F") {
        return "";
      }

      return row.visible === 1 ? '显示' : '隐藏';
    },

    // 取消按钮
    cancel () {
      this.open = false;
      this.reset();
    },

    // 表单重置
    reset () {
      this.form = {
        menuId: undefined,
        parentId: 0,
        menuName: undefined,
        icon: undefined,
        menuType: "M",
        orderNum: undefined,
        isFrame: "1",
        visible: 0
      };
      if (this.$refs.form) {
        this.$refs.form.resetFields();
      }
    },

    /** 搜索按钮操作 */
    handleQuery () {
      this.getList();
    },

    /** 新增按钮操作 */
    handleAdd (row) {
      this.reset();
      this.getTreeselect();
      if (row != null) {
        this.form.parentId = row.id;
      }
      this.open = true;
      this.title = "添加菜单";
    },

    /** 修改按钮操作 */
    async handleUpdate (row) {
      this.reset();
      this.getTreeselect();
      let params = {
        menuId: row.id
      }
      let res = await getMenuDetail(params);
      this.form = res.data;
      this.form.menuId = res.data.id;
      this.open = true;
      this.title = "修改菜单";
    },

    /* 绑定API */
    async handleBind (row) {
      // 获取API列表
    //   if (this.apiUrlInfos.length === 0) {
    //     let params = {
    //       pageIndex: 1,
    //       pageSize: 10000
    //     }
    //     let res = await this.$http.System.getApiInfos(params);
    //     if (Array.isArray(res.list)) {
    //       res.list.forEach((item) => {
    //         let apiInfo = {
    //           label: item.apiUrl,
    //           value: item.apiUrl
    //         }
    //         this.apiUrlInfos.push(apiInfo);
    //       })
    //     }
    //   }

    //   // 已关联API列表
    //   let params = {
    //     menuId: row.menuId
    //   }
    //   this.$http.System.getBindedApiInfos(params).then((res) => {
    //     this.apiBindedUrlList = res;
    //   });

    //   this.apiUrlForm.url = '';
    //   this.apiUrlForm.menuId = row.menuId;
    //   this.dialogVisible2 = true;
    // },
    // async apiBindSubmit () {
    //   this.apiBindLoading = true;
    //   let params = {
    //     apiUrl: this.apiUrlForm.url,
    //     menuId: this.apiUrlForm.menuId
    //   }
    //   await this.$http.System.bindApiUrl(params).catch((err) => {
    //     this.apiBindLoading = false;
    //     throw err;
    //   });
    //   this.apiBindLoading = false;
    //   this.dialogVisible2 = false;
    //   this.msgSuccess('绑定成功！');
    },
    /* 删除绑定apiURL */
    deleteBindApiUrl () {

    },

    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(async (valid) => {
        if (valid) {
          let params = {
            ...this.form
          }

          if (this.form.menuId != undefined) {
            let res = await updateMenu(params).catch((err) => {
              this.msgError(err.message);
              err.done = true;
              throw err;
            });
            this.msgSuccess("修改成功");
          } else {
            let res = await addMenu(params).catch((err) => {
              this.msgError(err.message);
              err.done = true;
              throw err;
            });
            this.msgSuccess("新增成功");
          }
          this.open = false;
          this.getList();
        }
      });
    },

    /** 删除按钮操作 */
    handleDelete (row) {
      this.$confirm('是否确认删除名称为"' + row.menuName + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        let params = {
          menuId: row.id
        }
        let res = await deleteMenu(params).catch((err) => {
          this.msgError(err.message);
          throw err;
        });
        this.getList();
        this.msgSuccess("删除成功");
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.binded-wrapper {
  margin-bottom: 30px;
  h5 {
    margin-bottom: 15px;
    font-size: 15px;
  }
  .binded-item {
    padding-left: 20px;
  }
}
.bind-wrapper {
  h5 {
    margin-bottom: 15px;
    font-size: 15px;
  }
}
</style>
