const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const tileSize = 50;
const rows = 12;
const cols = 12;

// Player setup (same as before)
let player = {
    x: canvas.width / 2 - tileSize / 2,
    y: canvas.height - tileSize,
    size: tileSize - 9,
    image: new Image(),
};



// Prepare audio files
const moveUpSound = new Audio('Sound/frog-croak.mp3');
const moveLeftSound = new Audio('Sound/frog-croak.mp3');
const moveDownSound = new Audio('Sound/frog-croak.mp3');
const moveRightSound = new Audio('Sound/frog-croak.mp3');


// Load Frog Image
player.image.src = 'Pictures/Frog.png';  // Frog image path

// Load the road image
const roadImage = new Image();
roadImage.src = 'Pictures/Road.png';  // Path to Road.png

const cars = [
    { x: 0, y: tileSize * 2, width: tileSize * 2, height: tileSize, speed: 2, image: new Image() },
    { x: 300, y: tileSize * 3, width: tileSize * 2, height: tileSize, speed: -3, image: new Image() },
    { x: 500, y: tileSize * 4, width: tileSize * 2, height: tileSize, speed: 2, image: new Image() },
];


// Set the image sources for the cars
cars[0].image.src = 'Pictures/BlueCar.png';     // Path to BlueCar.png
cars[1].image.src = 'Pictures/PingCar.png';    // Path to PinkCar.png
cars[2].image.src = 'Pictures/WhiteCar.png';  // Path to WhiteCar.png


// Update the logs array to include images
const logs = [
    { x: 100, y: tileSize * 6, width: tileSize * 2, height: tileSize, speed: 2, image: new Image() },
    { x: 0, y: tileSize * 7, width: tileSize * 2, height: tileSize, speed: 1.5, image: new Image() },
    { x: 400, y: tileSize * 8, width: tileSize * 2, height: tileSize, speed: -2, image: new Image() },
    { x: 100, y: tileSize * 9, width: tileSize * 2, height: tileSize, speed: 2, image: new Image() },
];

// Set the image source for each log
logs.forEach(log => {
    log.image.src = 'Pictures/Log.png';  // Use the correct path to your Log.png
});

let startTime;
let elapsedTime = 0;
let highScore = localStorage.getItem('highScore') ? parseFloat(localStorage.getItem('highScore')) : Infinity;

function startTimer() {
    startTime = Date.now();
    elapsedTime = 0;
    updateTimerDisplay();
}

function updateTimer() {
    if (startTime) {
        elapsedTime = (Date.now() - startTime) / 1000;
        updateTimerDisplay();
    }
}

function updateTimerDisplay() {
    document.getElementById("timerDisplay").textContent = `Time: ${elapsedTime.toFixed(2)}s`;
    document.getElementById("highScoreDisplay").textContent = `High Score: ${highScore === Infinity ? '0.00s' : highScore.toFixed(2)}s`;
}


function drawGrid() {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (row < 2 || row > 9) {
                ctx.fillStyle = "#7ec850"; // Grass
            } else if (row >= 2 && row <= 5) {
                ctx.fillStyle = "#2b2b2b"; // Road
            } else if (row > 5 && row <= 9) {
                ctx.fillStyle = "#1ca3ec"; // Water
            }
            ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);
        }
    }
}

