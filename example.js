// This file demonstrates how to use the LuaObfuscator to obfuscate Lua code,
// and also wires up the DOM interactions for the Lua obfuscator section.
document.addEventListener('DOMContentLoaded', () => {
  const luaInput = document.getElementById("luaInput");
  const luaOutput = document.getElementById("luaOutput");
  const luaEncodeButton = document.getElementById("luaEncode");
  const methodSelect = document.getElementById("methodSelect");
  const characterAmount = document.getElementById("characterAmount");

  if (!luaInput || !luaOutput || !luaEncodeButton || !methodSelect) {
    console.error("Required DOM elements for Lua obfuscation not found");
    return;
  }

  // Create instances of Lua and Luau obfuscators.
  const obfuscators = {
    lua: new LuaObfuscator(),
    luau: new LuaObfuscator() // Assuming LuaObfuscator can handle both Lua and Luau for simplicity.
  };

  luaEncodeButton.addEventListener("click", () => {
    luaOutput.classList.remove('error', 'success');
    
    try {
      const inputText = luaInput.value.trim();
      if (!inputText) {
        throw new Error('Please enter some Lua or Luau code to encode');
      }

      const selectedMethod = methodSelect.value;
      const obfuscatedCode = obfuscators[selectedMethod].encode(inputText);
      luaOutput.textContent = obfuscatedCode;
      luaOutput.classList.add('success');
      
      if (characterAmount) {
        characterAmount.textContent = obfuscatedCode.length + " chars";
      }
    } catch (error) {
      luaOutput.textContent = `Error: ${error.message}`;
      luaOutput.classList.add('error');
      console.error(`${methodSelect.value} encoding error:`, error);
    }
  });

  // Example usage logging to console.
  const exampleLuaCode = 'print("Hello, World!")';
  try {
    const exampleObfuscated = obfuscators.lua.encode(exampleLuaCode);
    console.log("Obfuscated Lua Code (example):");
    console.log(exampleObfuscated);
  } catch (error) {
    console.error("Error during example obfuscation:", error.message);
  }
});
