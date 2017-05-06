$(document).ready(function(){


(function($) {

	var 
        yFrog = $('.logo-icon'),
        BlueFrog = $('.logo-icon-blue'),
        logo = $('#investory'),
        dots = $(".how-it-works .pagination>li>div"),
        head1 = $(".yourMood > h1"),
        head4 = $(".yourMood > h4"),
        headP = $(".yourMood > p"),
        frogPan = $("#flashPan"),
        frogPackage1 = $(".Package #p2"),
        frogPackage2 = $(".Package #p3"),
        frogCoin2 = $(".investing #f2"),
        frogCoin3 = $(".investing #f3"),
        frogWithdraw1 = $(".Withdraw #w1"),
        frogWithdraw2 = $(".Withdraw #w2"),
        sectionColor = $('#section1'),
        circle1 = $("#bg_color #circle_1"),
        circle2 = $("#bg_color #circle_2"),
        circle3 = $("#bg_color #circle_3"),
        circle4 = $("#bg_color #circle_4"),
        circle5 = $("#bg_color #circle_5"),
        circle6 = $("#bg_color #circle_6"),
        circle7 = $("#bg_color #circle_7"),
        circle8 = $("#bg_color #circle_8"),
        circle9 = $("#bg_color #circle_9"),
        circleSpan = $("#bg_color .circle span"),
        circleSpan7 = $("#bg_color .circlewhite span")

    ;

     var	turnBlue = new TimelineMax();
    
    function blueFrog(){

    
       turnBlue = new TimelineMax();

        turnBlue

            .fromTo([logo, yFrog], 0.7, { opacity: 1 }, {  opacity: 0 })
        .fromTo(BlueFrog, 0.7, { opacity: 0 }, {  opacity: 1 })


        ;
        
    }
    
  $(".how-it-works .pagination").hover(function(){
      
      var	showSLide = new TimelineMax();

        showSLide
            .staggerFromTo(dots, 0.3,
				{x: -50 ,autoAlpha: 0},
				{x: 0,  autoAlpha: 1, ease:Back.easeOut}, 0.05)
        .staggerFromTo(".how-it-works .pagination li >a", 0.3,
				{x: -50 ,autoAlpha: 0},
				{x: 0,  autoAlpha: 1, ease:Back.easeOut}, 0.05, "-=0.3")
        ;

  });
  
    
//  alert($(window).scrollTop());

        var	contentIn = new TimelineMax({onComplete: blink});

        contentIn
           

            .to(head1, 1.5, {text:"“The goal is not more money. It’s to live life on your terms”",  ease:Linear.easeNone})
       /* .to(head4, 1.5, {text:"Your investory. Our Expertise.",  ease:Linear.easeNone})
          .to(headP, 1, {text:"How are you feeling today",  ease:Linear.easeNone})*/
			.fromTo(head4, 1, {autoAlpha:0},
				   {autoAlpha: 1})
		.fromTo(headP, 1, {autoAlpha:0},
				   {autoAlpha: 1})
      
        ;

function blink(){

$(headP).append(" <span>?</span> ");

  QuesBlink = $(".yourMood > p > span ");
      var	textBlink = new TimelineMax({ repeat: 10});

        textBlink
        
        .fromTo(QuesBlink, 1.5, {opacity: 1}, {opacity: 0, ease:Linear.easeNone})
        .set(QuesBlink, {opacity: 1})
           

      
        ;

    
}
    
    
      var	frogWithdrawAnim;
    
    $(".Withdraw").on({
        
        
    mouseenter : function(){
        
       frogWithdrawAnim = new TimelineMax({repeat: 1});

        frogWithdrawAnim 
        
        
          .fromTo(frogWithdraw1, 0.2, {opacity: 1}, {opacity: 0, ease:Linear.easeNone})
         .fromTo(frogWithdraw2, 0.3, {opacity: 0}, {opacity: 1, ease:Linear.easeNone})
        
        
        ;
        
    },
         mouseleave : function(){
        
         
    }
    
   });
   
  var	frogPackageAnim;
    
    $(".Package").on({
        
        
    mouseenter : function(){
        
       frogPackageAnim = new TimelineMax({repeat: 5});

        frogPackageAnim 
        
        
          .fromTo(frogPackage1, 0.2, {opacity: 1}, {opacity: 0, ease:Linear.easeNone})
         .fromTo(frogPackage2, 0.2, {opacity: 0}, {opacity: 1, ease:Linear.easeNone})
        
        
        ;
        
    },
         mouseleave : function(){
        
         
    }
    
   } );
    
    
    var	frogPanAnim;
    
    $(".PAN").on({
        
        
    mouseenter : function(){
        
       frogPanAnim = new TimelineMax();

        frogPanAnim 
        
          .fromTo(frogPan, 0.5, {opacity: 1}, {opacity: 0, ease:Linear.easeNone})
         .fromTo(frogPan, 0.5, {opacity: 0}, {opacity: 1, ease:Linear.easeNone})
        
        
        ;
        
    },
         mouseleave : function(){
        
         frogPanAnim 
        .set(frogPan, {opacity: 1});
    }
    
   } );
    
    
        var	froginvestingAnim;
    
    $(".investing").on({
        
        
    mouseenter : function(){
        
       froginvestingAnim = new TimelineMax();

        froginvestingAnim 
        
          .to(frogCoin2, 0.7, {y: 50, ease: Power1.easeOut})
         .to(frogCoin3, 0.7, {y: 50, x: -5, ease: Power1.easeOut}, '-=0.7')
         .to(frogCoin3, 0.7, {y:100, ease: Power1.easeOut })
//        .fromTo([frogCoin2], 0.7, { y:-100}, {y: 0, ease:Power1.easeOut})
//         .fromTo(frogCoin3, 0.7, { y:-100, x: 5}, {y: 0, x: 0, ease:Power1.easeOut}, '-=0.7')
        .set([frogCoin3,frogCoin2], {y:0})
        
        ;
        
    },
         mouseleave : function(){
        
    }
    
   } );
    

   jumpBool = true;

    $(".logo").mouseenter(function() {
    if(jumpBool){

         jumpFrog();
        jumpBool = false;
    }

});


  
    
//              $(".main").onepage_scroll({
//    afterMove: function(index) {
// 
//          $a =  $(".main").currentIndex();
//    
//   alert($a);
//    }
//  });
    
  
    
function frogJump(){
    jumpBool = true;
}
    function jumpFrog(){

         var	jump = new TimelineMax({onComplete: frogJump });

        jump

            .fromTo(yFrog, 0.3, {y: 15}, { ease: Power4.easeOut, y:-15})
        .fromTo(yFrog, 0.7, {y: -15}, { ease: Bounce.easeOut,  y:0})


        ;
    }


var someColor;
    
    
function reverseColor()  {
    
fillCirclecolor1 = "#FFFFFF";
    
    var	fillCircleReverse = new TimelineMax();

        fillCircleReverse
        
        
       .set(circleSpan, { css:{background: fillCirclecolor} })
           .set(circleSpan7, { css:{background: fillCirclecolor1} })
        .fromTo(circle1, 0.6, 
        { css:{top: '78%',left: '18%', width: '0%', height: '0%'}},
        { css:{top: '78%',left: '18%', width: '60%', height: '120%'}, ease: Power1.easeOut})
        
        .fromTo(circle2, 0.6, 
        { css:{top: '78%',left: '68%', width: '0%', height: '0%'}},
        { css:{top: '78%',left: '68%', width: '80%', height: '160%'}, ease: Power1.easeOut}, '-=0.5')
        
          .fromTo(circle3, 0.7, 
        { css:{top: '47%',left: '43%', width: '0%', height: '0%'}},
        { css:{top: '47%',left: '43%', width: '60%', height: '120%'}, ease: Power1.easeOut}, '-=0.6')
        
            .fromTo(circle4, 0.7, 
        { css:{top: '2%',left: '90%', width: '0%', height: '0%'}},
        { css:{top: '2%',left: '90%', width: '50%', height: '100%'}, ease: Power1.easeOut}, '-=0.6')
        
                    .fromTo(circle5, 0.7, 
        { css:{top: '2%',left: '2%', width: '0%', height: '0%'}},
        { css:{top: '2%',left: '2%', width: '80%', height: '160%'}, ease: Power1.easeOut}, '-=0.6')
        
                      .fromTo(circle6, 0.7, 
        { css:{top: '90%',left: '90%', width: '0%', height: '0%'}},
        { css:{top: '90%',left: '90%', width: '80%', height: '160%'}, ease: Power1.easeOut}, '-=0.6')
        
        .to(sectionColor, 0.1, {  css:{background: fillCirclecolor},ease:Power1.easeOut }, '-=0.5')
        
        
  
 
    
}
    
    var	fillCirclecolor;
    
    function ruthu(){
        
      
        
        fillCircle.reverse();
        
        
        
    }
    
 
    $.ColorFill= function(fillCirclecolor){
       
   fillCirclecolor1 = "#FFFFFF";
        
	fillCircle = new TimelineMax();
        
        fillCircle
        
        .set(circleSpan, { css:{background: fillCirclecolor} })
         .set(circleSpan7, { css:{background: fillCirclecolor1} })
      
        
        .fromTo(circle1, 0.7, 
        { css:{top: '78%',left: '18%', width: '0%', height: '0%'}},
        { css:{top: '78%',left: '18%', width: '60%', height: '120%'}, ease: Power1.easeOut})
        
        .fromTo(circle2, 0.7, 
        { css:{top: '78%',left: '68%', width: '0%', height: '0%'}},
        { css:{top: '78%',left: '68%', width: '80%', height: '160%'}, ease: Power1.easeOut}, '-=0.6')
        
          .fromTo(circle3, 0.7, 
        { css:{top: '47%',left: '43%', width: '0%', height: '0%'}},
        { css:{top: '47%',left: '43%', width: '60%', height: '120%'}, ease: Power1.easeOut}, '-=0.6')
        
            .fromTo(circle4, 0.7, 
        { css:{top: '2%',left: '90%', width: '0%', height: '0%'}},
        { css:{top: '2%',left: '90%', width: '50%', height: '100%'}, ease: Power1.easeOut}, '-=0.6')
        
                    .fromTo(circle5, 0.7, 
        { css:{top: '2%',left: '2%', width: '0%', height: '0%'}},
        { css:{top: '2%',left: '2%', width: '80%', height: '160%'}, ease: Power1.easeOut}, '-=0.6')
        
                      .fromTo(circle6, 0.7, 
        { css:{top: '90%',left: '90%', width: '0%', height: '0%'}},
        { css:{top: '90%',left: '90%', width: '80%', height: '160%'}, ease: Power1.easeOut}, '-=0.6')
//         .set([circle1,circle2,,circle3,circle4,circle5,circle6],
//           {css:{width:'0%',height:'0%'}})
//        .set(circleSpan, { css:{background: fillCirclecolor1} })
        
                .fromTo(circle9,1, 
        { css:{top: '50%',left: '50%', width: '0%', height: '0%'}},
        { css:{top: '50%',left: '50%', width: '60%', height: '120%'}, ease: Power1.easeOut},'-=0.5')
        
          .fromTo(circle7,1, 
        { css:{top: '20%',left: '30%', width: '0%', height: '0%'}},
        { css:{top: '20%',left: '30%', width: '60%', height: '120%'}, ease: Power1.easeOut},'-=0.8')
              .fromTo(circle8,1, 
        { css:{top: '59.5%',left: '70%', width: '0%', height: '0%'}},
        { css:{top: '59.5%',left: '70%', width: '60%', height: '120%'}, ease: Power1.easeOut},'-=0.8')
        .set(sectionColor, { css:{background: fillCirclecolor1} })
//        
          
//        .set(sectionColor, { css:{background: fillCirclecolor} })
        
//         .set(circleSpan, { css:{background: fillCirclecolor1} })
        
//        
//         .fromTo(circle3, 0.7, 
//        { css:{top: '50%',left: '50%', width: '0%', height: '0%'}},
//        { css:{top: '50%',left: '50%', width: '160%', height: '320%'}, ease: Power1.easeOut},'-=0.6')
//        
        
//        .fromTo(circle1, 0.7, 
//        { css:{top: '78%',left: '18%', width: '0%', height: '0%'}},
//        { css:{top: '78%',left: '18%', width: '60%', height: '120%'}, ease: Power1.easeOut},'-=0.6')
//        
//        .fromTo(circle2, 0.7, 
//        { css:{top: '78%',left: '68%', width: '0%', height: '0%'}},
//        { css:{top: '78%',left: '68%', width: '80%', height: '160%'}, ease: Power1.easeOut}, '-=0.6')
//        
//          .fromTo(circle3, 0.7, 
//        { css:{top: '47%',left: '43%', width: '0%', height: '0%'}},
//        { css:{top: '47%',left: '43%', width: '60%', height: '120%'}, ease: Power1.easeOut}, '-=0.6')
//        
//            .fromTo(circle4, 0.7, 
//        { css:{top: '2%',left: '90%', width: '0%', height: '0%'}},
//        { css:{top: '2%',left: '90%', width: '50%', height: '100%'}, ease: Power1.easeOut}, '-=0.6')
//        
//                    .fromTo(circle5, 0.7, 
//        { css:{top: '2%',left: '2%', width: '0%', height: '0%'}},
//        { css:{top: '2%',left: '2%', width: '80%', height: '160%'}, ease: Power1.easeOut}, '-=0.6')
//        
//                      .fromTo(circle6, 0.7, 
//        { css:{top: '90%',left: '90%', width: '0%', height: '0%'}},
//        { css:{top: '90%',left: '90%', width: '80%', height: '160%'}, ease: Power1.easeOut}, '-=0.6')
//        
//        .to(sectionColor, 0.1, {  css:{background: fillCirclecolor1},ease:Power1.easeOut }, '-=0.5')
//        
        
        
        
        
//        .to(sectionColor, 0.1, {  css:{background: fillCirclecolor},ease:Power1.easeOut }, '-=0.6')
//        
        
        
//        .set([circle1,circle2,circle3,circle4,circle5,circle6],
//            {css:{width:'0%',height:'0%'}})
        ;
  

        

    }





})(jQuery);
});
