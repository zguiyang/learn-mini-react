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
            }),
        },
    }
}
let nextUnitOfFiber = null;
let rootNode = null;
function render (el, container) {
    nextUnitOfFiber = {
        dom: container,
        props: {
            children: [el],
      }
    };

    rootNode = nextUnitOfFiber;
}

function createDom (fiber) {
return fiber.type === 'TEXT_ELEMENT' ? document.createTextNode(''): document.createElement(fiber.type)

}

function updateProps (fiber, dom) {
    // update props
    Object.keys(fiber.props).forEach(key => {
        if (key !== 'children') {
            dom[key] = fiber.props[key];
        }
    })
}
function initChildren(fiber, children) {
    let prevChild = null;
    children.forEach((child, index) => {
        const newFiber = {
            type: child.type,
            props: child.props,
            parent: fiber,
            child: null,
            sibling: null,
            dom: null,
        }
        if (index === 0 ) {
            fiber.child = newFiber;
        } else  {
            prevChild.sibling = newFiber;
        }
        prevChild = newFiber;
    });
}

function updateFunctionComponent(fiber) {
    const children = [fiber.type(fiber.props)];
    initChildren(fiber, children);
}

function updateBasicComponent(fiber) {
    if (!fiber.dom) {
        const dom = (
            fiber.dom = createDom(fiber)
        );
        updateProps(fiber, dom);
    }
    const children = fiber.props.children;
    initChildren(fiber, children);
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
    commitWork(rootNode.child);
    rootNode = null;
}

function commitWork(fiber) {
    if (!fiber) return;
    let fiberParent = fiber.parent;
    while (!fiberParent.dom) {
        fiberParent = fiberParent.parent;
    }
    if ( fiber.dom) {
        fiberParent.dom.append(fiber.dom);
    }
    commitWork(fiber.child);
   commitWork(fiber.sibling);
}

function  workLoop(deadline) {
    let shouldYield = false;
    while (!shouldYield && nextUnitOfFiber) {
        console.log(deadline.timeRemaining());
      nextUnitOfFiber = performUnitOfWork(nextUnitOfFiber);
        shouldYield = deadline.timeRemaining() < 1;
    }
    if (!nextUnitOfFiber && rootNode) {
        commitRoot();
    }
    // requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

const React = {
    createElement,
    render,
}

export default React;