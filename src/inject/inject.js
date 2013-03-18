chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		// clearInterval(readyStateCheckInterval);

		// ----------------------------------------------------------
		// This part of the script triggers when page is done loading
		// console.log("Hello. This message was sent from scripts/inject.js");
		// ----------------------------------------------------------
    
    (function($){
      //Code starts here.
     
      // $.getJSON("https://twitter.com/i/expanded/batch/313643988294979584" + "?facepile_max=7&include%5B%5D=social_proof&include%5B%5D=ancestors&include%5B%5D=descendants")
      // .success(function(data){
      //   console.log(data);
      // })
      getAllTweetIds(function(err,ids){
        // https://api.twitter.com/1/statuses/show/313613570455781377.json
        for (var i = 0;i<ids.length;i++){
          (function(i){


            $.getJSON("https://twitter.com/i/expanded/batch/" + ids[i] + "?facepile_max=1&include%5B%5D=social_proof&include%5B%5D=ancestors&include%5B%5D=descendants")
            .success(function(data){
              var rt,fc;
              var a= data.social_proof;

              RTregex = /<strong>(?:\s)*([0-9]*)(?:\s)*<\/strong>(?:\s)*retweets/gi;            
              var match = RTregex.exec(a);;
              if(!match){
                rt = 0;
              }else{
                rt = match[1];
              }

              FCregex = /<strong>(?:\s)*([0-9]*)(?:\s)*<\/strong>(?:\s)*favorites/gi;
              match = FCregex.exec(a);
              if(!match){
                fc=0;
              }else{
                fc=match[1];
              }

              //Now select the element and update the information
              var rtEle = (rt!=0)?$("<span></span>").append("<strong>"+rt + "</strong> Retweets"):"";

              var favEle = (fc!=0)?$("<span></span>").append("<strong>" + fc + "</strong> Favorites"):"";

              var bwEle = (rt!=0 && fc!=0)?"&nbsp;&nbsp;&nbsp;":"";

              var ele = (rt!=0 || fc!=0)?$("<span id='tweetstats-details' style='color:rgb(153, 153, 153);'></span>").append("(").append(rtEle).append(bwEle).append(favEle).append(")"):"";
              $("[data-item-id=" +ids[i]+ "][data-item-type=tweet] .stream-item-header .time #tweetstats-details").remove();
              $("[data-item-id=" +ids[i]+ "][data-item-type=tweet] .stream-item-header .time").prepend(ele);
              // $("[data-item-id=" +ids[i]+ "][data-item-type=tweet]").addClass("tweetstats-recorded")
              // console.log(rt);
            })
            .error(function(data){
              console.log("ERROR");
              console.log(arguments);
            })  
          })(i);
        }
      });

    })(jQuery)



	}
	}, 1000);
});


function getAllTweetIds(cb){
  var tweetIds = new Array();

  var count = 0
  var tweets = $("[data-item-type=tweet]:not(.tweetstats-recorded)");
  tweets.each(function(){
    $(this).addClass("tweetstats-recorded");
    tweetIds.push($(this).attr("data-item-id"));
    if (++count >= tweets.length){
      cb(null,tweetIds);
    }
  })
}