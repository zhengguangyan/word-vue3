String.prototype.trim = function () {
  return this.replace(/(^\s*)|(\s*$)/g, '')
}
String.prototype.ltrim = function () {
  return this.replace(/(^\s*)/g, '')
}
String.prototype.rtrim = function () {
  return this.replace(/(\s*$)/g, '')
}

function formatSeconds(value) {
  var theTime = parseInt(value)
  var theTime1 = 0
  var theTime2 = 0
  if (theTime > 60) {
    theTime1 = parseInt(theTime / 60)
    theTime = parseInt(theTime % 60)
    if (theTime1 > 60) {
      theTime2 = parseInt(theTime1 / 60)
      theTime1 = parseInt(theTime1 % 60)
    }
  }
  var result = '' + parseInt(theTime) + '秒'
  if (theTime1 > 0) {
    result = '' + parseInt(theTime1) + '分' + result
  }
  if (theTime2 > 0) {
    result = '' + parseInt(theTime2) + '小时' + result
  }
  return result
}

var isChrome = window.navigator.userAgent.indexOf('Chrome') !== -1

function getAgentInfo(skill) {
  zx(skill)
}

function reflesh() {
  ws = null
  startServer()
}
var c = 0
var t
var s
var table = null
function timedCount() {
  lastsecs = c
  $('#lab2').html(lastsecs)
  c = c + 1
  t = setTimeout('timedCount()', 1000)
}
var ary = []
var skillsStrs = []
function ParseXml(xmlStr) {
  this.szRecvXml = xmlStr.trim()
  this.GiveupHeadString = function () {
    try {
      var iHead = -1
      var iTail = -1

      iHead = xmlStr.indexOf('<')
      iTail = xmlStr.indexOf('>')
      if (iHead == -1 || iTail == -1) return ''
      if (iHead + 1 >= iTail) return xmlStr.substring(iTail + 1)

      var m_Tmp = xmlStr.substring(iHead + 1, iTail).trim()

      if (m_Tmp.charAt(0) == '?' || m_Tmp.charAt(m_Tmp.length() - 1) == '?') {
        return xmlStr.substring(iTail + 1)
      }
      return xmlStr
    } catch (exception) {
      alert(exception)
      return ''
    }
  }
  this.GetCommand = function (giveupheasstr, xmlCmd, szName) {
    try {
      var iHead = -1
      var iTail = -1

      iHead = giveupheasstr.indexOf('<' + xmlCmd)
      iTail = giveupheasstr.indexOf('>', iHead)

      if (iHead == -1 || iTail == -1) return ''

      var m_cmd = giveupheasstr.substring(iHead, iTail + 1)

      iTail = m_cmd.indexOf(szName)
      if (iTail == -1) return ''

      iHead = m_cmd.indexOf('"', iTail)
      if (iHead == -1) return ''

      iTail = m_cmd.indexOf('"', iHead + 1)
      if (iTail == -1) return ''

      if (iHead + 1 >= iTail) return ''

      return m_cmd.substring(iHead + 1, iTail)
    } catch (exception) {
      alert(exception)
      return ''
    }
  }

  this.GetValue = function (szTempXml, psName) {
    try {
      var szTempXmlLowerCase = szTempXml.toLowerCase()
      var szNameLowerCase = psName.trim().toLowerCase()

      var iHead = szTempXmlLowerCase.indexOf('<' + szNameLowerCase + '>')
      var iTail = szTempXmlLowerCase.indexOf('</' + szNameLowerCase + '>')
      if (iTail > iHead && iHead >= 0) {
        var leng = ('<' + szNameLowerCase + '>').length
        return szTempXml.substring(iHead + leng, iTail).trim()
      } else return ''
    } catch (exception) {
      alert(exception)
      return ''
    }
  }
}
function pageHead() {
  return '\2'
}
function pageLast() {
  return '\3'
}
function xmlHead() {
  return '<?xml version="1.0" encoding="utf-8" ?>'
}
function assignPage() {
  return '<COMMAND name="LOGIN"  type="ROUTEMSG"><SOURCE_TYPE>9999</SOURCE_TYPE><SOURCE_SEQUENCE>0</SOURCE_SEQUENCE></COMMAND>'
}
function pageBody(seq, msgbody) {
  return (
    '<COMMAND name="SUBMIT"  type="IVR">' +
    '<SOURCE_NODE>1</SOURCE_NODE>' +
    '<SOURCE_TYPE>9999</SOURCE_TYPE>' +
    '<SOURCE_SEQUENCE>' +
    seq +
    '</SOURCE_SEQUENCE>' +
    '<TARGET_NODE>1</TARGET_NODE>' +
    '<TARGET_TYPE>1</TARGET_TYPE>' +
    '<TARGET_SEQUENCE>1</TARGET_SEQUENCE>' +
    '<MESSAGE>' +
    msgbody +
    '</MESSAGE>' +
    '</COMMAND>'
  )
}
function utilsPage(seq, msg) {
  return pageHead() + xmlHead() + pageBody(seq, msg) + pageLast()
}
function ctiAssignPage(agentdn) {
  return (
    '<COMMAND name="ASSIGN"  type="IVR">' +
    '<AGENT_DN>' +
    agentdn +
    '</AGENT_DN>' +
    '<DN_TYPE>1</DN_TYPE>' +
    '</COMMAND>'
  )
}
function agentLoginPage(agentid, agentname, agentpwd, agentskill, ctiver) {
  return (
    '<COMMAND name="AGENT_LOGIN"  type="IVR">' +
    '<AGENT_ID>' +
    agentid +
    '</AGENT_ID>' +
    '<AGENT_NAME>' +
    agentname +
    '</AGENT_NAME>' +
    '<AGENT_PWD>' +
    agentpwd +
    '</AGENT_PWD>' +
    '<AGENT_SKILL>' +
    agentskill +
    '</AGENT_SKILL>' +
    '<OTHER_MSG>' +
    ctiver +
    '</OTHER_MSG>' +
    '</COMMAND>'
  )
}
function agetnLogoutPage() {
  return '<COMMAND name="AGENT_LOG_OUT"  type="IVR">' + '</COMMAND>'
}
function agentSetStatuPage(agentch, status, statustype) {
  return (
    '<COMMAND name="AGENT_SET_STATU"  type="IVR">' +
    '<AGENT_CH>' +
    agentch +
    '</AGENT_CH>' +
    '<STATUS>' +
    status +
    '</STATUS>' +
    '<STATUS_TYPE>' +
    statustype +
    '</STATUS_TYPE>' +
    '</COMMAND>'
  )
}
function queryStatuPage(agentch) {
  return (
    '<COMMAND name="QUERY_QUEUE"  type="IVR">' +
    '<AGENT_CH>' +
    agentch +
    '</AGENT_CH>' +
    '</COMMAND>'
  )
}
function agentSetAfterStatu(ch, status) {
  return (
    '<COMMAND name="AGENT_SET_AFTER_STATU" type="IVR">' +
    '<AGENT_CH>' +
    ch +
    '</AGENT_CH><STATUS>' +
    status +
    '</STATUS>' +
    '</COMMAND>'
  )
}
function callMakeCall(ch, caller, called, dkey, dval) {
  return (
    '<COMMAND name="CALLMAKECALL" type="IVR">' +
    '<AGENT_CH>' +
    ch +
    '</AGENT_CH>' +
    '<CALLERDN>' +
    caller +
    '</CALLERDN>' +
    '<CALLEDDN>' +
    called +
    '</CALLEDDN>' +
    '<ASSOCIATE_DATA_KEY>' +
    dkey +
    '</ASSOCIATE_DATA_KEY>' +
    '<ASSOCIATE_DATA_VAL>' +
    dval +
    '</ASSOCIATE_DATA_VAL>' +
    '</COMMAND>'
  )
}
function callRelease(ch) {
  return (
    '<COMMAND name="CALLRELEASE"  type="IVR">' + '<AGENT_CH>' + ch + '</AGENT_CH>' + '</COMMAND>'
  )
}
function callHold(ch) {
  return '<COMMAND name="CALLHOLD"  type="IVR"><AGENT_CH>' + ch + '</AGENT_CH></COMMAND>'
}
function callRetrieve(ch) {
  return '<COMMAND name="CALLRETRIEVE"  type="IVR"><AGENT_CH>' + ch + '</AGENT_CH></COMMAND>'
}
function callAnswer(ch) {
  return '<COMMAND name="CALLANSWER"  type="IVR"><AGENT_CH>' + ch + '</AGENT_CH></COMMAND>'
}
function request_Service(ch, skill, level) {
  return (
    '<COMMAND name="Request_Service" type="IVR">' +
    '<AGENT_CH>' +
    ch +
    '</AGENT_CH>' +
    '<SKILL>' +
    skill +
    '</SKILL>' +
    '<LEVEL>' +
    level +
    '</LEVEL>' +
    '</COMMAND>'
  )
}
function trunfer(ch, srcAgentId, targetType, trSkill) {
  return (
    '<COMMAND name="SEND_SYSMSG" type="IVR">' +
    '<AGENT_CH>' +
    ch +
    '</AGENT_CH>' +
    '<SRCAGENTID>' +
    srcAgentId +
    '</SRCAGENTID>' +
    '<TARGETTYPE>' +
    targetType +
    '</TARGETTYPE>' +
    '<TARGET></TARGET>' +
    '<MSG>123*#*,0,' +
    trSkill +
    ',</MSG>' +
    '</COMMAND>'
  )
}
function callTransfer(ch) {
  return (
    '<COMMAND name="CALLTRANSFER" type="IVR">' + '<AGENT_CH>' + ch + '</AGENT_CH>' + '</COMMAND>'
  )
}
function trunferGetSkill(ch) {
  return '<COMMAND name="QUERY_QUEUE_LIST"  type="IVR"><AGENT_CH>' + ch + '</AGENT_CH></COMMAND>'
}
function callConference(ch) {
  return '<COMMAND name="CALLCONFERENCE"  type="IVR"><AGENT_CH>' + ch + '</AGENT_CH></COMMAND>'
}
function callConsultation(ch, caller, called, datakey, dataval) {
  return (
    '<COMMAND name="CALLCONSULTATION"  type="IVR">' +
    '<AGENT_CH>' +
    ch +
    '</AGENT_CH>' +
    '<CALLERDN>' +
    caller +
    '</CALLERDN>' +
    '<CALLEDDN>' +
    called +
    '</CALLEDDN>' +
    '<ASSOCIATE_DATA_KEY>' +
    datakey +
    '</ASSOCIATE_DATA_KEY>' +
    '<ASSOCIATE_DATA_VAL>' +
    dataval +
    '</ASSOCIATE_DATA_VAL>' +
    '</COMMAND>'
  )
}
function getAgentsBySkill(ch, skill) {
  return (
    '<COMMAND name="QUERY_QUEUE_MEMBER_LIST"  type="IVR">' +
    '<AGENT_CH>' +
    ch +
    '</AGENT_CH>' +
    '<QUEUENAME>' +
    skill +
    '</QUEUENAME>' +
    '</COMMAND>'
  )
}
function qiangCha(ch, pCallerDN, pCalledDN, iAssociateDataKey, pAssociateDataVal) {
  return (
    '<COMMAND name="CALLMAKECALL"  type="IVR">' +
    '<AGENT_CH>' +
    ch +
    '</AGENT_CH>' +
    '<CALLERDN>' +
    pCallerDN +
    '</CALLERDN>' +
    '<CALLEDDN>' +
    pCalledDN +
    '</CALLEDDN>' +
    '<ASSOCIATE_DATA_KEY>' +
    iAssociateDataKey +
    '</ASSOCIATE_DATA_KEY>' +
    '<ASSOCIATE_DATA_VAL>' +
    pAssociateDataVal +
    '</ASSOCIATE_DATA_VAL>' +
    '</COMMAND>'
  )
}
function jianTin(ch, pCallerDN, pCalledDN, iAssociateDataKey, pAssociateDataVal) {
  return (
    '<COMMAND name="CALLMAKECALL"  type="IVR">' +
    '<AGENT_CH>' +
    ch +
    '</AGENT_CH>' +
    '<CALLERDN>' +
    pCallerDN +
    '</CALLERDN>' +
    '<CALLEDDN>' +
    pCalledDN +
    '</CALLEDDN>' +
    '<ASSOCIATE_DATA_KEY>' +
    iAssociateDataKey +
    '</ASSOCIATE_DATA_KEY>' +
    '<ASSOCIATE_DATA_VAL>' +
    pAssociateDataVal +
    '</ASSOCIATE_DATA_VAL>' +
    '</COMMAND>'
  )
}
function setASSOCIATE_DATA(ch, iAssociateDataKey, pAssociateDataVal) {
  return
  '<COMMAND name="SET_ASSOCIATE_DATA"  type="IVR">' +
    '<AGENT_CH>' +
    ch +
    '</AGENT_CH>' +
    '<KEY>' +
    iAssociateDataKey +
    '</KEY>' +
    '<VALUE>' +
    pAssociateDataVal +
    '</VALUE>' +
    '</COMMAND>'
}
function resPage() {
  return '\2\6\3'
}
function ackPage() {
  return '\2\5\3'
}

