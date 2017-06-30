
  var config = {
    apiKey: "AIzaSyDc9jNcpby_j0ybKLDHzDwnGHSMI_t-53s",
    authDomain: "game-9e0d7.firebaseapp.com",
    databaseURL: "https://game-9e0d7.firebaseio.com",
    projectId: "game-9e0d7",
    storageBucket: "game-9e0d7.appspot.com",
    messagingSenderId: "1047166014768"
  };

  firebase.initializeApp(config);

  var database = firebase.database()

  var players = database.ref("/players")
  
  var pOne = database.ref("/playerOne")

  var pTwo = database.ref("/playerTwo")

  var keys = []

  var currentPlayers = 0

  var oneGo =false

  var twoGo =false

  var match = "none"

  var choiceOne = ""

  var choiceTwo = ""

  var oneWins = 0

  var twoWins = 0

  var connected = database.ref(".info/connected")

  connected.on("value",function(shot){
    if(shot.val()){
      var con = players.push(true)

      con.onDisconnect().remove()
    }
  })

  players.on("value", function(shot){
    currentPlayers = shot.numChildren()
    $("#allMuhTests").html(currentPlayers + " playas")

  })


$(document).on("click" , "#submit" , function(event){
  event.preventDefault()

  if (parseInt(currentPlayers) === 1){
        
        var name = $("#name").val().trim()
        database.ref('playerOne').set({
          name: name,
          wins: 0,
          losses: 0,
          choice: "",
        })
      $("#formOne").hide()

      $("#playaOne").append('<br><button type="play" id="rock" class="btn btn-default playOne">Rock</button><button type="play" id="paper" class="btn btn-default playOne">Paper</button><button type="play" id="scissors" class="btn btn-default playOne">Scissors</button>')
    }
    else if(parseInt(currentPlayers) === 2){
        $("#formOne").show()
        var name = $("#name").val().trim()
        database.ref('playerTwo').set({
          name: name,
          wins: 0,
          losses: 0,
          choice: "",
        })    
        $("#formOne").hide()
        $("#playaTwo").append('<br><button type="play" id="rock" class="btn btn-default playTwo">Rock</button><button type="play" id="paper" class="btn btn-default playTwo">Paper</button><button type="play" id="scissors" class="btn btn-default playTwo">Scissors</button>')
      
    }
    else{
      $("#formOne").hide()
    }


})

  players.on("child_added" , function(shot){
    keys.push(shot.getKey())
})
  pOne.on("value" , function(shot){
    $("#titleOne").text('Player One: '+shot.val().name+' Wins: '+shot.val().wins)
    oneGo= shot.val().go
    choiceOne= shot.val().choice
  })

  pTwo.on("value" , function(shot){
    $("#titleTwo").text('Player Two: '+shot.val().name+' Wins: '+shot.val().wins)
     twoGo= shot.val().go 
     choiceTwo= shot.val().choice
  })
$(document).on("click" , ".playOne" , function(){
  
  console.log(this.id)
  
  database.ref('playerOne').update({
    choice: this.id,
    go: true
  })
})
$(document).on("click" , ".playTwo" , function(){
  
  console.log(this.id)
  
  database.ref('playerTwo').update({
    choice: this.id,
    go: true
  })
})

pTwo.on("value" , function(shot){
if ((oneGo)&&(twoGo)){
  
  $("#match").html("GAME ON")

  if (((choiceOne==="rock")&&(choiceTwo==="scissors"))||((choiceOne==="paper")&&(choiceTwo==="rock"))||((choiceOne==="scissors")&&(choiceTwo==="paper"))){
    $("#match").html("Player One Picked: "+choiceOne+"<br>Player Two Picked: "+choiceTwo+"<br>ONE WINS")
    oneWins++
    database.ref('playerOne').update({
    choice: "",
    go: false,
    wins: oneWins
  })
  database.ref('playerTwo').update({
    choice: "",
    go: false,
    losses: oneWins,
  })
  }
else if (((choiceTwo==="rock")&&(choiceOne==="scissors"))||((choiceTwo==="paper")&&(choiceOne==="rock"))||((choiceTwo==="scissors")&&(choiceOne==="paper"))){
    $("#match").html("Player One Picked: "+choiceOne+"<br>Player Two Picked: "+choiceTwo+"<br>TWO WINS")
    twoWins++
    database.ref('playerOne').update({
    choice: "",
    go: false,
    losses: twoWins,
  })
  database.ref('playerTwo').update({
    choice: "",
    go: false,
    wins: twoWins,
  })
  }
else if (choiceOne===choiceTwo){
  $("#match").html("Player One Picked: "+choiceOne+"<br>Player Two Picked: "+choiceTwo+"<br>TIEEEEE")
  database.ref('playerOne').update({
    choice: "",
    go: false,
  })
  database.ref('playerTwo').update({
    choice: "",
    go: false,
  })
}



}
})

