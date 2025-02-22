-- Luafuck obfuscator implementation
local function encodeNumber(number)
    local encodedNumbers = {
        ["0"] = "!",
        ["1"] = "\"",
        ["2"] = "#",
        ["3"] = "$",
        ["4"] = "%",
        ["5"] = "&",
        ["6"] = "'",
        ["7"] = "(",
        ["8"] = ")",
        ["9"] = "*",
        ["10"] = "+",
        ["11"] = ",",
        ["12"] = "-",
        ["13"] = ".",
        ["14"] = "/",
        ["15"] = "|"
    }
    local highNibble = math.floor(number / 16)
    local lowNibble = number % 16
    return encodedNumbers[tostring(highNibble)] .. encodedNumbers[tostring(lowNibble)]
end

local function encode(text)
    if type(text) ~= "string" then
        error("Input must be a string")
    end

    local encoded = ""
    for i = 1, #text do
        local code = string.byte(text, i)
        if code > 255 then
            error("Only ASCII characters are supported")
        end
        encoded = encoded .. encodeNumber(code)
    end
    return encoded
end

local function createLoader()
    return "]]):gsub(\"..\",function(s)a,b=s:byte(1,2)return s.char(16*a+b-16*(a<48 and 33 or 109)-(b<48 and 33 or 109))end))()"
end

local function obfuscateLua(code)
    local encoded = encode(code)
    return "loadstring(([==[" .. encoded .. "]==]" .. createLoader()
end

local function obfuscateLuau(code)
    -- Use the same obfuscation logic for now
    local encoded = encode(code)
    return "loadstring(([==[" .. encoded .. "]==]" .. createLoader()
end

-- Example usage
local luaCode = 'print("Hello, World!")'
local obfuscatedLuaCode = obfuscateLua(luaCode)
print(obfuscatedLuaCode)

local luauCode = 'print("Hello, World!")'
local obfuscatedLuauCode = obfuscateLuau(luauCode)
print(obfuscatedLuauCode)

-- Export functions for use in other scripts
return {
    obfuscateLua = obfuscateLua,
    obfuscateLuau = obfuscateLuau
}
