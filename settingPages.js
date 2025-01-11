let paused = true;
const shadowFell = new Audio("Assets/Audio/ShadowFell.mp3");
shadowFell.volume = 1;
const landSFX = [new Audio("Assets/Audio/LandSFX0.mp3"),new Audio("Assets/Audio/LandSFX1.mp3"),new Audio("Assets/Audio/LandSFX2.mp3")];
const dashSFX = new Audio("Assets/Audio/DashSFX.mp3")

window.addEventListener('mousedown', () => {
    document.getElementById("yap").innerHTML = `</br></br>Move On</br></br></br>Go On...</br></br></br>Press "Escape"</br></br></br>or M for the menu...`;
    shadowFell.play();
}, {once:true});

window.addEventListener("keyup", (e) => {
    if (e.code == "Escape")
    {
        if (paused)
        {
            paused = false;
            document.getElementById("menu").style.display = "none";
            document.getElementById("lowMsg").style.display = "block";
        }
        else
        {
            paused = true;
            document.getElementById("menu").style.display = "block";
            document.getElementById("lowMsg").style.display = "none";
            document.getElementById("yap").innerHTML = `WHY'D YOU COME BACK?!</br></br></br>Nothing to See Here</br></br></br>really...</br></br></br>Press "Escape"</br></br></br>...`;
        }
    }
    else if (e.code == "KeyM")
    {
        if (document.getElementById("amenu").style.display == "block")
            document.getElementById("amenu").style.display = "none";
        else if (paused)
            document.getElementById("amenu").style.display = "block";


    }
});

function unpause()
{
    paused = false;
    document.getElementById("menu").style.display = "none";
    document.getElementById("lowMsg").style.display = "block";
    document.getElementById("amenu").style.display = "none";
}

function muteTog()
{
    if (shadowFell.volume != 0)
        shadowFell.volume = 0;
    else
        shadowFell.volume = 1;
}