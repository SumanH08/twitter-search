/*Use lodash library */

function onload() {
  console.log("Hello!");

  $('#search-twitter').submit(function(event) {
    event.preventDefault();
    sendToServer();
  })

  $("#option1").click(function() {
    if ($("#input-text").val()) {
      $("#input-text").val('');
    }

    $("#selected").text("Tweets from"); // $("#selected").text($(this).text());
    $("#tweet-type").html("@");
    $(".select-input").html(`<div class="tags-select">
        <p>Example:
          <a id = "example1" href="#" onClick="addTextTag('h_suman'); return false">h_suman,</a>
          <a id="example2" href="#" onClick="addTextTag('taylorswift13'); return false"> taylorswift13</a>
        </p>
      </div>`)
  });

  $("#option2").click(function() {
    if ($("#input-text").val()) {
      $("#input-text").val('');
    }
    $("#selected").text("Hashtag");
    $("#tweet-type").html("#");
    $("#example1").html("Soccer,");
    $("#example2").html(" Food");

    $(".select-input").html(`<div class="tags-select">
        <p>Example:
          <a href="#" onClick="addTextTag('Soccer'); return false">Soccer,</>
          <a href="#" onClick="addTextTag('Food'); return false"> Food</>
        </p>
      </div>`)
  });

}

function addTextTag(text) {
  // document.getElementById('input-text').value = text;

  $("#input-text").val(text);
}

function sendToServer() {

  var valueFromInput = $('#input-text').val();
  var tweetType = $("#tweet-type").html();
  var urlToSend = "";
  var profileAPI = "https://twitter-search-js.herokuapp.com/tweets?q=";
  var hashtagAPI = "https://twitter-search-js.herokuapp.com/search?q=";

  if (tweetType == "@") {
    urlToSend = profileAPI + valueFromInput;
  } else if (tweetType == "#") {
    urlToSend = hashtagAPI + valueFromInput;
  } else {
    console.log("Please enter a valid input");
  }

  sendAJAXReqest(urlToSend)
}

function sendAJAXReqest(urlToSend) {
  $.ajax({
    url: urlToSend,
    success: function(result) {
      renderResult(result);
    },
    error: function(err) {
      renderError(err.status);
    }
  });
}

function renderResult(result) {
  var resulthtml = "";
  // var tweets = result.tweets;
  // console.log(tweetType);
  // console.log(tweets.statuses.length);

  if ($("#tweet-type").val() == "@") {
    var tweets = result.tweets;
    console.log(result.tweets);
    //use map if
    for (var i = 0; i < tweets.length; i++) {
      var tweet = tweets[i];
      var picture = "";


      var photos = tweet.entities.media;
      if (photos) {
        for (var j = 0; j < photos.length; j++) {
          var img = photos[j].media_url;
          picture += `<img src="${img}" />`;
        }
      }
      // var images = tweet.entities.media.media_url;

      var time = getTime(tweet.created_at);

      var tweetHTML = `<div class="card-bg">
                          <div>
                            <img class= "profile-pic" src="${tweet.user.profile_image_url}"/>
                          </div>
                          <div class="row desc">${tweet.text}</div>
                          <div class="images">${picture}</div>
                          <div class="row" style="text-align:left">
                            <div class="col-md-2"></div>
                            <div class="col-md-2"><i class="fa fa-heart" aria-hidden="true"> ${tweet.favorite_count}</i></div>
                            <div class="col-md-2"><i class="fa fa-retweet" aria-hidden="true"> ${tweet.retweet_count}</i></div>
                            <div class="col-md-2"></div>
                            <div class="col-md-4">${time}</div>
                        </div>
                    </div> `
      resulthtml = resulthtml + tweetHTML;
    }

    $(".result-section").html(resulthtml);
  } else {
      var tweets = result.tweets.statuses;
      console.log(result.tweets);
      for (var i = 0; i < tweets.length; i++) {
        var tweet = tweets[i];
        var picture = "";
        var photos = tweet.entities.media;
        if (photos) {
          for (var j = 0; j < photos.length; j++) {
          var img = photos[j].media_url;
          picture += `<img src="${img}" />`;
        }
        }
      // var images = tweet.entities.media.media_url;

      var time = getTime(tweet.created_at);

      var tweetHTML = `<div class="card-bg">
                          <div>
                            <img class= "profile-pic" src="${tweet.user.profile_image_url}"/>
                          </div>
                          <div class="row desc">${tweet.text}</div>
                          <div class="images">${picture}</div>
                          <div class="row" style="text-align:left">
                            <div class="col-md-2"></div>
                            <div class="col-md-2"><i class="fa fa-heart" aria-hidden="true"> ${tweet.favorite_count}</i></div>
                            <div class="col-md-2"><i class="fa fa-retweet" aria-hidden="true"> ${tweet.retweet_count}</i></div>
                            <div class="col-md-2"></div>
                            <div class="col-md-4">${time}</div>
                        </div>
                    </div> `
      resulthtml = resulthtml + tweetHTML;
    }

    $(".result-section").html(resulthtml);
  }

}

function getTime(time) {
  // var dt = time;
  var st = new Date(time);
  // dt = dt.split(" ",3);
  var test = time.split(" ", 3).join(" ");
  var curr_hour = st.getHours();
  var curr_min = st.getMinutes();

  //Suman's noob code!
  // var AM_PM = "";
  //
  // if(curr_hour < 12){
  //   AM_PM = "AM";
  // }
  // else{
  //   AM_PM = "PM";
  // }

  var AM_PM = "PM";
  if (curr_hour < 12) {
    AM_PM = "AM";
  }

  if (curr_hour == 0) {
    curr_hour = 12;
  } else if (curr_hour > 12) {
    curr_hour = curr_hour - 12;
  }

  return `${test} ${curr_hour}:${curr_min} ${AM_PM}`;
}
