"use strict";

import { ref, onValue } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js';
import { toTitleCase, auth, database, setDoc, deleteDoc, placeBefore } from './viMethods.js';

/**
 * When anything under this changes it will use onValue
 */
const accountsRef = ref(database, 'Accounts/');
onValue(accountsRef, (snapshot) => 
{
    const data = snapshot.val();
    wholeAccounts = data;
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

/**
 * Runs when user is logged in sets up category
 */
function init()
{
    category = category.split("?");
    category = category[1];
    setDoc(`Accounts/${user}/category`, category);

    categoryRef = ref(database, `${category}/`);
    onValue(categoryRef, (snapshot) => 
    {
        const data = snapshot.val();
        wholeCategory = data;
    });

    let begin = document.createElement("button");
    begin.onclick = handleBegin;
    begin.innerHTML = "Begin"
    begin.classList.add("center-full");
    begin.id = "begin";
    div.appendChild(begin);
}

function handleBegin()
{
    getRandomItems();
    document.getElementById("begin").remove();

    for(let items of Object.keys(buttons))
    {
        let image = document.createElement("img");
        image.src = buttons[items].src;
        image.id = items;
        image.onclick = handleImageClick;

        div.appendChild(image);
    }
}

function getRandomItems()
{
    buttons = {};
    let items = Object.keys(wholeCategory);
    let numOfItems;
    
    if(!wholeAccounts[user].numOfCorrect)
    {
        setDoc(`Accounts/${user}/numOfCorrect`, 0);
    }

    switch(wholeAccounts[user].numOfCorrect)
    {
        case 0:
        case 1:
        case 2:
            numOfItems = 2;
            break;
        
        case 3:
        case 4:
        case 5:
            numOfItems = 3;
            break;

        default:
            numOfItems = 4;
            break;
    }

    let correct = wholeCategory[items[(Math.random() * items.length) | 0]];
    correct.correct = true;
    buttons[correct.name] = correct;
    
    while(Object.keys(buttons).length < numOfItems)
    {
        let temp = wholeCategory[items[(Math.random() * items.length) | 0]];

        if(!Object.keys(buttons).includes(temp.name))
        {
            buttons[temp.name] = temp;
        }
    }

    buttons = randomizePlacement();

    return buttons;
}

function randomizePlacement()
{
    let temp = {};
    let itemList = Object.keys(buttons);

    while(true)
    {
        let item = itemList[(Math.random() * itemList.length) | 0];
        temp[item] = buttons[item];

        if(itemList.length > 1){itemList.splice(item, 1);}
        else{break;}
    }

    return temp;
}

function handleImageClick()
{
    if(buttons[this.id].correct)
    {
        alert("correct");
    }

    else
    {
        alert("false");
    }
}