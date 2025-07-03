document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('body').forEach(function(body) {
        body.setAttribute('ontouchstart', '');
    });
});

import {initMizuSelect} from './select.js';

initMizuSelect();