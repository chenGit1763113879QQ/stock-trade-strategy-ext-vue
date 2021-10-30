<template>
  <div >
      <span>tradeList</span>
  </div>
</template>

<script>
import _ from 'lodash';

export default {
 
  data() {
    return {
    
      // 遮罩层
      loading: false,

      pageInfo: {
        pageIndex: 1,
        pageSize: 10,
        total: 0,
      },

      // 表格数据
      roleList: [],

      // 查询参数
      queryParams: {
        eventName: null,
        receiverGroup: null,
        serviceNo: null,
        templateContent: null,
      },
      _queryParams: {},
    };
  }
  
};
</script>
<style lang="scss" scoped>
.eleps {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
