import { App, Plugin } from 'obsidian';
import * as Prism from 'prismjs';
import 'prismjs/components/prism-javascript';

export default class PseudoHighlightPlugin extends Plugin {
  async onload() {
    console.log('Loading PseudoHighlightPlugin...');

    // Define the pseudocode language with a distinct token for method headers
    Prism.languages.pseudo = {
      comment: /\/\/.*|\/\*[\s\S]*?\*\//,
      keyword: /\b(IF|ELSE|WHILE|FOR|FUNCTION|RETURN|PRINT|READ)\b/i,
      boolean: /\b(TRUE|FALSE|AND|OR)\b/i,
      string: /"(?:\\.|[^"])*"|\'(?:\\.|[^'])*'/,
      number: /\b\d+\b/,
      operator: /[-+*\/%=<>!]+/,
      // Define a separate token specifically for method headers
      methodHeader: {
        pattern: /\b\w+\s*(?=\s*\()/, // Matches only method names followed by (
        alias: 'methodHeader'
      },
      variable: /\b\w+\b/, // variables
      punctuation: /[{}[\];(),.:]/
    };

    // Register the markdown code block processor for pseudocode
    this.registerMarkdownCodeBlockProcessor('pseudo', (source, el, ctx) => {
      const pre = document.createElement('pre');
      const code = document.createElement('code');
      code.className = 'language-pseudo';
      code.textContent = source;

      // Highlight the code using Prism
      Prism.highlightElement(code);

      // Apply inline styles to distinguish method headers without external CSS
      code.innerHTML = code.innerHTML.replace(/<span class="token methodHeader">([^<]+)<\/span>/g, (match, methodName) => {
        return `<span style="color: #1e90ff; font-weight: bold;">${methodName}</span>`; // Apply distinct color and style
      });

      pre.appendChild(code);
      el.appendChild(pre);
    });
  }

  onunload() {
    console.log('Unloading PseudoHighlightPlugin...');
  }
}
