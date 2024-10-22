"use strict";

import { ref, onValue } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js';
import { toTitleCase, auth, database, setDoc, placeBefore, playSound, reload, handleViewTokens } from './viMethods.js';

/**
 * When anything under this changes it will use onValue
 */
const accountsRef = ref(database, 'Accounts/');
onValue(accountsRef, (snapshot) => 
{
    const data = snapshot.val();
    wholeAccounts = data;

    if(firstRun)
    {
        firstRun = false;
        init();
    }
});

/**
 * When anything under this changes it will use onValue
 */
let playsRef;

/**
 * Checks if user is logged in, if they aren't send them to loginPage
 */
onAuthStateChanged(auth, (person) => 
{
    if (!person) //If user isn't logged in
    {
        alert("You need to login before using this resource. Click Ok and be redirected");
        window.location.href = "loginPage.html?match.html"; 
    } 

    else
    {
        user = auth.currentUser.email.split("@");
        user = toTitleCase(user[0]);
        init();
    }
});

let user;
let wholeAccounts = {};
let div = document.getElementById("game");
let display = document.getElementById("display");
let snd = new Audio();
let plays;
let firstRun = true;
let startPos = [];
let ball;
let gravity = false;
let ballBottom = undefined;
let ballDrag = false;

/**
 * Runs when user is logged in sets up category
 */
function init()
{
    if(Object.keys(wholeAccounts).length > 0 && user)
    {
        playsRef = ref(database, `Accounts/${user}/plays`);
        onValue(playsRef, (snapshot) => 
        {
            let txt = display.innerHTML;
            plays = snapshot.val();

            if(plays < 1)
            {
                setDoc(`Accounts/${user}/isGame`, false);
            }

            if(!wholeAccounts[user]["isGame"])
            {
                window.location.href = `match.html?${wholeAccounts[user]["lastCategory"]}`;
            }

            txt = txt.slice(0, txt.indexOf(":") + 1);
            display.innerHTML = `${txt} ${plays}`;
        });

        handleBegin();
    }
}

function handleBegin()
{
    switch(wholeAccounts[user]["game"].toLowerCase())
    {
        case "basketball":
            beginBasketBall();
            break;
    }
}

function beginBasketBall()
{
    document.body.style.webkitTouchCallout = 'none';
    let gameDiv = document.createElement("div");
    gameDiv.id = "gameDiv";
    gameDiv.classList = "center hoop";
    gameDiv.style.position = "absolute";
    gameDiv.style.top = `${Math.floor(Math.random() * 41)}%`;
    gameDiv.style.left = `${Math.floor(Math.random() * 41)}%`;

    let label = ["sweetSpot", "backBoard", "hoop"];
    
    for(let i = 0; i < label.length; i++)
    {
        let elm = document.createElement("img");
        elm.id = label[i];
        elm.src = `images/game/${label[i]}.png`;
        if(i == 0){elm.style.zIndex = "100";}
        else if(i > 0){elm.classList.add("overlap"); elm.classList.add("hoop");}
        gameDiv.appendChild(elm);
    }

    let ball = document.createElement("img");
    ball.id = "ball";
    ball.src = "images/game/basketball.jpg";
    ball.style.zIndex = "10";
    ball.style.touchAction = "none";
    ball.setAttribute('draggable', true);
    ball.addEventListener('dragstart', function(ev){startDrag(ev)});
    ball.addEventListener('drop', function(ev){ev.preventDefault();});
    ball.ondrop = function(ev){ev.preventDefault();};

    document.addEventListener('touchstart',function(ev){startDrag(ev)});
    document.getElementById("match").addEventListener("touchend", handleStopDrag);
    document.getElementById("match").addEventListener("drop", handleStopDrag);
    document.getElementById("match").addEventListener("dragover", allowDrop);
    div.appendChild(gameDiv);
    div.appendChild(ball);
}

function startDrag(ev)
{
    if(ev.target.src.includes("ball"))
    {
        ev.preventDefault; 
        ballDrag = true; 
        if(ev.x){startPos = [ev.x, ev.y];}
        else{startPos = [ev.changedTouches[0].pageX, ev.changedTouches[0].pageY];}
    }
}

function allowDrop(ev) 
{
    ev.preventDefault();
}

function handleStopDrag(ev)
{
    if(ballDrag)
    {
        ball = document.getElementById("ball");
        let width = ball.width / 2;
        ev.preventDefault();
        ball.src = "images/game/basketball.png";
        if(ev.x){moveImg(ev.x - width, ev.y - width, ev);}
        else{moveImg(ev.changedTouches[0].pageX - width, ev.changedTouches[0].pageY - width, ev);}
    }
}

function moveImg(x, y, ev)
{
    let sweetSpot = document.getElementById("sweetSpot");
    sweetSpot = sweetSpot.getBoundingClientRect();
    let ballPos = ball.getBoundingClientRect();
    let ballX = parseInt(`${ballPos.x}`);
    let ballY = parseInt(`${ballPos.y}`);
    if(ballBottom == undefined){ballBottom = ballY;}
    let top = parseInt(getComputedStyle(ball).top.replace("px", ''));
    let left = parseInt(getComputedStyle(ball).left.replace("px", ''));
    x = parseInt(`${x}`);
    y = parseInt(`${y}`);

    if(!gravity)
    {
        if(x < ballX){ball.style.left = `${left - 1}px`;} 
        else if(x > ballX){ball.style.left = `${left + 1}px`;}

        if(y < ballY){ball.style.top = `${top - 1}px`;} 
        else if(y > ballY){ball.style.top = `${top + 1}px`;}
        
        if(x == ballX && y == ballY)
        {
            gravity = true;
            if((sweetSpot.left < x && x < sweetSpot.right) && (sweetSpot.top < y && y < sweetSpot.bottom)){document.getElementById("hoop").style.zIndex = "1000";}
            moveImg(x, y, ev);
        }

        else
        {
            setTimeout(function(){moveImg(x, y, ev)}, 10);
        }
    }
    
    else
    {
        ball.style.top = `${top + 1}px`;

        if(ballY == ballBottom)
        {
            let img = document.getElementById("changeImg");
            img.style.display = "block";

            if((sweetSpot.left < x && x < sweetSpot.right) && (sweetSpot.top < y && y < sweetSpot.bottom))
            {
                img.src = "images/correct.png";
            }

            else
            {
                img.src = "images/incorrect.png";
            }
            
            handleViewTokens(ball);
            reload(2);
            setDoc(`Accounts/${user}/plays`, plays - 1);
        }

        else
        {
            setTimeout(function(){moveImg(x, y, ev)}, 1);
        }
    }
}