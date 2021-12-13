<template>
  <div class="app-container">
    <div>
      <el-form
        ref="queryForm"
        :inline="true"
        :model="composeInfo"
        class="demo-form-inline"
      >
        <el-row>
          <el-form-item label="组合" >
            <el-select
              v-model="queryForm.composeId"
              placeholder=""
              size="small"
              @change="onComposeSelected"
            >
              <el-option
                v-for="item in selectComposeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="4">
            <el-form-item label="总市值:" prop="capital">
              <span :class="getTextPriceClass(composeInfo.profitMoney)" style="font-size:18px" >
                {{ composeInfo.capital }}</span
              >
            </el-form-item>
          </el-col>

           <el-col :span="4">
            <el-form-item label="浮动盈亏:">
              <span :class="getTextPriceClass(composeInfo.profitMoney)"  style="font-size:18px">
                {{ composeInfo.profitMoney }}({{
                  composeInfo.profitPercent
                }}%)</span
              >
            </el-form-item>
          </el-col>
         
          <el-col :span="4">
            <el-form-item label="总资产:">
              <span>{{ composeInfo.balance }}</span>
            </el-form-item>
          </el-col>
          
           <el-col :span="4">
            <el-form-item label="初始总资产:">
              <span>{{ composeInfo.initBalance }}</span>
            </el-form-item>
          </el-col>


         
          <el-col :span="4">
            <el-form-item label="现金:">
              <span>{{ composeInfo.cash }}</span>
            </el-form-item>
          </el-col>



           <el-col :span="4">
            <el-form-item label="当前仓位:">
              <span>{{ composeInfo.positionPercent }}%</span>
            </el-form-item>
          </el-col>

         
        </el-row>

   
        <!-- <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
        </el-form-item> -->

        <!-- <el-form-item>
          <el-button type="normal" @click="resetQuery">重置</el-button>
        </el-form-item> -->
      </el-form>
    </div>
    <div class="panel">
      <!-- <el-row>
        <el-button type="primary" size="small" @click="addTab">
          添加组合
        </el-button>
        <el-button type="normal" size="small" @click="addTab">
          管理组合
        </el-button>
      </el-row> -->

      <el-tabs
        ref="composeTab"
        style="margin-top: 0px"
        v-model="editableTabsValue"
        @tab-click="handleClick"
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
  </div>
</template>
<script>
import stockList from "./stockList.vue";
import gridPlanList from "./gridPlanList.vue";
import dayPlanList from "./dayPlanList.vue";
import tradeList from "./tradeList.vue";

import { getDataList } from "@/api/compose";

export default {
  components: {
    stockList: stockList,
    gridPlanList: gridPlanList,
    dayPlanList: dayPlanList,
    tradeList: tradeList,
  },
  data() {
    return {
      selectComposeList: [],
      editableTabsValue: "stockList",
      editableTabs: [
        {
          title: "持仓详情",
          name: "stockList",
          content: stockList,
          close: false,
        },
        {
          title: "网格区间套利",
          name: "gridPlanList",
          content: gridPlanList,
          close: false,
        },
        {
          title: "TO日内套利",
          name: "dayPlanList",
          content: dayPlanList,
          close: false,
        },
        {
          title: "交易记录",
          name: "tradeList",
          content: tradeList,
          close: false,
        },
      ],
      tabIndex: 0,
      composeInfo: {
        id: "",
        name: "",
      },

      // composeId: "",
      queryForm: {
        composeId: "",
        composeName: "",
      },
    };
  },
  methods: {
    handleClick(tab, event) {
      // console.log(tab, event);
    },
    getTextPriceClass(price) {
      //console.log("price:", price);
      if (!price || price == 0) return "text-normal";

      return price > 0 ? "text-red" : "text-green";
    },
    async optionSelectList() {
      let data = {
        pageNum: 0,
        pageSize: 1000,
      };
      let res = await getDataList(data);
      return res.data.data;
    },

    onComposeSelected(value) {
      console.log("value:" + value);
      let arr = this.selectComposeList.filter((item) => item.id === value);
      if (arr && arr.length) {
        let item = arr[0];
        console.log(item);
        // this.composeId = item.id;
        this.composeInfo = item;
        this.$root.$emit("onComposeSelected", this.composeInfo.id);
        // this.form.stockCode = item.stockCode
        // this.form.stockName = item.stockName
        // this.form.basePrice = item.curPrice
      }
    },
  },
  async created() {
    this.selectComposeList = await this.optionSelectList();
    if (this.selectComposeList && this.selectComposeList.length) {
      this.composeInfo = this.selectComposeList[0];
      this.queryForm.composeId = this.composeInfo.id;
      this.queryForm.composeName = this.composeInfo.name;
      this.$root.$emit("onComposeSelected", this.composeInfo.id);
    }
  },
};
</script>