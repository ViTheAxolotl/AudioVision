"use strict";

import { ref, onValue } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js';
import { toTitleCase, auth, database, setDoc, playSound, placeBefore, handleViewTokens, hideCover } from './viMethods.js';

/**
 * When anything under this changes it will use onValue
 */
const accountsRef = ref(database, 'Accounts/');
onValue(accountsRef, (snapshot) => 
{
    const data = snapshot.val();
    wholeAccounts = data;

    if(firstRunAccount)
    {
        firstRunAccount = false;
        init();
    }
});

let categoryRef;

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
let wholeCategory = {};
let div = document.getElementById("match");
let category = window.location.href;
let buttons = {};
let firstRun = true;
let firstRunAccount = true;
let snd = new Audio();
let size;
let currentNumCorrect;
let rewardNeeded;

/**
 * Runs when user is logged in sets up category
 */
function init()
{
    if(Object.keys(wholeAccounts).length > 0 && user)
    {
        category = category.split("?");
        category = category[1];
        setDoc(`Accounts/${user}/category`, category);
        setDoc(`Accounts/${user}/lastCategory`, category);

        categoryRef = ref(database, `${category}/`);
        onValue(categoryRef, (snapshot) => 
        {
            const data = snapshot.val();
            wholeCategory = data;

            if(firstRun)
            {
                if(!wholeAccounts[user][category])
                {
                    setDoc(`Accounts/${user}/${category}`, {"hold" : "hold"});

                    if(!wholeAccounts[user][category].numCorrect)
                    {
                        setDoc(`Accounts/${user}/${category}/numCorrect`, 0);
                    } 
                }

                handleBegin();
                firstRun = false;
            }
        });
    }
}

function handleBegin()
{
    if(wholeAccounts[user][category]["isGame"])
    {
        window.location.href = "game.html";
    }

    while(div.childNodes.length > 0)
    {
        div.firstChild.remove();
    }

    let soundBtn = document.createElement("button");
    soundBtn.onclick = function () {playSound(soundBtn.title, snd)};
    soundBtn.id = "soundBtn";
    soundBtn.classList.add("imgBtn");
    soundBtn.classList.add("center");
    
    let soundImg = document.createElement("img");
    soundImg.src = "images/sound.png";
    soundBtn.appendChild(soundImg);
    div.appendChild(soundBtn);
    div.appendChild(document.createElement("hr"));

    getRandomItems();

    for(let items of Object.keys(buttons))
    {
        let btn = document.createElement("button");
        btn.id = items;
        btn.onclick = handleImageClick;
        btn.classList.add("imgBtn");
        btn.classList.add("center");

        let image = document.createElement("img");
        image.src = buttons[items].src;
        image.classList.add(size);
        btn.appendChild(image);

        div.appendChild(btn);
    }
}

function getRandomItems()
{
    buttons = {};
    let items = Object.keys(wholeCategory);
    let numOfItems;
    currentNumCorrect = wholeAccounts[user][category].numCorrect;

    switch(currentNumCorrect)
    {
        case 0:
        case 1:
        case 2:
            numOfItems = 2;
            size = "twoOptions";
            rewardNeeded = 4;
            break;
        
        case 3:
        case 4:
        case 5:
            numOfItems = 3;
            size = "threeOptions";
            rewardNeeded = 3;
            break;

        default:
            numOfItems = 4;
            size = "fourOptions";
            rewardNeeded = 2;
            break;
    }
    
    while(Object.keys(buttons).length < numOfItems)
    {
        let temp = wholeCategory[items[(Math.random() * items.length) | 0]];

        if(!Object.keys(buttons).includes(temp.name))
        {
            buttons[temp.name] = temp;
        }
    }

    let correct = Object.keys(buttons);
    correct = correct[(Math.random() * correct.length) | 0];
    buttons[correct].correct = true;
    document.getElementById("soundBtn").title = buttons[correct].sound;
}

function handleImageClick()
{
    let img = document.getElementById("changeImg");
    img.style.display = "block";
    snd.pause();

    if(buttons[this.id].correct)
    {
        img.src = "images/correct.png";
        let plays = document.getElementsByClassName("imgBtn").length - 2;
        let delay;

        setDoc(`Accounts/${user}/${category}/numCorrect`, currentNumCorrect + 1);

        if(!wholeAccounts[user][category]["rewardDelay"]){delay = 1;}

        else if(rewardNeeded >= wholeAccounts[user][category]["rewardDelay"])
        {
            delay = 0;
            setDoc(`Accounts/${user}/${category}/isGame`, true);
            setDoc(`Accounts/${user}/${category}/plays`, plays);
        }

        else{delay = wholeAccounts[user][category]["rewardDelay"] + 1;}
        setDoc(`Accounts/${user}/${category}/rewardDelay`, delay);
        
        if(!wholeAccounts[user]["game"]){setDoc(`Accounts/${user}/game`, "basketBall");}
    }

    else
    {
        img.src = "images/incorrect.png";
        
        if(currentNumCorrect - 1 >= 0)
        {
            setDoc(`Accounts/${user}/${category}/numCorrect`, currentNumCorrect - 1);
        }
    }

    for(let item of Object.keys(wholeCategory))
    {
        wholeCategory[item].correct = false;
    }
    
    handleViewTokens(this);
    setTimeout(resetCover, 2000);
}

function resetCover()
{
    let img = document.getElementById("changeImg");
    img.style.display = "none";
    img.src = "";

    hideCover();
    handleBegin();
}