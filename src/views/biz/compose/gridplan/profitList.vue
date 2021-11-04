<template>
  <div >
    <el-table
      v-loading="listLoading"
      :data="dataList"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <!-- <el-table-column align="center" label="行号" width="95">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column> -->

      <el-table-column align="center" label="成交日期" width="160">
        <template slot-scope="scope">
          {{ scope.row.sellTradeVO.createTime }} /{{ scope.row.buyTradeVO.createTime }} 
        </template>
      </el-table-column>
      
     
    <el-table-column align="center" label="类型">
        <!-- <template slot-scope="scope"> -->
          <!-- <span v-if="scope.row.action == 1" class="text-green">卖出</span> -->
          <!-- <span v-if="scope.row.action == 0" class="text-red">买入</span> -->
           <span class="text-red">高抛</span> / <span  class="text-green">低吸</span>
        <!-- </template> -->
      </el-table-column>
   
      <el-table-column align="center" label="成交价">
        <template slot-scope="scope">
         {{ scope.row.sellTradeVO.tradePrice }} / {{ scope.row.buyTradeVO.tradePrice }} 
        </template>
      </el-table-column>


     <el-table-column align="center" label="成交数量">
        <template slot-scope="scope">
      
           {{ scope.row.sellTradeVO.tradeNum }} / {{ scope.row.buyTradeVO.tradeNum }}  
        </template>
      </el-table-column>

     
     <el-table-column align="center" label="成交金额">
        <template slot-scope="scope">
           {{ scope.row.sellTradeVO.totalMoney }} / {{ scope.row.buyTradeVO.totalMoney }} 
        </template>
      </el-table-column>
      
       <el-table-column align="center" label="兑现收益">
        <template slot-scope="scope">
           <span :class="getTextPriceClass(scope.row.profit)">  {{ scope.row.profit }}</span>

        </template>
      </el-table-column>
     
    </el-table>

  </div>
</template>

<script>

export default ({
  name: 'ProfitList',
  props: {
    dataList: {
      type: Array,
      default: []
    },
  },
  data() {
    return {
      listLoading: true,
    };
  },

  created() {
    this.listLoading = false;
  },
  methods: {
    getTextPriceClass(price) {
      //console.log("price:", price);
      if (!price || price == 0) return "text-normal";

      return price > 0 ? "text-red" : "text-green";
    },
  }
})
</script>
<style scoped>
.el-table .cell {
white-space: pre-line;
}
</style>
