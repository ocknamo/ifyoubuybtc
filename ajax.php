<?php
if(isset($_GET["url"]) && preg_match("/^https?:/",$_GET["url"])){
    echo file_get_contents($_GET["url"]);
}else{
    echo "error";
}
/**
if($_GET["url"] == 'mtgox'){
 $pricedata = file_get_contents('https://api.cryptowat.ch/markets/mtgox/btcusd/ohlc?periods=86400&after=1279497599');
echo $pricedata;
}else if($_GET["url"] == 'bitflyer'){
    $pricedata = file_get_contents('https://api.cryptowat.ch/markets/bitflyer/btcjpy/ohlc?periods=86400&after=1435276799');
    echo $pricedata;
}else if($_GET["url"] == 'bitfinex'){
    $pricedata = file_get_contents('https://api.cryptowat.ch/markets/bitfinex/btcusd/ohlc?periods=86400&after=1382140799');
    echo $pricedata;
}else if($_GET["url"] == 'lastprice'){
    $pricedata = file_get_contents('https://api.cryptowat.ch/markets/bitflyer/btcjpy/price');
    echo $pricedata;
}else{
    echo "error";
}
*/