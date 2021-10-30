<template>
  <div class="app-container">
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
        style="margin-top: 15px"
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
          <component :is="item.content" :objId="item.name" ></component>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>

import stockList from "./stockList.vue";
import planList from "./planList.vue";
import tradeList from "./tradeList.vue";

export default {
  components: {
    stockList: stockList,
    planList: planList,
    tradeList: tradeList,
  },
  data() {
    return {
      editableTabsValue:"stockList",
      editableTabs: [
        {
          title: "持仓详情",
          name: "stockList",
          content: stockList,
          close: false,
        },
        {
          title: "区间套利",
          name: "planList",
          content: planList,
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
      composeId: "",
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
  },
  created(){
    this.composeId = this.$route.query.composeId;
    if(!this.composeId){
      this.composeId = "402880297ccf1b43017ccf1d18d00000"
      this.$route.query.composeId = this.composeId
    }
    console.log(this.composeId)
  }
};
</script>