import { useEffect, useRef } from 'react';

let canvas: any;
let ctx: any;

let shapes: any[] = [];
let canvasID: number = -1;

let delta = 0;
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
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
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
  localStorage.setItem(
    'cav' + String(canvasID),
    JSON.stringify({
      canvasData: shapes,
      canvasPositionData: [
        {
          d: ctx.getTransform().d,
          e: ctx.getTransform().e,
          f: ctx.getTransform().f,
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

//Load From LocalStorage
function LoadFromLocal(content: any) {
  if (content != null) {
    let tmp = content.canvasPositionData[0];
    ctx.setTransform(tmp.d, 0, 0, tmp.d, tmp.e, tmp.f);

    content.canvasData.forEach((el) => {
      var img = new Image();
      img.src = el.url;
      img.onload = function () {
        AddImage(el.x, el.y, el.width, el.height, img, el.url);
      };
    });
  } else {
    localStorage.setItem(
      'cav' + String(canvasID),
      JSON.stringify({
        canvasData: shapes,
        canvasPositionData: [{ xPosition: 0, yPosition: 0, zoom: 0 }],
      })
    );
  }
  //CanvasesDropdown();
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
  let data: any = localStorage.getItem('cav' + String(canvasID));
  let content = JSON.parse(data);
  LoadFromLocal(content);
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

function handleDrop(evt: any) {
  evt.stopPropagation();
  evt.preventDefault();
  var imageUrl = evt.dataTransfer.getData('text/html');

  var rex = /src="?([^"\s]+)"?\s*/;
  var url: any = rex.exec(imageUrl);
  if (url[1] != null) {
    lastX = evt.offsetX || evt.pageX - canvas.offsetLeft;
    lastY = evt.offsetY || evt.pageY - canvas.offsetTop;
    var pt = ctx.transformedPoint(lastX, lastY);
    LoadDrop(url[1], pt.x, pt.y);
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
    for (let i = shapes.length - 1; i >= 0; i--) {
      if (isMouseInShape(pt.x, pt.y, shapes[i])) {
        let tmp = shapes[i];
        shapes.splice(i, 1);
        shapes.push(tmp);
        selectedShapeIndex = shapes.length - 1;
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
}

function handleMouseMove(evt: any) {
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
}

function handleMouseUp(evt: any) {
  dragStart = null;
  if (!dragged) zoom(evt.shiftKey ? -1 : 1);
  if (isDraggingImg) isDraggingImg = false;
}

function handleScroll(evt: any) {
  delta = evt.wheelDelta ? evt.wheelDelta / 40 : evt.detail ? -evt.detail : 0;
  console.log(delta);
  if (delta) zoom(delta);
}

const Canvas = (props: any) => {
  const canvasRef = useRef<any>();

  window.onresize = () => {
    canvas = canvasRef.current;
    ctx = canvas.getContext('2d');

    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

    let tmp = ctx.getTransform();
    ctx.setTransform(tmp.a, tmp.b, tmp.c, tmp.d, tmp.e, tmp.f);

    redraw();
  };

  useEffect(() => {
    canvas = canvasRef.current;
    ctx = canvas.getContext('2d');

    trackTransforms();

    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

    let [offsetX, offsetY] = reOffset();

    lastX = canvas.width / 2;
    lastY = canvas.height / 2;

    loadCanvas();
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
      onScroll={handleScroll}
      ref={canvasRef}
      width={window.innerWidth}
      height={window.innerHeight}
      {...props}
    />
  );
};

export default Canvas;
