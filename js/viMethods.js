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

/**
 * Displays the cover
 */
export function handleViewTokens(This)
{
    let viewDiv = document.getElementById("cover"); //Gets the cover div
    let y = 2;
    let title;
    let img = document.getElementById("changeImg");

    viewDiv.classList = ""; //Makes it visible
    viewDiv.style.zIndex = "1011"; //Brings it to the top

    
    for(let elm of viewDiv.children) //For each element in the cover
    {
        if(elm.id != "helpBtn" && elm.id != "changeImg" && !img.src.includes("correct")) //If it isn't a button and it isn't the img
        {
            elm.classList = elm.classList[1]; 
            elm.style.zIndex = `101${y}`; //Brings to the front
            y++;

            if(elm.id == "viewTitle") //If the element is a title
            {
                elm.innerHTML = title;
            }
        }
    }

    if(This.id == "helpBtn") //If it is the help button
    {
        let instructions = document.createElement("h3");
        let holdingDiv = document.createElement("div");
        holdingDiv.id = "holdingDiv";
        holdingDiv.classList.add("center");

        instructions.innerHTML = "Instructions";
        instructions.style.marginTop = "5%";
        instructions.style.color = "black";
        holdingDiv.appendChild(instructions);

        placeBefore(holdingDiv, document.getElementById("showInstructions"))
        changeInstructions();
    }

    else //If it was correct or incorrect
    {
        img.classList = img.classList[1]; 
        img.style.zIndex = `101${y}`; //Brings to the front
        y++;
    }
}

/**
 * Changes the instructions for each webpage
 */
export function changeInstructions()
{
    let gamesDesc = {"Basketball" : ""};
    let display = document.getElementById("showInstructions");
    let page = window.location.href;
    page = page.split("/");
    page = page[page.length - 1];
    page = page.split(".");
    page = page[0]; //Get the page name

    switch(page) //Splits on pages
    {
        case "":
        case "index":
            display.innerHTML = "Welcome to AudioVision, to begin click the Login button on the top right. After chose which category you wish to start with.";
            break;

        case "loginPage":
            display.innerHTML = "To login type your username and password given to you by Vi. If you need the info again, reach out to Vi.";
            break;

        case "game":
            break; //Different games

        case "match":
            display.innerHTML = "Listen to the sound and click the image that matches it. Clicking the volume button will play the sound once more. As you click the right option more options will be displayed."
            break; 

        case "addImage":
            display.innerHTML = "Use to add item to database. Type name of files, what category it belongs to, and the file extension of the sound (.wav if I did it). Once enter is hit it will cleanse the input and add it to the database.";
            break;
    }
}

/**
 * Hides the cover
 */
export function hideCover()
{
    let viewDiv = document.getElementById("cover"); //Get cover
    let img = document.getElementById("changeImg");

    for(let elm of viewDiv.children) //For element in the div
    {
        elm.classList = `invisible ${elm.classList[0]}`; //Hides the element
        elm.style.zIndex = "0";
    }

    let holdingDiv = document.getElementById("holdingDiv");
    if(holdingDiv != null){holdingDiv.remove();} //Deletes stuff in the div

    viewDiv.classList = `invisible`; //Hides the div
    viewDiv.style.zIndex = "0";
    img.src = ""; //Removes sorce
}

/**
 * Plays the sound sound to the player player
 * @param {*} sound 
 * @param {*} player 
 */
export function playSound(sound, player)
{
    player.pause();
    player.src = sound; //loads the sound
    player.volume = 0.4; //Makes it not so loud
    player.play(); //Plays
}
