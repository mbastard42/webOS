import { CommonModule } from '@angular/common';
import { Component, HostListener, ViewChild, ElementRef, AfterViewInit, effect } from '@angular/core';

import { WindowService } from '../../core/services/window.service';

type coord = { x: number, y: number};

@Component({
  selector: 'app-window',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './window.component.html',
  styleUrl: './window.component.scss'
})
export class WindowComponent implements AfterViewInit {

  private   _id:number = -1;
  private   _zIndex:number = -1;
  public get zIndex():number { return this._zIndex; }
  private   _fullScreen:boolean = false;
  public get fullScreen():boolean { return this._fullScreen; }
  public set fullScreen(value:boolean) { this._fullScreen = value; }

  private   _grab:number = 5;
  private   _minSize:coord = { x: 530, y: 310 };
  private   _size:coord = { x: 0, y: 0 };
  private   _cursor:coord = { x: 0, y: 0 };
  private   _prevCursor:coord = { x: this._cursor.x, y: this._cursor.y };
  
  private    _containerPos:coord = { x: 0, y: 0 };
  public get containerPos():coord { return this._containerPos; }
  private    _containerSize:coord = { x: this._minSize.x, y: this._minSize.y };
  public get containerSize():coord { return this._containerSize; }

  private   _grabbing:boolean = false;
  public get grabbing():boolean { return this._grabbing; }
  public set grabbing(value:boolean) { this._grabbing = value; }
  private   _postGrabbing:boolean = false;
  private   _resizeTR:boolean = false;
  public set resizeTR(value:boolean) { this._resizeTR = value; }
  private   _resizeR:boolean = false;
  public set resizeR(value:boolean) { this._resizeR = value; }
  private   _postResizeR:boolean = false;
  private   _resizeRB:boolean = false;
  public set resizeRB(value:boolean) { this._resizeRB = value; }
  private   _resizeB:boolean = false;
  public set resizeB(value:boolean) { this._resizeB = value; }
  private   _postResizeB:boolean = false;
  private   _resizeBL:boolean = false;
  public set resizeBL(value:boolean) { this._resizeBL = value; }
  private   _resizeL:boolean = false;
  public set resizeL(value:boolean) { this._resizeL = value; }
  private   _postResizeL:boolean = false;
  private   _resizeTL:boolean = false;
  public set resizeTL(value:boolean) { this._resizeTL = value; }
  private   _resizeT:boolean = false;
  public set resizeT(value:boolean) { this._resizeT = value; }
  private   _postResizeT:boolean = false;

  @ViewChild('container')
  private   _container:ElementRef|undefined;

  constructor(public windowManager:WindowService) {
    this._id = this.windowManager.register();
    this._zIndex = this._id;
    effect(() => { this._zIndex = this.windowManager.zIndex(this._id)(); });
  }

  ngAfterViewInit(): void {
    Promise.resolve().then(() => {
      this._size.x = this._container?.nativeElement.parentElement.parentElement.offsetWidth;
      this._size.y = this._container?.nativeElement.parentElement.parentElement.offsetHeight;
      this._containerPos.x = this._size.x / 2 - this._containerSize.x / 2;
      this._containerPos.y = this._size.y / 2 - this._containerSize.y / 2;
    });
  }

  public putForward():void {
    this.windowManager.putForward(this._id);
  }

  public moveOrGrab():boolean {
    return this._grabbing ||
      this._resizeT ||
      this._resizeTR ||
      this._resizeR ||
      this._resizeRB ||
      this._resizeB ||
      this._resizeBL ||
      this._resizeL ||
      this._resizeTL ||
      this._postGrabbing ||
      this._postResizeT ||
      this._postResizeR ||
      this._postResizeB ||
      this._postResizeL;
  }

  public postChange():boolean {
    return this._postGrabbing ||
      this._postResizeT ||
      this._postResizeR ||
      this._postResizeB ||
      this._postResizeL;
  }

  public reset():void {
    this._containerSize.x = this._minSize.x;
    this._containerSize.y = this._minSize.y;
    this._containerPos.x = this._size.x / 2 - this._containerSize.x / 2;
    this._containerPos.y = this._size.y / 2 - this._containerSize.y / 2;
  }

  @HostListener('document:mouseup', ['$event']) release():void {
    if (this._grabbing)
      this.postMoveContainer();
    if (this._resizeT || this._resizeTR || this._resizeTL)
      this.postResizeContainerT();
    if (this._resizeR || this._resizeRB || this._resizeTR)
      this.postResizeContainerR();
    if (this._resizeB || this._resizeRB || this._resizeBL)
      this.postResizeContainerB();
    if (this._resizeL || this._resizeTL || this._resizeBL)
      this.postResizeContainerL();
    this._grabbing = false;
    this._resizeT = false;
    this._resizeTR = false;
    this._resizeR = false;
    this._resizeRB = false;
    this._resizeB = false;
    this._resizeBL = false;
    this._resizeL = false;
    this._resizeTL = false;
    setTimeout(() => {
      this._postGrabbing = false;
      this._postResizeT = false;
      this._postResizeR = false;
      this._postResizeB = false;
      this._postResizeL = false;
    }, 100);
  }

