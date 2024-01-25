$(document).ready(function() {
    var chatbox = [
        "<div class='chatbot-box'>",
            "<div class='chatbot-loading'><span>起動中です。</span><br><br><button class='chatbot-reload'>リスタート</button></div>",
            "<div class='chatbot-frame'>",
                "<iframe  class='chatbot-iframe' style='width:100%;height:100%;border:none' allow='geolocation' ></iframe>",
            "</div>",  
        "</div>"].join('');

    $(chatbox).appendTo('body');
  
    $('.chatbot-reload').on('click', function(){
        $loadchatbot();
    });

    $('.chatbot-box').css('display','block')
    $('.chatbot-frame').animate({top:"0px"})
    $loadchatbot();
});

function $loadchatbot(){
    var origin  = document.location.href.match(/https?:\/\/[^\/]*/)[0];

    if(CHATBOT_URL.indexOf('?') == -1){
        var chatboturl = CHATBOT_URL + '?origin=' + origin;
    }else{
        var chatboturl = CHATBOT_URL + '&origin=' + origin;
    }

    var max = 10;
    var count = 0;

    localStorage.removeItem('chatbot-loaded')
    $('.chatbot-loading').find('span').html('起動中..');
    $('.chatbot-reload').hide();

    var _id = setInterval(function(){
        if(count>=max){
            clearInterval(_id);
            console.log('chatbot not loaded');
            $('.chatbot-loading').find('span').html('チャットボットを開始できませんでした。');
            $('.chatbot-reload').show();
        }
        count++;
        
        if(window.$chatbot_loaded){
            console.log('chatbot loaded');
            $('.chatbot-loading').hide();
            clearInterval(_id);
       
        }

    },1000); 
    console.log( "chatboturl ",chatboturl );
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

function sendOutMessage(data){
    postMessage('MSG_OUTPUT', data)
}

function sendState(data){
    postMessage('MSG_STATE', data)
}

function sleep(msec) {
    return new Promise(function(resolve) {
        setTimeout(function() {resolve()}, msec);
    })
}

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
       
        if(actionData.method == 'delayedPfMsg') {
           let time = actionData && actionData.time ? actionData.time:2000;
            sleep(time);
            console.log('sendMsg');
            sendMessage("はい");

        }else if(actionData.method == 'showMap_markerInfoWindow'){
            initMap(actionData.loc, actionData.address, actionData.query, actionData.target, actionData.restParam);
            $("#popup-overlay").show();
        }else if(actionData.method == 'yamatoModal'){
            $("#popup-overlay").show();
        }
    }
})
