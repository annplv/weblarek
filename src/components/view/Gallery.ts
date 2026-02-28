import { Component } from '../base/Component';

interface IGallery {
  items: HTMLElement[];
}

export class Gallery extends Component<IGallery> {
  protected _container: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this._container = container;
  }

  set items(items: HTMLElement[]) {
    this._container.replaceChildren(...items);
  }
}