function callReconnect(ch) {
  return '<COMMAND name="CALLRECONNECT"  type="IVR"><AGENT_CH>' + ch + '</AGENT_CH></COMMAND>'
}

if (typeof eMAS == 'undefined') {
  var eMAS = {
    masUnAssign: -1,
    masAssigned: 0,
    masLogout: 1,
    masLogin: 2,
    masNotReady: 3,
    masReady: 4,
    masAfterCall: 31,
    masAlerting: 5,
    masTalking: 6,
    masHolding: 7,
    masHeld: 30,
    masHangup: 8,
    masMakecallFirst: 9,
    masMakecallSecond: 10,
    masConsultfirst: 11,
    masConsultSecond: 12,
    masConsultThree: 13,
    masConsultFour: 16,
    masTransfed: 14,
    masTransfailed: 15,
    masConferAdded: 19,
    masConferBeAdded: 20,
    masConferPart2: 21,
    masConferfailed: 22
  }
}

if (typeof eAS == 'undefined') {
  var eAS = {
    AS_NULL: 0,
    AS_LOG_OUT: 1,
    AS_LOG_IN: 2,
    AS_NO_READY: 3,
    AS_READY: 4,
    AS_WORKING_AFTER_CALL: 5,
    AS_BUSY: 6
  }
}

var m_HaveAssign = 0
var m_HaveLogin = 0
var m_ForceIned = 0
var m_AgentCh = 0
var m_RingCount = 0
var m_AgentStatus = eAS.AS_NULL
var m_MyAgentStatus = eMAS.masUnAssign
var m_TalkTimeLong = 0
var m_TalkTimeLong2 = 0
var m_interval = 0
var m_Talking = 0
var m_STATUS_TYPE = 0
function WriteLog(msg) {}

function GetLoginResult(iValue) {
  switch (parseInt(iValue, 10)) {
    case 1:
      return '此工号已经登录'
    case 2:
      return '电话未申请(占用)'
    case 3:
      return 'sip分机未注册，请重启SIP话机'
    case 4:
      return '工号验证异常'
    case 5:
      return '工号或密码不对'
    case 6:
      return '技能组不对'
    case 7:
      return '软电话版本不对，请更新软电话'
    default:
      return '未知原因'
  }
}

function ShowWindow(BtnId, bBool) {
  if (bBool == true) {
    /*if(isChrome)
		{
			$("#"+BtnId).css("display","inline").css({"filter":"grayscale(0%)","-webkit-filter":"grayscale(0%)","-moz-filter":"grayscale(0%)","-ms-filter":"grayscale(0%)","-o-filter":"grayscale(0%)","filter:progid":"DXImageTransform.Microsoft.BasicImage(grayscale=0)","-webkit-filter":"grayscale(0)"});
		}
		else*/
    {
      $('#' + BtnId).css('display', 'inline')
    }
  } else {
    /*if(isChrome)
		{
			$("#"+BtnId).css("display","none").css({"filter":"grayscale(100%)","-webkit-filter":"grayscale(100%)","-moz-filter":"grayscale(100%)","-ms-filter":"grayscale(100%)","-o-filter":"grayscale(100%)","filter:progid":"DXImageTransform.Microsoft.BasicImage(grayscale=1)","-webkit-filter":"grayscale(1)"});
		}
		else*/
    {
      $('#' + BtnId).css('display', 'none')
    }
  }
}

function EnableWindow(BtnId, bBool) {
  if (bBool == true) {
    /*if(isChrome)
		{
			$("#"+BtnId).css("display","inline").css({"filter":"grayscale(0%)","-webkit-filter":"grayscale(0%)","-moz-filter":"grayscale(0%)","-ms-filter":"grayscale(0%)","-o-filter":"grayscale(0%)","filter:progid":"DXImageTransform.Microsoft.BasicImage(grayscale=0)","-webkit-filter":"grayscale(0)"});
			$("#"+BtnId).attr("disabled",false);
		}
		else*/
    {
      $('.' + BtnId).css({
        background: 'url(./src/assets/callPanelPlugin/files/' + BtnId + '.png)',
        width: '20px',
        height: '20px',
        'background-size': '100%'
      })
      $('.a-' + BtnId)
        .attr('disabled', false)
        .css('pointer-events', 'auto')
    }
  } else {
    /*if(isChrome)
		{
			$("#"+BtnId).css({"filter":"grayscale(100%)","-webkit-filter":"grayscale(100%)","-moz-filter":"grayscale(100%)","-ms-filter":"grayscale(100%)","-o-filter":"grayscale(100%)","filter:progid":"DXImageTransform.Microsoft.BasicImage(grayscale=1)","-webkit-filter":"grayscale(1)"});
			$("#"+BtnId).attr("disabled",true);
		}
		else*/
    {
      $('.' + BtnId).css({
        background: 'url(./src/assets/callPanelPlugin/files/' + BtnId + '2.png)',
        width: '20px',
        height: '20px',
        'background-size': '100%'
      })
      $('.a-' + BtnId)
        .attr('disabled', true)
        .css('pointer-events', 'none')
    }
  }
}
function EnableSelect(BtnId, bBool) {
  if (bBool == true) {
    document.getElementById(BtnId).disabled = ''
    document.getElementById('__status').style.backgroundImage =
      'url(./src/assets/callPanelPlugin/files/set_read.png)'
  } else {
    document.getElementById(BtnId).disabled = 'disabled'
    document.getElementById('__status').style.backgroundImage =
      'url(./src/assets/callPanelPlugin/files/set_read2.png)'
  }
}
function setSelectVal(BtnId, Val) {
  document.getElementById(BtnId).value = Val
}
function ResetChannel() {
  m_ForceIned = 0
}

