"use strict";

import { ref, onValue } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js';
import { toTitleCase, auth, database, setDoc, deleteDoc, placeBefore } from './viMethods.js';
import { doc } from 'firebase/firestore/lite';

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
onAuthStateChanged(auth, (user) => 
{
    if (!user) //If user isn't logged in
    {
        alert("You need to login before using this resource. Click Ok and be redirected");
        window.location.href = "loginPage.html?match.html"; 
    } 

    else
    {
        user = auth.currentUser.email.split("@");
        user = toTitleCase(user[0]);
        alert(user);
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
    begin.classList.add("center");
    begin.id = "begin";
    div.appendChild(begin);
}

function handleBegin()
{
    document.getElementById("begin").remove();
}