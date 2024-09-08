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
    let buttons = {};
    let items = Object.keys(wholeCategory);
    let numOfItems;

    document.getElementById("begin").remove();

    if(!wholeAccounts[user].numOfCorrect)
    {
        setDoc(`Accounts/${user}/numOfCorrect`, 0);
    }

    switch(wholeAccounts[user].numOfCorrect)
    {
        case 0, 1, 2:
            numOfItems = 2;
            break;
        
        case 3, 4, 5:
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

    alert("name");
}