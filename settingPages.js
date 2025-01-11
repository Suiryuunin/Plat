let paused = true;

window.addEventListener('mousedown', () => {
    document.getElementById("yap").innerHTML = `</br></br></br></br>Move On</br></br></br>Go On...</br></br></br>Press "Escape"</br></br></br>...`;
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
})