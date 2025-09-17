return function()
    local fs = require 'bee.filesystem'
    local sp = require 'bee.subprocess'
    local p, err = sp.spawn {
        'cmd', '/c',
        'reg', 'query', [[HKEY_CURRENT_USER\SOFTWARE\Classes\YDWEMap\shell\run_war3\command]],
        searchPath = true,
        stdout = true,
    }
    if not p then
        error(err)
        return
    end
    p:wait()
    local command = p.stdout:read 'a'
    local ydwe
    if command then
        local path = command:match '"([^"]*)"'
        if path then
            ydwe = fs.path(path):parent_path()
        end
    end
    if not ydwe then
        ydwe = require('backend.base_path'):parent_path():parent_path()
    end
    if fs.exists(ydwe / 'KKWE.exe') then
        return ydwe
    end
    local ydwe = ydwe:parent_path()
    if fs.exists(ydwe / 'KKWE.exe') then
        return ydwe
    end
end
