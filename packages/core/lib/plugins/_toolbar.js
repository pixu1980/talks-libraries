/**
 * Reveal.js toolbar plugin
 * Toolbar plugin defaults.
 *
 * @typedef {Object} ToolbarOptions
 * @property {'top'|'bottom'} [position='top'] - Toolbar position in the viewport
 * @property {boolean|Object} [fullscreen=true] - Enable fullscreen button or pass options
 * @property {boolean|Object} [colorScheme=true] - Enable color scheme switcher button
 * @property {boolean|Object} [overview=true] - Enable overview toggle button
 * @property {boolean|Object} [pause=false] - Enable pause toggle button
 * @property {boolean|Object} [notes=false] - Enable speaker notes button (hidden in notes view)
 * @property {boolean|Object} [help=true] - Enable help overlay toggle
 * @property {boolean|Object} [menu=true] - Enable menu toggle (requires menu plugin)
 * 
 * Copyright (c) 2025 Emiliano "pixu1980" Pisu
 */

/* TODO:
 * - Notes ?
 * - PDF export ?
 * - tooltips
 */

const defaults = {
	position: "top",
	fullscreen: true,
	colorScheme: true,
	overview: true,
	pause: false,
	notes: false,
	help: true,
	menu: true,
};

class Toolbar {
	deck; // reveal instance

	dom = {
		reveal: null,
		toolbar: null,
		buttons: [],
	};

	settings = {};

	/**
	 * Add a generic button to the toolbar.
	 * @param {{class?: string, caption?: string, content?: string, handler?: (e:MouseEvent)=>void}} settings
	 */
	addActionButton(settings) {
		const button = document.createElement("button");
		button.setAttribute("type", "button");
		button.classList.add("reveal-toolbar-button");

		settings.class && button.classList.add(settings.class);
		settings.caption && (button.innerText = settings.caption);
		settings.content && (button.innerHTML = settings.content);
		settings.handler && button.addEventListener("click", settings.handler);

		this.dom.buttons.push(button);
		this.dom.toolbar.appendChild(button);
	}

	/**
	 * Add a named action button with default styling and event dispatch.
	 * @param {string} name - Action name, used for classes and events
	 * @param {string} caption - Text caption for the button
	 * @param {Object|boolean} options - Extra options or boolean to enable/disable
	 * @param {(e:MouseEvent)=>void} handler - Click handler
	 */
	addAction(name, caption, options, handler) {
		const defaults = {
			class: `reveal-toolbar-button-${name}`,
			caption,
			content: undefined,
		};

		const settings = {
			...defaults,
			...(Object.prototype.toString.call(options) === "[object Object]" &&
				options),
			...{
				handler: (e) => {
					handler && handler(e);
					this.deck.dispatchEvent(`toolbar-${name}-action`, this, true);
				},
			},
		};

		this.addActionButton(settings);
	}

	/**
	 * Cycle through color scheme meta values: 'light' -> 'dark' -> 'light dark'.
	 * Updates a toolbar icon class accordingly.
	 */
	toggleColorScheme() {
		let meta = document.querySelector('meta[name="color-scheme"]');

		if (!meta) {
			document.head.insertAdjacentHTML(
				"beforeend",
				'<meta name="color-scheme" content="light dark" />',
			);
			meta = document.querySelector('meta[name="color-scheme"]');
		}

		const values = ["light", "dark", "light dark"];
		const icons = Object.freeze({
			light: "sun",
			dark: "moon",
			"light dark": "computer",
		});
		const current = meta.content.trim();

		// Applica il nuovo valore
		meta.content = values[(values.indexOf(current) + 1) % values.length];

		const icon = this.dom.toolbar.querySelector(
			"button.reveal-toolbar-button-colorScheme icon",
		);
		icon.setAttribute("class", `draft-ui-icon-${icons[meta.content]}`);
	}

	/**
	 * Initialize toolbar DOM, attach to Reveal container and register default buttons.
	 */
	init() {
		this.dom.toolbar = document.createElement("div");
		this.dom.toolbar.classList.add("reveal-toolbar");
		this.dom.toolbar.classList.add(
			this.settings.position == "top"
				? "reveal-toolbar-top"
				: "reveal-toolbar-bottom",
		);

		this.dom.reveal = document.querySelector(".reveal");
		this.dom.reveal.appendChild(this.dom.toolbar);

		this.settings.menu &&
			this.addAction("menu", "M", this.settings.menu, (e) => {
				this.deck.getPlugin("menu")?.toggleMenu();
			});

		this.settings.help &&
			this.addAction("help", "?", this.settings.help, (e) => {
				this.deck.toggleHelp();

				this.dom.reveal.querySelector(".overlay-help header .close").remove();
				this.dom.reveal.querySelector(
					".overlay-help table tr:nth-child(2) td:first-child",
				).innerText = "SPACE";
				this.dom.reveal.querySelector(
					".overlay-help table tr:nth-child(3) td:first-child",
				).innerText = "BACKSPACE";

				this.dom.reveal
					.querySelectorAll(".overlay-help header, .overlay-help .viewport")
					.forEach((item) => {
						item.addEventListener(
							"click",
							(e) => {
								this.deck.toggleHelp();
							},
							{ once: true },
						);
					});
			});

		this.settings.colorScheme &&
			this.addAction("colorScheme", "C", this.settings.colorScheme, (e) => {
				this.toggleColorScheme();
			});

		this.settings.overview &&
			this.addAction("overview", "O", this.settings.overview, (e) => {
				this.deck.toggleOverview();
			});

		this.settings.notes &&
			!this.deck.isSpeakerNotes() &&
			this.addAction("notes", "N", this.settings.notes, (e) => {
				this.deck.getPlugin("notes")?.open();
			});

		this.settings.fullscreen &&
			this.addAction("fullscreen", "F", this.settings.fullscreen, (e) => {
				var fullscreenElement =
					document.fullscreenElement ||
					document.mozFullScreenElement ||
					document.webkitFullscreenElement ||
					document.msFullscreenElement;

				!document.exitFullscreen &&
					(document.exitFullscreen =
						document.mozExitFullscreen ||
						document.webkitExitFullscreen ||
						document.msExitFullscreen);

				fullscreenElement
					? // triggering ESC key
						document.exitFullscreen()
					: // triggering F key
						this.deck.triggerKey(70);
			});

		this.settings.pause &&
			this.addAction("pause", "P", this.settings.pause, (e) => {
				this.deck.togglePause();

				this.deck.addEventListener("paused", function () {
					// var icon = dom.pauseButton.querySelector('i');
					// icon.classList.remove('fa-eye-slash');
					// icon.classList.add('fa-eye');
				});

				this.deck.addEventListener("resumed", function () {
					// var icon = dom.pauseButton.querySelector('i');
					// icon.classList.remove('fa-eye');
					// icon.classList.add('fa-eye-slash');
				});
			});
	}

	/**
	 * Create a Toolbar instance.
	 * @param {import('reveal.js').default} deck - Reveal instance
	 */
	constructor(deck) {
		this.deck = deck;
		this.settings = { ...defaults, ...deck.getConfig()?.toolbar };

		this.init();

		this.deck.dispatchEvent("toolbar-ready", this, true);
	}
}

/**
 * Toolbar plugin factory for Reveal.js.
 * @returns {{ id: string, init: (deck:any)=>void }} Plugin definition
 */
const Plugin = () => {
	return {
		id: "toolbar",
		init: (deck) => {
			new Toolbar(deck);
		},
	};
};

export default Plugin;
