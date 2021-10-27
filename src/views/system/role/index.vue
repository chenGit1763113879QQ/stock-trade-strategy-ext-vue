<template>
  <div class="app-container">
    <div>
      <el-form ref="queryForm" :inline="true" :model="queryParams" class="demo-form-inline">
        <!-- <el-form-item label="更新时间:">
          <el-date-picker
            v-model="updateTimePeroid"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item> -->

        <el-form-item label="角色名称">
          <el-input
            v-model="queryParams.name"
            placeholder="请输入角色名称"
          ></el-input>
        </el-form-item>
      
        <el-form-item label="状态">
          <el-select v-model="queryParams.active" placeholder="请选择">
            <el-option
              v-for="item in activeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
        </el-form-item>

        <el-form-item>
          <el-button type="normal" @click="resetQuery">重置</el-button>
        </el-form-item>

         <el-form-item style="margin-left:20px">
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-form-item>
        <!-- <el-form-item>
          <el-button type="primary" @click="doDownload">下载</el-button>
        </el-form-item> -->
      </el-form>
    </div>

    <el-table
      v-loading="listLoading"
      :data="roleList"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="行号" width="95">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="角色名称" width="160">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
    <el-table-column align="center" label="角色英文名称" width="160">
        <template slot-scope="scope">
          {{ scope.row.enname }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注" >
        <template slot-scope="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" width="95">
      <template slot-scope="scope">
          <span v-if="scope.row.active===1">启用</span>
          <span v-if="scope.row.active===0" class="text-danger">禁用</span>
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          {{ scope.row.created }}
        </template>
      </el-table-column> -->
    
      <el-table-column align="center" label="更新时间">
        <template slot-scope="scope">
          {{ scope.row.updated }}
        </template>
      </el-table-column>
     
      <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="handleUpdate(scope.row)"
          >编辑</el-button>
           <el-button
            type="text"
            size="small"
            @click="enableOrDisableRole(scope.row)"
          >禁用</el-button>
           <el-button
            type="text"
            size="small"
            @click="handleAssignUsers(scope.row)"
          >分配用户</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- <el-pagination
      class="pagination"
      :current-page="pageNum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    /> -->

    <pagination v-show="pageInfo.total>0" :total="pageInfo.total" :page.sync="pageInfo.pageNum "
      :limit.sync="pageInfo.pageSize" @pagination="gopage" />

      <el-dialog :title="title" :visible.sync="open" width="500px" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
       
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.roleName" placeholder="请输入角色名称" />
        </el-form-item>
         <el-form-item label="角色英文名称" prop="roleName">
          <el-input v-model="form.enname" placeholder="请输入角色英文名称" />
        </el-form-item>
        <!-- <el-form-item label="角色顺序" prop="roleSort">
          <el-input-number v-model="form.roleSort" controls-position="right" :min="0" />
        </el-form-item> -->
         <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单权限" prop="menuIdList">
          <el-tree :data="menuOptions" show-checkbox ref="menu" node-key="id" empty-text="加载中，请稍后"
            :props="defaultProps"></el-tree>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button size="small" @click="cancel">取 消</el-button>
        <el-button type="primary" size="small" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import _ from 'lodash';
import { getRoles, saveRole, getRoleDetail,enableOrDisableRole } from '@/api/role'
import { menuTreeSelectList } from '@/api/menu'

export default {
  data() {
    return {
      roleList: [],
      listLoading: true,
      pageInfo: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      updateTimePeroid: '',
      currentRow: null,
      activeOptions: [
        {
          value: "1",
          label: "启用",
        },
        {
          value: "0",
          label: "禁用",
        }
      ],
      queryParams: {
        name:"",
        active:""
      },
      dialogFormVisible: false,
     
      number:1,
      formLabelWidth: '120px',
      defaultProps: {
        children: "children",
        label: "label",
      },
         // 菜单列表
      menuOptions: [],
      form: {
        roleId: undefined,
        roleName: undefined,
        enname: undefined,
        status: undefined,
        remark: undefined,
        menuIdList: [],
        roleSort: undefined
      },
       // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 表单校验
      rules: {
        roleName: [
          { required: true, message: "角色名称不能为空", trigger: "blur" },
        ],
        status: [
          { required: true, message: "状态不能为空", trigger: "change" },
        ],
        roleSort: [
          { required: true, message: "角色顺序不能为空", trigger: "change" },
        ]
        
      },
    }
  },
  created() {
    this._queryParams = _.cloneDeep(this.queryParams);
    console.log(this._queryParams);
    this.getList(1, 10);
  },
  methods: {
     //启用禁用
    async enableOrDisableRole(row) {
      let data = {
        roleId: row.roleId,
        status: row.status == 0 ? 1 : 0,
      };
      let res = await enableOrDisableRole(data).catch(
        (err) => {
          throw err;
        }
      );
      this.getList(this.pageInfo.pageNum, this.pageInfo.pageSize);
      this.msgSuccess("操作成功");
    },
   // 所有菜单节点数据
    getMenuAllCheckedKeys() {
      // 目前被选中的菜单节点
      let checkedKeys = this.$refs.menu.getHalfCheckedKeys();
      // 半选中的菜单节点
      let halfCheckedKeys = this.$refs.menu.getCheckedKeys();
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
      return checkedKeys;
    },
    setCheckedKeys(arr) {
      this.$refs.menu.setCheckedKeys(arr);
    },
    resetForm() {
       if (this.$refs.menu != undefined) {
        this.$refs.menu.setCheckedKeys([]);
      }
      this.form = {
        roleId: undefined,
        enname: undefined,
        roleName: undefined,
        status: undefined,
        remark: undefined,
        menuIdList: [],
        roleSort: undefined
      };
      this.$refs.form.resetFields();
    },

    //新增/修改角色信息
    async doSaveRole() {
      let data = {
        ...this.form,
      };
      let res = await saveRole(data).catch((err) => {
        throw err;
      });
      this.$alert("操作成功").then(() => {
        this.getList(1, this.pageInfo.pageSize);
      });
    },

    // 取消按钮
    cancel() {
      this.open = false;
      this.resetForm();
    },
   /** 修改按钮操作 */
    handleUpdate(row) {
      this.menuTreeSelectList();
      let roleId = row.id;
      this.roleDetail(roleId);
      this.open = true;
      this.$nextTick(() => {
        this.resetForm();
      });
      this.title = "修改角色";
    },
    //获取获取角色详情信息
    async roleDetail(val) {
      let data = {
        roleId: val,
      };
      let res = await getRoleDetail(data);
      let info = res.data;
      this.form.roleId = info.id;
      this.form.enname = info.enname;
      this.form.roleName = info.name;
      this.form.status = info.active;
      this.form.remark = info.description;
      this.form.menuIdList = res.data.menuIdList;
      
      this.setCheckedKeys(res.data.menuIdList);
      console.log(res);
    },
   //分页
    gopage(val) {
      this.getList(val.page, val.limit, this._queryParams);
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this._queryParams = _.cloneDeep(this.queryParams);
      if (this._queryParams.status == "") {
        this._queryParams.status = null;
      }
      this.getList(1, 10, this._queryParams);
      this.pageInfo.pageNum = 1;
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.pageInfo = {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      };
      this.dateRange = [];
      this.queryParams = {
        name: undefined,
        active: null
      };
      this.handleQuery();
    },
    handleClick(row) {
      console.log(row)
  
    },
    
    handleAssignUsers(row) {
      this.$router.push({
        name: "AssignUsers",
        params: {
          applyCode: row.id,
        },
        query: {
          title:"分配用户-"+row.id,
          roleId: row.id
        },
      });
    },
    handleAdd(){
      this.menuTreeSelectList();
      this.open = true;
      this.$nextTick(() => {
        this.resetForm();
      });
      this.form.roleId = undefined;
      this.title = "添加角色";
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.roleId != undefined) {
            this.form.menuIdList = this.getMenuAllCheckedKeys();
            this.doSaveRole();
            this.open = false;
          } else {
            this.form.menuIdList = this.getMenuAllCheckedKeys();
            this.doSaveRole();
            this.open = false;
          }
        }
      });
    },
     //获取菜单下拉列表
    async menuTreeSelectList() {
      let data = {};
      let res = await menuTreeSelectList(data);
      this.menuOptions = res.data;
      // console.log(this.menuOptions);
    },
    doLoad() {
      this.list = undefined
      console.log(this.updateTimePeroid)
      this.getList(1, 10);
    },
    setUrlPrmt(obj) {
      const _rs = []
      for (const p in obj) {
        if (obj[p] != null && obj[p] != '') {
          _rs.push(p + '=' + obj[p])
        }
      }
      return _rs.join('&')
    },
    doDownload() {
      // let params = {
      //   pageNum: this.pageNum,
      //   pageSize: this.pageSize,
      //   startDate: this.updateTimePeroid[0],
      //   endDate: this.updateTimePeroid[1],
      // };
      // let routeUrl =
      //  process.env.VUE_APP_BASE_API +  `/mark/verifyCode/downloadImage?` + this.setUrlPrmt(params);
      // console.log(routeUrl);
      // window.open(routeUrl, "_blank");
    },
    /** 查询角色列表 */
    async getList(index, size, other = {}) {
      this.listLoading = true

      let data = {
        pageNum: index,
        pageSize: size,
        ...other,
      };
      let res = await getRoles(data);
      this.roleList = res.data.data;
      this.pageInfo.total = res.data.count;
      this.pageInfo.pageNum = index;
      this.pageInfo.pageSize = size;
      this.listLoading = false;
    }
  }
}
</script>

<style scoped>
.pagination {
  margin-top: 20px;
  float: right;
}
</style>
