$(document).ready(function() {

  var streamers = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"];
  var streamersData = {};
  streamers.forEach(function(streamer) {
    getChannelInfo(streamer);
  });

  function getChannelInfo(streamer) {
    var channelUrl = createUrl(streamer, 'channels');
      $.getJSON(channelUrl, function(channelInfo) {
        streamersData[streamer] = {};
        streamersData[streamer].logo = channelInfo.logo;
        streamersData[streamer].name = channelInfo.display_name;

        var streamsUrl = createUrl(streamer, 'streams');
        $.getJSON(streamsUrl, function(streamsInfo) {
          if(streamsInfo.stream === null) {
            streamersData[streamer].online = false;
          }
          else {
            streamersData[streamer].online = true;
            streamersData[streamer].status = streamsInfo.stream.channel.status;
            streamersData[streamer].game = streamsInfo.stream.game;
            streamersData[streamer].viewers = streamsInfo.stream.viewers;
          }
          // console.log(streamersData.freecodecamp);
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
    if(streamer.online) {
      connect = "online";
      html += '<div class="status">Online</div>';
    }
    else {
      connect = "offline";
      html += '<div class="status">Offline</div>';
    }

    html += '</div>';
    $('#streamers').append(html);
  }



});
