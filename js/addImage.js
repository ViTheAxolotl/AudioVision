"use strict";

import { ref, onValue } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js';
import { toTitleCase, auth, database, setDoc, clenseInput } from './viMethods.js';

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

const allRef = ref(database, 'all/');
onValue(allRef, (snapshot) => 
{
    const data = snapshot.val();
    wholeAll = data["category"].split(", ");
});

let player;
let submit = document.getElementById("submit");
let wholeAll = "";

/**
 * Runs when user is logged in
 */
function init()
{
    submit.onclick = handleSubmit;
}

function handleSubmit()
{
    let name = clenseInput(document.getElementById("name").value.toLowerCase());
    let category = clenseInput(document.getElementById("category").value.toLowerCase());
    let sound = clenseInput(document.getElementById("sound").value.toLowerCase());
    
    let object = {
        name : name,
        src : `images/${category}/${name}.png`,
        correct : false,
        sound : `sounds/${category}/${name}`
    };
    
    object.sound += sound;
    setDoc(`${category}/${name}`, object);
    
    if(!wholeAll.includes(category)) {wholeAll = wholeAll += `, ${category}`; setDoc(`all/category`, wholeAll);}
    alert("Done!");
}

init();