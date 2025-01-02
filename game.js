function toCanvasCoords(pageX, pageY)
{
    const _rect = document.querySelector("canvas").getBoundingClientRect();
    const scale = {x: canvas.width/currentCtx.canvas.width, y: canvas.height/currentCtx.canvas.height};
    
    let x = (pageX-_rect.left) / scale.x;
    let y = (pageY-_rect.top) / scale.y;

    return {x, y};
}

let gameState = 1;

const rr = new Renderer(canvas);

let currentCtx = document.createElement("canvas").getContext("2d");
currentCtx.canvas.width = res.w;
currentCtx.canvas.height = res.h;

const SCENE = new Scene();

// addEventListener("keydown", (e) =>
// {
//     if ((e.code == _DSKEYS[0] || e.code == _DSKEYS[1]) && _DOWNSCALE != _PDOWNSCALE)
//     {
//         SCENE.elements.callNodeMethods((node) => {
//             node.t.x   = Math.round(node.t.x   / (_DOWNSCALE/_PDOWNSCALE));
//             node.t.y   = Math.round(node.t.y   / (_DOWNSCALE/_PDOWNSCALE));
//             node.t.w   = Math.round(node.t.w   / (_DOWNSCALE/_PDOWNSCALE));
//             node.t.h   = Math.round(node.t.h   / (_DOWNSCALE/_PDOWNSCALE));
//             node.t.o.x = Math.round(node.t.o.x / (_DOWNSCALE/_PDOWNSCALE));
//             node.t.o.y = Math.round(node.t.o.y / (_DOWNSCALE/_PDOWNSCALE));
//             node.v.x   = Math.round(node.v.x   / (_DOWNSCALE/_PDOWNSCALE));
//             node.v.y   = Math.round(node.v.y   / (_DOWNSCALE/_PDOWNSCALE));
//         });
//     }
// });