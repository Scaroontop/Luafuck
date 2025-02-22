// This script encodes an input string into a custom obfuscated format,
// then generates a self-contained JavaScript snippet that decodes and logs the original text.
document.addEventListener('DOMContentLoaded', () => {
    const textInput = document.getElementById("textInput");
    const textOutput = document.getElementById("textOutput");
    const textEncodeButton = document.getElementById("textEncode");

    if (!textInput || !textOutput || !textEncodeButton) {
        console.error("Required DOM elements for text obfuscation not found");
        return;
    }

    // Encoding map: each nibble (0 to 15) is mapped to a unique character.
    const encodedNumbers = {
        0: "!",    // Using number keys directly
        1: "@",    // Changed from a double quote to "@" for clarity and escaping safety
        2: "#",
        3: "$",
        4: "%",
        5: "&",
        6: "'",
        7: "(",
        8: ")",
        9: "*",
        10: "+",
        11: ",",
        12: "-",
        13: ".",
        14: "/",
        15: "|"
    };

    // Create a reverse mapping for decoding from symbol to number.
    const encodedNumbersReverse = Object.fromEntries(
        Object.entries(encodedNumbers).map(([key, value]) => [value, parseInt(key, 10)])
    );

    // Encodes a single number (0-255) into two characters.
    function encodeNumber(number) {
        const highNibble = Math.floor(number / 16);
        const lowNibble = number % 16;
        if (highNibble > 15 || lowNibble > 15 || highNibble < 0 || lowNibble < 0) {
            throw new Error('Character code out of range');
        }
        return encodedNumbers[highNibble] + encodedNumbers[lowNibble];
    }

    // Encodes a text string to the custom encoded string.
    function encode(text) {
        if (typeof text !== 'string') {
            throw new Error('Input must be a string');
        }
        return Array.from(text)
            .map(char => {
                const charCode = char.charCodeAt(0);
                if (charCode > 255) {
                    throw new Error('Only ASCII characters are supported');
                }
                return encodeNumber(charCode);
            })
            .join('');
    }

    // Decoder function: takes the encoded string and a mapping, and decodes it.
    function decoder(encodedStr, mapping) {
        let result = '';
        for (let i = 0; i < encodedStr.length; i += 2) {
            if (i + 1 >= encodedStr.length) break;
            const high = mapping[encodedStr[i]] * 16;
            const low = mapping[encodedStr[i + 1]];
            if (isNaN(high) || isNaN(low)) {
                throw new Error('Invalid encoded character encountered');
            }
            result += String.fromCharCode(high + low);
        }
        return result;
    }

    // Generate a self-contained decoder snippet.
    function createDecoderSnippet(encodedText) {
        return `(function(encoded) {
  const mapping = ${JSON.stringify(encodedNumbersReverse)};
  const decoder = ${decoder.toString()};
  try {
    const decoded = decoder(encoded, mapping);
    console.log("Decoded text:", decoded);
    return decoded;
  } catch (error) {
    console.error("Decoding error:", error);
  }
})("${encodedText}")`;
    }

    // Add click event listener for the text obfuscation button.
    textEncodeButton.addEventListener("click", () => {
        textOutput.classList.remove('error', 'success');
        
        try {
            const inputText = textInput.value.trim();
            if (!inputText) {
                throw new Error('Please enter some text to encode');
            }
            const encodedText = encode(inputText);
            const obfuscatedCode = createDecoderSnippet(encodedText);
            textOutput.textContent = obfuscatedCode;
            textOutput.classList.add('success');
        } catch (error) {
            textOutput.textContent = `Error: ${error.message}`;
            textOutput.classList.add('error');
            console.error('Text encoding error:', error);
        }
    });
});
