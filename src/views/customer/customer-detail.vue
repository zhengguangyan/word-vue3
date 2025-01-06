<template>
  <el-page-header title="" @back="onBack">
    <template #content>
      <span class="font-bold"> 客户详情：{{ baseInfo.name }} </span>
    </template>
    <template #extra>
      <div class="flex items-center">
        <el-button v-if="extendInfo.deathFlag != '0'">查看推荐需求</el-button>
        <el-button class="ml-2" :disabled="!leafAreaFlag">一键拨号</el-button>
        <el-button v-if="extendInfo.deathFlag != '0'" class="ml-2" @click="edit" :disabled="!leafAreaFlag || getAuth('customer:index:edit')">编辑</el-button>
        <el-button v-if="extendInfo.deathFlag != '0'" class="ml-2" :disabled="!leafAreaFlag" @click="push(`/service/add?serviceType=consult&id=${baseInfo.id}&phone=${baseInfo.mobilephone}`)"
          >新增服务</el-button
        >
        <el-button class="ml-2" @click="updateSaturation" :loading="saturationLoading">更新饱和度</el-button>
      </div>
    </template>
    <div class="detail-top-gray-info">
      <span class="mr-5" v-if="baseInfo.customerType">类型：{{ radioDict(baseInfo.customerType, 'customer_type') }}</span>
      <span class="mr-5">ID：{{ baseInfo.id }}</span>
      <span class="mr-5" v-if="baseInfo.sex"> 性别：{{ radioDict(baseInfo.sex, 'vols_sex') }} </span>
      <span class="mr-5" v-if="baseInfo.age"> 年龄：{{ baseInfo.age }} </span>
      <span class="mr-5" v-if="baseInfo.idcard"> 证件号码：{{ baseInfo.idcard }} </span>
      <span class="mr-5" v-if="baseInfo.mobilephone"> 联系号码：{{ baseInfo.mobilephone }} </span>
    </div>
    <div class="mt-4 death-alert" v-if="extendInfo.deathFlag == '0'">
      <el-alert type="warning" :closable="false" @click="changeDeathFlag"> 该老人已去世，个人信息不纳入饱和度统计。若需编辑信息，请点此将“是否健在”改为“是”，并保存。 </el-alert>
    </div>
  </el-page-header>
  <div style="padding-top: 20px; display: flex">
    <el-scrollbar style="width: 200px; height: calc(100vh - 300px)">
      <el-menu default-active="baseInfo" @select="handleMenuSelect">
        <el-sub-menu index="1">
          <template #title>
            <span>客户信息</span>
          </template>
          <el-menu-item index="baseInfo">基础信息</el-menu-item>
          <el-menu-item index="requirementInfo" v-if="visibleRequirementInfo"> 需求信息 </el-menu-item>
          <el-menu-item index="extendInfo">延伸信息</el-menu-item>
          <el-menu-item index="healthInfo" v-if="visibleHealthInfo"> 健康信息 </el-menu-item>
          <el-menu-item index="familyInfo" v-if="visibleFamilyInfo">家庭信息</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="2">
          <template #title>
            <span>健康数据</span>
          </template>
          <el-menu-item index="bpDataInfo">血压数据</el-menu-item>
          <el-menu-item index="bsDataInfo">血糖数据</el-menu-item>
        </el-sub-menu>
        <el-menu-item index="visitingInfo">拜访信息</el-menu-item>
        <el-menu-item index="zhucanInfo">助餐记录</el-menu-item>
        <el-sub-menu index="3">
          <template #title>
            <span>服务</span>
          </template>
          <el-menu-item index="statistics">综合</el-menu-item>
          <el-menu-item index="consult">咨询</el-menu-item>
          <el-menu-item index="complaint">投诉</el-menu-item>
          <el-menu-item index="order">订单</el-menu-item>
          <el-menu-item index="selfBuildOrder">自建订单</el-menu-item>
          <el-menu-item index="careinfo">关怀</el-menu-item>
          <el-menu-item index="servePacket">服务包</el-menu-item>
          <el-menu-item index="subsidy">补贴</el-menu-item>
        </el-sub-menu>
        <el-menu-item index="updateRecord">更新记录</el-menu-item>
      </el-menu>
    </el-scrollbar>
    <div style="width: calc(100% - 200px)">
      <el-scrollbar class="info-container" v-if="currentMenu === 'baseInfo'" ref="scrollbarRef">
        <div ref="innerRef">
          <div ref="baseInfoRef">
            <h2 class="title">基础信息</h2>
            <div class="info-list r-m-b-20">
              <div class="detail-info-item">
                <span class="detail-info-item-label">创建时间</span>
                <span class="detail-info-item-content">{{ baseInfo.creatorName }} {{ formatDateString(baseInfo.createTime, 'YYYY-MM-DD HH:mm') }}</span>
              </div>
              <div class="detail-info-item">
                <span class="detail-info-item-label">更新时间</span>
                <span class="detail-info-item-content">{{ baseInfo.updaterName }} {{ formatDateString(baseInfo.updateTime, 'YYYY-MM-DD HH:mm') }}</span>
              </div>
              <div class="detail-info-item" v-if="baseInfo.appAcount">
                <span class="detail-info-item-label">APP账号</span>
                <span class="detail-info-item-content">{{ baseInfo.appAcount }}</span>
              </div>
              <div class="detail-info-item" v-if="baseInfo.birthday">
                <span class="detail-info-item-label">出生日期</span>
                <span class="detail-info-item-content">{{ baseInfo.birthday }}</span>
              </div>
              <div class="detail-info-item" v-if="baseInfo.domicileAllAddress">
                <span class="detail-info-item-label">户籍地址</span>
                <span class="detail-info-item-content">{{ baseInfo.domicileAllAddress }}</span>
              </div>
              <div class="detail-info-item" v-if="baseInfo.currentAllAddress">
                <span class="detail-info-item-label"> 现居住地址</span>
                <span class="detail-info-item-content">{{ baseInfo.currentAllAddress }}</span>
              </div>
              <div class="detail-info-item" v-if="baseInfo.remark">
                <span class="detail-info-item-label">备注</span>
                <span class="detail-info-item-content">{{ baseInfo.remark }}</span>
              </div>
              <div class="detail-info-item" v-if="baseInfo.serviceLabel?.length">
                <span class="detail-info-item-label">服务标签</span>
                <span class="detail-info-item-content">{{ renderDict(baseInfo.serviceLabel, 'service_label') }}</span>
              </div>
              <div class="detail-info-item" v-if="baseInfo.serviceLabel?.includes('1') && !xiamenFlag && baseInfo.secondServiceLabel?.length">
                <span class="detail-info-item-label">二级服务标签</span>
                <span class="detail-info-item-content">{{ renderDict(baseInfo.secondServiceLabel, 'second_service_label') }}</span>
              </div>
              <div class="detail-info-item" v-if="baseInfo.serviceLabel?.includes('1') && !xiamenFlag && baseInfo.thirdServiceLabel?.length">
                <span class="detail-info-item-label">三级服务标签</span>
                <span class="detail-info-item-content">{{ renderDict(baseInfo.thirdServiceLabel, 'third_service_label') }}</span>
              </div>
              <div class="detail-info-item" v-if="xiamenFlag && baseInfo.serviceClassify">
                <span class="detail-info-item-label">服务分类</span>
                <span class="detail-info-item-content">{{ radioDict(baseInfo.serviceClassify, 'service_classify') }}</span>
              </div>
              <div class="detail-info-item" :class="{ 'item-100': baseInfo.serviceObjSource?.length > 5 }" v-if="baseInfo.serviceObjSource?.length">
                <span class="detail-info-item-label">服务对象来源(一级)</span>
                <span class="detail-info-item-content">{{ renderDict(baseInfo.serviceObjSource, 'service_obj_source') }}</span>
              </div>
              <div class="detail-info-item" :class="{ 'item-100': baseInfo.secondServiceSource?.length > 5 }" v-if="baseInfo.secondServiceSource?.length">
                <span class="detail-info-item-label">服务对象来源(二级)</span>
                <span class="detail-info-item-content">
                  {{ belongList(baseInfo.secondServiceSource) }}
                </span>
              </div>
              <!-- <div class="detail-info-item" v-if="baseInfo.customerType">
                <span class="detail-info-item-label">类型</span>
                <span class="detail-info-item-content">
                  <line-one-tooltip :content="radioDict(baseInfo.customerType, 'customer_type')"></line-one-tooltip>
                </span>
              </div> -->
              <div class="detail-info-item" v-if="baseInfo.idType">
                <span class="detail-info-item-label">证件类型</span>
                <span class="detail-info-item-content">{{ radioDict(baseInfo.idType, 'document_type') }}</span>
              </div>
              <div class="detail-info-item" v-if="baseInfo.idcard">
                <span class="detail-info-item-label">证件号码</span>
                <span class="detail-info-item-content">{{ baseInfo.idcard }}</span>
              </div>
              <div class="detail-info-item" v-if="baseInfo.issuer">
                <span class="detail-info-item-label">发证机关</span>
                <span class="detail-info-item-content">{{ baseInfo.issuer }}</span>
              </div>
              <div class="detail-info-item" v-if="baseInfo.idEffective">
                <span class="detail-info-item-label">证件有效期</span>
                <span class="detail-info-item-content"> {{ radioDict(baseInfo.idEffective, 'id_effective') }}</span>
              </div>
              <div class="detail-info-item" v-if="baseInfo.expireDate">
                <span class="detail-info-item-label">证件截止日期</span>
                <span class="detail-info-item-content">{{ baseInfo.expireDate }}</span>
              </div>
              <div class="detail-info-item" v-if="xiamenFlag && baseInfo.nation">
                <span class="detail-info-item-label">国籍</span>
                <span class="detail-info-item-content">{{ radioDict(baseInfo.nation, 'nation') }}</span>
              </div>
              <div class="detail-info-item" v-if="baseInfo.nationality">
                <span class="detail-info-item-label">民族</span>
                <span class="detail-info-item-content">{{ radioDict(baseInfo.nationality, 'nationality') }}</span>
              </div>
              <div class="detail-info-item" v-if="xiamenFlag && baseInfo.politicalstatus">
                <span class="detail-info-item-label">政治面貌</span>
                <span class="detail-info-item-content">{{ radioDict(baseInfo.politicalstatus, 'political_status') }}</span>
              </div>
              <div class="detail-info-item" v-if="baseInfo.educationLevel">
                <span class="detail-info-item-label">文化程度</span>
                <span class="detail-info-item-content">{{ radioDict(baseInfo.educationLevel, 'degree_education') }}</span>
              </div>
              <div class="detail-info-item" v-if="baseInfo.maritalStatus">
                <span class="detail-info-item-label">婚姻状况</span>
                <span class="detail-info-item-content">{{ radioDict(baseInfo.maritalStatus, 'marital_status') }}</span>
              </div>
              <div class="detail-info-item" v-if="xiamenFlag && baseInfo.childrennumSection">
                <span class="detail-info-item-label">子女数量</span>
                <span class="detail-info-item-content">{{ baseInfo.childrennumSection }}</span>
              </div>
              <div class="detail-info-item" v-if="baseInfo.profession">
                <span class="detail-info-item-label">职业</span>
                <span class="detail-info-item-content">{{ radioDict(baseInfo.profession, 'occupation') }}</span>
              </div>
              <div class="detail-info-item" v-if="xiamenFlag && baseInfo.detaileProfession">
                <span class="detail-info-item-label">详细职业</span>
                <span class="detail-info-item-content">{{ baseInfo.detaileProfession }}</span>
              </div>
              <div class="detail-info-item" v-if="xiamenFlag && baseInfo.isRetire">
                <span class="detail-info-item-label">是否退休</span>
                <span class="detail-info-item-content">{{ baseInfo.isRetire == '1' ? '是' : '否' }}</span>
              </div>
              <div class="detail-info-item" v-if="xiamenFlag && baseInfo.mainFinancially">
                <span class="detail-info-item-label">主要经济来源</span>
                <span class="detail-info-item-content">{{ radioDict(baseInfo.mainFinancially, 'main_economic_source') }}</span>
              </div>
              <div class="detail-info-item" v-if="baseInfo.income">
                <span class="detail-info-item-label">收入/月</span>
                <span class="detail-info-item-content"> {{ radioDict(baseInfo.income, 'income_month') }}</span>
              </div>
              <div class="detail-info-item" v-if="baseInfo.speciality">
                <span class="detail-info-item-label">个人特长</span>
                <span class="detail-info-item-content">{{ baseInfo.speciality }}</span>
              </div>
              <div class="detail-info-item" :class="{ 'item-100': baseInfo.serviceStandards?.length > 5 }" v-if="baseInfo?.serviceStandards?.length">
                <span class="detail-info-item-label">服务标准</span>
                <span class="detail-info-item-content">{{ renderDict(baseInfo.serviceStandards, 'service_standards') }}</span>
              </div>
              <div class="detail-info-item" v-if="xiamenFlag && baseInfo.insurance?.length">
                <span class="detail-info-item-label">保险</span>
                <span class="detail-info-item-content">{{ renderDict(baseInfo.insurance, 'insurance') }} </span>
              </div>
              <div class="detail-info-item" v-if="baseInfo.memberLevel">
                <span class="detail-info-item-label">会员级别</span>
                <span class="detail-info-item-content">{{ radioDict(baseInfo.memberLevel, 'member_level') }}</span>
              </div>
              <div class="detail-info-item item-100" v-if="xiamenFlag && contactList.length">
                <span class="detail-info-item-label">联系人</span>
                <span class="detail-info-item-content">
                  <el-table
                    :data="contactList"
                    header-row-class-name="table-header"
                    :style="{
                      border: '1px solid #f5f3f0',
                      borderRadius: '4px'
                    }"
                  >
                    <el-table-column type="index" />
                    <el-table-column prop="ownerName" label="联系人" show-overflow-tooltip />
                    <el-table-column show-overflow-tooltip prop="phoneNumber" label="联系方式" />
                    <el-table-column show-overflow-tooltip prop="contactRole" label="角色">
                      <template #default="scope">
                        <line-one-tooltip :content="radioDict(scope.row.contactRole, 'contact_role')"></line-one-tooltip>
                      </template>
                    </el-table-column>
                  </el-table>
                </span>
              </div>
            </div>
          </div>

          <div ref="requirementInfoRef" v-if="visibleRequirementInfo">
            <h2 class="title">需求情况</h2>
            <div class="info-list r-m-b-20">
              <div class="detail-info-item" v-if="xiamenFlag && requirementInfo.isCare">
                <span class="detail-info-item-label">是否接受关怀慰问电话</span>
                <span class="detail-info-item-content">
                  {{ requirementInfo.isCare === '1' ? '是' : '否' }}
                </span>
              </div>
              <div class="detail-info-item">
                <span class="detail-info-item-label">安全需求</span>
                <span class="detail-info-item-content" v-if="requirementInfo.securityDemand?.length">{{ renderDict(requirementInfo.securityDemand, 'security_demand') }} </span>
                <span v-else>无需求</span>
              </div>
              <div class="detail-info-item">
                <span class="detail-info-item-label">生活需求</span>
                <span class="detail-info-item-content" v-if="requirementInfo.domesticDemand?.length">
                  {{ renderDict(requirementInfo.domesticDemand, 'domestic_demand') }}
                </span>
                <span v-else>无需求</span>
              </div>
              <div class="detail-info-item">
                <span class="detail-info-item-label">家政需求</span>
                <span class="detail-info-item-content" v-if="requirementInfo.domesticDemand?.length">
                  {{ renderDict(requirementInfo.domesticDemand, 'domestic_demand') }}
                </span>
                <span v-else>无需求</span>
              </div>
              <div class="detail-info-item">
                <span class="detail-info-item-label">精神需求</span>
                <span class="detail-info-item-content" v-if="requirementInfo.spiritDemand?.length">
                  {{ renderDict(requirementInfo.spiritDemand, 'spirit_demand') }}
                </span>
                <span v-else>无需求</span>
              </div>
              <div class="detail-info-item">
                <span class="detail-info-item-label">医疗需求</span>
                <span class="detail-info-item-content" v-if="requirementInfo.medicalDemand?.length">{{ renderDict(requirementInfo.medicalDemand, 'medical_demand') }} </span>
                <span v-else>无需求</span>
              </div>
              <div class="detail-info-item" v-if="xiamenFlag && requirementInfo.demandImportantLevel?.length">
                <span class="detail-info-item-label">需求重要程度排序</span>
                <span class="detail-info-item-content"> {{ matchLabels(filterDict('demand_important_level'), requirementInfo.demandImportantLevel) }}</span>
              </div>
            </div>
            <h2
              class="title"
              v-if="
                requirementInfo.currMainConsumption?.length ||
                requirementInfo.everyYearConsumption ||
                requirementInfo.fondTourismType?.length ||
                requirementInfo.tourismFrequency ||
                requirementInfo.fondTourismDistance?.length ||
                requirementInfo.wishHealthyObject
              "
            >
              消费情况
            </h2>
            <div class="info-list r-m-b-20">
              <div class="detail-info-item" v-if="requirementInfo.currMainConsumption?.length">
                <span class="detail-info-item-label">当前主要消费排序</span>
                <span class="detail-info-item-content">{{ matchLabels(filterDict('curr_main_consumption'), requirementInfo.currMainConsumption) }}</span>
              </div>
              <div class="detail-info-item" v-if="requirementInfo.fondTourismType?.length">
                <span class="detail-info-item-label">喜欢的旅游方式</span>
                <span class="detail-info-item-content">{{ renderDict(requirementInfo.fondTourismType, 'fond_tourism_type') }}</span>
              </div>
              <div class="detail-info-item" v-if="requirementInfo.everyYearConsumption">
                <span class="detail-info-item-label">每年次消费</span>
                <span class="detail-info-item-content">{{ radioDict(requirementInfo.everyYearConsumption, 'every_year_consumption') }}</span>
              </div>
              <div class="detail-info-item" v-if="requirementInfo.tourismFrequency">
                <span class="detail-info-item-label">旅游频次</span>
                <span class="detail-info-item-content">{{ radioDict(requirementInfo.tourismFrequency, 'tourism_frequency') }}</span>
              </div>
              <div class="detail-info-item" v-if="requirementInfo.fondTourismDistance?.length">
                <span class="detail-info-item-label">喜欢旅游的距离</span>
                <span class="detail-info-item-content">{{ renderDict(requirementInfo.fondTourismDistance, 'fond_tourism_distance') }}</span>
              </div>
              <div class="detail-info-item" v-if="xiamenFlag && requirementInfo.wishHealthyObject">
                <span class="detail-info-item-label">最愿投资的健康项目</span>
                <span class="detail-info-item-content">{{ renderDict(requirementInfo.wishHealthyObject, 'wish_healthy_object') }} </span>
              </div>
            </div>

            <h2 class="title">分析总结</h2>
            <div class="info-list r-m-b-20">
              <div class="detail-info-item" v-if="requirementInfo.analysisSummary">
                <span class="detail-info-item-label">分析总结</span>
                <span class="detail-info-item-content">{{ requirementInfo.analysisSummary }}</span>
              </div>
              <div class="detail-info-item" v-if="requirementInfo.specialInstructions">
                <span class="detail-info-item-label">老人或其他特殊情况说明</span>
                <span class="detail-info-item-content">{{ requirementInfo.specialInstructions }}</span>
              </div>
            </div>
          </div>
          <div ref="extendInfoRef">
            <h2 class="title" style="position: relative">
              <span>延伸信息</span>
              <el-button link type="primary" @click="edit" style="position: absolute; right: 0" v-if="extendInfo.deathFlag == '0'">编辑客户信息</el-button>
            </h2>
            <div class="info-list r-m-b-20">
              <div class="detail-info-item" v-if="extendInfo.elderClassify">
                <span class="detail-info-item-label">老人分类</span>
                <span class="detail-info-item-content">{{ radioDict(extendInfo.elderClassify, 'elder_classify') }}</span>
              </div>
              <div class="detail-info-item" v-if="xiamenFlag && extendInfo.pensionMode">
                <span class="detail-info-item-label">养老方式</span>
                <span class="detail-info-item-content">{{ radioDict(extendInfo.pensionMode, 'pension_mode') }}</span>
              </div>
              <div class="detail-info-item" v-if="xiamenFlag && extendInfo.reputationEvaluation">
                <span class="detail-info-item-label">信誉评估</span>
                <span class="detail-info-item-content">{{ radioDict(extendInfo.reputationEvaluation, 'reputation_evaluation') }}</span>
              </div>
              <div class="detail-info-item" v-if="xiamenFlag && extendInfo.compensationType">
                <span class="detail-info-item-label">补偿类型</span>
                <span class="detail-info-item-content">{{ radioDict(extendInfo.compensationType, 'compensation_type') }} </span>
              </div>
              <div class="detail-info-item" v-if="xiamenFlag && extendInfo.subsidyQuota">
                <span class="detail-info-item-label">政府补助金额度</span>
                <span class="detail-info-item-content">{{ radioDict(extendInfo.subsidyQuota, 'gov_grant_amount') }}</span>
              </div>
              <div class="detail-info-item" v-if="extendInfo.subsidyStandard?.length">
                <span class="detail-info-item-label">政府补助标准</span>
                <span class="detail-info-item-content">{{ renderDict(extendInfo.subsidyStandard, 'subsidy_standard') }}</span>
              </div>

              <div class="detail-info-item" v-if="xiamenFlag && extendInfo.oldmanType">
                <span class="detail-info-item-label">老人类型</span>
                <span class="detail-info-item-content">{{ radioDict(extendInfo.oldmanType, 'elder_type') }}</span>
              </div>
              <div class="detail-info-item" v-if="extendInfo.oldmanLive">
                <span class="detail-info-item-label">居住情况</span>
                <span class="detail-info-item-content">{{ radioDict(extendInfo.oldmanLive, 'live_situation') }} </span>
              </div>
              <div class="detail-info-item" v-if="xiamenFlag && extendInfo.oldmanGroup">
                <span class="detail-info-item-label">老人群体</span>
                <span class="detail-info-item-content">{{ radioDict(extendInfo.oldmanGroup, 'elder_group') }}</span>
              </div>
              <div class="detail-info-item" v-if="xiamenFlag && extendInfo.personality">
                <span class="detail-info-item-label">老人性格</span>
                <span class="detail-info-item-content">{{ radioDict(extendInfo.personality, 'elder_character') }}</span>
              </div>

              <div class="detail-info-item" v-if="xiamenFlag && extendInfo.internetMode?.length">
                <span class="detail-info-item-label">上网方式</span>
                <span class="detail-info-item-content">{{ renderDict(extendInfo.internetMode, 'internet_mode') }}</span>
              </div>
              <div class="detail-info-item" v-if="extendInfo.oldmanHobby?.length">
                <span class="detail-info-item-label">老人爱好</span>
                <span class="detail-info-item-content">{{ renderDict(extendInfo.oldmanHobby, 'elder_hobby') }}</span>
              </div>
              <div class="detail-info-item" v-if="xiamenFlag && extendInfo.internetAim?.length">
                <span class="detail-info-item-label">上网目的</span>
                <span class="detail-info-item-content">{{ renderDict(extendInfo.internetAim, 'internet_aims') }} </span>
              </div>

              <div class="detail-info-item" v-if="extendInfo.deathFlag">
                <span class="detail-info-item-label">是否健在</span>
                <span class="detail-info-item-content">
                  {{ extendInfo.deathFlag === '1' ? '是' : '否' }}
                </span>
              </div>
              <div class="detail-info-item">
                <span class="detail-info-item-label">是否纳入饱和度计算</span>
                <span class="detail-info-item-content">
                  {{ extendInfo.saturationLevel ? '是' : '否' }}
                </span>
              </div>
              <div class="detail-info-item" v-if="extendInfo.dateOfDeath">
                <span class="detail-info-item-label">死亡日期</span>
                <span class="detail-info-item-content">
                  {{ formatDateString(extendInfo.dateOfDeath, 'YYYY-MM-DD') }}
                </span>
              </div>
              <div class="detail-info-item" v-if="extendInfo.entryFamilyFlag">
                <span class="detail-info-item-label">是否人户一致</span>
                <span class="detail-info-item-content">
                  {{ extendInfo.entryFamilyFlag !== '0' ? '是' : '否' }}
                </span>
              </div>
              <div class="detail-info-item" v-if="extendInfo.normalService">
                <span class="detail-info-item-label">是否正常服务</span>
                <span class="detail-info-item-content">
                  {{ extendInfo.normalService !== '0' ? '是' : '否' }}
                </span>
              </div>
              <div class="detail-info-item" v-if="extendInfo.normalService === '0'">
                <span class="detail-info-item-label">取消服务原因</span>
                <span class="detail-info-item-content">
                  {{ renderDict(extendInfo.cancelServiceReason, 'cancel_service_reason') }}
                </span>
              </div>
              <div class="detail-info-item" v-if="extendInfo.normalService === '0'">
                <span class="detail-info-item-label">取消服务日期</span>
                <span class="detail-info-item-content">
                  {{ extendInfo.cancelServiceTime }}
                </span>
              </div>

              <div class="detail-info-item" v-if="extendInfo.disableInfo?.disableObject">
                <span class="detail-info-item-label">是否残联服务对象</span>
                <span class="detail-info-item-content">
                  {{ extendInfo.disableInfo?.disableObject !== '0' ? '是' : '否' }}
                </span>
              </div>
              <div class="detail-info-item" v-if="extendInfo.disableInfo?.disableCategory">
                <span class="detail-info-item-label">残疾类别</span>
                <span class="detail-info-item-content">{{ radioDict(extendInfo.disableInfo.disableCategory, 'disability_category') }} </span>
              </div>
              <div class="detail-info-item" v-if="extendInfo.disableInfo?.disableCategory">
                <span class="detail-info-item-label">残疾等级细分</span>
                <span class="detail-info-item-content">
                  <span v-for="level in disableLevel_type" :key="level.value">
                    {{
                      extendInfo?.disableInfo[level.value] ? filterDict('disableLevel_mince')?.find((item) => item.value == extendInfo?.disableInfo[level.value])?.label + level.name + '残疾、' : ''
                    }}
                  </span>
                </span>
              </div>
              <div class="detail-info-item" v-if="extendInfo.disableInfo?.hasCertificate">
                <span class="detail-info-item-label">是否持证</span>
                <span class="detail-info-item-content"> {{ extendInfo.disableInfo?.hasCertificate !== '0' ? '是' : '否' }}</span>
              </div>
              <div class="detail-info-item" v-if="extendInfo.disableInfo?.certificateTime">
                <span class="detail-info-item-label">持证时间</span>
                <span class="detail-info-item-content">{{ formatDateString(extendInfo.disableInfo.certificateTime, 'YYYY-MM-DD') }}</span>
              </div>
              <div class="detail-info-item" v-if="extendInfo.disableInfo?.certificateNumber">
                <span class="detail-info-item-label">残疾证号</span>
                <span class="detail-info-item-content">{{ extendInfo.disableInfo.certificateNumber }}</span>
              </div>
              <div class="detail-info-item" v-if="extendInfo.attachmentList?.length">
                <span class="detail-info-item-label">附件文件</span>
                <span class="detail-info-item-content">
                  <div v-for="item in extendInfo.attachmentList" :key="item.id">
                    <p class="file" @click="downloadFile(item)">
                      {{ item.originalName }}
                    </p>
                  </div>
                </span>
              </div>
            </div>
          </div>
          <div v-if="visibleHealthInfo" ref="healthInfoRef">
            <h2 class="title" v-if="xiamenFlag">健康信息</h2>
            <div class="info-list r-m-b-20" v-if="xiamenFlag">
              <div class="detail-info-item" v-if="healthInfo.height">
                <span class="detail-info-item-label">身高</span>
                <span class="detail-info-item-content"> {{ healthInfo.height }} CM </span>
              </div>
              <div class="detail-info-item" v-if="healthInfo.weight">
                <span class="detail-info-item-label">体重</span>
                <span class="detail-info-item-content"> {{ healthInfo.weight }} KG </span>
              </div>
              <div class="detail-info-item" v-if="healthInfo.waist">
                <span class="detail-info-item-label">腰围</span>
                <span class="detail-info-item-content"> {{ healthInfo.waist }} CM </span>
              </div>
              <div class="detail-info-item" v-if="healthInfo.bmi">
                <span class="detail-info-item-label">体质指数</span>
                <span class="detail-info-item-content"> {{ healthInfo.bmi }} BMI </span>
              </div>
            </div>
            <h2 class="title">身体情况</h2>
            <div class="info-list r-m-b-20">
              <div class="detail-info-item" v-if="healthInfo.healthSelfRating">
                <span class="detail-info-item-label">健康状况自评</span>
                <span class="detail-info-item-content">{{ radioDict(healthInfo.healthSelfRating, 'health_self_rating') }}</span>
              </div>
              <div class="detail-info-item" v-if="xiamenFlag && healthInfo.selfCareSelfRating">
                <span class="detail-info-item-label">自理能力自评</span>
                <span class="detail-info-item-content">{{ radioDict(healthInfo.selfCareSelfRating, 'self_care_self_rating') }}</span>
              </div>
              <div class="detail-info-item" v-if="xiamenFlag && healthInfo.smokingSituationDay">
                <span class="detail-info-item-label">日常抽烟情况</span>
                <span class="detail-info-item-content">{{ radioDict(healthInfo.smokingSituationDay, 'smoking_situation_day') }}</span>
              </div>
              <div class="detail-info-item" v-if="xiamenFlag && healthInfo.drinkSituation">
                <span class="detail-info-item-label">饮酒情况</span>
                <span class="detail-info-item-content">{{ radioDict(healthInfo.drinkSituation, 'drink_situation') }}</span>
              </div>
              <div class="detail-info-item" v-if="xiamenFlag && healthInfo.sleepSituationDay">
                <span class="detail-info-item-label">日常睡眠情况</span>
                <span class="detail-info-item-content">{{ radioDict(healthInfo.sleepSituationDay, 'sleep_situation_day') }}</span>
              </div>
              <div class="detail-info-item" v-if="xiamenFlag && healthInfo.sleepQuality">
                <span class="detail-info-item-label">睡眠质量</span>
                <span class="detail-info-item-content">{{ radioDict(healthInfo.sleepQuality, 'sleep_quality') }}</span>
              </div>
              <div class="detail-info-item" v-if="healthInfo.exerciseAmountWeek">
                <span class="detail-info-item-label">周运动量</span>
                <span class="detail-info-item-content"> {{ healthInfo.exerciseAmountWeek }} 次 </span>
              </div>
              <div class="detail-info-item" v-if="healthInfo.exerciseAmountEvery">
                <span class="detail-info-item-label">每次运动量</span>
                <span class="detail-info-item-content"> {{ healthInfo.exerciseAmountEvery }} 分钟 </span>
              </div>
              <div class="detail-info-item" v-if="healthInfo.foodHabits">
                <span class="detail-info-item-label">饮食习惯</span>
                <span class="detail-info-item-content">{{ radioDict(healthInfo.foodHabits, 'food_habits') }} </span>
              </div>
              <div class="detail-info-item" v-if="healthInfo.formFeature">
                <span class="detail-info-item-label">形体特征</span>
                <span class="detail-info-item-content">{{ radioDict(healthInfo.formFeature, 'form_feature') }}</span>
              </div>
              <div class="detail-info-item" v-if="healthInfo.isMedication">
                <span class="detail-info-item-label">是否长期用药</span>
                <span class="detail-info-item-content">{{ radioDict(healthInfo.isMedication, 'is_medication') }}</span>
              </div>
              <div class="detail-info-item" v-if="healthInfo.physicalExercise?.length">
                <span class="detail-info-item-label">体育锻炼</span>
                <span class="detail-info-item-content">{{ renderDict(healthInfo.physicalExercise, 'physical_exercise') }}</span>
              </div>
              <div class="detail-info-item" v-if="healthInfo.psychologicalFeature?.length">
                <span class="detail-info-item-label">心理特征</span>
                <span class="detail-info-item-content">{{ renderDict(healthInfo.psychologicalFeature, 'psychological_feature') }}</span>
              </div>
              <div class="detail-info-item" v-if="healthInfo.physicalCondition?.length">
                <span class="detail-info-item-label">身体状况</span>
                <span class="detail-info-item-content">{{ renderDict(healthInfo.physicalCondition, 'physical_condition') }} </span>
              </div>
              <div class="detail-info-item" v-if="healthInfo.chronicDisease?.length">
                <span class="detail-info-item-label">慢性病</span>
                <span class="detail-info-item-content">{{ renderDict(healthInfo.chronicDisease, 'chronic_disease') }}</span>
              </div>
              <div class="detail-info-item" v-if="healthInfo.foodPreference?.length">
                <span class="detail-info-item-label">饮食偏好</span>
                <span class="detail-info-item-content">{{ renderDict(healthInfo.foodPreference, 'food_preference') }} </span>
              </div>
              <div class="detail-info-item" v-if="xiamenFlag && healthInfo.dementiaPrecursor?.length">
                <span class="detail-info-item-label">痴呆前兆</span>
                <span class="detail-info-item-content">{{ renderDict(healthInfo.dementiaPrecursor, 'dementia_precursor') }}</span>
              </div>
              <div class="detail-info-item" v-if="xiamenFlag && healthInfo.existingSymptoms?.length">
                <span class="detail-info-item-label">现存症状</span>
                <span class="detail-info-item-content">{{ renderDict(healthInfo.existingSymptoms, 'existing_symptoms') }} </span>
              </div>
            </div>

            <h2
              class="title"
              v-if="xiamenFlag && (healthInfo.exhaustFacilities?.length || healthInfo.fuelType?.length || healthInfo.drinkingWater?.length || healthInfo.toilet?.length || healthInfo.pet?.length)"
            >
              生活环境
            </h2>
            <div
              class="info-list r-m-b-20"
              v-if="xiamenFlag && (healthInfo.exhaustFacilities?.length || healthInfo.fuelType?.length || healthInfo.drinkingWater?.length || healthInfo.toilet?.length || healthInfo.pet?.length)"
            >
              <div class="detail-info-item" v-if="healthInfo.exhaustFacilities?.length">
                <span class="detail-info-item-label">厨房排风设施</span>
                <span class="detail-info-item-content">{{ renderDict(healthInfo.exhaustFacilities, 'exhaust_facilities') }}</span>
              </div>
              <div class="detail-info-item" v-if="healthInfo.fuelType?.length">
                <span class="detail-info-item-label">燃料类型</span>
                <span class="detail-info-item-content">{{ renderDict(healthInfo.fuelType, 'fuel_type') }}</span>
              </div>
              <div class="detail-info-item" v-if="healthInfo.drinkingWater?.length">
                <span class="detail-info-item-label">饮水类型</span>
                <span class="detail-info-item-content">{{ renderDict(healthInfo.drinkingWater, 'drinking_water') }}</span>
              </div>
              <div class="detail-info-item" v-if="healthInfo.toilet?.length">
                <span class="detail-info-item-label">厕所</span>
                <span class="detail-info-item-content">{{ renderDict(healthInfo.toilet, 'toilet') }}</span>
              </div>
              <div class="detail-info-item" v-if="healthInfo.pet?.length">
                <span class="detail-info-item-label">宠物</span>
                <span class="detail-info-item-content">{{ renderDict(healthInfo.pet, 'pet') }}</span>
              </div>
            </div>
            <h2
              class="title"
              v-if="xiamenFlag && (healthInfo.drugAllergyHistory?.length || healthInfo.familyMedicalHistory?.length || healthInfo.hereditMedicalHistory || healthInfo.pastMedicalHistory)"
            >
              病史
            </h2>
            <div
              class="info-list r-m-b-20"
              v-if="xiamenFlag && (healthInfo.drugAllergyHistory?.length || healthInfo.familyMedicalHistory?.length || healthInfo.hereditMedicalHistory || healthInfo.pastMedicalHistory)"
            >
              <div class="detail-info-item" v-if="healthInfo.drugAllergyHistory?.length">
                <span class="detail-info-item-label">药物过敏史</span>
                <span class="detail-info-item-content">{{ renderDict(healthInfo.drugAllergyHistory, 'drug_allergy_history') }}</span>
              </div>
              <div class="detail-info-item" v-if="healthInfo.familyMedicalHistory?.length">
                <span class="detail-info-item-label">家族病史</span>
                <span class="detail-info-item-content">{{ renderDict(healthInfo.familyMedicalHistory, 'family_history') }}</span>
              </div>
              <div class="detail-info-item" v-if="healthInfo.hereditMedicalHistory">
                <span class="detail-info-item-label">遗传病史</span>
                <span class="detail-info-item-content">{{ healthInfo.hereditMedicalHistory }}</span>
              </div>
              <div class="detail-info-item" v-if="healthInfo.pastMedicalHistory">
                <span class="detail-info-item-label">既往病史</span>
                <span class="detail-info-item-content">{{ healthInfo.pastMedicalHistory }}</span>
              </div>
            </div>

            <h2 class="title" v-if="healthInfo.bloodPressureSituation || healthInfo.bloodSugarSituation"> 主要指标 </h2>
            <div class="info-list r-m-b-20" v-if="healthInfo.bloodPressureSituation || healthInfo.bloodSugarSituation">
              <div class="detail-info-item" v-if="healthInfo.bloodPressureSituation">
                <span class="detail-info-item-label">血压情况</span>
                <span class="detail-info-item-content">{{ radioDict(healthInfo.bloodPressureSituation, 'blood_pressure_situation') }}</span>
              </div>
              <div class="detail-info-item" v-if="healthInfo.bloodSugarSituation">
                <span class="detail-info-item-label">血糖情况</span>
                <span class="detail-info-item-content">{{ radioDict(healthInfo.bloodSugarSituation, 'blood_sugar_situation') }}</span>
              </div>
            </div>

            <h2 class="title" v-if="healthInfo.bloodPressureSituation || healthInfo.bloodSugarSituation"> 主要指标 </h2>
            <div class="info-list r-m-b-20" v-if="healthInfo.bloodPressureSituation || healthInfo.bloodSugarSituation">
              <div class="detail-info-item" v-if="healthInfo.bloodPressureSituation">
                <span class="detail-info-item-label">血压情况</span>
                <span class="detail-info-item-content">{{ radioDict(healthInfo.bloodPressureSituation, 'blood_pressure_situation') }} </span>
              </div>
              <div class="detail-info-item" v-if="healthInfo.bloodSugarSituation">
                <span class="detail-info-item-label">血糖情况</span>
                <span class="detail-info-item-content">{{ radioDict(healthInfo.bloodSugarSituation, 'blood_sugar_situation') }}</span>
              </div>
            </div>
            <h2 class="title" v-if="healthInfo.chineseMedicinePhysique?.length"> 中医体质辨识 </h2>
            <div class="info-list r-m-b-20" v-if="healthInfo.chineseMedicinePhysique?.length">
              <div class="detail-info-item" v-if="healthInfo.chineseMedicinePhysique?.length">
                <span class="detail-info-item-label">中医体质辨识</span>
                <span class="detail-info-item-content">{{ renderDict(healthInfo.chineseMedicinePhysique, 'chinese_medicine_physique') }}</span>
              </div>
            </div>
            <h2
              class="title"
              v-if="
                healthInfo.cardiovascularDisease ||
                healthInfo.kidneyDisease ||
                healthInfo.heartDisease ||
                healthInfo.ocularDisease ||
                healthInfo.skeletonDisease?.length ||
                healthInfo.cavityDisease?.length
              "
            >
              现存主要健康问题
            </h2>
            <div
              class="info-list r-m-b-20"
              v-if="
                healthInfo.cardiovascularDisease ||
                healthInfo.kidneyDisease ||
                healthInfo.heartDisease ||
                healthInfo.ocularDisease ||
                healthInfo.skeletonDisease?.length ||
                healthInfo.cavityDisease?.length
              "
            >
              <div class="detail-info-item" v-if="healthInfo.cardiovascularDisease">
                <span class="detail-info-item-label">心脑血管疾病</span>
                <span class="detail-info-item-content">
                  {{ radioDict(healthInfo.cardiovascularDisease, 'cardiovascular_disease') }}
                </span>
              </div>
              <div class="detail-info-item" v-if="healthInfo.kidneyDisease">
                <span class="detail-info-item-label">肾脏疾病</span>
                <span class="detail-info-item-content">
                  {{ radioDict(healthInfo.kidneyDisease, 'kidney_disease') }}
                </span>
              </div>
              <div class="detail-info-item" v-if="healthInfo.heartDisease">
                <span class="detail-info-item-label">心脏疾病</span>
                <span class="detail-info-item-content">
                  {{ radioDict(healthInfo.heartDisease, 'heart_disease') }}
                </span>
              </div>
              <div class="detail-info-item" v-if="healthInfo.ocularDisease">
                <span class="detail-info-item-label">眼部疾病</span>
                <span class="detail-info-item-content">
                  {{ radioDict(healthInfo.ocularDisease, 'ocular_disease') }}
                </span>
              </div>
              <div class="detail-info-item" v-if="healthInfo.skeletonDisease?.length">
                <span class="detail-info-item-label">骨骼疾病</span>
                <span class="detail-info-item-content">
                  {{ renderDict(healthInfo.skeletonDisease, 'skeleton_disease') }}
                </span>
              </div>
              <div class="detail-info-item" v-if="healthInfo.cavityDisease?.length">
                <span class="detail-info-item-label">口腔疾病</span>
                <span class="detail-info-item-content">
                  {{ renderDict(healthInfo.cavityDisease, 'cavity_disease') }}
                </span>
              </div>
            </div>
            <h2 class="title" v-if="xiamenFlag && hospitalInfo?.length">过往住院史</h2>
            <div class="info-box" v-if="xiamenFlag && hospitalInfo?.length">
              <div class="info-item item-100">
                <el-table
                  :data="hospitalInfo"
                  header-row-class-name="table-header"
                  :style="{
                    maxWidth: '100%',
                    border: '1px solid #f5f3f0',
                    borderRadius: '8px'
                  }"
                >
                  <el-table-column type="index" />
                  <el-table-column show-overflow-tooltip prop="hospitalDate" label="入院日期" min-width="160">
                    <template #default="{ row }">
                      <div v-if="row.hospitalDate">{{ row.hospitalDate.slice(0, 11) }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="hospitalReason" label="入院原因" show-overflow-tooltip min-width="160" />
                  <el-table-column prop="medicalInstitution" label="医疗机构" show-overflow-tooltip min-width="160" />
                  <el-table-column show-overflow-tooltip prop="recoverySituation" label="健康恢复情况" min-width="160">
                    <template #default="{ row }">
                      {{ renderDict(row.recoverySituation, 'recovery_situation') }}
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
            <h2 class="title" v-if="xiamenFlag && medicationInfo?.length">用药情况</h2>
            <div class="info-box" v-if="xiamenFlag && medicationInfo?.length">
              <div class="info-item item-100">
                <el-table
                  :data="medicationInfo"
                  header-row-class-name="table-header"
                  :style="{
                    maxWidth: '100%',
                    border: '1px solid #f5f3f0',
                    borderRadius: '8px'
                  }"
                >
                  <el-table-column type="index" />
                  <el-table-column prop="medicationName" label="用药名称或类型" show-overflow-tooltip min-width="160" />
                  <el-table-column show-overflow-tooltip prop="dosageDay" label="每日用量" min-width="160" />
                  <el-table-column show-overflow-tooltip prop="medicationTime" label="用药时间" min-width="160">
                    <template #default="{ row }">
                      {{
                        row.medicationTime
                          .sort((a: string, b: string) => parseInt(a) - parseInt(b))
                          .map((time: any) => filterDict('medication_time').find((item: any) => item.value == time)?.label)
                          .join('，')
                      }}
                    </template>
                  </el-table-column>
                  <el-table-column show-overflow-tooltip prop="medicationCompliance" label="服药依从性" min-width="160">
                    <template #default="{ row }">
                      {{ renderDict(row.medicationCompliance, 'medication_compliance') }}
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </div>
          <div v-if="visibleFamilyInfo" ref="familyInfoRef" style="height: calc(100vh - 310px)">
            <h2 class="title">家庭成员</h2>
            <div class="info-box">
              <div class="info-item item-100">
                <el-table
                  :data="familyInfo"
                  header-row-class-name="table-header"
                  :style="{
                    maxWidth: '100%',
                    border: '1px solid #f5f3f0',
                    borderRadius: '8px'
                  }"
                >
                  <el-table-column type="index" fixed />
                  <el-table-column prop="name" label="姓名" show-overflow-tooltip width="100" fixed />
                  <el-table-column show-overflow-tooltip prop="sex" label="性别" width="100">
                    <template #default="scope">
                      {{ radioDict(scope.row.sex, 'vols_sex') }}
                    </template>
                  </el-table-column>
                  <el-table-column show-overflow-tooltip prop="role" label="角色" width="130">
                    <template #default="scope">
                      {{ radioDict(scope.row.role, 'family_role') }}
                    </template>
                  </el-table-column>
                  <el-table-column show-overflow-tooltip prop="phone" label="联系方式" />
                  <el-table-column show-overflow-tooltip prop="age" label="年龄" width="100" />
                  <el-table-column show-overflow-tooltip prop="workProperty" label="工作性质">
                    <template #default="scope">
                      {{ radioDict(scope.row.workProperty, 'work_Property') }}
                    </template>
                  </el-table-column>
                  <el-table-column show-overflow-tooltip prop="workCompany" label="工作单位">
                    <template #default="scope">
                      {{ radioDict(scope.row.workCompany, 'work_unit') }}
                    </template>
                  </el-table-column>
                  <el-table-column show-overflow-tooltip prop="incomeRange" label="收入范围" width="150">
                    <template #default="scope">
                      {{ radioDict(scope.row.incomeRange, 'income_month') }}
                    </template>
                  </el-table-column>
                  <el-table-column show-overflow-tooltip prop="relation" label="与老人关系" width="150">
                    <template #default="scope">
                      {{ radioDict(scope.row.relation, 'elder_relation') }}
                    </template>
                  </el-table-column>
                  <el-table-column show-overflow-tooltip prop="gohomeBend" label="回家频率" width="150">
                    <template #default="scope">
                      {{ radioDict(scope.row.gohomeBend, 'gohome_bend') }}
                    </template>
                  </el-table-column>
                  <el-table-column show-overflow-tooltip prop="isRegister" label="在平台做过登记" width="150">
                    <template #default="scope">
                      {{ radioDict(scope.row.isRegister, 'yes_no') }}
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </div>
        </div>
      </el-scrollbar>
      <el-scrollbar class="info-container" v-if="currentMenu === 'bpDataInfo'">
        <p class="title" style="font-weight: bold; margin-bottom: 10px">血压数据</p>
        <BpDataInfoEditForm :dict="dictMap" :customerId="Number(query.id)" />
      </el-scrollbar>
      <el-scrollbar class="info-container" v-if="currentMenu === 'bsDataInfo'">
        <p class="title" style="font-weight: bold; margin-bottom: 10px">血糖数据</p>
        <BsDataInfoEditForm :dict="dictMap" :customerId="Number(query.id)" />
      </el-scrollbar>
      <el-scrollbar class="info-container" v-if="currentMenu === 'statistics'">
        <p class="title" style="font-weight: bold; margin-bottom: 10px">综合</p>
        <ServerStatistics :customerId="Number(query.id)" />
      </el-scrollbar>
      <el-scrollbar class="info-container" v-if="currentMenu === 'consult'">
        <p class="title" style="font-weight: bold; margin-bottom: 10px">咨询</p>
        <ConsultRecordTable :dict="dictMap" :customerId="Number(query.id)" :phone="baseInfo.mobilephone" />
      </el-scrollbar>
      <el-scrollbar class="info-container" v-if="currentMenu === 'complaint'">
        <p class="title" style="font-weight: bold; margin-bottom: 10px">投诉</p>
        <ComplaintRecordTable :dict="dictMap" :customerId="Number(query.id)" :phone="baseInfo.mobilephone" />
      </el-scrollbar>
      <el-scrollbar class="info-container" v-if="currentMenu === 'order'">
        <p class="title" style="font-weight: bold; margin-bottom: 10px">订单</p>
        <OrderRecordTable :dict="dictMap" :customerId="Number(query.id)" :phone="baseInfo.mobilephone" />
      </el-scrollbar>
      <el-scrollbar class="info-container" v-if="currentMenu === 'selfBuildOrder'">
        <p class="title" style="font-weight: bold; margin-bottom: 10px">自建订单</p>
        <SelfBuildOrderRecordTable :dict="dictMap" :customerId="Number(query.id)" />
      </el-scrollbar>
      <el-scrollbar class="info-container" v-if="currentMenu === 'careinfo'">
        <p class="title" style="font-weight: bold; margin-bottom: 10px">关怀</p>
        <CareinfoRecordTable :dict="dictMap" :customerId="Number(query.id)" :phone="baseInfo.mobilephone" />
      </el-scrollbar>
      <el-scrollbar class="info-container" v-if="currentMenu === 'servePacket'">
        <p class="title" style="font-weight: bold; margin-bottom: 10px">服务包</p>
        <ServePacketRecordTable :dict="dictMap" :customerId="Number(query.id)" />
      </el-scrollbar>
      <el-scrollbar class="info-container" v-if="currentMenu === 'subsidy'">
        <p class="title" style="font-weight: bold; margin-bottom: 10px">补贴</p>
        <SubsidyRecordTable :dict="dictMap" :customerId="Number(query.id)" />
      </el-scrollbar>
      <el-scrollbar class="info-container" v-if="currentMenu === 'updateRecord'">
        <UpdateRecordTable :dict="dictMap" :customerId="Number(query.id)" />
      </el-scrollbar>
      <el-scrollbar class="info-container" v-if="currentMenu === 'visitingInfo'">
        <p class="title" style="font-weight: bold; margin-bottom: 10px">拜访信息</p>
        <VisitingInfo :dict="dictMap" :base-info="baseInfo" />
      </el-scrollbar>
      <el-scrollbar class="info-container" v-if="currentMenu === 'zhucanInfo'">
        <p class="title" style="font-weight: bold; margin-bottom: 10px">助餐记录</p>
        <ZhucanInfo :dict="dictMap" :customerId="Number(query.id)" />
      </el-scrollbar>
    </div>
  </div>
  <el-dialog v-model="changeDeathFlagVisibleFlag" title="修改健在状态" width="30%" center @close="changeDeathFlagVisibleFlag = false" :close-on-press-escape="false" :close-on-click-modal="false">
    <span style="white-space: pre-line"> 是否确认该老人依然健在？（保存后，该老人的信息将纳入饱和度统计，一级字段填写后才允许保存） </span>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="saveDeathFlag">确定</el-button>
        <el-button @click="changeDeathFlagVisibleFlag = false">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, onMounted, onActivated } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  getCustomerBaseDetailById,
  getContactListById,
  getRequirementDetailById,
  getExtendDetailById,
  getHealthDetailById,
  getHospital,
  getFamilyDetail,
  getMedication,
  updateExtend,
  updateSaturationStatistics
} from '@/api/customer/index'
import { formatDateString } from '@/utils/index'
import { ElMessage } from 'element-plus'
import BpDataInfoEditForm from './components/bp-data-info-edit-form/index.vue'
import BsDataInfoEditForm from './components/bs-data-info-edit-form/index.vue'
import UpdateRecordTable from './components/update-record-table/index.vue'
import ConsultRecordTable from './components/consult-record-table/index.vue'
import ComplaintRecordTable from './components/complaint-record-table/index.vue'
import OrderRecordTable from './components/order-record-table/index.vue'
import SelfBuildOrderRecordTable from './components/self-build-order-record-table/index.vue'
import CareinfoRecordTable from './components/careinfo-record-table/index.vue'
import ServePacketRecordTable from './components/serve-packet-record-table/index.vue'
import SubsidyRecordTable from './components/subsidy-record-table/index.vue'
import VisitingInfo from './components/visiting-info/index.vue'
import ZhucanInfo from './components/zhucan-info/index.vue'
import ServerStatistics from './components/server-statistics/index.vue'
import { getAuth } from '@/utils/export'
import { useCache } from '@/hooks/web/useCache'
import { isFieldsEmptyOrNull } from '@/utils/index'
// import { getBelongItemlabelList } from '@/api/filiale'
import { dictMap, filterDict, renderDict } from '@/hooks/web/useDict'
import useBelong from '@/hooks/web/useBelong'
// @ts-ignore
defineOptions({
  // eslint-disable-next-line vue/component-definition-name-casing
  name: 'Customer/detail'
})
const { back, push } = useRouter()
const { belongList } = useBelong()
const { query } = useRoute()
const { wsCache } = useCache()

