<template>
  <div class="app-container">
    <div class="contain">
      <el-form ref="baseInfo" :model="baseInfo" :rules="rules" label-width="200px">
        <el-row>
          <el-form-item label="旧密码：" prop="password">
            <el-input v-model="baseInfo.password" type="password">
            </el-input>
          </el-form-item>
          <el-form-item label="新密码：" prop="newPassword">
            <el-input v-model="baseInfo.newPassword" placeholder="请输入8-32位新密码" type="password">
            </el-input>
          </el-form-item>
          <el-form-item label="重复密码：" prop="repeatPassword">
            <el-input v-model="baseInfo.repeatPassword" placeholder=""  type="password"></el-input>
          </el-form-item>
          <el-form-item>
            <div style="line-height:20px">注：密码须由字母、数字和特殊字符中两者组成，特殊字符支持~!@#$%^&*()-+=?,.;:[]{}/\|等。</div>
          </el-form-item>
        </el-row>
      </el-form>
      <div class="tc mt30">
        <el-button size="small" @click="cancel" class="operate-btn-width">返回</el-button>
        <el-button type="primary" size="small" @click="submitForm" class="operate-btn-width">重置密码</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { logout,resetPassword } from "@/api/user"

export default {
  data() {
    return {
      baseInfo: {
        password: null,
        newPassword: null,
        repeatPassword: null
      },

      rules: {
        password: [
          {
            required: true,
            message: "请输入旧密码",
            trigger: "blur"
          }
        ],
        newPassword: [
          {
            required: true,
            message:
              "密码须由字母、数字和特殊字符中两者组成",
            // pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/,
            pattern: /^[\~\!\@\#\$\%\^\&\*\(\)\-\+\=\?\,\.\;\:\[\]\{\}\/\\\|0-9A-Za-z]{8,32}$/,
            trigger: "blur"
          }
        ],
        repeatPassword: [
          {
            required: true,
            message: "请输入确认密码",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {},
  methods: {
    /** 退出登录 */
    async loginOut() {
    //   let data = {};
     await this.$store.dispatch('user/logout')
      // let res = await logout().catch(err => {
      //   throw err;
      // });

       this.$router.push({
         path: '/login',
      });
    },

    /** 修改密码 */
    async resetPassword() {
      this.$gLoading.show();
      let data = {
        srcPassword: this.baseInfo.password,
        password: this.baseInfo.newPassword
      };
      this.loading = true;
      let res = await resetPassword(data).catch(err => {
        this.$gLoading.hide();
        throw err;
      });
      this.$gLoading.hide();
      this.loginOut();

    },

    cancel() {
        this.$router.push({
        name: "Profile"
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["baseInfo"].validate(valid => {
        if (valid) {
          if (this.baseInfo.newPassword != this.baseInfo.repeatPassword) {
            this.$alert("新密码和重复密码输入不一致，请重新输入");
          } else {
            this.resetPassword();
          }
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.contain {
  width: 40%;
  margin: auto;
  margin-top: 50px;
}
</style>
