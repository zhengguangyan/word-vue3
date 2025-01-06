 var wsx = null;
function openSocket(url,skill)
{
	if ('WebSocket' in window) {
        wsx = new WebSocket(url);  
    } else if ('MozWebSocket' in window) {
    	wsx = new MozWebSocket(url);
       
    } else {

        alert('Your browser Unsupported WebSocket!');
        //return;
    }

    //打开socket
	wsx.onopen = function() {
		var sysid=$("#sysid").val();
		wsx.send("open"+sysid);
		wsx.send("skill,"+skill+","+sysid);
    };

    //消息处理
    wsx.onmessage = function(event) {
    	var str=event.data;
		if(str.indexOf("skill")==0)
    		{
    			str=str.replace("skill","");
    			eval("var skilljson="+str);
    			if(ow!=null)
    			{
    				var w2s=ow.document.getElementById("win2skill");
    			
	    			$(w2s).append("<br/>");
	    			$(w2s).append("<tr><td>归属队列</td></tr>");
	    			$(w2s).append("<tr><td class=button><input type=\"button\" value=\"所有\" onclick=\"opener.getAgentInfo('');\"/>");
	    			for (j=0;j<skilljson.length;j++ ) 
	    			{ 
	    				$(w2s).append("<tr><td class=button><input type=\"button\" value=\"获取“"+skilljson[j].SERVICE_NAME+"”座席\" onclick=\"opener.getAgentInfo('"+skilljson[j].SERVICE_CMD+"');\" ></td></tr><tr><td>&nbsp;</td></tr>");
	    			}
    			}
    			if(zyow!=null)
    			{
	    			var ws=zyow.document.getElementById("winskill");
	    	   		for(var i=0; i<skilljson.length; i++){
	    	   			$(ws).append("<tr><td><input type=\"button\" class=button value=\"转移\" onclick=\"opener.tranf('"+skilljson[i].SERVICE_CMD+"')\"></td><td>"+skilljson[i].SERVICE_NAME+"</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td></tr>");
	    	   		}
    			}
    		}else if(str.indexOf("agent")==0)
    			{
	    			var table=ow.document.getElementById("personTable");
	    			for(var k=table.rows.length;k>0;k--)
	    				table.deleteRow(table.rows.rowIndex);
	    			{	
	    				var tr = table.insertRow(table.rows.length);
	    				var td1 = tr.insertCell(0);
	    		        td1.align = "center";
	    		        var td2 = tr.insertCell(1);
	    		        td2.align = "center";
	    		        var td3 = tr.insertCell(2);
	    		        td3.align = "center";
	    		        var td4 = tr.insertCell(3);
	    		        td4.align = "center";
	    	        	td1.innerHTML = "姓名";
	    		        td2.innerHTML = "工号"; 
	    		        td3.innerHTML = "分机";
	    		        td4.innerHTML = "状态";
	    			}
    				var w2a=ow.document.getElementById("win2agent");
    				$(w2a).html("");
	    			str=str.replace("agent","");
	    			eval("var agentjson="+str);
	    			$(w2a).append("<br/>");
	    			
	    			for (j=0;j<agentjson.length;j++ ) 
	    			{ 
	    		        var tr = table.insertRow(table.rows.length); 
	    		        var td1 = tr.insertCell(0);
	    		        td1.align = "center";
	    		        var td2 = tr.insertCell(1);
	    		        td2.align = "center";
	    		        var td3 = tr.insertCell(2);
	    		        td3.align = "center";
	    		        var td4 = tr.insertCell(3);
	    		        td4.align = "center";
	    		        var nowsta="";
	    				if(parseInt(agentjson[j].NowStatus)==0)
	    					nowsta="签出";
	    				else if(parseInt(agentjson[j].NowStatus)==4)
	    					{
	    						nowsta="工作";tr.style.backgroundColor = "#8ff5ba";
	    					}
	    				else if(parseInt(agentjson[j].NowStatus)==5)
	    					nowsta="事后";
	    				else if(parseInt(agentjson[j].NowStatus)==6)
	    					{
	    						nowsta="通话中";tr.style.backgroundColor = "#ff9c9c";
	    					}
	    				else if(parseInt(agentjson[j].NowStatus)==3)
	    					{
	    						nowsta="休息中";tr.style.backgroundColor = "#aadbfd";
	    					}
	    		        td1.innerHTML = agentjson[j].agentname;
	    		        td2.innerHTML = agentjson[j].agentid;
	    		        td3.innerHTML = agentjson[j].AGENTDN;
	    		        td4.innerHTML = nowsta;
	    		        tr.onclick = (function (td3){return function(){myfunc1(td3);}})(td3);
	    			}
	    			
    			}
    };

    //关闭socket
    wsx.onclose = function() {
    	$("#_skill").val("");
    };
}
function myfunc1(td3)
{
	$(ow.document.getElementById("conAgentDn")).val(td3.innerText);
}

