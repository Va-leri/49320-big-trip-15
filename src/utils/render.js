import { RenderPosition } from '../const.js';
import AbstractView from '../view/abstract.js';

export const render = (container, child, position) => {
  if (container instanceof AbstractView) {
    container = container.getElement();
  }

  if (child instanceof AbstractView) {
    child = child.getElement();
  }

  switch (position) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(child);
      break;
    case RenderPosition.BEFOREEND:
      container.append(child);
      break;
  }
};

export const createElement = (temlate) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = temlate;

  return newElement.firstChild;
};

export const replace = (newChild, oldChild) => {
  if (newChild instanceof AbstractView) {
    newChild = newChild.getElement();
  }

  if (oldChild instanceof AbstractView) {
    oldChild = oldChild.getElement();
  }

  const parent = oldChild.parentNode;

  parent.replaceChild(newChild, oldChild);
};
