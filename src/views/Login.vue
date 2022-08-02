<template>
    <div class="login">
        <section class="form_container">
            <div class="manage_tip">
                <span class="title">The Bill System</span>
                 <el-form
                    ref="loginForm"
                    :model="loginUser"
                   
                    :rules="rules"
                    label-width="60px"
                    class="loginForm"
                >
                   
                   <el-form-item label="Email" prop="email">
                    <el-input v-model="loginUser.email" placeholder="Please input the email " />
                    </el-form-item>

                    <el-form-item label="Password" prop="name">
                    <el-input type="password" v-model="loginUser.password" placeholder=" Please input the password " />
                    </el-form-item>

                    <el-form-item>
                    <el-button type="primary" class="submit_btn" @click="submitForm('loginForm')">login</el-button>
                    </el-form-item>
                    <div class="tiparea">
                        <p>
                        do not have an account？now<router-link to="/register">register</router-link>
                        </p>
                    </div>


                </el-form>
            </div>
           
       
        </section>
    </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { loginSubmit } from '@/api/user'
import jwt_decode from "jwt-decode";
import { useStore } from "vuex";
// check two password
// const validatePasswordRepeated = (rule, value, callback) => {
//   if (value !== registerUser.password) {
//     callback(new Error("Two inputs don't match!"));
//   } else {
//     callback();
//   }
// };
const router = useRouter();
const store = useStore();
const loginForm = ref(null);
const loginUser = reactive({
  name: "",
  email: "",
  password: "",
  passwordRepeated: "",
  identity: "",
});
const rules = reactive({
 
  email: [
    {
      type: "email",
      required: true,
      message: "email format is incorrect",
      trigger: "blur",
    },
  ],
  password: [
    {
      required: true,
      message: "password can not be empty",
      trigger: "blur",
    },
    {
      min: 6,
      max: 30,
      message: "must between 6-30 characters",
      trigger: "blur",
    },
  ],
  
});

const isEmpty = (value) => {
  return (
    value === undefined ||
    value === null ||
    (typeof value === "object" && Object.keys(value).length === 0) ||
    (typeof value === "string" && value.trim().length === 0)
  );
};
const submitForm = () => {
  loginForm.value.validate(async (isvalid) => {
    if (isvalid) {
      loginSubmit(loginUser)
      // this.$axios.post("/api/users/register", this.registerUser)

    //   .then(() => {
        .then((res) => {
        //   get token from res.data and save at localStorage
        const { token } = res.data;
        localStorage.setItem("eleToken", token);
        // encode token to vuex
        const decoded = jwt_decode(token);
        console.log(decoded);
        store.dispatch("setAuthenticated",!isEmpty(decoded));
        store.dispatch("setUser",decoded);

        ElMessage({
          message: "login success",
          type: "success",
        });
      router.push("/index");
      })
    } else {
      ElMessage({
        type: "error",
        message: "Please fill in the login information correctly",
        showClose: true,
      });
      return false;
    }
  });
};
// const submitForm = (formName) => {
//   console.log(formName);
// };
</script>




<style scoped>
.login {
  position: relative;
  width: 100%;
  height: 100%;
  background: url(../assets/bg.jpg) no-repeat center center;
  background-size: 100% 100%;
}
.form_container {
  width: 370px;
  height: 210px;
  position: absolute;
  top: 10%;
  left: 34%;
  padding: 25px;
  border-radius: 5px;
  text-align: center;
}
.form_container .manage_tip .title {
  font-family: "Microsoft YaHei";
  font-weight: bold;
  font-size: 26px;
  color: #fff;
}
.loginForm {
  margin-top: 20px;
  background-color: #fff;
  padding: 20px 40px 20px 20px;
  border-radius: 5px;
  box-shadow: 0px 5px 10px #cccc;
}

.submit_btn {
  width: 100%;
}
.tiparea {
  text-align: right;
  font-size: 12px;
  color: #333;
}
.tiparea p a {
  color: #409eff;
}

</style>


