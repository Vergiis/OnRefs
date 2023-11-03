import { useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useCookies } from 'react-cookie';
import $ from 'jquery';

let canvas: any;
let ctx: any;

let shapes: any[] = [];
let canvasID: string = '-1';
let canvasName: string = 'Unnamed';
let canvasChangeFlag: boolean = false;

let delta = 0;
let dragStart: any;
let dragged: any;

let selectedShapeIndex: number;

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
const frameColor = '#F00';

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
    ctx.drawImage(
      shapes[i].image,
      shapes[i].x,
      shapes[i].y,
      shapes[i].width,
      shapes[i].height
    );
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

function isMouseInShape(mx: number, my: number, shape: any) {
  if (
    shape.image &&
    isPointInside(mx, my, shape.x, shape.y, shape.width, shape.height)
  )
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
}

//Add image to draw list
function AddImage(
  x: number,
  y: number,
  width: number,
  height: number,
  image: any,
  url: string,
  i: number
) {
  shapes.push({
    x: x,
    y: y,
    width: width,
    height: height,
    image: image,
    url: url,
    position: i,
  });
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
      let img = new Image();
      img.src = el.url;
      img.onload = function () {
        AddImage(el.x, el.y, el.width, el.height, img, el.url, i);
      };
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

function recalculateFrameSize(shapeIndex: number) {
  frameLineWidth =
    (Math.abs(shapes[shapeIndex].width) + Math.abs(shapes[shapeIndex].height)) *
    0.01;
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

//Drop images
function LoadDrop(url: string, x: number, y: number) {
  var img = new Image();
  img.src = url;
  img.onload = function () {
    let position = 0;
    if (shapes.length > 0) position = shapes[shapes.length - 1].position + 1;
    AddImage(x, y, img.width, img.height, img, url, position);
    SaveToLocal();
  };
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
  } else if (evt.button == 0) {
    let pt = ctx.transformedPoint(lastX, lastY);
    imgStartX = pt.x;
    imgStartY = pt.y;
    let resizePos = isMouseInResizeShape(pt.x, pt.y, selectedShapeIndex);
    if (isResizing && resizePos != null) {
      resizeStartX = pt.x;
      resizeStartY = pt.y;
      isDreaggingResize = resizePos;
    } else {
      for (let i = shapes.length - 1; i >= 0; i--) {
        if (isMouseInShape(pt.x, pt.y, shapes[i])) {
          recalculateFrameSize(i);
          let tmp = shapes[i];
          tmp.position = shapes[shapes.length - 1].position + 1;
          shapes.splice(i, 1);
          shapes.push(tmp);
          selectedShapeIndex = shapes.length - 1;
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
  }
  if (isDraggingImg) {
    let pt = ctx.transformedPoint(lastX, lastY);

    let dx = pt.x - imgStartX;
    let dy = pt.y - imgStartY;
    let selectedShape = shapes[selectedShapeIndex];
    selectedShape.x += dx;
    selectedShape.y += dy;
    redraw();
    ctx.strokeStyle = frameColor;
    ctx.lineWidth = frameLineWidth;
    ctx.strokeRect(
      shapes[selectedShapeIndex].x,
      shapes[selectedShapeIndex].y,
      shapes[selectedShapeIndex].width,
      shapes[selectedShapeIndex].height
    );
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

    recalculateFrameSize(selectedShapeIndex);

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
}

function handleMouseUp(evt: any) {
  dragStart = null;
  if (!dragged) zoom(evt.shiftKey ? -1 : 1);
  if (isDraggingImg) isDraggingImg = false;
  if (evt.button == 0) isDreaggingResize = null;
  SaveToLocal();
  redraw();
}

function handleScroll(evt: any) {
  delta = -evt.deltaY ? -evt.deltaY / 40 : evt.detail ? -evt.detail : 0;
  if (delta) zoom(delta);
}

function handleContextMenu(evt: any, showDropdown: any) {
  evt.preventDefault();

  let pt = ctx.transformedPoint(lastX, lastY);
  for (let i = shapes.length - 1; i >= 0; i--) {
    if (isMouseInShape(pt.x, pt.y, shapes[i])) {
      selectedShapeIndex = i;
      let top = evt.pageY;
      let left = evt.pageX;
      $('#context-menu').css({
        top: top - 5,
        left: left - 5,
      });
      showDropdown();
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
  shapes.splice(selectedShapeIndex, 1);

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

      recalculateFrameSize(i);

      drawResizeFrame(i);

      break;
    }
  }
}

function modalAddImage(input: string) {
  let url = checkURL(input);

  if (url != null) {
    lastX = canvas.width / 2;
    lastY = canvas.height / 2;
    let pt = ctx.transformedPoint(lastX, lastY);
    LoadDrop(url, pt.x, pt.y);
  }
}

const Canvas = (
  {
    showDropdown,
    hideDropdown,
    contextDelete,
    endContextDelete,
    contextResize,
    endContextResize,
    resetNavBar,
    modalAddImageClick,
    modalAddImageStatus,
    modalAddImageEnd,
  }: any,
  props: any
) => {
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
    }
    hideDropdown();
  }, [contextDelete, contextResize]);

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
    canvasID = uuidv4();
    let lastPosition = loadCanvas(cookies.canvasID);
    setCookie('canvasID', canvasID);

    canvas = canvasRef.current;
    ctx = canvas.getContext('2d');

    trackTransforms();

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
        handleContextMenu(e, showDropdown);
      }}
      ref={canvasRef}
      width={window.innerWidth}
      height={window.innerHeight}
      {...props}
    />
  );
};

export default Canvas;
