// var CHATBOT_SERVER_HOST = 'https://catai.cc';
// var CHATBOT_PROJECT_ID = '82920c07-7b2f-4c92-b85f-e551ad10b4e6';

$(document).ready(function() {
    var chatbox = [
        "<div class='chatbot-box'>",
            "<div class='chatbot-loading'><span>起動中です。</span><br><br><button class='chatbot-reload'>リスタート</button></div>",
            "<div class='chatbot-frame'>",
                "<iframe  class='chatbot-iframe' style='width:100%;height:100%;border:none' allow='geolocation' ></iframe>",
                // "<button class='close'><img src='assets/img/btn_down_02_n.png'/></button>",
            "</div>",
            
        "</div>"].join('');
    //var chatbtn = "<button class='chatbot-start'><img src='assets/img/intro_icon.png'/></button>"

    $(chatbox).appendTo('body');
    //$(chatbtn).appendTo('body');

    // $(".chatbot-start").on('click', function(){
    //     $('.chatbot-start').css('display','none')   
    //     $('.chatbot-box').css('display','block')
    //     $('.chatbot-frame').animate({top:"0px"})

    //     $loadchatbot();
    // })

    // $(".close").on('click', function(){
    //     $('.chatbot-frame').animate({top:"615px"},function(){
    //         $('.chatbot-box').css('display','none')
    //         $('.chatbot-start').css('display','block')   
    //     })
    // })

    $('.chatbot-reload').on('click', function(){
        $loadchatbot();
    });

    $('.chatbot-box').css('display','block')
    $('.chatbot-frame').animate({top:"0px"})
    $loadchatbot();

});

function $loadchatbot(){

    //chatbotのURL
    var origin  = document.location.href.match(/https?:\/\/[^\/]*/)[0];
    //var chatboturl = CHATBOT_SERVER_HOST + '/service/#/' + CHATBOT_PROJECT_ID + '?origin=' + origin;
    // 2022/12/07 パラメータを受け取れるよう修正
    if(CHATBOT_URL.indexOf('?') == -1){
        var chatboturl = CHATBOT_URL + '?origin=' + origin;
    }else{
        var chatboturl = CHATBOT_URL + '&origin=' + origin;
    }

    var max = 10; //1間隔で10回リトライ
    var count = 0;

    localStorage.removeItem('chatbot-loaded')
    $('.chatbot-loading').find('span').html('起動中..');
    $('.chatbot-reload').hide();

    var _id = setInterval(function(){
        if(count>=max){
            clearInterval(_id);
            console.log('chatbot not loaded');
            $('.chatbot-loading').find('span').html('チャットボットを開始できませんでした。<br>暫くしてから起動し直してください。');
            $('.chatbot-reload').show();
        }
        count++;
        
        if(window.$chatbot_loaded){
            console.log('chatbot loaded');
            $('.chatbot-loading').hide();
            clearInterval(_id);
            // var frame = $('.chatbot-frame');
            // frame.style.height = content.contentWindow.document.documentElement.scrollHeight + 'px';
            // var content = (frame.contentDocument || frame.contentWindow);
            // content.style.fontSize = "150%";
            // content.style.height = content.contentWindow.document.documentElement.scrollHeight + 'px';
        }

    },1000); 

    $('.chatbot-iframe').attr('src',chatboturl);
}

function postMessage(action, data) {
    var chatFrame = document.querySelector('iframe.chatbot-iframe');

    if( chatFrame instanceof HTMLIFrameElement ) {
        chatFrame.contentWindow.postMessage({
            action, data
        }, '*')
    }
}

function sendMessage(data){
    postMessage('MSG_INPUT', data)
}

function sendState(data){
    postMessage('MSG_STATE', data)
}

// モーダル画面制御
const modal = document.getElementById('agree-modal');
document.getElementById("agree-button").addEventListener('click', function (){
    // 確認ボタン押下時
    //if(document.getElementById('agree-check').checked){
        // チェックが入っていれば閉じる
        // 2022/12/14 チェック関係なく閉じる
        modal.style.display = 'none';
    //}else{
    //    // 入ってなければ赤くしてチェックを促す
    //    document.getElementById('agree-check').style.background = "#ff6347";
    //}
})

document.getElementById('agree-check').addEventListener('click', function (){
    // チェックボックス押下時
    // 押されたら閉じる
    modal.style.display = 'none';
})

window.addEventListener('message',function(event){
    console.log('other site post message received :',event.data);
    var data = event.data;
    var actionData = {};
    
    try {
        data = JSON.parse(data);
    } catch(e) {
        data = {}
    }

    if(data.action=='CHAT_INIT'){
        window.$chatbot_loaded = true;
    }else if(data.action=='CHAT_ACTION'){
        try {
            actionData = JSON.parse(data.data);
        } catch(e) {
            actionData = {}
        }
        if(actionData.method == 'GeolocationPicker') {
            initMap(actionData.loc,actionData.address);
            console.log("loc.lat:"+actionData.loc.lat+" address:" + actionData.address + " home_depot:" + actionData.homeDepot);
            console.log("prefectures:" + actionData.prefectures + " houseNumber:" + actionData.houseNumber + " buildingName:" + actionData.buildingName);

            document.getElementById("address").innerHTML = actionData.prefectures + actionData.houseNumber + "<br/>" +  actionData.buildingName;

            if(actionData.homeDepot == "自宅前道路"){
                document.getElementById("homeDepotText").innerHTML = actionData.homeDepot;
            }else{
                document.getElementById("homeDepotText").innerHTML = "普段利用されている" + actionData.homeDepot;
            }

            modal.style.display = 'block';

            $("#popup-overlay").show();
        }
    }
})
