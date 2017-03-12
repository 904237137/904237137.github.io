$(window).scroll(function() {
    if ($(".navbar").offset().top > 50) {
        $(".navbar-fixed-top").addClass("top-nav-collapse");
        $(".navbar-fixed-top").removeClass("top-nav-collapse2");
        //$("#logoId").src="images/logo.png"; 
        $("#logoId").attr("src","../images/logo.png");       
    } else {
    	$(".navbar-fixed-top").addClass("top-nav-collapse2");
        $(".navbar-fixed-top").removeClass("top-nav-collapse");
        $("#logoId").attr("src","../images/logo2.png");
    }
});
$(".rightBtn").click(function(){ 
    if($("body").hasClass("togg")){
    	$("body").removeClass("togg")
    }else{
    	$("body").addClass("togg") 
    }
})