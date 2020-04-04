$(document).ready(function() {
  //ref: http://stackoverflow.com/a/1199420/3553367
  String.prototype.trunc =
    String.prototype.trunc ||
    function(n) {
      return this.length > n ? this.substr(0, n - 1) + '&hellip;' : this;
    };

  var trackingCompleted = 0;
  var trackingTotal = 0;

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      //document.getElementById("demo").innerHTML = xhttp.responseText;
      //console.log(xhttp.responseText);
      var returnedJSON = JSON.parse(xhttp.responseText);

      var orderList = [];

      console.log(returnedJSON.mainOrders);

      var count = 0;

      var filteredMainOrders = [];

      returnedJSON.mainOrders.forEach(function(order) {
        var excludeOrder = false;
        var orderTime = moment(order.orderInfo.createTime);
        var startTime = moment('2017-05-14');

        //console.log(orderTime);
        if (!orderTime.isAfter(startTime)) {
          excludeOrder = true;
        }
        /*if(order.statusInfo.text != "交易成功"){
                      excludeOrder = true;
                    }*/

        if (!excludeOrder) {
          trackingTotal++;
          filteredMainOrders.push(order);
        }
      });

      console.log('to be tracked', trackingTotal);

      filteredMainOrders.forEach(function(order) {
        count++;
        var orderItem = {};
        // orderItem.id = order.id;
        orderItem.no = count;
        orderItem.time = order.orderInfo.createTime;
        orderItem.orderId = order.orderInfo.id;
        orderItem.total_price = order.payInfo.actualFee;
        orderItem.shipper = '';
        orderItem.trackingNum;
        orderItem.trackingStat = '';
        orderItem.title = '';

        order.subOrders.forEach(function(subOrder) {
          //orderItem.title += subOrder.itemInfo.title.substring(0, 20) + ";";
          orderItem.title += subOrder.itemInfo.title.trunc(20) + '; ';
        });
        orderItem.title = orderItem.title.trunc((20 + 2) * 3);

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
          if (xhttp.readyState == 4 && xhttp.status == 200) {
            try {
              //document.getElementById("demo").innerHTML = xhttp.responseText;
              var returnedJSON = JSON.parse(xhttp.responseText);

              if (returnedJSON.isSuccess == true || returnedJSON.isSuccess == 'true') {
                console.log(order.id, returnedJSON);
                orderItem.shipper = returnedJSON.expressName;
                orderItem.trackingNum = returnedJSON.expressId;
                if (returnedJSON.address && returnedJSON.address[0]) {
                  orderItem.trackingStat = returnedJSON.address[0].place.trunc(20);
                } else {
                  orderItem.trackingStat = 'NONE';
                }
              } else {
                orderItem.shipper = '-';
                orderItem.trackingNum = '-';
                orderItem.trackingStat = '-';
                console.log(order.id, 'no tracking or cancelled order');
              }

              //console.log(returnedJSON);
              //console.log(orderItem.time, returnedJSON.expressName, returnedJSON.expressId, orderItem.title);
              /* orderItem.shipper = returnedJSON.expressName;
                                 orderItem.trackingNum = returnedJSON.expressId;
                                 orderItem.trackingStat = returnedJSON.address[0].place;*/
            } catch (e) {
              orderItem.shipper = '-';
              orderItem.trackingNum = '-';
              orderItem.trackingStat = '-';
              //console.log(order.id, "no tracking");
              console.log(order.id, 'not json');
            }
            chrome.runtime.sendMessage({ action: 'message', message: JSON.stringify(orderItem) }, function(response) {
              console.log(response.farewell);
            });

            orderList.push(orderItem);

            //console.log(orderItem);

            trackingCompleted++;

            //if tracking completed
            if (trackingCompleted >= trackingTotal) {
              orderList.sort(function(a, b) {
                return a.no - b.no;
              });

              console.log(orderList);

              chrome.runtime.sendMessage({ action: 'orderList', orderList: orderList }, function(response) {
                console.log(response.farewell);
              });
            }
          }
        };
        //var postURL = "https://buyertrade.taobao.com/trade/json/transit_step.do?bizOrderId=" + order.id;
        // var postURL = "https://detail.i56.taobao.com/call/queryTrace.do?dimension=TRADE_ID&tradeId=" + order.id;
        var postURL = 'https://buyertrade.taobao.com/trade/json/transit_step.do?bizOrderId=' + order.id;
        xhttp.open('get', postURL, true);
        //console.log(postURL);
        xhttp.send();
      });

      // console.log(tradeIDs);
    }
  };
  var postURL = '//buyertrade.taobao.com/trade/itemlist/asyncBought.htm?action=itemlist/BoughtQueryAction&event_submit_do_query=1&_input_charset=utf8';
  var params = 'pageNum=1&pageSize=100';
  xhttp.open('post', postURL, true);
  xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  console.log(postURL, params);
  xhttp.send(params);
});
