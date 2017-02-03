//creating view object
var view = {
    //the initialization of the message area in the upper left
    displayMessage: function(msg) {
        var messageArea = document.getElementById("messageArea");
        messageArea.innerHTML = msg;
    },
    //calling this will display the hit image on the board
    displayHit: function(location) {
        var cell = document.getElementById(location);
        //adds the hit image to a cell
        cell.setAttribute("class", "hit");
    },
    //calling this will display a miss image on the board
    displayMiss: function(location) {
        var cell = document.getElementById(location);
        //adds the miss image to a cell
        cell.setAttribute("class", "miss");
    }
};

//creating model object
var model = {
    //size of game board grid
    boardSize: 7,
    //number of ships placed on the map
    numShips: 3,
    //the number of grid points for each ship
    shipLength: 3,
    //number of sunken ships
    shipsSunk: 0,
    
    /*
    //hardcoded ship locations and hit points. 
    ships: [{ locations: ["06", "16", "26"], hits: ["", "", ""] },
            { locations: ["24", "34", "44"], hits: ["", "", ""] },
            { locations: ["10", "11", "12"], hits: ["", "", ""] }],
            */
    ships: [{ locations: [0, 0, 0], hits: ["", "", ""] },
            { locations: [0, 0, 0], hits: ["", "", ""] },
            { locations: [0, 0, 0], hits: ["", "", ""] }],
    
    //fire method that accepts a guess on a ship and to figure out if it is a hit or miss
    fire: function(guess) {
        //iterating through each ship one at a time
        for(var i = 0; i < this.numShips; i++){
            //setting model.ships array to 'ship'
            var ship = this.ships[i];
            
            /*
            //grabs location of ships and sets it to 'locations'
            var locations = ship.locations;
            //code that determines if the guess is in the ship's location
            //by searching the ships array for the matching value
            //and setting it to 'index'
            var index = locations.indexOf(guess);
            */
            
            //shorthand or "chaining" for the above code
            var index = ship.locations.indexOf(guess);
            //conditional statement to confirm a hit by searching array index
            if (index >= 0) {
                //if it matches a ship array value, it's marked as a hit
                ship.hits[index] = "hit";
                //notify view we got a hit at a location in guess
                view.displayHit(guess);
                //tell view to display the message "HIT!!" to player.
                view.displayMessage("HIT!!");
                //checks if ship is sunk
                //if ship is sunk, we increase number of ships that are sunk in the shipsSunk property
                if (this.isSunk(ship)) {
                    //use view to display message that battleship has been sunk
                    view.displayMessage("You sank my battleship!!");
                    this.shipsSunk++;
                }
                //returns fire as true because the guess matches a value of ship location
                return true;
            }//end if
        }//end for
        //tell view we got a miss at a location in guess
        view.displayMiss(guess);
        //tell view to display "You missed" to player
        view.displayMessage("You missed.");
        //return false if doesn't match array location value
        return false;
    },//end fire
    
    //this method will take a ship and check every possible location for a hit
    isSunk: function(ship) {
    for (i = 0; i < this.shipLength; i++) {
        if (ship.hits[i] !== "hit") {
                //if there's a ship location that doesn't have a hit, return false
                return false;
            }
        }
        return true;
    },
    //this method handles the generating of the ships locations
    generateShipLocations: function() {
        var locations;
        //for each ship want to generate a location for
         for(var i = 0; i < this.numShips; i++) {
             do {
                 //we generate a new set of locations
                 locations = this.generateShip();
               //checks for overlaps of existing ships
               //if collisions exist, try again until no collision exists
             } while (this.collision(locations));
             //once we have valid locations, assign the  generated locations
             //to the ship's location property in the model.ships array
             this.ships[i].locations = locations;
             }
         },
        //generating the actual ships and it's orientation (vertical/horizontal) on the board
        generateShip: function() {
            //We use Math.random to generate a number between 0 and 1, and multiplythe result by 2, 
            //to get a number between 0 and 2 (not including 2). 
            //We then turn that into a 0 or a 1 using Math.floor.
            
            //basically I'm confused about this math shit
            var direction = Math.floor(Math.random() * 2);
            var row, col;
            
            
            if (direction === 1) {
                //geration a starting location for a horizontal ship
                row = Math.floor(Math.random() * this.boardSize);
                col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
            } else {
                //generate a starting location fo ra  vertical ship
                row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
                col = Math.floor(Math.random() * this.boardSize);
            }
            
            //start with an empty array at the start of generating locations
            var newShipLocations = [];
            //loop to check number of location in a ship
            for (i = 0; i < this.shipLength; i++) {
                //adds a new location to the newShipLocations array either
                //vertically or horizontally, depending
                if (direction === 1) {
                    //add location to array for new horizontal ship
                    //refer to page 367
                    newShipLocations.push(row + "" + (col + i));
                } else {
                    //add location to array for new vertical ship
                    newShipLocations.push((row + i) + "" + col);
    
                }
            }
            //once all ships have been generated, we return the array
            return newShipLocations;
        },
        //this is making sure the ships do not overlap on the gameboard
        //need to understand this before I move on to next chapter
        collision: function(locations) {
            for (var i = 0; i < this.numShips; i++) {
                var ship = model.ships[i];
                
                for (var j = 0; j < locations.length; j++) {
                    if (ship.locations.indexOf(locations[j]) >= 0) {
                        return true;
                    }
                }
            }
            return false;
        }
};

