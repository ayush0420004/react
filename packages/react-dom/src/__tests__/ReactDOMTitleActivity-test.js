/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @emails react-core
 */

'use strict';

let React;
let ReactDOMClient;
let Activity;
let Scheduler;
let act;
let container;

describe('ReactDOMTitleActivity', () => {
    beforeEach(() => {
        jest.resetModules();
        React = require('react');
        ReactDOMClient = require('react-dom/client');
        Activity = React.Activity;
        Scheduler = require('scheduler');
        act = require('internal-test-utils').act;
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    afterEach(() => {
        document.body.removeChild(container);
    });

    // @gate enableActivity
    it('reverts document.title when a title is hidden', async () => {
        const root = ReactDOMClient.createRoot(container);

        // Initial render with a visible title
        await act(() => {
            root.render(
                <Activity mode="visible">
                    <title>Visible Title</title>
                </Activity>
            );
        });
        expect(document.title).toBe('Visible Title');

        // Hide the activity
        await act(() => {
            root.render(
                <Activity mode="hidden">
                    <title>Visible Title</title>
                </Activity>
            );
        });

        // If we have just ONE title and we hide it, we expect document.title to be empty/cleared
        expect(document.title).toBe('');

        // Now reveal it
        await act(() => {
            root.render(
                <Activity mode="visible">
                    <title>Visible Title</title>
                </Activity>
            );
        });
        expect(document.title).toBe('Visible Title');
    });

    // @gate enableActivity
    it('correctly falls back to another visible title when hiding a title', async () => {
        const root = ReactDOMClient.createRoot(container);

        // Initial render with two titles
        await act(() => {
            root.render(
                <>
                    <title>Main Title</title>
                    <Activity mode="visible">
                        <title>Nested Title</title>
                    </Activity>
                </>
            );
        });
        // Last one wins
        expect(document.title).toBe('Nested Title');

        // Hide the nested title
        await act(() => {
            root.render(
                <>
                    <title>Main Title</title>
                    <Activity mode="hidden">
                        <title>Nested Title</title>
                    </Activity>
                </>
            );
        });

        // Should revert to Main Title because we fallback to visible title
        expect(document.title).toBe('Main Title');
    });
});
