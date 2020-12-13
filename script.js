window.__SKYWAY_KEY__ = '72be30ae-eee3-402e-a9a5-ee2dfbf5754a';
var firebaseConfig = {
  apiKey: "AIzaSyBhS8D3igzOsis-HGp6qDdCDRrMXk9aJQI",
  authDomain: "chat-d093e.firebaseapp.com",
  projectId: "chat-d093e",
  storageBucket: "chat-d093e.appspot.com",
  messagingSenderId: "292349063184",
  appId: "1:292349063184:web:7a7dc662843b86a8045a95",
  measurementId: "G-3X04WQLG21"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

var database = firebase.database();
var roomId=null;
var room;
var _data;
const buttonSendText = document.getElementById('button-send-text');
const buttonSendFiles = document.getElementById('button-send-files');
const inputText = document.getElementById('input-text');
const inputFiles = document.getElementById('input-files');
const anchorFile = document.getElementById('anchor-file');
buttonSendText.onclick= () => room.send(inputText.value);
buttonSendFiles.onclick= () => {
//    console.log(window.webkitURL.createObjectURL(inputFiles.files));
      inputFiles.files[0].arrayBuffer().then((buffer)=>room.send(buffer));
//    room.send(inputFiles.files);
//    const file = inputFiles.files[0];
//    var fileReader = new FileReader() ;
//  	fileReader.onload = function () {
////  	  	console.log( this.result ) ;
//        room.send(this.result);
//  	  	resultElement.appendChild( new Text( this.result ) ) ;
//  	}
  
//  	var file = element.files[0] ;
    //fileReader.readAsText( file ) ;
  	//fileReader.readAsBinaryString( file ) ;	// 試してみよう！
};
inputFiles.onchange= () => {
    const files=inputFiles.files;
    for (let i=0;i<files.length;i++){
        console.log(`${files[i].name}: ${returnFileSize(files[i].size)}`);
    }
};

function returnFileSize(number) {
  if(number < 1024) {
    return number + 'bytes';
  } else if(number >= 1024 && number < 1048576) {
    return (number/1024).toFixed(1) + 'KB';
  } else if(number >= 1048576) {
    return (number/1048576).toFixed(1) + 'MB';
  }
}
//dokutoku na design + iwakan nakusu
function geoFindMe(){
    alert("asdf");
    function success(position) {
        const latitude  = position.coords.latitude;
        const longitude = position.coords.longitude;
        database.ref('/peers').once('value').then((snapshot) => {
            snapshot=snapshot.val();
            if(snapshot){
            Object.keys(snapshot).forEach(key => {
                const squareDistance = (snapshot[key].x-longitude)**2+(snapshot[key].y-latitude)**2;
                if(squareDistance<=100.00000001)roomId=snapshot[key].roomId;
            });
            }
        }).then(() => {
                if(!roomId){
                    roomId=window.peer.id;
                    database.ref("peers/"+window.peer.id).set({
                        y: latitude,
                        x: longitude,
                        roomId: roomId
                    });
                } else {
                    database.ref("peers/"+window.peer.id).set({
                        y: latitude,
                        x: longitude,
                        roomId: roomId
                    });
                }
                room = peer.joinRoom(roomId, {
                  mode: 'sfu',
                  stream: null,
                });
                room.on('data', ({ data, src }) => {
                    if(typeof(data)==="string"){
                        alert(data);
                    }else{
                      _data = data;
                      console.log(typeof(data));
                      const myBlob = new Blob([data]);
//                      console.log(myBlob);
//                      console.log(window.webkitURL.createObjectURL(myBlob));



                      const reader = new FileReader();
                      reader.addEventListener("load", function () {
                          anchorFile.setAttribute("href",reader.result);
                      });
//                      if (file) {
                      reader.readAsDataURL(myBlob);

//                        const files = data;
//                        for (let i=0;i<files.length;i++){
//                            const file = files[i];
//                            alert(`${file.name}: ${returnFileSize(file.size)}`);
//                            var fileReader = new FileReader() ;
//
//                           	fileReader.onload = function () {
//                           		console.log( this.result ) ;
////                           		resultElement.appendChild( new Text( this.result ) ) ;
//                           	}
//                           	fileReader.readAsText( file ) ;
                           	//fileReader.readAsBinaryString( file ) ;	// 試してみよう！
//                            console.log(window.webkitURL.createObjectURL(file));
//                        }
                    }
                });
            });
        alert(window.peer.id);
        alert(latitude+" "+longitude);
      }
    function error(error){
        alert(error.message);
    }
    if(!navigator.geolocation){
        alert("can't use");
    }else{
        navigator.geolocation.getCurrentPosition(success,error);
    }
}

(async function main() {
  const peer = (window.peer = new Peer({
    key: window.__SKYWAY_KEY__,
    debug: 3,
  }));
  peer.on('open',() =>{
    geoFindMe();
  });
  peer.on('error', console.error);
})();
