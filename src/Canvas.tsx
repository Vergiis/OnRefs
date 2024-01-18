import { useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useCookies } from 'react-cookie';
import $ from 'jquery';
import { parseGIF, decompressFrames } from 'gifuct-js';

let canvas: any;
let ctx: any;

let shapes: any[] = [];
let canvasID: string = '-1';
let canvasName: string = 'Unnamed';
let canvasChangeFlag: boolean = false;

let selectedShapes: any[] = [];
let isSelecting: boolean = false;
let selectStartX: number;
let selectStartY: number;

let delta = 0;
let dragStart: any;
let dragged: any;

let selectedShapeIndex: number;
let selectedTextIndex = -1;
let selectedTextID = -1;

let isDraggingImg = false;
let imgStartX: number;
let imgStartY: number;

let lastX: number;
let lastY: number;

let isResizing = false;
let isDreaggingResize: any = null;
let resizeStartX: number;
let resizeStartY: number;
let frameArcRadius = 50;
let frameLineWidth = 10;
let frameColor = '#00ffe1';
let imageOrder = 'Top';

function trackTransforms() {
  let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

  let xform = svg.createSVGMatrix();
  ctx.getTransform = function () {
    return xform;
  };

  let savedTransforms: any[] = [];
  let save = ctx.save;
  ctx.save = () => {
    savedTransforms.push(xform.translate(0, 0));
    return save.call(ctx);
  };

  let restore = ctx.restore;
  ctx.restore = function () {
    xform = savedTransforms.pop();
    return restore.call(ctx);
  };

  let scale = ctx.scale;
  ctx.scale = function (sx: number, sy: number) {
    xform = xform.scaleNonUniform(sx, sy);
    return scale.call(ctx, sx, sy);
  };

  let rotate = ctx.rotate;
  ctx.rotate = function (radians: number) {
    xform = xform.rotate((radians * 180) / Math.PI);
    return rotate.call(ctx, radians);
  };

  let translate = ctx.translate;
  ctx.translate = function (dx: number, dy: number) {
    xform = xform.translate(dx, dy);
    return translate.call(ctx, dx, dy);
  };

  let transform = ctx.transform;
  ctx.transform = function (
    a: number,
    b: number,
    c: number,
    d: number,
    e: number,
    f: number
  ) {
    let m2 = svg.createSVGMatrix();
    m2.a = a;
    m2.b = b;
    m2.c = c;
    m2.d = d;
    m2.e = e;
    m2.f = f;
    xform = xform.multiply(m2);
    return transform.call(ctx, a, b, c, d, e, f);
  };

  let setTransform = ctx.setTransform;
  ctx.setTransform = function (
    a: number,
    b: number,
    c: number,
    d: number,
    e: number,
    f: number
  ) {
    xform.a = a;
    xform.b = b;
    xform.c = c;
    xform.d = d;
    xform.e = e;
    xform.f = f;
    return setTransform.call(ctx, a, b, c, d, e, f);
  };

  let pt = svg.createSVGPoint();
  ctx.transformedPoint = function (x: number, y: number) {
    pt.x = x;
    pt.y = y;
    return pt.matrixTransform(xform.inverse());
  };
}

function sortShape(a: any, b: any) {
  if (a.position > b.position) return 1;
  else if (a.position < b.position) return -1;
  return 0;
}
//Draw
function redraw() {
  isResizing = false;

  //Clear canvas
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  ctx.restore();

  shapes.sort(sortShape);

  //Draw images
  for (let i = 0; i < shapes.length; i++) {
    if (shapes[i].type == 'Image') {
      ctx.drawImage(
        shapes[i].image,
        shapes[i].x,
        shapes[i].y,
        shapes[i].width,
        shapes[i].height
      );
    } else if (shapes[i].type == 'Text') {
      ctx.font = shapes[i].text.size * 10 + 'px ' + shapes[i].text.font;
      ctx.fillStyle = shapes[i].text.color;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(shapes[i].text.value, shapes[i].x, shapes[i].y);
    } else if (shapes[i].type == 'Gif') {
      console.log(shapes[i].gif);
    }
  }
}

function reOffset() {
  let BB = canvas.getBoundingClientRect();

  return [BB.left, BB.top];
}

