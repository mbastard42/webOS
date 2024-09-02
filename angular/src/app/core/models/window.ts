import { signal } from "@angular/core";

export class WindowModel {

  private   _name:string = 'undefined';
  private   _zIndex;
  private   _hidden:boolean = false;
  private   _fullScreen:boolean = false;

  public get id():number { return this._id; }
  public get name():string { return this._name; }
  public get zIndex() { return this._zIndex; }
  public get hidden():boolean { return this._hidden; }
  public get fullScreen():boolean { return this._fullScreen; }

  constructor(private _id:number) { 
    this._zIndex = signal(0);
  }

  public setIndex(index:number):void { this._zIndex.set(index); }
}
