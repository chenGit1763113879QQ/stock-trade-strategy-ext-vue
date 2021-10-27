<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="登录名" prop="loginName">
        <el-input v-model="queryParams.username" placeholder="请输入登录名" clearable size="small" style="width: 240px"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="手机号码" prop="phoneNumber">
        <el-input v-model="queryParams.phone" placeholder="请输入手机号码" clearable size="small" style="width: 240px"
          @keyup.native="queryParams.phone=queryParams.phone.replace(/[^\d.]/g,'');" maxlength="11" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索
        </el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd" style="margin-left:30px;">添加用户
        </el-button>
        <el-button type="warning" icon="el-icon-close" size="mini" @click="handleEmployeeRoleAuthorize"
          style="margin-left:30px;" :disabled="isDeled">批量取消授权
        </el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="roleList" align="center" ref="table" @select-all="onSelectAll" border
      @select='onTableSelect' :row-key="getRowKeys">
      <el-table-column type="selection" width="50" :reserve-selection="true"></el-table-column>
      <el-table-column label="登录名" prop="username" align="center" />
      <el-table-column label="姓名" prop="username" align="center" />
      <!-- <el-table-column label="证件号" prop="employeeIdNo" align="center" /> -->
      <el-table-column label="手机号" prop="phone" align="center" />
      <el-table-column label="邮箱" prop="email" align="center" />
      <el-table-column label="状态" align="center" prop="active">
        <template slot-scope="scope">
          <span v-if="scope.row.active===1">正常</span>
          <span v-if="scope.row.active===0" class="text-danger">禁用</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="created"></el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="handleUpdate(scope.row)">取消授权
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="pageInfo.total>0" :total="pageInfo.total" :page.sync="pageInfo.pageNum "
      :limit.sync="pageInfo.pageSize" @pagination="gopage" />

    <!-- 添加用户 -->
    <el-dialog title="选择用户" :visible.sync="open" width="1000px" :close-on-click-modal="false" @close="cancel">
      <el-form :model="queryParams" :inline="true">
        <el-form-item label="登录名" prop="loginName">
          <el-input v-model="formQueryParams.username" placeholder="请输入登录名" clearable size="small" style="width: 240px"
            @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="手机号码" prop="phoneNumber">
          <el-input v-model="formQueryParams.phone" placeholder="请输入手机号码" clearable size="small"
            style="width: 240px"
            @keyup.native="formQueryParams.phone=formQueryParams.phone.replace(/[^\d.]/g,'');"
            maxlength="11" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="formHandleQuery">搜索
          </el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="formResetQuery">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="loading" :data="formRoleList" align="center" ref="formTable" @select-all="formOnSelectAll"
        border @select='formOnTableSelect' :row-key="formGetRowKeys">
        <el-table-column type="selection" width="50" :reserve-selection="true"></el-table-column>
        <el-table-column label="登录名" prop="username" align="center" />
        <el-table-column label="姓名" prop="username" align="center" />
        <!-- <el-table-column label="员工证件号" prop="employeeIdNo" align="center" /> -->
        <el-table-column label="手机号" prop="phone" align="center" />
        <el-table-column label="邮箱" prop="email" align="center" />
        <el-table-column label="状态" align="center" prop="active">
          <template slot-scope="scope">
            <span v-if="scope.row.active===1">正常</span>
            <span v-if="scope.row.active===0" class="text-danger">禁用</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime"></el-table-column>
      </el-table>

      <pagination v-show="formPageInfo.total>0" :total="formPageInfo.total" :page.sync="formPageInfo.pageNum "
        :limit.sync="formPageInfo.pageSize" @pagination="formGopage" />

      <div slot="footer">
        <el-button size="small" @click="cancel">取 消</el-button>
        <el-button type="primary" size="small" @click="submitForm" :disabled="formIsDeled">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import _ from "lodash"
