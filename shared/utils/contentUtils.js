/**
 * Utility functions for content type detection and processing
 */
/**
 * Detect if content is Typst format by looking for Typst-specific syntax
 * @param content The content string to check
 * @returns true if content appears to be Typst format
 */
export function isTypstContent(content) {
    if (!content)
        return false;
    // Look for Typst-specific syntax patterns
    return content.includes('#import') ||
        content.includes('#set ') ||
        content.includes('#show ') ||
        (content.startsWith('#') && content.includes('= '));
}
/**
 * Detect if content is Markdown format
 * @param content The content string to check
 * @returns true if content appears to be Markdown format
 */
export function isMarkdownContent(content) {
    if (!content)
        return false;
    // If it's Typst, it's not Markdown
    if (isTypstContent(content))
        return false;
    // Look for common Markdown patterns
    return content.includes('##') ||
        content.includes('**') ||
        content.includes('```') ||
        content.includes('[') ||
        content.includes('*') ||
        content.startsWith('#') ||
        true; // Default to Markdown if not Typst
}
