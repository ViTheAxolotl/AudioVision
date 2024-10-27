"use strict";
//soundBtn.onclick = function () {playSound(soundBtn.title, snd)};

import { ref, onValue } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js';
import { toTitleCase, auth, database, setDoc, playSound, placeBefore, handleViewTokens, hideCover } from './viMethods.js';

/**
 * When anything under this changes it will use onValue
 */
const allRef = ref(database, 'all/');
onValue(allRef, (snapshot) => 
{
    const data = snapshot.val();
    wholeAll = Object.keys(data);

    init();
});

let Ref;

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
    }
});

let user;
let wholeAll = [];
let div = document.getElementById("match");
let snd = new Audio();
let displayBtn = document.getElementsByClassName("displayBtn");

function init()
{
    for(let category of wholeAll)
    {
        let button = document.createElement("button");
        button.classList = "gridButton displayBtn";
        button.innerHTML = toTitleCase(category);
        button.id = category;
        button.style.margin = "4px";
        button.onclick = handleDisplayCategory;
        div.appendChild(button);
    }
}

function handleDisplayCategory()
{
    for(let btn of displayBtn)
    {
        btn.classList.remove("selected");
    }
    
    this.classList.add("selected");
}