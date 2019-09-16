	//toast的弹出
	// function toast_msg(msg) {
	// 	$(".toast").toast("show")
	// 	$(".toast .toast-body").text(msg)
	// }

$(function() {
	$("ul.nav").on("click","li",function() {
		// console.log($(this).attr("url"))
		
		$("#content").empty()
		$("#content").load("./donghua.html"+"?time="+Math.random())
		
		// setTimeout(function() {
			$("#content").hide()
			$("#content").load($(this).attr("url")+"?time="+Math.random())
			$("#content").fadeIn(1000)
	// },1000)
		//toast的初始化
		// $(".toast").toast({
		// 			autohide:true,
		// 			delay:1500
		// 		})

})

})