const xiamenFlag = ref(wsCache.get('xiamenFlag'))

const leafAreaFlag = ref(wsCache.get('leafAreaFlag'))

const visibleRequirementInfo = ref(true)
const visibleHealthInfo = ref(true)
const visibleFamilyInfo = ref(true)

const scrollbarRef = ref()

const currentMenu = ref('baseInfo')

function handleMenuSelect(key) {
  if (key == 'baseInfo' || key == 'requirementInfo' || key == 'extendInfo' || key == 'healthInfo' || key == 'familyInfo') {
    currentMenu.value = 'baseInfo'
    setTimeout(() => {
      scrollToAnchor(key)
    }, 50)
  } else {
    currentMenu.value = key
  }
}

function onBack() {
  back()
}

function edit() {
  push(`/customer/edit?id=${baseInfo.value.id}&customerUpdate=${query.customerUpdate || 'true'}`)
}

const innerRef = ref()
const baseInfoRef = ref()
const requirementInfoRef = ref()
const extendInfoRef = ref()
const healthInfoRef = ref()
const familyInfoRef = ref()
const scrollToAnchor = (key) => {
  if (key == 'baseInfo') {
    scrollbarRef.value!.setScrollTop(0)
    return
  }
  const refObj = new Map([
    ['baseInfo', baseInfoRef],
    ['requirementInfo', requirementInfoRef],
    ['extendInfo', extendInfoRef],
    ['healthInfo', healthInfoRef],
    ['familyInfo', familyInfoRef]
  ])
  let ref = refObj.get(key) || baseInfoRef
  if (!ref.value.offsetTop) {
    scrollbarRef.value!.setScrollTop(innerRef.value.scrollHeight)
    return
  }

  scrollbarRef.value!.setScrollTop(ref.value.offsetTop)
}

