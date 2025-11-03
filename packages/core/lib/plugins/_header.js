/**
 * Reveal.js Header plugin
 *
 * Keeps a slide-specific <header> element visually pinned and cross-faded
 * between slide transitions.
 *
 * How it works:
 * - On slidechanged: positions previous slide's header off-canvas and hides it,
 *   while the new slide's header is positioned fixed and faded in.
 * - On slidetransitionend: ensures the current slide's header is fully opaque.
 *
 * Notes:
 * - The plugin manipulates inline styles to ensure predictable behavior across
 *   different themes.
 * - This does not create or inject header elements, it only enhances those
 *   already present in slides.

 * Handles opening of and synchronization with the reveal.js
 * notes window.
 *
 * Handshake process:
 * 1. This window posts 'connect' to notes window
 *    - Includes URL of presentation to show
 * 2. Notes window responds with 'connected' when it is available
 * 3. This window proceeds to send the current presentation state
 *    to the notes window
 *
 * Copyright (c) 2025 Emiliano "pixu1980" Pisu

* @returns {{ id: string, init: function, update: function }} A Reveal plugin definition.
 */
const HeaderPlugin = () => {
	let deck;

	const headerPlugin = {
		id: "header",
		/**
		 * Initialize the plugin with the Reveal deck instance.
		 * @param {import('reveal.js').default} reveal - Reveal instance
		 */
		init: (reveal) => {
			deck = reveal;

			deck.addEventListener("slidechanged", (e) => {
				// Move previous header out of view and reset inline bounds
				if (e.previousSlide) {
					const prevHeaderElement = e.previousSlide.querySelector("header");

					if (!!prevHeaderElement) {
						prevHeaderElement.style.position = "fixed";
						prevHeaderElement.style.top = 0;
						prevHeaderElement.style.left = 0;
						prevHeaderElement.style.right = 0;
						prevHeaderElement.style.opacity = 0;
						prevHeaderElement.style.width = "100vw";
					}
				}

				if (e.currentSlide) {
					const headerElement = e.currentSlide.querySelector("header");

					if (!!headerElement) {
						// Pin the current header and cross-fade it into view
						headerElement.style.position = "fixed !important";
						headerElement.style.top = "0 !important";
						headerElement.style.left = "0 !important";
						headerElement.style.right = "0 !important";
						headerElement.style.width = "100vw !important";
						headerElement.style.opacity = !e.previousSlide;
						headerElement.style.transition = "opacity .2s ease-in-out";
					}
				}
			});

			deck.addEventListener("slidetransitionend", (e) => {
				const headerElement = e.currentSlide.querySelector("header");

				if (!!headerElement) {
					// Ensure final state is fully visible
					headerElement.style.opacity = 1;
				}
			});
		},
		/**
		 * Optional external update hook.
		 * @param {any} e - Event or payload
		 */
		update: (e) => {},
	};

	return headerPlugin;
};

export default HeaderPlugin;