import { getUserListByRoleId } from '@/api/user'
import { userRoleAuthorize,unAuthorizeUserList } from '@/api/role'
export default {
  // name: "Role",
  data() {
    return {
      // 遮罩层
      loading: false,
      pageInfo: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      formPageInfo: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },

      multipleSelection: [],
      formMultipleSelection: [],
      isDeled: true,
      formIsDeled: true,
      roleId: "",
      // 角色关联用户表格数据
      roleList: [],
      //角色非关联用户表格数据
      formRoleList: {},
      userIdList: [],
      formUserIdList: [],
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        phoneNumber: undefined,
        loginName: undefined,
      },
      formQueryParams: {
        phoneNumber: undefined,
        loginName: undefined,
      },
      _queryParams: {},
      _formQueryParams: {},
    };
  },
  created() {
    this._queryParams = _.cloneDeep(this.queryParams);
    this._formQueryParams = _.cloneDeep(this.formQueryParams);
    this.roleId = this.$route.query.roleId;

    this.getList(1, 10);
  },
  methods: {
    /** 查询角色关联用户列表 */
    async getList(index, size, other = {}) {
      this.loading = true;
      let data = {
        roleId: this.roleId,
        pageNum: index,
        pageSize: size,
        ...other,
      };
      let res = await getUserListByRoleId(data);
      this.roleList = res.data.data;
      this.pageInfo.total = res.data.count;
      this.pageInfo.pageNum = index;
      this.pageInfo.pageSize = size;
      this.loading = false;
    },

    //分页
    gopage(val) {
      this.getList(val.page, val.limit, this._queryParams);
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.$refs.table.clearSelection(); //取消勾选
      this.multipleSelection = [];
      this.userIdList = [];
      this.isDeled = true;
      this._queryParams = _.cloneDeep(this.queryParams);
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
      this.queryParams = {
        phoneNumber: undefined,
        loginName: undefined,
      };
      this.handleQuery();
    },
    //绑定key值
    getRowKeys(row) {
      return row.id;
    },
    //全选与取消全选
    onSelectAll(selection) {
      this.multipleSelection = selection;
      if (this.multipleSelection.length) {
        this.isDeled = false;
      } else {
        this.isDeled = true;
      }
    },

    // 单个勾选与取消勾选
    onTableSelect(selections) {
      this.multipleSelection = selections;
      if (this.multipleSelection.length) {
        this.isDeled = false;
      } else {
        this.isDeled = true;
      }
    },
    //批量取消按钮操作
    handleEmployeeRoleAuthorize() {
      this.userIdList = [];
      this.multipleSelection.forEach((item, index) => {
        this.userIdList.push(item.employeeId);
      });
      this.employeeRoleAuthorize(0, this.userIdList);
    },

    //单个取消授权
    handleUpdate(row) {
      this.userIdList = [row.employeeId];
      this.employeeRoleAuthorize(0, this.userIdList);
    },

    /** 添加用户按钮操作 */
    handleAdd() {
      this.getFormList(1, 10);
      if (this.formMultipleSelection.length) {
        this.formIsDeled = false;
      } else {
        this.formIsDeled = true;
      }
    },

    //弹框--------------------------------------------------------------------------------//

    /** 查询角色非关联用户列表 */
    async getFormList(index, size, other = {}) {
      this.$gLoading.show();
      let data = {
        roleId: this.roleId,
        pageNum: index,
        pageSize: size,
        ...other,
      };
      let res = await unAuthorizeUserList(data);
      this.formRoleList = res.data.data;
      this.formPageInfo.total =res.data.count;
      this.formPageInfo.pageNum = index;
      this.formPageInfo.pageSize = size;
      this.$gLoading.hide();
      this.open = true;
    },
    //分页
    formGopage(val) {
      this.getFormList(val.page, val.limit, this._formQueryParams);
    },

    //绑定key值
    formGetRowKeys(row) {
      return row.id;
    },
    //全选与取消全选
    formOnSelectAll(selection) {
      this.formMultipleSelection = selection;
      if (this.formMultipleSelection.length) {
        this.formIsDeled = false;
      } else {
        this.formIsDeled = true;
      }
    },

    // 单个勾选与取消勾选
    formOnTableSelect(selections) {
      this.formMultipleSelection = selections;
      if (this.formMultipleSelection.length) {
        this.formIsDeled = false;
      } else {
        this.formIsDeled = true;
      }
    },

    /** 搜索按钮操作 */
    formHandleQuery() {
      this.reset();
      this._formQueryParams = _.cloneDeep(this.formQueryParams);
      this.getFormList(1, 10, this._formQueryParams);
      this.formPageInfo.pageNum = 1;
    },
    /** 重置按钮操作 */
    formResetQuery() {
      this.formPageInfo = {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      };
      this.formQueryParams = {
        phoneNumber: undefined,
        loginName: undefined,
      };
      this.formHandleQuery();
    },
    // 表单重置
    reset() {
      this.$refs.formTable.clearSelection(); //取消勾选
      this.formMultipleSelection = [];
      this.formUserIdList = [];
      this.formIsDeled = true;
    },
    // 取消按钮
    cancel() {
      this.reset();
      this.formQueryParams = {
        phoneNumber: undefined,
        loginName: undefined,
      };
      this._formQueryParams = {};
      this.open = false;
    },

    //取消授权与添加用户
    async employeeRoleAuthorize(authorizeFlag, arr) {
      this.$gLoading.show();
      let data = {
        roleId: this.roleId,
        authorizeFlag: authorizeFlag, //1-确认授权   0-取消授权
        userIdList: arr,
      };
      let res = await userRoleAuthorize(data).catch(
        (err) => {
          this.$gLoading.hide();
          throw err;
        }
      );
      this.$alert("操作成功");
      this.getList(1, 10);
      this.$refs.table.clearSelection(); //取消勾选
      this.multipleSelection = [];
      this.userIdList = [];
      this.isDeled = true;
      this.$gLoading.hide();
    },

    /** 提交按钮 */
    submitForm: function () {
      console.log(this.formMultipleSelection);
      this.formUserIdList = [];
      this.formMultipleSelection.forEach((item, index) => {
        this.formUserIdList.push(item.id);
      });
      this.employeeRoleAuthorize(1, this.formUserIdList);
      this.reset();
      this.open = false;
    },
  },
};
</script>
