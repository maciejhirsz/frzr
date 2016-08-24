
import { bench } from './bench.js';
import { el as frzr_el, mount as frzr_mount } from '../../src/index.js';
import { el as doom_el, mount as doom_mount } from '../../doom/index.js';

var frzr_b = frzr_el.extend('b');
var frzr_div = frzr_el.extend('div');
var frzr_h1 = frzr_el.extend('h1');
var frzr_p = frzr_el.extend('p');

var doom_b = doom_el.extend('b');
var doom_div = doom_el.extend('div');
var doom_h1 = doom_el.extend('h1');
var doom_p = doom_el.extend('p');

bench('DOOM create an empty <div> tag', function() {
    doom_el('div');
});

bench('FRZR create an empty <div> tag', function() {
    frzr_el('div');
});

bench('DOOM create an <h1> tag with class="doom" and content', function() {
    doom_h1({ 'class': 'doom' }, "Hello DOOM!");
});

bench('FRZR create an <h1> tag with class="frzr" and content', function() {
    frzr_h1({ 'class': 'frzr' }, "Hello FRZR!");
});

bench('DOOM create an empty <div> tag via extend', function() {
    doom_div();
});

bench('FRZR create an empty <div> tag via extend', function() {
    frzr_div();
});

bench('DOOM create a <b> tag with text', function() {
    doom_el('b', 'Foo bar!');
});

bench('FRZR create a <b> tag with text', function() {
    frzr_el('b', 'Foo bar!');
});

bench('DOOM create a <b> tag with text via extend', function() {
    doom_b('Foo bar!');
});

bench('FRZR create a <b> tag with text via extend', function() {
    frzr_b('Foo bar!');
});

// bench('DOOM <div> with multiple child nodes', function() {
//     doom_div(
//         doom_h1({ 'class': 'doom' }, 'Hello ', doom_b('DOOM'), '!'),
//         doom_p('Bacon ipsum dolor amet meatloaf meatball shank porchetta \
//             picanha bresaola short loin short ribs capicola fatback beef \
//             ribs corned beef ham hock.')
//     );
// });

// bench('FRZR <div> with multiple child nodes', function() {
//     frzr_div(
//         frzr_h1({ 'class': 'frzr' }, 'Hello ', frzr_b('FRZR'), '!'),
//         frzr_p('Bacon ipsum dolor amet meatloaf meatball shank porchetta \
//             picanha bresaola short loin short ribs capicola fatback beef \
//             ribs corned beef ham hock.')
//     );
// });

console.log('DOOM', doom_div(
    doom_h1({ 'class': 'doom' }, 'Hello ', doom_b('DOOM'), '!'),
    doom_p('Bacon ipsum dolor amet meatloaf meatball shank porchetta \
        picanha bresaola short loin short ribs capicola fatback beef \
        ribs corned beef ham hock.')
));

console.log('FRZR', frzr_div(
    frzr_h1({ 'class': 'frzr' }, 'Hello ', frzr_b('FRZR'), '!'),
    frzr_p('Bacon ipsum dolor amet meatloaf meatball shank porchetta \
        picanha bresaola short loin short ribs capicola fatback beef \
        ribs corned beef ham hock.')
));