function SetButtonView(pLocal) {
  if (
    m_HaveLogin == 0 &&
    m_MyAgentStatus != eMAS.masUnAssign &&
    m_MyAgentStatus != eMAS.masAssigned &&
    m_MyAgentStatus != eMAS.masLogout
  ) {
    WriteLog(
      'SetButtonView in[' +
        pLocal +
        ']not doing m_HaveLogin=' +
        m_HaveLogin +
        ' m_MyAgentStatus=' +
        m_MyAgentStatus
    )
    return 0
  }

  //	document.getElementById("content").innerHTML +=  (pLocal +" --"+ m_MyAgentStatus);
  console.log('方法 SetButtonView 以前content的打印信息 开始=====')
  console.log(pLocal + ' --' + m_MyAgentStatus)
  console.log('方法 SetButtonView 以前content的打印信息 结束=====')

  EnableWindow('login', false)
  EnableWindow('logout', false)
  EnableWindow('set_busy', false)
  EnableWindow('set_read', false)
  EnableWindow('answed', false)
  EnableWindow('hangup', false)
  //EnableWindow("makecall",false);
  EnableWindow('hold', false)
  EnableWindow('retrieve', false)
  EnableWindow('reconnect', false)
  ShowWindow('reconnect', false)
  ShowWindow('consult', true)
  EnableWindow('trunfer', false)
  EnableWindow('conferen', false)
  EnableWindow('consult', false)
  EnableWindow('pickup', false)
  EnableWindow('after_bu', false)
  EnableSelect('sta', true)
  EnableWindow('monitor', true)
  switch (m_MyAgentStatus) {
    case eMAS.masUnAssign:
      WriteLog(
        'SetButtonView in[' +
          pLocal +
          '][masUnAssign] m_HaveLogin=' +
          m_HaveLogin +
          ' m_MyAgentStatus=' +
          m_MyAgentStatus
      )
      EnableWindow('afterbusy', false)
      EnableWindow('afterread', false)
      break

    case eMAS.masAssigned:
      WriteLog(
        'SetButtonView in[' +
          pLocal +
          '][未签入] m_HaveLogin=' +
          m_HaveLogin +
          ' m_MyAgentStatus=' +
          m_MyAgentStatus
      )
      $('#lab3').html('未签入')
      ShowWindow('logout', false)
      ShowWindow('login', true)
      EnableSelect('sta', false)
      EnableWindow('login', true)
      EnableWindow('afterbusy', false)
      EnableWindow('afterread', false)
      EnableWindow('monitor', false)
      break
    case eMAS.masLogout:
      WriteLog(
        'SetButtonView in[' +
          pLocal +
          '][未签入] m_HaveLogin=' +
          m_HaveLogin +
          ' m_MyAgentStatus=' +
          m_MyAgentStatus
      )
      $('#lab3').html('未签入')
      ShowWindow('logout', false)
      ShowWindow('login', true)
      EnableSelect('sta', false)
      EnableWindow('login', true)
      EnableWindow('afterbusy', false)
      EnableWindow('afterread', false)
      EnableWindow('monitor', false)
      break

    case eMAS.masLogin:
      break

    case eMAS.masNotReady:
      WriteLog(
        'SetButtonView in[' +
          pLocal +
          '][休息中] m_HaveLogin=' +
          m_HaveLogin +
          ' m_MyAgentStatus=' +
          m_MyAgentStatus
      )
      $('#lab3').html('休息中')
      ShowWindow('login', false)
      ShowWindow('logout', true)
      EnableWindow('logout', true)
      //ShowWindow("makecall",true);
      //EnableWindow("makecall",true);
      ShowWindow('set_busy', false)
      ShowWindow('set_read', true)
      EnableWindow('set_read', true)
      if (m_RingCount > 0) {
        EnableWindow('pickup', true)
      }
      ResetChannel()
      break

    case eMAS.masReady:
      WriteLog(
        'SetButtonView in[' +
          pLocal +
          '][工作中] m_HaveLogin=' +
          m_HaveLogin +
          ' m_MyAgentStatus=' +
          m_MyAgentStatus
      )
      $('#lab3').html('工作中')
      EnableWindow('logout', false)
      ShowWindow('set_read', false)
      ShowWindow('set_busy', true)
      EnableWindow('set_busy', true)
      setSelectVal('sta', '4,0')
      if (m_RingCount > 0) {
        EnableWindow('pickup', true)
      }
      ResetChannel()
      break

    case eMAS.masAfterCall:
      WriteLog(
        'SetButtonView in[' +
          pLocal +
          '][事后整理] m_HaveLogin=' +
          m_HaveLogin +
          ' m_MyAgentStatus=' +
          m_MyAgentStatus
      )
      $('#lab3').html('事后整理')
      EnableWindow('logout', false)
      ShowWindow('set_busy', false)
      ShowWindow('set_read', true)
      EnableWindow('set_read', true)
      $('#outtab').val('0')
      ResetChannel()
      break

    case eMAS.masAlerting:
      WriteLog(
        'SetButtonView in[' +
          pLocal +
          '][来电] m_HaveLogin=' +
          m_HaveLogin +
          ' m_MyAgentStatus=' +
          m_MyAgentStatus
      )
      $('#lab3').html('来电')
      playRing()
      EnableWindow('answed', true)
      EnableSelect('sta', false)
      var autoAns = $('#autoAns').val()
      if (autoAns == '1' || $('#outtab').val() == '1') {
        answed()
      }
      break

    case eMAS.masTalking:
      WriteLog(
        'SetButtonView in[' +
          pLocal +
          '][通话中] m_HaveLogin=' +
          m_HaveLogin +
          ' m_MyAgentStatus=' +
          m_MyAgentStatus
      )
      $('#lab3').html('通话中')
      EnableWindow('hangup', true)
      ShowWindow('retrieve', false)
      ShowWindow('hold', true)
      EnableWindow('hold', true)
      ShowWindow('reconnect', false)
      ShowWindow('consult', true)
      EnableWindow('consult', true)
      EnableWindow('after_bu', true)
      ShowWindow('trunfer', true)
      EnableWindow('trunfer', true)
      EnableSelect('sta', false)
      break

    case eMAS.masHolding:
      WriteLog(
        'SetButtonView in[' +
          pLocal +
          '][保持中] m_HaveLogin=' +
          m_HaveLogin +
          ' m_MyAgentStatus=' +
          m_MyAgentStatus
      )
      $('#lab3').html('保持中')
      ShowWindow('hold', false)
      ShowWindow('retrieve', true)
      EnableWindow('retrieve', true)
      EnableSelect('sta', false)
      break

    case eMAS.masHeld:
      WriteLog(
        'SetButtonView in[' +
          pLocal +
          '][被保持] m_HaveLogin=' +
          m_HaveLogin +
          ' m_MyAgentStatus=' +
          m_MyAgentStatus
      )
      $('#lab3').html('被保持')
      EnableWindow('hangup', true)
      EnableSelect('sta', false)
      break

    case eMAS.masMakecallFirst:
      WriteLog(
        'SetButtonView in[' +
          pLocal +
          '][呼出中] m_HaveLogin=' +
          m_HaveLogin +
          ' m_MyAgentStatus=' +
          m_MyAgentStatus
      )
      $('#lab3').html('呼出中')
      EnableSelect('sta', false)
      break

    case eMAS.masMakecallSecond:
      WriteLog(
        'SetButtonView in[' +
          pLocal +
          '][呼出中] m_HaveLogin=' +
          m_HaveLogin +
          ' m_MyAgentStatus=' +
          m_MyAgentStatus
      )
      $('#lab3').html('呼出中')
      EnableWindow('hangup', true)
      EnableSelect('sta', false)
      break

    case eMAS.masConsultfirst:
      WriteLog(
        'SetButtonView in[' +
          pLocal +
          '][咨询中] m_HaveLogin=' +
          m_HaveLogin +
          ' m_MyAgentStatus=' +
          m_MyAgentStatus
      )
      $('#lab3').html('咨询中')
      EnableSelect('sta', false)
      break

    case eMAS.masConsultSecond:
      WriteLog(
        'SetButtonView in[' +
          pLocal +
          '][咨询中] m_HaveLogin=' +
          m_HaveLogin +
          ' m_MyAgentStatus=' +
          m_MyAgentStatus
      )
      $('#lab3').html('咨询中')
      ShowWindow('consult', false)
      ShowWindow('reconnect', true)
      EnableWindow('reconnect', true)
      EnableSelect('sta', false)
      break

    case eMAS.masConsultThree:
      WriteLog(
        'SetButtonView in[' +
          pLocal +
          '][咨询中] m_HaveLogin=' +
          m_HaveLogin +
          ' m_MyAgentStatus=' +
          m_MyAgentStatus
      )
      $('#lab3').html('咨询中')
      ShowWindow('consult', false)
      ShowWindow('reconnect', true)
      EnableWindow('reconnect', true)
      ShowWindow('trunfer', true)
      EnableWindow('trunfer', true)
      EnableSelect('sta', false)
      break

    case eMAS.masConsultFour:
      WriteLog(
        'SetButtonView in[' +
          pLocal +
          '][咨询中] m_HaveLogin=' +
          m_HaveLogin +
          ' m_MyAgentStatus=' +
          m_MyAgentStatus
      )
      $('#lab3').html('咨询中')
      ShowWindow('consult', false)
      ShowWindow('reconnect', true)
      EnableWindow('reconnect', true)
      EnableWindow('conferen', true)
      EnableWindow('trunfer', true)
      EnableSelect('sta', false)
      break

    case eMAS.masTransfed:
      WriteLog(
        'SetButtonView in[' +
          pLocal +
          '][转移完成] m_HaveLogin=' +
          m_HaveLogin +
          ' m_MyAgentStatus=' +
          m_MyAgentStatus
      )
      $('#lab3').html('转移完成')
      EnableSelect('sta', false)
      break

    case eMAS.masTransfailed:
      WriteLog(
        'SetButtonView in[' +
          pLocal +
          '][转移失败] m_HaveLogin=' +
          m_HaveLogin +
          ' m_MyAgentStatus=' +
          m_MyAgentStatus
      )
      $('#lab3').html('转移失败')
      ShowWindow('consult', false)
      ShowWindow('reconnect', true)
      EnableWindow('reconnect', true)
      EnableSelect('sta', false)
      break

    case eMAS.masConferAdded:
    case eMAS.masConferBeAdded:
    case eMAS.masConferPart2:
      WriteLog(
        'SetButtonView in[' +
          pLocal +
          '][强插中/监听中/会议中] m_HaveLogin=' +
          m_HaveLogin +
          ' m_MyAgentStatus=' +
          m_MyAgentStatus
      )
      $('#lab3').html('会议中')
      EnableWindow('hangup', true)
      EnableSelect('sta', false)
      break

    case eMAS.masConferfailed:
      WriteLog(
        'SetButtonView in[' +
          pLocal +
          '][会议失败] m_HaveLogin=' +
          m_HaveLogin +
          ' m_MyAgentStatus=' +
          m_MyAgentStatus
      )
      $('#lab3').html('会议失败')
      ShowWindow('consult', false)
      ShowWindow('reconnect', true)
      EnableWindow('reconnect', true)
      EnableSelect('sta', false)
      break

    default:
      break
  }
  return 0
}

function OnCtiLinkClose() {
  m_HaveAssign = 0
  m_HaveLogin = 0
  m_MyAgentStatus = eMAS.masUnAssign
  SetButtonView('OnCtiLinkClose')
  $('#lab3').html('服务已关')
  EnableSelect('sta', false)
  ary.splice(0, ary.length)
}

function OnLinkClose() {
  m_HaveAssign = 0
  m_HaveLogin = 0
  m_MyAgentStatus = eMAS.masUnAssign
  SetButtonView('OnLinkClose')
  $('#lab3').html('无连接')
  EnableSelect('sta', false)
  ary.splice(0, ary.length)
}
$(function () {
  setInterval(OnTalkTimer, 1000)
  setInterval(OnGetQueueTimer, 2000)
})

function OnTalkTimer() {
  if (m_HaveLogin > 0) {
    m_TalkTimeLong++
    $('#lab2').html('' + m_TalkTimeLong)
  }
}

function countTalkTime() {
  if (m_HaveLogin > 0) {
    m_TalkTimeLong2++
    var s = formatTime(m_TalkTimeLong2)
    $('#talkTimeLab').html('' + s)
  }
}