function isPointInside(
  mx: number,
  my: number,
  x: number,
  y: number,
  width: number,
  height: number
) {
  let rLeft = x;
  let rRight = x + width;
  let rTop = y;
  let rBot = y + height;
  if (
    width >= 0 &&
    height >= 0 &&
    mx > rLeft &&
    mx < rRight &&
    my > rTop &&
    my < rBot
  )
    return true;
  else if (
    width < 0 &&
    height >= 0 &&
    mx < rLeft &&
    mx > rRight &&
    my > rTop &&
    my < rBot
  )
    return true;
  else if (
    width >= 0 &&
    height < 0 &&
    mx > rLeft &&
    mx < rRight &&
    my < rTop &&
    my > rBot
  )
    return true;
  else if (
    width < 0 &&
    height < 0 &&
    mx < rLeft &&
    mx > rRight &&
    my < rTop &&
    my > rBot
  )
    return true;
  return false;
}

function getShapesInRange(x: number, y: number, w: number, h: number) {
  let output = [];

  for (let i = 0; i < shapes.length; i++) {
    for (let t = 0; t <= 1; t += 0.1) {
      //Top Edge
      if (
        isPointInside(
          shapes[i].x + shapes[i].width * t,
          shapes[i].y,
          x,
          y,
          w,
          h
        )
      ) {
        output.push(i);
        break;
      }
      //Bottom Edge
      if (
        isPointInside(
          shapes[i].x + shapes[i].width * t,
          shapes[i].y + shapes[i].height,
          x,
          y,
          w,
          h
        )
      ) {
        output.push(i);
        break;
      }
      //Left Edge
      if (
        isPointInside(
          shapes[i].x,
          shapes[i].y + shapes[i].height * t,
          x,
          y,
          w,
          h
        )
      ) {
        output.push(i);
        break;
      }
      //Right Edge
      if (
        isPointInside(
          shapes[i].x + shapes[i].width,
          shapes[i].y + shapes[i].height * t,
          x,
          y,
          w,
          h
        )
      ) {
        output.push(i);
        break;
      }
    }
  }

  return output;
}

function isMouseInShape(mx: number, my: number, shape: any) {
  if (isPointInside(mx, my, shape.x, shape.y, shape.width, shape.height))
    return true;
  return false;
}

function isMouseInResizeShape(mx: number, my: number, shapeIndex: number) {
  if (shapeIndex >= 0) {
    let shape = shapes[shapeIndex];
    if (
      isPointInside(
        mx,
        my,
        shape.x - frameArcRadius,
        shape.y - frameArcRadius,
        frameArcRadius * 2,
        frameArcRadius * 2
      )
    )
      return 'TL';
    else if (
      isPointInside(
        mx,
        my,
        shape.x + shape.width - frameArcRadius,
        shape.y - frameArcRadius,
        frameArcRadius * 2,
        frameArcRadius * 2
      )
    )
      return 'TR';
    else if (
      isPointInside(
        mx,
        my,
        shape.x - frameArcRadius,
        shape.y + shape.height - frameArcRadius,
        frameArcRadius * 2,
        frameArcRadius * 2
      )
    )
      return 'BL';
    else if (
      isPointInside(
        mx,
        my,
        shape.x + shape.width - frameArcRadius,
        shape.y + shape.height - frameArcRadius,
        frameArcRadius * 2,
        frameArcRadius * 2
      )
    )
      return 'BR';
  }
  return null;
}

//Save To LocalStorage
function SaveToLocal(firstUse = false) {
  localStorage.setItem(
    'cav' + String(canvasID),
    JSON.stringify({
      canvasID: canvasID,
      canvasChangeFlag: canvasChangeFlag,
      canvasName: canvasName,
      canvasData: shapes,
      canvasPositionData: [
        {
          d: firstUse ? 1 : ctx.getTransform().d,
          e: firstUse ? 0 : ctx.getTransform().e,
          f: firstUse ? 0 : ctx.getTransform().f,
        },
      ],
    })
  );
}

