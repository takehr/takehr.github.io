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
const buttonSendText = document.getElementById('button-send-text');
const buttonSendFiles = document.getElementById('button-send-files');
const inputText = document.getElementById('input-text');
const inputFiles = document.getElementById('input-files');
const myColor=Math.floor(Math.random() * Math.floor(360));
$("#exampleModalCenter").modal({
    keyboard:false,
    backdrop:'static',
    show:true
});
buttonSendText.onclick= () => {
    const file = inputFiles.files[0];
    if(file){
        file.arrayBuffer().then((buffer)=>{
            room.send({name:file.name,data:buffer,message:`${file.name}: ${returnFileSize(file.size)}`,peerId:window.peer.id,myColor:myColor});
            const myBlob = new Blob([buffer]);
            const reader = new FileReader();
            reader.addEventListener("load", function () {
                app.chats.push({peerId:window.peer.id, base64:reader.result, fileName:file.name, own:true,message:`${file.name}: ${returnFileSize(file.size)}`,myColor:myColor});
            });
            reader.readAsDataURL(myBlob);
        });
    }else{
        room.send({message:inputText.value,myColor:myColor});
        app.chats.push({message:inputText.value, peerId:window.peer.id,own:true,myColor:myColor});
    }
    inputText.value=null;
    inputFiles.value=null;
}
window.onresize=function(){
    document.querySelector("#app").setAttribute("style","height:"+(window.innerHeight-60)+"px; overflow:scroll;");
};

buttonSendFiles.onclick= () => {
//    console.log(window.webkitURL.createObjectURL(inputFiles.files));
//      const file = inputFiles.files[0];
//      file.arrayBuffer().then((buffer)=>room.send({name:file.name,data:buffer}));
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
  	//fileReader.readAsBinaryString( file ) ;	
};
inputFiles.onchange= () => {
    const files=inputFiles.files;
    for (let i=0;i<files.length;i++){
        inputText.value = `${files[i].name}: ${returnFileSize(files[i].size)}`;
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
    //alert("asdf");
    function success(position) {
        const latitude  = position.coords.latitude;
        const longitude = position.coords.longitude;
        database.ref('/peers').once('value').then((snapshot) => {
            snapshot=snapshot.val();
            if(snapshot){
            Object.keys(snapshot).forEach(key => {
                const squareDistance = (snapshot[key].x-longitude)**2+(snapshot[key].y-latitude)**2;
                //if(squareDistance<=100.00000001)roomId=snapshot[key].roomId;0.00000025
                if(squareDistance<=0.00000025)roomId=snapshot[key].roomId;
            });
            }
        }).then(() => {
                $("#exampleModalCenter").modal("hide");
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
                    if(!data.name){
                        app.chats.push({message:data.message, peerId:src, own:false,myColor:data.myColor});
                    }else{
                        const myBlob = new Blob([data.data]);
//                      console.log(myBlob);
//                      console.log(window.webkitURL.createObjectURL(myBlob));



                      const reader = new FileReader();
                      reader.addEventListener("load", function () {
                          app.chats.push({peerId:src, base64:reader.result, fileName:data.name, own:false,message:data.message,myColor:data.myColor});
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
        //alert(window.peer.id);
        //alert(latitude+" "+longitude);
      }
    function error(error){
        alert(error.message);
    }
    if(!navigator.geolocation){
        alert("It seems that geolocation is not available in your browser.");
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
//lineのふるふる機能も複数人がヒットすることはあまりない？
