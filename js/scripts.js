$(document).ready(function() {

  var streamers = ["comster404", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas", "ESL_SC2"];
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
    var connect, logo, status, linkStart, linkEnd;

    linkStart = '<a href="https://www.twitch.tv/'+ streamer.name.toLowerCase() + '">';
    linkEnd = '</a>';

    if(streamer.logo !== null) {
      logo = streamer.logo;
    }
    else {
      logo = 'http://cdn.sstatic.net/Sites/stackoverflow/img/apple-touch-icon.png?v=c78bd457575a';
    }

    if(streamer.status === "Online") {
      connect = "online";
      status = '<div class="info"><span class="status"><span class="indicator"></span><span>Online</span></span><span class="viewers"><i class="icon-users-1"></i>' + streamer.viewers + '</span></div><div class="description">'+ streamer.game + '<span class="descr-extend">: ' + streamer.description  +'</span></div>';
    }
    else {
      if(streamer.status === "Offline"){
        connect = "offline";
      }
      else if(streamer.status === "Account closed") {
        connect = "closed";
        linkStart = "";
        linkEnd = "";
      }
      status = '<span class="status"><span class="indicator"></span><span>'+ streamer.status +'</span></span>';
    }

    html += '<div class="streamer ' + connect + '">' + linkStart + '<div class="logo"><img src="' + logo;
    html += '"></div><div class="name">' + streamer.name + linkEnd + '</div>';
    html += '<div class="status-block">' + status + '</div>';
    html += '</div>';

    if(connect === "online") {
      $('#online').append(html);
    }
    else if(connect === "offline") {
      $('#offline').append(html);
    }
    else {
      $('#closed').append(html);
    }

  }
});