//Zoom
let scaleFactor = 1.1;
function zoom(clicks: number) {
  let pt = ctx.transformedPoint(lastX, lastY);
  ctx.translate(pt.x, pt.y);
  let factor = Math.pow(scaleFactor, clicks);
  ctx.scale(factor, factor);
  ctx.translate(-pt.x, -pt.y);

  redraw();
  SaveToLocal();
  if (isDreaggingResize) drawResizeFrame(selectedShapeIndex);
  if (selectedShapes.length > 0) drawSelectFrame(0, 0, 0, 0);
}

//Add image to draw list
function AddToCanvas(
  x: number,
  y: number,
  width: number,
  height: number,
  image: any,
  url: string,
  i: number,
  type: string,
  text: any,
  gif: any
) {
  shapes.push({
    x: x,
    y: y,
    width: width,
    height: height,
    image: image,
    url: url,
    position: i,
    type: type,
    text: text,
    gif: gif,
  });
  selectedShapes = [];
  selectedShapeIndex = -1;
  redraw();
}

function loadCanvas(cookies: string) {
  shapes = [];

  let content = null;

  for (let key in localStorage) {
    if (key.substring(0, 3) == 'cav') {
      let data: any = localStorage.getItem(key);
      content = JSON.parse(data);
      break;
    }
  }

  if (cookies) {
    let data: any = localStorage.getItem('cav' + cookies);
    if (data != null) content = JSON.parse(data);
  }

  if (content != null) {
    for (let i = 0; i < content.canvasData.length; i++) {
      let el = content.canvasData[i];
      if (el.type == 'Image') {
        let img = new Image();
        img.src = el.url;
        img.onload = function () {
          AddToCanvas(
            el.x,
            el.y,
            el.width,
            el.height,
            img,
            el.url,
            i,
            el.type,
            el.text,
            el.gif
          );
        };
      } else if (el.type == 'Text') {
        AddToCanvas(
          el.x,
          el.y,
          el.width,
          el.height,
          null,
          el.url,
          i,
          el.type,
          el.text,
          el.gif
        );
      } else if (el.type == 'Gif') {
        AddToCanvas(
          el.x,
          el.y,
          el.width,
          el.height,
          null,
          el.url,
          i,
          el.type,
          el.text,
          el.gif
        );
      }
    }
    canvasID = content.canvasID;
    canvasName = content.canvasName;
    canvasChangeFlag = content.canvasChangeFlag;
    return content.canvasPositionData[0];
  } else {
    canvasName = 'Unnamed';
    SaveToLocal(true);

    return [
      {
        d: 1,
        e: 0,
        f: 0,
      },
    ][0];
  }
}

function recalculateFrameSize() {
  let fs = ctx.transformedPoint(canvas.width, canvas.height);
  frameLineWidth = (fs.x + fs.y) * 0.001;
  frameArcRadius = frameLineWidth * 2;
}

function drawResizeFrame(shapeIndex: number) {
  ctx.strokeStyle = frameColor;
  ctx.lineWidth = frameLineWidth;
  ctx.strokeRect(
    shapes[shapeIndex].x,
    shapes[shapeIndex].y,
    shapes[shapeIndex].width,
    shapes[shapeIndex].height
  );

  ctx.fillStyle = frameColor;

  ctx.beginPath();
  ctx.arc(
    shapes[shapeIndex].x,
    shapes[shapeIndex].y,
    frameArcRadius,
    0,
    2 * Math.PI
  );
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.arc(
    shapes[shapeIndex].x,
    shapes[shapeIndex].y + shapes[shapeIndex].height,
    frameArcRadius,
    0,
    2 * Math.PI
  );
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.arc(
    shapes[shapeIndex].x + shapes[shapeIndex].width,
    shapes[shapeIndex].y,
    frameArcRadius,
    0,
    2 * Math.PI
  );
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.arc(
    shapes[shapeIndex].x + shapes[shapeIndex].width,
    shapes[shapeIndex].y + shapes[shapeIndex].height,
    frameArcRadius,
    0,
    2 * Math.PI
  );
  ctx.closePath();
  ctx.fill();
}

function drawSelectFrame(x: number, y: number, width: number, height: number) {
  ctx.strokeStyle = frameColor;
  ctx.lineWidth = frameLineWidth;
  ctx.strokeRect(x, y, width, height);

  ctx.globalAlpha = 0.5;
  ctx.fillStyle = frameColor;
  selectedShapes.forEach((s) => {
    ctx.fillRect(shapes[s].x, shapes[s].y, shapes[s].width, shapes[s].height);
  });
  ctx.globalAlpha = 1;
}

