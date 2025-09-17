local mt = {}

mt.info = {
    name = '输出引用的对象',
    version = 1.0,
    author = '最萌小汐',
    description = 'slk时输出被引用的对象列表'
}

function mt:on_finish(w2l)
    if w2l.setting.mode ~= 'slk' then
        return
    end
    local list = {}
    for _, ttype in ipairs {'unit', 'ability', 'item', 'buff', 'doodad', 'destructable', 'upgrade'} do
        for id, obj in pairs(w2l.slk[ttype]) do
            if obj._mark then
                list[#list+1] = ('%s %s'):format(id, ttype)
            end
        end
    end

    io.save(w2l.setting.output:parent_path() / 'used_ids.txt', table.concat(list, '\n'))
end

return mt
