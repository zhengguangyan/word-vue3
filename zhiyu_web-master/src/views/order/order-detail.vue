<template>
  <el-page-header @back="onBack" class="common-page-header">
    <template #content>
      <div class="title-name">
        订单详情：{{ orderInfo.memberName }}（{{ renderDict(orderInfo.statusCode, 'order_status') }}
        |
        <span :class="orderInfo.isClosed === '1' ? 'color-close' : 'color-unclose'">{{ orderInfo.isClosed === '1' ? '已结案' : '未结案' }}</span
        >）
      </div>
    </template>
    <template #extra>
      <div class="flex top-btn-box">
        <el-button>一键拨号</el-button>
        <el-button @click="showOrderDetailPrintPreviewDialog(orderInfo)">打印预览</el-button>
        <!-- <el-button @click="showOrderRefundFormDialog()" v-if="orderInfo.statusCode === '2'">申请退款</el-button> -->
        <!-- 平台和市平台的订单 且 订单状态为5：已接单 的时候需要 无法执行 按钮 -->
        <el-button @click="handleImpossibleExecute" v-if="orderInfo.statusCode === '5' && ['3', '4'].includes(orderInfo.source)">无法执行</el-button>
        <el-button @click="showOrderCancelFormDialog()" v-if="orderInfo.isClosed !== '1'">取消订单</el-button>
        <el-button @click="showOrderInvalidFormDialog()" v-if="orderInfo.isClosed === '1' && orderInfo.statusCode !== '12' && orderInfo.statusCode !== '11'">作废订单</el-button>
        <el-button @click="reorder" v-if="Number(orderInfo.statusCode) > 9 && orderInfo.source === '3'">再次下单</el-button>
      </div>
    </template>
  </el-page-header>
  <el-scrollbar height="calc(100vh - 195px)">
    <div class="detail-top-gray-info">
      <span class="mr-5">订单编号：{{ orderInfo.orderNo }}</span>
      <span class="mr-5" v-if="orderInfo.creatorName"> 创建：{{ orderInfo.creatorName }} {{ orderInfo.createTime }} </span>
      <span class="mr-5">来源：{{ renderDict(orderInfo.source, 'order_source') }}</span>
      <span class="mr-5" v-if="orderInfo.updaterName"> 最近更新：{{ orderInfo.updaterName }} {{ orderInfo.updateTime }} </span>
    </div>
    <h4 class="title r-m-b-16">订单状态</h4>
    <!-- 订单状态 -->
    <div class="flex flex-wrap">
      <div class="step" v-for="(item, index) in serveOrderStatusData" :key="item.name">
        <div class="flex">
          <div v-if="index !== 0 && item.act === '1'" class="bar"></div>
          <div v-if="index !== 0 && item.act === '0' && item.allowOperate" class="bar-2"></div>
          <div v-if="index !== 0 && item.act === '2'" class="bar bar-3"></div>
          <div v-if="index !== 0 && item.act === '0' && !item.allowOperate" class="bar bar-3"></div>

          <div class="relative flex pointer">
            <img v-if="item.act === '1'" src="@/assets/icon/icon_check1.png" />
            <img v-else-if="item.act === '2'" src="@/assets/icon/icon_check2.png" />
            <img v-else-if="item.act === '0' && item.allowOperate && leafAreaFlag" src="@/assets/icon/icon_single1.png" @click="showDispatchSelectWayDialog(item)" />
            <img v-else-if="(item.act === '0' && !item.allowOperate) || (item.act === '0' && item.allowOperate && !leafAreaFlag)" src="@/assets/icon/icon_single2.png" />
            <span v-if="item.act === '1' || (item.act === '0' && item.allowOperate)" class="r-font-14 r-m-l-2" @click="showDispatchSelectWayDialog(item)">
              {{ item.name }}
            </span>
            <span v-else class="r-font-14 color999 r-m-l-2">{{ item.name }}</span>
            <span class="step-time color999" v-if="item.operatTime">{{ formatDateString(item.operatTime) }}</span>
            <!-- orderType = 3所有倒计时全部隐藏  afterSaleOrder = 1 结案的倒计时隐藏-->
            <template v-else-if="item.previousOperatTime">
              <span class="step-time error-color" v-if="orderInfo.orderType !== '3'">
                <RemainingTime
                  v-if="item.code !== '10' || (item.code === '10' && orderInfo.afterSaleOrder !== '1')"
                  :time="item.previousOperatTime"
                  :status="item.name"
                  :id="item.id"
                  :code="item.code"
                  @finish-time="reload"
                />
              </span>
            </template>
          </div>
        </div>
      </div>
    </div>

    <h4 class="title r-m-t-20 r-m-b-16">联系人信息</h4>
    <div class="info-list">
      <div class="detail-info-item item-100">
        <span class="detail-info-item-label">下单会员</span>
        <span class="detail-info-item-content">
          <el-button link type="primary" @click="customerDetail(orderInfo.memberId)">
            {{ orderInfo.memberName }}
          </el-button>
        </span>
      </div>
      <div class="detail-info-item tem-100">
        <span class="detail-info-item-label">默认联系人信息</span>
        <span class="detail-info-item-content" v-if="!editLinkmanFlag">
          <span> {{ orderInfo.contactman }} {{ orderInfo.mobilephone }} {{ orderInfo.address }}</span>
          <!-- 只有 1已下单、2已支付、3派单中、4被退回、5已接单状态，支持修改联系人信息 -->
          <a v-if="orderInfo.isClosed !== '1' && ['1', '2', '3', '4', '5'].includes(orderInfo.statusCode)" href="javascript:;" @click="editLinkmanFlag = true" class="edit-contactman"
            >管理联系人信息</a
          >
        </span>
        <span class="detail-info-item-content" v-else>
          <el-select v-model="orderInfo.addressId" placeholder="请选择" @change="changeItem" style="width: 90%">
            <template v-for="item in linkmanList" :key="item.value">
              <div class="flex row-between hover-box">
                <el-option class="option-item" :label="item.contactman + ' ' + item.mobilephone + ' ' + item.address" :value="item.id">
                  <el-space>
                    <el-tag v-if="item.acquiescent" type="warning" class="default-tip">默认</el-tag>
                    <span>{{ item.contactman }}</span>
                    <span>{{ item.mobilephone }}</span>
                    <span>{{ item.address }}</span>
                  </el-space>
                </el-option>
                <el-space class="hover-item">
                  <el-button link type="primary" @click="selectAddress(item)">选择</el-button>
                  <el-button v-if="!item.acquiescent" link type="primary" @click="setDefaultButton(item)">设为默认</el-button>
                  <el-button link type="primary" @click="editAddress(item)">修改</el-button>
                  <el-popconfirm title="是否删除该数据？" @confirm="delAddress(item.id)" :width="180">
                    <template #reference>
                      <el-button link type="primary">删除</el-button>
                    </template>
                  </el-popconfirm>
                </el-space>
              </div>
            </template>

            <template #footer>
              <div class="flex row-center">
                <el-button link type="primary" :icon="Plus" @click="addAddress">新增地址</el-button>
              </div>
            </template>
          </el-select>
        </span>
      </div>
    </div>

    <!-- 支付方式为货到付款 服务包，订单状态为已取消 -->
    <template v-if="['1', '2'].includes(orderInfo.paytypeId) && orderInfo.statusCode === '11'">
      <h4 class="title r-m-t-20 r-m-b-16">其他费用信息</h4>
      <el-table class="r-p-b-20" :data="orderInfo.otherExpenseInfoArr">
        <el-table-column label="其他费用类型" prop="otherType">
          <template #default="{ row }">
            <div>{{ renderDict(row.otherType, 'other_type') }}</div>
          </template>
        </el-table-column>
        <el-table-column label="其他费用支付方式" prop="otherPayType">
          <template #default>
            <div v-if="['1', '2'].includes(orderInfo.otherPayType)">{{ payType(orderInfo.otherPayType) }}</div>
            <div v-else-if="orderInfo.otherPayType">
              <div>服务包</div>
              <!-- <div> {{ orderInfo.onlinePayName }}{{ orderInfo.onlinePayTime }}</div> -->
              <router-link :to="`/order/servePacketCustomerDetail?id=${orderInfo.otherPayType}`" class="primary-color underline">
                {{ orderInfo.otherPayTypeName }} {{ getYearMonth(orderInfo.cancelledTime) }}
              </router-link>
            </div>

            <!-- 货到付款 -->
            <!-- <span v-if="orderInfo.otherPayType === '2'">线下支付</span> -->
            <!-- 服务包 -->
            <!-- <template v-if="orderInfo.otherPayType === '1'">
              <div>{{ renderDict(orderInfo.otherPayType, 'order_pay_type') }}</div>
              <router-link :to="`/order/servePacketCustomerDetail?id=${orderInfo.payRemarkId}`" class="primary-color underline">
                {{ orderInfo.otherPayTypeName }} {{ orderInfo.cancelledTime }}
              </router-link>
            </template> -->
          </template>
        </el-table-column>
        <el-table-column label="其他费用金额" prop="otherCost"></el-table-column>
      </el-table>
    </template>

    <h4 class="title r-m-t-20 r-m-b-16">订单信息</h4>
    <div class="info-list">
      <div class="detail-info-item item-100 order-info-box">
        <div class="order-info-item">
          <div class="order-info-label border-bottom">订单信息</div>
          <table class="order-info-content">
            <tr>
              <th width="70">操作</th>
              <th width="20%">服务类别/项目/子项</th>
              <th width="20%">服务单价</th>
              <th width="10%">数量</th>
              <th width="10%">红包抵用</th>
              <th width="10%">优惠信息</th>
              <th>支付方式</th>
              <th>订单现价</th>
            </tr>
            <tr>
              <td>
                <!-- 已结案不可编辑，其他情况可以编辑 -->
                <el-button link type="primary" :disabled="orderInfo.isClosed === '1'" @click="showEditOrderInfoModal(orderInfo)"> 编辑 </el-button>
              </td>
              <td>
                {{ orderInfo.categoryName }}
                {{ orderInfo.serveName ? '/' + orderInfo.serveName : '' }}
                {{ orderInfo.serveOptionName ? '/' + orderInfo.serveOptionName : '' }}
              </td>
              <td>
                服务最低价：{{ orderInfo.minCountPrice }}
                <br />
                服务单价(中心价)：{{ orderInfo.centerPrice }}
              </td>
              <td>{{ orderInfo.serveCount }}</td>
              <td>0.0</td>
              <td>{{ orderInfo.discount }}</td>
              <td>
                <div>{{ renderDict(orderInfo.paytypeId, 'order_pay_type') }}</div>
                <router-link :to="`/order/servePacketCustomerDetail?id=${orderInfo.payRemarkId}`" v-if="orderInfo.paytypeId === '1'" class="primary-color underline">
                  {{ orderInfo.payRemarkName }} {{ getYearMonth(orderInfo.payOrderTime) }}
                </router-link>
              </td>
              <td>{{ orderInfo.money }}</td>
            </tr>
          </table>
        </div>
        <div class="order-info-item" v-if="Number(orderInfo.statusCode) >= 7">
          <div class="order-info-label border-bottom">超出下单信息</div>
          <table class="order-info-content">
            <tr>
              <th width="70">操作</th>
              <th width="40%">超出下单数量</th>
              <th width="30%">超出下单金额支付方式</th>
              <th>超出下单金额</th>
            </tr>
            <tr>
              <td>
                <div v-if="Number(orderInfo.statusCode) < 10">
                  <!-- 已结案不可操作，其他情况可以操作 -->
                  <el-button link type="primary" @click="openCancelExceed" v-if="orderInfo.onlinePay" :disabled="orderInfo.isClosed === '1'"> 撤销 </el-button>
                  <el-button link type="primary" @click="openAddExceed" v-else :disabled="orderInfo.isClosed === '1'"> 添加 </el-button>
                </div>
              </td>
              <td>{{ orderInfo.beyondOrderNumber }}</td>
              <td>
                <div v-if="['1', '2'].includes(orderInfo.onlinePay)">{{ payType(orderInfo.onlinePay) }}</div>
                <div v-else-if="orderInfo.onlinePay">
                  <div>服务包</div>
                  <!-- <div> {{ orderInfo.onlinePayName }}{{ orderInfo.onlinePayTime }}</div> -->
                  <router-link :to="`/order/servePacketCustomerDetail?id=${orderInfo.onlinePay}`" class="primary-color underline">
                    {{ orderInfo.onlinePayName }} {{ getYearMonth(orderInfo.onlinePayTime) }}
                  </router-link>
                </div>
              </td>
              <td>{{ orderInfo.payBeyondPrice }}</td>
            </tr>
          </table>
        </div>
        <div class="order-info-item">
          <div class="order-info-label">结算信息</div>
          <p class="order-info-footer">
            最终确定数量：<span>{{ orderInfo.finalNumber }}</span> 最终确定金额：<span> ￥{{ orderInfo.finalPrice }} </span> 平台收款：<span>￥{{ orderInfo.platformReceipts }}</span> 服务商收款：<span
              >￥{{ orderInfo.sellerReceipts }}</span
            >
          </p>
        </div>
      </div>
      <!-- <div class="detail-info-item">
        <span class="detail-info-item-label">是否有抽成</span>
        <span class="detail-info-item-content">
          {{ orderInfo.isHaveCommission ? '是' : '否' }}
        </span>
      </div>
      <div class="detail-info-item" v-if="orderInfo.isHaveCommission">
        <span class="detail-info-item-label">抽成金额</span>
        <span class="detail-info-item-content"> {{ orderInfo.commission }}元 </span>
      </div> -->
      <!-- 评价 -->
      <div class="info-list" v-if="Number(orderInfo.statusCode) > 8">
        <div class="detail-info-item item-100">
          <span class="detail-info-item-label">客户语音评价</span>
          <span class="detail-info-item-content"> {{ orderInfo.voiceUrl }} </span>
        </div>
        <div class="detail-info-item item-100 flex row-between">
          <div class="flex">
            <span class="detail-info-item-label">客户回访评价</span>
            <span class="detail-info-item-content flex">
              <div class="flex row-center">
                <span class="color333 r-m-r-10 text-nowrap">准时送达</span>
                <el-rate class="r-m-r-20" style="height: 23px" v-model="orderInfo.punctualArrive" disabled text-color="#ff9900" />
              </div>
              <div class="flex row-center">
                <span class="color333 r-m-r-10 text-nowrap">满意度</span>
                <el-rate class="r-m-r-20" style="height: 23px" v-model="orderInfo.satisfaction" disabled text-color="#ff9900" />
              </div>
              <div class="flex row-center">
                <span class="color333 r-m-r-10 text-nowrap">服务态度</span>
                <el-rate class="r-m-r-20" style="height: 23px" v-model="orderInfo.serveAttitude" disabled text-color="#ff9900" />
              </div>
              <div class="flex row-center">
                <span class="color333 r-m-r-10 text-nowrap">服务质量</span>
                <el-rate style="height: 23px" v-model="orderInfo.serveQuality" disabled text-color="#ff9900" />
              </div>
            </span>
          </div>
          <!-- 未结案的可以编辑 -->
          <el-button v-if="orderInfo.isClosed !== '1'" type="primary" @click="evaluationsEdit">编辑</el-button>
        </div>
        <!-- 已结案的小程序商城才有展示 -->
        <div class="detail-info-item item-100" v-if="orderInfo.sourse === '5' && orderInfo.isClosed === '1'">
          <span class="detail-info-item-label">客户在线评价</span>
          <span class="detail-info-item-content flex">
            <div class="flex row-center">
              <span class="color333 r-m-r-10">准时送达</span>
              <el-rate class="r-m-r-20" style="height: 23px" v-model="orderInfo.waiterPunctualArrive" disabled text-color="#ff9900" />
            </div>
            <div class="flex row-center">
              <span class="color333 r-m-r-10">满意度</span>
              <el-rate class="r-m-r-20" style="height: 23px" v-model="orderInfo.waiterSatisfaction" disabled text-color="#ff9900" />
            </div>
            <div class="flex row-center">
              <span class="color333 r-m-r-10">服务态度</span>
              <el-rate class="r-m-r-20" style="height: 23px" v-model="orderInfo.waiterServeAttitude" disabled text-color="#ff9900" />
            </div>
            <div class="flex row-center">
              <span class="color333 r-m-r-10">服务质量</span>
              <el-rate style="height: 23px" v-model="orderInfo.waiterServeQuality" disabled text-color="#ff9900" />
            </div>
          </span>
        </div>
        <div class="detail-info-item item-100">
          <span class="detail-info-item-label">评价内容</span>
          <span class="detail-info-item-content" v-if="orderInfo.content">
            {{ orderInfo.content }}
            <el-button link type="primary" @click="removeContentSubmit"> 删除评论 </el-button>
          </span>
        </div>
      </div>

      <div class="detail-info-item item-100">
        <span class="detail-info-item-label">备注一</span>
        <span class="detail-info-item-content"> {{ orderInfo.remark }} </span>
      </div>
      <div class="detail-info-item item-100">
        <span class="detail-info-item-label">备注二</span>
        <span class="detail-info-item-content"> {{ orderInfo.remark2 }} </span>
      </div>
      <div class="detail-info-item item-100" v-if="orderInfo.source === '5'">
        <span class="detail-info-item-label">小程序用户备注</span>
        <span class="detail-info-item-content"> {{ orderInfo.mallMarketRemark }} </span>
      </div>
      <div class="detail-info-item" v-if="orderInfo.source === '5'">
        <span class="detail-info-item-label">是否上门服务</span>
        <span class="detail-info-item-content">
          {{ renderDict(orderInfo.isProvideService, 'yes_no') }}
        </span>
      </div>
      <div class="detail-info-item item-33">
        <span class="detail-info-item-label">预约服务时间</span>
        <span class="detail-info-item-content"> {{ orderInfo.serveTime }} </span>
      </div>
      <div class="detail-info-item item-66">
        <span class="detail-info-item-label">订单性质</span>
        <span class="detail-info-item-content">
          {{ renderDict(orderInfo.orderNature, 'order_nature') }}
        </span>
      </div>
      <!-- <div class="detail-info-item" v-if="orderInfo.source !== '5'"></div> -->
      <div class="detail-info-item item-33">
        <span class="detail-info-item-label">上门回访时间</span>
        <span class="detail-info-item-content"> {{ orderInfo.shangmenTime }} </span>
      </div>
      <div class="detail-info-item item-66">
        <span class="detail-info-item-label">上门回访坐席</span>
        <span class="detail-info-item-content"> {{ orderInfo.shangmenUserName }} </span>
      </div>
      <div class="detail-info-item item-33">
        <span class="detail-info-item-label">满意度回访时间</span>
        <span class="detail-info-item-content"> {{ orderInfo.manyiduTime }} </span>
      </div>
      <div class="detail-info-item item-66">
        <span class="detail-info-item-label">满意度回访坐席</span>
        <span class="detail-info-item-content"> {{ orderInfo.manyiduUserName }} </span>
      </div>

      <div class="detail-info-item item-33">
        <span class="detail-info-item-label">服务工单号</span>
        <span class="detail-info-item-content flex">
          <span>{{ orderInfo.serveNo }}</span>
          <el-button class="r-m-l-8" v-if="orderInfo.isClosed === '1'" link type="primary" @click="editServeNo">编辑</el-button>
        </span>
      </div>
      <div class="detail-info-item item-33">
        <span class="detail-info-item-label">是否代替单</span>
        <span class="detail-info-item-content">
          {{ renderDict(orderInfo.replaceOrder, 'yes_no') }}
        </span>
      </div>
      <div class="detail-info-item item-33">
        <span class="detail-info-item-label">是否售后单</span>
        <span class="detail-info-item-content">
          {{ renderDict(orderInfo.afterSaleOrder, 'yes_no') }}
        </span>
      </div>
      <div class="detail-info-item item-33">
        <span class="detail-info-item-label">是否需要发票</span>
        <span class="detail-info-item-content">
          {{ renderDict(orderInfo.offerInvoice, 'yes_no') }}
        </span>
      </div>
      <!-- 新增的发票抬头 -->
      <div class="detail-info-item item-33" v-if="renderDict(orderInfo.offerInvoice, 'yes_no') === '是'">
        <span class="detail-info-item-label">发票抬头</span>
        <span class="detail-info-item-content">
          <span>（{{ renderDict(orderInfo.invoiceType, 'invoice_type') }} ）</span>
          <span>{{ orderInfo.invoiceHead }}</span>
        </span>
      </div>

      <div class="detail-info-item item-33">
        <span class="detail-info-item-label">订单类型</span>
        <span class="detail-info-item-content">
          {{ renderDict(orderInfo.orderType, 'order_replacement') }}
        </span>
      </div>
      <div class="detail-info-item item-33">
        <span class="detail-info-item-label">是否结案</span>
        <span class="detail-info-item-content">
          {{ orderInfo.isClosed === '1' ? '是' : '否' }}
        </span>
      </div>
      <div class="detail-info-item item-33">
        <span class="detail-info-item-label">推送状态</span>
        <span class="detail-info-item-content"> {{ orderInfo.pushStatus }} </span>
      </div>
      <div class="detail-info-item item-66">
        <span class="detail-info-item-label">通话录音</span>
        <span class="detail-info-item-content">
          <span>{{ orderInfo.agentRecordLogCallId }}</span>
          <el-button class="r-m-l-10" link type="primary" v-if="orderInfo.agentRecordLogCallId" @click="handlePlayRecord">点击播放</el-button>
          <el-button link type="primary" @click="handleAssociate">{{ orderInfo.agentRecordLogCallId ? '修改关联' : '添加关联' }}</el-button>
        </span>
      </div>

      <div class="detail-info-item item-33">
        <span class="detail-info-item-label">派单方式</span>
        <span class="detail-info-item-content">
          {{ renderDict(orderInfo.dispatchType, 'dispatchType') }}
        </span>
      </div>

      <div class="detail-info-item item-33">
        <span class="detail-info-item-label">服务商</span>
        <span class="detail-info-item-content"> {{ orderInfo.sellerName }} </span>
      </div>

      <div class="detail-info-item item-33">
        <span class="detail-info-item-label">服务商结账方式</span>
        <span class="detail-info-item-content"> {{ renderDict(orderInfo.sellerCheckoutMode, 'checkout_mode') }} </span>
      </div>
    </div>

    <!-- 下完单('1':已下单) 服务信息模块数据就要展示  orderInfo.finishOrderTime-->
    <h4 class="title" style="margin: 20px 0 16px; font-weight: 600" v-if="orderInfo.statusCode >= 1"> 服务信息 </h4>
    <div class="info-list">
      <div class="detail-info-item item-100">
        <span class="detail-info-item-label">服务人员</span>
        <span class="detail-info-item-content">{{ orderInfo.operatorSellerName }}</span>
      </div>
      <div class="detail-info-item item-33">
        <span class="detail-info-item-label">开始时间</span>
        <span class="detail-info-item-content"> {{ orderInfo.startOrderServiceTime }} </span>
      </div>
      <div class="detail-info-item item-66">
        <span class="detail-info-item-label">开始地址</span>
        <span class="detail-info-item-content">
          <el-button link type="primary" @click="showServiceStartMap">
            {{ orderInfo.startOrderAddress || '未获取到位置信息' }}
          </el-button>
        </span>
      </div>
      <div class="detail-info-item item-33">
        <span class="detail-info-item-label">完成时间</span>
        <span class="detail-info-item-content"> {{ orderInfo.finishOrderTime }} </span>
      </div>
      <div class="detail-info-item item-66">
        <span class="detail-info-item-label">结束地址</span>
        <span class="detail-info-item-content">
          <el-button link type="primary" @click="showServiceFinishMap">
            {{ orderInfo.finshOrderAddress || '未获取到位置信息' }}
          </el-button>
        </span>
      </div>
      <div class="detail-info-item item-33">
        <span class="detail-info-item-label">服务用时</span>
        <span class="detail-info-item-content"> {{ orderInfo.serviceDurationTime }} </span>
      </div>
      <div class="detail-info-item item-66">
        <span class="detail-info-item-label">实收金额</span>
        <span class="detail-info-item-content" v-if="orderInfo.realyAcceptMoney">￥{{ orderInfo.realyAcceptMoney }} 元</span>
      </div>
      <div class="detail-info-item item-100">
        <span class="detail-info-item-label">服务前记录</span>
        <span class="detail-info-item-content"> {{ orderInfo.startServeRemark }} </span>
      </div>
      <div class="detail-info-item item-100">
        <span class="detail-info-item-label">服务前照片</span>
        <span class="detail-info-item-content">
          <el-space v-if="orderInfo.startServePhotos">
            <el-image
              v-for="(item, index) in startServePhotos"
              :key="item"
              style="width: 100px; height: 100px"
              :src="startServePhotos[index]"
              :zoom-rate="1.2"
              :max-scale="7"
              :min-scale="0.2"
              :preview-src-list="startServePhotos"
              :initial-index="index"
              fit="contain"
            />
          </el-space>
          <el-button link type="primary" @click="openUploadImg('前')" v-else> 上传照片 </el-button>
        </span>
      </div>
      <div class="detail-info-item item-100">
        <span class="detail-info-item-label">服务后记录</span>
        <span class="detail-info-item-content"> {{ orderInfo.finishServeRemark }} </span>
      </div>
      <div class="detail-info-item item-100">
        <span class="detail-info-item-label">服务后照片</span>
        <span class="detail-info-item-content">
          <el-space v-if="orderInfo.finishServePhotos">
            <el-image
              v-for="(item, index) in finishServePhotos"
              :key="item"
              style="width: 100px; height: 100px"
              :src="finishServePhotos[index]"
              :zoom-rate="1.2"
              :max-scale="7"
              :min-scale="0.2"
              :preview-src-list="finishServePhotos"
              :initial-index="index"
              fit="contain"
            />
          </el-space>
          <el-button link type="primary" @click="openUploadImg('后')" v-else> 上传照片 </el-button>
        </span>
      </div>
      <div class="detail-info-item item-100">
        <span class="detail-info-item-label">客服指令</span>
        <span class="detail-info-item-content"> {{ orderInfo.serveCommand }} </span>
      </div>
    </div>

    <h4 class="title" style="margin: 20px 0px 16px 0; font-weight: 600">
      跟踪信息
      <el-button :icon="Plus" plain class="title-extra-btn" type="primary" @click="showAddCallRecordModal()"> 增加跟踪信息 </el-button>
    </h4>
    <el-table
      :data="servePacketRecordData"
      header-row-class-name="table-header"
      :style="{
        // width: '275px',
        border: '1px solid #f5f3f0',
        borderRadius: '4px'
      }"
      max-height="200"
    >
      <el-table-column type="index" width="60" />
      <el-table-column label="操作" width="110">
        <template #default="{ row }">
          <el-button link type="primary" size="small" @click="showAddCallRecordModal(row)"> 修改 </el-button>
          <el-popconfirm width="160" title="是否删除该记录？" @confirm="deleteCallRecord(row.id)">
            <template #reference>
              <el-button link type="primary" size="small"> 删除 </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="time" min-width="170" label="时间" />
      <el-table-column show-overflow-tooltip prop="callMode" min-width="100" label="方式">
        <template #default="{ row }">
          {{ row.callMode === '1' ? '呼入' : '呼出' }}
        </template>
      </el-table-column>
      <el-table-column prop="callRecordComment" width="100" label="订单状态"></el-table-column>
      <el-table-column prop="detailContent" min-width="200" label="详细内容" show-overflow-tooltip />
      <el-table-column show-overflow-tooltip prop="startTime" min-width="350" label="受理起止时间">
        <template #default="{ row }">
          <span v-if="row.startTime">{{ row.startTime + ' 至 ' + row.endTime }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="talkMinute" min-width="170" label="通话时长（分钟）">
        <template #default="{ row }">
          <span v-if="row.startTime">{{ calculateTimeDifference(row.startTime, row.endTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="userName" min-width="160" label="客服" />
    </el-table>
  </el-scrollbar>
  <CallRecordFormDialog ref="callRecordFormDialogRef" @reload-list="getServePacketRecordList" />
  <OrderInfoFormDialog ref="orderInfoFormDialogRef" @reload-list="reload" />
  <!-- 选择派单方式 -->
  <DispatchSelectWayDialog ref="dispatchSelectWayDialogRef" @reload-list="reload" />
  <OrderDetailPrintPreviewDialog ref="orderDetailPrintPreviewDialogRef" :dict="dictMap" @reload-list="reload" />
  <OrderInvalidFormDialog ref="orderInvalidFormDialogRef" @reload-list="reload" />
  <OrderCancelFormDialog ref="orderCancelFormDialogRef" @reload-list="reload" />
  <OrderRefundFormDialog ref="orderRefundFormDialogRef" @reload-list="reload" />
  <OrderWindUpFormDialog ref="orderWindUpFormDialogRef" @reload-list="reload" />
  <!-- 评价流程操作 -->
  <OrderAssessFormDialog ref="orderAssessFormDialogRef" @reload-list="reload" />
  <!-- 服务开始操作弹窗 -->
  <OrderServeStartFormDialog ref="orderServeStartFormDialogRef" @reload-list="reload" />
  <OrderServeFinishFormDialog ref="orderServeFinishFormDialogRef" @reload-list="reload" />
  <OrderCancelExceedFormDialog ref="orderCancelExceedFormDialogRef" @reload-list="reload" />
  <OrderAddExceedFormDialog ref="orderAddExceedFormDialogRef" @reload-list="reload" />
  <OrderUploadImgFormDialog ref="uploadImgFormDialogRef" @reload-list="reload" />
  <!-- 播放录音操作弹窗 -->
  <PlayRecordDialog ref="playRecordDialogRef" :requestFun="saveRecord" @reload-data="reload" />
  <!-- 录音关联操作弹窗 -->
  <AssociateCallRecordDialog ref="associateCallRecordRef" :requestFun="saveRecord" @reload-data="reload" />
  <!-- 修改服务工单号操作弹窗 -->
  <EditServeNoDialog ref="editServeNoDialogRef" @reload-list="reload" />
  <!-- 已接单 操作 -->
  <ReceivedOrderDialog ref="receivedOrderRef" @reload-list="reload"></ReceivedOrderDialog>
  <OrderAddress ref="orderAddressRef" @reload-list="reload" :memberid="orderInfo.memberId" :orderStatus="orderInfo.statusCode" />
  <ServiceMapDialog ref="serviceMapDialogRef" />
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  drawbackStatus,
  getOrderDetail,
  serveOrderStatusList,
  removeContentApi,
  getMemberAddressList,
  updateAddressOrder,
  updateMemberAddress,
  removeMemberAddress,
  saveRecord,
  notExecute
} from '@/api/order'
// 跟踪编辑
import CallRecordFormDialog from './components/call-record-form-dialog/index.vue'
// 订单编辑
import OrderInfoFormDialog from './components/order-info-form-dialog/index.vue'
// 选择派单
import DispatchSelectWayDialog from './components/dispatch-way-select-dialog/index.vue'
import OrderDetailPrintPreviewDialog from './components/order-detail-print-preview-dialog/index.vue'
import OrderInvalidFormDialog from './components/order-invalid-form-dialog/index.vue'
import OrderCancelFormDialog from './components/order-cancel-form-dialog/index.vue'
import OrderRefundFormDialog from './components/order-refund-form-dialog/index.vue'
import OrderWindUpFormDialog from './components/order-wind-up-form-dialog/index.vue'
import OrderAssessFormDialog from './components/order-assess-form-dialog/index.vue'
import OrderServeStartFormDialog from './components/order-serve-start-form-dialog/index.vue'
import OrderServeFinishFormDialog from './components/order-serve-finish-form-dialog/index.vue'
import OrderCancelExceedFormDialog from './components/order-cancel-exceed-form-dialog/index.vue'
import OrderAddExceedFormDialog from './components/order-add-exceed-form-dialog/index.vue'
import OrderUploadImgFormDialog from './components/order-upload-img-form-dialog/index.vue'

import ServiceMapDialog from '@/views/serviceStaffAPP/components/service-map-dialog/index.vue'

import PlayRecordDialog from '@/components/PlayRecordDialog.vue'
import AssociateCallRecordDialog from '@/components/AssociateCallRecordDialog.vue'

import EditServeNoDialog from './components/edit-serve-no-dialog.vue'
import ReceivedOrderDialog from './components/received-order-dialog.vue'

import RemainingTime from '@/components/RemainingTime/index.vue'
import { formatDateString, calculateTimeDifference } from '@/utils'
import { ElMessage, ElMessageBox } from 'element-plus'
import { computed } from 'vue'
import { deleteRecord, getRecordPage } from '@/api/worksheet'
import OrderAddress from '../service/components/order-address-form.vue'
import { Plus } from '@element-plus/icons-vue'
import { useCache } from '@/hooks/web/useCache'
import { dictMap, filterDict, renderDict } from '@/hooks/web/useDict'
// import { getAuth } from '@/utils/export'
// import DictSelect from '@/components/DictSelect/index.vue'
// import { computed } from 'vue'

// @ts-ignore
defineOptions({
  // eslint-disable-next-line vue/component-definition-name-casing
  name: 'OrderDetail'
})
const { wsCache } = useCache()
const leafAreaFlag = ref(wsCache.get('leafAreaFlag'))
const { back, push } = useRouter()
const route = useRoute()

function onBack() {
  back()
}

const reorder = () => {
  push({
    path: `/service/add`,
    query: {
      serviceType: 'order',
      id: orderInfo.value.memberId,
      phone: orderInfo.value.memberMobilephone
    }
  })
  localStorage.setItem('orderData', JSON.stringify(orderInfo.value))
}

const customerDetail = (id) => {
  push(`/customer/detail?id=${id}`)
}
// 获取年月
const getYearMonth = (time) => {
  const date = new Date(time)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  return `${year}-${month < 10 ? '0' + month : month}`
}

// 跟踪信息
const callRecordFormDialogRef = ref()
function showAddCallRecordModal(row?) {
  callRecordFormDialogRef.value.show(orderInfo.value, row)
}

// 删除跟踪信息
async function deleteCallRecord(ids) {
  const res: any = await deleteRecord(ids)
  if (res.code === 200) {
    ElMessage.success('操作成功')
    getServePacketRecordList()
  }
}

// 编辑订单信息
const orderInfoFormDialogRef = ref()
function showEditOrderInfoModal(data) {
  orderInfoFormDialogRef.value.show(data)
}

// 未结案的订单都可以编辑
const evaluationsEdit = () => {
  const formParams = {
    detailEdit: true,
    serveorderId: orderInfo.value.id,
    serveQuality: orderInfo.value.serveQuality,
    serveAttitude: orderInfo.value.serveAttitude,
    satisfaction: orderInfo.value.satisfaction,
    punctualArrive: orderInfo.value.punctualArrive,
    content: orderInfo.value.content
  }
  orderAssessFormDialogRef.value.show(formParams, {})
}

// 派单
const dispatchSelectWayDialogRef = ref()
// 已接单
const receivedOrderRef = ref()
// 服务开始
const orderServeStartFormDialogRef = ref()
// 服务开始
const orderServeFinishFormDialogRef = ref()
// 评价
const orderAssessFormDialogRef = ref()
// 结案
const orderWindUpFormDialogRef = ref()

const showDispatchSelectWayDialog = (item) => {
  if (!item.allowOperate) {
    return
  }
  if (item.code === '3' || item.code === '4') {
    dispatchSelectWayDialogRef.value.show(orderInfo.value, item)
  }
  if (item.code === '5') {
    receivedOrderRef.value.show(item, orderInfo.value)

    // ElMessageBox.prompt('是否确认帮助服务人员“接单”？', '提示', {
    //   inputErrorMessage: 'Invalid Email'
    // })
    //   .then(() => {
    //     changeStaff(item.id)
    //   })
    //   .catch(() => {})
  }
  if (item.code === '6') {
    orderServeStartFormDialogRef.value.show(item, orderInfo.value.serveTime)
  }
  if (item.code === '7') {
    orderServeFinishFormDialogRef.value.show(item, orderInfo.value)
  }
  if (item.code === '8') {
    receivedOrderRef.value.show(item, orderInfo.value)
    // ElMessageBox.confirm('是否确认修改状态？', '服务确认')
    //   .then(() => {
    //     changeStaff(item.id)
    //   })
    //   .catch(() => {})
  }
  if (item.code === '9') {
    orderAssessFormDialogRef.value.show(item, orderInfo.value)
  }
  if (item.code === '10') {
    orderWindUpFormDialogRef.value.show(item)
  }
  if (item.code === '14') {
    ElMessageBox.confirm('确认退款后，订单将自动结案，请确认是否退款？', '确认退款')
      .then(() => {
        drawback(item.id)
      })
      .catch(() => {})
  }
}

const removeContentSubmit = () => {
  ElMessageBox.confirm('删除后该数据将不可恢复，是否确认删除此评价内容？', '删除提示')
    .then(() => {
      removeContent()
    })
    .catch(() => {})
}

// 平台接单
const removeContent = async () => {
  const res: any = await removeContentApi(orderInfo.value.id)
  if (res.code == 200) {
    ElMessage.success('删除成功')
    reload()
  } else {
    ElMessage.error(res.msg)
  }
}

// 平台接单
// const changeStaff = async (id) => {
//   const res: any = await setServeorderstatus({ id })
//   if (res.code == 200) {
//     ElMessage.success('操作成功')
//     reload()
//   } else {
//     ElMessage.error(res.msg)
//   }
// }

// 平台接单
const drawback = async (id) => {
  const res: any = await drawbackStatus({ serveorderId: id, statusCode: '15' })
  if (res.code == 200) {
    ElMessage.success('操作成功')
    reload()
  } else {
    ElMessage.error(res.msg)
  }
}

// 点击无法执行 按钮
const handleImpossibleExecute = () => {
  ElMessageBox.confirm('是否确认服务人员无法执行改订单？确认后，订单将变为“被退回”状态，请重新派单。', '提醒-无法执行')
    .then(async () => {
      const res: any = await notExecute({ id: orderInfo.value.id })
      if (res.code == 200) {
        ElMessage.success('操作成功')
        reload()
      } else {
        ElMessage.error(res.msg)
      }
    })
    .catch(() => {})
}

// 取消订单
const orderCancelFormDialogRef = ref()
const showOrderCancelFormDialog = () => {
  orderCancelFormDialogRef.value.show(orderInfo.value, filterDict('other_type'))
}

// 作废订单
const orderInvalidFormDialogRef = ref()
const showOrderInvalidFormDialog = () => {
  orderInvalidFormDialogRef.value.show(orderInfo.value)
}

// 申请退款
// const orderRefundFormDialogRef = ref()
// const showOrderRefundFormDialog = () => {
//   orderRefundFormDialogRef.value.show(orderInfo.value)
// }

// 打印预览
const orderDetailPrintPreviewDialogRef = ref()
const showOrderDetailPrintPreviewDialog = (data) => {
  orderDetailPrintPreviewDialogRef.value.show(data)
}

// const multipleDict = (key: any, dict: any) => {
//   if (!key.length && !key) {
//     return
//   }
//   return filterDict(dict)
//     ?.filter((item: any) => key.includes(item.value))
//     .map((item: any) => item?.label)
//     .join('，')
// }

const orderInfo = ref<any>({})
const getDetail = async () => {
  const res = await getOrderDetail(route.query.id)
  res.data.otherExpenseInfoArr = [
    {
      otherType: res.data.otherType,
      otherPayType: res.data.otherPayType,
      otherCost: res.data.otherCost
    }
  ]
  orderInfo.value = res.data
  getServePacketRecordList()
  getAddressList()
}

const servePacketRecordData = ref([])
const getServePacketRecordList = async () => {
  const res = await getRecordPage({
    pageNum: 1,
    pageSize: 100,
    customerId: orderInfo.value.memberId,
    infoId: route.query.id
  })
  servePacketRecordData.value = res.data.list
}

const serveOrderStatusData = ref<any>([])
const getServeOrderStatusList = async () => {
  const res = await serveOrderStatusList({
    serveorderId: route.query.id,
    display: '1'
  })
  serveOrderStatusData.value = res.data
}

// 联系人
const linkmanList = ref<any>([])
async function getAddressList() {
  const { data } = await getMemberAddressList({ memberid: orderInfo.value.memberId })
  linkmanList.value = data
  // if (data && data.length && !orderInfo.value.addressId) {
  //   orderInfo.value.addressId = data[0].id
  // }
}
const editLinkmanFlag = ref(false)

const changeItem = (id) => {
  let item = linkmanList.value.find((i) => i.id == id)
  selectAddress(item)
}

async function selectAddress(item) {
  orderInfo.value.addressId = item.id
  orderInfo.value.contactman = item.contactman
  orderInfo.value.address = item.address
  orderInfo.value.mobilephone = item.mobilephone
  try {
    await updateAddressOrder(orderInfo.value)
    editLinkmanFlag.value = false
    reload()
  } catch (e) {
    editLinkmanFlag.value = false
    reload()
  }
}
const orderAddressRef = ref()
const addAddress = () => {
  orderAddressRef.value.show()
}

const editAddress = (data) => {
  orderAddressRef.value.show(data)
}

const setDefaultButton = (form) => {
  ElMessageBox.confirm('确认设置为默认地址？')
    .then(() => {
      setDefault(form)
    })
    .catch(() => {})
}
// 设为默认
const setDefault = async (form) => {
  const res: any = await updateMemberAddress({
    ...form,
    acquiescent: true,
    addressList: [form.province, form.city, form.county, form.street, form.community]
  })
  if (res.code === 200) {
    ElMessage.success('设置成功')
    getAddressList()
  }
}

// 删除联系人
async function delAddress(ids) {
  const res: any = await removeMemberAddress(ids)
  if (res.code === 200) {
    ElMessage.success('删除成功')
    getAddressList()
  }
}

// 支付方式
const payType = (key) => {
  if (key == '1') {
    return '支付给服务商'
  }
  if (key == '2') {
    return '线下支付'
  }
}

// 撤销超出
const orderCancelExceedFormDialogRef = ref()

const openCancelExceed = () => {
  orderCancelExceedFormDialogRef.value.show(orderInfo.value)
}

// 添加超出
const orderAddExceedFormDialogRef = ref()

const openAddExceed = () => {
  orderAddExceedFormDialogRef.value.show(orderInfo.value)
}

// 上传照片
const uploadImgFormDialogRef = ref()

const openUploadImg = (t) => {
  uploadImgFormDialogRef.value.show(orderInfo.value, t)
}

const startServePhotos = computed(() => {
  if (orderInfo.value.startServePhotosList.length) {
    return orderInfo.value.startServePhotosList.map((item) => item.url)
  }
  return []
})

const finishServePhotos = computed(() => {
  if (orderInfo.value.finishServePhotosList.length) {
    return orderInfo.value.finishServePhotosList.map((item) => item.url)
  }
  return []
})

// 播放录用操作
const playRecordDialogRef = ref()
const handlePlayRecord = () => {
  playRecordDialogRef.value.show(orderInfo.value)
}

// 录音关联操作
const associateCallRecordRef = ref()
const handleAssociate = () => {
  associateCallRecordRef.value.show(orderInfo.value)
}

// 修改服务工单号
const editServeNoDialogRef = ref()
const editServeNo = () => {
  editServeNoDialogRef.value.show(orderInfo.value)
}

const serviceMapDialogRef = ref()
const showServiceStartMap = () => {
  const info = {
    lng: orderInfo.value.startLongitude,
    lat: orderInfo.value.startLatitude,
    address: orderInfo.value.startOrderAddress
  }
  serviceMapDialogRef.value.show('开始服务地址', info)
}

const showServiceFinishMap = () => {
  const info = {
    lng: orderInfo.value.finishLongitude,
    lat: orderInfo.value.finishLatitude,
    address: orderInfo.value.finishOrderAddress
  }
  serviceMapDialogRef.value.show('结束服务地址', info)
}

const reload = () => {
  getDetail()
  getServeOrderStatusList()
}

onMounted(() => {
  reload()
})
</script>
<style scoped lang="less">
.common-page-header {
  position: relative;
  .top-btn-box {
    position: absolute;
    right: 0;
    bottom: 12px;
  }
}
.inline-form-item {
  display: inline-flex;
  vertical-align: middle;
  margin-right: 32px;
}
.title {
  display: flex;

  align-items: center;
  position: relative;
}
.title-name {
  font-weight: 700;
  white-space: nowrap;
}
.title .customer-edit {
  position: absolute;
  right: 0;
}

.edit-contactman {
  color: #ff9500;
  text-decoration: underline;
  margin-left: 8px;
}
.numberInput {
  width: 100%;
}
.tips {
  margin: 10px 0;
  font-size: 12px;
  color: #999;
}
.tips p {
  margin: 3px 0;
}
.button-box {
  margin-top: 10px;
}
:deep(.el-input-number .el-input__inner) {
  text-align: left;
}
:deep(.el-checkbox:last-of-type) {
  margin-right: 30px;
}
.subsidy-add-out {
  width: calc(100vw - 300px);
  padding: 0 15px 15px 0;
}
.subsidy-add-main {
  height: calc(100vh - 250px); /* 设置容器的高度 */
  min-width: 950px; /* 设置容器的高度 */
  overflow: auto; /* 当内容超出容器高度时显示滚动条 */
}
.ruleSpan {
  margin-right: 10px;
}

.customer-title {
  color: #666462;
  font-size: 14px;
  font-weight: 400;
}
:deep(.el-step__main) {
  position: absolute;
  top: 0;
  left: 24px;
  background: #fff;
  padding: 0 10px;
  min-width: 50px;
  cursor: pointer;
  .el-step__title.is-success {
    color: var(--main-text-color);
    font-weight: 500;
  }
  .el-step__description {
    position: absolute;
    left: -24px;
    top: 30px;
    margin-top: 0;
    color: #999693;
    line-height: 18px;
    width: 200px;
  }
}
:deep(.el-step__title) {
  line-height: 25px !important;
}
:deep(.el-step__line) {
  background-color: #e0dedc !important;
}
:deep(.el-step__head.is-success) {
  border-color: #5cd7a8 !important;
  .el-step__icon.is-text {
    background: #5cd7a8;
    color: #fff;
  }
}
:deep(.el-step__head.is-process) {
  border-color: #ff9500;
  color: #fff;
}
:deep(.el-step__head.is-wait) {
  color: #fff;
}
:deep(.el-step.is-horizontal .el-step__line) {
  right: 10px;
}

.title .title-extra-btn {
  position: absolute;
  right: 0;
}
.bar {
  width: 64px;
  height: 2px;
  background: #5cd7a8;
  border-radius: 1px;
  margin: 0 8px;
}
.bar-2 {
  width: 64px;
  height: 2px;
  margin: 0 8px;
  background-image: linear-gradient(to right, #ff9500 0%, #ff9500 50%, transparent 0%);
  background-size: 14px 2px;
  background-repeat: repeat-x;
}
.bar-3 {
  background-color: #e0dedc;
}
.step {
  margin-bottom: 30px;
}
.step-time {
  position: absolute;
  margin: auto;
  left: 0;
  right: 0;
  bottom: -23px;
  font-size: 12px;
  text-align: center;
  white-space: nowrap;
}
.order-info-box {
  // border: 1px solid #f5f3f0;
  border-radius: 4px;
  overflow: hidden;
  flex-wrap: wrap;
}
.order-info-item {
  width: 100%;
}
.order-info-label {
  width: 124px;
  height: 100%;
  background: #f5f3f0;
  font-size: 14px;
  font-weight: bold;
  color: var(--main-text-color);
  display: flex;
  align-items: center;
  justify-content: center;
  float: left;
}
.border-bottom {
  border-bottom: 1px solid #fff;
}
.order-info-content {
  float: right;
  width: calc(100% - 124px);
}
.order-info-content tr th {
  height: 48px;
  border-left: 1px solid #f5f3f0;
  border-bottom: 1px solid #f5f3f0;
  background: #faf9f7;
  padding: 0 20px;
  text-align: left;
  &:last-child {
    border-right: 1px solid #f5f3f0;
  }
}
.order-info-content tr td {
  padding: 20px;
  border-left: 1px solid #f5f3f0;
  &:last-child {
    border-right: 1px solid #f5f3f0;
  }
}
.order-info-footer {
  float: right;
  width: calc(100% - 124px);
  padding: 15px 20px;
  background: #faf9f7;
  border: 1px solid #f5f3f0;
  font-weight: 400;
  color: var(--main-text-color);
  border-bottom-right-radius: 4px;
  overflow: hidden;
}
.order-info-footer span {
  font-size: 18px;
  color: #e96848;
  margin-right: 24px;
  font-weight: bold;
}
.default-tip {
  font-weight: normal;
  color: #ff9500;
}
.option-item {
  width: 100%;
}
.hover-box {
  &:hover {
    background-color: #f6f7fb;
  }
}
.hover-item {
  padding: 0 32px 0 20px;
}

:deep(.el-select-dropdown__item.is-hovering + .hover-item) {
  display: flex;
  background-color: #f6f7fb;
  height: 34px;
}
:deep(.el-popper.el-select__popper) {
  max-width: 100% !important;
}
</style>