//Drop images
function LoadDrop(url: string, x: number, y: number) {
  if (url.endsWith('.gif')) {
    let data = decodeGif(url);
    if (data != null) {
      AddToCanvas(x, y, 0, 0, null, url, 0, 'Gif', null, data);
      SaveToLocal();
    }
  } else {
    var img = new Image();
    img.src = url;
    img.onload = function () {
      let position = 0;
      if (shapes.length > 0) position = shapes[shapes.length - 1].position + 1;
      AddToCanvas(
        x,
        y,
        img.width,
        img.height,
        img,
        url,
        position,
        'Image',
        null,
        null
      );
      SaveToLocal();
    };
  }
}

function checkURL(imageUrl: any) {
  let url = null;
  let rex = ['.jpg', '.jpeg', '.png', '.ebp', '.avif', '.gif', '.svg'];

  rex.forEach((el) => {
    let idxEnd = imageUrl.indexOf(el);
    let idxStart = imageUrl.indexOf('http');
    if (idxStart >= 0 && idxEnd > 0)
      url = imageUrl.substring(idxStart, idxEnd + el.length);
  });
  return url;
}

function handleDrop(evt: any) {
  evt.stopPropagation();
  evt.preventDefault();
  let url = checkURL(evt.dataTransfer.getData('text/html'));

  if (url != null) {
    lastX = evt.offsetX || evt.pageX - canvas.offsetLeft;
    lastY = evt.offsetY || evt.pageY - canvas.offsetTop;
    let pt = ctx.transformedPoint(lastX, lastY);
    LoadDrop(url, pt.x, pt.y);
  } else {
    $('#pageNotifications').text('Invalid URL');
    $('#pageNotifications').css('background-color', 'rgb(204, 5, 5)');
    $('#pageNotifications').slideToggle('fast').delay(800).slideToggle('fast');
  }
}

function handleMouseDown(evt: any) {
  if (evt.button == 1) {
    document.body.style.userSelect =
      document.body.style.webkitUserSelect =
      document.body.style.userSelect =
        'none';
    lastX = evt.offsetX || evt.pageX - canvas.offsetLeft;
    lastY = evt.offsetY || evt.pageY - canvas.offsetTop;
    dragStart = ctx.transformedPoint(lastX, lastY);
    dragged = false;
  } else if (evt.button == 2) {
    //isSelecting = false;
    // selectedShapes = [];
  } else if (evt.button == 0) {
    let pt = ctx.transformedPoint(lastX, lastY);
    imgStartX = pt.x;
    imgStartY = pt.y;
    let resizePos = isMouseInResizeShape(pt.x, pt.y, selectedShapeIndex);
    if (isResizing && resizePos != null) {
      resizeStartX = pt.x;
      resizeStartY = pt.y;
      isDreaggingResize = resizePos;
    } else if (selectedShapes.length > 0) {
      isSelecting = false;
      let inShape = false;
      for (let i = shapes.length - 1; i >= 0; i--) {
        if (
          selectedShapes.includes(i) &&
          isMouseInShape(pt.x, pt.y, shapes[i])
        ) {
          inShape = true;
          isDraggingImg = true;
          break;
        }
      }
      if (!inShape) {
        selectedShapes = [];
        redraw();
      }
    }
    if (selectedShapes.length <= 0 && resizePos == null) {
      isSelecting = true;
      selectStartX = pt.x;
      selectStartY = pt.y;
      for (let i = shapes.length - 1; i >= 0; i--) {
        if (isMouseInShape(pt.x, pt.y, shapes[i])) {
          recalculateFrameSize();
          //Move on top
          if(imageOrder=="Top"){
            let tmp = shapes[i];
            tmp.position = shapes[shapes.length - 1].position + 1;
            shapes.splice(i, 1);
            shapes.push(tmp);
            selectedShapeIndex = shapes.length - 1;
          }
          //Draw Frame
          redraw();
          ctx.strokeStyle = frameColor;
          ctx.lineWidth = frameLineWidth;
          ctx.strokeRect(
            shapes[selectedShapeIndex].x,
            shapes[selectedShapeIndex].y,
            shapes[selectedShapeIndex].width,
            shapes[selectedShapeIndex].height
          );
          isDraggingImg = true;
          isSelecting = false;
          break;
        }
      }
    }
  }
  SaveToLocal();
}

