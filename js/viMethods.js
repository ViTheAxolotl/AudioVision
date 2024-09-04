"use strict";
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js';
import { getDatabase, ref, set } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js';

const firebaseApp = initializeApp
({
    apiKey: "AIzaSyA7jIkT6PTw3QClLw0m9mXt-224g31KVwg",
    authDomain: "audiovision-1cfae.firebaseapp.com",
    projectId: "audiovision-1cfae",
    storageBucket: "audiovision-1cfae.appspot.com",
    messagingSenderId: "563112942762",
    appId: "1:563112942762:web:bad4f65c14a77cf4e5c4d3",
    measurementId: "G-43ED9RXG6J"
}); //Connects to database

export let auth = getAuth(); //Logs into accounts
export let database = getDatabase(); //Sets up connection

/**
 * 
 * @param {*} word 
 * @returns 
 * Changes each word into titlecase of word given. (Ex. help me -> Help Me)
 */
export function toTitleCase(word)
{
    let finalWord = "";
    if(word.includes(" ")) //More than one word
    {
        word = word.split(" "); 
        for(let singleWord of word)
        {
            finalWord += `${singleWord[0].toUpperCase() + singleWord.slice(1)} `; //Capitilize each word in the varible
        }
    }

    else //If only one word given
    {
        finalWord = word[0].toUpperCase() + word.slice(1); //Caps the one word
    }

    return finalWord;
}

/**
 * 
 * @param {*} path 
 * @param {*} toChange 
 * Sets the doc at path to the new value toChange
 */
export function setDoc(path, toChange)
{
    set(ref(database, path), toChange); 
}

/**
 * 
 * @param {*} path 
 * Deletes (Sets to null) the doc at path
 */
export function deleteDoc(path)
{
    set(ref(database, path), null);
}

/**
 * Clenses input to stop hackers from gaining control
 * @param {*} toClense 
 * @returns 
 */
export function clenseInput(toClense)
{
    let badChars = ["<", ">", ";", "@", "(", ")"];
    let isOk = true;

    toClense = toClense.replaceAll(" ", "");
    toClense = toClense.replaceAll("\"", "\'");
    toClense = toClense.replaceAll("\`", "\'");

    for(let bad of badChars)
    {
        if(toClense.includes(bad)) //If the input contains a bad char
        {
            alert(`Bad char detected: ${bad}. Please remove the char and try again.`);
            isOk = false;
        }
    }

    if(isOk)
    {
        return toClense;
    }

    else
    {
        return null;
    }
}

/**
 * Refreshes page after the given seconds
 * @param {*} seconds 
 */
export function reload(seconds)
{
    setTimeout(function(){location.reload();}, 1000 * seconds);
}

/**
 * Places the new element elemToPlace before the referenceElement
 * @param {*} elemToPlace 
 * @param {*} referenceElement 
 */
export function placeBefore(elemToPlace, referenceElement)
{ 
    referenceElement.parentElement.insertBefore(elemToPlace, referenceElement);
}