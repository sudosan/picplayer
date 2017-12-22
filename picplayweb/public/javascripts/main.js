function imgError(t) {
  t.onerror = null;
  var src=t.src;
  var pattern = /(.+)(\.[^.]+$)/;
  t.src=src.match(pattern)[1]+src.match(pattern)[2].toUpperCase();
}
window.addEventListener("load", () => {
  const instance = Layzr({
    threshold: 100
  });
  instance.update().handlers(true);
  scrollTo(0,1);
  scrollTo(0,0);
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
  checkR18();
  document.getElementById("downButton").onclick=function(){
    download();
  }
});
function r18true(bool){
  if(bool==true){
    document.cookie = 'r18=true;expires=Tue, 1-Jan-2030 00:00:00 GMT;';
  }
  else{
    window.location.href = "/?target=general";
  }
  document.getElementById("notice").style.display="none";
}
function checkR18(){
  if(document.cookie.match(/r18=true/)||location.search.match(/target=general/)){
    document.getElementById("notice").style.display="none";
  }
  else{
    document.getElementById("notice").style.display="block";
  }
}
function r18guest(){
  document.cookie = 'r18=true;';
  document.getElementById("notice").style.display="none";
}
//全部ダウンロードしたぃ
//怒られたらやめる
function download(){
  var res = confirm("この機能はmonappyのサーバーに負荷をかけるため乱用はお避けください。実行しますか？ \n また、この機能はモダンブラウザでのみ利用可能です \n (IE/Safariはモダンブラウザではありません。Chrome/Edge/Firefox/Operaをご利用ください。)");
  if(res==true) {
    console.log(list.length);
    var zip = new JSZip();
    var img = zip.folder("image");
    loop();
    document.getElementById("downButton").style="display:none";
    document.getElementById("pr1").style="display:block;";
    document.getElementById("pr1").max=list.length;
    var n=0;
    function loop(){
      if(!list[0]){
        zip.generateAsync({type:"blob"}).then(function(content) {
            saveAs(content, "monapic.zip");
            document.getElementById("down_button").style="display:none;";
        });
      }
      else {
        fetch("https://img.monaffy.jp/img/picture_place/original/"+list[0],{mode: 'cors'}).then(function(response) {
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