function handleMouseMove(evt: any) {
  lastX = evt.offsetX || evt.pageX - canvas.offsetLeft;
  lastY = evt.offsetY || evt.pageY - canvas.offsetTop;
  dragged = true;
  $('.mainCanvas').css('cursor', 'default');
  if (dragStart) {
    let pt = ctx.transformedPoint(lastX, lastY);
    ctx.translate(pt.x - dragStart.x, pt.y - dragStart.y);
    redraw();
    if (selectedShapes.length > 0) drawSelectFrame(0, 0, 0, 0);
  }
  if (isDraggingImg) {
    let toMove = [];

    if (selectedShapes.length > 0)
      selectedShapes.forEach((val) => toMove.push(val));
    else toMove.push(selectedShapeIndex);

    let pt = ctx.transformedPoint(lastX, lastY);

    toMove.forEach((s) => {
      let dx = pt.x - imgStartX;
      let dy = pt.y - imgStartY;
      let selectedShape = shapes[s];
      selectedShape.x += dx;
      selectedShape.y += dy;
    });

    redraw();

    if (selectedShapes.length > 0) drawSelectFrame(0, 0, 0, 0);
    else {
      ctx.strokeStyle = frameColor;
      ctx.lineWidth = frameLineWidth;
      ctx.strokeRect(
        shapes[selectedShapeIndex].x,
        shapes[selectedShapeIndex].y,
        shapes[selectedShapeIndex].width,
        shapes[selectedShapeIndex].height
      );
    }

    imgStartX = pt.x;
    imgStartY = pt.y;
  }
  if (isDreaggingResize != null) {
    let pt = ctx.transformedPoint(lastX, lastY);
    let selectedShape = shapes[selectedShapeIndex];
    let dx = pt.x - resizeStartX;
    let dy = pt.y - resizeStartY;

    if (isDreaggingResize == 'BR') {
      selectedShape.width += dx;
      selectedShape.height += dy;
    } else if (isDreaggingResize == 'TR') {
      selectedShape.height -= dy;
      selectedShape.width += dx;
      selectedShape.y += dy;
    } else if (isDreaggingResize == 'TL') {
      selectedShape.width -= dx;
      selectedShape.height -= dy;
      selectedShape.x += dx;
      selectedShape.y += dy;
    } else if (isDreaggingResize == 'BL') {
      selectedShape.width -= dx;
      selectedShape.height += dy;
      selectedShape.x += dx;
    }

    recalculateFrameSize();

    resizeStartX = pt.x;
    resizeStartY = pt.y;
    redraw();
    drawResizeFrame(selectedShapeIndex);
  }
  if (isResizing) {
    let pt = ctx.transformedPoint(lastX, lastY);
    let position = isMouseInResizeShape(pt.x, pt.y, selectedShapeIndex);
    if (position == 'TL')
      $('.mainCanvas').css(
        'cursor',
        (shapes[selectedShapeIndex].width < 0 ||
          shapes[selectedShapeIndex].height < 0) ==
          (shapes[selectedShapeIndex].width < 0 &&
            shapes[selectedShapeIndex].height < 0)
          ? 'nw-resize'
          : 'sw-resize'
      );
    else if (position == 'TR')
      $('.mainCanvas').css(
        'cursor',
        (shapes[selectedShapeIndex].width < 0 ||
          shapes[selectedShapeIndex].height < 0) ==
          (shapes[selectedShapeIndex].width < 0 &&
            shapes[selectedShapeIndex].height < 0)
          ? 'sw-resize'
          : 'nw-resize'
      );
    else if (position == 'BL')
      $('.mainCanvas').css(
        'cursor',
        (shapes[selectedShapeIndex].width < 0 ||
          shapes[selectedShapeIndex].height < 0) ==
          (shapes[selectedShapeIndex].width < 0 &&
            shapes[selectedShapeIndex].height < 0)
          ? 'sw-resize'
          : 'nw-resize'
      );
    else if (position == 'BR')
      $('.mainCanvas').css(
        'cursor',
        (shapes[selectedShapeIndex].width < 0 ||
          shapes[selectedShapeIndex].height < 0) ==
          (shapes[selectedShapeIndex].width < 0 &&
            shapes[selectedShapeIndex].height < 0)
          ? 'nw-resize'
          : 'sw-resize'
      );
  }
  if (isSelecting) {
    let pt = ctx.transformedPoint(lastX, lastY);
    let dx = pt.x - selectStartX;
    let dy = pt.y - selectStartY;

    redraw();

    selectedShapes = getShapesInRange(selectStartX, selectStartY, dx, dy);

    recalculateFrameSize();
    drawSelectFrame(selectStartX, selectStartY, dx, dy);
  }
}

