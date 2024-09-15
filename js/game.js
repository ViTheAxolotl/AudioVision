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

/**
 * Runs when user is logged in sets up category
 */
function init()
{
    if(wholeAccounts && user)
    {
        handleBegin();
    }
}

function handleBegin()
{
    let txt = display.innerHTML;

    if(!wholeAccounts[user]["isGame"])
    {
        window.location.href = `match.html?${wholeAccounts[user][lastCategory]}`;
    }

    plays = wholeAccounts[user]["plays"];
    txt.slice(0, txt.indexOf(":") + 1);
    display.innerHTML = `${txt} ${plays}`;
}