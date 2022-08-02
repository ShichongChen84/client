<template>
  <el-aside :width="isCollapse ? '64px' : '200px'">
    <div class="toggle-button" @click="toggleCollapse">|||</div>
    <!-- sidebar menu area -->
    <el-menu
      active-text-color="#409Eff"
      background-color="#324057"
      text-color="#fff"
      unique-opened
      :router="true"
      :collapse="isCollapse"
      :collapse-transition="false"
    >
      <el-menu-item index="/index">
        <el-icon><House /></el-icon>
        <span>Front Page</span>
      </el-menu-item>

      <el-sub-menu index="1">
        <template #title>
          <el-icon><TrendCharts /></el-icon>
          <span>money management</span>
        </template>
        <el-menu-item-group title="table">
          <el-menu-item index="/index/fundlist">cash flow</el-menu-item>
          <el-menu-item index="/index/fundstatistics">Income and expenditure</el-menu-item>
        </el-menu-item-group>

        <el-menu-item-group title="chart">
          <el-menu-item index="/index/fundchart">Monthly Net Income</el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>

      <el-sub-menu index="2">
        <template #title>
          <el-icon><Setting /></el-icon>
          <span>Information management</span>
        </template>
        <el-menu-item-group title="Group One">
          <el-menu-item index="/index/infoshow">Personal Information</el-menu-item>
          <el-menu-item index="/index/sysinfoshhow">System Information</el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
    </el-menu>
  </el-aside>
</template>

<script setup>
import { ref, reactive } from "vue";
import {
  House,
  TrendCharts,
  Setting,
} from '@element-plus/icons-vue'
const emit = defineEmits(["changeCollapse"]);
// 
const isCollapse = ref(false);
const changeCollapse = (isCollapse) => {
  emit("changeCollapse", isCollapse);
};
const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value;
  changeCollapse(isCollapse.value);
};
</script>


<style scoped>
.el-aside {
  background-color: #324057;
  height: calc(100%-70px);
}
.el-aside .el-menu {
  border-right: none;
}
.iconfont {
  margin-right: 10px;
}
.toggle-button {
  background-color: #324057;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>