function handleMouseUp(evt: any) {
  dragStart = null;
  if (!dragged) zoom(evt.shiftKey ? -1 : 1);
  if (isDraggingImg) isDraggingImg = false;
  if (evt.button == 0 && isDreaggingResize != null) {
    isDreaggingResize = null;
    isResizing = true;
  } else redraw();
  if (selectedShapes.length > 0 || isSelecting) {
    isSelecting = false;
    drawSelectFrame(0, 0, 0, 0);
  }
  SaveToLocal();
}

function handleScroll(evt: any) {
  delta = -evt.deltaY ? -evt.deltaY / 40 : evt.detail ? -evt.detail : 0;
  if (delta) zoom(delta);
}

function handleContextMenu(
  evt: any,
  showDropdown: any,
  showTextDropdown: any,
  showSelectDropdown: any
) {
  evt.preventDefault();

  let pt = ctx.transformedPoint(lastX, lastY);
  for (let i = shapes.length - 1; i >= 0; i--) {
    if (isMouseInShape(pt.x, pt.y, shapes[i])) {
      let inSelect = false;

      for (let s = 0; s < selectedShapes.length; s++) {
        if (selectedShapes[s] == i) {
          inSelect = true;
          break;
        }
      }

      if (!inSelect) selectedShapes = [];

      selectedShapeIndex = i;
      let top = evt.pageY;
      let left = evt.pageX;
      $('#context-menu').css({
        top: top - 5,
        left: left - 5,
      });
      if (selectedShapes.length > 0) showSelectDropdown();
      else if (shapes[selectedShapeIndex].type == 'Text') showTextDropdown();
      else showDropdown();

      break;
    }
  }
  sessionStorage.setItem(
    'ShapesTMP',
    JSON.stringify({
      shapes: shapes,
      canvasID: canvasID,
      context: true,
    })
  );
}

function deleteImage() {
  let data: any = sessionStorage.getItem('ShapesTMP');
  let content = JSON.parse(data);

  shapes = content.shapes;

  if (selectedShapes.length > 0) {
    selectedShapes.sort((a, b) => {
      if (a >= b) return a;
      else return b;
    });

    for (let i = selectedShapes.length - 1; i >= 0; i--) {
      shapes.splice(selectedShapes[i], 1);
    }

    selectedShapes = [];
    selectedShapeIndex = -1;
  } else shapes.splice(selectedShapeIndex, 1);

  SaveToLocal();
  loadCanvas(content.canvasID);
  redraw();
}

function resizeImage() {
  //Draw Frame
  let pt = ctx.transformedPoint(lastX, lastY);
  for (let i = shapes.length - 1; i >= 0; i--) {
    if (isMouseInShape(pt.x, pt.y, shapes[i])) {
      selectedShapeIndex = i;
      isResizing = true;

      recalculateFrameSize();

      drawResizeFrame(i);

      break;
    }
  }
}

function copyImageURL() {
  navigator.clipboard.writeText(shapes[selectedShapeIndex].url);

  $('#pageNotifications').text('Copied To Clipboard');
  $('#pageNotifications').css('background-color', 'rgb(5, 204, 32)');
  $('#pageNotifications').slideToggle('fast').delay(800).slideToggle('fast');
}

