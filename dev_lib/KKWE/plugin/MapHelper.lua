require "localization"
local ffi = require "ffi"

local loader = {}
	
loader.load = function(path)
	if global_config["ThirdPartyPlugin"]["EnableMapHelper"] == "0" then
		log.warn('failed: disable')
		return false
	end

	local s, r = pcall(ffi.load, __(path:string()))
	if not s then
		log.error('failed: ' .. r)
		return false
	end
	loader.dll = r
	ffi.cdef[[   
	   void Initialize();
	]]
	return true
end

loader.unload = function()
	
end

loader.mss = function(self)
	if self.dll then
		self.dll.Initialize()
	end
end

return loader
