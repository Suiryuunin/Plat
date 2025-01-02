const pages = [

    [ // 0. SETUP
        new Options("Versus", Math.floor(rr.settings.canvas.width / 2), 72, rr, ["Player vs Player", "P vs CPU", "Survival"], 0, -1),
        new Options("Mode", Math.floor(rr.settings.canvas.width / 2), 104, rr, ["Classic", "Bouncy Edges"], 0, -1),
        new Options("Skills", Math.floor(rr.settings.canvas.width / 2), 136, rr, ["Enabled", "Disabled"], 0, -1),
        new Slider("Target Score", Math.floor(rr.settings.canvas.width / 2), 168, 8, 8, rr, localStorage.getItem("Words"), [0, 99], 1),
        new Slider("Pad Acceleration", Math.floor(rr.settings.canvas.width / 2), 200, 8, 8, rr, localStorage.getItem("MaxChar"), [0, 64], 32),

        new Button(Math.floor(rr.settings.canvas.width / 2), 256, rr, "<", -0.5, false, -0.1),
        new Button(Math.floor(rr.settings.canvas.width / 2) + 88, 256, rr, ">", -0.5, true, 0.1),
        new Button(16, (rr.settings.canvas.width - 32), rr, "<<", -0.5, true, "aou")
    ]

];