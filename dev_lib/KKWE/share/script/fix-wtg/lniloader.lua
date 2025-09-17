local storm = require 'virtual_storm'

local function is_lni(path)
    if path:filename():string() ~= '.w3x' then
        return false
    end
    local f = io.open(path)
    if not f then
        return false
    end
    if f:seek('set', 8) and 'W2L\x01' == f:read(4) then
        f:close()
        return true
    end
    f:close()
    return false
end

local function is_lni_mappath(mappath)
    return is_lni(mappath) or not (mappath:filename():string() ~= '.w3x' or is_lni_map and (is_lni_map ~= mappath))
end

local function trans_command(cmd)
    local str = cmd:gsub([[(\\?)$]], function(str)
        if str == [[\]] then
            return [[\\]]
        end
    end)
    return '"' .. str .. '"'
end

local function excute_w2l(mode, map_path, target_path)
    local w2l_dir = fs.ydwe_path() / "plugin" / "w3x2lni_zhCN_v2.7.3"
    local command_line = ([=["%s" -E -e"package.cpath=[[%s]];package.path=[[%s;%s]]" "%s" "%s" %s %s]=]):format(
        (w2l_dir / 'bin' / 'w3x2lni-lua.exe'):string(),
        (w2l_dir / 'bin' / '?.dll'):string(),
        (w2l_dir / 'script' / '?.lua'):string(),
        (w2l_dir / 'script' / '?' / 'init.lua'):string(),
        (w2l_dir / 'script' / 'gui' / 'mini.lua'):string(),
        mode,
        trans_command(map_path:string()),
        trans_command(target_path:string())
    )
    return sys.spawn(command_line, w2l_dir / 'script', true, false, 'disable')
end

local dummy_map
local dummy_mpq
local is_lni_map
local function unloadLni()
    storm.set_dummy_map(nil)
    if dummy_mpq then
        log.info('Unload lni dummy mpq')
        storm.close(dummy_mpq)
        fs.remove(dummy_map)
    end
    dummy_mpq = nil
    dummy_map = nil
    is_lni_map = nil
end

local function loadLni(mappath)
    unloadLni()

    local path = fs.path(mappath)
    if not is_lni(path) then
        log.info('Not lni map')
        return
    end

    local dir = path:parent_path()
    dummy_map = fs.path(string.format("%s%s.dummy_map", (fs.ydwe_path() / 'logs' / dir:filename()):string(),
        path:filename()))
    if not excute_w2l('obj', path, dummy_map) then
        return
    end

    if not fs.exists(dummy_map) then
        log.error('Can`t open obj map', dummy_map)
        return
    end

    dummy_mpq = storm.open(dummy_map, 16)
    is_lni_map = path
    log.info('Open as lni map', is_lni_map:string())
end

local function packLni(mappath)
    if not is_lni_mappath(mappath) then
        log.info('Not lni map', mappath:string(), is_lni_map and is_lni_map:string() or "nil")
        return true
    end

    local dir = mappath:parent_path()
    local tmp = fs.path((dir / mappath:filename()):string() .. ".temp")
    local w2l_dir = fs.ydwe_path() / "plugin" / "w3x2lni_zhCN_v2.7.3"

    fs.copy_file(mappath, tmp, true)
    fs.copy_file(w2l_dir / 'script' / 'core' / '.w3x', mappath, true)

    if excute_w2l('lni', tmp, dir) then
        fs.remove(tmp)
        return true
    end

    fs.copy_file(tmp, mappath, true)
    fs.remove(tmp)
    log.error('Generate lni failed', mappath:string())

    return false
end

return {
    load = loadLni,

    unload = unloadLni,

    pack = packLni,

    is_lni = is_lni_mappath,

    make_test = function(mappath, to, enableSlk)
        return excute_w2l(enableSlk and 'slk' or 'obj', mappath, to)
    end,
}
