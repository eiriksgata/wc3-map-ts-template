local mt = {}
mt.__index = mt

function mt:stringify_section(str, t, section)
    if not t[section] then
        return
    end
    table.insert(str, ('[%s]'):format(section))
    for _, l in ipairs(t[section]) do
        table.insert(str, ('%s=%s'):format(l[1], l[2]))
    end
    table.insert(str, '')
end

local function split(str)
    local r = {}
    str = str:gsub(' %- ', '@')
    str:gsub('[^@]+', function (w) r[#r+1] = w end)
    return r
end


--不带前缀的置顶, 带前缀排序到一起 
local function similaritySort(t)
    local map = {}
    local res = {}
    for _, u in ipairs(t) do 
        local keys = split(u.title)
        local name = keys[#keys] 
        local pre = ''
        table.remove(keys, #keys)
        if #keys > 0 then 
            pre = table.concat(keys)

            local list = map[pre] or {}
            map[pre] = list 
            list[#list + 1] = {name, u}
        else 
            res[#res + 1] = u
        end
    end 
    local pre_list = {}
    for pre, list in pairs(map) do 
        table.sort(list, function (a, b) return a[1] < b[1] end)
        pre_list[#pre_list + 1] = pre
    end 

    table.sort(pre_list, function (a, b) return a < b end)
    for _, pre in ipairs(pre_list) do 
        for _, info in ipairs(map[pre]) do 
            res[#res + 1] = info[2]
        end 
    end 
    return res 
end

function mt:stringify_ui(data_title, string_title, t)
    table.insert(self.data, ('[%s]'):format(data_title))
    table.insert(self.string, ('[%s]'):format(string_title))

    for _, category in ipairs(t) do
        if category == 'TC_KKAPI' then 
            t[category] = similaritySort(t[category])
        end 
        for _, u in ipairs(t[category]) do
            table.insert(self.string, ('%s=%q'):format(u.name, u.title))
            table.insert(self.string, ('%s="%s"'):format(u.name, u.description:gsub('${(.-)}', '",~%1,"')))
            if u.comment then
                table.insert(self.string, ('%sHint=%q'):format(u.name, u.comment))
            end

            local args = ''
            local defaults = ''
            local limits = ''
            local has_default = false
            local has_limit = false
            if u.use_in_event then
                args = args .. ',' .. u.use_in_event
            end
            if u.returns then
                args = args .. ',' .. u.returns
            end
            if u.args then
                for i, arg in ipairs(u.args) do
                    args = args .. ',' .. arg.type
                    if arg.default then
                        has_default = true
                        defaults = defaults .. arg.default .. ','
                    else
                        defaults = defaults .. '_,'
                    end
                    if arg.min then
                        has_limit = true
                        limits = limits .. arg.min .. ','
                    else
                        limits = limits .. '_,'
                    end
                    if arg.max then
                        has_limit = true
                        limits = limits .. arg.max .. ','
                    else
                        limits = limits .. '_,'
                    end
                end
            end
            table.insert(self.data, ('%s=1%s'):format(u.name, args))
            if has_default then
                table.insert(self.data, ('_%s_Defaults=%s'):format(u.name, defaults:sub(1, -2)))
            end
            if has_limit then
                table.insert(self.data, ('_%s_Limits=%s'):format(u.name, limits:sub(1, -2)))
            end
            table.insert(self.data, ('_%s_Category=%s'):format(u.name, u.category))
            if u.script_name then
                table.insert(self.data, ('_%s_ScriptName=%s'):format(u.name, u.script_name))
            end

            table.insert(self.data, '')
            table.insert(self.string, '')
        end
    end
end

function mt:write(t)
    self.data = {}
    self.string = {}
    self:stringify_section(self.data, t.ui.define, 'TriggerCategories')
    self:stringify_section(self.data, t.ui.define, 'TriggerTypes')
    self:stringify_section(self.data, t.ui.define, 'TriggerTypeDefaults')
    self:stringify_section(self.data, t.ui.define, 'TriggerParams')
    self:stringify_ui('TriggerEvents','TriggerEventStrings',t.categories.event)
    self:stringify_ui('TriggerConditions','TriggerConditionStrings',t.categories.condition)
    self:stringify_ui('TriggerActions','TriggerActionStrings',t.categories.action)
    self:stringify_ui('TriggerCalls','TriggerCallStrings',t.categories.call)
    self:stringify_section(self.data, t.ui.define, 'DefaultTriggerCategories')
    self:stringify_section(self.data, t.ui.define, 'DefaultTriggers')
    self:stringify_section(self.data, t.ui.define, 'AIFunctionStrings')
    return table.concat(self.data, '\n'), table.concat(self.string, '\n')
end

return function(t)
    local obj = setmetatable({}, mt)
    return obj:write(t)
end
