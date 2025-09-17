local checker = require 'fix-wtg.checker'
local reader = require 'fix-wtg.reader'
local load_triggerdata = require 'triggerdata'
local storm = require 'virtual_storm'
local ui = require 'ui-builder.init'

return function(mappath)
    local wtg = storm.load_file('war3map.wtg')
    if not wtg then
        return
    end
    local list = require 'ui'
    local state = select(3, load_triggerdata(list, true))
    if checker(wtg, state) then
        return
    end
    if not gui.yesno_message(nil, _(
        'Unknown UI detected, KKWE can try to recognize it, continue or not? (KKWE needs to be restarted)')) then
        return
    end
    local _, _, state = load_triggerdata(list, false)
    local _, fix = reader(wtg, state)
    local bufs = {ui.new_writer(fix)}
    local dir = fs.ydwe_path() / 'logs' / 'unknownui'
    fs.create_directories(dir)
    io.save(dir / 'define.txt', bufs[1])
    io.save(dir / 'event.txt', bufs[2])
    io.save(dir / 'condition.txt', bufs[3])
    io.save(dir / 'action.txt', bufs[4])
    io.save(dir / 'call.txt', bufs[5])
    sys.restart(mappath)
end
