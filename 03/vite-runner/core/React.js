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
            children: children.map(child => typeof child === 'string' ? createTextNode(child) : child),
        },
    }
}
let nextUnitOfFiber = null;
function render (el, container) {
    nextUnitOfFiber = {
        dom: container,
        props: {
            children: [el],
      }
    };
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
    fiber.parent.dom.append(dom);
}
function initChildren(fiber) {
    const children = fiber.props.children;
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
function performUnitOfWork(fiber) {
    // create dom
   if (!fiber.dom) {
       const dom = (
         fiber.dom = createDom(fiber)
       );
       updateProps(fiber, dom);
   }
    // init children
    initChildren(fiber);

   // next fiber
   if (fiber.child) {
       return fiber.child;
   }
   if ( fiber.sibling) {
       return  fiber.sibling;
   }
   return fiber.parent?.sibling;
}

function  workLoop(deadline) {
    let shouldYield = false;
    while (!shouldYield && nextUnitOfFiber) {
        console.log(deadline.timeRemaining());
      nextUnitOfFiber = performUnitOfWork(nextUnitOfFiber);
        shouldYield = deadline.timeRemaining() < 1;
    }
    // requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

const React = {
    createElement,
    render,
}

export default React;