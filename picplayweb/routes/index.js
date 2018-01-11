var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/ms";
var list=[];
MongoClient.connect(url, function(err, db) {

  /* GET home page. */
  router.get('/', function(req, res, next) {
    db.collection("postedData").count({}, function(err, totalcount) {
      list=[];
      var menu = genMenu(req,false);
      db.collection("postedData").find(menu.q_target,{_id:0}).sort(menu.q_index).limit(250).toArray(function(err, docs) {
        var date = new Date();
        var utcDate = new RegExp(date.getUTCFullYear()+"-"+umeru(date.getUTCMonth() + 1)+ "-" +umeru(date.getUTCDate()));
        //console.log(utcDate);
        db.collection("postedData").find({$and:[{"created_at":utcDate},menu.q_target]},{_id:0}).sort(menu.q_index).limit(250).toArray(function(err, docs2) {
          //console.log(docs2);
          res.render('index', { total: genHtml(docs,false),daily: genHtml(docs2,false),imenu:menu.index_html,tmenu:menu.target_html,list:list,totalinfo:totalcount });
        });
      });
    });
  });
  router.get('/search', function(req, res, next) {
    db.collection("postedData").count({}, function(err, totalcount) {
      list=[];
      if(req.query.q==""||!req.query.q){
        res.redirect(302, "/");
      }
      else{
        var word = preg_quote(req.query.q);
        var menu = genMenu(req,word);
        var word2 = word.split(" ");
        var wary =[menu.q_target];
        for(i=0;i<word2.length;i++){
          if(word2[i]!=""){
            var regword = new RegExp(word2[i]);
            wary.push({$or:[{name:regword},{description:regword},{creator:regword}]});
          }
        }
        //console.log(wary);
        //var waryreg = new RegExp({$or:wary});
        db.collection("postedData").find({$and:wary},{_id:0}).sort(menu.q_index).limit(1000).toArray(function(err, docs) {
          //console.log(err);
          res.render('search',{result:genHtml(docs,true),imenu:menu.index_html,tmenu:menu.target_html,sw:word,list:list,totalinfo:totalcount});
        });
      }
    });
  });
  router.get('/data', function(req, res, next) {
    db.collection("postedData").count({}, function(err, totalcount) {
      db.collection("counter").find({},{_id:0}).sort({day:1}).toArray(function(err, docs) {
        //console.log(docs)
        var gcp="";
        var total=0;
        for(i=0;i<docs.length;i++){
          total+=docs[i].count;
          //console.log(total)
          gcp+="[new Date('"+docs[i].day+"'),"+total+"],";
        }
        db.collection("postedData").count({"r18":true}, function(err, r18count) {
          db.collection("postedData").count({"received_mona":{$gt:0}}, function(err, monagecount) {
            res.render('data',{t:"Monappy統計情報",a:gcp.slice( 0, -1 ),totalinfo:totalcount,r18:r18count,monage:monagecount});
          });
        });
      });
    });
  });
  router.get('/about', function(req, res, next) {
    db.collection("postedData").count({}, function(err, totalcount) {
      res.render('about',{t:"About me",totalinfo:totalcount});
    });
  });
});
function genHtml(docs,s){
  var html="";

    for(var i=0;i<docs.length;i++){
    html+='<a href="https://monappy.jp/picture_places/view/'+docs[i].id+'" target="_blank"><div class="rank_item ';
    if(s){
      html +='rank_search';
    }
    else{
      if(i<4){
        html+='rank_top';
      }
      else{
        html+='rank_other';
      }
    }
    //続きを読むボタン
    var hide="";
    if(s&&i>=100||!s&&i>=10){
      console.log(i);
      html+=' rank_hide';
      hide="hide";
    }
    var pattern = /(.+)(\.[^.]+$)/;
    //APIでnullが返ってくることがあるので
    if(!docs[i].creator){docs[i].creator="削除済みユーザー";}
    list.push("'"+docs[i].image_url.match(".+/(.+?)([\?#;].*)?$")[1]+"'");
    html+='"><span><h3>'+(i+1)+'位</h3><p id="priceView" data-mona="' + docs[i].received_mona/100000000 + '">'+docs[i].received_mona/100000000+'Mona/'+docs[i].view+'View</p></span><img src="images/loader.svg" '+'data-normal'+hide+'="https://img.monaffy.jp/img/picture_place/preview/'+docs[i].id+docs[i].image_url.match(pattern)[2]+'" data-retina'+hide+'="/images/cache/'+docs[i].id+docs[i].image_url.match(pattern)[2] +'" alt="'+preg_quote(docs[i].name)+'"><p><object><a href="search?q='+preg_quote(docs[i].creator)+'">'+preg_quote(docs[i].creator)+'</a></object>/'+preg_quote(docs[i].name)+'</p></div></a>';
  }
  if(s&&docs.length>100||!s&&docs.length>10){
    html+='<a class="nextButton" href="javascript:void(0)" onclick="rankNext(this);">続きを見る</a>';
  }
  return html;
}
function umeru(num){
  num += "";
  if (num.length === 1) {
    num = "0" + num;
  }
 return num;
}
function genMenu(req,w){
  var index_mona = false;
  var index_html = '指標：<a ';
  var target_html = '表示対象：<a ';
  var q_index;
  var q_target;
  var qy="";
  var qy2="";
  if(w!=""){
    qy="&q="+w;
    qy2="q="+w;
  }
  if(req.query.index=="view"){
    q_index={view:-1};
  }
  else{
    q_index={received_mona:-1};
    index_mona = true;
  }
  if(req.query.target=="general"){
    q_target={r18:false};
    if(index_mona){
      index_html+='class="disable" href="?target=general'+qy+'">Mona数</a>/<a href="?target=general&index=view'+qy+'">閲覧数</a>';
      target_html+='href="?'+qy2+'">すべて</a>/<a class="disable" href="?target=general'+qy+'">健全</a>/<a href="?target=r18'+qy+'">えっちぃの</a>';
    }
    else {
      index_html+=' href="?target=general'+qy+'">Mona数</a>/<a class="disable" href="?target=general&index=view'+qy+'">閲覧数</a>';
      target_html+='href="?index=view'+qy+'">すべて</a>/<a class="disable" href="?target=general&index=view'+qy+'">健全</a>/<a href="?target=r18&index=view'+qy+'">えっちぃの</a>';
    }
  }
  else if(req.query.target=="r18"){
    q_target={r18:true};
    if(index_mona){
      index_html+='class="disable" href="?target=r18'+qy+'">Mona数</a>/<a href="?target=r18&index=view'+qy+'">閲覧数</a>';
      target_html+='href="?'+qy2+'">すべて</a>/<a href="?target=general'+qy+'">健全</a>/<a class="disable" href="?target=r18'+qy+'">えっちぃの</a>';
    }
    else {
      index_html+=' href="?target=r18'+qy+'">Mona数</a>/<a class="disable" href="?target=r18&index=view'+qy+'">閲覧数</a>';
      target_html+='href="?index=view'+qy+'">すべて</a>/<a href="?target=general&index=view'+qy+'">健全</a>/<a class="disable" href="?target=r18&index=view'+qy+'">えっちぃの</a>';
    }
  }
  else{
    q_target={};
    if(index_mona){
      index_html+='class="disable" href="?'+qy2+'">Mona数</a>/<a href="?index=view'+qy+'">閲覧数</a>';
      target_html+='class="disable" href="'+qy2+'">すべて</a>/<a href="?target=general'+qy+'">健全</a>/<a href="?target=r18'+qy+'">えっちぃの</a>';
    }
    else {
      index_html+=' href="?'+qy2+'">Mona数</a>/<a class="disable" href="?index=view'+qy+'">閲覧数</a>';
      target_html+='class="disable" href="?index=view'+qy+'">すべて</a>/<a href="?target=general&index=view'+qy+'">健全</a>/<a href="?target=r18&index=view'+qy+'">えっちぃの</a>';
    }
  }
  var ret = {
    index_html:index_html,
    target_html:target_html,
    q_index:q_index,
    q_target:q_target
  }
  return ret;
}
function preg_quote (str) {
  return str
          .replace(/\\/g, '\\\\')
          .replace(/'/g, "\\'")
          .replace(/"/g, '\\"')
          .replace(/\//g, '\\/')
          .replace(/</g, '\\x3c')
          .replace(/>/g, '\\x3e')
          .replace(/\(/g, '（')
          .replace(/\)/g, '）')
          .replace(/(0x0D)/g, '\r')
          .replace(/(0x0A)/g, '\n')
          .replace(/&/g, '&amp;')
          .replace(/\*/g, '＊')
          .replace(/\?/g, '？');
}
module.exports = router;