function modalAddImage(input: string) {
  let url = checkURL(input);

  if (url != null) {
    lastX = canvas.width / 2;
    lastY = canvas.height / 2;
    let pt = ctx.transformedPoint(lastX, lastY);
    LoadDrop(url, pt.x, pt.y);

    $('#addImageInput')
      .css('border', '2px solid rgb(5, 204, 32)')
      .delay(1100)
      .queue(() => {
        $('#addImageInput').css('border', '0');
        $('#addImageInput').dequeue();
      });
    $('#addImageInput').val('');
  } else {
    $('#imageAddError').slideToggle('fast').delay(800).slideToggle('fast');
    $('#addImageInput')
      .css('border', '2px solid rgb(204, 5, 5)')
      .delay(1100)
      .queue(() => {
        $('#addImageInput').css('border', '0');
        $('#addImageInput').dequeue();
      });
  }
}

function modalAddText(input: any) {
  lastX = canvas.width / 2;
  lastY = canvas.height / 2;
  let pt = ctx.transformedPoint(lastX, lastY);

  let position = 0;
  if (shapes.length > 0) position = shapes[shapes.length - 1].position + 1;

  ctx.font = input.size * 10 + 'px ' + input.font;
  let metrics = ctx.measureText(input.value);
  let w = metrics.width;
  let h = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;

  input.id = uuidv4();

  AddToCanvas(
    pt.x - w,
    pt.y - h,
    w,
    h,
    null,
    '',
    position,
    'Text',
    input,
    null
  );

  selectedTextIndex = shapes.length;
  selectedTextID = input.id;
  SaveToLocal();
}

function openEditCanvasText() {
  let textData = shapes[selectedShapeIndex].text;
  selectedTextID = textData.id;
  $('#addTextValue').val(textData.value);
  $('#addTextSize').val(textData.size);
  $('#addTextColor').val(textData.color);
  $('#fontInput').val(textData.font);

  selectedTextIndex = selectedShapeIndex;
}

function editCanvasText(input: any) {
  let pos = -1;

  if ($('#addTextValue').val() != input.value) return;

  if (shapes[selectedTextIndex] != null)
    if (shapes[selectedTextIndex].id == selectedTextID) pos = selectedTextIndex;

  if (pos < 0) {
    for (let i = 0; i < shapes.length; i++) {
      if (shapes[i].type == 'Text' && shapes[i].text.id == selectedTextID) {
        pos = i;
        break;
      }
    }
  }

  if (pos >= 0) {
    ctx.font = input.size * 10 + 'px ' + input.font;
    let metrics = ctx.measureText(input.value);
    let w = metrics.width;
    let h = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;

    input.id = shapes[pos].text.id;
    shapes[pos].text = input;
    shapes[pos].width = w;
    shapes[pos].height = h;
    redraw();
    SaveToLocal();
  }
}

function decodeGif(gifURL: string) {
  let oReq = new XMLHttpRequest();
  oReq.open('GET', gifURL, true);
  oReq.responseType = 'arraybuffer';
  let frames = null;
  oReq.onload = () => {
    let arrayBuffer = oReq.response;
    if (arrayBuffer) {
      var gif = parseGIF(arrayBuffer);
      frames = decompressFrames(gif, true);
      //let d = ctx.createImageData(frames[0].dims.width, frames[0].dims.height);
      //d.data.set(frames[0].patch);
      //ctx.putImageData(d, 0, 0);
      console.log(frames);
    }
  };
  console.log(frames);
  return frames;
}

