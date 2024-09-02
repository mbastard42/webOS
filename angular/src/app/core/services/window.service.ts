import { Injectable, Signal, signal } from '@angular/core';
import { WindowModel } from '../models/window';

@Injectable({
  providedIn: 'root'
})
export class WindowService {

  private _total:number = 0;
  private _registery:Map<number, WindowModel> = new Map<number, WindowModel>;

  constructor() {}

  public register():number {
    this._total++;
    this._registery.set(this._total, new WindowModel(this._total));
    return this._total;
  }

  public zIndex(id:number):Signal<number> {
    const index:Signal<number>|undefined = this._registery.get(id)?.zIndex
    return index ? index : signal(0);
  }

  public putForward(id:number):void {
    const baseZindex:number|undefined = this._registery.get(id)?.zIndex();
    if (baseZindex != this._total - 1) {
      this._registery.forEach(window => {
        if (!window.hidden && baseZindex !== undefined && window.zIndex() >= baseZindex)
          window.zIndex.update(value => value - 1);
      });
      this._registery.get(id)?.setIndex(0);
    }
  }
}
