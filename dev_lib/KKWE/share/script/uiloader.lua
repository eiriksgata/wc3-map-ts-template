require "registry"
require "util"
local stringify_slk = require 'stringify_slk'
local ui = require 'ui-builder.init'
local txt = (require 'w3xparser').txt
local ini = (require 'w3xparser').ini
local slk = (require 'w3xparser').slk
local lni = require 'lni-c'
local load_triggerdata = require 'triggerdata'
local info = lni(io.load(fs.ydwe_path() / 'plugin' / 'w3x2lni' / 'script' / 'info.ini'))

local root = fs.ydwe_path():parent_path():remove_filename():remove_filename() / "Component" / "share" / "mpq"
if not fs.exists(root) then
	root = fs.ydwe_path() / 'share' / 'mpq'
end

local loader = {}

local data, string
function loader:triggerdata(name, callback)
	log.trace("virtual_mpq 'triggerdata'")
	if #self.list == 0 then
		return nil
	end
    data, string = load_triggerdata(self.list, true)
	return data
end

function loader:triggerstrings(name, callback)
	log.trace("virtual_mpq 'triggerstrings'")
	if #self.list == 0 then
		return nil
	end
	local r = string
	data, string = nil, nil
	return r
end

function loader:worldeditstrings()
	log.trace("virtual_mpq 'worldeditstrings'")
	local t = ini(io.load(root / 'units' / 'ui' / 'WorldEditStrings.txt'), 'WorldEditStrings')
	--t.WorldEditStrings.WESTRING_APPNAME = 'YD WorldEdit [ ' .. tostring(ydwe_version) .. ' ]'
	local str = {}
	str[#str+1] = "[WorldEditStrings]"
	for k, v in pairs(t.WorldEditStrings) do
		str[#str+1] = k .. '="' .. v .. '"'
	end
	return table.concat(str, '\n')
end

local function stringify_txt(t)
	local buf = {}
	for id, o in pairs(t) do
		buf[#buf+1] = ('[%s]'):format(id)
		for k, v in pairs(o) do
			for i = 1, #v do
				if v[i]:find(',', 1, true) then
					v[i] = '"' .. v[i] .. '"'
				end
			end
			buf[#buf+1] = ('%s=%s'):format(k, table.concat(v, ','))
		end
	end
	return table.concat(buf, '\r\n')
end

function loader:initialize()
	self.list = require 'ui'
	virtual_mpq.watch('UI\\TriggerData.txt',      function (name) return self:triggerdata() end)
	virtual_mpq.watch('UI\\TriggerStrings.txt',   function (name) return self:triggerstrings() end)
	virtual_mpq.watch('UI\\WorldEditStrings.txt', function (name) return self:worldeditstrings() end)
	
	for _, filename in ipairs(info.txt) do
		if info.txt[1] ~= filename then
			virtual_mpq.watch(filename, function () return '' end)
		end
	end
	virtual_mpq.watch(info.txt[1], function ()
		local t = {}
		for _, filename in pairs(info.txt) do
			txt(io.load(root / 'units' / filename), filename, t)
		end
		txt(io.load(root / 'units' / 'ui' / 'ydwetip.txt'), 'ydwetip', t)
		
		local replace = {}
		txt(io.load(root / 'units' / 'ui' / 'editorsuffix.txt'), 'editorsuffix', replace)
		for id, o in pairs(replace) do
			if not t[id] then
				t[id] = o
			else
				for k, v in pairs(o) do
					t[id][k] = v
				end
			end
		end
		return stringify_txt(t)
	end)
	virtual_mpq.watch('units\\abilitydata.slk', function ()
		local t = slk(io.load(root / 'units' / 'units' / 'abilitydata.slk'), 'abilitydata.slk')
		for _, o in pairs(t) do
			o.useInEditor = 1
		end
		return stringify_slk(t, 'alias')
	end)
	virtual_mpq.watch('units\\abilitybuffdata.slk', function ()
		local t = slk(io.load(root / 'units' / 'units' / 'abilitybuffdata.slk'), 'abilitybuffdata.slk')
		local function insert(code, sort, race)
			t[code] = {
				code = code,
				comments = 'YDWE',
				isEffect = 0,
				version = 1,
				useInEditor = 1,
				sort = sort,
				race = race,
				InBeta = 1
			}
		end
		insert('Bdbl', 'hero', 'human') 
		insert('Bdbm', 'hero', 'human')
		insert('BHtb', 'unit', 'other')
		insert('Bsta', 'unit', 'orc')
		insert('Bdbb', 'hero', 'human')
		insert('BIpb', 'item', 'other')
		insert('BIpd', 'item', 'other')
		insert('Btlf', 'unit', 'other')
		return stringify_slk(t, 'alias')
	end)
end

uiloader = loader
