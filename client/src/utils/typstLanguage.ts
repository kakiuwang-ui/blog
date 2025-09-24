// Custom Typst language definition for PrismJS
export const typstLanguage = {
  'comment': /\/\/.*|\/\*[\s\S]*?\*\//,
  'string': {
    pattern: /"(?:[^"\\]|\\.)*"/,
    greedy: true
  },
  'heading': {
    pattern: /^=+\s+.*/m,
    inside: {
      'punctuation': /^=+/,
      'important': /\s+.*/
    }
  },
  'function': {
    pattern: /#[a-zA-Z_][a-zA-Z0-9_]*(?:\.[a-zA-Z_][a-zA-Z0-9_]*)*/,
    alias: 'function'
  },
  'import': {
    pattern: /#import\s+.*/,
    inside: {
      'keyword': /#import/,
      'string': /"[^"]*"/
    }
  },
  'set-show': {
    pattern: /#(?:set|show)\s+[^{]*\s*{[^}]*}/,
    inside: {
      'keyword': /#(?:set|show)/,
      'property': /[a-zA-Z_][a-zA-Z0-9_]*(?=\s*:)/,
      'punctuation': /[{}:]/
    }
  },
  'math': {
    pattern: /\$[^$]*\$/,
    alias: 'number'
  },
  'code-block': {
    pattern: /```[\s\S]*?```/,
    inside: {
      'punctuation': /```/,
      'code': /[\s\S]*/
    }
  },
  'markup': {
    pattern: /\*[^*]+\*|_[^_]+_|`[^`]+`/,
    inside: {
      'bold': /\*[^*]+\*/,
      'italic': /_[^_]+_/,
      'code': /`[^`]+`/
    }
  },
  'link': {
    pattern: /#link\([^)]*\)/,
    inside: {
      'function': /#link/,
      'url': /"[^"]*"/
    }
  },
  'figure': {
    pattern: /#figure\([^)]*\)/,
    inside: {
      'function': /#figure/,
      'property': /[a-zA-Z_][a-zA-Z0-9_]*(?=\s*:)/
    }
  },
  'variable': /[a-zA-Z_][a-zA-Z0-9_]*/,
  'number': /\b\d+(?:\.\d+)?(?:pt|px|em|%|cm|mm|in)?\b/,
  'punctuation': /[{}[\]().,;:]/,
  'operator': /[+\-*\/=<>!&|]/
}

// Define Typst language aliases
export const typstAliases = ['typ', 'typst']