function OnGetQueueTimer() {
  if (m_HaveLogin > 0) {
    query_query()
  }
  if (m_HaveAssign == 0 && ws.readyState == 1) {
    assign2()
    //	ws.send(pageHead()+xmlHead()+assignPage()+pageLast()+"\1");
  }
}

function ProcessDeliverMsg(src_node_Id, src_type, src_sequence, sMessage) {
  var parsexml = new ParseXml(sMessage)
  var giveupheasstr = parsexml.GiveupHeadString()
  var CmdName = parsexml.GetCommand(giveupheasstr, 'COMMAND', 'name')
  //放到控制台
  //	document.getElementById("content").innerHTML += "<br>";
  //	document.getElementById("content").innerHTML += (">>> "+CmdName+"("+m_MyAgentStatus+") -->>> ");

  console.log('方法ProcessDeliverMsg以前content的打印信息 开始=====')
  console.log('>>> ' + CmdName + '(' + m_MyAgentStatus + ') -->>> ')
  console.log('方法ProcessDeliverMsg以前content的打印信息 结束=====')

  if (CmdName == 'ASSIGNED') {
    var AgentDN = parsexml.GetValue(giveupheasstr, 'AGENT_DN')
    var AgentCH = parsexml.GetValue(giveupheasstr, 'AGENT_CH')
    var RetCode = parsexml.GetValue(giveupheasstr, 'RETURN_CODE')
    var RETURN_TEXT = parsexml.GetValue(giveupheasstr, 'RETURN_TEXT')
    if (parseInt(RetCode, 10) == 0) {
      $('#ch').val(AgentCH)
      m_HaveAssign = 1
      m_AgentCh = parseInt(AgentCH, 10)
      m_MyAgentStatus = eMAS.masAssigned
      SetButtonView('OnAssigned')
      return 0
    }

    //m_MyAgentStatus=eMAS.masUnAssign;
    //SetButtonView("OnAssigned");

    if (parseInt(RetCode, 10) == 1) {
      $('#lab3').html('分机错')
    } else if (parseInt(RetCode, 10) == 2) {
      $('#lab3').html('[' + RETURN_TEXT + ']已占用')
    } else if (parseInt(RetCode, 10) == 3) {
      $('#lab3').html('超席数')
    } else {
      $('#lab3').html('As(' + iReturnCode + ')')
    }
  } else if (CmdName == 'DEASSIGNED') {
    m_HaveAssign = 0
    m_HaveLogin = 0
    m_MyAgentStatus = eMAS.masUnAssign
    SetButtonView('OnDeassigned')
  } else if (CmdName == 'AGENT_LOGGED_IN') {
    var RetCode = parsexml.GetValue(giveupheasstr, 'RETURN_CODE')
    if (parseInt(RetCode, 10) == 0) {
      m_MyAgentStatus = eMAS.masLogin
      m_AgentStatus = eAS.AS_LOG_IN
      m_HaveLogin = 1
      SetButtonView('OnAgentLoggedIn')
    } else {
      alert('签入失败【' + RetCode + '-' + GetLoginResult(RetCode) + '】')
    }
  } else if (CmdName == 'AGENT_LOGGED_OUT') {
    var RetCode = parsexml.GetValue(giveupheasstr, 'RETURN_CODE')
    if (parseInt(RetCode, 10) == 0) {
      m_MyAgentStatus = eMAS.masLogout
      m_AgentStatus = eAS.AS_LOG_OUT
      m_HaveLogin = 0
      SetButtonView('OnAgentLoggedOut')
    }
  } else if (CmdName == 'CALLALERTING') {
    var AgentCH = parsexml.GetValue(giveupheasstr, 'AGENT_CH')
    var AlertDN = parsexml.GetValue(giveupheasstr, 'ALERTINGDN')
    var CallerDN = parsexml.GetValue(giveupheasstr, 'CALLERDN')
    var CalledDN = parsexml.GetValue(giveupheasstr, 'CALLEDDN')
    var LastDN = parsexml.GetValue(giveupheasstr, 'LASTDN')
    var Skill = parsexml.GetValue(giveupheasstr, 'SKILL')
    m_TalkTimeLong = 0
    $('#txt2').val(CallerDN)
    $('#callid').val(ary[0])
    m_MyAgentStatus = eMAS.masAlerting
    SetButtonView('OnCallAlerting')
    $('#lab3').html('技能组：' + Skill)
    $('#skill').val(Skill)
    //$("#skillShow").html("技能组："+Skill);
    //保存COOKIE
    saveCookie(CallerDN, 1)
  } else if (CmdName == 'CALLCONFERENCED') {
    var AgentCH = parsexml.GetValue(giveupheasstr, 'AGENT_CH')
    var AddedDN = parsexml.GetValue(giveupheasstr, 'ADDEDPARTYDN')
    var CtrlDN = parsexml.GetValue(giveupheasstr, 'CONFCONTROLDN')
    var Party2DN = parsexml.GetValue(giveupheasstr, 'CONFPARTY2DN')
    var Party3DN = parsexml.GetValue(giveupheasstr, 'CONFPARTY3DN')
    var AgentDN = $('#agentdn').val()

    if (CtrlDN == AgentDN) {
      m_MyAgentStatus = eMAS.masConferAdded
      SetButtonView('OnCallConferenced')
    } else if (AddedDN == AgentDN) {
      m_MyAgentStatus = eMAS.masConferBeAdded
      SetButtonView('OnCallConferenced')
    } else if (Party2DN == AgentDN) {
      m_MyAgentStatus = eMAS.masConferPart2
      SetButtonView('OnCallConferenced')
    }
  } else if (CmdName == 'CALLESTABLISHED') {
    var AgentCH = parsexml.GetValue(giveupheasstr, 'AGENT_CH')
    var AnswerDN = parsexml.GetValue(giveupheasstr, 'ANSWERINGDN')
    var CallerDN = parsexml.GetValue(giveupheasstr, 'CALLINGDN')
    var CalledDN = parsexml.GetValue(giveupheasstr, 'CALLEDDN')
    var LastDN = parsexml.GetValue(giveupheasstr, 'LASTDN')
    var CallTaskID = parsexml.GetValue(giveupheasstr, 'CALLTASKID')
    var LogID = parsexml.GetValue(giveupheasstr, 'LOGID')
    var TaskID = parsexml.GetValue(giveupheasstr, 'TASKID')
    var AgentDN = $('#agentdn').val()

    if (AnswerDN == AgentDN) {
      m_MyAgentStatus = eMAS.masTalking
      SetButtonView('OnCallEstablished')
      m_TalkTimeLong = 0
      m_Talking = 1
    } else {
      if (m_MyAgentStatus == eMAS.masMakecallSecond) {
        m_MyAgentStatus = eMAS.masTalking
        SetButtonView('OnCallEstablished')
        m_TalkTimeLong = 0
        m_Talking = 1
      } else if (
        m_MyAgentStatus == eMAS.masConsultThree ||
        m_MyAgentStatus == eMAS.masConsultSecond
      ) {
        //consult 对方应答
        m_MyAgentStatus = eMAS.masConsultFour
        if (m_ForceIned > 0) {
          m_ForceIned = 0
        }
        SetButtonView('OnCallEstablished')
      }
    }
    if (m_interval == 0) {
      m_interval = setInterval(countTalkTime, 1000)
    }
    callAnswerEvent(CallerDN, CalledDN, CallTaskID, LogID, TaskID)
  } else if (CmdName == 'CALLDELIVERED') {
    var AgentCH = parsexml.GetValue(giveupheasstr, 'AGENT_CH')
    var AlertingDN = parsexml.GetValue(giveupheasstr, 'ALERTINGDN')
    var CallerDN = parsexml.GetValue(giveupheasstr, 'CALLINGDN')
    var CalledDN = parsexml.GetValue(giveupheasstr, 'CALLEDDN')
    var LastDN = parsexml.GetValue(giveupheasstr, 'LASTDN')
    var AgentDN = $('#agentdn').val()

    if (AlertingDN == AgentDN) {
    } else {
      if (m_MyAgentStatus == eMAS.masConsultSecond) {
        m_MyAgentStatus = eMAS.masConsultThree
        SetButtonView('OnCallDelivered')
      }
    }
  } else if (CmdName == 'CALLFAILED') {
    var AgentCH = parsexml.GetValue(giveupheasstr, 'AGENT_CH')
    var FailDN = parsexml.GetValue(giveupheasstr, 'FAILDN')
    var CalledDN = parsexml.GetValue(giveupheasstr, 'CALLEDDN')
    var FailAction = parsexml.GetValue(giveupheasstr, 'FAIL_ACTION')
    var ErrCode = parsexml.GetValue(giveupheasstr, 'ERROR_CODE')

    if (parseInt(FailAction, 10) == 4) {
      m_MyAgentStatus = eMAS.masTalking
      SetButtonView('OnCallFailed')
    } else if (parseInt(FailAction, 10) == 6) {
      switch (m_AgentStatus) {
        case eAS.AS_LOG_OUT:
          m_MyAgentStatus = eMAS.masLogout
          break
        case eAS.AS_LOG_IN:
          m_MyAgentStatus = eMAS.masLogin
          break
        case eAS.AS_NO_READY:
          m_MyAgentStatus = eMAS.masNotReady
          break
        case eAS.AS_READY:
          m_MyAgentStatus = eMAS.masReady
          break
        case eAS.AS_WORKING_AFTER_CALL:
          m_MyAgentStatus = eMAS.masAfterCall
          break
        case eAS.AS_BUSY:
        default:
          return
      }
      SetButtonView('OnCallFailed')
    }
  } else if (CmdName == 'CALLDIVERTED') {
  } else if (CmdName == 'CALLHELD') {
    var AgentCH = parsexml.GetValue(giveupheasstr, 'AGENT_CH')
    var HoldingDN = parsexml.GetValue(giveupheasstr, 'HOLDINGDN')
    var AgentDN = $('#agentdn').val()

    if (HoldingDN == AgentDN) {
      if (m_MyAgentStatus != eMAS.masConsultfirst) {
        m_MyAgentStatus = eMAS.masHolding
        SetButtonView('OnCallHeld')
      }
    } else {
      m_MyAgentStatus = eMAS.masHeld
      SetButtonView('OnCallHeld')
    }
  } else if (CmdName == 'CALLRETRIEVED') {
    var AgentCH = parsexml.GetValue(giveupheasstr, 'AGENT_CH')
    var RetrievingDN = parsexml.GetValue(giveupheasstr, 'RETRIEVINGDN')
    var AgentDN = $('#agentdn').val()

    if (RetrievingDN == AgentDN) {
      m_MyAgentStatus = eMAS.masTalking
      SetButtonView('OnCallRetrieved')
    } else if (m_MyAgentStatus == eMAS.masHeld) {
      m_MyAgentStatus = eMAS.masTalking
      SetButtonView('OnCallRetrieved')
    }
  } else if (CmdName == 'CALLSERVICE_INITIATED') {
    var AgentCH = parsexml.GetValue(giveupheasstr, 'AGENT_CH')
    if (
      m_MyAgentStatus == eMAS.masLogin ||
      m_MyAgentStatus == eMAS.masNotReady ||
      m_MyAgentStatus == eMAS.masReady ||
      m_MyAgentStatus == eMAS.masAfterCall
    ) {
      //设置随路数据
      setASSOCDATA()
      m_MyAgentStatus = eMAS.masMakecallSecond
      SetButtonView('OnCallServiceInited')
    } else if (m_MyAgentStatus == eMAS.masMakecallFirst) {
      m_MyAgentStatus = eMAS.masMakecallSecond
      SetButtonView('OnCallServiceInited')
    } else if (m_MyAgentStatus == eMAS.masConsultfirst) {
      m_MyAgentStatus = eMAS.masConsultSecond
      SetButtonView('OnCallServiceInited')
    }
  } else if (CmdName == 'CALLNETWORKREACHED') {
    var AgentCH = parsexml.GetValue(giveupheasstr, 'AGENT_CH')
    var TrunkDN = parsexml.GetValue(giveupheasstr, 'TRUNKDN')
    var CalledDN = parsexml.GetValue(giveupheasstr, 'CALLEDDN')
  } else if (CmdName == 'CALLORIGINATED') {
    var AgentCH = parsexml.GetValue(giveupheasstr, 'AGENT_CH')
    var CallingDN = parsexml.GetValue(giveupheasstr, 'CALLINGDN')
    var CalledDN = parsexml.GetValue(giveupheasstr, 'CALLEDDN')
    var CallType = parsexml.GetValue(giveupheasstr, 'CALLTYPE')

    if (parseInt(CallType, 10) == 1) {
      m_TalkTimeLong = 0
      beginCallEvent(CallingDN, CalledDN, CallType)
    }
  } else if (CmdName == 'CALLPARTYDROPPED') {
  } else if (CmdName == 'CALLQUEUED') {
  } else if (CmdName == 'CALLRELEASED') {
    var AgentCH = parsexml.GetValue(giveupheasstr, 'AGENT_CH')
    var ReleaseDN = parsexml.GetValue(giveupheasstr, 'RELEASEDDN')
    ary.splice(0, ary.length)
    $('#pAssociateDataVal').val('') //释放随路数据
    m_TalkTimeLong = 0
    m_Talking = 0
    clearInterval(m_interval)
    m_interval = 0
    m_TalkTimeLong2 = 0
    var s = formatTime(m_TalkTimeLong2)
    $('#talkTimeLab').html('' + s)
    $('#lab2').html('' + m_TalkTimeLong)
    /*
		if($("#skill").val().length>0)
		{
			callinEvent($("#skill").val());
		}
		*/
    $('#skill').val('')
    handDownEvent()
  } else if (CmdName == 'CALLTRANSFERED') {
  } else if (CmdName == 'DEVICEMUTED') {
  } else if (CmdName == 'DEVICEUNMUTED') {
  } else if (CmdName == 'DEVICEINSERVICE') {
  } else if (CmdName == 'DEVICEOUTSERVICE') {
  } else if (CmdName == 'FORWARDED') {
  } else if (CmdName == 'MESSAGEWAITING') {
  } else if (CmdName == 'DONOTDISTURB') {
  } else if (CmdName == 'PICKUP_ENABLE') {
    var AgentCH = parsexml.GetValue(giveupheasstr, 'AGENT_CH')
    var RingCount = parsexml.GetValue(giveupheasstr, 'RING_COUNT')

    m_RingCount = parseInt(RingCount, 10)

    var NowSkill = $('#lab3').html()
    SetButtonView('OnPickupEnable')
    if (m_MyAgentStatus == masAlerting) {
      $('#lab3').html(NowSkill)
    }
  } else if (CmdName == 'Query_Queue_Return') {
    var AgentCH = parsexml.GetValue(giveupheasstr, 'AGENT_CH')
    var MaxLong = parsexml.GetValue(giveupheasstr, 'MAXWAITLONG')
    var QueNums = parsexml.GetValue(giveupheasstr, 'QUEUENUMS')

    $('#lab1').html(QueNums)
    $('#lab5').html(MaxLong)
  } else if (CmdName == 'QUERY_QUEUE_LIST_RETURN') {
    var AgentCH = parsexml.GetValue(giveupheasstr, 'AGENT_CH')
    var QueNames = parsexml.GetValue(giveupheasstr, 'QUEUENAMES')
    OpenWin4Tranf(QueNames)
  } else if (CmdName == 'QUERY_CHANNEL_Return') {
  } else if (CmdName == 'QUERY_QUEUE_MEMBER_LIST_RETURN') {
  } else if (CmdName == 'DELIVER_SYSMSG') {
  } else if (CmdName == 'DELIVER_MSG') {
  } else if (CmdName == 'AGENT_STATU_RETURN') {
    var AgentCH = parsexml.GetValue(giveupheasstr, 'AGENT_CH')
    var Status = parsexml.GetValue(giveupheasstr, 'STATUS')
    m_AgentStatus = parseInt(Status, 10)
    m_STATUS_TYPE = parseInt(parsexml.GetValue(giveupheasstr, 'STATUS_TYPE'), 10)
    switch (m_AgentStatus) {
      case eAS.AS_LOG_OUT:
        m_MyAgentStatus = eMAS.masLogout
        break
      case eAS.AS_LOG_IN:
        m_MyAgentStatus = eMAS.masLogin
        break
      case eAS.AS_NO_READY:
        m_TalkTimeLong = 0
        m_MyAgentStatus = eMAS.masNotReady
        break
      case eAS.AS_READY:
        m_TalkTimeLong = 0
        m_MyAgentStatus = eMAS.masReady
        break
      case eAS.AS_WORKING_AFTER_CALL:
        m_MyAgentStatus = eMAS.masAfterCall
        break
      case eAS.AS_BUSY:
        return
      default:
        return
    }
    SetButtonView('OnAgentStatuReturn')
  } else if (CmdName == 'AGENT_AFTER_STATU_RETURN') {
    var AgentCH = parsexml.GetValue(giveupheasstr, 'AGENT_CH')
    var Status = parsexml.GetValue(giveupheasstr, 'STATUS')

    if (parseInt(Status, 10) == eAS.AS_READY) {
      ShowWindow('afterbusy', false)
      ShowWindow('afterread', true)
      EnableWindow('afterread', true)
    } else if (parseInt(Status, 10) == eAS.AS_NO_READY) {
      ShowWindow('afterread', false)
      ShowWindow('afterbusy', true)
      EnableWindow('afterbusy', true)
    }
  } else if (CmdName == 'ASSOCIATE_DATA_RETURN') {
    var AgentCH = parsexml.GetValue(giveupheasstr, 'AGENT_CH')
    var Key = parsexml.GetValue(giveupheasstr, 'KEY')
    var Value = parsexml.GetValue(giveupheasstr, 'VALUE')
    ary[Key] = Value
    $('#callid').val(ary[0])
    $('#callerdn').val(ary[1])
    $('#calleddn').val(ary[2])
  } else if (CmdName == 'QUERY_IVR_Return') {
  } else if (CmdName == 'DB_EXEC_RES') {
  } else if (CmdName == 'TIMESYNC') {
  }
  return 0
}
function domessage(str) {
  var parsexml = new ParseXml(str)
  var giveupheasstr = parsexml.GiveupHeadString()
  var CommandID = parsexml.GetCommand(giveupheasstr, 'COMMAND', 'name')

  if (CommandID == 'LOGIN_RES') {
    var RetCode = parsexml.GetValue(giveupheasstr, 'RETURN_CODE')
    if (parseInt(RetCode, 10) == 0) {
      var NodeID = parsexml.GetValue(giveupheasstr, 'NODE_ID')
      var SrcSeq = parsexml.GetValue(giveupheasstr, 'SOURCE_SEQUENCE')
      $('#sk_node_id').val(NodeID)
      $('#skseq').val(SrcSeq)
      var AssignXml =
        $('#skseq').val() +
        '|' +
        pageHead() +
        xmlHead() +
        pageBody($('#skseq').val(), ctiAssignPage($('#agentdn').val())) +
        pageLast()
      ws.send(AssignXml)
    }
  } else if (CommandID == 'LOGOUT') {
    var NodeID = parsexml.GetValue(giveupheasstr, 'NODE_ID')
    var SrcType = parsexml.GetValue(giveupheasstr, 'SOURCE_TYPE')
    var SrcSeq = parsexml.GetValue(giveupheasstr, 'SOURCE_SEQUENCE')
    if (parseInt(SrcType, 10) == 1 && parseInt(SrcSeq, 10) == 1) {
      OnCtiLinkClose()
    }
  } else if (CommandID == 'LOGOUT_RES') {
    var RetCode = parsexml.GetValue(giveupheasstr, 'RETURN_CODE')
    if (parseInt(RetCode, 10) == 0) {
      $('#lab3').html('已退出')
    }
  } else if (CommandID == 'DELIVER') {
    var SrcNode = parsexml.GetValue(giveupheasstr, 'SOURCE_NODE_ID')
    var SrcType = parsexml.GetValue(giveupheasstr, 'SOURCE_TYPE')
    var SrcSeq = parsexml.GetValue(giveupheasstr, 'SOURCE_SEQUENCE')
    var Message = parsexml.GetValue(giveupheasstr, 'MESSAGE')
    ProcessDeliverMsg(parseInt(SrcNode, 10), parseInt(SrcType, 10), parseInt(SrcSeq, 10), Message)
  } else if (CommandID == 'SUMBIT_RES') {
  }
  return 0
}

