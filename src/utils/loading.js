import { Loading } from 'element-ui';

/* loading, 其中options配置查看element-ui文档
  *开启：this.$loading.show(options);
  *关闭：this.$loading.hide(options);
  *状态：this.$loading.visible;
*/
const loading = {
  show (userOptions) {
    let options = userOptions || null;
    Loading.service(options);
    loading.visible = true;
  },
  hide () {
    let loadingInstance = Loading.service(null);
    loadingInstance.close();
    loading.visible = false;
  },
  visible: false
}

export default loading;
