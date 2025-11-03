/**
 * String prototype polyfills: startsWith and endsWith
 *
 * Why: Provide minimal fallbacks for environments that lack these ES6 methods.
 * Scope: Adds non-standard-compliant but practical implementations only if the
 * methods are not already defined by the runtime.
 *
 * Notes:
 * - This file conditionally extends the String prototype. We scope our changes
 *   behind feature checks to avoid overriding native implementations.
 * - These implementations are intentionally simple and cover the common cases
 *   used by this codebase. They are not meant to be spec-perfect.
 *
 * References:
 * - MDN String.prototype.startsWith
 *   https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith
 * - MDN String.prototype.endsWith
 *   https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith
 */

// eslint-disable-next-line no-extend-native
!String.prototype.startsWith &&
	(String.prototype.startsWith = function (searchString, position) {
		/**
		 * @param {string} searchString - Substring to match from the start.
		 * @param {number} [position=0] - Start index for comparison.
		 * @returns {boolean} True if this string starts at position with searchString.
		 */
		return this.substring(position || 0, searchString.length) === searchString;
	});

// eslint-disable-next-line no-extend-native
!String.prototype.endsWith &&
	(String.prototype.endsWith = function (searchString, length) {
		/**
		 * @param {string} search - Substring to match at the end.
		 * @param {number} [length] - Optional length to treat as the string end.
		 * @returns {boolean} True if this string ends with the given search substring.
		 */
		(length === undefined || length > this.length) && (length = this.length);

		return (
			this.substring(length - searchString.length, length) === searchString
		);
	});
