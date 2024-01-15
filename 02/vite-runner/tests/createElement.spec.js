import { describe, expect, it } from 'vitest'
import React from '../core/React.js';
describe ('createElement', () => {
    it('should create an element', () => {
        const el = React.createElement('div',null, 'hello world');
        expect(el).toEqual({
            type: 'div',
            props: {
                children: [
                    {
                        type: 'TEXT_ELEMENT',
                        props: {
                            nodeValue: 'hello world',
                            children: [],
                        }
                    }
                ]
            }
        });
    });
});