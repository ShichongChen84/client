
<template>
  <div class="fundlist">
    <!-- Head Search and Add button -->
    <el-row class="fundlist-head">
      <el-col :span="16">
        <el-form
          ref="searchFormRef"
          :model="searchForm.data"
          :rules="searchRules"
          :inline="true"
        >
          <el-form-item label="filter by time：">
            <el-form-item prop="startTime">
              <el-date-picker
                v-model="searchForm.data.startTime"
                type="datetime"
                placeholder="Choose a start time"
              />
            </el-form-item>
            <span style="margin-left: -25px; margin-right: 5px">--</span>
            <el-form-item prop="endTime">
              <el-date-picker
                v-model="searchForm.data.endTime"
                type="datetime"
                placeholder="Choose an end time"
              />
            </el-form-item>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch()">SEARCH</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="2" :offset="6">
        <el-button type="primary" @click="handleAdd()">ADD</el-button>
      </el-col>
    </el-row>

    <!-- table表 -->
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column type="index" label="serial number" align="center" width="60">
        <template v-slot="scope">
          <span>{{ scope.$index+(paginations.data.page_index - 1) * paginations.data.page_size + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="create time" align="center" width="175">
        <template v-slot="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ formatDate(scope.row.date) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="payment type" align="center" width="120">
      </el-table-column>
      <el-table-column
        prop="describe"
        label="Description"
        align="center"
        width="180"
      >
      </el-table-column>
      <el-table-column prop="income" label="income" align="center" width="90">
        <template v-slot="scope">
          <span style="color: #00d053">{{ scope.row.income }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="expend" label="outcome" align="center" width="90">
        <template v-slot="scope">
          <span style="color: #f56767">{{ scope.row.expend }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="cash" label="account cash" align="center" width="110">
        <template v-slot="scope">
          <span style="color: #4db3ff">{{ scope.row.cash }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="note" align="center" width="120">
      </el-table-column>
      <el-table-column
        label="operation"
        prop="operation"
        fixed="right"
        align="center"
      >
        <template v-slot="scope">
          <el-button
            type="warning"
            :icon="Edit"
            size="small"
            @click="handleEdit(scope.row)"
            >edit</el-button
          >
          <el-button
            size="small"
            :icon="Delete"
            type="danger"
            @click="handleDelete(scope.row)"
            >delete</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- pagination -->
    <div class="pagination">
      <el-pagination
        v-model:currentPage="paginations.data.page_index"
        v-model:page-size="paginations.data.page_size"
        :page-sizes="paginations.data.page_sizes"
        :layout="paginations.data.layout"
        :total="paginations.data.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 新增，编辑弹窗 -->
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="AddOrUpdateRef"
      :formData="formData"
      @refreshList="getTableData"
    ></add-or-update>
  </div>
</template>

<script setup>
import { ref, reactive, computed, nextTick, onActivated } from "vue";
import { getCurrentInstance } from "@vue/runtime-core";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

// element-plus
import { ElMessage, ElMessageBox } from "element-plus";
import { Delete, Edit } from "@element-plus/icons-vue";

// add-or-update
import AddOrUpdate from "@/views/FundList/AddOrUpdate";

// api
import { getTableList } from "@/api/index";
import { deleteData } from "@/api/index";

const router = useRouter();
const store = useStore();
const currentInstance = getCurrentInstance();

const ruleFormRef = ref("");
const AddOrUpdateRef = ref("");
const addOrUpdateVisible = ref(false);

const searchForm = reactive({
  data: {
    startTime: "",
    endTime: "",
  },
});
const searchRules = reactive({
  startTime: [
    {
      type: "date",
      required: true,
      message: "Please pick a date",
      trigger: "change",
    },
  ],
  endTime: [
    {
      type: "date",
      required: true,
      message: "Please pick a time",
      trigger: "change",
    },
  ],
});

const tableData = ref([]);
const allTableData = ref([]);
const fileterTableData = ref([]);

const paginations = reactive({
  data: {
    page_index: 1, //current page
    total: 0, //total page amount
    page_size: 5, //amount of items each page have 
    page_sizes: [5, 10, 15], 
    layout: "total,sizes,prev,pager,next,jumper", // 
  },
});

const formData = reactive({});

// get table data
const getTableData = () => {
  getTableList().then((res) => {
    allTableData.value = res.data;
    fileterTableData.value = res.data;
    //Set pagination data
    setPaginations();
  });
};

const formatDate = (time) => {
  let date = new Date(new Date(time).getTime() + 8 * 3600 * 1000).toJSON();
  date = date.substring(0, 19).replace("T", " ");
  return date;
};

// search
const handleSearch = () => {
  // two conditions can not be empty
  if (!searchForm.data.startTime || !searchForm.data.endTime) {
    ElMessage({
      message: "Please select a time period",
      type: "warning",
    });
    getTableData();
    return;
  }
  const sTime = searchForm.data.startTime.getTime();
  const eTime = searchForm.data.endTime.getTime();
  allTableData.value = fileterTableData.value.filter((item) => {
    let date = new Date(item.date);
    let time = date.getTime();
    return time >= sTime && time <= eTime;
  });
  setPaginations();
};

// add new
const handleAdd = () => {
  // Initialize formData because only one-way assignment is required, so no toRefs
  formData.data = {
    type: "",
    describe: "",
    income: 0,
    expend: 0,
    cash: 0,
    remark: "",
  };
  addOrUpdateVisible.value = true;
  nextTick(() => {
    currentInstance.ctx.$refs.AddOrUpdateRef.init();
  });
};

// edit
const handleEdit = (row) => {
  // Initialize formData because only one-way assignment is required, so no toRefs
  formData.data = {
    type: row.type,
    describe: row.describe,
    income: row.income,
    expend: row.expend,
    cash: row.cash,
    remark: row.remark,
    _id: row._id,
  };
  addOrUpdateVisible.value = true;
  nextTick(() => {
    currentInstance.ctx.$refs.AddOrUpdateRef.init();
  });
};

// delete
const handleDelete = (row) => {
  ElMessageBox.confirm("Data cannot be recovered after deletion, confirm deletion?", "hint", {
    confirmButtonText: "confirm",
    cancelButtonText: "cancel",
    type: "warning",
  }).then(() => {
    deleteData(row._id).then(() => {
      ElMessage({
        message: "operation success",
        type: "success",
      });
      getTableData();
    });
  });
};

const setPaginations = () => {
  paginations.data.total = allTableData.value.length;
  paginations.data.page_index = 1;
  paginations.data.page_size = 5;
  //Set default pagination data
  tableData.value = allTableData.value.filter((item, index) => {
    return index < paginations.data.page_size;
  });
};

const handleSizeChange = (page_size) => {
  paginations.data.page_index = 1;
  paginations.data.page_size = page_size;
  tableData.value = allTableData.value.filter((item, index) => {
    return index < page_size;
  });
};

const handleCurrentChange = (page) => {
  //number 1
  let index = paginations.data.page_size * (page - 1);
  //number 2
  let nums = paginations.data.page_size * page;
  tableData.value = allTableData.value.slice(index, nums);
};

// getTableData();
onActivated(() => {
  console.log('onActivated-list');
  getTableData();
})
</script>

<style scoped>
.fundlist-head {
  margin-bottom: 20px;
  margin-top: 10px;
}

.pagination {
  float: right;
  margin-top: 10px;
}
</style>
