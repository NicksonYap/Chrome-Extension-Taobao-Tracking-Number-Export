request orders list by page:
url: https://buyertrade.taobao.com/trade/itemlist/asyncBought.htm?action=itemlist/BoughtQueryAction&event_submit_do_query=1&_input_charset=utf8
paramsw: pageNum=2&pageSize=15&prePageNo=1

request tracking info by trade ID:
https://detail.i56.taobao.com/call/queryTrace.do?dimension=TRADE_ID&tradeId=1740634583158324

request tracking info by trade ID:
https://buyertrade.taobao.com/trade/json/transit_step.do?bizOrderId=1760764813158324

request order message by trade ID:
/trade/json/getMessage.htm?biz_order_id=1760764813158324&user_type=1&archive=false

check sampleresponse.json and sampleCarData.js


add to cart:
.each item and option has own SKU ID
https://cart.taobao.com/add_cart_tiny.htm?item_id=39929950662&sku_id=86706614650&quantity=1&t=1459844143249&ct=166b870381e9692005a82000077a43db&source=&_tb_token_=U4u5YdmNOTPj3d3&type=beforeAddToCart

get item info:
https://detailskip.taobao.com/service/getData/1/p2/item/detail/sib.htm?itemId=39929950662&modules=qrcode,viewer,price,contract,xmpPromotion,dynStock,delivery,sellerDetail,activity,fqg,zjys,coupon&callback=onSibRequestSuccess
see getIitemInfoResponse.js

get item desc:
https://desc.alicdn.com/i1/391/291/39929950662/TB1iJrhLVXXXXXKXVXX8qtpFXlX.desc%7Cvar%5Edesc%3Bsign%5E36886b5732aba55d9365b5fa980384b7%3Blang%5Egbk%3Bt%5E1457688164
see getIitemDescResponse.html

extend item time:
first:
url: https://buyertrade.taobao.com/trade/buyerDelayConfirmGoodsTimeHandler.do
params: bizType=200&bizOrderId=1754742896098324&hasRefund=true&stepNo=0

respone:
{"status":true,"callBackUrl":"https://buyertrade.taobao.com/trade/buyer_delay_confirm_goods_time_callback.do?cell_redirect=0&is_success=T&out_trade_no=T200P1754742896098324&token=newTimeOut&extend_time=259200&hasRefund=false&bizType=200&bizOrderId=1754742896098324"}

then: https://buyertrade.taobao.com/trade/buyer_delay_confirm_goods_time_callback.do?cell_redirect=0&is_success=T&out_trade_no=T200P1754742896098324&token=newTimeOut&extend_time=259200&hasRefund=false&bizType=200&bizOrderId=1754742896098324
response:  {"status":true,"delayedDays":3}