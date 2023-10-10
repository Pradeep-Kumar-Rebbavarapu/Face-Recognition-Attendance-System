import React, { useEffect } from 'react'

export default function Model() {
    useEffect(()=>{
        /*
  Johan Karlsson, 2021
  https://twitter.com/DonKarlssonSan
  MIT License, see Details View
  
  https://en.wikipedia.org/wiki/Delaunay_triangulation
  
  https://en.wikipedia.org/wiki/Bowyer%E2%80%93Watson_algorithm
  
  https://en.wikipedia.org/wiki/Circumscribed_circle
*/

class Vector {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
  
    add(v) {
      return new Vector(
        this.x + v.x,
        this.y + v.y);
    }
  
    addTo(v) {
      this.x += v.x;
      this.y += v.y;
    }
  
    sub(v) {
      return new Vector(
        this.x - v.x,
        this.y - v.y);
    }
    
    subFrom(v) {
      this.x -= v.x;
      this.y -= v.y;
    }
    
    mult(n) {
      return new Vector(this.x * n, this.y * n);
    }
    
    multTo(n) {
      this.x *= n;
      this.y *= n;
      return this;
    }
    
    div(n) {
      return new Vector(this.x / n, this.y / n);
    }
    
    setAngle(angle) {
      var length = this.getLength();
      this.x = Math.cos(angle) * length;
      this.y = Math.sin(angle) * length;
    }
    
    setLength(length) {
      var angle = this.getAngle();
      this.x = Math.cos(angle) * length;
      this.y = Math.sin(angle) * length;
      return this;
    }
    
    getAngle() {
      return Math.atan2(this.y, this.x);
    }
    
    getLength() {
      return Math.hypot(this.x, this.y);
    }
  
    getLengthSq() {
      return this.x * this.x + this.y * this.y;
    }
  
    distanceTo(v) {
      return this.sub(v).getLength();
    }
  
    copy() {
      return new Vector(this.x, this.y);
    }
    
    equals(v) {
      return this.x == v.x && this.y == v.y;
    }
    
    rotate(angle) {
      return new Vector(this.x * Math.cos(angle) - this.y * Math.sin(angle), this.x * Math.sin(angle) + this.y * Math.cos(angle));
    }
    
    rotateAround(v, angle) {
      let x = (this.x - v.x) * Math.cos(angle) - (v.y - this.y) * Math.sin(angle) + v.x;
      let y = (v.y - this.y) * Math.cos(angle) + (this.x - v.x) * Math.sin(angle) + v.y;
      return new Vector(x, y);
    }
    
    lerp(v, t) {
      let delta = v.sub(this).mult(t);
      return this.add(delta);
    }
  
    lerpTo(v, t) {
      let delta = v.sub(this).mult(t);
      this.addTo(delta);
    }
  
    moveTowards(v, length) {
      let delta = v.sub(this).setLength(length);
      return this.add(delta);
    }
    
    toString() {
      return `${this.x},${this.y}`;
    }
  }
  
  class Particle {
    constructor(x, y) {
      this.dest = new Vector(x, y);
      this.pos = new Vector(x, y);
      this.v = new Vector(0, 0);
      this.pinned = false;
    }
    
    get x() {
      return this.pos.x;
    }
    
    get y() {
      return this.pos.y;
    }
    
    move(force) {
      if(!this.pinned) {
        this.applySpringForce();
        this.v.multTo(force);
        this.pos.addTo(this.v);
      }
    }
    
    // Hooke's law
    applySpringForce() {
      this.v.addTo(this.dest.sub(this.pos).multTo(0.019));
      if(this.v.getLength() > 40) {
        this.v.setLength(40);
      }
    }
    
    applyForce(vector) {
      let diff = this.pos.sub(vector);
      let length = diff.getLength();
      let f = 2500 / (length * length);
      // We keep the angle of the distance
      diff.setLength(f);
      this.v.addTo(diff);
    }
  }
  
  class Triangle {
    constructor(a, b, c) {
      this.a = a;
      this.b = b;
      this.c = c;
    }
    
    vertexes() {
      return [this.a, this.b, this.c];
    }
    
    edges() {
      return [
        [this.a, this.b],
        [this.b, this.c],
        [this.c, this.a]
      ];
    }
    
    sharesAVertexWith(triangle) {
      // TODO: optimize me please!
      for(let i = 0; i < 3; i++) {
        for(let j = 0; j < 3; j++) {
          let v = this.vertexes()[i];
          let vv = triangle.vertexes()[j];
          if(v.equals(vv)) {
            return true;
          }
        }
      }
      return false;
    }
  
    hasEdge(edge) {
      for(let i = 0; i < 3; i++) {
        let e = this.edges()[i];
        if(e[0].equals(edge[0]) && e[1].equals(edge[1]) || 
           e[1].equals(edge[0]) && e[0].equals(edge[1])) {
          return true;
        }
      }
      return false;
    }
    
    get circumcenter() {
      if(!this._circumcenter) {
      let d = 2 * (this.a.x * (this.b.y - this.c.y) + 
                   this.b.x * (this.c.y - this.a.y) + 
                   this.c.x * (this.a.y - this.b.y));
      
      let x = 1 / d * ((this.a.x * this.a.x + this.a.y * this.a.y) * (this.b.y - this.c.y) + 
                       (this.b.x * this.b.x + this.b.y * this.b.y) * (this.c.y - this.a.y) + 
                       (this.c.x * this.c.x + this.c.y * this.c.y) * (this.a.y - this.b.y));
      
      let y = 1 / d * ((this.a.x * this.a.x + this.a.y * this.a.y) * (this.c.x - this.b.x) + 
                       (this.b.x * this.b.x + this.b.y * this.b.y) * (this.a.x - this.c.x) + 
                       (this.c.x * this.c.x + this.c.y * this.c.y) * (this.b.x - this.a.x));
        this._circumcenter = new Vector(x, y);
      }
      
      return this._circumcenter;
    }
    
    get centroid() {
      if(!this._centroid) {
        this._centroid = this.a.add(this.b).add(this.c).div(3);
      }
      return this._centroid;
    }
    
    get circumradius() {
      if(!this._circumradius) {
        this._circumradius = this.circumcenter.sub(this.a).getLength(); 
      }
      return this._circumradius;
    }
    
    pointIsInsideCircumcircle(point) {
      let dist = point.sub(this.circumcenter).getLength();
      return dist < this.circumradius;
    }
    
    draw() {
      ctx.beginPath();
      ctx.lineTo(this.a.x, this.a.y);
      ctx.lineTo(this.b.x, this.b.y);
      ctx.lineTo(this.c.x, this.c.y);
      ctx.closePath();
      ctx.stroke();
    }
  }
  
  let canvas;
  let ctx;
  let w, h;
  let mouseX, mouseY;
  let pointList;
  let triangles;
  
  function setup() {
    canvas = document.querySelector("#canvas");
    ctx = canvas.getContext("2d");
    reset();
    window.addEventListener("resize", reset);
    canvas.addEventListener("click", reset);
    canvas.addEventListener("pointermove", mouseMove);
  }
  
  function reset() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    setupPoints();
    mouseX = w / 2;
    mouseY = h / 2;
    ctx.strokeStyle = "white";
    ctx.opacity = 0.5
    
    makeTriangulation();
  }
  
  function makeTriangulation() {
    let superTriangle = new Triangle(
      new Vector(-w * 10, h * 10),
      new Vector(w * 10, h * 10),
      new Vector(w / 2, -h * 10)
    );
    triangles = bowyerWatson(superTriangle, pointList);
  }
  
  function setupPoints() {
    pointList = [
      new Particle(0, 0),
      new Particle(0, h/2),
      new Particle(0, h),
      new Particle(w/2, 0),
      new Particle(w/2, h),
      new Particle(w, 0),
      new Particle(w, h/2),
      new Particle(w, h)
    ];
    
    let dividend = Math.random() * 1000 + 500;
    let nrOfPoints = w * h / dividend;
    for(let i = 0; i < nrOfPoints; i++) {
      pointList.push(new Particle(
        Math.random() * w * 1.2 - w * 0.1,
        Math.random() * h * 1.2 - h * 0.1
      ));
    }
  }
  
  function bowyerWatson (superTriangle, pointList) {
    // pointList is a set of coordinates defining the 
    // points to be triangulated
    let triangulation = [];
  
    // add super-triangle to triangulation 
    // must be large enough to completely contain all 
    // the points in pointList
    triangulation.push(superTriangle);
    
    // add all the points one at a time to the triangulation
    pointList.forEach(point => {
      let badTriangles = [];
      
      // first find all the triangles that are no 
      // longer valid due to the insertion
      triangulation.forEach(triangle => { 
        if(triangle.pointIsInsideCircumcircle(point.pos)) {
          badTriangles.push(triangle); 
        }
      });
      let polygon = [];
      
      // find the boundary of the polygonal hole
      badTriangles.forEach(triangle => {
        triangle.edges().forEach(edge => {
          let edgeIsShared = false;
          badTriangles.forEach(otherTriangle => {
            if(triangle !== otherTriangle &&  otherTriangle.hasEdge(edge)) {
              edgeIsShared = true;
            }
          });
          if(!edgeIsShared) {
            //edge is not shared by any other 
            // triangles in badTriangles
            polygon.push(edge);
          }
        });
      });
      
      // remove them from the data structure
      badTriangles.forEach(triangle => {
        let index = triangulation.indexOf(triangle);
        if (index > -1) {
          triangulation.splice(index, 1);
        }
      });
      
      // re-triangulate the polygonal hole
      polygon.forEach(edge => {
        //form a triangle from edge to point
        let newTri = new Triangle(edge[0], edge[1], point.pos);
        triangulation.push(newTri);
      });
    });
    
    // done inserting points, now clean up
    let i = triangulation.length;
    while(i--) {
      let triangle = triangulation[i];
      if(triangle.sharesAVertexWith(superTriangle)) {
        //remove triangle from triangulation
        let index = triangulation.indexOf(triangle);
        if (index > -1) {
          triangulation.splice(index, 1);
        }
      }  
    }
    
    return triangulation;
  }
  
  function draw() {
    requestAnimationFrame(draw);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, w, h);
    
    let mouseVector = new Vector(mouseX, mouseY);
    pointList.forEach(p => {
      p.applyForce(mouseVector);
      p.move(0.95);
    });
  
    triangles.forEach(t => t.draw());
  }
  
  function mouseMove(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
  }
  
  setup();
  draw();
  
    },[])
  return (
    <div>
      <canvas id="canvas" className='h-[1500px] lg:h-full ' title="Click to generate new pattern"></canvas>
      <style jsx>
        {`
            body, html {
                margin: 0;
              }
              
              canvas {
                display: block;
                touch-action: none;
              }
        `}
      </style>
    </div>
  )
}
