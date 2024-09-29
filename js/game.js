"use strict";

import { ref, onValue } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js';
import { toTitleCase, auth, database, setDoc, placeBefore, playSound } from './viMethods.js';

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
    document.body.style.webkitTouchCallout='none';

    let gameDiv = document.createElement("div");
    gameDiv.id = "gameDiv";
    gameDiv.classList = "center hoop";
    gameDiv.style.position = "absolute";

    let label = ["sweetSpot", "backBoard", "hoop"];
    
    for(let i = 0; i < label.length; i++)
    {
        let elm = document.createElement("img");
        elm.id = label[i];
        elm.src = `images/game/${label[i]}.png`;
        if(i == 0){elm.style.zIndex = 100;}
        else if(i > 0){elm.classList.add("overlap"); elm.classList.add("hoop");}
        gameDiv.appendChild(elm);
    }

    let ball = document.createElement("img");
    ball.id = "ball";
    ball.src = "images/game/basketball.jpg";
    ball.setAttribute('draggable', true);
    ball.addEventListener('dragstart', function(ev){ev.dataTransfer.setData('text/plain', 'ball'); ev.dataTransfer.effectAllowed = 'move'; startPos = [ev.x, ev.y];});
    ball.addEventListener('drop', function(ev){ev.preventDefault(); ev.src = "images/game/basketball.png";});
    ball.ondrop = function(ev){ev.preventDefault();};

    document.getElementById("match").addEventListener("drop", handleStopDrag);
    document.getElementById("match").addEventListener("dragover", allowDrop);
    div.appendChild(gameDiv);
    div.appendChild(ball);
}

function allowDrop(ev) 
{
    ev.preventDefault();
}

function handleStopDrag(ev)
{
    const data = ev.dataTransfer.getData("text");

    if(data.includes("ball"))
    {
        ball = document.getElementById("ball");
        ev.preventDefault();
        let xMovement = startPos[0] - ev.x;
        let yMovement = startPos[1] - ev.y;
        moveImg(xMovement, yMovement);

        if(ev.target.id == "sweetSpot")
        {
            alert("correct");
        }
    
        else
        {
            alert("incorrect");
        }
    }
}

function moveImg(x, y)
{
    let bottom = parseFloat(getComputedStyle(ball).bottom.replace("px", ''));
    let left = parseFloat(getComputedStyle(ball).left.replace("px", ''));

    setTimeout(function() {if(x - 1 > 0){ball.style.left = `${left - 1}px`; moveImg(x - 1, y, ev)} else if(x + 1 < 0){ball.style.left = `${left + 1}px`; moveImg(x + 1, y, ev)}}, 100);
    setTimeout(function() {if(y - 1 > 0){ball.style.bottom = `${bottom - 1}px`; moveImg(x, y - 1, ev)} else if(y + 1 < 0){ball.style.bottom = `${bottom + 1}px`; moveImg(x, y + 1, ev)}}, 100);
}