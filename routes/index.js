var express = require('express');
var router = express.Router();
var fs = require("fs");
let serverNoteArray = [];

let NoteObject = function (pName, pType, pAddress, pStar, pURL){
    this.Name= pName;
    this.Type= pType;
    //this.ID= NoteArray.length + 1;
    this.ID= Math.random().toString(16).slice(5)
    this.Address = pAddress;
    this.Star = pStar;
    this.URL= pURL;
}

let fileManager  = {
  read: function() {
    var rawdata = fs.readFileSync('objectdata.json');
    let goodData = JSON.parse(rawdata);
    serverNoteArray = goodData;
  },

  write: function() {
    let data = JSON.stringify(serverNoteArray);
    fs.writeFileSync('objectdata.json', data);
  },

  validData: function() {
    var rawdata = fs.readFileSync('objectdata.json');
    console.log(rawdata.length);
    if(rawdata.length < 1) {
      return false;
    }
    else {
      return true;
    }
  }
};
if(!fileManager.validData()) {
serverNoteArray.push (new NoteObject( "McDonald", "Fast Food", "3239 156th Ave SE, Bellevue, WA 98007", "5 Stars", "https://www.mcdonalds.com/us/en-us.html" ));
serverNoteArray.push (new NoteObject( "Rain Cafe", "Cafe", "13200 Aurora Ave N suite c, Seattle, WA 98133", "4 Stars", "https://www.orderraincafe.com/"));
serverNoteArray.push (new NoteObject( "El Gran Taco", "Food Truck", "Seattle, WA 98122", "5 Stars", "https://elgrantacoseattle.com/home.php"));
fileManager.write();
}
else {
  fileManager.read();
}
console.log(serverNoteArray);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile('index.html');
});

router.get('/getAllResturants', function(req, res) {
  fileManager.read();
  res.status(200).json(serverNoteArray);
});

router.post('/AddResturant',function(req,res){
  const newResturant= req.body;
  serverNoteArray.push(newResturant);
  fileManager.write();
  res.status(200).json(newResturant);
});

router.delete('/DeleteResturant/:ID', (req,res) => {
  const delID= req.params.ID;
  let pointer=GetObjectPointer(delID);
  if (pointer==-1){
    console.log("not found");
    return res.status(500).json({
      status : "error - no such ID"
    });
  }
  else{
    serverNoteArray.splice(pointer,1);
    fileManager.write();
    res.send("Movie with ID: "+delID+" deleted!");
  }
});

function GetObjectPointer(whichID){
  for(i=0;i<serverNoteArray.length;i++){
    if(serverNoteArray[i].ID==whichID){
      return i;
    }
  }
  return -1;
}

module.exports = router;
