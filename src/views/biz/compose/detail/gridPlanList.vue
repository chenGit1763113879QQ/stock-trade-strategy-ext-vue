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
          <el-button type="primary" @click="handleTrade">新建计划</el-button>
        </el-form-item>
      </el-form>

      
    </div>

  <div style="margin-bottom:10px">
    累计获利（元）：<span :class="getTextPriceClass(summaryProfit)" style="margin-right:30px">{{ summaryProfit }}</span>

    交易计划：<span>{{ pageInfo.runningStatus }}/{{ pageInfo.total }}</span>
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
      
      <el-table-column align="center" label="基准价">
        <template slot-scope="scope">
          {{ scope.row.basePrice }}
        </template>
      </el-table-column>
            
      <el-table-column align="center" label="获利金额/笔数">
        <template slot-scope="scope">
          {{ scope.row.profitMoney }} ({{ scope.row.profitNumber }})
        </template>
      </el-table-column>
      <el-table-column align="center" label="高抛">
        <template slot-scope="scope">
          <span class="text-red"> {{ scope.row.increasePer }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="低吸">
        <template slot-scope="scope">
          <span class="text-green"> {{ scope.row.decreasePer }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="预计下笔高抛">
        <template slot-scope="scope">
          <span class="text-red"> {{ scope.row.nextSellPrice }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="预计下笔低吸">
        <template slot-scope="scope">
          <span class="text-green"> {{ scope.row.nextBuyPrice }}</span>
        </template>
      </el-table-column>

       <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          <!-- 未启动0，交易中1，已停止2 -->
          <span v-if="scope.row.status===1" class="text-warning">交易中</span>
          <span v-if="scope.row.status===0" class="text-normal">未启动</span>
          <span v-if="scope.row.status===2" class="text-normal">已停止</span>

        </template>
      </el-table-column>

      <!-- <el-table-column align="center" label="运行天数">
        <template slot-scope="scope">
          {{ scope.row.stockNumber }}
        </template>
      </el-table-column> -->

      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          {{ scope.row.createTime }}
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="操作" >
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleDetail(scope.row)"
            >详情</el-button>
            <el-button  v-if="scope.row.status===0 || scope.row.status===2" type="text" size="small" @click="handleStart(scope.row)"
            >启动计划</el-button>
            <el-button v-if="scope.row.status===1" type="text" size="small" @click="handleStop(scope.row)"
            >停止计划</el-button>
            <el-button v-if="scope.row.status===2" type="text" size="small" @click="handleDelete(scope.row)"
            >废弃</el-button>
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
        <el-form ref="form" :model="form" :rules="rules" label-width="150px">
          <el-row>
            <el-form-item label="股票" prop="stockCode" required>
              <el-select
                v-model="form.stockCode"
                placeholder=""
                clearable
                filterable
                size="small"
                @change="onStockSelected"
              >
                <el-option
                  v-for="(i, index) in selectStockList"
                  :key="index"
                  :label="i.stockName + '(' +i.stockCode + ')'"
                  :value="i.stockCode"
                />
              </el-select>
            </el-form-item>
          </el-row>

          <!-- <el-row>
            <el-form-item label="组合名称">
              <el-input v-model="form.stockCode" type="input" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-row> -->

          <el-row>
            <el-form-item label="初始基准价(￥)" prop="basePrice" required>
              <el-input-number
                v-model="form.basePrice"
                type="input"
                placeholder="输入价格"
                :precision="2"
              ></el-input-number>
            </el-form-item>
          </el-row>

          <el-row>
            <el-form-item label="上涨卖出幅度(%)" prop="increasePer" required>
              <el-input-number
                v-model="form.increasePer"
                type="input"
                placeholder="输入幅度(%)"
                :precision="2"
              ></el-input-number>
            </el-form-item>
          </el-row>

          <el-row>
            <el-form-item label="下跌买入幅度(%)" prop="decreasePer" required>
              <el-input-number
                v-model="form.decreasePer"
                type="input"
                placeholder="输入幅度(%)"
                :precision="2"
              ></el-input-number>
            </el-form-item>
          </el-row>

          <el-row>
            <el-form-item label="每笔数量(股)" prop="tradeStockNum" required>
              <el-input-number
                v-model="form.tradeStockNum"
                type="input"
                placeholder="输入数量"
                :step="100"
              ></el-input-number>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="筹码锁定(股)" prop="lockStockNum">
              <el-input-number
                v-model="form.lockStockNum"
                type="input"
                placeholder="输入数量"
                :step="100"
              ></el-input-number>
            </el-form-item>
          </el-row>

          <el-row>
            <el-form-item label="区间下限(￥)" prop="lowPriceVal">
              <el-input-number
                v-model="form.lowPriceVal"
                type="input"
                placeholder="输入价格"
                :precision="2"
              ></el-input-number>
            </el-form-item>
            <el-form-item label="区间上限(￥)" prop="highPriceVal">
              <el-input-number
                v-model="form.highPriceVal"
                type="input"
                placeholder="输入价格"
                :precision="2"
              ></el-input-number>
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
import { searchStock, getStockList } from "@/api/stock";
import { savePlan, startPlan, stopPlan, deletePlan, getPlanList } from "@/api/gridplan";

export default {
  data() {
    return {
      dataList: [],
      selectStockList: [],
      listLoading: true,
      pageInfo: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        runningStatus:0
      },

      composeId: "",
      queryParams: {},
      dialogFormVisible: false,
      summaryProfit:0,
      stockSelectOptions: [],
      form: {
        id: undefined,
        composeId: undefined,
        stockCode: undefined,
        stockName: undefined,
        basePrice: undefined,
        tradeStockNum: undefined,

        increasePer: undefined,
        decreasePer: undefined,

        lockStockNum: undefined,
        highPriceVal: undefined,
        lowPriceVal: undefined,
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
        basePrice: [
          {
            required: true,
            message: "请输入基准价格",
            trigger: "blur",
          },
        ],
        tradeStockNum: [
          {
            required: true,
            message: "请输入每笔数量",
            trigger: "blur",
          },
        ],
        increasePer: [
          {
            required: true,
            message: "请输入上涨卖出幅度",
            trigger: "blur",
          },
        ],
        decreasePer: [
          {
            required: true,
            message: "请输入下跌买入幅度",
            trigger: "blur",
          },
        ],
      },
    };
  },
  async created() {
    this._queryParams = _.cloneDeep(this.queryParams);
    // console.log(this._queryParams);
    this.composeId = this.$route.query.composeId;
    console.log("composeId", this.composeId);
    this.selectStockList = await this.optionSelectList();

    this.getList(1, 10);
  },
  mounted() {},
  methods: {
    async optionSelectList() {
      let query = {
        composeId: this.composeId,
      };
      let res = await getStockList(query);
      return res.data;
    },
    onStockSelected(value){
       let arr = this.selectStockList.filter(item => item.stockCode === value)
       if(arr && arr.length){
          let item = arr[0]
          this.form.stockCode = item.stockCode
          this.form.stockName = item.stockName
          this.form.basePrice = item.curPrice
       }
    },
    getTextPriceClass(price) {
      if (!price || price == 0) return "text-normal";

      return price > 0 ? "text-red" : "text-green";
    },
    resetForm() {
      this.form = {
        id: undefined,
        composeId: undefined,
        stockCode: undefined,
        stockName: undefined,
        basePrice: undefined,
        tradeStockNum: undefined,

        lockStockNum: undefined,
        increasePer: undefined,
        decreasePer: undefined,
        highPriceVal: undefined,
        lowPriceVal: undefined,
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
    handleStart(row) {
      this.doStartPlan(row.id);
    },
    handleStop(row) {
      this.doStartPlan(row.id);
    },
    handleDelete(row) {
      let id = row.id;
      this.$confirm('是否确认废弃改计划?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then(() => {
          this.doDeletePlan(id)
      })
      .catch(() => { })
    },
    async doStartPlan(id){
      // let data = {
      //   id: id
      // };
      let res = await startPlan(id).catch((err) => {
        throw err;
      });
      this.$alert("启动计划成功").then(() => {
        this.getList(1, this.pageInfo.pageSize);
      });
    },
    async doStopPlan(id){
      // let data = {
      //   id: id
      // };
      let res = await stopPlan(id).catch((err) => {
        throw err;
      });
      this.$alert("停止计划成功").then(() => {
        this.getList(1, this.pageInfo.pageSize);
      });
    },
    async doDeletePlan(id){
      // let data = {
      //   id: id
      // };
      let res = await deletePlan(id).catch((err) => {
        throw err;
      });
      this.$alert("废弃计划成功").then(() => {
        this.getList(1, this.pageInfo.pageSize);
      });
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
    resetQuery() {},

    handleTrade(data) {
      this.open = true;
      // this.$nextTick(() => {
      //   this.resetForm();
      // });

      this.form = {
        composeId: this.composeId,
        stockCode: data ? data.stockCode : undefined,
        stockName: data ? data.stockName : undefined,
        basePrice: data ? data.basePrice : undefined,
        tradeStockNum: 500,
        lockStockNum: 100,
        increasePer: 3.00,
        decreasePer: 3.00,
      };

      // this.form.id = undefined;
      this.title = "新建计划";
    },
    /** 提交按钮 */
    submitForm: function () {
      if (this.form.tradeStockNum % 100 != 0) {
        this.$alert("每笔交易必须是100的整数");
        return;
      }
      if (this.form.lockStockNum && this.form.lockStockNum % 100 != 0) {
        this.$alert("筹码锁定必须是100的整数");
        return;
      }
      this.$refs["form"].validate((valid) => {
        if (valid) {
          let data = {
            ...this.form,
          };
          console.log(data);
          data.composeId = this.composeId;
          
          this.doSavePlan(data);
          this.open = false;
        }
      });
    },
    async doSavePlan(data) {
      let res = await savePlan(data).catch((err) => {
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
      let res = await getPlanList(data);
      this.dataList = res.data.content;
      this.summaryProfit = res.data.summaryProfit;
      this.pageInfo.runningStatus = 0;
      this.pageInfo.total = this.dataList.length;
      for (let index = 0; index < this.dataList.length; index++) {
        if(this.dataList[index].status === 1){
          this.pageInfo.runningStatus++;
        }
      }
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

.contain {
  width: 100%;
  margin: auto;
  margin-top: 20px;
}
</style>