function initBtn() {
  enabledBtn('login')
  disabledBtn('logout')
  disabledBtn('afterbusy')
  disabledBtn('set_busy')
  disabledBtn('set_read')
  disabledBtn('retrieve')
  disabledBtnExit('afterread')
  //disabledBtnExit("makecall");
  disabledBtnExit('hangup')
  disabledBtnExit('set_busy')
  disabledBtnExit('hold')
  disabledBtnExit('pickup')
  disabledBtnExit('answed')
  disabledBtnExit('after_bu')
  disabledBtnExit('monitor')
  disabledBtnExit('trunfer')
  disabledBtnExit('conferen')
  disabledBtnExit('consult')
  EnableSelect('sta', false)
  document.getElementById('sta').disabled = 'disabled'
}

function disabledBtn(btnid) {
  /*if(isChrome)
	{
		$("#"+btnid).css("display","none").css({"filter":"grayscale(100%)","-webkit-filter":"grayscale(100%)","-moz-filter":"grayscale(100%)","-ms-filter":"grayscale(100%)","-o-filter":"grayscale(100%)","filter:progid":"DXImageTransform.Microsoft.BasicImage(grayscale=1)","-webkit-filter":"grayscale(1)"});
	}else
	*/
  {
    $('#' + btnid).css('display', 'none')
    $('.' + btnid).css({
      background: 'url(./src/assets/callPanelPlugin/files/' + btnid + '2.png)',
      width: '20px',
      height: '20px',
      'background-size': '100%'
    })
  }
  $('#' + btnid).attr('disabled', 'true')
}

