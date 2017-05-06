
var totalYears;
var lumpsum;
function getLumpsum(){
	
	
	totalYears = document.getElementById("lumpsumYears").value;
	lumpsum=document.getElementById("lumpsum").value; 
	
	
	 localStorage.lumpsum = lumpsum;
	 localStorage.lumpYears = totalYears;
	 localStorage.lumpsumInvestment = true;	
	console.log("years"+totalYears+"amt"+lumpsum);
sessionStorage.setItem('tempGoals', JSON.stringify({currentPage:4}));
	window.location.href = "/GoalSelection";
	
}


function showLumpsum(){
	
	$("#setMood").attr("src", "images/emergencyFundsMood.png");  
	$("#setMoodText").hide(); 
	$(" .moodGoals > img,.page5 > p,.page6 > p").css("visibility","hidden");  
	$(" .slider").css("visibility","hidden");
	$(" .contentMood .page4 #invest").css("visibility","hidden");
	  $(".contentMood .page1, .contentMood .page2,.contentMood .page3, .page3Sub,.contentMood .page4 .sub-page4").hide();
	$(".page2 .dotHr").hide();
	
	  $(".contentMood .page4,.contentMood .page4 .selectMode").show();
/*	console.log("years"+localStorage.years+"time"+	 localStorage.sip);*/
}
	
