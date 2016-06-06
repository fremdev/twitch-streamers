$(document).ready(function() {

  var streamers = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas", "comster404"];
  var streamersData = {};
  streamers.forEach(function(streamer) {
    getChannelInfo(streamer);
  });

  function getChannelInfo(streamer) {
    var streamsUrl = createUrl(streamer, 'streams');
    $.getJSON(streamsUrl, function(streamsInfo) {
      streamersData[streamer] = {};
      if(streamsInfo.stream === undefined) {
        streamersData[streamer].status = "Account closed";
      }
      else if(streamsInfo.stream === null) {
        streamersData[streamer].status = "Offline";
      }
      else {
        streamersData[streamer].status = "Online";
        streamersData[streamer].description = streamsInfo.stream.channel.status;
        streamersData[streamer].game = streamsInfo.stream.game;
        streamersData[streamer].viewers = streamsInfo.stream.viewers;
      }
      var channelUrl = createUrl(streamer, 'channels');
        $.getJSON(channelUrl, function(channelInfo) {
          if(streamersData[streamer].status === "Account closed") {
            streamersData[streamer].logo = null;
            streamersData[streamer].name = streamer;
          }
          else {
            streamersData[streamer].logo = channelInfo.logo;
            streamersData[streamer].name = channelInfo.display_name;
          }
          createMarkup(streamersData[streamer]);
        });
    });
  }

  function createUrl(streamer, content) {
    var apiUrl = 'https://api.twitch.tv/kraken/';
    apiUrl += content;
    apiUrl += '/' + streamer + '?callback=?';
    return apiUrl;
  }

  function createMarkup(streamer) {
    var html = '';
    var connect = '';
    html += '<div class="streamer ' + connect + '"><div class="logo"><img src="';
    if(streamer.logo !== null) {
      html += streamer.logo;
    }
    else {
      html += 'http://cdn.sstatic.net/Sites/stackoverflow/img/apple-touch-icon.png?v=c78bd457575a';
    }
    html += '"></div><div class="name">';
    html += streamer.name;
    html += '</div>';
    if(streamer.status === "Online") {
      connect = "online";
      html += '<div class="status">Online</div>';
    }
    else {
      html += '<div class="status">Offline</div>';
    }

    html += '</div>';
    $('#streamers').append(html);
  }
});
