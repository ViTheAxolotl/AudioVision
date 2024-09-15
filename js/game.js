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
            
            txt = txt.slice(0, txt.indexOf(":") + 1);
            display.innerHTML = `${txt} ${plays}`;
        });

        handleBegin();
    }
}

function handleBegin()
{
    if(!wholeAccounts[user]["isGame"])
    {
        window.location.href = `match.html?${wholeAccounts[user]["lastCategory"]}`;
    }
}