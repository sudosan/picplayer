var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/ms";
var nowData;

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var gcd="";
  var dt = new Date("2015-03-19");
  countInsert();
  function countInsert(){
    dt = new Date(dt.setDate(dt.getDate() + 1));
    var ndt = new Date();
    var dtrg= new RegExp(dt.getUTCFullYear()+"-"+umeru(dt.getUTCMonth() + 1)+ "-" +umeru(dt.getUTCDate()));
    if(!(dt.getTime() >ndt.getTime())){
      db.collection("postedData").count({"created_at":dtrg}, function(err, count) {
        var insertData = {day:dt,count:count};
        db.collection("counter").updateOne({day:dt},insertData,{upsert:true}, function(err, result) {
        });
          //console.log(dt+count)
        countInsert();
      });
    }
    else{
      db.close();
      process.exit(0);
    }
  }
});
function umeru(num){
  num += "";
  if (num.length === 1) {
    num = "0" + num;
  }
 return num;
}