const Canvas = (
  {
    showDropdown,
    showTextDropdown,
    showSelectDropdown,
    hideDropdown,
    contextDelete,
    endContextDelete,
    contextResize,
    contextCopyURL,
    endContextResize,
    endContextCopyURL,
    contextEditText,
    endContextEditText,
    resetNavBar,
    modalAddImageClick,
    modalAddImageStatus,
    modalAddImageEnd,
    modalAddTextClick,
    modalAddTextStatus,
    modalAddTextEnd,
    handleTextAddShow,
    textAddShowStatus,
    canvasSettings,
  }: any,
  props: any
) => {
  useEffect(() => {
    frameColor = canvasSettings.sColor;
    imageOrder = canvasSettings.sType;
  }, [canvasSettings]);

  useEffect(() => {
    if (!textAddShowStatus) {
      setTimeout(() => {
        selectedTextID = -1;
        selectedTextIndex = -1;
        $('#addTextValue').val('');
        $('#addTextSize').val('');
        $('#addTextColor').val('#000000');
        $('#fontInput').val('Arial');
      }, 100);
    }
  }, [textAddShowStatus]);
  useEffect(() => {
    if (modalAddTextStatus.value != '') {
      if (modalAddTextStatus.action == 'Add' && selectedTextIndex < 0) {
        modalAddText(modalAddTextStatus);
        modalAddTextEnd();
      } else if (
        modalAddTextStatus.action == 'Edit' &&
        selectedTextIndex >= 0
      ) {
        editCanvasText(modalAddTextStatus);
        modalAddTextEnd();
      } else if (modalAddTextStatus.action == 'Add' && selectedTextIndex >= 0) {
        selectedTextIndex = -1;
        selectedTextID = -1;
        modalAddTextEnd();

        $('#textAddToggle')
          .animate(
            {
              width: 'toggle',
            },
            200
          )
          .css('display', 'grid');
        setTimeout(() => {
          $('#addTextValue').val('');
          $('#addTextSize').val('');
          $('#addTextColor').val('#000000');
          $('#fontInput').val('Arial');
          $('#textAddToggle')
            .animate(
              {
                width: 'toggle',
              },
              200
            )
            .css('display', 'grid');
        }, 200);
      }
    }
  }, [modalAddTextClick]);

  useEffect(() => {
    if (modalAddImageStatus != '') modalAddImage(modalAddImageStatus);
    modalAddImageEnd();
  }, [modalAddImageClick]);

  useEffect(() => {
    if (contextDelete) {
      deleteImage();
      endContextDelete();
    } else if (contextResize) {
      resizeImage();
      endContextResize();
    } else if (contextCopyURL) {
      copyImageURL();
      endContextCopyURL();
    } else if (contextEditText) {
      if (!textAddShowStatus) handleTextAddShow();
      openEditCanvasText();
      endContextEditText();
    }
    hideDropdown();
  }, [contextDelete, contextResize, contextCopyURL, contextEditText]);

  const canvasRef = useRef<any>();

  window.onresize = () => {
    canvas = canvasRef.current;
    ctx = canvas.getContext('2d');

    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

    let tmp = ctx.getTransform();
    ctx.setTransform(tmp.d, 0, 0, tmp.d, tmp.e, tmp.f);

    lastX = canvas.width / 2;
    lastY = canvas.height / 2;

    redraw();
  };

  useEffect(() => {
    let data: any = sessionStorage.getItem('ShapesTMP');
    let content = JSON.parse(data);

    if (content != null) {
      if (content.context) {
        canvas = canvasRef.current;
        ctx = canvas.getContext('2d');

        canvas.height = window.innerHeight;
        canvas.width = window.innerWidth;

        reOffset();

        let tmp = ctx.getTransform();
        ctx.setTransform(tmp.d, 0, 0, tmp.d, tmp.e, tmp.f);

        redraw();

        if (selectedShapes.length >= 0) drawSelectFrame(0, 0, 0, 0);

        sessionStorage.setItem(
          'ShapesTMP',
          JSON.stringify({
            shapes: content.shapes,
            canvasID: content.canvasID,
            context: false,
          })
        );
      }
    }
  }, [showDropdown]);

  const [cookies, setCookie] = useCookies(['canvasID']);
  useEffect(() => {
    canvas = canvasRef.current;
    ctx = canvas.getContext('2d');

    trackTransforms();

    canvasID = uuidv4();
    let lastPosition = loadCanvas(cookies.canvasID);
    setCookie('canvasID', canvasID);

    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

    reOffset();

    lastX = canvas.width / 2;
    lastY = canvas.height / 2;

    ctx.setTransform(
      lastPosition.d,
      0,
      0,
      lastPosition.d,
      lastPosition.e,
      lastPosition.f
    );
    resetNavBar();
    redraw();
  }, []);

  return (
    <canvas
      className="mainCanvas"
      itemID="mainCanvas"
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onDrop={handleDrop}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleScroll}
      onContextMenu={(e: any) => {
        handleContextMenu(
          e,
          showDropdown,
          showTextDropdown,
          showSelectDropdown
        );
      }}
      ref={canvasRef}
      width={window.innerWidth}
      height={window.innerHeight}
      {...props}
    />
  );
};

export default Canvas;
