const DARKCTX = document.createElement("canvas").getContext("2d");
DARKCTX.canvas.width = res.w;
DARKCTX.canvas.height = res.h;

let lightColor = `hsl(0deg, 50%, 100%)`;

function addLight(xStart, yStart, rStart, xEnd, yEnd, rEnd)
{
    DARKCTX.globalCompositeOperation = 'xor';

    DARKCTX.beginPath();
    DARKCTX.arc(xStart, yStart, rStart, 0, 2 * Math.PI);
    DARKCTX.fillStyle = 'rgba(0,0,0,0)';
    DARKCTX.fill();
    
    const g = DARKCTX.createRadialGradient(xStart, yStart, rStart, xEnd, yEnd, rEnd);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    g.addColorStop(0, `rgba(0,0,0,1)`);
    DARKCTX.fillStyle = g;
    DARKCTX.fillRect(xStart - rEnd, yStart - rEnd, rEnd*2, rEnd*2);
    
    // DARKCTX.globalCompositeOperation = 'overlay';
    // g.addColorStop(1, 'rgba(0, 0, 0, 0)');
    // g.addColorStop(0, lightColor);
    // DARKCTX.fillStyle = g;
    // DARKCTX.fillRect(xStart - rEnd, yStart - rEnd, rEnd*2, rEnd*2);
}