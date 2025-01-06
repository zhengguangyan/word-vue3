<!-- eslint-disable vue/html-self-closing -->
<template>
  <div id="navbar" class="navbar navbar-default zhixing" style="background-color: #233249">
    <!--*****获取座席列表的ApiURL*****固定值-->
    <!--
					<input type="hidden" name="apiurl" value="ws://114.55.43.140:9888" id="apiurl">
					-->
    <input type="hidden" name="apiurl" value="ws://192.168.20.105:9888" id="apiurl" />
    <!--*****CTI服务地址 *****固定值-->
    <!--
					<input type="hidden" name="wsurl" value="ws://114.55.43.140:9877" id="wsurl">
					-->
    <input type="hidden" name="wsurl" value="ws://192.168.20.105:9877" id="wsurl" />

    <!-- 分机号  *****根据系统对应填写*****-->
    <input type="hidden" name="agentdn" id="agentdn" value="1001" />
    <!-- 座席工号 *****根据系统对应填写*****-->
    <input type="hidden" name="agentid" value="1001" id="agentid" />
    <!-- 序列号 -->
    <input type="hidden" value="1" name="sk_node_id" id="sk_node_id" />
    <input type="hidden" value="19" name="skseq" id="skseq" />
    <!-- 通道号 -->
    <input type="hidden" value="2" name="ch" id="ch" />
    <!-- 呼出标记(sip 电话外呼cti 随路数据问题) -->
    <input type="hidden" value="0" id="outtab" />
    <!-- ----呼入对应值---- -->
    <!--ALERTINGDN:--><input type="hidden" value="" name="alertingdn" id="alertingdn" />
    <!-- CALLID -->
    <input type="hidden" value="" name="callid" id="callid" />
    <!--CALLER:--><input type="hidden" value="" name="callerdn" id="callerdn" />
    <!--CALLED:--><input type="hidden" value="" name="calleddn" id="calleddn" />
    <!--SKILL:--><input type="hidden" value="" name="skill" id="skill" />
    <input type="hidden" value="1" id="sysid" />
    <input type="hidden" value="" id="_skill" />
    <!-- AssociateData -->
    <input type="hidden" value="10010" id="iAssociateDataKey" />
    <!-- calltaskid;logid;taskid;sysid -->
    <input type="hidden" value="" id="pAssociateDataVal" />
    <!-- ---------------------------(sip)start------------------------------- -->
    <!-- 是否使用 webrtc -->

    <input type="hidden" value="0" id="use_sip" />
    <!-- 分机注册地址 
						 <input type="hidden" value="sip:1002@192.168.99.226:5090" id="sip_uri">-->
    <!-- 分机注册密码 
						 <input type="hidden" value="123456" id="sip_password">-->
    <!-- webrtc 的websocket 地址/infook/FS426/conf/sip_profiles/internal.xml   <param name="ws-binding"  value=":5066"/> 
						 <input type="hidden" value="ws://192.168.99.226:5066" id="ws_uri">
						 <div style="width: 424px; height: 324px;background-color: #333333; border: 2px solid blue; padding:0px; margin-top: 4px; display:none;">
							<video id="remoteVideo" width="420px" height="320px" autoplay=""></video>
						 </div>
						 <div style="width: 424px; height: 324px;background-color: #333333; border: 2px solid blue; padding:0px; margin-top: 4px;  display:none;">
								<video id="localVideo" width="420px" height="320px" autoplay=""></video>
						 </div>-->
    <!-- ---------------------------(sip)end------------------------------->
    <ul class="nav nav-list">
      <li class="hover" id="login" style="display: none"
        ><a class="a-login" onclick="login()">
          <i class="menu-icon fa login"></i> <span class="menu-text"> 签入 </span>
        </a>
      </li>

      <li class="hover" id="logout" style="display: none"
        ><a class="a-logout" onclick="logout()">
          <i class="menu-icon fa logout"></i> <span class="menu-text"> 签出 </span>
        </a>
      </li>

      <li class="hover" id="set_read" style="display: none"
        ><a class="a-set_read" onclick="setread()">
          <i class="menu-icon fa set_read"></i> <span class="menu-text">工作</span>
        </a>
      </li>
      <li class="hover" id="set_busy" style="display: none"
        ><a class="a-set_busy" onclick="setbusy()">
          <i class="menu-icon fa set_busy"></i> <span class="menu-text">休息</span>
        </a>
      </li>

      <!-- <li class="hover" id="makecall" style="display: none">
        <a class="a-makecall" onclick="dialOut()">
          <i class="menu-icon fa makecall"></i>
          <span class="menu-text">外拨</span>
        </a>
      </li> -->

      <li class="hover" id="hangup" style="display: none"
        ><a class="a-hangup" onclick="ctihangup()">
          <i class="menu-icon fa hangup"></i> <span class="menu-text">挂机</span>
        </a>
      </li>

      <li class="hover" id="hold" style="display: none"
        ><a class="a-hold" onclick="hold()">
          <i class="menu-icon fa hold"></i> <span class="menu-text">保持</span>
        </a>
      </li>
      <li class="hover" id="retrieve" style="display: none"
        ><a class="a-retrieve" onclick="retrieve()">
          <i class="menu-icon fa retrieve"></i> <span class="menu-text">恢复</span>
        </a>
      </li>

      <li class="hover" id="answed" style="display: none"
        ><a class="a-answed" onclick="answed()">
          <i class="menu-icon fa answed"></i> <span class="menu-text">应答</span>
        </a>
      </li>

      <li class="hover" id="after_bu" style="display: none"
        ><a class="a-after_bu" onclick="after_bu()">
          <i class="menu-icon after_bu"></i> <span class="menu-text">调查</span>
        </a>
      </li>
      <li class="hover" id="consult" style="display: none"
        ><a class="a-consult" onclick="getAgentInfo('');">
          <i class="menu-icon fa consult"></i> <span class="menu-text">咨询</span>
        </a>
      </li>
      <li class="hover" id="trunfer" style="display: none"
        ><a class="a-trunfer" onclick="trunferGetObject();">
          <i class="menu-icon fa trunfer"></i> <span class="menu-text">转移</span>
        </a>
      </li>

      <li class="hover" id="conferen" style="display: none"
        ><a class="a-conferen" onclick="conferen();">
          <i class="menu-icon fa conferen"></i> <span class="menu-text">会议</span>
        </a>
      </li>

      <li class="hover" id="reconnect" style="display: none"
        ><a class="a-reconnect" onclick="reconnect();">
          <i class="menu-icon fa reconnect"></i> <span class="menu-text">接回</span>
        </a>
      </li>

      <li class="hover" id="afterread" style="display: none"
        ><a class="a-afterread" onclick="afterread()">
          <i class="menu-icon fa afterread"></i> <span class="menu-text">事后忙</span>
        </a>
      </li>
      <li class="hover" id="afterbusy" style="display: none"
        ><a class="a-afterbusy" onclick="afterbusy()" style="background-color: #2b497f">
          <i class="menu-icon fa afterbusy"></i> <span class="menu-text">事后忙</span>
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="less">
.zhixing {
  display: none;
  position: fixed;
  margin: auto;
  top: 0;
  left: 0;
  right: 0;
  width: 700px;
}
</style>