function enabledBtn(btnid) {
  /*if(isChrome)
	{
		$("#"+btnid).css("display","inline").css({"filter":"grayscale(0%)","-webkit-filter":"grayscale(0%)","-moz-filter":"grayscale(0%)","-ms-filter":"grayscale(0%)","-o-filter":"grayscale(0%)","filter:progid":"DXImageTransform.Microsoft.BasicImage(grayscale=0)","-webkit-filter":"grayscale(0)"});
	}else
	*/
  {
    $('#' + btnid).css('display', 'inline')
    $('.' + btnid).css({
      background: 'url(./src/assets/callPanelPlugin/files/' + btnid + '.png)',
      width: '20px',
      height: '20px',
      'background-size': '100%'
    })
  }

  $('#' + btnid).attr('disabled', 'false')
}

function disabledBtnExit(btnid) {
  /*if(isChrome)
		{
			$("#"+btnid).css("display","inline").css({"filter":"grayscale(100%)","-webkit-filter":"grayscale(100%)","-moz-filter":"grayscale(100%)","-ms-filter":"grayscale(100%)","-o-filter":"grayscale(100%)","filter:progid":"DXImageTransform.Microsoft.BasicImage(grayscale=1)","-webkit-filter":"grayscale(1)"});
		}else
		*/
  {
    $('#' + btnid).css('display', 'inline')

    $('.' + btnid).css({
      background: 'url(./src/assets/callPanelPlugin/files/' + btnid + '2.png)',
      width: '20px',
      height: '20px',
      'background-size': '100%'
    })
  }

  $('#' + btnid).attr('disabled', 'true')
}

function setgrep(btnid) {
  var imgObj = document.getElementById(btnid)
  var canvas = document.createElement('canvas')
  var canvasContext = canvas.getContext('2d')
  var imgW = imgObj.width
  var imgH = imgObj.height
  canvas.width = imgW
  canvas.height = imgH
  canvasContext.drawImage(imgObj, 0, 0)
  var imgPixels = canvasContext.getImageData(0, 0, imgW, imgH)
  for (var y = 0; y < imgPixels.height; y++) {
    for (var x = 0; x < imgPixels.width; x++) {
      var i = y * 4 * imgPixels.width + x * 4
      var avg = (imgPixels.data[i] + imgPixels.data[i + 1] + imgPixels.data[i + 2]) / 3
      imgPixels.data[i] = avg
      imgPixels.data[i + 1] = avg
      imgPixels.data[i + 2] = avg
    }
  }
  canvasContext.putImageData(imgPixels, 0, 0, 0, 0, imgPixels.width, imgPixels.height)
  $('#' + btnid).attr('src', canvas.toDataURL())
}

function sleep(timeout) {
  window.setTimeout(function () {}, timeout)
}

var stat = 0
var tempskill = ''
var ws = null
var simple = null

function startServer() {
  initBtn()

  var url = $('#wsurl').val()
  var usesip = $('#use_sip').val()
  if ('WebSocket' in window) {
    ws = new WebSocket(url)
  } else if ('MozWebSocket' in window) {
    ws = new MozWebSocket(url)
  } else {
    initBtn()
    alert('Your browser Unsupported WebSocket!')
  }

  ws.onopen = function () {
    //$("#login").css({"filter":"grayscale(0%)","-webkit-filter":"grayscale(0%)","-moz-filter":"grayscale(0%)","-ms-filter":"grayscale(0%)","-o-filter":"grayscale(0%)","filter:progid":"DXImageTransform.Microsoft.BasicImage(grayscale=0)","-webkit-filter":"grayscale(0)"});
    $('#login').attr('disabled', false)

    if (ws != null) {
      checkLink($('#agentdn').val(), $('#agentid').val())
    }

    assign()
    //放到控制台
    //            document.getElementById("content").innerHTML += 'websocket open! Welcome!<br />';

    console.log('ws.onopen以前content的打印信息 开始=====')
    console.log('websocket open! Welcome!')
    console.log('ws.onopen以前content的打印信息 结束=====')
  }

  ws.onmessage = function (event) {
    var str = event.data
    if (str == 'noConnect') {
      reflesh()
    }
    try {
      if (str.length == 3) {
        if (ws != null) {
          ws.send(resPage())
        } else {
          console.log(new Date() + 'ss:' + str)
        }
      }
    } catch (e) {}
    domessage(str)
  }
  ws.onclose = function () {
    OnLinkClose()
    setTimeout('reflesh()', 3 * 1000)
    clearInterval(m_interval)
    m_interval = 0
    m_TalkTimeLong2 = 0
    var s = formatTime(m_TalkTimeLong2)
    $('#talkTimeLab').html('' + s)
    //            放到控制台
    //            document.getElementById("content").innerHTML += 'websocket closed! Byebye!<br />';

    console.log('ws.onclose 以前content的打印信息 开始=====')
    console.log('websocket closed! Byebye!')
    console.log('ws.onclose 以前content的打印信息 结束=====')
  }
  if (parseInt(usesip, 10) == 1) {
    //使用webrtc
    var sip_uri_ = document.getElementById('sip_uri').value.toString()
    var sip_password_ = document.getElementById('sip_password').value.toString()
    var ws_uri_ = document.getElementById('ws_uri').value.toString()
    var agentdn_ = $('#agentdn').val()
    $('#registStatus').attr('src', './src/assets/callPanelPlugin/files/unregistered1.png')
    //console.info("get input info: sip_uri = ", sip_uri_, " sip_password = ", sip_password_, " ws_uri = ", ws_uri_);
    // Create a Simple interface with a user named bob and a remote video element in the DOM
    simple = new SIP.Web.Simple({
      media: {
        remote: {
          //video: document.getElementById('remoteVideo'),
          // This is necessary to do an audio/video call as opposed to just a video call
          audio: document.getElementById('remoteVideo')
        },
        local: {
          //video: document.getElementById('localVideo'),
          // This is necessary to do an audio/video call as opposed to just a video call
          audio: document.getElementById('localVideo')
        }
      },
      ua: {
        uri: sip_uri_,
        wsServers: [ws_uri_],
        authorizationUser: agentdn_,
        password: sip_password_,
        displayName: agentdn_,
        register: true,
        usePreloadedRoute: false,
        traceSip: true,
        userAgentString: 'IOK RTC'
        //hackIpInContact:false,
        //hackViaTcp:false
      }
    })
    simple.on('registered', function () {
      $('#registStatus').attr('src', './src/assets/callPanelPlugin/files/registered1.png')
      $('#regist_status').html('已注册')
      $('#lab_dn').html(agentdn_)
    })
    simple.on('unregistered', function () {
      $('#registStatus').attr('src', './src/assets/callPanelPlugin/files/unregistered1.png')
      $('#regist_status').html('未注册')
    })
    simple.on('new', function () {
      $('#call_status').html('new')
    })
    simple.on('ringing', function () {
      $('#call_status').html('振铃')
      //simple.answer();
      //playRing();
      var autoAns = $('#autoAns').val()
      if (autoAns == '1' || $('#outtab').val() == '1') {
        //answed();
        simple.answer()
      }
    })
    simple.on('connecting', function () {
      $('#call_status').html('外呼中')
    })
    simple.on('connected', function () {
      $('#call_status').html('通话中')
    })
    simple.on('ended', function () {
      $('#call_status').html('通话结束')
      /* enabledBtn("logout");
			 enabledBtn("set_read");
			 enabledBtn("makecall");
			 disabledBtn("set_busy");
			 disabledBtnExit("hangup");
			 disabledBtnExit("hold");
			 disabledBtnExit("answed");
			 disabledBtnExit("after_bu");
			 c=0;//重置
			 clearTimeout(t);//停止计数
			 $("#skill").val("");//重置技能组
			 disabledBtnExit("consult");	//咨询
			 disabledBtnExit("trunfer");	//转移
			 $("#lab3").html("休息中");
			 */
      ctihangup()
    })
    simple.on('hold', function () {
      $('#call_status').html('保持')
    })
    simple.on('unhold', function () {
      $('#call_status').html('恢复')
    })
    simple.on('mute', function () {
      $('#call_status').html('mute')
    })
    simple.on('unmute', function () {
      $('#call_status').html('unmute')
    })
    simple.on('dtmf', function (tone) {
      $('#call_status').html(tone)
    })
  }
}

