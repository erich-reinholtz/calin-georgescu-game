
function removeButton(){
    let instr = document.getElementById("instr");
    let buton = document.getElementById("buton");

    instr.remove();
    buton.remove();

    return false;
}
        
function game(){


    let canvas = document.getElementById("canvas");
    let context = canvas.getContext("2d");
    
    let midX = window.innerWidth/2;

    // loading the images
    let road = new Image();
    road.src = "images/street.png";

    let characterRight = new Image();
    characterRight.src = "images/cg-right.png";

    let characterLeft = new Image();
    characterLeft.src = "images/cg-left.png";

    let money = new Image();
    money.src = "images/pepsi.png";

    let money2 = new Image();
    money2.src = "images/coif.png"

    let boom = new Image();
    boom.src = "images/explosion.gif";

    let audio = new Audio();
    audio.src = "music/track.mp3";
    audio.loop = true;

    let hit = new Audio();
    hit.src = "music/hit2.mp3";

    let lose = new Audio();
    lose.src = "music/lose.mp3";

    road.onload = function(){
        requestAnimationFrame(gameLoop);
    }


    let virusPos = [18, 140, 272, 400];

    let xOffSet = -165;
    let yOffSet = -512;

    let xOffSetVirus = virusPos[0];
    let yOffSetVirus = 0;

    let roadSpeed = 5;
    let charSpeed = 0;
    let charDiffSpeed = 0;
    let topSpeed = 3;

    let charX = 180;

    let left = false;
    let right = false;

    let isGameOver = false;
    let points = 0;
    let fails = 0;
    let maxFails = 3;

    let played = false;

    let playerName = "undefined";

    let isFoe = 0;
        
    function gameLoop(){

        // getting key input
        document.addEventListener('keydown', function(event) {
            // left key pressed
            if(event.key == "ArrowLeft") {
                left = true; right = false;
                //console.log("Left pressed");
            }
            // right key pressed
            else if(event.key == "ArrowRight") {
                left = false; right = true;
                //console.log("Right pressed");
            }
            // no key pressed
            else {
                left = false; right = false;
            }
        });

        // getting mouse input
        document.addEventListener('click',function(e){
            console.log(e.clientX, e.clientY);
            // left half of screen clicked
            if(e.clientX < midX){
                left = true; right = false;
            }
            // right half of screen clicked
            else {
                left = false; right = true;
            }
            });

        // drawing the road
        if(yOffSet >= 0)
            yOffSet = -512;

       
        context.drawImage(road, xOffSet, yOffSet);
        context.drawImage(road, xOffSet, yOffSet + 512);
        context.drawImage(road, xOffSet, yOffSet + 1024);


        //drawing the enemy

        // checking if player has been caught
        let caught = false;
        if( Math.abs(charX - xOffSetVirus) < 100 && yOffSetVirus <= 700 && yOffSetVirus >= 600)
            caught = true;

        if(yOffSetVirus >= 900 || caught){

            if(caught){
                context.drawImage(boom, xOffSetVirus - 100, yOffSetVirus - 280);
                if(isFoe) {
                    fails += 1;
                    hit.play();
                }
                    
                else    
                    {
                        points += 1;

                        if(points % 5 == 0){
                            topSpeed += 1;
                            roadSpeed += 0.5;
                        }
                    }
                
            }

            // reset enemy y
            yOffSetVirus = 0;
            
            // change x offset to random variable
            while(true){

                let newid = Math.round(Math.random() * 3);
                xOffSetVirus = virusPos[newid];
                isFoe = Math.round(Math.random() * 2) % 2 != 0;

                if( Math.abs(xOffSetVirus - charX) < 150 )
                    break;
            }

        }
        if(isFoe)
            context.drawImage(money, xOffSetVirus - 30, -150 + yOffSetVirus, 160, 160);
        else
            context.drawImage(money2, xOffSetVirus - 15, -150 + yOffSetVirus, 120, 120);


        // drawing the character
        // image size 504 x 360

        if(left == true) {
            // console.log("Moving character to left"); 
                charSpeed = -topSpeed;
            }
             
        if(right == true) {
            // console.log("Moving character to right"); 
                charSpeed = topSpeed;
            }
            

        charX += charSpeed;

        // 120
        // checking boundaries
        if(charX > 385) charX = 385;
        if(charX < -70) charX = -70;

        if(left == true) {
            context.drawImage(characterLeft, charX - 50 , 450, 300, 300);
        }
        else
        {
            context.drawImage(characterRight, charX - 50 , 450, 300, 300);
        }
        

        yOffSet += roadSpeed;
        yOffSetVirus += roadSpeed;

        if(!played){
            audio.play();
            played = true;
        }
        // UPDATE SCOREBOARD
        let scoreboard = document.getElementById("scoreboard");
        scoreboard.innerHTML = "<p id='points'><b>SCOR: " + points + "</b></p><p id='lives'><b>VIETI: " + (maxFails-fails) + "/" + maxFails + "</b></p>"
        
        if(fails < maxFails)
            requestAnimationFrame(gameLoop);
        
        else {
            audio.pause();
            lose.play();

            Swal.fire({
                background: '#D8F3DC',
                showCloseButton: true,
                showCancelButton: true,
                confirmButtonColor: '#40916C',
                cancelButtonColor: '#2D6A4F',
                confirmButtonText:'Mai incearca',      
                cancelButtonText:'Inapoi la meniu',
                text: 'Globalistii te-au spalat pe creier! Scor: ' + points,
              }).then((result) => {
                 if (result.isConfirmed) {
                   location.reload();
                 }
                 else {
                   window.location.href = `index.html`  
                 }
                }); 
        }
    }

}