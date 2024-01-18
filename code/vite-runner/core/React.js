import { isFunction } from '../helper'
function  createTextNode(text) {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
      children: [],
    }
  }
}

function createElement(type, props, ...children) {
    return {
        type,
        props: {
            ...props,
            children: children.map(child => {
                const isTextNode = typeof child === 'string' || typeof child === 'number';
                return isTextNode ? createTextNode(child) : child;
            }).filter(Boolean),
        },
    }
 }
let nextUnitOfFiber = null;
let wipRoot = null;
let wipFiber = null;
let currentRootNode = null;
let shouldDeleteNodes = [];
function render (el, container) {
    wipRoot = {
        dom: container,
        props: {
            children: [el],
      },
    };

    nextUnitOfFiber = wipRoot;
}

function  update () {
  const currentFiber = wipFiber;
  return () => {
    console.log(currentFiber);
    wipRoot = {
      ...currentFiber,
      alternate: currentFiber,
    };

    nextUnitOfFiber = wipRoot;
  }
}

function createDom (fiber) {
return fiber.type === 'TEXT_ELEMENT' ? document.createTextNode(''): document.createElement(fiber.type)

}

function updateProps (prevProps, nextProps, dom) {
  // remove old props
  Object.keys(prevProps).forEach(key => {
    if (key !== 'children') {
      if (!(key in nextProps)) {
        dom.removeAttribute(key);
      }
    }
  })
    // update props
    Object.keys(nextProps).forEach(key => {
        if (key !== 'children') {
          if (prevProps[key] !== nextProps[key]) {
            if (key.startsWith('on')) {
              const eventName = key.substring(2).toLocaleLowerCase();
              dom.removeEventListener(eventName, prevProps[key]);
              dom.addEventListener(eventName, nextProps[key]);
            } else {
              dom[key] = nextProps[key];
            }
          }
        }
    })
}
function reconcileChildren(fiber, children) {
    let prevChild = null;
    let oldFiber = fiber.alternate && fiber.alternate.child;
    children.forEach((child, index) => {
        const sameType = oldFiber && child.type === oldFiber.type;
        let newFiber = null;
        if (sameType) {
           newFiber = {
                type: child.type,
                props: child.props,
                parent: fiber,
                child: null,
                sibling: null,
                dom: oldFiber.dom,
                alternate: oldFiber,
               effectTag: 'UPDATE',
            }
        } else {
          newFiber = {
            type: child.type,
            props: child.props,
            parent: fiber,
            child: null,
            sibling: null,
            dom: null,
            effectTag: 'PLACEMENT',
          }
          oldFiber && shouldDeleteNodes.push(oldFiber);
        }

        if (oldFiber) {
            oldFiber = oldFiber.sibling;
        }
        if (index === 0 ) {
            fiber.child = newFiber;
        } else  {
            prevChild.sibling = newFiber;
        }
        prevChild = newFiber;
    });

  while (oldFiber) {
    shouldDeleteNodes.push(oldFiber);
    oldFiber = oldFiber.sibling;
  }
}

function updateFunctionComponent(fiber) {
  wipFiber = fiber;
    const children = [fiber.type(fiber.props)];
    reconcileChildren(fiber, children);
}

function updateBasicComponent(fiber) {
    if (!fiber.dom) {
        const dom = (
            fiber.dom = createDom(fiber)
        );
        updateProps({}, fiber.props, dom);
    }
    const children = fiber.props.children;
    reconcileChildren(fiber, children);
}

function performUnitOfWork(fiber) {
    const isFunctionComponent = isFunction(fiber.type);

    if (isFunctionComponent) {
        updateFunctionComponent(fiber);
    } else {
        updateBasicComponent(fiber);
    }

   // next fiber
   if (fiber.child) {
       return fiber.child;
   }
  let nextFiber = fiber;
   while (nextFiber) {
       if (nextFiber.sibling) {
           return nextFiber.sibling;
       }
       nextFiber = nextFiber.parent;
   }
}

function commitRoot() {
  shouldDeleteNodes.forEach(commitDeletions);
  commitWork(wipRoot.child);
    currentRootNode = wipRoot;
    wipRoot = null;
    shouldDeleteNodes = [];
}

function commitDeletions(fiber) {
  if (fiber.dom) {
    let fiberParent = fiber.parent;
    while (!fiberParent.dom) {
      fiberParent = fiberParent.parent;
    }
    fiberParent.dom.removeChild(fiber.dom);
  } else {
    commitDeletions(fiber.child);
  }
}
function commitWork(fiber) {
    if (!fiber) return;
    let fiberParent = fiber.parent;
    while (!fiberParent.dom) {
        fiberParent = fiberParent.parent;
    }

    if (fiber.effectTag === 'PLACEMENT') {
      if ( fiber.dom) {
        fiberParent.dom.append(fiber.dom);
      }
    } else if (fiber.effectTag === 'UPDATE') {
      updateProps(fiber.alternate.props, fiber.props, fiber.dom);
    }

    commitWork(fiber.child);
   commitWork(fiber.sibling);
}

function  workLoop(deadline) {
    let shouldYield = false;
    while (!shouldYield && nextUnitOfFiber) {
      nextUnitOfFiber = performUnitOfWork(nextUnitOfFiber);
      if (wipRoot?.sibling?.type === nextUnitOfFiber?.type) {
        nextUnitOfFiber = null;
        // console.log(wipRoot, nextUnitOfFiber);
      }
        shouldYield = deadline.timeRemaining() < 1;
    }
    if (!nextUnitOfFiber && wipRoot) {
        commitRoot();
    }
    requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

const React = {
  update,
  createElement,
  render,
}

export default React;