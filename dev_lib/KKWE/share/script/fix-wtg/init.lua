local event = require 'ev'
local wtgloader = require 'fix-wtg.loader'
local lniloader = require 'fix-wtg.lniloader'
local lni = require 'lni-c'

local loaded_virtual_mpq = {}
local function check_virtual_mpq(mappath)
    if loaded_virtual_mpq[mappath] or not fs.exists(fs.war3_path() / 'KKWE.ini') then
        return
    end
    local name = fs.path(mappath):filename():string()
    local cfg = lni(io.load(fs.war3_path() / 'KKWE.ini') or '')
    local p = fs.path(cfg and cfg['VMPQ'] and cfg['VMPQ'][name] or '')
    if not p or not fs.exists(p) then
        return
    end
    virtual_mpq.open_path(p, 15)
    loaded_virtual_mpq[mappath] = p
    log.info('load virtual path', mappath, p)
end

local function check_close_virtual_mpq(mappath)
    if loaded_virtual_mpq[mappath] then
        virtual_mpq.close_path(loaded_virtual_mpq[mappath], 15)
        log.info('unload virtual path', mappath, loaded_virtual_mpq[mappath])
        loaded_virtual_mpq[mappath] = nil
    end
end

local ignore_once = {}
event.on('virtual_mpq: open map', function(mappath)
    if ignore_once[mappath] then
        ignore_once[mappath] = nil
        log.info('ignore open', mappath)
        return
    end
    ignore_once[mappath] = true
    log.info('Open map', mappath)
    lniloader.load(mappath)
    wtgloader(mappath)
    event.emit('打开地图', mappath)
    check_virtual_mpq(mappath)
end)

event.on('virtual_mpq: close map', function(mappath)
    ignore_once[mappath] = nil
    log.info('Close map', mappath)
    lniloader.unload(mappath)
    check_close_virtual_mpq(mappath)
end)

event.on('测试地图', function(mappath)
    if loaded_virtual_mpq[mappath] then
        global_config_save('MapTest', 'VirtualPath', loaded_virtual_mpq[mappath]:string())
    end
end)
