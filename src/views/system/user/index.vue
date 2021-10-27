<template>
  <div class="app-container">
    <div>
      <el-form ref="queryForm" :inline="true" :model="queryParams" class="demo-form-inline">
       <el-form-item label="账号">
          <el-input
            v-model="queryParams.username"
            placeholder="请输入账号"
          ></el-input>
        </el-form-item>

        <el-form-item label="名称">
          <el-input
            v-model="queryParams.name"
            placeholder="请输入名称"
          ></el-input>
        </el-form-item>
      
        <el-form-item label="手机号码">
          <el-input
            v-model="queryParams.phone"
            placeholder="请输入手机号码"
          ></el-input>
        </el-form-item>

       <!-- <el-form-item label="邮箱地址">
          <el-input
            v-model="queryParams.email"
            placeholder="请输入邮箱地址"
          ></el-input>
        </el-form-item> -->

         <el-form-item label="角色">
          <el-select v-model="queryParams.roleId" placeholder="" clearable  filterable
            size="small">
            <el-option v-for="(i,index) in selectRoleList" :key="index" :label="i.name" :value="i.id" />
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
      :data="userList"
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
     <el-table-column align="center" label="账号" width="160">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="姓名" width="160">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
    <el-table-column align="center" label="角色名称" width="160">
        <template slot-scope="scope">
          {{ scope.row.roleName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="手机号码" >
        <template slot-scope="scope">
          {{ scope.row.phone }}
        </template>
      </el-table-column>
       <el-table-column align="center" label="邮箱地址" >
        <template slot-scope="scope">
          {{ scope.row.email }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" width="95">
      <template slot-scope="scope">
          <span v-if="scope.row.active===1">正常</span>
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
          >修改</el-button>
           <!-- <el-button
            type="text"
            size="small"
            @click="enableOrDisableUser(scope.row)"
          >禁用</el-button> -->

          <el-button v-show="scope.row.active===0" size="mini" type="text"
            @click="enableOrDisableUser(scope.row)">启用
          </el-button>
           <el-button v-show="scope.row.active===1" size="mini" type="text"
            @click="enableOrDisableUser(scope.row)">禁用
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="pageInfo.total>0" :total="pageInfo.total" :page.sync="pageInfo.pageNum "
      :limit.sync="pageInfo.pageSize" @pagination="gopage" />

     <el-dialog :title="title" :visible.sync="open" width="800px" :close-on-click-modal="false" @close="cancel">
      <div class='contain'>
        <el-form ref="form" :model="form" :rules="rules" label-width="150px">
          
          <el-row>
            <el-col :span="12">
              <el-form-item label="账号" prop="username">
                <el-input v-model="form.username" placeholder="请输入用户账号" clearable :disabled='title==="修改用户"' />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="真实姓名" prop="name">
                <el-input v-model="form.name" placeholder="请输入用户昵称" clearable  />
              </el-form-item>
            </el-col>
             <el-col :span="12">
              <el-form-item label="手机号码" prop="phone">
                <el-input v-model="form.phone" placeholder="请输入手机号码" maxlength=11 clearable>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="身份证号码" prop="idNo">
                <el-input v-model="form.idNo" placeholder="请输入身份证号码" clearable />
              </el-form-item>
            </el-col>
          </el-row>
  
          <el-row>
            <el-col :span="12">
              <el-form-item label="用户角色" prop="roleIdList">
                <el-select v-model="form.roleIdList" placeholder="请选择" clearable multiple filterable>
                  <el-option v-for="(i,index) in selectRoleList" :key="index" :label="i.name" :value="i.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          
            <el-col :span="12">
              <el-form-item label="状态" v-if='title === "修改用户"' prop="active">
                <el-radio v-model="form.active" :label="1">启用</el-radio>
                <el-radio v-model="form.active" :label="0">禁用</el-radio>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-form-item label="默认密码：" prop="password" v-if='title==="新增用户"'>
              <el-input v-model="form.password" placeholder="请输入8-32位由字母、数字和特殊字符中两者组成的密码" type="password">
              </el-input>
            </el-form-item>
            <el-form-item label="默认密码：" prop="passwordUnrequired" v-if='title==="修改用户"'>
              <el-input v-model="form.passwordUnrequired" placeholder="请输入8-32位由字母、数字和特殊字符中两者组成的密码" type="password">
              </el-input>
            </el-form-item>
            <el-form-item label="">
              <div style="color:red;line-height:10px">注：为空时保持原密码不变，修改密码直接输入覆盖即可。</div>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="邮箱地址：" prop="email">
              <el-input v-model="form.email" @blur="getEmail()" placeholder="请输入邮箱地址">
              </el-input>
              <div class="el-form-item__error" v-if="error">请输入正确的邮箱地址</div>
            </el-form-item>
            <el-form-item label="">
              <div style="color:red;line-height:10px">注：多个邮箱之间用;隔开。</div>
            </el-form-item>
          </el-row>
          <!-- <el-row>
            <el-col :span="24">
              <el-form-item label="备注">
                <el-input v-model="form.remark" type="textarea" placeholder=""></el-input>
              </el-form-item>
            </el-col>
          </el-row> -->
        </el-form>
        <div class="tr mt30">
          <el-button size="small" @click="cancel">取 消</el-button>
          <el-button type="primary" size="small" @click="submitForm">确 定</el-button>
        </div>
      </div>
  
    </el-dialog>
  </div>
</template>

<script>

import _ from 'lodash';
import { getAllRoles } from '@/api/role';
import { getUserList, saveUser, getUserDetail,enableOrDisableUser } from '@/api/user';

export default {
  data() {
    return {
      userList: [],
      selectRoleList: [],
      listLoading: true,
      pageInfo: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
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
        username:"",
        name:"",
        phone:"",
        email:"",
        roleId:""
      },
      dialogFormVisible: false,
     
    
      defaultProps: {
        children: "children",
        label: "label",
      },
         // 菜单列表
      menuOptions: [],
      form: {
        id: undefined,
        name: "",
        idNo: "",
        roleIdList: [],
        username: "",
        remark: "",
        phone: "",
        active: undefined,
        password: null,
        passwordUnrequired: null,
        email: "",
      },
       // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      error: false,
      // 表单校验
      rules: {
     
        name: [
          {
            required: true,
            message: "请输入中文英文或者点号",
            trigger: "blur",
            pattern: /^[a-zA-Z·\u4e00-\u9fa5]+$/,
          },
        ],
        idNo: [
          {
            required: false,
            message: "请输入正确的身份证号码",
            trigger: "blur",
            pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
          },
        ],
        roleIdList: [
          { required: true, message: "用户角色不能为空", trigger: "blur" },
        ],
        phone: [
          {
            required: false,
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur",
          },
        ],
        active: [{ required: true, message: "状态不能为空", trigger: "blur" }],
        username: [
          {
            required: true,
            pattern: /^[0-9A-Za-z]{5,20}$/,
            message: "请输入5-20位由字母、数字中两者组成的账号",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message:
              "请输入8-32位由字母、数字和特殊字符中两者组成的密码，特殊字符支持~!@#$%^&*()-+=?,.;:[]{}/|",
            pattern: /^[\~\!\@\#\$\%\^\&\*\(\)\-\+\=\?\,\.\;\:\[\]\{\}\/\\\|0-9A-Za-z]{8,32}$/,
            trigger: "blur",
          },
        ],
        passwordUnrequired: [
          {
            required: false,
            message:
              "请输入8-32位由字母、数字和特殊字符中两者组成的密码，特殊字符支持~!@#$%^&*()-+=?,.;:[]{}/|",
            pattern: /^[\~\!\@\#\$\%\^\&\*\(\)\-\+\=\?\,\.\;\:\[\]\{\}\/\\\|0-9A-Za-z]{8,32}$/,
            trigger: "blur",
          },
        ],
       
      },
    }
  },
  async created() {
    this._queryParams = _.cloneDeep(this.queryParams);
    console.log(this._queryParams);
    this.selectRoleList = await this.optionSelectList();
    this.getList(1, 10);
  },
  methods: {
     //获取角色
    async optionSelectList(val) {
      let res = await getAllRoles();
      return res.data;
    },
     //启用禁用
    async enableOrDisableUser(row) {
      let data = {
        id: row.id,
        active: row.active == 0 ? 1 : 0,
      };
      let res = await enableOrDisableUser(data).catch(
        (err) => {
          throw err;
        }
      );
      this.getList(this.pageInfo.pageNum, this.pageInfo.pageSize);
      this.msgSuccess("操作成功");
    },
   
    resetForm() {
      
      this.form = {
        phone:"",
        name: "",
        idNo: "",
        roleIdList: [],
        username: "",
        remark: "",
        active: undefined,
        password: null,
        passwordUnrequired: null,
        email: "",
      };
      this.$refs.form.resetFields();
    },

    //新增/修改用户信息
    async doSaveUser() {
      let data = {
        ...this.form,
      };
      let res = await saveUser(data).catch((err) => {
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
      // this.menuTreeSelectList();
      let userId = row.id;
      this.userDetail(userId);
      this.open = true;
      this.$nextTick(() => {
        this.resetForm();
      });
      this.title = "修改用户";
    },
    //获取获取详情信息
    async userDetail(val) {
      let data = {
        id: val,
      };
      let res = await getUserDetail(data);
     
      this.form = res.data
      console.log(this.form)
      // this.form = {
      //     roleId: info.id,
      //     enname: info.enname,
      //     roleName: info.name,
      //     status: info.active,
      //     remark: info.description,
      //     menuIdList: res.data.menuIdList
      // }
      // this.setCheckedKeys(res.data.menuIdList);
      // console.log(res);
    },
    // 邮箱验证
    getEmail() {
      if (this.form.email) {
        const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let res = reg.test(this.form.email);
        if (!res) {
          this.form.email = null;
          this.error = true;
        } else {
          this.error = false;
        }
      }else{
         this.error = false;
      }
    },
   //分页
    gopage(val) {
      this.getList(val.page, val.limit, this._queryParams);
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this._queryParams = _.cloneDeep(this.queryParams);
      if (this._queryParams.active == "") {
        this._queryParams.active = null;
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
        username:"",
        name:"",
        phone:"",
        email:"",
        roleId:""
      };
      this.handleQuery();
    },

    handleAdd(){

      this.open = true;
      this.$nextTick(() => {
        this.resetForm();
      });
      this.form.id = undefined;
      this.title = "新增用户";
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.roleId != undefined) {
            // this.form.menuIdList = this.getMenuAllCheckedKeys();
            this.doSaveUser();
            this.open = false;
          } else {
            // this.form.menuIdList = this.getMenuAllCheckedKeys();
            this.doSaveUser();
            this.open = false;
          }
        }
      });
    },
     //获取菜单下拉列表
    // async menuTreeSelectList() {
    //   let data = {};
    //   let res = await menuTreeSelectList(data);
    //   this.menuOptions = res.data;
    //   // console.log(this.menuOptions);
    // },
 
    /** 查询角色列表 */
    async getList(index, size, other = {}) {
      this.listLoading = true

      let data = {
        pageNum: index,
        pageSize: size,
        ...other,
      };
      let res = await getUserList(data);
      this.userList = res.data.data;
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
