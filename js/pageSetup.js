"use strict";
import { ref, onValue } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js';
import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js';
import { toTitleCase, auth, database, placeBefore } from './viMethods.js';

let log;
let isLoggedIn = false;
let nav = document.getElementsByTagName("nav");
let url = window.location.href.split("/");
let params = document.body.getElementsByTagName('script');
let query = params[0].classList;
let parentFolder = query[0];
let wholeChars = {};
let name;
let footer = document.getElementById("footer");
let body = document.getElementsByTagName("body");
let imageLocation;
let jsaLocation;
let mainLocation;

const charRef = ref(database, 'playerChar/');
onValue(charRef, (snapshot) => 
{
    const data = snapshot.val();
    wholeChars = data;
    navBarSetup();
});

if(parentFolder == "noParent")
{
    mainLocation = "";
    imageLocation = "images/";
}

if(parentFolder == "downOne")
{
    mainLocation = "../";
    imageLocation = "../images/";
}

onAuthStateChanged(auth, (user) => {
    if (user) 
    {
        name = auth.currentUser.email.split("@");
        name = toTitleCase(name[0]);

        log = `</ul>
            </div>
            <a class="nav-link" href="#" id="navbarScrollingDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false" style="float: right; min-width: 6%;">
                <button class="link-primary bg-UP-grey" style = "min-width: 70px; background-color: #5e5e5e;">${name}</button
            </a>
            <ul class="dropdown-menu bg-dark" style="right: 0; left: auto;" aria-labelledby="navbarScrollingDropdown">
                <li class="nav-item center"><a class="nav-link active" aria-current="page" id = "logoutButton">Logout</a></li>
            </ul>`;
        
        isLoggedIn = true;
    } 
    
    else 
    {
        // User is signed out
        log = `</ul>
            </div>
            <a class="navbar-brand" style="float = right" href="${mainLocation}loginPage.html?${url.slice(-1)}"><button class="link-primary bg-UP-grey" style = "background-color: #5e5e5e;">Login</button></a>`;
    }

    navBarSetup();
});

function init()
{
    copyrightSetup();
    createCoverAndHelp();
}

function navBarSetup()
{
    nav[0].innerHTML = `<div class="container-fluid">
    <a class="navbar-brand" href="${mainLocation}index.html"><img src = "${imageLocation}AV.png" title = "AudioVision" alt = "AudioVision width = "70" height = "70"/></a>    
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent"> 
            <ul class="navbar-nav me-auto my-2 my-lg-0 " style="--bs-scroll-height: 100px;"> 
                <li class="nav-item"><a class="nav-link active" aria-current="page" href="${mainLocation}index.html">Home</a></li>
                <li class="nav-item dropdown"> 
                    <a class="nav-link dropdown-toggle" href="#" id="navbarScrollingDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Catagories
                    </a>
                    <ul class="dropdown-menu bg-dark" aria-labelledby="navbarScrollingDropdown">
                        <li class="nav-item"><a class="nav-link active" aria-current="page" href="${mainLocation}mapAndTowns.html">Letters</a></li>
                        <li class="nav-item"><a class="nav-link active" aria-current="page" href="${mainLocation}recap.html">Numbers</a></li> 
                        <li class="nav-item"><a class="nav-link active" aria-current="page" href="${mainLocation}itemIndex.html">Bathroom</a></li>
                    </ul>
                </li>
                ${log}
            </ul>
        </div>`;

    if(isLoggedIn){document.getElementById("logoutButton").onclick = logout;}
}

function logout()
{
    signOut(auth).then(() => 
    {
        // Sign-out successful.
        location.reload();
    }).catch((error) => {
        alert(error);
    });
}

/**
 * Sets up copyright year in the footer
 */
function copyrightSetup()
{
    footer.innerHTML += `<h6>Copyright &copy; Vi Snyder ${new Date().getFullYear()}</h6>`;
}

