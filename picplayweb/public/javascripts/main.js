function imgError(t) {
  t.onerror = null;
  var src=t.src;
  var pattern = /(.+)(\.[^.]+$)/;
  t.src=src.match(pattern)[1]+src.match(pattern)[2].toUpperCase();
}
var instance;
window.addEventListener("load", () => {
  instance = Layzr();
  instance.update().check().handlers(true);
});
function infoExit(){
  document.getElementsByClassName("info")[0].style.display="none";
}
function search(b) {
  if(b===true||b==false&&window.event.keyCode==13){
    var text=document.getElementById("stxt").value;
    if(text==""){
      alert("文字を入力してください");
    }
    else{
      window.location.href = "search?q="+text;
    }
  }
}
//こんな機能誰も求めてないと思うんだけどうるさい人がいるのでいちおう
window.addEventListener("load", () => {
  if(!location.pathname=="/data"||!location.pathname=="/about"){
    checkR18();
  }
  else{
    document.getElementById("wrap").style.transition="all 0s";
    document.getElementsByTagName("html")[0].style.overflow="visible";
    document.getElementsByTagName("body")[0].style.overflow="visible";
    document.getElementById("wrap").style.filter="none";
    document.getElementById("wrap").style.pointerEvents="auto";
  }
});
function r18true(bool){
  if(bool==true){
    document.cookie = 'r18=true;expires=Tue, 1-Jan-2030 00:00:00 GMT;';
  }
  else{
    window.location.href = "/?target=general";
  }
  noticeClose();
}
function checkR18(){
  if(document.cookie.match(/r18=true/)||location.search.match(/target=general/)){
    document.getElementById("wrap").style.transition="all 0s";
    noticeClose();
  }
  else{
    document.getElementById("notice").style.display="block";
  }
}
function r18guest(){
  document.cookie = 'r18=true;';
  noticeClose();
}
function noticeClose(){
  document.getElementsByTagName("html")[0].style.overflow="visible";
  document.getElementsByTagName("body")[0].style.overflow="visible";
  document.getElementById("wrap").style.filter="none";
  document.getElementById("wrap").style.pointerEvents="auto";
  document.getElementById("notice").style.display="none";
}
function rankNext(v){
  v.style.display="none";
  var e= v.parentNode.querySelectorAll('a > .rank_hide');
  var ei=v.parentNode.querySelectorAll('a > .rank_hide > img');
  for(i=0;i<e.length;i++){
    ei[i].dataset.normal=ei[i].dataset.normalhide;
    ei[i].dataset.normalhide=null;
    ei[i].dataset.retina=ei[i].dataset.retinahide;
    ei[i].dataset.retinahide=null;
    e[i].classList.remove("rank_hide");
  }
  instance.update().check();
}
//全部ダウンロードしたぃ
//怒られたらやめる
function download(){
  var res = confirm("【画像一括ダウンロード】\n この機能はサーバーに負荷をかけるため乱用はお避けください。\n 実行しますか？ \n また、この機能はモダンブラウザでのみ利用可能です \n (IE/Safariはモダンブラウザではありません。Chrome/Edge/Firefox/Operaをご利用ください。) ");
  //res=false; //現在利用不可能なため
  if(res==true) {
    console.log(list.length);
    var zip = new JSZip();
    var img = zip.folder("image");
    loop();
    document.getElementById("downCommand").style="display:none";
    document.getElementById("pr1").style="display:block;";
    document.getElementById("pr1").max=list.length;
    var n=0;
    function loop(){
      if(!list[0]){
        zip.generateAsync({type:"blob"}).then(function(content) {
            saveAs(content, "monapic"+new Date().getTime()+".zip");
            document.getElementById("down_button").style="display:none;";
        });
      }
      else {
        fetch("/images/cache/"+list[0],{mode: 'cors'}).then(function(response) {
          return response.blob();
        }).then(function(blob) {
          img.file(list[0], blob, {binary:true});
          list.shift();
          n++;
          document.getElementById("pr1").value=n;
          loop();
        });
      }
    }
  }
}
//円換算
function monaToJpy(){
  var monaValue = document.querySelectorAll('div > a > div > span > p');
  fetch("https://public.bitbank.cc/mona_jpy/ticker",{mode: 'cors'}).then(function(response) {
  return response.json();
  }).then(function(json) {
    for(i=0;i<monaValue.length;i++){
      monaValue[i].innerText = "¥"+Math.round(monaValue[i].dataset.mona*json.data.last).toLocaleString()+"/"+monaValue[i].innerText.split("/")[1];
    }
  });
}
function monaToJpyInterval(){
  monaToJpy();
  reInt=setInterval(monaToJpy,10000);
}
function monaToJpyIntervalReset(){
  clearInterval(reInt);
}
function changeMona2JpyChk(bool){
  var streamStatus = document.getElementById("streamStatus");
  if(bool){
    monaToJpyInterval();
    streamStatus.innerHTML='<img src="/images/ajax-loader.gif">自動更新中';
    dotStart=setInterval(animeDot,250);
  }
  else{
    monaToJpyIntervalReset();
    clearInterval(dotStart);
    document.getElementById("dotElement").innerText="";
    var monaValue = document.querySelectorAll('div > a > div > span > p');
    for(i=0;i<monaValue.length;i++){
      monaValue[i].innerText = monaValue[i].dataset.mona+"Mona/"+monaValue[i].innerText.split("/")[1];
    }
    streamStatus.innerHTML="";
  }
}
var dot=".";
function animeDot(){
  var dotElement=document.getElementById("dotElement");
  if(dot=="..."){
    dot=""
  }
  else{
    dot+=".";
  }
  dotElement.innerText=dot;
}
