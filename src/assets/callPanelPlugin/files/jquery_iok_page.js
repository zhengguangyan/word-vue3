 $(document).ready(function(){ 

	initSearchMore();
	$(".columnOrder").click(function(k){ 
			var column=$(this)[0].className.split(" ");
			$('#orderColumn').val(column[1]);
			if($('#orderDesc').val()=="" || $('#orderDesc').val()=="desc"){
				//$("#sortId").attr('class',"columnOrder "+column[1]+" ace-icon fa fa-sort-asc bigger-100");
				$('#orderDesc').val("asc");
			}else{
				$('#orderDesc').val("desc");
				//$("#sortId").attr('class',"columnOrder "+column[1]+" ace-icon fa fa-sort-desc bigger-100");
			}
			reloadPage();
	  });
 });


    function reloadPage(){
		  top.jzts();
		  $('#Form').submit();
		  //$(".columnOrder").click();
	}
    
    //查看更多条件
	function toSearchMore(){
		 	if($('.tr_more').css("display")=='none'){
	 		$('.tr_more').show();
	 		$('#searchMore').val('show');
	 	}else{
	 		$('.tr_more').hide(); 
	 		$('#searchMore').val('hide');
	 	} 
	}
	
	function initSearchMore(){
	    if($('#searchMore').val()=='show'){
	    	$('.tr_more').show();
	    }else{
	    	$('.tr_more').hide();
	    }
	}