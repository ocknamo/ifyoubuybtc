(function () {
    'use strict';
    const DateInput = document.getElementById('date-input');
    const evaluationButton = document.getElementById('evaluation-button');
    const resultDivided = document.getElementById('result-area');
    const tweetDivided = document.getElementById('tweet-area');

    /**
    * 指定した要素の子どもを全て削除する
    * @param {HTMLElement} element HTMLの要素
    */
    function removeAllChildren(element) {
        while (element.firstChild) { // 子どもの要素があるかぎり削除
            element.removeChild(element.firstChild);
        }
    }

    /**
     * ボタンが押された時に査定を開始する 
     */
    evaluationButton.onclick = () => {
        const inputDate = DateInput.value;
        if (inputDate.length === 0) {  //日付が空の場合は処理を終了する。
            // 結果表示エリアとツイートエリアを削除する。
            const reload = document.createElement('p');
            removeAllChildren(resultDivided);
            removeAllChildren(tweetDivided);
            reload.innerText = 'ブラウザをリロードして再度お試しください。';
            resultDivided.appendChild(reload);
            return;
        }
        // 結果表示エリアとツイートエリアを削除する。
        removeAllChildren(resultDivided);
        removeAllChildren(tweetDivided);
        // "査定中..."と表示
        const loading = document.createElement('p');
        loading.innerText = '査定中...';
        resultDivided.appendChild(loading);
        // 査定を行う関数を呼び出します。
        // 査定処理に時間がかかるため処理終了後showResult関数をコールバックします。
        evaluation(showResult, inputDate);
    };
    /**
     * 査定結果を表示する関数
    */
    var showResult = function (param, inputDate, lastprice, exchange, pastprice, usdjpyrate) {
        // '査定中...'の文字を削除
        removeAllChildren(resultDivided);
        // 査定結果表示エリアの作成
        const header = document.createElement('h3');
        header.innerText = '査定結果';
        resultDivided.appendChild(header);
        param = Math.round(param);
        // 査定結果を読みやすいように'XXX,XXX,XXX,XXX 円'の形式に変更する。
        var money = adjustMoney(param);
        //  査定金額を表示
        const lastresult = document.createElement('h2');
        lastresult.innerText = money;
        resultDivided.appendChild(lastresult);
        // 説明を表示
        let description = inputDate + 'に1万円分のビットコインを買っていれば、今頃は' + money + 'でした。';
        const paragraph = document.createElement('p');
        paragraph.innerText = description;
        resultDivided.appendChild(paragraph);

        // 取引所と価格を表示
        if (exchange === 'bitflyer') {
            let description2 = '(現在のビットコイン価格を' + lastprice + '円、' + inputDate + 'の取引所' + exchange + 'の終値を' + pastprice + '円を用いて計算しています。)';
            const paragraph2 = document.createElement('p');
            paragraph2.innerText = description2;
            resultDivided.appendChild(paragraph2);
        } else {
            let description2 = '(現在のビットコイン価格を' + lastprice + '円、' + inputDate + 'の取引所' + exchange + 'の終値を' + pastprice + 'ドルとし為替を1ドル' + usdjpyrate + '円として計算しています。)';
            const paragraph2 = document.createElement('p');
            paragraph2.innerText = description2;
            resultDivided.appendChild(paragraph2);
        }

        // ツイートエリアの作成
        const anchor = document.createElement('a');
        const hrefValue = 'https://twitter.com/intent/tweet?button_hashtag=' + encodeURIComponent('もしビットコインを買っていたら') + '&ref_src=twsrc%5Etfw';
        anchor.setAttribute('href', hrefValue);
        anchor.className = 'twitter-hashtag-button';
        anchor.setAttribute('data-text', description);
        anchor.setAttribute('data-url', 'http://www.nemazon.org/ifyoubuybtc.html');
        anchor.setAttribute('data-lang', 'ja');
        anchor.setAttribute('data-show-count', 'false');
        anchor.innerText = 'ツイートする';
        tweetDivided.appendChild(anchor);
        twttr.widgets.load();

        // 追記事項を表示

        if (!param) {  //査定結果がNaNの場合'査定できませんでした。日付が有効か確かめてください'と表示する
            removeAllChildren(resultDivided);
            removeAllChildren(tweetDivided);
            paragraph.innerText = '査定できませんでした。日付が有効か確認してください';
            resultDivided.appendChild(paragraph);
            return;
        }

    }

    /**
         *  与えられた整数を
         *    d   c   b   a
         *   "XXX,XXX,XXX,XXX 円"の形に整形する関数。1千億まで対応可能
         *  @param {Number} 金額
         *  @return {string} 査定金額 "XXX,XXX,XXX,XXX 円"
        */
    var adjustMoney = function (param) {
        let a = param % 1000;
        let b = Math.floor(param / 1000) % 1000
        let c = Math.floor(param / 1000000) % 1000
        let d = Math.floor(param / 1000000000) % 1000
        // 先頭からソートして値が入ってない桁を空欄にする
        if (d === 0) {
            d = '';
            if (c === 0) {
                c = '';
                if (b === 0) {
                    b = '';
                }
            }
        }
        // 足りない場合に先頭に0を追加する関数。
        function adjustData(data) {
            if (data < 100 && data >= 10) {
                data = '0' + data;
            } else if (data < 10 && data !== 0) {
                data = '00' + data;
            } else if (data == 0) {
                data = '000';
            }
            return data;
        };
        // 自分よりも上の桁に数字が入っている場合のみcの先頭の空欄の桁に'0'を追加する。
        if (d) {
            c = ',' + adjustData(c);
        }
        if (d || c) {
            b = ',' + adjustData(b);
        }
        if (d || c || b) {
            a = ',' + adjustData(a);
        }
        let adjust = d + c + b + a + ' 円';
        return adjust;
    };

    // 過去の為替ドル円相場 月間平均一覧（単位：円）
    const usdjpy = {
        rate201506: 123.67,
        rate201505: 120.84,
        rate201504: 119.51,
        rate201503: 120.36,
        rate201502: 118.77,
        rate201501: 118.26,
        rate201412: 119.43,
        rate201411: 116.4,
        rate201410: 108.02,
        rate201409: 107.38,
        rate201408: 102.97,
        rate201407: 101.75,
        rate201406: 102.07,
        rate201405: 101.83,
        rate201404: 102.5,
        rate201403: 102.35,
        rate201402: 102.12,
        rate201401: 103.8,
        rate201312: 103.58,
        rate201311: 100.11,
        rate201310: 97.82,
        rate201309: 99.18,
        rate201308: 97.8,
        rate201307: 99.63,
        rate201306: 97.27,
        rate201305: 100.97,
        rate201304: 97.75,
        rate201303: 94.87,
        rate201302: 93.12,
        rate201301: 89.2,
        rate201212: 83.91,
        rate201211: 81.05,
        rate201210: 79,
        rate201209: 78.15,
        rate201208: 78.68,
        rate201207: 78.98,
        rate201206: 79.35,
        rate201205: 79.67,
        rate201204: 81.3,
        rate201203: 82.58,
        rate201202: 78.6,
        rate201201: 76.92,
        rate201112: 77.84,
        rate201111: 77.56,
        rate201110: 76.68,
        rate201109: 76.87,
        rate201108: 77.05,
        rate201107: 79.3,
        rate201106: 80.48,
        rate201105: 81.14,
        rate201104: 83.17,
        rate201103: 81.66,
        rate201102: 82.57,
        rate201101: 82.62,
        rate201012: 83.24,
        rate201011: 82.59,
        rate201010: 81.81,
        rate201009: 84.38,
        rate201008: 85.38,
        rate201007: 87.55
    };

    // APIからビットコインの価格を取得する関数
    var requestAjax = function (endpoint, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                callback(this.response);
            }
        };
        xhr.responseType = 'json';
        xhr.open('GET', endpoint, true);
        xhr.send();
    };

    // 日付を指定
    //var date = '2010-07-19';

    /**
     * 日付を指定するとその日ビットコインを1万円買った場合今の価格でいくらになっているかを返してくれる関数 
     * 処理終了後callback関数を実行する
     *  @param {YYYY-mm-dd} inputDate 年月日
     *  @callback {Number}  査定金額
    */
    function evaluation(callBack, inputDate) {
        // unixtime(秒)に変換
        var unixdate = Date.parse(inputDate) / 1000;
        // 現在の時刻を取得
        var now = new Date().getTime() / 1000;
        var roundnow = now - (now%86400);
        ////UNIX時間で場合分けして使用する取引所を選択
        // 1279497600<=mtgox<1382140800<=bitfinex<1435276800<=bitflyer<now
        var exchange = null;
        var url = null;
        var before = unixdate + (86400*8);
        var after = unixdate - (86400*8);
        if (1279497600 <= unixdate && unixdate < 1382140800) {
            exchange = 'mtgox';
            url = 'https://api.cryptowat.ch/markets/mtgox/btcusd/ohlc?periods=86400&before=' + before + '&after=' + after;
        } else if (1382140800 <= unixdate && unixdate <= 1435276800) {
            exchange = 'bitfinex';
            url = 'https://api.cryptowat.ch/markets/bitfinex/btcusd/ohlc?periods=86400&before=' + before + '&after=' + after;
        } else if (1435276800 < unixdate && unixdate <= roundnow-86400) {
            exchange = 'bitflyer';
            url = 'https://api.cryptowat.ch/markets/bitflyer/btcjpy/ohlc?periods=86400&before=' + before + '&after=' + after;
        } else {
            // 日付が範囲外の場合は処理を終了する
            callBack(NaN, inputDate);
            return;
        }
        
        // API から該当するJSONを取得
        url = encodeURIComponent(url);
        requestAjax('ajax.php?url=' + url, function (response) {
            //　ドット表記法とブラケット表記法を併用して検索対象の配列を取得
            let pricelist = response.result["86400"]
            //// バイナリサーチをで一致する値かunixdateを切り上げた日付の終値価格を取得する。
            // pricelistの中央の値の[0]要素を取得してunixdateと比較する >pricelist[round(pricelist.length/2)][0]
            while (middate !== unixdate && pricelist.length > 1) {
                var middate = pricelist[Math.round(pricelist.length / 2)][0];
                if (unixdate < middate) {
                    // middateよりも小さい半分をpricelistに代入する
                    let list = [];
                    for (let i = 0; i < Math.round(pricelist.length / 2); i++) {
                        list[i] = pricelist[i];
                    }
                    pricelist = list;
                } else {
                    // middateよりも大きい半分をpricelistに入れる
                    let list = [];
                    for (let i = 0; i < Math.round(pricelist.length / 2); i++) {
                        list[i] = pricelist[i + Math.round(pricelist.length / 2)];
                    }
                    pricelist = list;
                }
            }

            // 取引所の日付と指定の日付が一致するかを確認する
            if (pricelist[0][0] !== unixdate) {
                console.log('一致する日付が無かったため最も近い日付の価格を使用します。')
            }
            // 以下のようなpricelistから終値を取得
            // [ CloseTime, OpenPrice, HighPrice, LowPrice, ClosePrice, Volume ]
            var pastprice = pricelist[0][4];
            // APIから取得した価格の単位がmtgoxとbitfinexのみbtcusdなのでbtcjpyに変換
            if (exchange === 'mtgox' || exchange === 'bitfinex') {
                // 指定された日付から年と月を抽出
                let d = new Date(unixdate * 1000);
                let year = d.getFullYear();
                let month = d.getMonth() + 1;
                // 過去の為替データを取得しjpyに変換
                if (month < 10) {
                    month = '0' + month;
                }
                var yearmonth = "rate" + year + month;
                var usdjpyrate = usdjpy[yearmonth];
                var pastpricejpy = pastprice * usdjpyrate;
            } else {
                pastpricejpy = pastprice;
            }

            //// 指定した日時にビットコインを１万円買っていたらいくらになっていたかを計算する
            // 今のレートを取得する
            requestAjax('ajax.php?url=' + 'https://api.cryptowat.ch/markets/bitflyer/btcjpy/price', function (response) {
                if (!response.result.price) {
                    alert('最新の価格が取得できませんでした。しばらくしてからやり直してください。');
                }
                var lastprice = response.result.price;
                var evaluate = lastprice / pastpricejpy * 10000;
                callBack(evaluate, inputDate, lastprice, exchange, pastprice, usdjpyrate);
                //査定結果をcallback関数に渡す
            });
        });

    }
})();