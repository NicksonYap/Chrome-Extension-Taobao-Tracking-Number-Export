const laravelDomain = "https://laravel-purchase-pool-nicksonyap-3.c9users.io/" //must have '/' character at the end



function onWindowLoad() {



    chrome.tabs.executeScript(null, {
        file: "jquery-2.2.2.min.js"
    }, function() {
        chrome.tabs.executeScript(null, {
            file: "moment.js"
        }, function() {
            chrome.tabs.executeScript(null, {
                file: "content_script.js"
            }, function() {


                chrome.cookies.get({
                    "url": laravelDomain + "taobao/order/add",
                    "name": 'XSRF-TOKEN'
                }, function(cookie) {
                    var laravelXSRFToken = cookie.value;

                    chrome.tabs.query({
                        active: true,
                        currentWindow: true
                    }, function(tabs) {
                        console.log(tabs[0].id);
                        chrome.tabs.sendMessage(tabs[0].id, {
                            action: "laravelXSRFToken",
                            source: laravelXSRFToken
                        });
                        console.log(laravelXSRFToken);
                    });



                });

            });
        });
    });




}

var count = 0;
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log(request);
    if (request.action == "getAllItemAndTrackingInfo") {

        $('#message').remove();

        //paidListings[count][0] //date
        //paidListings[count][1]  //status
        //paidListings[count][2] //tradeID
        //paidListings[count][3]  //sellerID
        //paidListings[count][4] //sellerName
        //paidListings[count][5][0] = [] //array of item id
        //paidListings[count][5][1] = [] //array of item names
        //paidListings[count][5][2] = [] //array of item snapshot id
        //paidListings[count][5][3] = [] //array of item price
        //paidListings[count][5][4] = [] //array of item quantity
        //paidListings[count][6]  //total cost
        //paidListings[count][7]  // tracking number
        //paidListings[count][8]  // shipment provider

        count++;
        $("#target").append('<table id="list"></table>');
        $("#list").append('<tr id="' + count + '"></tr>');
        $("tr#" + count).append("<td>" + count + "</td>");
        $("tr#" + count).append("<td>" + request.source[8] + "</td>");
        $("tr#" + count).append("<td>" + request.source[7] + "</td>");
        $("tr#" + count).append("<td>" + request.source[6][1].toString().substring(0, 30) + "</td>");
        /* $.each(request.source, function(index, value) {
             //$("#list").append("<li>" + (index + 1) + "&nbsp;"+ value[index][8] + "&nbsp;"+ value[index][7] + "&nbsp;" +value[index][5][1][0] + "</li>");
             $("#list").append("<li>" + (index + 1) + "&nbsp;"+ value[index][8] + "&nbsp;"+ value[index][7] +"</li>");
         });*/


        //   message.innerText = request.source;
    }

    if (request.action == "orderList") {
        sendResponse({ farewell: "goodbye" });

        $('#message').remove();

        $("#target").append('<table id="list"></table>');

        request.orderList.forEach(function(order) {
            $("#list").append('<tr id="' + order.no + '"></tr>');
            $("tr#" + order.no).append("<td>" + order.no + "</td>");
            $("tr#" + order.no).append("<td>" + order.shipper + "</td>");
            $("tr#" + order.no).append("<td>" + "'" + order.trackingNum + "</td>");
            $("tr#" + order.no).append("<td>" + order.title + "</td>");
            $("tr#" + order.no).append("<td>" + order.time + "</td>");
            $("tr#" + order.no).append("<td>" + order.trackingStat + "</td>");

        })


    }

});


window.onload = onWindowLoad;
