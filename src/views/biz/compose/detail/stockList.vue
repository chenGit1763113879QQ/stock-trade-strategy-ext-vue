<template>
  <div class="app-container">
<div>
      <el-form
        ref="queryForm"
        :inline="true"
        :model="queryParams"
        class="demo-form-inline"
      >

        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
        </el-form-item>

        <el-form-item style="margin-left: 20px">
          <el-button type="primary" @click="handleTrade">交易</el-button>
        </el-form-item>

  
   
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

      <el-table-column align="center" label="股票名称" width="160">
        <template slot-scope="scope">
          {{ scope.row.stockName }} ({{ scope.row.stockCode }}) 
        </template>
      </el-table-column>
     
      <el-table-column align="center" label="市值" width="160">
        <template slot-scope="scope">
          {{ scope.row.capital }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="数量">
        <template slot-scope="scope">
          {{ scope.row.stockNumber }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="现价/成本价">
        <template slot-scope="scope">
          {{ scope.row.curPrice }}  / {{ scope.row.costPrice }}
        </template>
      </el-table-column>

    <el-table-column align="center" label="盈亏">
        <template slot-scope="scope">
          {{ scope.row.profitMoney }} / {{ scope.row.profitPercent }}
        </template>
      </el-table-column>
<!-- 
      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          {{ scope.row.createTime }}
        </template>
      </el-table-column> -->

      <el-table-column align="center" label="更新时间">
        <template slot-scope="scope">
          {{ scope.row.updateTime }}
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleDetail(scope.row)"
            >交易</el-button>
         
        </template>
      </el-table-column>
    </el-table>


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
            <el-form-item label="股票" prop="stockCode" :show-message="false"> 
              <el-select style="width:100%;" v-model="form.stockCode" :remote-method="stockSelectRemoteMethod"
                filterable remote placeholder="搜索股票名称/代码">
                <el-option v-for="item in stockSelectOptions" :key="item.value" :value="item.label" :label="item.label"
                  @click="onOptionsClick(item)" />
              </el-select>
            </el-form-item>
          </el-row>

          
          <!-- <el-row>
            <el-form-item label="组合名称">
              <el-input v-model="form.stockCode" type="input" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-row> -->
      
          <el-row>
            <el-form-item label="交易类型" prop="action">
              <el-select v-model="form.action" placeholder="请选择" >
                <el-option
                  v-for="item in tradeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-row>

          <el-row>
            <el-form-item label="交易价" prop="actionPrice">
              <el-input-number v-model="form.actionPrice" type="input" placeholder="输入价格" :precision="2"></el-input-number>
            </el-form-item>
          </el-row>
           <el-row>
            <el-form-item label="交易量" prop="actionNumber">
              <!-- <el-input v-model="form.actionNumber" type="input" placeholder="输入数量"></el-input> -->
              <el-input-number v-model="form.actionNumber" type="input" placeholder="输入数量" :step="100"></el-input-number>
            </el-form-item>
          </el-row>
         
          <el-row>
            <el-form-item label="备注" prop="remark">
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
  getStockList,searchStock,tradeStockItem 
} from "@/api/stock";

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
      tradeOptions: [
        {
          value: "0",
          label: "买入",
        },
        {
          value: "1",
          label: "卖出",
        },
      ],
      composeId:"", 
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
      tempFormData: {
        stockCode: "",
        stockName: ""
      },
      stockSelectOptions: [],
      form: {
        composeId: undefined,
        stockCode: undefined,
        stockName: undefined,
        actionPrice: undefined,
        actionNumber: undefined,
        action: undefined,
      },
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      error: false,
      // 表单校验
      rules: {
         stockCode: [
          {
            required: true,
            message: "请选择股票",
            trigger: "blur",
            // pattern: /^[a-zA-Z·\u4e00-\u9fa5]+$/,
          },
        ],
        action: [
          {
            required: true,
            message: "请选择交易类型",
            trigger: "blur"
          },
        ],
        actionNumber: [
          {
            required: true,
            message: "请输入交易量",
            trigger: "blur"
          },
        ],
        actionPrice: [
          {
            required: true,
            message: "请输入交易价格",
            trigger: "blur"
          },
        ],
      },
    };
  },
  async created() {
    this._queryParams = _.cloneDeep(this.queryParams);
    console.log(this._queryParams);
    this.composeId = this.$route.query.composeId
    console.log(this.composeId)
    this.getList(1, 10);
  },
  mounted(){
 
  },
  methods: {
    async stockSelectRemoteMethod(query) {
          //个人
        let params = {
          key: query, 
        };
        let res = await searchStock(params);
        let list = res.data.data;
        this.stockSelectOptions = list.map((n) => {
          return {
            value: n.code,
            label: n.name + "(" + n.code + ")",
          };
        })
        // this.stockSelectOptions = res.data.data
    },
    getTextPriceClass(price){
        if(!price || price == 0) return "text-normal";

        return price > 0 ? "text-red" : "text-green";
    },
    resetForm() {
      this.form = {
        composeId: undefined,
        stockCode: undefined,
        stockName: undefined,
        actionPrice: undefined,
        actionNumber: undefined,
        action: undefined,
      };
      this.$refs.form.resetFields();
    },

    // 取消按钮
    cancel() {
      console.log("cancel");
      this.open = false;
      this.resetForm();
    },
    handleDetail(row) {

    },
    onOptionsClick(item) {
      console.log("onOptionsClick", item);
      this.form.stockCode = item.value;
      this.form.stockName = item.label;

      this.tempFormData.stockCode = item.value;
      this.tempFormData.stockName = item.label;
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

    },

    handleTrade() {
      this.open = true;
      // this.$nextTick(() => {
      //   this.resetForm();
      // });
      this.form = {
        composeId: undefined,
        stockCode: undefined,
        stockName: undefined,
        actionPrice: undefined,
        actionNumber: 100,
        action: "0",
      };

      // this.form.id = undefined;
      this.title = "交易";
    },
    /** 提交按钮 */
    submitForm: function () {
      if(this.form.actionNumber % 100 != 0){
         this.$alert("交易量必须是100的整数");
         return
      }
      this.$refs["form"].validate((valid) => {
        if (valid) {
          let data = {
            ...this.form
          }
          data.composeId = this.composeId;
          let arr = data.stockCode.split("(");
          data.stockCode = arr[1].replace(")","");
          data.stockName = arr[0];
 
          this.doTrade(data);
          this.open = false;
        }
      });
    },
    async doTrade(data){
      let res = await tradeStockItem(data).catch((err) => {
        throw err;
      });
      this.$alert("操作成功").then(() => {
        this.getList(1, this.pageInfo.pageSize);
      });
    },

    /** 查询列表 */
    async getList(index, size, other = {}) {
      this.listLoading = true;
   
      let data = {
        // pageNum: index,
        // pageSize: size,
        composeId: this.composeId,
        ...other,
      };
      let res = await getStockList(data);
         this.dataList = res.data;
      // this.dataList = res.data.data;
      // this.pageInfo.total = res.data.count;
      // this.pageInfo.pageNum = index;
      // this.pageInfo.pageSize = size;
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
