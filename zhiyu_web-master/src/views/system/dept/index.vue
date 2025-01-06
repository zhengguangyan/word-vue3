<template>
  <el-card shadow="never" class="card">
    <template #header>
      <div class="card-header">
        <span class="title">部门管理</span>
      </div>
    </template>
    <div class="r-m-t-20 r-m-b-12">
      <el-space :size="12">
        <el-button type="primary" @click="handleAdd" :disabled="getAuth('system:dept:add')">添加</el-button>
        <el-button @click="toggleExpandAll" plain>展开/折叠</el-button>
        <div class="flex">
          <!-- <span class="date-label">部门名称:</span> -->
          <el-input v-model="queryParams.name" @keyup.enter="onSubmit" clearable placeholder="请输入部门名称" />
        </div>
        <div class="flex">
          <!-- <span class="date-label">状态:</span> -->
          <el-select v-model="queryParams.status" clearable placeholder="部门状态">
            <el-option label="正常" value="0" />
            <el-option label="停用" value="1" />
          </el-select>
        </div>
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button @click="resetQuery" plain>重置</el-button>
      </el-space>
    </div>
    <!-- 表格 -->
    <el-table
      v-if="refreshTable"
      :data="deptList"
      row-key="id"
      :default-expand-all="isExpandAll"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      height="calc(100vh - 260px)"
      header-row-class-name="table-header"
      class-name="table-without-border"
    >
      <el-table-column show-overflow-tooltip prop="name" label="部门名称" min-width="300" />
      <el-table-column show-overflow-tooltip prop="sort" label="排序" width="60" />
      <el-table-column show-overflow-tooltip prop="code" label="部门编码" width="100" />
      <!-- <el-table-column show-overflow-tooltip prop="regionCode" label="区域代码" /> -->
      <el-table-column show-overflow-tooltip prop="regionName" label="部门区域" min-width="240" />
      <el-table-column show-overflow-tooltip prop="status" label="状态" width="80">
        <template #default="scope">
          <el-switch v-model="scope.row.status" class="ml-2" active-value="0" inactive-value="1" @change="getStatus(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column label="部门分类" width="120">
        <template #default="scope">
          <span>{{ scope.row.type ? (scope.row.type == 0 ? '社区服务站' : '服务部门') : '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="attribute" label="部门属性" width="100">
        <template #default="scope">
          <span>{{ scope.row.attribute == 0 ? '内部' : '外部' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="200">
        <template #default="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="remark" label="备注" width="150" />
      <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width" fixed="left" type="">
        <template #default="scope">
          <el-button link type="primary" :disabled="getAuth('system:dept:edit')" @click="handleUpdate(scope.row, '编辑')">修改</el-button>
          <el-button type="primary" link :disabled="getAuth('system:dept:query')" @click="handleUpdate(scope.row, '详情')">详情</el-button>
          <el-button v-if="scope.row.parentId != 0" link type="primary" @click="handleDelete(scope.row)" :disabled="getAuth('system:dept:remove')">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>

  <!--新增 弹框 -->
  <el-dialog :title="dialogTitle" v-model="open" width="1000px" append-to-body :close-on-click-modal="false" @close="cancel">
    <el-form v-if="dialogTitle !== '详情'" ref="deptRef" :model="form" :rules="rules" label-width="100px">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="上级部门：" prop="parentId">
            <el-tree-select
              clearable
              v-model="form.parentId"
              :data="menuOptions"
              @node-click="select"
              @focus="select1"
              :props="{ value: 'id', label: 'name', children: 'children' }"
              value-key="id"
              placeholder="选择上级部门"
              check-strictly
              class="tree-select"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="部门名称：" prop="name">
            <el-input v-model="form.name" clearable placeholder="请输入部门名称" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="部门阶层：" prop="deptRank">
            <!-- <el-select ref="provinceRef" v-model="form.deptRank" placeholder="请选择部门阶层" clearable filterable>
              <el-option v-for="item in deptRankDic" :key="item.code" :label="item.name" :value="item.code" />
            </el-select> -->
            <DictSelect width="100%" v-model="form.deptRank" :distList="filterDict('org_level_name')" placeholder="请选择部门阶层" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="部门编码：" prop="code">
            <el-input v-model="form.code" clearable placeholder="请输入部门编码" />
          </el-form-item>
        </el-col>
        <!-- <el-col :span="12">
            <el-form-item label="区域代码">
              <el-input  v-model="form.regionCode" clearable placeholder="请输入区域代码" />
              <span v-else>{{ form.regionCode }}</span>
            </el-form-item>
          </el-col> -->

        <el-col :span="12">
          <el-form-item label="显示排序：">
            <el-input-number v-model="form.sort" controls-position="right" placeholder="请选择显示排序" :min="0" :precision="0" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="部门状态：">
            <el-radio-group v-model="form.status" clearable>
              <el-radio value="0">正常</el-radio>
              <el-radio value="1">停用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="部门分类：">
            <el-radio-group @change="changeType" v-model="form.type" clearable>
              <el-radio value="0">社区服务站</el-radio>
              <el-radio value="1">服务部门</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="部门属性：" prop="attribute" required>
            <el-radio-group v-model="form.attribute" clearable @change="radioid">
              <el-radio value="0">内部</el-radio>
              <el-radio value="1">外部</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="12" v-if="areaDisplay == false">
          <el-form-item label="所属项目：" required prop="areaCode"> -->
        <!-- <el-checkbox v-model="deptExpand" @change="handleCheckedTreeExpand($event)">展开/折叠</el-checkbox>
            <el-checkbox v-model="deptNodeAll" @change="handleCheckedTreeNodeAll($event)">全选/全不选</el-checkbox> -->
        <!-- <el-checkbox v-model="form.deptCheckStrictly"
              @change="handleCheckedTreeConnect($event, 'dept')">父子联动</el-checkbox> -->
        <!-- <span>{{ form.areaCode }}</span> -->
        <!-- <el-tree-select :disabled="dialogTitle == '详情'" check-strictly v-model="form.areaCode" class="tree-border" :data="areaList" ref="areaRef" node-key="code" empty-text="加载中，请稍候" :props="{ label: 'name', children: 'children' }" @node-click="handleNodeAreaClick" />
          </el-form-item>
        </el-col> -->

        <el-col :span="12" v-if="form.type === '0'">
          <el-form-item label="所属项目：" prop="addAreaCode" :rules="[{ required: form.type === '0', message: '请选择所属项目', trigger: 'change' }]">
            <el-tree-select
              :disabled="dialogTitle == '详情'"
              v-model="form.addAreaCode"
              class="tree-border"
              :data="areaData"
              ref="areaRef"
              node-key="code"
              empty-text="加载中，请稍候"
              :props="{ label: 'name', children: 'children' }"
              @node-click="handleNodeAreaClick"
            />
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="部门区域：" prop="province" required>
                <!-- 省 -->
                <el-select ref="provinceRef" v-model="form.province" placeholder="省份" @change="provinceChange" :disabled="form.type === '0'" clearable @clear="clear">
                  <el-input class="r-m-lr-10" style="width: calc(100% - 20px)" v-model="proveName" @input="searchProvince" placeholder="请输入省份名称" clearable />
                  <el-option label="暂无数据" v-if="province.length == 0" value="暂无数据" :disabled="true" />
                  <el-option v-for="item in province" :key="item.code" :label="item.name" :value="item.code" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="">
                <!-- 市  -->
                <span :class="areaMassgesStyle">{{ areaMassges }}</span>
                <el-select
                  ref="cityRef"
                  :disabled="(form.type === '0' && areaListByProject.length && areaListByProject[0].cityCode) || (form.province ? false : true)"
                  v-model="form.city"
                  placeholder="城市"
                  @change="cityChange"
                  clearable
                >
                  <el-input class="r-m-lr-10" style="width: calc(100% - 20px)" v-model="cityName" @input="searchCity" placeholder="请输入城市名称" clearable />
                  <el-option label="暂无数据" v-if="citys.length == 0" value="暂无数据" :disabled="true" />
                  <el-option v-for="item in citys" :key="item.code" :label="item.name" :value="item.code" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="">
                <!-- 区县  -->
                <el-select
                  ref="countysRef"
                  :disabled="(form.type === '0' && sanCitys.length === 1) || (form.province && form.city ? false : true)"
                  v-model="form.county"
                  placeholder="区县"
                  @change="countyChange"
                  clearable
                >
                  <el-input class="r-m-lr-10" style="width: calc(100% - 20px)" v-model="countyName" @input="searchCountys" placeholder="请输入区名称" clearable />
                  <el-option label="暂无数据" v-if="sanCitys.length == 0" value="暂无数据" :disabled="true" />
                  <el-option v-for="item in sanCitys" :key="item.code" :label="item.name" :value="item.code" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="">
                <!-- 街道  -->
                <el-select ref="countysRef" :disabled="form.county ? false : true" v-model="form.street" placeholder="街道" @change="streetChange" clearable>
                  <el-input class="r-m-lr-10" style="width: calc(100% - 20px)" v-model="streetName" @input="searchStreets" placeholder="请输入街道名称" clearable />
                  <el-option label="暂无数据" v-if="sanStreet.length == 0" value="暂无数据" :disabled="true" />
                  <el-option v-for="item in sanStreet" :key="item.code" :label="item.name" :value="item.code" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="">
                <!-- 社区  -->
                <el-select ref="countysRef" :disabled="form.street ? false : true" v-model="form.community" placeholder="社区" @change="selectCommunitys" clearable>
                  <el-input class="r-m-lr-10" style="width: calc(100% - 20px)" v-model="communityName" @input="selectCommunitys" placeholder="请输入社区名称" clearable />
                  <el-option label="暂无数据" v-if="sanCommunity.length == 0" value="暂无数据" :disabled="true" />
                  <el-option v-for="item in sanCommunity" :key="item.code" :label="item.name" :value="item.code" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注">
            <el-input span="20" size="large" type="textarea" clearable v-model="form.remark" :rows="3" placeholder="请输入备注" maxlength="300" show-word-limit />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!-- 查看 -->
    <div class="flex flex-wrap" v-else>
      <div class="item-box item-100">
        <div class="item-title">上级部门</div>
        <div class="item-content"> {{ getParent(form.parentId) }}</div>
      </div>
      <div class="item-box">
        <div class="item-title">部门名称</div>
        <div class="item-content">{{ form.name }}</div>
      </div>
      <div class="item-box">
        <div class="item-title">部门阶层</div>
        <div class="item-content">{{ renderDict(form.deptRank, 'org_level_name') }}</div>
      </div>
      <div class="item-box">
        <div class="item-title">部门编码</div>
        <div class="item-content">{{ form.code }}</div>
      </div>
      <div class="item-box">
        <div class="item-title">显示排序</div>
        <div class="item-content">{{ form.sort }}</div>
      </div>
      <div class="item-box">
        <div class="item-title">部门状态</div>
        <div class="item-content">{{ form.status == '0' ? '正常' : '停用' }}</div>
      </div>
      <div class="item-box">
        <div class="item-title">部门分类</div>
        <div class="item-content">{{ form.type == 0 ? '社区服务站' : form.type == 1 ? '服务部门' : '' }}</div>
      </div>
      <div class="item-box">
        <div class="item-title">部门属性</div>
        <div class="item-content">{{ form.attribute == '0' ? '内部' : '外部' }}</div>
      </div>
      <div class="item-box">
        <div class="item-title">创建人</div>
        <div class="item-content">{{ form.creatorName }}</div>
      </div>
      <div class="item-box">
        <div class="item-title">创建时间</div>
        <div class="item-content">{{ form.createTime }}</div>
      </div>
      <div class="item-box">
        <div class="item-title">更新人</div>
        <div class="item-content">{{ form.updaterName }}</div>
      </div>
      <div class="item-box">
        <div class="item-title">更新时间</div>
        <div class="item-content">{{ form.updateTime }}</div>
      </div>

      <div class="item-box">
        <div class="item-title">部门区域</div>
        <div class="item-content">{{ form.regionName }}</div>
      </div>
      <div class="item-box">
        <div class="item-title">备注</div>
        <div class="item-content">{{ form.remark }}</div>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" :loading="loading" v-if="dialogTitle !== '详情'" @click="submitForm(deptRef)">确 定</el-button>
        <el-button @click="cancel">{{ dialogTitle !== '详情' ? '取 消' : '关闭' }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import DictSelect from '@/components/DictSelect/index.vue'
import { reactive, ref, toRefs, nextTick } from 'vue'
import { listDept, listDeptExcludeChild, getDept, addDept, updateDept, onOff, delDept, checkDeptExistUser } from '@/api/sys/Department' //引入数据
import { sleProvinces, sleCitys, sleCountys, sleSearch, getAreaByProjectCode } from '@/api/sys/Project' //引入数据
import { ElMessage, ElMessageBox } from 'element-plus'
import { treeList } from '@/api/sys/Project'
import { getAuth } from '@/utils/export'
import { filterDict } from '@/hooks/web/useDict'
import { renderDict } from '@/hooks/web/useDict'
const dialogTitle = ref('编辑')
const open = ref(false)
const title = ref('')
const parentList: any = ref([])
const deptList: any = ref([])
const isExpandAll = ref(true)
const refreshTable = ref(true) //表格展开
const deptOptions: any = ref([])
const menuOptions: any = ref([]) //新增的树状型
const deptRef = ref()
const parent = ref()
// const areaDisplay = ref(true)
const loading = ref(false)

const data: any = reactive({
  form: {
    id: undefined,
    parentId: undefined,
    name: undefined,
    sort: undefined,
    leader: undefined,
    phone: undefined,
    email: undefined,
    status: undefined,
    type: undefined,
    code: undefined,
    attribute: undefined,
    regionCode: undefined,
    regionName: undefined,
    county: undefined,
    city: undefined,
    province: undefined,
    addAreaCode: undefined,
    // areaCode: undefined,
    areaName: undefined,
    street: undefined,
    community: undefined
  },

  queryParams: {
    name: undefined,
    status: undefined
  },

  rules: {
    parentId: [{ required: true, message: '上级部门不能为空', trigger: 'blur' }],
    name: [{ required: true, message: '部门名称不能为空', trigger: 'blur' }],
    deptRank: [{ required: true, message: '请选择部门阶层', trigger: 'change' }],
    code: [{ required: true, message: '部门编码不能为空', trigger: 'blur' }],
    sort: [{ required: true, message: '显示排序不能为空', trigger: 'blur' }],
    email: [{ type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }],
    attribute: [{ required: true, message: '部门属性不能为空', trigger: 'blur' }],
    // areaCode: [{ required: true, message: '所属项目不能为空', trigger: 'blur' }],
    province: [{ required: true, message: '部门区域不能为空', trigger: 'blur' }],
    phone: [
      {
        pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
        message: '请输入正确的手机号码',
        trigger: 'blur'
      }
    ]
  }
})
const { queryParams, form, rules } = toRefs(data)
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

let sanStreet = ref([
  {
    code: '',
    name: ''
  }
])
let sanCommunity = ref([
  {
    code: '',
    name: ''
  }
])
let province = ref([
  {
    code: '',
    name: ''
  }
])
const proveName = ref()
const cityName = ref()
const countyName = ref()
/** 表单重置 */
function reset() {
  form.value = {
    id: undefined,
    parentId: undefined,
    name: undefined,
    icon: undefined,
    menuType: 2,
    orderNum: undefined,
    isFrame: '1',
    isCache: '0',
    visible: '0',
    status: '0',
    type: undefined,
    code: undefined,
    attribute: undefined,
    regionCode: undefined,
    regionName: undefined,
    county: undefined,
    city: undefined,
    province: undefined,
    addAreaCode: undefined,
    // areaCode: undefined,
    areaName: undefined,
    street: undefined,
    community: undefined
  }
  // proxy.resetForm("menuRef");
}
// 部门分类的回调
function changeType() {
  if (form.value.type == '1' || !form.value.type) {
    form.value.addAreaCode = undefined
  } else if (form.value.type == '0') {
    // 社区服务站
    getAreaList()
  }
}
// 区域选择
const areaData: any = ref([])
const getAreaList = async () => {
  const result: any = await treeList({
    enabled: '1',
    level: 3
  })
  if (result.code == 200) {
    areaData.value = result.data
    // listToTree(result.data, result.data[0].parentId)
  }
}
const areaListByProject = ref<any>([])
async function handleNodeAreaClick(node, prop, object) {
  form.value.street = undefined
  form.value.community = undefined
  const {
    data: { code }
  } = prop
  const list = await getAreaByProject(code)
  areaListByProject.value = list

  if (list.length) {
    form.value.province = list[0].provinceCode
    form.value.city = list[0].cityCode
  }
  if (list.length === 1) {
    form.value.county = list[0].countyCode
    list[0].countyCode && searchStreets(1)
  }
  searchCity()
  if (list.length === 1 && !list[0].countyCode) {
    searchCountys(1)
    return
  }
  sanCitys.value = list.map((item) => {
    return {
      name: item.countyName,
      code: item.countyCode
    }
  })
}
// 通过项目获取项目下区域
const getAreaByProject = async (areaCode) => {
  const { list } = await getAreaByProjectCode({ areaCode })
  return list
}

//搜索省份
const searchProvince = () => {
  sleProvinces({ name: proveName.value }).then((res) => {
    province.value = res.list
  })
}
// 省的变化回调
function provinceChange() {
  form.value.city = undefined
  form.value.county = undefined
  form.value.street = undefined
  form.value.community = undefined
  searchCity()
}
//获取城市下拉数据
function searchCity() {
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
//市的变化回调
function cityChange() {
  form.value.county = undefined
  form.value.street = undefined
  form.value.community = undefined
  searchCountys(1)
}
//获取区县下拉数据
function searchCountys(code) {
  if (code == 1) {
    !form.value.city ? (form.value.county = undefined) : (form.value.county = form.value.county)
  } else {
    form.value.county = undefined
  }
  const reg = /^[^\u4e00-\u9fa5]{1,20}$/
  if (!reg.test(form.value.city)) {
    sleCountys({ name: countyName.value, parentName: form.value.city }).then((res) => {
      sanCitys.value = res.list
    })
  } else {
    sleCountys({ name: countyName.value, parentCode: form.value.city }).then((res) => {
      sanCitys.value = res.list
    })
  }
}
//区县的变化回调
function countyChange() {
  form.value.street = undefined
  form.value.community = undefined
  searchStreets(1)
}
//获取街道下拉数据
function searchStreets(code) {
  if (code == 1) {
    form.value.county ? (form.value.county = form.value.county) : (form.value.county = undefined)
  } else {
    form.value.street = undefined
  }
  sleSearch({ parentCode: form.value.county }).then((res) => {
    sanStreet.value = res.list
  })
}

//街道的变化回调
function streetChange() {
  form.value.community = undefined
  selectCommunitys(1)
}
//获取社区下拉数据
function selectCommunitys(code) {
  if (code == 1) {
    form.value.communitys = undefined
  } else {
    form.value.street ? (form.value.communitys = form.value.communitys) : (form.value.communitys = undefined)
  }
  sleSearch({ parentCode: form.value.street }).then((res) => {
    sanCommunity.value = res.list
  })
}

// 树状图
function listToTree(data: any[], parentId: number | null = null): any[] {
  const result: any[] = []
  for (const node of data) {
    if (node.parentId === parentId) {
      const treeNode = { ...node, children: listToTree(data, node.id) }
      result.push(treeNode)
    }
  }
  return result
}
// 请求数据
const getlistDept = async () => {
  const result: any = await listDept({
    name: data.queryParams.name,
    status: data.queryParams.status
  })
  if (result.code == 200) {
    if (result.data.length != 0) {
      deptList.value = listToTree(result.data, result.data[0].parentId)
      parentList.value = result.data
    } else {
      deptList.value = []
    }
  }
}

function getParent(id) {
  if (id === 0) {
    id = 100
  }

  parent.value = parentList.value.find((item) => item.id === id)
  const parentName = parent.value.name
  return parentName
}

// 新增的树状型
async function getTreeselect() {
  menuOptions.value = []
  listDept().then((res) => {
    menuOptions.value = [...listToTree(res.data, 0)]
  })
}

/** 展开*/
function toggleExpandAll() {
  refreshTable.value = false
  isExpandAll.value = !isExpandAll.value
  nextTick(() => {
    refreshTable.value = true
  })
}

// 搜索
function onSubmit() {
  getlistDept()
}

// 重置
function resetQuery() {
  data.queryParams.name = undefined
  data.queryParams.status = undefined
  getlistDept() //清空在请求列表
}

// 添加
function handleAdd() {
  reset()
  getTreeselect()
  searchProvince()
  dialogTitle.value = '添加'
  open.value = true
  title.value = '添加部门'
}
// 清除校验
const select = () => {
  setTimeout(() => {
    deptRef.value.validateField('parentId')
  }, 100)
}
const select1 = () => {
  setTimeout(() => {
    deptRef.value.validateField('parentId')
  }, 100)
}

const radioid = () => {
  deptRef.value.validateField('attribute')
}
// 修改
function handleUpdate(row, type) {
  dialogTitle.value = type
  reset()
  getTreeselect()

  listDeptExcludeChild(row.id).then((response) => {
    deptOptions.value = listToTree(response.data, 0)
  })
  getDept(row.id).then(async (response) => {
    form.value = response.data
    changeType()
    searchProvince()
    searchCity()
    // 当前编辑的是 社区服务站数据
    if (form.value.type === '0') {
      const list = await getAreaByProject(form.value.addAreaCode)
      areaListByProject.value = list
      if (list.length === 1 && !list[0].countyCode) {
        searchCountys(1)
      } else {
        sanCitys.value = list.map((item) => {
          return {
            name: item.countyName,
            code: item.countyCode
          }
        })
      }
    } else {
      searchCountys(1)
    }
    searchStreets(1)
    selectCommunitys(1)
    open.value = true
    title.value = '修改部门'
  })
}

// 确定/提交按钮
const submitForm = async (deptRef) => {
  if (!deptRef) return

  await deptRef.validate(async (valid) => {
    if (valid) {
      if (form.value.id != undefined) {
        loading.value = true
        try {
          let result: any = await updateDept(form.value)
          if (result.code == 200) {
            //关闭对话框
            open.value = false
            //弹出提示信息
            ElMessage({
              type: 'success',
              message: '修改成功'
            })
            //再次发请求获取
            getlistDept()
          }
          loading.value = false
        } catch (e) {
          loading.value = false
        }
      } else {
        loading.value = true
        try {
          let result: any = await addDept(form.value)
          if (result.code == 200) {
            //关闭对话框
            open.value = false
            //弹出提示信息
            ElMessage({
              type: 'success',
              message: '添加成功'
            })
            //再次发请求获取
            getlistDept()
          }
          loading.value = false
        } catch (e) {
          loading.value = false
        }
      }
    }
  })
}

// 点击开启按钮改变状态
function getStatus(val) {
  let data = { deptId: val.id, status: val.status }
  if (val.status == 0) {
    ElMessageBox.confirm('是否开启状态?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
      .then(() => {
        onOff(data).then(() => {
          ElMessage({
            type: 'success',
            message: '修改成功'
          })
          getlistDept()
        })
      })
      .catch(() => {
        getlistDept()
      })
  } else {
    ElMessageBox.confirm('是否关闭状态?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
      .then(() => {
        onOff(data).then(() => {
          ElMessage({
            type: 'success',
            message: '修改成功'
          })
          getlistDept()
        })
      })
      .catch(() => {
        getlistDept()
      })
  }
}

function cancel() {
  //详情
  if (dialogTitle.value === '详情') {
    return (open.value = false)
  }
  // 新增编辑
  open.value = false
  deptRef.value.resetFields()
  // window.location.reload();//刷新
  reset()
}

// 删除
async function handleDelete(row) {
  const deleteCheck: any = await checkDeptExistUser(row.id)
  const tipText = ref('')
  if (deleteCheck.code == 200) {
    tipText.value = '是否确认删除名称为"' + row.name + '"的数据项?'
    ElMessageBox.confirm(tipText.value, '系统提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    }).then(() => {
      delDept(row.id)
        .then(() => {
          ElMessage({
            type: 'success',
            message: '删除成功'
          })
          getlistDept()
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '已取消'
          })
        })
      getlistDept()
    })
  } else {
    ElMessage({
      type: 'error',
      message: deleteCheck.msg
    })
  }
}

getlistDept()
getTreeselect()
</script>

<style lang="less" scoped>
.item-box {
  width: 50%;
  &.item-100 {
    width: 100%;
  }
}
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
  width: 100%;
}

:deep(.el-input__wrapper) {
  min-width: 150px !important;
}
:deep(.el-select__wrapper) {
  min-width: 150px !important;
}
</style>
