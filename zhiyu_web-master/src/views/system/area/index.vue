<template>
  <el-card shadow="never" class="card">
    <template #header>
      <div class="card-header">
        <span class="title">项目管理</span>
      </div>
    </template>
    <div class="r-m-t-20">
      <!-- 搜索 -->
      <!-- <el-form ref="menuRef" :inline="true" :model="queryParams" class="demo-form-inline">
        <el-form-item label="">
          <el-input v-model="queryParams.name" @keyup.enter="onSubmit" clearable placeholder="请输入所属大区/所属区域/项目名称" style="width: 350px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">搜索</el-button>
          <el-button @click="resetQuery" :icon="Refresh">重置</el-button>
        </el-form-item>
      </el-form> -->
      <el-input class="r-m-b-12 r-m-r-12" v-model="queryParams.name" @keyup.enter="onSubmit" clearable placeholder="请输入所属大区/所属区域/项目名称" style="width: 350px" />
      <el-button class="r-m-b-12" type="primary" @click="onSubmit">搜索</el-button>
      <el-button class="r-m-b-12 r-m-r-12" @click="resetQuery" :icon="Refresh">重置</el-button>
    </div>
    <!-- 按钮 -->
    <el-row :gutter="10" class="mb-12px">
      <el-col :span="1.5">
        <el-button type="primary" :icon="Plus" @click="handleAdd" :disabled="getAuth('system:area:add')">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button :icon="Sort" @click="toggleExpandAll" plain>展开/折叠</el-button>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-table
      v-if="refreshTable"
      :data="deptList"
      row-key="id"
      :default-expand-all="isExpandAll"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      height="calc(100vh - 305px)"
      header-row-class-name="table-header"
      class-name="table-without-border"
      border
    >
      <el-table-column show-overflow-tooltip prop="name" label="项目名称" width="150" />
      <el-table-column show-overflow-tooltip prop="id" label="ID" width="120" />

      <!-- 列表的是否启动 -->
      <el-table-column show-overflow-tooltip prop="enabled" label="是否启用">
        <template #default="scope">
          <el-switch v-model="scope.row.enabled" class="ml-2" active-value="1" inactive-value="0" @change="getenabled(scope.row)" />

          <!-- style="--el-switch-on-color:rgb(255, 152, 0) ; --el-switch-off-color: #808080" active-value="1" inactive-value="0"
            @change="getenabled(scope.row)" />

            style="--el-switch-on-color:rgb(255, 152, 0) ; --el-switch-off-color: #808080" active-value="1"
            inactive-value="0" @change="getenabled(scope.row)" /> -->
          <!-- <div>{{ scope.row.enabled }}</div> -->
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="" label="分类">
        <template #default="scope">
          <text v-if="scope.row.level == '1'">大区</text>
          <text v-if="scope.row.level == '2'">片区</text>
          <text v-if="scope.row.level == '3'">项目</text>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="sort" label="排序码" align="center" />
      <el-table-column show-overflow-tooltip prop="code" label="项目代码" align="center" />
      <el-table-column show-overflow-tooltip prop="parentArea.parentArea.name" label="所属大区" align="center" />
      <el-table-column show-overflow-tooltip prop="parentArea.name" label="所属片区" align="center" />
      <!-- <el-table-column show-overflow-tooltip prop="" label="客服电话" align="center" /> -->
      <el-table-column show-overflow-tooltip prop="regionName" label="所属区域" align="center" />
      <el-table-column show-overflow-tooltip prop="createTime" label="创建时间" :width="200" align="center" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" :width="200" fixed="left" type="">
        <template #default="scope">
          <el-link class="links" type="primary" @click="handleview(scope.row)" :disabled="getAuth('system:area:query')">查看</el-link>
          <el-link class="links" type="primary" @click="handleUpdate(scope.row)" :disabled="getAuth('system:area:edit')">修改</el-link>
          <el-link class="links" type="primary" @click="handleDelete(scope.row)" :disabled="getAuth('system:area:remove')">删除</el-link>

          <!-- <text class="but"  @click="handleview(scope.row)">查看</text>&nbsp;&nbsp;
          <text  class="but"   @click="handleUpdate(scope.row)">修改</text>&nbsp;&nbsp;
          <text class="but"  @click="handleDelete(scope.row)">删除</text>&nbsp;&nbsp;
          <el-link class="but" @click="handleview(scope.row)" :icon="View">查看</el-link>&nbsp;&nbsp;
          <el-link class="but" @click="handleUpdate(scope.row)" :icon="Edit">修改</el-link>&nbsp;&nbsp;
          <el-link class="but" @click="handleDelete(scope.row)" :icon="Delete">删除</el-link>&nbsp;&nbsp; -->
        </template>
      </el-table-column>
    </el-table>
  </el-card>
  <!-- 弹框 -->
  <el-dialog v-model="open" :title="title" width="600px" :close-on-press-escape="false" :close-on-click-modal="false" destroy-on-close>
    <el-form ref="menuRef1" :model="form" :rules="rules" label-width="100px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="项目名称" prop="name">
            <el-input clearable v-model="form.name" class="input" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="上级片区">
            <el-tree-select
              v-model="form.parentId"
              :data="menuOptions"
              clearable
              @node-click="parentArea"
              :props="{ value: 'id', label: 'name', children: 'children' }"
              value-key="id"
              placeholder="请选择片区"
              check-strictly
              class="tree-select"
            />
          </el-form-item>
        </el-col>
        <!-- <el-col :span="24">
            <el-form-item label="项目代码：" required prop="code">
              <el-input clearable v-model="form.code" class="input" style="margin-left:-10px;" />
          </el-col> -->
        <el-col :span="24">
          <el-form-item label="排序码" prop="sort">
            <el-input-number v-model="form.sort" controls-position="right" :min="0" :precision="0" />
          </el-form-item>
        </el-col>
        <!-- <el-col :span="24">
              <el-form-item label="客服电话:">
                <el-input v-model="form.sort"  class="input" />
              </el-form-item>
            </el-col> -->

        <el-col :span="24">
          <el-form-item label="是否启用" prop="enabled">
            <el-radio-group v-model="form.enabled" class="input" clearable>
              <el-radio value="1">启用</el-radio>
              <el-radio value="0">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="所属区域" prop="province">
            <el-select ref="provinceRef" v-model="form.province" class="m-2" placeholder="省份" @change="searchCity" style="margin-left: 1px; margin-top: 0px" clearable @clear="clear">
              <el-input v-model="proveName" @input="searchProve" placeholder="请输入省份名称" clearable />
              <el-option label="暂无数据" v-if="province.length == 0" value="暂无数据" :disabled="true" />
              <el-option v-for="item in province" :key="item.code" :label="item.name" :value="item.name" />
            </el-select>
            <span :class="areaMassgesStyle">{{ areaMassges }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item>
            <el-select ref="cityRef" :disabled="form.province ? false : true" v-model="form.city" class="m-2" placeholder="城市" @change="searchCountys" style="margin-top: 0px" clearable>
              <el-input v-model="cityName" @input="searchCity" placeholder="请输入城市名称" clearable />
              <el-option label="暂无数据" v-if="citys.length == 0" value="暂无数据" :disabled="true" />
              <el-option v-for="item in citys" :key="item.code" :label="item.name" :value="item.name" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item>
            <el-select
              ref="countysRef"
              :disabled="form.province && form.city ? false : true"
              multiple
              v-model="form.county"
              class="m-2"
              placeholder="区县"
              @change="selectCountys($event)"
              style="margin-top: 0px"
              clearable
            >
              <el-input v-model="countyName" @input="searchCountys" placeholder="请输入区名称" clearable />
              <el-option label="暂无数据" v-if="sanCitys.length == 0" value="暂无数据" :disabled="true" />
              <el-option v-for="item in sanCitys" :key="item.code" :label="item.name" :value="item.name" />
            </el-select>
            <!-- @change="selectorThreeCity" -->
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="submitForm(menuRef1)" :loading="submiting"> 确定 </el-button>
        <el-button @click="cancel(menuRef1)">取消</el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 查看项目单窗 -->
  <el-dialog v-model="openProject" title="查看项目" :close-on-click-modal="false">
    <div style="padding: 10px 10px 20px 20px; line-height: 30px">
      <div style="border: 1px solid black; border-bottom: none">
        <div style="display: inline-block; width: 300px; background-color: rgb(240, 250, 255); text-align: center"> ID: </div>
        <div style="display: inline-block; width: 300px; text-align: center">
          {{ form.id }}
        </div>
      </div>

      <div style="border: 1px solid black; border-bottom: none">
        <div style="display: inline-block; width: 300px; background-color: rgb(240, 250, 255); text-align: center"> 项目名称: </div>
        <div style="display: inline-block; width: 300px; text-align: center">
          {{ form.name }}
        </div>
      </div>

      <div style="border: 1px solid black; border-bottom: none">
        <div style="display: inline-block; width: 300px; background-color: rgb(240, 250, 255); text-align: center"> 分类: </div>
        <div style="display: inline-block; width: 300px; text-align: center">
          {{ form.level == 1 ? '大区' : form.level == 2 ? '片区' : form.level == 3 ? '项目' : '' }}
        </div>
      </div>

      <div style="border: 1px solid black; border-bottom: none">
        <div style="display: inline-block; width: 300px; background-color: rgb(240, 250, 255); text-align: center"> 项目代码编码: </div>
        <div style="display: inline-block; width: 300px; text-align: center">
          {{ form.code }}
        </div>
      </div>

      <div style="border: 1px solid black; border-bottom: none">
        <div style="display: inline-block; width: 300px; background-color: rgb(240, 250, 255); text-align: center"> 所属大区: </div>
        <div style="display: inline-block; width: 300px; text-align: center">
          {{ form.parentArea.name }}
        </div>
      </div>

      <div style="border: 1px solid black; border-bottom: none">
        <div style="display: inline-block; width: 300px; background-color: rgb(240, 250, 255); text-align: center"> 客服电话: </div>
        <div style="display: inline-block; width: 300px; text-align: center">{{}}</div>
      </div>

      <div style="border: 1px solid black; border-bottom: none">
        <div style="display: inline-block; width: 300px; background-color: rgb(240, 250, 255); text-align: center"> 所属区域: </div>
        <div style="display: inline-block; width: 300px; text-align: center">
          {{ form.regionName }}
        </div>
      </div>

      <div style="border: 1px solid black; border-bottom: none">
        <div style="display: inline-block; width: 300px; background-color: rgb(240, 250, 255); text-align: center"> 服务地区: </div>
        <div style="display: inline-block; width: 300px; text-align: center">{{}}</div>
      </div>

      <div style="border: 1px solid black; border-bottom: none">
        <div style="display: inline-block; width: 300px; background-color: rgb(240, 250, 255); text-align: center"> 创建者: </div>
        <div style="display: inline-block; width: 300px; text-align: center">
          {{ form.creatorName }}
        </div>
      </div>

      <div style="border: 1px solid black; border-bottom: none">
        <div style="display: inline-block; width: 300px; background-color: rgb(240, 250, 255); text-align: center"> 创建时间: </div>
        <div style="display: inline-block; width: 300px; text-align: center">
          {{ form.createTime }}
        </div>
      </div>

      <div style="border: 1px solid black; border-bottom: none">
        <div style="display: inline-block; width: 300px; background-color: rgb(240, 250, 255); text-align: center"> 修改者: </div>
        <div style="display: inline-block; width: 300px; text-align: center">
          {{ form.updaterName }}
        </div>
      </div>

      <div style="border: 1px solid black; border-bottom: none">
        <div style="display: inline-block; width: 300px; background-color: rgb(240, 250, 255); text-align: center"> 上次修改时间: </div>
        <div style="display: inline-block; width: 300px; text-align: center">
          {{ form.updateTime }}
        </div>
      </div>

      <div style="border: 1px solid black">
        <div style="display: inline-block; width: 300px; background-color: rgb(240, 250, 255); text-align: center"> 排序码: </div>
        <div style="display: inline-block; width: 300px; text-align: center">
          {{ form.sort }}
        </div>
      </div>
    </div>
    <el-button type="primary" @click="close" style="margin-left: 50%">关闭</el-button>
  </el-dialog>
</template>

<script setup lang="ts" name="Menu">
import { reactive, ref, onMounted, toRefs, nextTick, getCurrentInstance } from 'vue'
import { areaList, treeListForEdit, addArea, updateArea, areaDelete, areaEdi, sleProvinces, sleCitys, sleCountys, areaDeleteut, onOff } from '@/api/sys/Project' //引入数据
import { ElMessage, ElMessageBox } from 'element-plus'
import { Refresh, Plus, Sort } from '@element-plus/icons-vue'
import { getAuth } from '@/utils/export'
import { getInfo } from '@/api/login'
import { useCache } from '@/hooks/web/useCache'
import { useAppStore } from '@/store/modules/app'
const appStore = useAppStore()
const { wsCache } = useCache()
const { proxy } = getCurrentInstance() as any
const areaMassges = ref('')
let citys = ref([
  {
    code: '',
    name: ''
  }
])
let sanCitys = ref([
  {
    code: '',
    name: ''
  }
])
const deptList: any = ref([]) //存放表格数据
const menuRef = ref(null)
const menuRef1 = ref(null)
const provinceRef = ref(null)
const cityRef = ref(null)
const countysRef = ref(null)
const open = ref(false)
const title = ref('')
const menuOptions: any = ref([]) //新增的树状型
// const deptOptions: any = ref([]);
const refreshTable = ref(true) //表格展开
const isExpandAll = ref(true)
const openProject = ref(false)
const proveName = ref()
const cityName = ref()
const countyName = ref()
let province = ref([
  {
    code: '',
    name: ''
  }
])

// const enabled=ref(false)
// const enabled = ref(true)
const data: any = reactive({
  form: {
    name: undefined,
    parentId: undefined,
    code: undefined,
    sort: undefined,
    enabled: undefined,
    regionCode: undefined,
    id: undefined,
    county: undefined,
    city: undefined,
    serviceAreaCode: undefined,
    serviceArea: undefined
  },
  queryParams: {
    name: undefined
  }
})
const rules = ref({
  name: [{ required: true, message: '项目名称不能为空', trigger: 'blur' }],
  parentId: [{ required: true, message: '上级片区不能为空', trigger: 'blur' }],
  code: [{ required: true, message: '项目代码不能为空', trigger: 'blur' }],
  sort: [{ required: true, message: '排序码不能为空', trigger: 'blur' }],
  enabled: [{ required: true, message: '是否启用不能为空', trigger: 'change' }],
  province: [{ required: true, message: '所属区域不能为空', trigger: 'change' }]
})
const { queryParams, form } = toRefs(data)

/** 表单重置 */
function reset() {
  form.value = {
    name: undefined,
    parentId: undefined,
    code: undefined,
    sort: undefined,
    enabled: undefined,
    regionCode: undefined,
    id: undefined,
    regionName: undefined,
    county: undefined,
    city: undefined,
    serviceAreaCode: undefined,
    serviceArea: undefined,
    province: undefined
  }
  // proxy.resetForm("menuRef");
}
// 树状图
function listToTree(data: any, parentId: any = null) {
  const result: any[] = []
  for (const node of data) {
    if (node.parentId === parentId) {
      const treeNode = { ...node, children: listToTree(data, node.id) }
      result.push(treeNode)
    }
  }
  return result
}

// 菜单数据
const getareaList = async () => {
  const result: any = await areaList({ name: data.queryParams.name })
  if (result.code == 200) {
    deptList.value = listToTree(result.data, 1)
  }
}

const refreshUserInfo = async () => {
  const getInfos = await getInfo()
  wsCache.set(appStore.getUserInfo, getInfos)
  location.reload()
}

// 新增的树状型
async function gettreeList() {
  menuOptions.value = []
  treeListForEdit({}).then((res) => {
    menuOptions.value = res.data
  })
}

// 重置
function resetQuery() {
  data.queryParams.name = undefined
  getareaList() //清空在请求列表
}
const areas = ref('')
function parentArea(v) {
  areas.value = v.level
  if (!data.form.city) {
    if (areas.value == '2') {
      areaMassges.value = '上级非大区,省份城市必填'
    } else if (areas.value == '3') {
      areaMassges.value = '上级非大区,省份城市必填'
    }
  }
}
// 搜索
function onSubmit() {
  getareaList()
  // location.reload();
}

/** 展开*/
function toggleExpandAll() {
  refreshTable.value = false
  isExpandAll.value = !isExpandAll.value
  nextTick(() => {
    refreshTable.value = true
  })
}

//组件挂载完毕钩子
onMounted(() => {
  getareaList()
})

// 添加
function handleAdd() {
  reset()
  gettreeList()
  searchProve()
  open.value = true
  title.value = '添加项目'
}

// 修改
async function handleUpdate(row) {
  reset()
  gettreeList()
  await areaEdi(row.id).then((response) => {
    // form.value = listToTree(response.data);
    if (response.code == 200) {
      open.value = true
      form.value = response.data
      form.value.county = form.value.county && form.value.county.split(',')
      title.value = '修改项目'
      searchProve()
      searchCity()
      searchCountys()
    }
  })
}

// 提交按钮
const areaMassgesStyle = ref('areaStyleNone')
const submiting = ref(false)
const submitForm = async (menuRef1) => {
  if (!menuRef1) return
  const areaCheck = ref(true)
  await menuRef1.validate(async (valid, fields) => {
    if (!data.form.city && (areas.value == '2' || areas.value == '3')) {
      areaCheck.value = false
      areaMassgesStyle.value = 'areaStyleBlock'
    } else {
      areaCheck.value = true
      areaMassgesStyle.value = 'areaStyleNone'
    }
    if (valid && areaCheck.value) {
      const countysRefs = proxy.$refs.countysRef.states.selected.map((item) => {
        return item.currentLabel
      })
      const countysValue = proxy.$refs.countysRef.states.selected.map((item) => {
        return item.value
      })
      form.value.serviceAreaCode = form.value.county && form.value.county.join(',')
      form.value.serviceArea = countysRefs && countysRefs.join(',')
      if (proxy.$refs.countysRef.states.selected.length > 1) {
        form.value.regionCode = proxy.$refs.cityRef.states.selected && proxy.$refs.cityRef.states.selected.value
      } else if (proxy.$refs.countysRef.states.selected.length == 0 || !proxy.$refs.countysRef.states.selected.value) {
        form.value.regionCode = proxy.$refs.provinceRef.states.selected.value
      } else {
        form.value.regionCode = countysValue.join(',')
      }
      submiting.value = true
      if (form.value.id != undefined) {
        form.value.county = countysRefs.join(',')
        // form.value.city = proxy.$refs.cityRef.states.selected.currentLabel
        // form.value.province = proxy.$refs.provinceRef.states.selected.currentLabel
        try {
          let result: any = await updateArea(form.value)
          form.value.county = form.value.county.split(',')
          if (result.code == 200) {
            open.value = false
            //弹出提示信息
            proveName.value = ''
            cityName.value = ''
            countyName.value = ''
            ElMessage.success('修改成功')
            //再次发请求获取
            refreshUserInfo()
          }
        } finally {
          submiting.value = false
        }
      } else {
        form.value.county = countysRefs.join(',')
        form.value.city = proxy.$refs.cityRef.states.selected.currentLabel
        form.value.province = proxy.$refs.provinceRef.states.selected.currentLabel
        try {
          let result: any = await addArea(form.value)
          form.value.county = form.value.county.split(',')
          if (result.code == 200) {
            //关闭对话框
            open.value = false
            //弹出提示信息
            ElMessage({
              type: 'success',
              message: '添加成功'
            })
            proveName.value = ''
            cityName.value = ''
            countyName.value = ''
            //再次发请求获取
            // getareaList()
            refreshUserInfo()
          }
        } finally {
          submiting.value = false
        }
      }
    }
  })
}
// 取消按钮
const cancel = (formEl: any) => {
  if (!formEl) return
  formEl.resetFields()
  reset()
  getareaList()
  open.value = false
  proveName.value = ''
  cityName.value = ''
  countyName.value = ''
}

// 删除
async function handleDelete(row) {
  const tipText = ref('')
  const deleteCheck: any = await areaDeleteut(row.id)
  if (deleteCheck.code == 200) {
    tipText.value = '是否确认删除名称为"' + row.name + '"的数据项?'
    ElMessageBox.confirm(tipText.value, '系统提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    }).then(() => {
      areaDelete(row.id)
        .then((res) => {
          ElMessage({
            type: 'success',
            message: '删除成功'
          })
          // getareaList()
          // gettreeList()
          refreshUserInfo()
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '已取消'
          })
          getareaList()
        })
    })
  } else {
    ElMessage({
      type: 'error',
      message: deleteCheck.msg
    })
  }
}

