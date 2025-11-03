/**
 * DiveIn stacked container component
 *
 * Enhances a `<dive-in>` element that contains a `<stack-container>` with
 * several `<stack-item>` children.
 *
 * Behavior:
 * - Assigns a sequential CSS custom property `--index` to each `stack-item`
 *   (reversed order), which can be used from CSS to create depth and staggered
 *   visual effects.
 * - Listens for mouse movements and computes an offset from the viewport center.
 *   The computed values are written to `--mouse-x` and `--mouse-y` on the
 *   `stack-container`, enabling CSS driven parallax/tilt effects.
 *
 * Performance notes:
 * - The `mousemove` handler writes CSS variables on every event. For complex
 *   scenes consider throttling with requestAnimationFrame.
 */
// DiveIn stacked container component
addEventListener("DOMContentLoaded", () => {
	const diveIn = document.querySelector("dive-in");
	const stackContainer = diveIn && diveIn.querySelector("stack-container");

	if (stackContainer) {
		const stackItems = [
			...stackContainer.querySelectorAll("stack-item"),
		].reverse();

		for (let i = 0; i < stackItems.length; i++) {
			// Expose a stable index to CSS for transforms/filters/z layering
			stackItems[i].style.setProperty("--index", i);
		}

		document.addEventListener("mousemove", (e) => {
			// Viewport dimensions
			let vw = window.innerWidth;
			let vh = window.innerHeight;

			// Viewport center
			let vc = {
				x: vw / 2,
				y: vh / 2,
			};

			// Cursor coordinates
			let x = e.clientX;
			let y = e.clientY;

			// Signed offset from center: left/up are negative, right/down positive
			let transformOffset = {
				x: `${-(x <= vc.x ? -(vc.x - x) : x - vc.x)}px`,
				y: `${-(y <= vc.y ? -(vc.y - y) : y - vc.y)}px`,
			};

			// Feed CSS variables for parallax-like effects
			stackContainer.style.setProperty("--mouse-x", transformOffset.x);
			stackContainer.style.setProperty("--mouse-y", transformOffset.y);
		});
	}
});
