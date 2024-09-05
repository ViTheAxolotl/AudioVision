"use strict";

import { ref, onValue } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js';
import { toTitleCase, auth, database, setDoc, deleteDoc, placeBefore } from './viMethods.js';

/**
 * Checks if user is logged in, if they aren't send them to loginPage
 */
onAuthStateChanged(auth, (user) => 
{
    if (!user) //If user isn't logged in
    {
        alert("You need to login before using this resource. Click Ok and be redirected");
        window.location.href = "loginPage.html?match.html"; 
    } 

    else
    {
        player = auth.currentUser.email.split("@");
        player = toTitleCase(player[0]);
    }
});

let player;
let name = document.getElementById("name");
let category = document.getElementById("category");
let sound = document.getElementById("sound");
let submit = document.getElementById("submit")

/**
 * Runs when user is logged in
 */
function init()
{
    submit.onclick = handleSubmit;
}

function handleSubmit()
{
    let object = {
        name : name.value,
        src : `../images/${category}/${name}.png`,
        correct : false,
        sound : `../images/${category}/${name}`
    }
    
    object.sound += sound.value;
    setDoc(`${category.value}/${name}`, object);
}

init();