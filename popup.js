// const laravelDomain = 'https://laravel-purchase-pool-nicksonyap-3.c9users.io/'; //must have '/' character at the end

function onWindowLoad() {
  var working_url = 'https://buyertrade.taobao.com/trade/itemlist/list_bought_items.htm';
  working_url.length;

  chrome.tabs.query(
    {
      active: true,
      currentWindow: true
    },
    function(tabs) {
      var current_tab = tabs[0];
      console.log(current_tab);

      // var current_url = window.location.toString();
      var current_url = current_tab.url;
      console.log(current_url.substr(0, working_url.length));

      if (current_url.substr(0, working_url.length) != working_url) {
        chrome.tabs.create({ url: 'https://buyertrade.taobao.com/trade/itemlist/list_bought_items.htm' });
      } else {
        chrome.tabs.executeScript(
          null,
          {
            file: 'content_script.js'
          },
          function() {
            /* chrome.cookies.get(
            {
            url: laravelDomain + 'taobao/order/add',
            name: 'XSRF-TOKEN'
            },
            function(cookie) {
            var laravelXSRFToken = cookie.value;
    
            chrome.tabs.query(
                {
                active: true,
                currentWindow: true
                },
                function(tabs) {
                console.log(tabs[0].id);
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: 'laravelXSRFToken',
                    source: laravelXSRFToken
                });
                console.log(laravelXSRFToken);
                }
            );
            }
        ); */
          }
        );
      }
    }
  );
}

var count = 0;
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log(request);

  if (request.action == 'orderList') {
    sendResponse({ farewell: 'goodbye' });

    $('#message').remove();

    $('#target').append('<table id="list" style="white-space:nowrap;width:700px;height:700px;overflow: scroll;"></table>');

    request.orderList.forEach(function(order) {
      $('#list').append('<tr id="' + order.no + '"></tr>');
      $('tr#' + order.no).append('<td>' + order.no + '</td>');
      $('tr#' + order.no).append('<td>' + order.shipper + '</td>');
      $('tr#' + order.no).append('<td>' + "'" + order.trackingNum + '</td>');
      $('tr#' + order.no).append('<td>' + order.title + '</td>');
      $('tr#' + order.no).append('<td>' + order.time + '</td>');
      $('tr#' + order.no).append('<td>' + order.trackingStat + '</td>');
      $('tr#' + order.no).append('<td>' + "'" + order.orderId + '</td>');
      $('tr#' + order.no).append('<td>' + order.total_price + '</td>');
    });
  }

  if (request.action == 'message') {
    sendResponse({ farewell: 'goodbye' });

    // $('#message').remove();

    $('#message').text(request.message);
  }
});

window.onload = onWindowLoad;