function OpenWin4Tranf(QueNames) {
  var tempstr = QueNames
  if (tempstr.length > 0) {
    if (stat == 1) {
      getSkillInfo()
      /*parent.$("#win").window("setTitle","转移");
	       		 parent.$("#win").window("open");
	       		 parent.$("#winskill").html("");
	                skillsStrs=tempstr.split("|"); //字符分割 
		     		for (i=0;i<skillsStrs.length-1 ;i++ ) 
	     			{ 
		     			parent.$("#winskill").append("<tr><td><input type=\"button\" class=button value=\"转移\" onclick=\"window.parent.iframe_head.tranf('"+skillsStrs[i]+"')\"></td><td>"+skillsStrs[i]+"</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td></tr>");
	     				//alert(skillsStrs[i]+""); 
	     			}
	     			*/
    } else if (stat == 2) {
      getzxSkillInfo()
      /*
	       		 	parent.$("#win2").window({onBeforeClose:function(){tempskill="";clearTimeout(s);parent.$("#win2agent").html("");
	       		 	parent.$("#conAgentDn").val("");
	       		 	table=parent.document.getElementById("personTable");
	           		for(var k=table.rows.length;k>0;k--)
	           			table.deleteRow(table.rows.rowIndex);
	       		 	 
	       		 	 }});
	       		 	parent.$("#win2").window("setTitle","咨询");
	       		 	parent.$("#win2").window("open");
		                 
	       		 	parent.$("#win2skill").html("");
		                 skillsStrs=tempstr.split("|"); //字符分割 
		               
		 	     		for (i=0;i<skillsStrs.length-1 ;i++ ) 
		      			{ 
		 	     			parent.$("#win2skill").append("<tr><td class=button><input type=\"button\" value=\"获取“"+skillsStrs[i]+"”座席\" onclick=\"window.parent.iframe_head.getAgents('"+skillsStrs[i]+"')\" ></td></tr>");
		      			}
		      			*/
    }
  }
}

$(function () {
  setInterval(sendAck, 5000)
})
function sendAck() {
  if (ws != null) {
    ws.send($('#skseq').val() + '|' + ackPage())
  }
}
//连接服务端验证
function checkLink(agentdn, agentid) {
  if (ws != null) {
    var timestamp = Math.round(new Date() / 1000)
    var prikey = randomString(32)
    var solt = 'infook@12345.com'
    var dnpwd = 'ABCD1234abcd7890abcd7890ABCD1234' //$("#sip_password").val();//
    //alert(dnpwd);
    ws.send(
      pageHead() +
        xmlHead() +
        checkPage(
          agentdn,
          agentid,
          aesEncode(agentdn, timestamp, prikey, solt),
          base64Encode(agentdn, timestamp, prikey, dnpwd)
        ) +
        pageLast()
    )
  }
}
function checkPage(agentdn, agentid, chkinf, chkstr) {
  return (
    '<COMMAND name="CHECK_LINK" type="ROUTEMSG">' +
    '<CLTTYPE>0</CLTTYPE>' +
    '<AGENTDN>' +
    agentdn +
    '</AGENTDN>' +
    '<AGENTID>' +
    agentid +
    '</AGENTID>' +
    '<CHKINF>' +
    chkinf +
    '</CHKINF>' +
    '<CHKSTR>' +
    chkstr +
    '</CHKSTR>' +
    '</COMMAND>'
  )
}
function aesEncode(agentdn, timestamp, prikey, solt) {
  return encodeAesString(timestamp + ';' + agentdn + ';' + prikey, solt, solt)
}
function base64Encode(agentdn, timestamp, prikey, dnpwd) {
  return CryptoJS.enc.Base64.stringify(
    CryptoJS.HmacSHA256(timestamp + ';' + agentdn + ';' + dnpwd, prikey)
  )
}
function encodeAesString(data, key, iv) {
  var key = CryptoJS.enc.Utf8.parse(key)
  var iv = CryptoJS.enc.Utf8.parse(iv)
  var encrypted = CryptoJS.AES.encrypt(data, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  //返回的是base64格式的密文
  return encrypted
}
//产生随机私钥
function randomString(len) {
  len = len || 32
  var chars =
    'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678oOLl9gqVvUuI1' /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  var maxPos = chars.length
  var pwd = ''
  for (i = 0; i < len; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * maxPos))
  }
  return pwd
}
function assign() {
  if (ws != null) {
    ws.send(pageHead() + xmlHead() + assignPage() + pageLast() + '\1')
  }
}
function assign2() {
  if (ws != null) {
    ws.send(
      $('#skseq').val() +
        '|' +
        pageHead() +
        xmlHead() +
        pageBody($('#skseq').val(), ctiAssignPage($('#agentdn').val())) +
        pageLast()
    )
  }
}
function login() {
  var seq = $('#skseq').val()
  if (ws != null) {
    if (seq != '0')
      ws.send(
        seq +
          '|' +
          utilsPage(
            seq,
            agentLoginPage($('#agentid').val(), 'agentname', 'agentpwd', '预测外拨', '1.0.0.63')
          )
      )
    //签入
    else alert('签入失败，请刷新页面重新连接！')
  }
}
function logout() {
  var seq = $('#skseq').val()
  //alert("logout");
  if (ws != null) {
    if (seq != '0') ws.send(seq + '|' + utilsPage(seq, agetnLogoutPage()))
    else alert('签出失败，请刷新页面重新连接！')
  }
}

function setbusy() {
  var seq = $('#skseq').val()
  if (ws != null) {
    if (seq != '0') ws.send(seq + '|' + utilsPage(seq, agentSetStatuPage($('#ch').val(), 3, 9)))
    else alert('置忙失败，请刷新页面重新连接！')
  }
}
function setread() {
  var seq = $('#skseq').val()
  if (ws != null) {
    if (seq != '0') ws.send(seq + '|' + utilsPage(seq, agentSetStatuPage($('#ch').val(), 4, 0)))
    else alert('置闲失败，请刷新页面重新连接！')
  }
}

function changeStatus(sta) {
  var ss = sta.split(',')
  var seq = $('#skseq').val()
  if (ws != null) {
    if (seq != '0')
      ws.send(seq + '|' + utilsPage(seq, agentSetStatuPage($('#ch').val(), ss[0], ss[1])))
    else alert('修改状态失败，请刷新页面重新连接！')
  }
}
function afterbusy() {
  var seq = $('#skseq').val()
  if (ws != null) {
    if (seq != '0') ws.send(seq + '|' + utilsPage(seq, agentSetAfterStatu($('#ch').val(), 4)))
    else alert('事后忙失败，请刷新页面重新连接！')
  }
}

function afterread() {
  var seq = $('#skseq').val()
  if (ws != null) {
    if (seq != '0') ws.send(seq + '|' + utilsPage(seq, agentSetAfterStatu($('#ch').val(), 3)))
    else alert('事后闲失败，请刷新页面重新连接！')
  }
}
function makecall(called) {
  var seq = $('#skseq').val()
  var iAssociateDataKey = $('#iAssociateDataKey').val()
  var pAssociateDataVal = $('#pAssociateDataVal').val()
  //  		alert(iAssociateDataKey);alert(pAssociateDataVal);
  //var called=$("#txt2").val();
  if (called.length < 4) {
    alert('请输入正确的号码！')
    return false
  }
  /*if(simple!=null)
    		 {
    		 	simple.call(called);
    		 }else
    	*/
  {
    if (ws != null) {
      if (seq != '0') {
        ws.send(
          seq +
            '|' +
            utilsPage(
              seq,
              callMakeCall(
                $('#ch').val(),
                $('#agentdn').val(),
                called,
                parseInt(iAssociateDataKey, 10),
                pAssociateDataVal
              )
            )
        )
      } else alert('外拨失败，请刷新页面重新连接！')
    }
  }
  m_MyAgentStatus = eMAS.masMakecallFirst
  SetButtonView('OnMakeCall')
  //保存cookie
  saveCookie(called, 0)
}
function ctihangup() {
  //挂机
  var seq = $('#skseq').val()
  if (simple != null) simple.hangup()
  if (ws != null) {
    if (seq != '0') ws.send(seq + '|' + utilsPage(seq, callRelease($('#ch').val())))
    else alert('挂机失败，请刷新页面重新连接！')
  }
}

function hold() {
  var seq = $('#skseq').val()
  if (ws != null) {
    if (seq != '0') ws.send(seq + '|' + utilsPage(seq, callHold($('#ch').val())))
    else alert('保持失败，请刷新页面重新连接！')
  }
}
function retrieve() {
  var seq = $('#skseq').val()
  if (ws != null) {
    if (seq != '0') ws.send(seq + '|' + utilsPage(seq, callRetrieve($('#ch').val())))
    else alert('恢复失败，请刷新页面重新连接！')
  }
}
function pickup() {
  var seq = $('#skseq').val()
  if (simple != null) simple.answer()
  if (ws != null) {
    if (seq != '0') ws.send(seq + '|' + utilsPage(seq, callRetrieve($('#ch').val())))
    else alert('代答失败，请刷新页面重新连接！')
  }
}
function pickup() {
  var seq = $('#skseq').val()
  if (simple != null) simple.answer()
  if (ws != null) {
    if (seq != '0') ws.send(seq + '|' + utilsPage(seq, callAnswer($('#ch').val())))
    else alert('应答失败，请刷新页面重新连接！')
  }
}

function conferen() {
  var seq = $('#skseq').val()
  if (ws != null) {
    if (seq != '0') ws.send(seq + '|' + utilsPage(seq, callConference($('#ch').val())))
    else alert('会议失败，请重试发起！')
  }
}

function consultation() {
  var seq = $('#skseq').val()
  var called = $(ow.document.getElementById('conAgentDn')).val()
  var caller = $('#agentdn').val()

  //alert(seq+"|"+utilsPage(seq,callConsultation($("#ch").val(),caller,called,0,'')));
  if (called == '') {
    alert('请选择咨询对象（号码或分机）')
    return
  }
  alert('咨询  ' + called)
  if (ws != null) {
    if (seq != '0') {
      ws.send(seq + '|' + utilsPage(seq, callConsultation($('#ch').val(), caller, called, 0, '')))
      enabledBtn('conferen')
      stat = 3
    } else alert('咨询失败，请重试发起！')
  }
  m_MyAgentStatus = eMAS.masConsultfirst
  SetButtonView('OnConsult')
  ow.close()
}

function consultGetObject() {
  stat = 2
  var seq = $('#skseq').val()
  if (ws != null) {
    if (seq != '0') ws.send(seq + '|' + utilsPage(seq, trunferGetSkill($('#ch').val())))
    else alert('获取咨询技能组对象，请刷新页面重新连接！')
  }
}

function trunferGetObject() {
  var seq = $('#skseq').val()
  if (stat != 3) {
    zy()
    /*if (ws != null) {
	    	 	if(seq!="0")
	           		ws.send(seq+"|"+utilsPage(seq,trunferGetSkill($("#ch").val())));
				else
	           		alert("获取转移技能组对象，请刷新页面重新连接！");
	    	 }
	    	 */
  } else {
    if (ws != null) {
      if (seq != '0') ws.send(seq + '|' + utilsPage(seq, callTransfer($('#ch').val())))
      else alert('转分机失败，请重试！')
    }
  }
  stat = 1
}

