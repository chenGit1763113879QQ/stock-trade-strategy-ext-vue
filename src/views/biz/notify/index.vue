<template>
  <div class="app-container">
    <div>
      <el-form
        ref="queryForm"
        :inline="true"
        :model="queryParams"
        class="demo-form-inline"
      >
        <el-form-item label="股票" prop="code" :show-message="false">
          <el-select
            style="width: 100%"
            v-model="queryParams.code"
            :remote-method="stockSelectRemoteMethod"
            filterable
            remote
            placeholder="搜索股票名称/代码"
          >
            <el-option
              v-for="item in stockSelectOptions"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="发送时间:">
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

        <el-form-item label="计划类型">
          <el-select v-model="queryParams.planType" placeholder="请选择">
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
          {{ scope.row.composeName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="股票名称" width="160">
        <template slot-scope="scope">
          {{ scope.row.stockName }}({{ scope.row.code }})
        </template>
      </el-table-column>
      <el-table-column align="center" label="计划类型" width="160">
        <template slot-scope="scope">
          {{ scope.row.planType == "grid" ? "网格交易" : "T0交易" }}
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" label="交易类型" width="160">
        <template slot-scope="scope">
         <span v-if="scope.row.tradeType===0">买入</span>
          <span v-if="scope.row.tradeType===1" class="text-danger">卖出</span>
        </template>
      </el-table-column> -->
      <el-table-column align="center" label="通知渠道" width="160">
        <template slot-scope="scope">
          {{ scope.row.channelName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="标题" width="160">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="内容">
        <template slot-scope="scope">
          <span class="content">{{ scope.row.content }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="发送时间" width="160">
        <template slot-scope="scope">
          {{ scope.row.createTime }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 1" class="text-green">发送成功</span>
          <span v-if="scope.row.status === 2" class="text-danger"
            >发送失败</span
          >
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          {{ scope.row.created }}
        </template>
      </el-table-column> -->

      <!-- <el-table-column align="center" label="更新时间">
        <template slot-scope="scope">
          {{ scope.row.updated }}
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
import { queryByPage } from "@/api/message";
import { getStockSimpleList, searchStock } from "@/api/stock";

export default {
  data() {
    return {
      dataList: [],
      stockSelectOptions: [],
      listLoading: true,
      pageInfo: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      updateTimePeroid: "",
      currentRow: null,
      activeOptions: [
        {
          value: "grid",
          label: "网格交易",
        },
        {
          value: "t0",
          label: "TO交易",
        },
      ],
      queryParams: {
        composeId: "",
        startTime: "",
        endTime: "",
        planType: "",
        planId: "",
        code: "",
      },
    };
  },
  created() {
    this._queryParams = _.cloneDeep(this.queryParams);
    console.log(this._queryParams);
    this.getList(1, 10);
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
      });
      // this.stockSelectOptions = res.data.data
    },
    getTextPriceClass(price) {
      //console.log("price:", price);
      if (!price || price == 0) return "text-normal";

      return price > 0 ? "text-red" : "text-green";
    },
    async optionSelectList() {
      let query = {
        composeId: this.composeId,
      };
      let res = await getStockSimpleList(query);
      return res.data;
    },
    resetForm() {
      //   this.form = {
      //     roleId: undefined,
      //     enname: undefined,
      //     roleName: undefined,
      //     status: undefined,
      //     remark: undefined,
      //     menuIdList: [],
      //     roleSort: undefined
      //   };
      this.$refs.form.resetFields();
    },

    // 取消按钮
    cancel() {
      this.open = false;
      this.resetForm();
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
      this.updateTimePeroid = [];
      this.queryParams = {
        planType: undefined,
        code: undefined,
      };
      this.handleQuery();
    },
    handleClick(row) {
      console.log(row);
    },

    doLoad() {
      this.list = undefined;
      console.log(this.updateTimePeroid);
      this.getList(1, 10);
    },

    /** 查询角色列表 */
    async getList(index, size, other = {}) {
      this.listLoading = true;

      let data = {
        pageNum: index,
        pageSize: size,
        startDate: this.updateTimePeroid[0],
        endDate: this.updateTimePeroid[1],
        ...other,
      };
      let res = await queryByPage(data);
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

.content {
  display: block;
  word-break: keep-all;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
