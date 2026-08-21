require "localization"
local ffi = require "ffi"

local loader = {}

loader.load = function(path)
	if global_config["ThirdPartyPlugin"]["EnableMCPPlugin"] ~= "1" then
		log.warn('MCPPlugin disabled by config')
		return false
	end
	local s, r = pcall(ffi.load, __(path:string()))
	if not s then
		log.error('failed: ' .. r)
		return false
	end
	loader.dll = r
	ffi.cdef[[
	   void MCPPlugin_Initialize(int port);
	]]
	return true
end

loader.unload = function()

end

loader.mss = function(self)
	if self.dll then
		log.debug('MCP server port: ' .. global_config["ThirdPartyPlugin"]["MCPPort"])
		local port = tonumber(global_config["ThirdPartyPlugin"]["MCPPort"]) or 19816
		self.dll.MCPPlugin_Initialize(port)
	end
end

return loader