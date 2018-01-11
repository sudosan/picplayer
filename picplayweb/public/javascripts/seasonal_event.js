window.addEventListener("load", () => {
  var dt = new Date();
  //元旦
  if(dt.getMonth()==0&&dt.getDate()<10){
    document.body.classList.add('newyear');
    document.getElementById("topinfoText").textContent="新年明けましておめでとうございます。今年もPicPlayerをよろしくお願いいたします";
  }
});
