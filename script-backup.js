/*Use lodash library */
/*talk about flexbox and bootstrap 4 grid system*/

function onload() {
  console.log("Hello hi!");


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

function pop() {
  $('[data-toggle="popover"]').popover({
    container: 'body',
    html: true,
    placement: 'auto right',
    trigger: 'hover',
    selector: '.profile-pic',
    content: function() {
      return $("#popover-content").html();
    }
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

function goToSomeplace(onClickValue, symbol) {
  console.log("Coming to click function");

  if (symbol == "@") {
    $("#selected").html("Tweets from");
    $("#tweet-type").html("@");
    $("#input-text").val(onClickValue);
  } else {
    $("#selected").html("Hashtag");
    $("#tweet-type").html("#");
    $("#input-text").val(onClickValue);
  }

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

  if ($("#tweet-type").html() == "@") {
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
      // console.log("printing hash");
      // console.log(hash);
      //
      // var hash_start = [];
      // var hash_end = [];
      // for(var k = 0; k < hash.length; k++){
      //     hash_start.push(hash[k].indices[0]);
      //     hash_end.push(hash[k].indices[1]);
      // }
      //
      //
      // var user = tweet.entities.user_mentions;
      // var user_start = [];
      // var user_end = [];
      //
      // for(var m = 0; m < user.length; m++){
      //   user_start.push(user[m].indices[0]);
      //   user_end.push(user[m].indices[1]);
      // }


      // for(var l=0; l < tweet.text.length; l++){
      //   if(hash_start.indexOf(l) != -1){
      //     output_text += "<a>"
      //   }
      //   else if(hash_end.indexOf(l) != -1){
      //     output_text += "</a>"
      //   }
      //   else if(user_start.indexOf(l) != -1){
      //     output_text += "<a href='#'>";
      //   }
      //   else if(user_end.indexOf(l) != -1){
      //     output_text += "</a>";
      //   }
      //
      //   output_text += tweet.text[l];
      // }

      var output_text = tweet.text;

      var hash = tweet.entities.hashtags;

      for (var k = 0; k < hash.length; k++) {
        output_text = output_text.replace("#" + hash[k].text, `<a href="#" onclick = "goToSomeplace('${hash[k].text}', '#');">#${hash[k].text}</a>`);
      }

      var user = tweet.entities.user_mentions;
      for (var m = 0; m < user.length; m++) {

        output_text = output_text.replace("@" + user[m].screen_name, `<a href="#" onclick = "goToSomeplace('${user[m].screen_name}', '@');">@${user[m].screen_name}</a>`)
      }

      var url_arr = tweet.entities.urls;

      for (var n = 0; n < url_arr.length; n++) {
        output_text = output_text.replace(url_arr[n].url, `<a target="_blank" href="${url_arr[n].expanded_url}">${url_arr[n].display_url}</a>`);
      }

      var mediaURL = tweet.entities.media || [];

      for (var p = 0; p < mediaURL.length; p++) {
        output_text = output_text.replace(mediaURL[p].url, "");
      }


      console.log(typeof(tweet.text));
      var time = getTime(tweet.created_at);

      var tweetHTML = `<div class="card-bg hey">
                        <div style="width: 100%; overflow:hidden;">
                          <div class="profile">
                          <a href ="#" data-toggle="popover" animation=false;>
                            <img class= "profile-pic" src="${tweet.user.profile_image_url}" alt="Profile picture"/>
                          </a>
                          <div id="popover-content" class="hide">
                          <table class="table">
                            <thead>
                              <tr>
                              <td>
                              <div class="img-pop">
                          <img class= "profile-pic" src="${tweet.user.profile_image_url}" alt="Profile picture"/>
                            </div>
                              </td>
                            </tr>
                            </thead>
                            <tbody>
                            <tr><td class="no-border" style="font-size: 20px">
                          <div><b>${tweet.user.name}</b></div>
                          </td></tr>
                          <tr><td class="no-border" style="padding:0 0 0 8px; color:rgba(0,0,0,0.5);">
                          <div>@${tweet.user.screen_name}</div>
                          </td></tr>
                            <tr><td class="no-border">
                            <div><i>${tweet.user.description}</i></div>
                            </td></tr>
                          </tbody>
                          </table>
                          </div>
                          </div>
                          <div class="profile-text">
                            <div>${output_text}</div>
                            <div class="images">${picture}</div>
                            <div class="footer">
                              <table class = "table">
                                <thead>
                                  <tr>
                                    <td><i class="fa fa-heart" aria-hidden="true"> ${tweet.favorite_count}</i></th>
                                  <td><i class="fa fa-retweet" aria-hidden="true"> ${tweet.retweet_count}</i></th>
                                  <td style="text-align:right; padding:8px 0 8px 8px;">${time}</th>
                                  </tr>
                                </thead>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div> `
      resulthtml = resulthtml + tweetHTML;
    }

    $(".result-section").html(resulthtml);
    pop();

  } else {
    var tweets = result.tweets.statuses;
    console.log(result.tweets);
    for (var i = 0; i < tweets.length; i++) {
      var tweet = tweets[i];
      var picture = "";
      var photos = tweet.entities.media;
      console.log(photos);

      if (photos) {
        for (var j = 0; j < photos.length; j++) {
          var img = photos[j].media_url;
          picture += `<img src="${img}" />`;
        }
      }
      // var images = tweet.entities.media.media_url;

      var output_text = tweet.text;

      var hash = tweet.entities.hashtags;

      for (var k = 0; k < hash.length; k++) {
        output_text = output_text.replace("#" + hash[k].text, `<a href="#" onclick = "goToSomeplace('${hash[k].text}', '#');">#${hash[k].text}</a>`);
      }

      var user = tweet.entities.user_mentions;
      for (var m = 0; m < user.length; m++) {
        console.log("Printing type of hash value");
        console.log(typeof(user[m].screen_name));

        output_text = output_text.replace("@" + user[m].screen_name, `<a href="#" onclick = "goToSomeplace('${user[m].screen_name}', '@');">@${user[m].screen_name}</a>`)
      }

      var url_arr = tweet.entities.urls;

      for (var n = 0; n < url_arr.length; n++) {
        output_text = output_text.replace(url_arr[n].url, `<a target="_blank" href="${url_arr[n].expanded_url}">${url_arr[n].display_url}</a>`);
      }

      var mediaURL = tweet.entities.media || [];

      for (var p = 0; p < mediaURL.length; p++) {
        output_text = output_text.replace(mediaURL[p].url, "");
      }

      var time = getTime(tweet.created_at);

      var tweetHTML = `<div class="card-bg">
                        <div style="width: 100%; overflow:hidden;">
                          <div class="profile">
                          <a href ="#" data-toggle="popover" animation=false;>
                            <img class= "profile-pic" src="${tweet.user.profile_image_url}" alt="Profile picture"/>
                          </a>
                          <div id="popover-content" class="hide">
                          <table class="table">
                            <thead>
                              <tr>
                              <td>
                              <div class="img-pop">
                          <img class= "profile-pic" src="${tweet.user.profile_image_url}" alt="Profile picture"/>
                            </div>
                              </td>
                            </tr>
                            </thead>
                            <tbody>
                            <tr><td class="no-border" style="font-size: 20px">
                          <div><b>${tweet.user.name}</b></div>
                          </td></tr>
                          <tr><td class="no-border" style="padding:0 0 0 8px; color:rgba(0,0,0,0.5);">
                          <div>@${tweet.user.screen_name}</div>
                          </td></tr>
                            <tr><td class="no-border">
                            <div><i>${tweet.user.description}</i></div>
                            </td></tr>
                          </tbody>
                          </table>
                          </div>
                          </div>
                          <div class="profile-text">
                            <div>${output_text}</div>
                            <div class="images">${picture}</div>
                            <div class="footer">
                              <table class = "table">
                                <thead>
                                  <tr>
                                    <td><i class="fa fa-heart" aria-hidden="true"> ${tweet.favorite_count}</i></th>
                                  <td><i class="fa fa-retweet" aria-hidden="true"> ${tweet.retweet_count}</i></th>
                                  <td style="text-align:right; padding:8px 0 8px 8px;">${time}</th>
                                  </tr>
                                </thead>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div> `
      resulthtml = resulthtml + tweetHTML;
    }
    $(".result-section").html(resulthtml);
    pop();
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
