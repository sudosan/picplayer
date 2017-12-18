var request = require('request');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/ms";
var nowData;

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var URL = 'https://api.monappy.jp/v1/picture_places';
  var offset = 0;
  setInterval(getData,900);
  function getData(){
    request.get({
      uri: URL,
      headers: {'Content-type': 'application/json'},
      qs: {
        max:'30',
        offset:offset+30
      },
      json: true
      }, function(err, req, data){
        nowData = data.data;
        for(var i =0;i<nowData.length;i++){
          var insertData = {
            id: Number(nowData[i].id),
            name: nowData[i].name,
            description: nowData[i].description,
            creator: nowData[i].creator,
            url: nowData[i].url,
            image_url: nowData[i].image_url,
            category_id: Number(nowData[i].category_id),
            received_mona: Math.round(nowData[i].received_mona * 100000000),
            comments: Number(nowData[i].comments),
            view: Number(nowData[i].view),
            r18: nowData[i].r18,
            created_at: nowData[i].created_at
          };
          db.collection("postedData").updateOne({id:insertData.id},insertData,{upsert:true}, function(err, result) {
            if(nowData[i-1].id==1){
              db.close();
              process.exit(0);
            }
		  //console.log(nowData[i-1].id);
          });;
        }
    });
    offset = offset+30;
  }
});
