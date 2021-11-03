<template>
  <div class="app-container">
    <div>
      <el-form
        ref="queryForm"
        :inline="true"
        :model="queryParams"
        class="demo-form-inline"
      >

        <!-- <el-form-item label="股票">
          <el-select v-model="queryParams.code" placeholder="" clearable  filterable
            size="small">
            <el-option v-for="(i,index) in selectStockList" :key="index" :label="i.stockName" :value="i.stockCode" />
          </el-select>
        </el-form-item> -->

       <el-form-item label="股票" prop="code" :show-message="false"> 
          <el-select style="width:100%;" v-model="queryParams.code" :remote-method="stockSelectRemoteMethod"
            filterable remote placeholder="搜索股票名称/代码">
            <el-option v-for="item in stockSelectOptions" :key="item.value" :value="item.value" :label="item.label" />
          </el-select>
        </el-form-item>

       <el-form-item label="成交时间:">
          <el-date-picker
            v-model="updateTimePeroid"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
        </el-form-item>

        <el-form-item>
          <el-button type="normal" @click="resetQuery">重置</el-button>
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

      <el-table-column align="center" label="股票名称" width="160">
        <template slot-scope="scope">
          {{ scope.row.stockName }} ({{ scope.row.stockCode }}) 
        </template>
      </el-table-column>
      
     
    <el-table-column align="center" label="成交类型">
        <template slot-scope="scope">
          <span v-if="scope.row.action == 1" class="text-green">卖出</span>
          <span v-if="scope.row.action == 0" class="text-red">买入</span>
        </template>
      </el-table-column>
   
      <el-table-column align="center" label="成交价格">
        <template slot-scope="scope">
          {{ scope.row.actionPrice }}
        </template>
      </el-table-column>

       <el-table-column align="center" label="成交时间">
        <template slot-scope="scope">
          {{ scope.row.createTime }}
        </template>
      </el-table-column>

     <el-table-column align="center" label="成交数量">
        <template slot-scope="scope">
          {{ scope.row.actionNumber }}
        </template>
      </el-table-column>

     
     <el-table-column align="center" label="成交金额">
        <template slot-scope="scope">
          {{ scope.row.totalMoney }}
        </template>
      </el-table-column>
     
      <!-- <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="enableOrDisableUser(scope.row)"
            >删除</el-button>
        </template>
      </el-table-column> -->
    </el-table>

    <pagination
      v-show="pageInfo.total > 0"
      :total="pageInfo.total"
      :page.sync="pageInfo.pageNum"
      :limit.sync="pageInfo.pageSize"
      @pagination="gopage"
    />

    
  </div>
</template>

<script>
import _ from "lodash";
import {
  queryStockActionList,
  getStockSimpleList,
  searchStock
} from "@/api/stock";

export default {
  name: "TradeList",
  // props: {
  //   composeId: {
  //     type: String,
  //     require: true
  //   }
  // },
  data() {
    return {
      updateTimePeroid:"",
      dataList: [],
      composeId:"",
      selectStockList:[],
      stockSelectOptions:[],
      listLoading: true,
      pageInfo: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      
      queryParams: {
        code: "",
      },
      dialogFormVisible: false,


      error: false,
      // 表单校验
      rules: {
        
      },
    };
  },
  mounted(){
    this.$root.$on('onComposeSelected', id => {
        console.log("refreshTradeList", id);
        this.composeId = id;
        this.doLoadSelectList();
        this.getList(1, 10);
    })
  },
  async created() {
    this._queryParams = _.cloneDeep(this.queryParams);
    // console.log(this._queryParams);
    // this.composeId = this.composeId;
    // console.log("composeId",this.composeId)
    // this.selectStockList = await this.optionSelectList();
    // this.getList(1, 10);
  },
  methods: {
    async doLoadSelectList(){
      this.selectStockList = await this.optionSelectList();
    },
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
        console.log("price:", price)
        if(!price || price == 0) return "text-normal";
       
        return price > 0 ? "text-red" : "text-green";
    },
    async optionSelectList() {
      let query = {
        composeId: this.composeId
      }
      let res = await getStockSimpleList(query);
      return res.data;
    },
    resetForm() {
      this.queryParams = {
        updateTimePeroid: "",
        code: ""
      };
      this.$refs.form.resetFields();
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.resetForm();
    },
    handleDetail(row) {
    
    },

    //分页
    gopage(val) {
      this.getList(val.page, val.limit, this._queryParams);
    },
    /** 搜索按钮操作 */
    handleQuery() {
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
      this.dateRange = [];
      this.queryParams = {
        updateTimePeroid: "",
        code: ""
       
      };
      this.handleQuery();
    },

    /** 查询列表 */
    async getList(index, size, other = {}) {
      this.listLoading = true;
      let data = {
        composeId: this.composeId,
        pageNum: index,
        pageSize: size,
        startDate: this.updateTimePeroid[0],
        endDate: this.updateTimePeroid[1],
        ...other,
      };
      let res = await queryStockActionList(data);
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
