var totalYears;
var sip;
function getSIP(){
	// debugger;	
	//alert("dad");
	var sipInvestValue = $('#sip').val();
	var sipTime = $('#year').val();
	if ( sipInvestValue < 1000 || sipInvestValue > 100000 ){ 
		$('#sipInvestErr').slideDown();
	} else if ( sipTime < 1 || sipTime > 50 ) {
		$('#sipInvestErr').slideUp(); 
		$('#sipTimeErr').slideDown();
	} else {
		// debugger;
		$('#sipInvestErr').slideUp; 
		$('#sipTimeErr').slideUp();
		totalYears = document.getElementById("years").value;
		sip=document.getElementById("sip").value; 
		localStorage.sip = sip;
		localStorage.years = totalYears;
		localStorage.sipInvestment = true;	
		console.log("years"+totalYears+"time"+sip);
		sessionStorage.setItem('tempGoals', JSON.stringify({currentPage:4}));
		window.location.href = "/GoalSelection";
	}
}

function showSIP(){	
	$("#setMood").attr("src", "images/emergencyFundsMood.png");  
	$("#setMoodText").hide(); 
	$(".moodGoals > img").css("visibility","hidden");  
	$(".slider").css("visibility","hidden");
	$(".contentMood .page4 #invest").css("visibility","hidden");
	$(".contentMood .page1, .contentMood .page2,.contentMood .page3, .page3Sub,.contentMood .page4 .sub-page4").hide();
	$(".page2 .dotHr").hide();
	$(".contentMood .page4,.contentMood .page4 .selectMode").show();
	/*	console.log("years"+localStorage.years+"time"+	 localStorage.sip);*/
}
