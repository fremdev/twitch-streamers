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
    var connect, logo, status;

    if(streamer.logo !== null) {
      logo = streamer.logo;
    }
    else {
      logo = 'http://cdn.sstatic.net/Sites/stackoverflow/img/apple-touch-icon.png?v=c78bd457575a';
    }

    if(streamer.status === "Online") {
      connect = "online";
      status = '<div class="info"><span class="indicator">Online</span><span class="viewers">' + streamer.viewers + '</span></div><div class="description">'+ streamer.game + '<span class="descr-extend">: ' + streamer.description  +'</span></div>';
    }
    else if(streamer.status === "Offline"){
      connect = "offline"
      status = streamer.status;
    }
    else {
      connect = "closed";
      status = streamer.status;
    }

    html += '<div class="streamer ' + connect + '"><div class="logo"><img src="' + logo;
    html += '"></div><div class="name">' + streamer.name + '</div>';
    html += '<div class="status">' + status + '</div>';
    html += '</div>';

    $('#streamers').append(html);
  }
});
