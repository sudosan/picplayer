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
