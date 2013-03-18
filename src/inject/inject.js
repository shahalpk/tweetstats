chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

		// ----------------------------------------------------------
		// This part of the script triggers when page is done loading
		console.log("Hello. This message was sent from scripts/inject.js");
		// ----------------------------------------------------------
    
    (function($){
      //Code starts here.
      console.log("hello there");
     
      // $.getJSON("https://twitter.com/i/expanded/batch/313643988294979584" + "?facepile_max=7&include%5B%5D=social_proof&include%5B%5D=ancestors&include%5B%5D=descendants")
      // .success(function(data){
      //   console.log(data);
      // })
      getAllTweetIds(function(err,ids){
        // https://api.twitter.com/1/statuses/show/313613570455781377.json
        for (var i = 0;i<ids.length;i++){
          $.getJSON("https://twitter.com/i/expanded/batch/" + ids[i] + "?facepile_max=7&include%5B%5D=social_proof&include%5B%5D=ancestors&include%5B%5D=descendants")
          .success(function(data){
            var rt,fc;
            regex = /<strong>([0-9]*)<\/strong> retweets/gi;
            var a= data.social_proof;
            var match = regex.exec(a);;
            if(!match){
              rt = 0;
            }else{
              rt = match[1];
            }
            console.log(rt);
          })
          .error(function(data){
            console.log("ERROR");
            console.log(arguments);
          })  
        }
      });

    })(jQuery)



	}
	}, 10);
});


function getAllTweetIds(cb){
  var tweetIds = new Array();

  var count = 0
  var tweets = $("[data-item-type=tweet]");
  tweets.each(function(){
    tweetIds.push($(this).attr("data-item-id"));
    if (++count >= tweets.length){
      cb(null,tweetIds);
    }
  })
}