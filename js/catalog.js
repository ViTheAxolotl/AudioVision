"use strict";

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
let wholeButtons = {};
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
    if(!this.classList.contains("selected"))
    {
        for(let btn of displayBtn)
        {
            btn.classList.remove("selected");
        }
    
        this.classList.add("selected");
    
        Ref = ref(database, `${this.id}`);
        onValue(Ref, (snapshot) => 
        {
            const data = snapshot.val();
            wholeButtons = data;
    
            displayBtns();
        });
    }
}

function displayBtns()
{
    let catalog = document.getElementById("catalog");
    
    if(catalog)
    {
        catalog.remove();
    }

    catalog = document.createElement("div");
    catalog.id = "catalog";

    for(let item of Object.keys(wholeButtons))
    {
        let btn = document.createElement("button");
        btn.id = item;
        btn.onclick = function () {playSound(btn.classList[btn.classList.length - 1], snd)};
        btn.classList.add("imgBtn");
        btn.classList.add("center");
        btn.classList.add(`${wholeButtons[item].sound}`);

        let image = document.createElement("img");
        image.src = wholeButtons[item].src;
        image.classList.add("fourOptions");
        btn.appendChild(image);
        catalog.appendChild(btn);
    }

    div.appendChild(catalog);
}