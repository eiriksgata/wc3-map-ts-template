require "sys"
local ffi = require "ffi"

local loader = {}

loader.load = function(path)
    if global_config["ThirdPartyPlugin"]["EnableDarkMode"] ~= "1" then
        log.warn('failed: disable')
        return false
    end
    local s, r = pcall(ffi.load, __(path:string()))
    if not s then
        log.error('failed: ' .. r)
        return false
    end
    loader.dll = r
    ffi.cdef [[
        int GetDarkMode();
	]]
    if loader.dll.GetDarkMode() == 0 then
        global_config["ThirdPartyPlugin"]["EnableDarkMode"] = "0"
        log.warn('failed: System does not support dark mode')
        return false
    end
    return loader.dll ~= nil
end

loader.unload = function()
end

return loader
