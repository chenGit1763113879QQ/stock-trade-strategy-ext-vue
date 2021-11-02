<template>
  <div class="app-container">
    <div>
      <el-form
        ref="queryForm"
        :inline="true"
        :model="queryParams"
        class="demo-form-inline"
      >
        <el-form-item label="组合名称">
          <el-input
            v-model="queryParams.name"
            placeholder="请输入名称"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
        </el-form-item>

        <el-form-item>
          <el-button type="normal" @click="resetQuery">重置</el-button>
        </el-form-item>

        <el-form-item style="margin-left: 20px">
          <el-button type="primary" @click="handleAdd">创建组合</el-button>
        </el-form-item>
        <!-- <el-form-item>
          <el-button type="primary" @click="doDownload">下载</el-button>
        </el-form-item> -->
      </el-form>
    </div>

    <el-table
      v-loading="listLoading"
      :data="dataList"
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

      <el-table-column align="center" label="组合名称" width="160">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="初始总资产" width="160">
        <template slot-scope="scope">
          {{ scope.row.initBalance }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="现金">
        <template slot-scope="scope">
          {{ scope.row.cash }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="总市值(CNY)">
        <template slot-scope="scope">
          <span :class="getTextPriceClass(scope.row.profitMoney)"> {{ scope.row.capital }}</span>
        </template>
      </el-table-column>
     <el-table-column align="center" label="当前仓位">
        <template slot-scope="scope">
          {{ scope.row.positionPercent }}%
        </template>
      </el-table-column>
       <el-table-column align="center" label="浮动盈亏">
        <template slot-scope="scope">
          <span :class="getTextPriceClass(scope.row.profitMoney)"> {{ scope.row.profitMoney }}({{ scope.row.profitPercent }}%)</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          {{ scope.row.createTime }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="更新时间">
        <template slot-scope="scope">
          {{ scope.row.updateTime }}
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleDetail(scope.row)"
            >组合详情</el-button
          >
          <el-button type="text" size="small" @click="handleUpdate(scope.row)"
            >修改</el-button
          >
          <el-button
            type="text"
            size="small"
            @click="enableOrDisableUser(scope.row)"
            >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="pageInfo.total > 0"
      :total="pageInfo.total"
      :page.sync="pageInfo.pageNum"
      :limit.sync="pageInfo.pageSize"
      @pagination="gopage"
    />

    <el-dialog
      :title="title"
      :visible.sync="open"
      width="500px"
      :close-on-click-modal="false"
      @close="cancel"
    >
      <div class="contain">
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
          <el-row>
            <el-form-item label="组合名称" prop="name">
              <el-input
                v-model="form.name"
                placeholder="请输入组合名称"
                clearable
              />
            </el-form-item>
          </el-row>

          <el-row>
            <el-form-item label="组合初始金额" v-if="title!='修改组合'">
              <el-select v-model="form.balanceType" placeholder="请选择">
                <el-option
                  v-for="item in activeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-row>

          <el-row>
            <el-form-item label="是否公开">
              <el-switch v-model="form.isPublic"> </el-switch>
            </el-form-item>
          </el-row>

          <el-row>
            <el-form-item label="备注">
              <el-input
                v-model="form.remark"
                type="textarea"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
          </el-row>
        </el-form>
        <div class="tr mt30">
          <el-button size="small" @click="cancel">取 消</el-button>
          <el-button type="primary" size="small" @click="submitForm"
            >确 定</el-button
          >
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import _ from "lodash";
import {
  saveCompose,
  deleteCompose,
  getDataList,
  getDetail,
} from "@/api/compose";

export default {
  data() {
    return {
      dataList: [],
      listLoading: true,
      pageInfo: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      activeOptions: [
        {
          value: "1",
          label: "10W",
        },
        {
          value: "2",
          label: "20W",
        },
        {
          value: "3",
          label: "50W",
        },
        {
          value: "4",
          label: "100W",
        },
        {
          value: "5",
          label: "1000W",
        },
      ],
      queryParams: {
        name: ""
   
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
        remark: undefined,
        balanceType: undefined,
        isPublic: false,
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
            message: "请输入组合名称",
            trigger: "blur",
            // pattern: /^[a-zA-Z·\u4e00-\u9fa5]+$/,
          },
        ],

        balanceType: [
          { required: true, message: "组合金额不能为空", trigger: "blur" },
        ],
      },
    };
  },
  
  async created() {
    this._queryParams = _.cloneDeep(this.queryParams);
    console.log(this._queryParams);

    this.getList(1, 10);
  },
  methods: {
    getTextPriceClass(price){
        console.log("price:", price)
        if(!price || price == 0) return "text-normal";
       
        return price > 0 ? "text-red" : "text-green";
    },
    resetForm() {
      this.form = {
        id: undefined,
        name: "",
        remark: "",
        balanceType: undefined,
        isPublic: false,
      };
      this.$refs.form.resetFields();
    },

    //新增/修改组合信息
    async doSaveCompose() {
      let data = {
        ...this.form,
      };
      data.isPublic = this.form.isPublic ? 1 : 0;
      let res = await saveCompose(data).catch((err) => {
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
    handleDetail(row) {
    
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      // this.menuTreeSelectList();
      // let userId = row.id;
      //   this.userDetail(userId);
      this.form = {
        ...row
      }
      this.open = true;
      this.$nextTick(() => {
        this.resetForm();
      });
      this.title = "修改组合";
    },
    //获取获取详情信息
    // async dataDetail(val) {
    //   let data = {
    //     id: val,
    //   };
    //   let res = await getUserDetail(data);

    //   this.form = res.data;
    //   console.log(this.form);
    // },

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
        username: "",
        name: "",
        phone: "",
        email: "",
        roleId: "",
      };
      this.handleQuery();
    },

    handleAdd() {
      this.open = true;
      this.$nextTick(() => {
        this.resetForm();
      });
      this.form.id = undefined;
      this.title = "创建组合";
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.roleId != undefined) {
            // this.form.menuIdList = this.getMenuAllCheckedKeys();
            this.doSaveCompose();
            this.open = false;
          } else {
            // this.form.menuIdList = this.getMenuAllCheckedKeys();
            this.doSaveCompose();
            this.open = false;
          }
        }
      });
    },

    /** 查询列表 */
    async getList(index, size, other = {}) {
      this.listLoading = true;

      let data = {
        pageNum: index,
        pageSize: size,
        ...other,
      };
      let res = await getDataList(data);
      this.dataList = res.data.data;
      this.pageInfo.total = res.data.count;
      this.pageInfo.pageNum = index;
      this.pageInfo.pageSize = size;
      this.listLoading = false;
    },
  },
};
</script>

<style scoped>
.pagination {
  margin-top: 20px;
  float: right;
}
</style>
