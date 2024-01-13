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
function render (el, container) {
    const { type, props } = el;
    const dom = type === 'TEXT_ELEMENT' ? document.createTextNode(props.nodeValue): document.createElement(type);

    Object.keys(props).forEach(key => {
        if (key !== 'children') {
            dom[key] = props[key];
        }
    })
    const children = props.children ?? [];
    children.forEach(child => {
        render(child, dom);
    })
    container.appendChild(dom);
}

const React = {
    createElement,
    render,
}

export default React;