  @HostListener('window:resize', ['$event']) handleResize(): void {
    this._size.x = this._container?.nativeElement.parentElement.parentElement.offsetWidth;
    this._size.y = this._container?.nativeElement.parentElement.parentElement.offsetHeight;
    this.postMoveContainer();
    this.postResizeContainerT();
    this.postResizeContainerR();
  }

  @HostListener('document:mousemove', ['$event']) handleMove(event:MouseEvent):void {
    this._cursor.x = event.clientX;
    this._cursor.y = event.clientY;
    if (this._grabbing)
      this.moveContainer();
    if (this._resizeT || this._resizeTR || this._resizeTL)
      this.resizeContainerT();
    if (this._resizeR || this._resizeRB || this._resizeTR)
      this.resizeContainerR();
    if (this._resizeB || this._resizeRB || this._resizeBL)
      this.resizeContainerB();
    if (this._resizeL || this._resizeTL || this._resizeBL)
      this.resizeContainerL();
    this._prevCursor.x = this._cursor.x;
    this._prevCursor.y = this._cursor.y;
  }

  private moveContainer():void {
    this._containerPos.x -= this._cursor.x - this._prevCursor.x;
    this._containerPos.y += this._cursor.y - this._prevCursor.y;
    if (this._fullScreen) {
      this._containerPos.x = -this._grab;
      this._containerPos.y = 0;
    }
    this._fullScreen = false;
  }

  private postMoveContainer():void {
    this._postGrabbing = true;
    if (this._containerPos.x < -this._grab)
      this._containerPos.x = -this._grab;
    if (this._containerPos.x + this._containerSize.x - this._grab > this._size.x)
      this._containerPos.x -= this._containerPos.x + this._containerSize.x - this._grab - this._size.x;
    if (this._containerPos.y < 0) 
      this._containerPos.y = 0;
    if (this._containerPos.y + this._containerSize.y - this._grab > this._size.y)
      this._containerPos.y -= this._containerPos.y + this._containerSize.y - this._grab - this._size.y;
  }

  private resizeContainerT():void {
    if (this._containerSize.y >= this._minSize.y || (this._cursor.y < this._prevCursor.y && this._cursor.y < this._containerPos.y)) {
      this._containerSize.y -= this._cursor.y - this._prevCursor.y;
      this._containerPos.y += this._cursor.y - this._prevCursor.y;
    }
  }
  
  private postResizeContainerT():void {
    this._postResizeT = true;
    if (this._containerPos.y < 0) {
      this._containerSize.y += this._containerPos.y;
      this._containerPos.y = 0;
    }
  }

  private resizeContainerR():void {
    if (this._containerSize.x >= this._minSize.x || (this._cursor.x > this._prevCursor.x && this._cursor.x > this._size.x - this._containerPos.x)) {
      this._containerSize.x += this._cursor.x - this._prevCursor.x;  
      this._containerPos.x -= this._cursor.x - this._prevCursor.x;
    }
  }
  
  private postResizeContainerR():void {
    this._postResizeR = true;
    if (this._containerPos.x < -this._grab) {
      this._containerSize.x += this._containerPos.x + this._grab;
      this._containerPos.x = -this._grab;
    }
  }

  private resizeContainerB():void {
    if (this._containerSize.y >= this._minSize.y || (this._cursor.y > this._prevCursor.y && this._cursor.y > this._containerPos.y + this._minSize.y))
      this._containerSize.y += this._cursor.y - this._prevCursor.y;
  }
    
  private postResizeContainerB():void {
    this._postResizeB = true;
    if (this._containerPos.y + this._containerSize.y - this._grab > this._size.y)
      this._containerSize.y -= this._containerPos.y + this._containerSize.y - this._grab - this._size.y;
  }

  private resizeContainerL():void {
    if (this._containerSize.x >= this._minSize.x || (this._cursor.x < this._prevCursor.x && this._cursor.x < this._size.x - this._containerPos.x - this._minSize.x))
      this._containerSize.x -= this._cursor.x - this._prevCursor.x;
  }

  private postResizeContainerL():void {
    this._postResizeL = true;
    if (this._containerPos.x + this._containerSize.x - this._grab > this._size.x)
      this._containerSize.x -= this._containerPos.x + this._containerSize.x - this._grab - this._size.x;
  }
}
