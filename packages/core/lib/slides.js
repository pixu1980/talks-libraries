import "./polyfills/index.js";

import Reveal from "reveal.js";
import Highlight from "reveal.js/plugin/highlight/highlight.js";
import Markdown from "reveal.js/plugin/markdown/markdown.js";
import Zoom from "reveal.js/plugin/zoom/zoom.js";
import Notes from "reveal.js/plugin/notes/notes.js";
// import { Header, Menu , Toolbar } from './plugins';
import { Toolbar } from "./plugins";
import "./components";
import "./utils";

addEventListener("DOMContentLoaded", () => {
	let deck = new Reveal(document.querySelector(".reveal"), {
		...(window.location.href.includes("?print-pdf") && {
			pdfSeparateFragments: false,
		}),
		hash: true,
		// plugins: [Markdown, Highlight, Zoom, Notes, Menu, Toolbar, Header],
		// plugins: [Markdown, Highlight, Zoom, Notes, Toolbar, Menu],
		plugins: [Markdown, Highlight, Zoom, Notes, Toolbar],
		navigationMode: "linear",
		menu: {
			// Specifies which side of the presentation the menu will
			// be shown. Use 'left' or 'right'.
			side: "left",

			// Specifies the width of the menu.
			// Can be one of the following:
			// 'normal', 'wide', 'third', 'half', 'full', or
			// any valid css length value
			width: "normal",

			// Add slide numbers to the titles in the slide list.
			// Use 'true' or format string (same as reveal.js slide numbers)
			numbers: true,

			// Specifies which slide elements will be used for generating
			// the slide titles in the menu. The default selects the first
			// heading element found in the slide, but you can specify any
			// valid css selector and the text from the first matching
			// element will be used.
			// Note: that a section data-menu-title attribute or an element
			// with a menu-title class will take precedence over this option
			titleSelector: "h1, h2, h3, h4, h5, h6",

			// If slides do not have a matching title, attempt to use the
			// start of the text content as the title instead
			useTextContentForMissingTitles: false,

			// Hide slides from the menu that do not have a title.
			// Set to 'true' to only list slides with titles.
			hideMissingTitles: true,

			// Adds markers to the slide titles to indicate the
			// progress through the presentation. Set to 'false'
			// to hide the markers.
			markers: true,

			// Specify custom panels to be included in the menu, by
			// providing an array of objects with 'title', 'icon'
			// properties, and either a 'src' or 'content' property.
			custom: false,

			// // Specifies the themes that will be available in the themes
			// // menu panel. Set to 'true' to show the themes menu panel
			// // with the default themes list. Alternatively, provide an
			// // array to specify the themes to make available in the
			// // themes menu panel, for example...
			// //
			// // [
			// //     { name: 'Black', theme: 'dist/theme/black.css' },
			// //     { name: 'White', theme: 'dist/theme/white.css' },
			// //     { name: 'League', theme: 'dist/theme/league.css' },
			// //     {
			// //       name: 'Dark',
			// //       theme: 'lib/reveal.js/dist/theme/black.css',
			// //       highlightTheme: 'lib/reveal.js/plugin/highlight/monokai.css'
			// //     },
			// //     {
			// //       name: 'Code: Zenburn',
			// //       highlightTheme: 'lib/reveal.js/plugin/highlight/zenburn.css'
			// //     }
			// // ]
			// //
			// // Note: specifying highlightTheme without a theme will
			// // change the code highlight theme while leaving the
			// // presentation theme unchanged.
			// themes: false,

			// // Specifies the path to the default theme files. If your
			// // presentation uses a different path to the standard reveal
			// // layout then you need to provide this option, but only
			// // when 'themes' is set to 'true'. If you provide your own
			// // list of themes or 'themes' is set to 'false' the
			// // 'themesPath' option is ignored.
			// themesPath: 'dist/theme/',

			// Specifies if the transitions menu panel will be shown.
			// Set to 'true' to show the transitions menu panel with
			// the default transitions list. Alternatively, provide an
			// array to specify the transitions to make available in
			// the transitions panel, for example...
			// ['None', 'Fade', 'Slide']
			transitions: false,

			// Adds a menu button to the slides to open the menu panel.
			// Set to 'false' to hide the button.
			openButton: false,

			// If 'true' allows the slide number in the presentation to
			// open the menu panel. The reveal.js slideNumber option must
			// be displayed for this to take effect
			openSlideNumber: false,

			// If true allows the user to open and navigate the menu using
			// the keyboard. Standard keyboard interaction with reveal
			// will be disabled while the menu is open.
			keyboard: true,

			// Normally the menu will close on user actions such as
			// selecting a menu item, or clicking the presentation area.
			// If 'true', the sticky option will leave the menu open
			// until it is explicitly closed, that is, using the close
			// button or pressing the ESC or m key (when the keyboard
			// interaction option is enabled).
			sticky: false,

			// If 'true' standard menu items will be automatically opened
			// when navigating using the keyboard. Note: this only takes
			// effect when both the 'keyboard' and 'sticky' options are enabled.
			autoOpen: true,

			// If 'true' the menu will not be created until it is explicitly
			// requested by calling RevealMenu.init(). Note this will delay
			// the creation of all menu panels, including custom panels, and
			// the menu button.
			delayInit: false,

			// If 'true' the menu will be shown when the menu is initialised.
			openOnInit: false,
		},
		toolbar: {
			// Specifies where the toolbar will be shown: 'top' or 'bottom'
			position: "top",

			// // If true, the reveal.js-menu will be moved into the toolbar.
			// // Set to false to leave the menu on its own.
			// menu: {
			//   content: '<icon class="draft-ui-icon-hamburger"></icon>',
			// },
			menu: false,

			// Add button to show the help overlay
			help: {
				content: '<icon class="draft-ui-icon-circle-info"></icon>',
			},

			// Add button to toggle the overview mode on and off
			colorScheme: {
				content: '<icon class="draft-ui-icon-computer"></icon>',
			},

			// Add button to toggle the overview mode on and off
			overview: {
				content: '<icon class="draft-ui-icon-apps"></icon>',
			},

			// Add button to toggle fullscreen mode for the presentation
			fullscreen: {
				content: '<icon class="draft-ui-icon-zoom-in"></icon>',
			},

			// Add button to pause (hide) the presentation display
			pause: false,

			// Add button to show the speaker notes
			notes: false,
		},
	});

	// keyboard nav configuration
	deck.configure({
		keyboard: {
			8: "prev",
			// 27: null,
			78: null,
		},
	});

	deck.initialize();

	// Make the Reveal object globally available on the /demo page
	window.Reveal = deck;
});
