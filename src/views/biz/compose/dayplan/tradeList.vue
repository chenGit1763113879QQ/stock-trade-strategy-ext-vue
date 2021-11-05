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
          {{ scope.row.createTime }} 
        </template>
      </el-table-column>
      
     
    <el-table-column align="center" label="类型">
        <template slot-scope="scope">
          <span v-if="scope.row.type == 1" class="text-red">卖出</span>
          <span v-if="scope.row.type == 0" class="text-green">买入</span>
           <!-- <span class="text-red">高抛</span> / <span  class="text-green">低吸</span> -->
        </template>
      </el-table-column>
   
      <el-table-column align="center" label="成交价">
        <template slot-scope="scope">
         {{ scope.row.tradePrice }}  
        </template>
      </el-table-column>


     <el-table-column align="center" label="成交数量">
        <template slot-scope="scope">
      
           {{ scope.row.tradeNum }}
        </template>
      </el-table-column>

     
     <el-table-column align="center" label="成交金额">
        <template slot-scope="scope">
           {{ scope.row.totalMoney }} 
        </template>
      </el-table-column>
      
    
     
    </el-table>

  </div>
</template>

<script>

export default ({
  name: 'TradeList',
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
