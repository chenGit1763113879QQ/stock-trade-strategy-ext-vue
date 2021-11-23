<template>
  <div class="app-container">
    <div>
      <el-form
        ref="queryForm"
        :inline="true"
        :model="planData"
        class="demo-form-inline"
      >
        <el-row>
          <el-col :span="4">
            <el-form-item label="" prop="capital">
              <span style="font-size: 16px"> {{ planInfo.stockName }} </span>
              <span style="font-size: 16px" :class="getTextPriceClass(planInfo.updown)">{{ planInfo.price }} ({{ planInfo.updown }}
                {{ planInfo.percent }}%)</span>
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <el-form-item label="累计获利(元):" prop="capital">
              <span
                :class="getTextPriceClass(planInfo.profitMoney)"
                style="font-size: 18px"
              >
                {{ planInfo.profitMoney }}</span
              >
            </el-form-item>
          </el-col>
        </el-row>

         <el-row>
          <el-col :span="4">
            <el-form-item label="下次低吸金额:">
              <span class="text-green">{{ planInfo.nextBuyPrice }}</span>
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <el-form-item label="下次高抛金额:">
              <span class="text-red">{{ planInfo.nextSellPrice }}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="4">
            <el-form-item label="高抛次数:">
              <span>{{ planInfo.sellNumber }}</span>
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <el-form-item label="低吸次数:">
              <span>{{ planInfo.buyNumber }}</span>
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <el-form-item label="持仓数量:">
              <span>{{ planInfo.stockNumber }}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- <el-row>
          <el-col>
            <el-form-item label="参数">
            </el-form-item>
          </el-col>
        </el-row> -->

        <el-row>
          <el-col :span="4">
            <el-form-item label="基准价:">
              <span>{{ planData.basePrice }}</span>
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <el-form-item label="高抛:">
              <span>{{ planData.increasePer }}%</span>
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <el-form-item label="低吸:">
              <span>{{ planData.decreasePer }}%</span>
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <el-form-item label="筹码锁定(股):">
              <span>{{ formatVal(planData.lockStockNum) }}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="4">
            <el-form-item label="价格区间:">
              <span>{{ formatVal(planData.lowPriceVal) }} - {{ formatVal(planData.highPriceVal) }}</span>
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <el-form-item label="创建时间:">
              <span>{{ planData.createTime }}</span>
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <el-form-item label="状态:">
              <!-- 未启动0，交易中1，已停止2 -->
              <span v-if="planData.status === 1" class="text-green"
                >交易中</span
              >
              <span v-if="planData.status === 0" class="text-normal"
                >未启动</span
              >
              <span v-if="planData.status === 2" class="text-normal"
                >已停止</span
              >
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
      <el-tabs
        ref="composeTab"
        style="margin-top: 0px"
        v-model="editableTabsValue"
        @tab-click="handleClick"
      >
        <!-- <el-tab-pane
          v-for="item in editableTabs"
          :key="item.name"
          :label="item.title"
          :name="item.name"
          :closable="item.close"
        >
          <component :is="item.content" :objId="item.name"></component>
        </el-tab-pane> -->

        <el-tab-pane label="交易明细" name="tradeList">
          <!-- <component :is="tradeList" ></component> -->
          <trade-list :dataList="this.tradeRecordList"></trade-list>
        </el-tab-pane>
        <el-tab-pane label="套利配对" name="profitList">
          <!-- <component :is="profitList" ></component> -->
           <profit-list :dataList="this.tradeProfitList"></profit-list>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import profitList from "./profitList.vue";
import tradeList from "./tradeList.vue";

import { getDetail } from "@/api/gridplan";

export default {
  components: {
    profitList: profitList,
    tradeList: tradeList,
  },
  data() {
    return {
      editableTabsValue: "tradeList",
      editableTabs: [
        {
          title: "交易明细",
          name: "tradeList",
          content: tradeList,
          close: false,
        },
        {
          title: "套利配对",
          name: "profitList",
          content: profitList,
          close: false,
        },
      ],
      tabIndex: 0,
      planId: "",
      planData: {},
      tradeRecordList: [],
      tradeProfitList: [],
      planInfo: {
        planData: {},
        nextSellPrice: "",
        nextBuyPrice: "",
        stockNumber: "",
        buyNumber: "",
        sellNumber: "",
        price: "",
        updown: "",
        percent: "",
        stockCode: "",
        stockName: "",
        tradeRecordList: [],
        tradeProfitList: [],
      },
    };
  },
  methods: {
    handleClick(tab, event) {},
    formatVal(val){
      if(!val) return ""
      return val
    },
    getTextPriceClass(price) {
      //console.log("price:", price);
      if (!price || price == 0) return "text-normal";

      return price > 0 ? "text-red" : "text-green";
    },
    async doLoadDetail() {
       this.planId = this.$route.query.planId;
      let res = await getDetail(this.planId);
      this.planInfo = res.data;

      this.planData = this.planInfo.planData;
      this.tradeRecordList = this.planInfo.tradeRecordList;
      this.tradeProfitList = this.planInfo.tradeProfitList;
    },
  },
  created() {
    console.log(this.$route.query)
    this.doLoadDetail();
  },
};
</script>