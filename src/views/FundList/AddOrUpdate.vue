<template>
  <div>
    <el-dialog
      v-model="dataFormVisible"
      :title="dataForm.data._id ? 'edit' : 'new'"
      :before-close="handleClose"
    >
      <el-form
        ref="dataFormRef"
        :model="dataForm.data"
        :rules="dataFormRules"
        label-width="100px"
      >
        <el-form-item label="type：" prop="type">
          <el-input v-model="dataForm.data.type" maxlength="12" clearable />
        </el-form-item>
        <el-form-item label="describe：" prop="describe">
          <el-input
            v-model="dataForm.data.describe"
            :rows="2"
            type="textarea"
            clearable
          />
        </el-form-item>
        <el-form-item label="income：" prop="income">
          <el-input-number v-model.number="dataForm.data.income" />
        </el-form-item>
        <el-form-item label="spend：" prop="expend">
          <el-input-number v-model.number="dataForm.data.expend" />
        </el-form-item>
        <el-form-item label="account cash：" prop="cash">
          <el-input-number v-model.number="dataForm.data.cash" />
        </el-form-item>
        <el-form-item label="remark：" prop="remark">
          <el-input
            v-model="dataForm.data.remark"
            :rows="2"
            type="textarea"
            clearable
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleNotSaveClose">close</el-button>
          <el-button type="primary" @click="handleCommit(dataFormRef)"
            >affirm</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>


<script setup>
import { reactive, ref, unref, toRefs } from "vue";
import { ElMessage } from "element-plus";
import { addData, editData } from "@/api/index";

const dataFormVisible = ref(false);
const dataFormRef = ref("");

const props = defineProps(["formData"]);
const emit = defineEmits(["refreshList"]);

const dataForm = reactive({
  data: {},
});
const dataFormRules = reactive({
  type: [
    {
      required: true,
      message: "Payment type cannot be empty",
      trigger: "blur",
    },
  ],
  describe: [
    {
      required: true,
      message: "Account description cannot be empty",
      trigger: "blur",
    },
  ],
  income: [
    {
      type: "number",
      trigger: "blur",
    },
  ],
  expend: [
    {
      type: "number",
      trigger: "blur",
    },
  ],
  cash: [
    {
      type: "number",
      trigger: "blur",
    },
  ],
  remark: [
    {
      trigger: "blur",
    },
  ],
});

const init = () => {
  dataFormVisible.value = true;
  console.log(props.formData.data._id);
  // Add a new window and saveForm in localStorage
  if (props.formData.data._id == undefined && localStorage.saveForm) {
    // Read data assignment from localstorage
    dataForm.data = JSON.parse(localStorage.getItem("saveForm"));
  } else {
    dataForm.data = props.formData.data;
  }
  const { data } = toRefs(dataForm);
};

// Window closed without commit operation
const handleClose = () => {
  // Added a window and automatically store data to localStorage
  if (!dataForm.data._id) {
    localStorage.setItem("saveForm", JSON.stringify(dataForm.data));
  }

  dataFormVisible.value = false;
};
const handleNotSaveClose = () => {
  // clear localStorage
  if (localStorage.saveForm && !dataForm.data._id) {
    localStorage.removeItem("saveForm");
  }
  dataFormVisible.value = false;
};

// submit
const handleCommit = async (formEl) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      if (!dataForm.data._id) {
        // new
        // Overwrite and merge, make sure that the unfilled item is not undefined -> 
        // the edit pop-up window will have a default value, otherwise it is undefined
        let params = Object.assign(
          {
            type: "",
            describe: "",
            income: 0,
            expend: 0,
            cash: 0,
            remark: "",
          },
          dataForm.data
        );
        addData(params).then(() => {
          // close popup
          dataFormVisible.value = false;
          // update table 
          emit("refreshList");

          ElMessage({
            message: "operation success",
            type: "success",
          });

          // clear localStorage
          if (localStorage.saveForm) {
            localStorage.removeItem("saveForm");
          }
        });
      } else {
        // edit
        editData(dataForm.data._id, dataForm.data).then(() => {
          // close popup
          dataFormVisible.value = false;
          // update table
          emit("refreshList");

          ElMessage({
            message: "operation success",
            type: "success",
          });
        });
      }
    }
  });
};

defineExpose({
  dataFormVisible,
  init,
});
</script>

<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>


