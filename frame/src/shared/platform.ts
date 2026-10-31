/**
 * Host traits the chrome must branch on. Kept in one place so a component
 * never re-derives the platform from the user agent.
 *
 * macOS keeps AppKit's traffic lights through an overlay title bar; Windows
 * reveals native controls over the page at the top edge. Linux uses sidebar
 * controls.
 */
const userAgent = navigator.userAgent;
export const IS_MAC = userAgent.includes("Mac");
export const IS_WINDOWS = userAgent.includes("Windows");
/** Linux currently ships Browse only; Work has no native adapter yet. */
export const IS_LINUX = !IS_MAC && !IS_WINDOWS;
