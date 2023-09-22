import { useRef } from 'react';

let canvas: any;
let ctx: any;

let shapes: any[] = [];
let canvasID: number = 0;

let delta = 0;
let zoomFull = 0;
let dragStart: any;
let dragged: any;

let selectedShapeIndex: number;

let isDraggingImg = false;
let imgStartX: number;
let imgStartY: number;

let lastX: number;
let lastY: number;

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

//Draw
function redraw() {
  //Clear canvas
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.restore();

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

function isMouseInShape(mx: number, my: number, shape: any) {
  if (shape.image) {
    let rLeft = shape.x;
    let rRight = shape.x + shape.width;
    let rTop = shape.y;
    let rBott = shape.y + shape.height;
    if (mx > rLeft && mx < rRight && my > rTop && my < rBott) {
      return true;
    }
  }
  return false;
}

//Save To LocalStorage
function SaveToLocal() {
  if (canvasID < 0) {
    localStorage.setItem(
      'cav' + String(canvasID),
      JSON.stringify({
        canvasData: shapes,
        canvasPositionData: [
          {
            xPosition: ctx.getTransform().e,
            yPosition: ctx.getTransform().f,
            zoom: zoomFull,
          },
        ],
      })
    );
  } else if (canvasID > 0) {
    localStorage.setItem(
      'cav' + String(canvasID),
      JSON.stringify({
        canvasData: shapes,
        canvasPositionData: [
          {
            xPosition: ctx.getTransform().e,
            yPosition: ctx.getTransform().f,
            zoom: zoomFull,
          },
        ],
      })
    );

    /*let str = $('#canvasItem'+String(canvasID)).text();
		if(str.substr(0,1)!="*")
			$('#canvasItem'+String(canvasID)).text("*"+str);

		str=$('#canvasDropdownBtn').text();
		if(str.substr(str.length-1,1)!="*")
			$('#canvasDropdownBtn').text(str+"*");*/
  }
}

//Zoom
let scaleFactor = 1.1;
function zoom(clicks: number) {
  let pt = ctx.transformedPoint(lastX, lastY);
  ctx.translate(pt.x, pt.y);
  let factor = Math.pow(scaleFactor, clicks);
  ctx.scale(factor, factor);
  ctx.translate(-pt.x, -pt.y);
  zoomFull += clicks;
  redraw();
  SaveToLocal();
}

//Add image to draw list
function AddImage(
  x: number,
  y: number,
  width: number,
  height: number,
  image: any,
  url: string
) {
  shapes.push({
    x: x,
    y: y,
    width: width,
    height: height,
    image: image,
    url: url,
  });
  redraw();
}

function loadCanvas() {
  let img = new Image();
  img.src =
    'https://www.pracowityogrodnik.pl/wp-content/uploads/2015/04/frezowanie-pni.jpg';
  img.onload = function () {
    AddImage(
      0,
      0,
      200,
      200,
      img,
      'https://www.pracowityogrodnik.pl/wp-content/uploads/2015/04/frezowanie-pni.jpg'
    );
  };
}

//Drop images
function LoadDrop(url: string, x: number, y: number) {
  var img = new Image();
  img.src = url;
  img.onload = function () {
    AddImage(x, y, img.width, img.height, img, url);
    SaveToLocal();
  };
}

const Canvas = (props: any) => {
  const canvasRef = useRef<any>();

  window.onloadstart = () => {
    canvas = canvasRef.current;
    ctx = canvas.getContext('2d');
  };

  window.onresize = () => {
    canvas = canvasRef.current;
    ctx = canvas.getContext('2d');

    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

    trackTransforms();

    redraw();
  };

  window.onload = () => {
    canvas = canvasRef.current;
    ctx = canvas.getContext('2d');

    trackTransforms();

    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

    let [offsetX, offsetY] = reOffset();

    lastX = canvas.width / 2;
    lastY = canvas.height / 2;

    loadCanvas();

    //Move
    //####################################################################
    canvas.addEventListener(
      'mousedown',
      function (evt: any) {
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
          for (let i = shapes.length - 1; i >= 0; i--) {
            if (isMouseInShape(pt.x, pt.y, shapes[i])) {
              let tmp = shapes[i];
              shapes.splice(i, 1);
              shapes.push(tmp);
              selectedShapeIndex = shapes.length - 1;
              redraw();
              ctx.strokeStyle = '#f00';
              ctx.lineWidth = 2;
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
      },
      false
    );
    canvas.addEventListener(
      'mousemove',
      function (evt: any) {
        lastX = evt.offsetX || evt.pageX - canvas.offsetLeft;
        lastY = evt.offsetY || evt.pageY - canvas.offsetTop;
        dragged = true;
        if (dragStart) {
          let pt = ctx.transformedPoint(lastX, lastY);
          ctx.translate(pt.x - dragStart.x, pt.y - dragStart.y);
          redraw();
          SaveToLocal();
        }
        if (isDraggingImg) {
          let pt = ctx.transformedPoint(lastX, lastY);

          let dx = pt.x - imgStartX;
          let dy = pt.y - imgStartY;
          let selectedShape = shapes[selectedShapeIndex];
          selectedShape.x += dx;
          selectedShape.y += dy;
          redraw();
          ctx.strokeStyle = '#f00';
          ctx.lineWidth = 2;
          ctx.strokeRect(
            shapes[selectedShapeIndex].x,
            shapes[selectedShapeIndex].y,
            shapes[selectedShapeIndex].width,
            shapes[selectedShapeIndex].height
          );
          imgStartX = pt.x;
          imgStartY = pt.y;
          SaveToLocal();
        }
      },
      false
    );
    canvas.addEventListener(
      'mouseup',
      function (evt: any) {
        dragStart = null;
        if (!dragged) zoom(evt.shiftKey ? -1 : 1);
        if (isDraggingImg) isDraggingImg = false;
        redraw();
      },
      false
    );

    //Zoom
    //###################################################
    let handleScroll = function (evt: any) {
      delta = evt.wheelDelta
        ? evt.wheelDelta / 40
        : evt.detail
        ? -evt.detail
        : 0;
      if (delta) zoom(delta);
      return evt.preventDefault() && false;
    };
    canvas.addEventListener('DOMMouseScroll', handleScroll, false);
    canvas.addEventListener('wheel', handleScroll, false);

    //Drop Image
    //####################################################
    canvas.addEventListener(
      'drop',
      function (evt: any) {
        evt.stopPropagation();
        evt.preventDefault();
        let imageUrl = evt.dataTransfer.getData('text/html');

        let rex = /src="?([^"\s]+)"?\s*/;
        let url: any = rex.exec(imageUrl);
        if (url[1] != null) {
          lastX = evt.offsetX || evt.pageX - canvas.offsetLeft;
          lastY = evt.offsetY || evt.pageY - canvas.offsetTop;
          let pt = ctx.transformedPoint(lastX, lastY);
          LoadDrop(url[1], pt.x, pt.y);
        }
      },
      false
    );
  };

  return (
    <canvas
      className="mainCanvas"
      itemID="mainCanvas"
      ref={canvasRef}
      {...props}
    />
  );
};

export default Canvas;
