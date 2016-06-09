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

    logo = checkLogo(streamer.logo);

    if(streamer.status === "Online") {
      connect = "online";
      status = '<div class="info"><span class="status"><span class="indicator"></span><span>Online</span></span><span class="viewers"><i class="icon-eye"></i>' + streamer.viewers + '</span></div><div class="description">'+ streamer.game + '<span class="descr-extend">: ' + streamer.description  +'</span></div>';
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

    appendHtml(connect, html);
  }

  function checkLogo(currentLogo) {
    var logo;
    if(currentLogo !== null) {
      logo = currentLogo;
    }
    else {
      logo = './img/question.png';
    }
    return logo;
  }

  function appendHtml(status, html) {
    if(status === "online") {
      $('#online').append(html);
    }
    else if(status === "offline") {
      $('#offline').append(html);
    }
    else {
      $('#closed').append(html);
    }
  }

  $('#btn-online').on('click', function() {
    showStreamers('online');
  });

  $('#btn-offline').on('click', function() {
    showStreamers('offline');
  });

  $('#btn-closed').on('click', function() {
    showStreamers('closed');
  });

  $('#btn-all').on('click', function() {
    $('.streamers div').removeClass('hide');
  })

  function showStreamers(target) {
    $('#' + target).removeClass('hide');
    var targets = ['online', 'offline', 'closed'];
    targets.forEach(function(value) {
      if (target !== value) {
        $('#' + value).addClass('hide');
      }
    });
  }
});
