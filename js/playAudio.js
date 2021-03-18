// document.getElementsByTagName(‘span’)
// document.querySelectorAll('span')

// var clazz = document.getElementsByClassName("pronounce");
var clazz = document.getElementsByTagName('span');
for (var i = 0; i < clazz.length; i++) {
    if (clazz[i].dataset.event == "pronounce") {
        clazz[i].onclick = function(e) {
            let that = e.target,
                text = !that.dataset.val ? that.innerText : that.dataset.val,
                interpret = !that.dataset.interpret ? '' : that.dataset.interpret
                ;
            if (that.getElementsByClassName("audio").length > 0) {
                // that.removeChild(that.getElementsByClassName("audio")[0]);
                that.getElementsByClassName("audio")[0].play();
            } else {
                //let src = that.dataset.src;
                let src = 'http://dict.youdao.com/dictvoice?audio=' + text + '&type=1'
                let audio = document.createElement("audio");
                audio.setAttribute("class", "audio");
                audio.setAttribute("src", src);
                audio.setAttribute("autoplay", "autoplay");
                that.appendChild(audio);
            }

            youdao(text,interpret);


        }
    }
}



try {
    var ah_nav = document.getElementById("ah_nav"),
        H2 = document.getElementsByTagName('H2')
    ;
    ah_nav.setAttribute("class", "nav")
    for (var i = 0; i < H2.length; i++) {
        if (!!H2[i].getAttribute("id")) {
            var a = H2[i].getElementsByTagName('a')[0].cloneNode(true),
                title = a.getAttribute("title");
            a.innerHTML = (i+1)+"、"+title;
            ah_nav.appendChild(a);
            // console.log(a); insertBefore
        }
    }
} catch (error) {
    
}


//=========== 有道翻译  start =============
var youdao = function(query,interpret){
    if( interpret !=='1' ){
        return;
    }
var appKey = '34b89a3f7eef20fc';
var key = '2B6jYuClxYTONWyvHEFttwWxlwLwxt4T';//注意：暴露appSecret，有被盗用造成损失的风险
var salt = (new Date).getTime();
var curtime = Math.round(new Date().getTime()/1000);
// var query = 'Math';
// 多个query可以用\n连接  如 query='apple\norange\nbanana\npear'
var from = 'AUTO';
var to = 'AUTO';
var str1 = appKey + truncate(query) + salt + curtime + key;
var vocabId =  '您的用户词表ID';
//console.log('---',str1);

var sign = CryptoJS.SHA256(str1).toString(CryptoJS.enc.Hex);
$.ajax({
    url: 'http://openapi.youdao.com/api',
    type: 'post',
    dataType: 'jsonp',
    data: {
        q: query,
        appKey: appKey,
        salt: salt,
        from: from,
        to: to,
        sign: sign,
        signType: "v3",
        curtime: curtime,
        vocabId: vocabId,
    },
    success: function (data) {
        $('.explains_20201220').remove();
        if( data && data.errorCode == '0' ){
            var _html = '';
            if( data.basic && data.basic.explains && data.basic.explains.length ){
                var _lis = data.basic.explains.join('</li><li>');
                _html = '<div class="explains_20201220"><h5 class="explains_tit">'+data.query+'</h5><span class="explains_close">X</span><ul class="explains_ul"><li>'+_lis+'</li></ul></div>';
                $('body').append(_html);
            }else if( data.translation && data.translation.length ){
                var _lis = data.translation.join('</li><li>');
                _html = '<div class="explains_20201220"><h5 class="explains_tit">'+data.query+'</h5><span class="explains_close">X</span><ul class="explains_ul"><li>'+_lis+'</li></ul></div>';
                $('body').append(_html);
            }
        };

        

    } 
});


$('body').on('click','.explains_close',function(){
    $('.explains_20201220').remove();
});

function truncate(q){
    var len = q.length;
    if(len<=20) return q;
    return q.substring(0, 10) + len + q.substring(len-10, len);
}
};
//=========== 有道翻译    end =============