const changeDeathFlagVisibleFlag = ref(false)
function changeDeathFlag() {
  changeDeathFlagVisibleFlag.value = true
}

async function saveDeathFlag() {
  const form = extendInfo.value
  form.deathFlag = '1'
  form.dateOfDeath = undefined
  const res: any = await updateExtend(form)
  if (res.code == 200) {
    ElMessage.success('保存成功')
    getExtendInfo()
    changeDeathFlagVisibleFlag.value = false
  }
}

const disableLevel_type = ref([
  { name: '肢体', value: 'disablelevelMinceLimbs' },
  { name: '智力', value: 'disablelevelMinceIntelligence' },
  { name: '多重', value: 'disablelevelMinceMultiple' },
  { name: '言语', value: 'disablelevelMinceSpeech' },
  { name: '视力', value: 'disablelevelMinceVision' },
  { name: '精神', value: 'disablelevelMinceSpirit' },
  { name: '听力', value: 'disablelevelMinceHearing' }
])

const radioDict = (key: any, dict: any) => {
  if (!key) {
    return
  }
  return filterDict(dict)
    ?.filter((item: any) => item.value == key)
    .map((item: any) => item?.label)
    .join('，')
}

let baseInfo = ref<any>({})
let requirementInfo = ref<any>({})
let extendInfo = ref<any>({
  disableInfo: {
    id: null,
    customerId: null,
    disableCategory: null,
    disableObject: null,
    hasCertificate: null,
    certificateTime: null,
    certificateNumber: null,
    disablelevelMinceLimbs: null,
    disablelevelMinceIntelligence: null,
    disablelevelMinceMultiple: null,
    disablelevelMinceSpeech: null,
    disablelevelMinceVision: null,
    disablelevelMinceSpirit: null,
    disablelevelMinceHearing: null,
    areaProjectCode: null
  }
})
let healthInfo = ref<any>({})
let hospitalInfo = ref([])
let medicationInfo = ref([])
let familyInfo = ref([])
const contactList = ref<any>([])
const saturationLoading = ref(false)

