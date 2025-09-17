local ui = require 'ui-builder.init'

return function (list, load_unknownui)
	if #list == 0 then
		return nil
    end
    local state
    local unknown_path = fs.ydwe_path() / 'logs' / 'unknownui'
    for i, path in ipairs(list) do
        if path:string() == unknown_path:string() then
            table.remove(list, i)
            break
        end
    end
	if load_unknownui then
		table.insert(list, unknown_path)
	end
    for _, path in ipairs(list) do
        log.trace('Loading ui from ' .. path:string())
		if fs.exists(path / 'ui') then
			state = ui.merge(state, ui.old_reader(path / 'ui'))
		else
			state = ui.merge(state, ui.new_reader(path))
		end
	end
	local data, string = ui.old_writer(state)
	return data, string, state
end
