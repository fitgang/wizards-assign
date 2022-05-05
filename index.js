const fileInput = document.getElementById("input"),
  canvas = new fabric.Canvas('canvas');

fileInput.addEventListener("change", fillCanvas);
canvas.on('mouse:wheel', zoom);

// Takes an image input and fill a canvas with that image
function fillCanvas(e) {
  const url = URL.createObjectURL(e.target.files[0]);

  fabric.Image.fromURL(url, function(oImg) {
    oImg
      .scaleToWidth(canvas.width)
      .scaleToHeight(canvas.height)
      .set({
        lockMovementX: true,
        lockMovementY: true,
        hasControls: false,
        hasBorders: false,
        hoverCursor: "default",
        left: (canvas.width - oImg.getScaledWidth()) >> 1,
        top: (canvas.height - oImg.getScaledHeight()) >> 1
      });

    const vpt = canvas.viewportTransform;
    vpt[4] = 0;
    vpt[5] = 0;

    canvas.add(oImg)
  })
}

function zoom(opt) {
  const delta = opt.e.deltaY;
  let zoom = canvas.getZoom();
  zoom *= 0.999 ** delta;

  if (zoom > 15) zoom = 15;
  else if (zoom < 1) zoom = 1;

  canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
  opt.e.preventDefault();
  opt.e.stopPropagation();

  // When zooming out, pan the image on the canvas
  if (delta > 0) {
    const vpt = this.viewportTransform,
      cw = canvas.width,
      ch = canvas.height;

    if (vpt[4] > 0) vpt[4] = 0;
    else if (vpt[4] < cw - cw * zoom) vpt[4] = cw - cw * zoom;

    if (vpt[5] > 0) vpt[5] = 0;
    else if (vpt[5] < ch - ch * zoom) vpt[5] = ch - ch * zoom;
  }
}