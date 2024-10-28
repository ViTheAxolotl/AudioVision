"use strict";
import { ref, onValue } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js';
import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js';
import { toTitleCase, auth, database, placeBefore, handleViewTokens, hideCover } from './viMethods.js';

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
});

const allRef = ref(database, 'all/');

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
                    <ul class="dropdown-menu bg-dark" id="dropCategory" aria-labelledby="navbarScrollingDropdown">
                    </ul>
                </li>
                <li class="nav-item"><a class="nav-link active" aria-current="page" href="${mainLocation}catalog.html">Catalog</a></li>
                ${log}
            </ul>
        </div>`;

    if(isLoggedIn){document.getElementById("logoutButton").onclick = logout;}
    
    onValue(allRef, (snapshot) => 
    {
        let dropDown = document.getElementById("dropCategory");
        const data = snapshot.val();
        wholeAll = data["category"].split(", ");
        
        for(let category of wholeAll)
        {
            let li = document.createElement("li");
            li.classList.add("nav-item");
    
            let a = document.createElement("a");
            a.classList = "nav-link active";
            a.ariaCurrent = "page";
            a.href = `${mainLocation}match.html?${category}`;
            a.innerHTML = toTitleCase(category);
            li.appendChild(a);
            dropDown.appendChild(li);
        }
    });
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

function createCoverAndHelp()
{
    let div = document.getElementsByClassName("container");
    let coverDiv = document.createElement("div");
    coverDiv.classList = "invisible";
    coverDiv.style.zIndex = "1011";
    coverDiv.id = "cover";
    
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

    let img = document.createElement("img");
    img.style.display = "none";
    img.id = "changeImg";
    img.src = "";
    img.style.width = "35vh";
    img.classList = " invisible center-full"
    coverDiv.appendChild(img);

    let helpBtn = document.createElement("img");
    helpBtn.id = "helpBtn";
    helpBtn.src = "images/helpBtn.png";
    helpBtn.style.zIndex = 1000;
    helpBtn.onclick = function () {handleViewTokens(this)};
    placeBefore(helpBtn, div[0].firstChild);
    placeBefore(coverDiv, div[0].firstChild);
}

init(); 