// Update drawCarsAndLogs to use the log image
function drawCarsAndLogs() {

    // Draw the cars using their images
    cars.forEach(car => {
        if (car.image.complete) {  // Ensure the car image is loaded
            ctx.drawImage(car.image, car.x, car.y, car.width, car.height);  // Draw the car image
        } else {
            // Fallback: Draw a rectangle in the color if the image isn't loaded yet (optional)
            ctx.fillStyle = car.color;
            ctx.fillRect(car.x, car.y, car.width, car.height);
        }

        // Move the cars
        car.x += car.speed;
        if (car.x > canvas.width) car.x = -car.width;
        if (car.x + car.width < 0) car.x = canvas.width;
    });






    // Draw the cars (same as before)
    // cars.forEach(car => {
    //     ctx.fillStyle = car.color;
    //     ctx.fillRect(car.x, car.y, car.width, car.height);
    //     car.x += car.speed;
    //     if (car.x > canvas.width) car.x = -car.width;
    //     if (car.x + car.width < 0) car.x = canvas.width;
    // });

    // Draw the logs using the image
    logs.forEach(log => {
        if (log.image.complete) {  // Ensure the log image is loaded
            ctx.drawImage(log.image, log.x, log.y, log.width, log.height);
        } else {
            // Optional fallback: Draw a brown rectangle if the image isn't loaded yet
            ctx.fillStyle = "brown";
            ctx.fillRect(log.x, log.y, log.width, log.height);
        }

        // Move the logs
        log.x += log.speed;
        if (log.x > canvas.width) log.x = -log.width;
        if (log.x + log.width < 0) log.x = canvas.width;
    });
}

function drawPlayer() {
    if (player.image.complete) {  // Ensure the image is loaded before drawing it
        ctx.drawImage(player.image, player.x, player.y, player.size, player.size);  // Draw the frog image
    } else {
        // Fallback: Draw a rectangle while the image is loading (optional)
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x, player.y, player.size, player.size);
    }
}

function checkCollisions() {
    cars.forEach(car => {
        if (player.x < car.x + car.width &&
            player.x + player.size > car.x &&
            player.y < car.y + car.height &&
            player.y + player.size > car.y) {
            alert("Game Over! You were hit by a car.");
            resetPlayer();
        }
    });

    let onLog = false;
    logs.forEach(log => {
        if (player.x < log.x + log.width &&
            player.x + player.size > log.x &&
            player.y < log.y + log.height &&
            player.y + player.size > log.y) {
            onLog = true;
            player.x += log.speed;
        }
    });

    if (player.y >= tileSize * 6 && player.y <= tileSize * 9 && !onLog) {
        alert("Game Over! You fell in the water.");
        resetPlayer();
    }

    if (player.y >= tileSize * -2 && player.y <= tileSize * 0) {
        alert("You've made it!");
        resetPlayer();
    }
}

function resetPlayer() {
    player.x = canvas.width / 2 - tileSize / 2;
    player.y = canvas.height - tileSize;
    startTimer(); // Start the timer when player is reset

}

// Update high score if necessary
if (elapsedTime < highScore) {
    highScore = elapsedTime;
    localStorage.setItem('highScore', highScore);
}

// Stop the timer
startTime = null;


function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    drawCarsAndLogs();
    drawPlayer();
    checkCollisions();
}

document.addEventListener("keydown", function (event) {
    switch (event.key) {
        case "w":
            if (player.y > 0) player.y -= tileSize;
            moveUpSound.play();
            break;
        case "a":
            if (player.x > 0) player.x -= tileSize;
            moveLeftSound.play(); // Play sound for moving left
            break;
        case "s":
            if (player.y < canvas.height - tileSize) player.y += tileSize;
            moveDownSound.play(); // Play sound for moving down
            break;
        case "d":
            if (player.x < canvas.width - tileSize) player.x += tileSize;
            moveRightSound.play(); // Play sound for moving right
            break;
    }
    updateGame();
});

setInterval(updateGame, 1000 / 60);


















// const canvas = document.getElementById("gameCanvas");
// const ctx = canvas.getContext("2d");

// const tileSize = 50;
// const rows = 12;
// const cols = 12;

// let player = {
//     x: canvas.width / 2 - tileSize / 2,
//     y: canvas.height - tileSize,
//     size: tileSize - 10,
//     Image: new Image(),
//     image: new Image(),  // Add the image object for the frog

//     // color: "lightblue",

// };


// player.image.src = 'Pictures/Frog.png';  // Use the correct path to your Frog.png image


// const cars = [
//     { x: 0, y: tileSize * 2, width: tileSize, height: tileSize, speed: 2, color: "red" },
//     { x: 300, y: tileSize * 3, width: tileSize, height: tileSize, speed: -3, color: "blue" },
//     { x: 500, y: tileSize * 4, width: tileSize, height: tileSize, speed: 2, color: "yellow" },
// ];