// 获取基础信息
async function getBaseInfo() {
  const res = await getCustomerBaseDetailById(Number(query.id))
  if (res) {
    baseInfo.value = res.data
  }
}

// 更新饱和度
async function updateSaturation() {
  saturationLoading.value = true
  try {
    await updateSaturationStatistics(query.id)
    ElMessage.success('更新饱和度成功！')
    saturationLoading.value = false
  } catch (error) {
    saturationLoading.value = false
  }
}

async function getContactList() {
  const res = await getContactListById(Number(query.id))
  if (res) {
    contactList.value = res.data
  }
}

// 获取需求信息
async function getRequirementInfo() {
  const res = await getRequirementDetailById(Number(query.id))
  if (res) {
    if (isFieldsEmptyOrNull(res.data)) {
      visibleRequirementInfo.value = false
    }
    requirementInfo.value = res.data
  }
}

// 获取延伸信息
async function getExtendInfo() {
  const res = await getExtendDetailById(Number(query.id))
  if (res) {
    extendInfo.value = res.data
  }
}

// 获取健康信息
async function getHealthInfo() {
  const healthRes = await getHealthDetailById(Number(query.id))
  let visble = true
  if (healthRes.data) {
    if (isFieldsEmptyOrNull(healthRes.data)) {
      visble = false
    }
    healthInfo.value = healthRes.data
  }
  // 获取住院信息
  const hospitalRes = await getHospital({ customerId: Number(query.id), pageSize: 100 })
  if (hospitalRes) {
    if (isFieldsEmptyOrNull(hospitalRes.data.list)) {
      visble = false || visble
    }
    hospitalInfo.value = hospitalRes.data.list
  }
  // 获取用药信息
  const medicationRes = await getMedication({
    customerId: Number(query.id),
    pageSize: 100
  })
  if (medicationRes) {
    if (isFieldsEmptyOrNull(medicationRes.data.list)) {
      visble = false || visble
    }
    medicationInfo.value = medicationRes.data.list
  }
  visibleHealthInfo.value = visble
}