function handleViewTokens()
{
    let viewDiv = document.getElementById("cover");
    let i = 0;
    let y = 2;
    let title;

    viewDiv.classList = "";
    viewDiv.style.zIndex = "1011";
    for(let elm of viewDiv.children)
    {
        if(this.id != "helpBtn" || elm.id == "hideCover" || elm.id == "showInstructions")
        {
            elm.classList = elm.classList[1];
            elm.style.zIndex = `101${y}`;
            y++;

            if(elm.id == "viewTitle")
            {
                elm.innerHTML = title;
            }
        }
    }

    if(this.id == "helpBtn")
    {
        let instructions = document.createElement("h3");
        let labels = ["Map", "Stats", "Actions", "Favorites"];
        let holdingDiv = document.createElement("div");
        holdingDiv.id = "holdingDiv";
        holdingDiv.classList.add("center");

        instructions.innerHTML = "Instructions";
        instructions.style.marginTop = "5%";
        instructions.style.color = "black";
        holdingDiv.appendChild(instructions);

        for(let i = 0; i < labels.length; i++)
        {
            let label = document.createElement("button");
            label.innerHTML = labels[i];
            label.classList.add("gridButton");
            label.style.margin = "3px";
            label.name = labels[i];
            label.onclick = changeInstructions;
            holdingDiv.appendChild(label);
        }

        placeBefore(holdingDiv, document.getElementById("viewToken"))
    }
}

function changeInstructions()
{
    let labels = ["Map", "Stats", "Actions", "Favorites"];
    let fill = ["The map will change once a character moves, if you click on a character you can see it enlarged. If you click on one of your own summons you will become it.", "The stats section contains controls to change the maps status. To move your token you can use the D-Pad or hold Ctrl and the arrow key. You can also change your token through keywords in the status:", "Here is all the spells and abilities for your characters. You can search or scroll to find the spell/ability you wish to use. Once you find it click on it, from here you can use the ability or add it to your favorites. Abilities that have a {@ will preform actions on cast. Then it will display the results on the display section on the webpage.", "In this section it will show your spells and actions you have favorited, this can be used to organize your abilities. If you click on one of the abilities it will let you edit them. You can also create custom abilites and spells from here. If you wish to create a button to better organise your abilites, all you need to do is select edit on the ability and change the Tag into what you want."];
    let keyWords = {"Large" : "This will make your token a large creature taking up a 2 x 2 square.", "Huge" : "This will make your token a huge creature taking up a 3 x 3 square.", "Gargantuan" : "This will make your token an Gargantuan creature taking up a 4 x 4 square.", "Top" : "This will make your token on top of other tokens.", "Bottom" : "This will make your token underneath others.", "Invisible" : "This will make only you be able to see your token."};
    let display = document.getElementById("showInstructions");

    for(let label of labels)
    {
        let button = document.getElementsByName(label);
        
        if(this.name == button[0].name)
        {
            this.classList.add("selected");
        }

        else
        {
            button[0].classList = "gridButton";
        }
    }

    switch(this.name)
    {
        case "Stats":
            display.innerHTML = fill[labels.indexOf(this.name)];
            display.innerHTML += "<ul>";
            for(let key of Object.keys(keyWords)){display.innerHTML += `<li>${key}: ${keyWords[key]}</li>`}
            display.innerHTML += "</ul>";
            break;

        case "Map":
        case "Actions":
        case "Favorites":
            display.innerHTML = fill[labels.indexOf(this.name)];
            break;
    }
}

function hideCover()
{
    let viewDiv = document.getElementById("cover");

    for(let elm of viewDiv.children)
    {
        elm.classList = `invisible ${elm.classList[0]}`;
        elm.style.zIndex = "0";
    }

    let holdingDiv = document.getElementById("holdingDiv");
    if(holdingDiv != null){holdingDiv.remove();}

    viewDiv.classList = `invisible`;
    viewDiv.style.zIndex = "0";
}

function createCoverAndHelp()
{
    let div = document.getElementsByClassName("container");
    let coverDiv = document.createElement("div");
    coverDiv.classList = "invisible";
    coverDiv.style.zIndex = "1011";
    
    let hideCoverBtn = document.createElement("button");
    hideCoverBtn.id = "hideCover";
    hideCoverBtn.classList = "invisible hbhbhbhb";
    hideCoverBtn.style.zIndex = "1012";
    hideCoverBtn.innerHTML = "Exit";
    hideCoverBtn.onclick = hideCover;
    coverDiv.appendChild(hideCoverBtn);

    let viewTitle = document.createElement("h3");
    viewTitle.id = "viewTitle";
    viewTitle.class = "invisible center";
    viewTitle.style.zIndex = "1016";
    coverDiv.appendChild(viewTitle);

    let instructions = document.createElement("p");
    instructions.classList = "invisible hbhbhbhb";
    instructions.id = "showInstructions";
    instructions.style.padding = "10px";
    coverDiv.appendChild(instructions);
    div.appendChild(coverDiv);

    let helpBtn = document.createElement("img");
    helpBtn.id = "helpBtn";
    helpBtn.src = "images/helpBtn.png";
    helpBtn.onclick = handleViewTokens;
    div.appendChild(helpBtn);
}

init();