// const logs = [
//     { x: 100, y: tileSize * 6, width: tileSize * 2, height: tileSize, speed: 2, color: "brown" },
//     { x: 0, y: tileSize * 7, width: tileSize * 2, height: tileSize, speed: 1.5, color: "brown" },
//     { x: 400, y: tileSize * 8, width: tileSize * 2, height: tileSize, speed: -2, color: "brown" },
//     { x: 100, y: tileSize * 9, width: tileSize * 2, height: tileSize, speed: 2, color: "brown" },


// ];



// function drawGrid() {
//     for (let row = 0; row < rows; row++) {
//         for (let col = 0; col < cols; col++) {
//             if (row < 2 || row > 9) {
//                 ctx.fillStyle = "#7ec850"; // Grass
//             } else if (row >= 2 && row <= 5) {
//                 ctx.fillStyle = "#2b2b2b"; // Road
//             } else if (row > 5 && row <= 9) {
//                 ctx.fillStyle = "#1ca3ec"; // Water
//             }
//             ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);
//         }
//     }
// }


// // Modify the drawPlayer function to use the frog image instead of a rectangle
// function drawPlayer() {
//     if (player.image.complete) {  // Ensure the image is loaded before drawing it
//         ctx.drawImage(player.image, player.x, player.y, player.size, player.size);  // Draw the frog image
//     } else {
//         // Fallback: Draw a rectangle while the image is loading (optional)
//         ctx.fillStyle = player.color;
//         ctx.fillRect(player.x, player.y, player.size, player.size);
//     }
// }

// function drawCarsAndLogs() {
//     cars.forEach(car => {
//         ctx.fillStyle = car.color;
//         ctx.fillRect(car.x, car.y, car.width, car.height);
//         car.x += car.speed;
//         if (car.x > canvas.width) car.x = -car.width;
//         if (car.x + car.width < 0) car.x = canvas.width;
//     });

//     logs.forEach(log => {

//         ctx.fillStyle = log.color;
//         ctx.fillRect(log.x, log.y, log.width, log.height);
//         log.x += log.speed;
//         if (log.x > canvas.width) log.x = -log.width;
//         if (log.x + log.width < 0) log.x = canvas.width;
//     });
// }

// function checkCollisions() {
//     // Check collision with cars
//     cars.forEach(car => {
//         if (player.x < car.x + car.width &&
//             player.x + player.size > car.x &&
//             player.y < car.y + car.height &&
//             player.y + player.size > car.y) {
//             alert("Game Over! You were hit by a car.");
//             resetPlayer();
//         }
//     });

//     // Check if player is on a log
//     let onLog = false;
//     logs.forEach(log => {
//         if (player.x < log.x + log.width &&
//             player.x + player.size > log.x &&
//             player.y < log.y + log.height &&
//             player.y + player.size > log.y) {
//             onLog = true;
//             player.x += log.speed;
//         }
//     });

//     if (player.y >= tileSize * 6 && player.y <= tileSize * 9 && !onLog) {
//         alert("Game Over! You fell in the water.");
//         resetPlayer();
//     };

//     if (player.y >= tileSize * -2 && player.y <= tileSize * 0) {
//         alert("You've made it!");
//         resetPlayer();
//     }

// }

// function resetPlayer() {
//     player.x = canvas.width / 2 - tileSize / 2;
//     player.y = canvas.height - tileSize;
// }

// function updateGame() {
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     drawGrid();
//     drawCarsAndLogs();
//     drawPlayer();
//     checkCollisions();
// }

// document.addEventListener("keydown", function (event) {
//     switch (event.key) {
//         case "w":
//             if (player.y > 0) player.y -= tileSize;
//             break;
//         case "a":
//             if (player.x > 0) player.x -= tileSize;
//             break;
//         case "s":
//             if (player.y < canvas.height - tileSize) player.y += tileSize;
//             break;
//         case "d":
//             if (player.x < canvas.width - tileSize) player.x += tileSize;
//             break;
//     }
//     updateGame();
// });

// setInterval(updateGame, 1000 / 60);