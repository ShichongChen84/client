 <template>
 <header class="head-nav">
    <el-row>
        <el-col :span="6" class="logo-container">
        <img src="../assets/logo.png" class="logo" alt="logo" />
        <span class="title">The Bill System</span>
        </el-col>

        <el-col :span="6" class="user">
         <!-- <div class="userinfo"> -->
            <!-- <img src="user.avatar" class="avatar" alt="" /> -->
             <el-avatar :size="50" :src="user.avatar" class="avatar" />
            <div class="welcome">
            <p class="name comenname">Welcome</p>
            <p class="name avatarname">{{user.name}}</p>
          </div>
          
         <span class="dropdown-area">
            <el-dropdown trigger="click" @command="setDialogInfo">
              <span>
                <el-icon class="el-icon--right">
                  <arrow-down />
                </el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="info">personal information</el-dropdown-item>
                  <el-dropdown-item command="logout">log out</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </span> 
         <!-- </div>        -->
        </el-col>
    </el-row>
 </header>
 </template>

<script setup>
import { ref, reactive, computed } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
import { ArrowDown } from "@element-plus/icons-vue";
const router = useRouter();
const store = useStore();
const user = computed(() => {
  return store.getters.user;
});
// nav right drop-down box function
const setDialogInfo = (cmdItem) => {
  switch (cmdItem) {
    case "info":
      showIndoList();
      break;
    case "logout":
      logout();
      break;
  }
};
// Dropdown Box - Personal Information Options
const showIndoList = () => {
  router.push("/index/infoshow");
// console.log('personal info！');
};
// Dropdown Box - Logout Option
const logout = () => {
  //clean token
  localStorage.removeItem("eleToken");
  store.dispatch("clearCurrentState");
  router.push("/login");
// console.log("logout");
};
</script>


 
 <style scoped>
 .head-nav {
  width: 100%;
  height: 70px;
  min-width: 580px;
  padding: 5px;
  background: #324057;
  color: #fff;
  box-sizing: border-box;
}
.logo-container {
  
  line-height: 60px;
  min-width: 400px;
}
.logo {
  height: 50px;
  width: 50px;
  margin-right: 5px;
  vertical-align: middle;
  display: inline-block;
}
.title {
  vertical-align: middle;
  font-size: 22px;
  font-family: "Microsoft YaHei";
  letter-spacing: 3px;
}
.user {
  position: relative;
  line-height: 60px;
  text-align: right;
  float: right;
  padding-right: 25px;
}
.avatar {
  vertical-align: middle;
  display: inline-block;
}
.welcome {
  display: inline-block;
  width: auto;
  vertical-align: middle;
  padding: 0 5px;
}
.name {
  line-height: 20px;
  text-align: center;
  font-size: 14px;
}
.comename {
  font-size: 12px;
}
.avatarname {
  color: #409eff;
  font-weight: bolder;
}
.username{
    cursor: pointer;
    margin-right: 5px;
}
.dropdown-area {
  display: inline-block;
  position: absolute;
  top: 25px;
  cursor: pointer;
}
.el-dropdown {
  color: #fff;
}
 </style>