/**********************咨询&转移窗口****************************/
	
function zx(skill)
{
	ow=null;zyow=null;
    //获得窗口的垂直位置 
    var iTop = (window.screen.availHeight - 30 - 500) / 2; 
    //获得窗口的水平位置 
    var iLeft = (window.screen.availWidth - 10 - 650) / 2; 
    var apiurl=$("#apiurl").val();
    $("#_skill").val(skill);
	ow=window.open(" ", "咨询", "height=500, width=650,toolbar=no,scrollbars=yes,menubar=no,left="+iLeft); 
	//写成一行 
	ow.document.write("<HTML><HEAD></HEAD><TITLE>咨询</TITLE>");
	ow.document.write("<BODY onload=\"opener.openSocket(\'"+apiurl+"\',\'"+skill+"\');\">"); 
	ow.document.write("<div style=\"width:600px;height:450px;background:#fafafa;\">");
	ow.document.write("<div style=\"background:#fafafa;padding:0px;width:180px;height:100%;vertical-align:top;float:left;\"");
	ow.document.write("<table width=\"100%\" border=\"1\"  style=\"background:#fafafa;padding:0px;border:1px;\">");
	ow.document.write("<div id=\"win2skill\">&nbsp;</div>");
	ow.document.write("</table>");
	ow.document.write("</div>");
	ow.document.write("<div style=\"background:#fafafa;padding:0px;width:200px;height:100%;float:left;\">");
	ow.document.write("<table width=\"400px\" border=\"1px\" style=\"background:#fafafa;border-collapse: collapse;font-size: 9pt;float:left;\" id=\"personTable\">");
	ow.document.write("<div id=\"win2agent\">&nbsp;</div>");
	ow.document.write("<tr><td align=\"center\">姓名</td><td align=\"center\">工号</td><td align=\"center\">分机</td><td align=\"center\">状态</td></tr>");
	ow.document.write("</table>");
	ow.document.write("<table width=\"400px\" border=\"0px\" align=\"center\"><tr><td>咨询对象</td><td><input type=\"text\" id=\"conAgentDn\" value=\"\" maxlength=\"12\" size=\"12\"/></td><td><input type=\"button\" value=\"确定咨询\" onclick=\"opener.consultation();\"/></td></tr></table>");
	ow.document.write("</div>");
	ow.document.write("</div>");
	ow.document.write("</BODY>");
	ow.document.write("</HTML>");
	ow.document.close();
}

function dialPlate()
{
	ow=null;zyow=null;
    //获得窗口的垂直位置 
    var iTop = (window.screen.availHeight - 30 - 500) / 2; 
    //获得窗口的水平位置 
    var iLeft = (window.screen.availWidth - 10 - 650) / 2; 
	ow=window.open("./files/dialOut.html", "拨号盘", "height=430, width=314,toolbar=no,scrollbars=yes,menubar=no,left="+iLeft); 
}

function zy()
{	ow=null;zyow=null;
	var apiurl=$("#apiurl").val();
	//获得窗口的垂直位置 
    var iTop = (window.screen.availHeight - 30 - 500) / 2; 
    //获得窗口的水平位置 
    var iLeft = (window.screen.availWidth - 10 - 650) / 2; 
    zyow=window.open(" ", "转移", "height=400, width=200,toolbar=no,scrollbars=yes,menubar=no,left="+iLeft); 
    zyow.document.write("<HTML><HEAD></HEAD><TITLE>转移</TITLE>");
    zyow.document.write("<BODY onload=\"opener.openSocket(\'"+apiurl+"\',\'\');\">"); 
    zyow.document.write("<div style=\"background:#fafafa;padding:0px;width:100%;height:100%;\">");
    zyow.document.write("<table align=\"center\" style=\"background:#fafafa;padding:0px;width:100%;height:100%;\">");
    zyow.document.write("<div id=\"winskill\"></div>");
    zyow.document.write("</table>");
    zyow.document.write("</div>");
    zyow.document.write("</BODY>");
    zyow.document.write("</HTML>");
    zyow.document.close();
}
