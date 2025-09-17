
local root = fs.ydwe_path():parent_path():remove_filename():remove_filename() / "Component" / "share" / "mpq"
if not fs.exists(root) then
	root = fs.ydwe_path() / 'share' / 'mpq'
end

local function is_enable_japi()
	local ok, result = pcall(function ()
		local tbl = sys.ini_load(fs.ydwe_path() / 'plugin' / 'warcraft3' / 'config.cfg')
		return tbl['Enable']['yd_jass_api.dll'] ~= '0'
	end)
	if not ok then return true end
	return result
end

local function get_config()
	local list = {}
	local enable_ydtrigger = global_config["ThirdPartyPlugin"]["EnableYDTrigger"] ~= "0"
	local enable_japi = is_enable_japi()
    for i, v in ipairs({'config', 'config.user'}) do
        local f, err = io.open(root / v, 'r')
        if not f then
            log.error('Open ' .. (root / v):string() .. ' failed.')
        else
            for line in f:lines() do
                if not enable_ydtrigger and (string.trim(line) == 'ydtrigger') then
                    -- do nothing
                elseif not enable_japi and (string.trim(line) == 'japi') then
                    -- do nothing
                else
                    table.insert(list, root / string.trim(line))
                end
            end
            f:close()
        end
    end
	return list
end

local list = get_config()
return list
