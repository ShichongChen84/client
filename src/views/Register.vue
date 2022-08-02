<template>
    <div class="register">
        <section class="form_container">
            <div class="manage_tip">
                <span class="title">The Bill System</span>
                 <el-form
                    ref="registerForm"
                    :model="registerUser"
                   
                    :rules="rules"
                    label-width="80px"
                    class="registerForm"
                >
                    <el-form-item label="Username" prop="name">
                    <el-input v-model="registerUser.name" placeholder="Please input the username" />
                    </el-form-item>
                   <el-form-item label="Email" prop="email">
                    <el-input v-model="registerUser.email" placeholder="Please input the email " />
                    </el-form-item>
                    <el-form-item label="Password" prop="name">
                    <el-input type="password" v-model="registerUser.password" placeholder=" Please input the password " />
                    </el-form-item>
                    <el-form-item label="Verify" prop="password2">
                    <el-input type="password" v-model="registerUser.password2" placeholder=" Please verify the password " />
                    </el-form-item>
                     <el-form-item label="Identity" >
                    <el-select v-model="registerUser.identity" placeholder="Please choose the identity">
                     <el-option label="manager" value="manager" /> 
                     <el-option label="general user" value="employee" /> 
                    </el-select>
                    </el-form-item>
                    
                    <el-form-item>
                    <el-button type="primary" class="submit_btn" @click="submitForm('registerForm')">Register</el-button>
                    </el-form-item>
                </el-form>
            </div>
           
       
        </section>
    </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { registerSubmit } from '@/api/user'

// check two password 
const validatePasswordRepeated = (rule, value, callback) => {
  if (value !== registerUser.password) {
    callback(new Error("Two inputs don't match!"));
  } else {
    callback();
  }
};
const router = useRouter();
const registerForm = ref(null);
const registerUser = reactive({
  name: "",
  email: "",
  password: "",
  passwordRepeated: "",
  identity: "",
});
const rules = reactive({
  name: [
    {
      required: true,
      message: "username can not be empty",
      trigger: "blur",
    },
    {
      min: 2,
      max: 30,
      message: "must between 2-30 characters",
      trigger: "blur",
    },
  ],
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
  passwordRepeated: [
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
    {
      validator: validatePasswordRepeated,
      trigger: "blur",
    },
  ],
});
const submitForm = () => {
  registerForm.value.validate(async (isvalid) => {
    if (isvalid) {
      registerSubmit(registerUser)
      // this.$axios.post("/api/users/register", this.registerUser)
      .then(() => {
        ElMessage({
          message: "sign up success",
          type: "success",
        });
      router.push("/login");
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



















<!-- // <script>
// export default {
//   name: "register",
//   components:{},
//   data(){
//           const validatePass2 = (rule, value, callback) => {
//          if (value !== registerUser.password) {
//           callback(new Error("Two inputs don't match!"))
//         } else {
//           callback();
//         }
//       };
//     return{
//       registerUser:{
//         name:'',
//         email:'',
//         password:'',
//         password2:'',
//         identity:''
//       },
//       rules:{
//         name:[{
//            required: true,
//       message: "username can not be empty",
//       trigger: "blur",
//         },
//         {
//            min: 2,
//       max: 30,
//       message: "must between 2-30 characters",
//       trigger: "blur",

//         }],
//         email:[{
//           type: "email",
//       required: true,
//       message: "email format is incorrect",
//       trigger: "blur",
//         }],
//         password:[{
//           required: true,
//       message: "password can not be empty",
//       trigger: "blur",
//         },
//         {
//           min: 6,
//           max: 30,
//           message: "must between 6-30 characters",
//           trigger: "blur",
//         }
//         ],
//         password2:[{
//           required: true,
//       message: "password can not be empty",
//       trigger: "blur",
//         },
//         {
//           min: 6,
//           max: 30,
//           message: "must between 6-30 characters",
//           trigger: "blur",
//         },
//         {
//           validator: validatePass2,
//       trigger: "blur",
//         }]
//       }
//     }
//   },
//   methods:{
//     submitForm(formName){
//       console.log(formName);
//     }
//   }

// };
// </script> -->


<style scoped>
.register {
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
.registerForm {
  margin-top: 20px;
  background-color: #fff;
  padding: 20px 40px 20px 20px;
  border-radius: 5px;
  box-shadow: 0px 5px 10px #cccc;
}

.submit_btn {
  width: 100%;
}
</style>


