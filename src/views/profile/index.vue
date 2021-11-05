<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>个人信息</span>
      </div>
      <div>
        <div style="text-align:center;">
          <!-- <pan-thumb :image="image"  @click="changePassword"/> -->
          <!-- <userAvatar :user="userInfo" /> -->
           <!-- <el-image class="user-avatar-detail" @click.native="imagecropperShow=true" :src="userInfo.avatar" fit="fill"></el-image> -->
          <el-avatar class="user-avatar-detail"  @click.native="imagecropperShow=true" :src="image"></el-avatar>

           <image-cropper
          v-show="imagecropperShow"
          field="file"
          :key="imagecropperKey"
          :width="300"
          :height="300"
          url="/file/public/upload"
          @close="close"
          @crop-upload-success="cropSuccess"
        />
          <!-- <img class="user-avatar-detail" :src="userInfo.avatar" alt="" srcset="" /> -->
        </div>
        <ul class="list-group list-group-striped">
          <li class="list-group-item">
            <svg-icon icon-class="user" />用户名称
            <div class="pull-right">{{ userInfo.name }}</div>
          </li>
          <li class="list-group-item">
            <svg-icon icon-class="phone" />手机号码
            <div class="pull-right">{{ userInfo.phone }}</div>
          </li>
          <li class="list-group-item">
            <svg-icon icon-class="phone" />邮箱地址
            <div class="pull-right">{{ userInfo.email }}
              <el-button type="text" @click="supplement" style="padding:0;" v-if="!userInfo.email">补充</el-button>
              <el-button type="text" @click="supplement" style="padding:0;" v-if="userInfo.email">修改</el-button>
            </div>

          </li>

          <li class="list-group-item">
            <svg-icon icon-class="peoples" />所属角色
            <div class="pull-right" v-for="(item,index) in roleList" :key="index">
              {{ item.roleName+"&nbsp;&nbsp;&nbsp;"}}</div>
          </li>
          <li class="list-group-item">
            <svg-icon icon-class="date" />创建日期
            <div class="pull-right">{{ userInfo.created }}</div>
          </li>
          <li class="list-group-item">
            <svg-icon icon-class="eye" />登陆密码
            <div class="pull-right">
              <el-button type="text" style="padding:0;" @click="changePassword">修改</el-button>
            </div>
          </li>
        </ul>
      </div>
    </el-card>

    <el-dialog :title="title" :visible.sync="open" width="500px" :close-on-click-modal="false">
      <div class='contain'>
        <el-form ref="form" :model="form" label-width="100px">
          <el-form-item label="邮箱地址:">
            <el-input @blur="getEmail()" v-model="form.email" placeholder="请输入邮箱地址" clearable />
            <div class="el-form-item__error" v-if="error">请输入正确的邮箱地址</div>
          </el-form-item>
          <el-form-item label="">
              <div style="color:red;line-height:10px">注：多个邮箱之间用;隔开。</div>
            </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button :disabled="loading1" size="small" @click="cancel">取 消</el-button>
        <el-button type="primary" size="small" :loading="loading1" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import _ from "lodash";
import ImageCropper from '@/components/ImageCropper'
import { getInfo,updateEmail,updateAvatar } from "@/api/user";
import store from '@/store'

export default {
  name: "Profile",
  // components: { userAvatar, userInfo, resetPwd },
  // components: { userInfo, resetPwd },
   components: { ImageCropper },
  data() {
    return {
      loading1: false,
      title: "",
      open: false,
      error: false,
      image:"",
      userInfo: {},
      imagecropperShow: false,
      imagecropperKey: 0,
      roleList: [],
      form: {
        email: "",
      },
      // rule: {
      //   email: [
      //     {
      //       required: true,
      //       pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      //       message: "请输入正确的邮箱地址",
      //       trigger: "blur",
      //     },
      //   ],
      // },
    };
  },
  created() {
    this.getUserInfo();
  },
  methods: {
    
    close() {
      this.imagecropperShow = false
    },
    async doUpdateAvatar(avatarUrl){
        this.loading1 = true
        let data = {
          avatar: avatarUrl,
        };
        await updateAvatar(data).catch((err) => {
          this.loading1 = false
          err.done = true
          throw err;
        });

        await store.dispatch('user/updateAvatar', avatarUrl)
        this.loading1 = false
        //this.$alert("操作成功");
    },
    cropSuccess(resData) {
      this.imagecropperShow = false
      this.imagecropperKey = this.imagecropperKey + 1
      // this.image = resData.files.avatar
          //  console.log(resData);
     
      let imageUrl = process.env.VUE_APP_BASE_API + "/file/public/download?code=" + resData.connectId
      this.doUpdateAvatar(imageUrl)
      this.image = imageUrl
    },
    getUserInfo() {
      getInfo().then((res) => {
        this.userInfo = res.data;
        if(this.userInfo.avatar){
          this.image = this.userInfo.avatar
        }else{
          this.image = "https://iph.href.lu/128x128"
        }
        let data = []
        res.data.roleNameList.forEach(item => {
          data.push({roleName: item})
        });
        this.roleList = data;
        // this.userOrgList = res.orgList;
        // if (res.employeeType === "2") {
        //   this.roleList = [{ roleName: "商户管理员" }];
        // } else {
        //   this.roleList = res.roleList;
        // }
      });
    },

    // 邮箱验证
    getEmail() {
      // if (this.form.email) {
      //   const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      //   let res = reg.test(this.form.email);
      //   if (!res) {
      //     this.form.email = null;
      //     this.error = true;
      //   } else {
      //     this.error = false;
      //   }
      // } else {
      //   this.error = false;
      // }
      this.error = false;
    },

    //修改邮箱
    async updateemail() {
      this.loading1 = true
      let data = {
        email: this.form.email,
      };
      await updateEmail(data).catch((err) => {
        this.loading1 = false
        err.done = true
        throw err;
      });
      this.loading1 = false
      this.$alert("操作成功");
      this.getUserInfo();
      this.cancel();
    },

    
    changePassword() {
      this.$router.push({
        name: "ChangePassword",
      });
    },

    supplement() {
      if (this.userInfo.email) {
        this.form.email = _.cloneDeep(this.userInfo.email);
        this.title = "修改邮箱地址";
      }
      if (!this.userInfo.email) {
        this.title = "补充邮箱地址";
      }
      this.open = true;
    },
    cancel() {
      this.form = {
        email: "",
      };
      this.open = false;
    },
    submitForm() {
      if (this.form.email) {
        this.updateemail();
      }
    },
  },
  computed: {

  },
};
</script>

<style lang="scss">
.box-card {
  width: 50%;
  margin: 0 auto;
}
.user-avatar-detail {
  width: 100px;
  height: 100px;
  margin: 20px 0;
}
</style>
