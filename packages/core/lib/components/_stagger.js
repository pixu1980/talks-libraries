/**
 * Stagger animation components
 *
 * Enhances `<stagger>` containers by assigning a per-child CSS variable
 * `--stagger--index` to allow staggered effects in CSS.
 *
 * Usage:
 * ```html
 * <stagger>
 *   <div>Item A</div>
 *   <div>Item B</div>
 *   <div>Item C</div>
 * </stagger>
 * ```
 * Then in CSS you can refer to `--stagger--index` to offset animations/timings.
 *
 * Notes:
 * - This script runs after DOMContentLoaded and does not observe dynamic DOM
 *   changes. If children are added later, you will need to re-run the logic.
 * - Known issue: the original implementation contained two bugs (left intact
 *   to avoid behavioral changes). See TODOs below.
 */
// Stagger animation components
addEventListener("DOMContentLoaded", () => {
	const staggers = [...document.querySelectorAll("stagger")];

	for (const stagger of staggers) {
		const staggerItems = [...stagger.querySelectorAll(":scope > *")];

		// Assign a per-child index for staggering via CSS
		staggerItems.forEach((el, i) => {
			el.style.setProperty("--stagger--index", i);
		});
	}
});