// 获取家庭信息
async function getFamilyInfo() {
  const res = await getFamilyDetail({ customerId: Number(query.id) })
  if (res) {
    if (isFieldsEmptyOrNull(res.data.list)) {
      visibleFamilyInfo.value = false
    }
    familyInfo.value = res.data.list
  }
}

const downloadFile = (file) => {
  const link = document.createElement('a')
  link.href = file.url
  link.setAttribute('download', file.originalName)
  link.setAttribute('target', '_blank')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
// 处理排序
function matchLabels(dict, numbers) {
  const labelArray = numbers.map((num, index) => {
    const matchingItem = dict.find((item) => item.value === num.toString())
    return matchingItem ? index + 1 + '.' + matchingItem.label : null
  })

  return labelArray.join('，')
}

// const ws = ref<WebSocket>()

// function initWebSocket() {
//   ws.value = new WebSocket('ws://114.55.43.140:9888')
//   ws.value.onopen = () => {
//     console.log('websocket onopen', ws.value?.readyState)
//   }
//   ws.value.onmessage = (event) => {
//     console.log(`receive message ${event.data}`)
//   }
//   ws.value.onclose = () => {
//     console.log('websocket onclose', ws.value?.readyState)
//   }
// }

async function getDetail() {
  getBaseInfo()
  getContactList()
  getRequirementInfo()
  getExtendInfo()
  getHealthInfo()
  getFamilyInfo()
  // initWebSocket()
}
onMounted(() => {
  // getDetail()
})
onActivated(() => {
  getDetail()
})
</script>

<style>
.el-tabs__nav-wrap:after {
  background: none;
}

.el-tabs__item.is-active {
  font-size: 16px;
}
.el-descriptions {
  margin-bottom: 15px;
}

.display-none {
  display: none;
}
</style>

<style scoped lang="less">
.info-container {
  padding: 0 40px;
  height: calc(100vh - 310px); /* 设置容器的高度 */
  overflow: auto; /* 当内容超出容器高度时显示滚动条 */
}
.info-container h2 {
  font-size: 16px;
  font-weight: 600;
  color: var(--main-text-color);
  margin-bottom: 20px;
}
.death-alert {
  cursor: pointer;
}

:deep(.el-sub-menu.is-active.is-opened .el-sub-menu__title) {
  color: var(--el-color-primary);
}
:deep(.el-sub-menu__title) {
  font-size: 16px;
}
:deep(.el-tabs__item.is-active),
:deep(.el-menu--inline .el-menu-item.is-active) {
  background: linear-gradient(270deg, rgba(255, 149, 0, 0.16) 0%, rgba(255, 149, 0, 0.02) 100%);
}
:deep(.el-menu-item.is-active) {
  background: linear-gradient(270deg, rgba(255, 149, 0, 0.16) 0%, rgba(255, 149, 0, 0.02) 100%);
}

:deep(.el-menu-item) {
  height: 44px !important;
  font-size: 16px;
}
:deep(.el-sub-menu .el-menu-item) {
  padding-left: 28px !important;
}
.file {
  color: var(--el-color-primary);
  cursor: pointer;
  margin-bottom: 5px;
}
.info-box {
  display: flex;
  flex-wrap: wrap;
}
.info-box:not(:empty) {
  margin-bottom: 20px;
}
.info-item {
  &.item-100 {
    width: 100% !important;
  }
  width: 50%;
  line-height: 23px;
  font-size: 14px;
  margin-bottom: 20px;
  display: flex;
  .item-label {
    text-align: left;
    // color: var(--el-text-color-regular);
    // width: 100px;
    margin-right: 5px;
    flex-shrink: 0;
    &::after {
      content: ' :';
    }
  }
  .item-content {
    width: calc(100% - 100px);
    padding-right: 40px;
  }
}
.service {
  width: 100px;
}
</style>
