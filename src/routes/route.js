const express = require('express');
const router = express.Router();

// Problem1:  players array outside( on the top ) of the api( so that data is maintained across api hits )
// Write a POST /players api that creates a new player ( that saves a player’s details and doesn’t allow saving the data of a player with a name that already exists in the data)

let players = [];
router.post('/players', function(req, res){
    let player = req.body
    let playerName = player.name
    for (let i=0; i<players.length; i++){
        if(players[i].name == playerName){
            res.send("player already exist")
        } 
    }
    players.push(player)
    console.log("Here is the player array", player)
    res.send(players)
});

// Problem2:

router.post('/players/:playerName/bookings/:bookingId', function(req, res){
   let name = req.params.playerName
   let isPresent = false;
   for (let i=0; i<players.length; i++){
       if (players[i].name == name){
           isPresent = true;
       }
   }
   if(!isPresent){
       res.send("player not present")
   }
   let booking = req.body;
   let bookingId = req.params.bookingId;
   for (let i=0; i<players.bookingId; i++){
       if (players[i].name == name){
           for (j=0; j<players[i].booking.length; i++){
               if (players[i].booking[j].bookingNumber == bookingId){
                   res.send("booking with similar Id already exists")
               }
           }
           players[i].bookings.push(booking)
       }
   }
   res.send(players)
});

module.exports = router;