// 点击开启按钮改变状态
function getenabled(val) {
  let data = { id: val.id, enabled: val.enabled }
  if (val.enabled == 1) {
    ElMessageBox.confirm('是否开启状态?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
      .then(() => {
        onOff(data).then((response) => {
          ElMessage({
            type: 'success',
            message: '修改成功'
          })
          getareaList()
        })
      })
      .catch(() => {
        getareaList()
      })
  } else {
    ElMessageBox.confirm('是否关闭状态?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
      .then(() => {
        onOff(data).then((response) => {
          ElMessage({
            type: 'success',
            message: '修改成功'
          })
          getareaList()
        })
      })
      .catch(() => {
        getareaList()
      })
  }
}

// 查看
async function handleview(row) {
  await areaEdi(row.id).then((response) => {
    if (response.code != '403') {
      openProject.value = true
      form.value = response.data
    }
  })
}
function close() {
  openProject.value = false
}

function clear() {
  form.value.city = undefined
  form.value.county = undefined
}

//搜索省份
const searchProve = () => {
  sleProvinces({ name: proveName.value }).then((res) => {
    province.value = res.list
  })
}
//搜索成功
function searchCity() {
  // form.value.city = undefined
  // form.value.county = undefined
  const reg = /^[^\u4e00-\u9fa5]{1,20}$/
  if (!reg.test(form.value.province)) {
    sleCitys({ name: cityName.value, provinceName: form.value.province }).then((res) => {
      citys.value = res.list
    })
  } else {
    sleCitys({ name: cityName.value, parentCode: form.value.province }).then((res) => {
      citys.value = res.list
    })
  }
}

function searchCountys() {
  const reg = /^[^\u4e00-\u9fa5]{1,20}$/
  if (!reg.test(form.value.city)) {
    sleCountys({ name: countyName.value, cityName: form.value.city }).then((res) => {
      sanCitys.value = res.list
    })
  } else {
    sleCountys({ name: countyName.value, parentCode: form.value.city }).then((res) => {
      sanCitys.value = res.list
    })
  }
}
function selectCountys(e) {}

getareaList()
gettreeList()
</script>

<style lang="less" scoped>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.box-card {
  width: 100%;
}

.tree-select {
  width: 50%;
}

.input {
  width: 50%;
}

::deep(.el-select .el-input__inner) {
  cursor: pointer;
  width: 118px;
}

.search_input_box {
  position: absolute;
  top: 0px;
  left: 0;
  z-index: 3000;
}

.but {
  background-color: transparent;
  border: none;
  border-radius: 0;
  border-bottom: 1px solid rgb(255, 152, 0);
  color: rgb(255, 152, 0);
  cursor: pointer;
}

.areaStyleBlock {
  display: block;
  font-size: 12px;
  color: red;
}

.areaStyleNone {
  display: none;
  font-size: 12px;
  color: red;
}

.el-link.el-link--primary {
  --el-link-disabled-text-color: #cccccc;
}

.el-link:hover {
  color: #ffbf66;
}

.links {
  margin-right: 15px;
  text-decoration: underline;
}

.el-link.is-disabled:hover {
  color: #ccc;
}
:deep(.el-input__wrapper) {
  min-width: 130px !important;
}
:deep(.el-select__wrapper) {
  min-width: 130px !important;
}
</style>