function tranf(skills) {
  alert('转移到  ' + skills)
  var seq = $('#skseq').val()
  if (ws != null) {
    if (seq != '0')
      ws.send(
        seq +
          '|' +
          utilsPage(seq, trunfer($('#ch').val(), $('#agentid').val(), 0, skills.split('`')[0]))
      )
    else alert('转移失败，请刷新页面重新连接！')
  }
  stat = 0
  zyow.close()
}

function getAgents(skill) {
  tempskill = skill
  var seq = $('#skseq').val()
  if (ws != null) {
    if (seq != '0') ws.send(seq + '|' + utilsPage(seq, getAgentsBySkill($('#ch').val(), skill)))
    else alert('获取座席成员失败，请刷新页面重新连接！')
  }
  getConsultAgents()
}
function getConsultAgents() {
  clearTimeout(s)
  if (tempskill != '') {
    var seq = $('#skseq').val()
    if (ws != null) {
      if (seq != '0')
        ws.send(seq + '|' + utilsPage(seq, getAgentsBySkill($('#ch').val(), tempskill)))
      else alert('获取座席成员失败，请刷新页面重新连接！')
    }
    s = setTimeout('getConsultAgents()', 5000)
  }
}

function alertARY() {
  alert(ary.length)
}

function after_bu() {
  var seq = $('#skseq').val()
  if (ws != null) {
    if (seq != '0')
      ws.send(seq + '|' + utilsPage(seq, request_Service($('#ch').val(), $('#skill').val(), 0)))
    else alert('调查失败，请刷新页面重新连接！')
  }
}
function answed() {
  if (simple != null) simple.answer()
}
function reconnect() {
  var seq = $('#skseq').val()
  if (ws != null) {
    if (seq != '0') ws.send(seq + '|' + utilsPage(seq, callReconnect($('#ch').val())))
    else alert('接回失败，请刷新页面重新连接！')
  }
}
function monAction(actiontype, ch, called) {
  /*called=parent.$("#agentdn_").val();
		if(ch=='')
			ch=parent.$("#agentch_").val();
			*/
  if (actiontype == 1) {
    if (called == '') {
      alert('请单击选择对应的分机！')
      return
    }
    var seq = $('#skseq').val()
    if (ws != null) {
      if (seq != '0')
        ws.send(
          seq +
            '|' +
            utilsPage(seq, qiangCha($('#ch').val(), $('#agentdn').val(), called + '4*#', 50, '0'))
        )
      else alert('强插失败，请刷新页面重新连接！')
    }
  } else if (actiontype == 2) {
    if (ch == '') {
      alert('请单击选择对应的分机！')
      return
    }
    var seq = $('#skseq').val()
    if (ws != null) {
      if (seq != '0') ws.send(seq + '|' + utilsPage(seq, callRelease(ch)))
      else alert('强拆失败，请刷新页面重新连接！')
    }
  } else if (actiontype == 3) {
    var seq = $('#skseq').val()
    if (called == '') {
      alert('请单击选择对应的分机！')
      return
    }
    if (ws != null) {
      if (seq != '0')
        ws.send(
          seq +
            '|' +
            utilsPage(seq, jianTin($('#ch').val(), $('#agentdn').val(), called + '4*#', 50, '1'))
        )
      else alert('监听失败，请刷新页面重新连接！')
    }
  } else if (actiontype == 4) {
    var seq = $('#skseq').val()
    if (ws != null) {
      if (seq != '0') ws.send(seq + '|' + utilsPage(seq, agentSetStatuPage(ch, 4, 0)))
      else alert('强制示闲失败，请刷新页面重新连接！')
    }
  } else if (actiontype == 5) {
    var seq = $('#skseq').val()
    if (ws != null) {
      if (seq != '0') ws.send(seq + '|' + utilsPage(seq, agentSetStatuPage(ch, 3, 9)))
      else alert('强制示忙失败，请刷新页面重新连接！')
    }
  } else if (actiontype == 6) {
    var seq = $('#skseq').val()
    if (ws != null) {
      if (seq != '0') ws.send(seq + '|' + utilsPage(seq, callRelease($('#ch').val())))
      else alert('挂机失败，请刷新页面重新连接！')
    }
  } else if (actiontype == 9) {
    var seq = $('#skseq').val()
    if (ws != null) {
      if (seq != '0') ws.send(seq + '|' + utilsPage(seq, reset(parent.$('#agentch_').val())))
      else alert('强制签出失败，请刷新页面重新连接！')
    }
  } else if (actiontype == 10) {
    var seq = $('#skseq').val()
    if (ws != null) {
      if (seq != '0') ws.send(seq + '|' + utilsPage(seq, resetDetail(ch, '', called)))
      /*called 设置为发起人的信息*/ else alert('强制签出失败，请刷新页面重新连接！')
    }
  }
}
function reset(ch) {
  return '<COMMAND name="RESET"  type="IVR">' + '<AGENT_CH>' + ch + '</AGENT_CH>' + '</COMMAND>'
}
function resetDetail(ch, dn, msg) {
  return (
    '<COMMAND name="RESET"  type="IVR">' +
    '<AGENT_CH>' +
    ch +
    '</AGENT_CH>' +
    '<AGENT_DN>' +
    dn +
    '</AGENT_DN>' +
    '<RESETER>' +
    msg +
    '</RESETER>' +
    '</COMMAND>'
  )
}
function query_query() {
  var seq = $('#skseq').val()
  if (ws != null) {
    if (seq != '0') ws.send(seq + '|' + utilsPage(seq, queryStatuPage($('#ch').val())))
    else alert('状态查询失败，请刷新页面重新连接！')
  }
}
function parse() {
  var szTmp =
    '<?xml version="1.0" encoding="utf-8" ?>' +
    '<COMMAND name="LOGIN_RES"  type="ROUTEMSG">' +
    '<SOURCE_TYPE>10</SOURCE_TYPE>' +
    '<SOURCE_SEQUENCE>10</SOURCE_SEQUENCE>' +
    '<RETURN>0</RETURN>' +
    '<REASON>Login OK</REASON>' +
    '</COMMAND>'

  var parsexml = new ParseXml(szTmp)
  var giveupheasstr = parsexml.GiveupHeadString()
  alert(parsexml.GetCommand(giveupheasstr, 'COMMAND', 'name'))
  alert(parsexml.GetValue(giveupheasstr, 'REASON'))
}
//设置随路数据
function setASSOCDATA() {
  var seq = $('#skseq').val()
  var iAssociateDataKey = $('#iAssociateDataKey').val()
  var pAssociateDataVal = $('#pAssociateDataVal').val()
  if (ws != null) {
    if (seq != '0') {
      if (
        utilsPage(
          seq,
          setASSOCIATE_DATA($('#ch').val(), iAssociateDataKey, pAssociateDataVal)
        ).indexOf('undefined') == -1
      ) {
        ws.send(
          seq +
            '|' +
            utilsPage(seq, setASSOCIATE_DATA($('#ch').val(), iAssociateDataKey, pAssociateDataVal))
        )
      }
    }
  }
}

/*************************************/
var ow = null
var zyow = null
var timer
function IfWindowClosed() {
  if (ow != null) {
    if (ow.closed) {
      if (wsx != null) wsx.send('closed')
      ow = ''
    } else if (ow.closed == false) {
      var sysid = $('#sysid').val()
      var skill = $('#_skill').val()
      wsx.send('skill,' + skill + ',' + sysid)
    }
  }
}
function getSkillAgentInfo(skill) {
  //alert(skill);
  var sysid = $('#sysid').val()
  $('#_skill').val(skill)
  if (wsx != null) wsx.send('skill,' + skill + ',' + sysid)
}
timer = window.setInterval('IfWindowClosed()', 2000)
/*************************************/

function initCallRecord() {
  var callRecord = getCookie('callRecord')
  if (callRecord != '') {
    var arrayObj = callRecord.split(',')
    arrayObj.reverse()
    $('#my-dropdown-footer').empty()
    for (var i = 0; i < arrayObj.length; i++) {
      var obj = arrayObj[i].split('|')
      var telnumb = obj[0].split(':')
      var type = obj[1].split(':')
      var t = type[1]
      var phone = telnumb[1]
      if (t == '0') {
        $(
          '<a onclick="document.getElementById(\'txt2\').value=this.innerText.substr(2);" style="cursor:pointer;text-align:left;">↗&nbsp;' +
            phone +
            '</a>'
        ).appendTo('#my-dropdown-footer')
      } else {
        $(
          '<a onclick="document.getElementById(\'txt2\').value=this.innerText.substr(2);" style="cursor:pointer;text-align:left;">↘&nbsp;' +
            phone +
            '</a>'
        ).appendTo('#my-dropdown-footer')
      }
    }
  }
}

//保存cookie
function saveCookie(phone, type) {
  var p = phone.trim().replace('|', '')
  var arrayObj = []
  var map = new Map()
  var s = 'telnumb:' + p + '|type:' + type
  var callRecord = getCookie('callRecord')
  if (callRecord != '') {
    arrayObj = callRecord.split(',')
    if (arrayObj.length >= 10) {
      arrayObj.shift()
    }
  }
  arrayObj.push(s)
  setCookie('callRecord', arrayObj, 180)
  initCallRecord()
}

// 设置cookie
function setCookie(name, value, day) {
  var oDate = new Date()
  var d = oDate.setDate(oDate.getDate() + day)
  var expires = 'expires=' + oDate
  document.cookie = name + '=' + value + ';' + expires
}
// 获取cookie
function getCookie(name) {
  var strCookie = document.cookie //获取所有的cookie值
  var oArr = strCookie.split(';')
  for (var i = 0; i < oArr.length; i++) {
    var c = oArr[i].trim()
    var oArr2 = c.split('=')
    if (oArr2[0].indexOf(name) > -1) {
      return oArr2[1]
    }
  }
  return ''
}
// 移除cookie
function removeCookie(name) {
  // 将cookie的过期时间设置成过去时间,可以将cookie 移除
  setCookie(name, '', -1)
}

function formatTime(secont) {
  var time = ''
  var m = Math.floor(secont / 60)
  var s = secont % 60
  if (m < 10) {
    time = '0' + m
  } else {
    time = m
    if (time > 99) {
      time = '99'
    }
  }
  if (s < 10) {
    time += ':0' + s
  } else {
    time += ':' + s
  }
  return time
}
