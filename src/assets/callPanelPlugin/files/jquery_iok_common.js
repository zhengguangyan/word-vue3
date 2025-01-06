 
  var selectSysTreeDialog;
  /**
   * 选择系统树字典等
   */
  function selectSysTree(title,url,isMany,textName,valueName,returnPathName){
	  url+="&checkbox="+isMany;
	  if(!selectSysTreeDialog){
		  selectSysTreeDialog = new top.Dialog();
		}
	  selectSysTreeDialog.Title=title;
	  selectSysTreeDialog.Modal=false;
	  selectSysTreeDialog.Width=200;
	  selectSysTreeDialog.Height=300; 
	  selectSysTreeDialog.URL=url;
	  selectSysTreeDialog.ShowButtonRow=true;	
	  selectSysTreeDialog.OKEvent = function(){
			var nodes=selectSysTreeDialog.innerFrame.contentWindow.getSelectedNode();
			//alert(nodes);
			  // 多选
			 if(isMany){ 
					var txt = '';
					var val = '';
					for(var i=0; i<nodes.length; i++){
						if (txt != '') txt += ';';
						txt += nodes[i].name;
						if (val != '') val += ';';
						val += nodes[i].ID;
					} 
					$('#'+textName).val(txt);
					$('#'+valueName).val(val);
			 }else{
				 	// 单选					
					 if(returnPathName){
						 $('#'+textName).val(getPathName(nodes));
					 }else{
						 $('#'+textName).val(nodes.name);
					 }
					$('#'+valueName).val(nodes.ID);
			 }
			 selectSysTreeDialog.close();
		}	
	  selectSysTreeDialog.show();
	  selectSysTreeDialog.addButton("clearSelect","清 空",function(){
           $('#'+textName).val("");
           $('#'+valueName).val("");
           selectSysTreeDialog.close();
        })
  	} 
	 function getPathName(node){
		 var str=node.name;
		 var pnode=node.parentNode;
		 if(pnode!=null){
			 //str=pnode.name+">"+str;
			 if(pnode.parentNode!=null){
				 getPathName(pnode.parentNode)
			 }
		 }
		 return str;
	 }
	 function formatSeconds(value) {  
		    var theTime = parseInt(value);// 秒  
		    var theTime1 = 0;// 分  
		    var theTime2 = 0;// 小时  
		    if(theTime > 60) {  
		        theTime1 = parseInt(theTime/60);  
		        theTime = parseInt(theTime%60);  
		            if(theTime1 > 60) {  
		            theTime2 = parseInt(theTime1/60);  
		            theTime1 = parseInt(theTime1%60);  
		            }  
		    }  
		        var result = ""+parseInt(theTime)+"秒";  
		        if(theTime1 > 0) {  
		        result = ""+parseInt(theTime1)+"分"+result;  
		        }  
		        if(theTime2 > 0) {  
		        result = ""+parseInt(theTime2)+"小时"+result;  
		        }  
		    return result;  
		}  
	 function formatSeconds2(a) {   
		  var hh = parseInt(a/3600);  
		  if(hh<10) hh = "0" + hh;  
		  var mm = parseInt((a-hh*3600)/60);  
		  if(mm<10) mm = "0" + mm;  
		  var ss = parseInt((a-hh*3600)%60);  
		  if(ss<10) ss = "0" + ss;  
		  var length = hh + ":" + mm + ":" + ss;  
		  if(a>0){  
		    return length;  
		  }else{  
		    return "NaN";  
		  }  
		} 
	 