var controller = {
    guesses: 0,
    
    processGuess: function(guess) {
        //call parseGuess and set it to 'location'
        var location = parseGuess(guess);
        //if parseGuess doesn't return false/null proceed onward
        if (location) {
            //if player entered a valid guess, increase number of guesses by 1
            this.guesses++;
            //pass the guess location to the model's fire method
            var hit = model.fire(location);
            //if the guess was a hit and all ships are sunk
            //show player a message that they've won in x guesses
            
            //***This is a bug as it doesn't show up once all the ships are sunk 
            //Will update when I figure it out.***
            if (hit && model.shipsSunk === model.numShips) {
                view.displayMessage("You sank all my battleships, in " + 
                                            this.guesses + " guesses");
            }
            
        }
    }
    
    
};
//checking the player's guess to make sure it is valid
function parseGuess(guess) {
    //a helper array of valid guess letters
    var alphabet = ["A", "B", "C", "D", "E", "F", "G"];
    
    //making sure the guess isn't null and is equal to 2 characters
    if (guess === null || guess.length !== 2) {
        alert("Invalid guess, please enter a letter followed by a number for a valid guess.");
    } else {
        //grabs the first char of the guess
        firstChar = guess.charAt(0);
        //gets a number between 0 and 6 that corresponds with the alphabet array
        var row = alphabet.indexOf(firstChar);
        //grabs second char of guess
        var column = guess.charAt(1);
        
        //checking to make sure the guesses are on the valid playing board
        if (isNaN(row) || isNaN(column)) {
            alert("Oops, that is not on the board!");
        } else if (row < 0 || row >= model.boardSize ||
                            column < 0 || column >= model.boardSize) {
            alert("Oops, that's off the board!");
        } else {
            //if the guess is good, return the row and column as a concatenated string
            return row + column;
        }
    }
    return null;
};

function init() {
    //getting the fireButton input with getElementById
    var fireButton = document.getElementById("fireButton");
    //assigning handleFireButton function to a click handler
    fireButton.onclick = handleFireButton;
    //getting guess input with getElementById
    var guessInput = document.getElementById("guessInput");
    //assigning the handleKeyPress function on a keyPress handler
    guessInput.onkeypress = handleKeyPress;
    
    //calls the model to generate the ships when the page loads
    model.generateShipLocations();
};

function handleFireButton() {
    //getting the players guess input with getElementById
    var guessInput = document.getElementById("guessInput");
    //setting guessInput's value to a guess variable
    var guess = guessInput.value;
    //passing the guess to the controller
    controller.processGuess(guess);
    //this line of code resets guessInput to an empty string
    guessInput.value = "";
};
//function to handle the return key press to substitute clicking the fire button
function handleKeyPress(e) {
    //I think you get what's happening here by now
    var fireButton = document.getElementById("fireButton");
    //condition statement that basically says "if enter is pressed, act as if the fire button was clicked
    if(e.keyCode === 13) {
        fireButton.click();
        //failsafe to make sure the form doesn't do anything else
        return false;
    }
};

window.onload = init;
/*
controller.processGuess("A0");
controller.processGuess("A6");
controller.processGuess("B6");
controller.processGuess("C6");
controller.processGuess("C4");
controller.processGuess("D4");
controller.processGuess("E4");
controller.processGuess("B0");
controller.processGuess("B1");
controller.processGuess("B2");

console.log(parseGuess("A0"));
console.log(parseGuess("B6"));
console.log(parseGuess("G3"));
console.log(parseGuess("H0"));
console.log(parseGuess("A7"));

//model.fire("53");

model.fire("06");
model.fire("16");
model.fire("26");

model.fire("34");
model.fire("24");
model.fire("44");

model.fire("12");
model.fire("11");
model.fire("10");

view.displayMiss("00");
view.displayHit("34");
view.displayMiss("55");
view.displayHit("12");
view.displayMiss("25");
view.displayHit("26");

view.displayMessage("Tap tap, is this thing on?");
*/