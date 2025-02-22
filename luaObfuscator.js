// This file defines a LuaObfuscator class which converts Lua code into an obfuscated format.
// The obfuscation works by encoding each character into a two-character string (using a custom mapping)
// and then wrapping the encoded text with a Lua loadstring call and a loader snippet.
const loader = `]]):gsub("..",function(s)a,b=s:byte(1,2)return s.char(16*a+b-16*(a<48 and 33 or 109)-(b<48 and 33 or 109))end))()`;
const encodedNumbers = {
  "0": "!",
  "1": "\"",
  "2": "#",
  "3": "$",
  "4": "%",
  "5": "&",
  "6": "'",
  "7": "(",
  "8": ")",
  "9": "*",
  "10": "+",
  "11": ",",
  "12": "-",
  "13": ".",
  "14": "/",
  "15": "|"
};

class LuaObfuscator {
  /**
   * Encodes a single number (expected to be in the range 0-255) into two characters.
   * @param {number} number - A number between 0 and 255.
   * @returns {string} The two-character encoded string.
   */
  encodeNumber(number) {
    const highNibble = Math.floor(number / 16);
    const lowNibble = number % 16;
    return encodedNumbers[highNibble] + encodedNumbers[lowNibble];
  }
  
  /**
   * Encodes the provided Lua code into an obfuscated version.
   * The process converts each character into a two-character representation, and then wraps
   * the resulting string with a Lua loadstring call along with the loader snippet.
   * @param {string} text - The raw Lua code to obfuscate.
   * @returns {string} The obfuscated Lua code.
   * @throws Will throw an error if input is not a string or contains non-ASCII characters.
   */
  encode(text) {
    if (typeof text !== 'string') {
      throw new Error("Input must be a string");
    }
    
    let encoded = "";
    for (let i = 0; i < text.length; i++) {
      const code = text.charCodeAt(i);
      if (code > 255) {
        throw new Error("Only ASCII characters are supported");
      }
      encoded += this.encodeNumber(code);
    }
    // Wrap the encoded string in a Lua loadstring call along with the loader code.
    return `loadstring(([==[${encoded}]==]${loader}`;
  }

  /**
   * Returns the length (number of characters) of the provided string.
   * @param {string} text - A string.
   * @returns {number} The character count.
   */
  getCharCount(text) {
    return text ? text.length : 0;
  }
}

// Export for Node.js or attach to the window if in a browser.
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LuaObfuscator;
} else {
  window.LuaObfuscator = LuaObfuscator;
}
