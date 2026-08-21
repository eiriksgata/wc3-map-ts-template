-- Append quick "add event/condition/action" items into WE's native trigger
-- context menu. Shows all three ECA sections (event / condition / action),
-- each grouped by category and sorted by pinyin. The section matching the
-- right-clicked tree branch is listed first. Clicking an item opens WE's
-- native ECA dialog pre-positioned to that function. Ctrl+Click an item to
-- toggle it as a favorite. Recent + favorites are persisted across sessions.
local ffi = require 'ffi'
local uni = require 'ffi.unicode'
require 'filesystem'

local ok_kk, kktrigger = pcall(require, 'kktrigger')
if not ok_kk then
	log.error('[quickmenu] require kktrigger failed: ' .. tostring(kktrigger))
	kktrigger = nil
end

-- Feature toggle (设置面板 > 功能选项 > 启用触发器快捷菜单). Default on; only
-- treated as off when the config explicitly holds "0".
local function quickmenu_enabled()
	local ok, v = pcall(function()
		return global_config['FeatureToggle']['EnableQuickMenu']
	end)
	return (ok and tostring(v) == '1')
end

ffi.cdef[[
	int GetClassNameA(unsigned int hWnd, char* lpClassName, int nMaxCount);
	int DeleteMenu(unsigned int hMenu, unsigned int uPosition, unsigned int uFlags);
	int GetMenuStringW(unsigned int hMenu, unsigned int uIDItem, unsigned short* lpString, int cchMax, unsigned int uFlags);
	unsigned int CreatePopupMenu(void);
	int GetMenuItemCount(unsigned int hMenu);
	short GetKeyState(int nVirtKey);
	int TrackPopupMenu(unsigned int hMenu, unsigned int uFlags, int x, int y, int nReserved, unsigned int hWnd, const void* prcRect);
	int DestroyMenu(unsigned int hMenu);
	unsigned int GetActiveWindow(void);
]]

local MF_BYPOSITION = 0x400
local MF_POPUP      = 0x10
local MF_SEPARATOR  = 0x800
local MF_MENUBARBREAK = 0x20
local VK_CONTROL    = 0x11

-- Max category rows per column before starting a new column (avoids menus
-- running off-screen). Tune to taste.
local COL_ROWS = 38

-- Per-branch config. type: 0=event 1=condition 2=action (matches kktrigger).
local ECA = {
	[0] = { label = '事件', add = 'add_event',     get = 'get_events' },
	[1] = { label = '条件', add = 'add_condition', get = 'get_conditions' },
	[2] = { label = '动作', add = 'add_action',    get = 'get_actions' },
}

-- Recently used / favorite function identifiers, per branch.
local RECENT_MAX = 10
local recent    = { [0] = {}, [1] = {}, [2] = {} }
local favorites = { [0] = {}, [1] = {}, [2] = {} }

local DATA_PATH = fs.ydwe_path() / 'bin' / 'kk_quickmenu.cfg'

-- Recently picked literal value names, keyed by param type_name (string keys),
-- newest first. Powers the "变量名 > 最近使用" quick-pick submenu.
local VALUE_RECENT_MAX = 10
local recent_values = {}

local function serialize()
	local function dump(tbl)
		local parts = {}
		for t = 0, 2 do
			local names = {}
			for _, n in ipairs(tbl[t] or {}) do
				names[#names + 1] = string.format('%q', n)
			end
			parts[#parts + 1] = string.format('[%d]={%s}', t, table.concat(names, ','))
		end
		return '{' .. table.concat(parts, ',') .. '}'
	end
	local function dump_vals()
		local parts = {}
		for tn, names in pairs(recent_values) do
			local ns = {}
			for _, n in ipairs(names) do ns[#ns + 1] = string.format('%q', n) end
			parts[#parts + 1] = string.format('[%q]={%s}', tn, table.concat(ns, ','))
		end
		return '{' .. table.concat(parts, ',') .. '}'
	end
	return 'return {recent=' .. dump(recent) .. ',fav=' .. dump(favorites)
		.. ',vals=' .. dump_vals() .. '}'
end

local function save_data()
	pcall(function() io.save(DATA_PATH, serialize()) end)
end

local function load_data()
	local content = io.load(DATA_PATH)
	if not content then return end
	local chunk = load(content)
	if not chunk then return end
	local ok, data = pcall(chunk)
	if not ok or type(data) ~= 'table' then return end
	for t = 0, 2 do
		if data.recent and type(data.recent[t]) == 'table' then recent[t] = data.recent[t] end
		if data.fav    and type(data.fav[t])    == 'table' then favorites[t] = data.fav[t] end
	end
	if type(data.vals) == 'table' then
		for tn, names in pairs(data.vals) do
			if type(names) == 'table' then recent_values[tn] = names end
		end
	end
end
load_data()

-- Record `name` as a recently-picked value for `type_name` (newest first, deduped).
local function push_recent_value(type_name, name)
	if not name or name == '' then return end
	local r = recent_values[type_name]
	if not r then r = {}; recent_values[type_name] = r end
	for i = #r, 1, -1 do if r[i] == name then table.remove(r, i) end end
	table.insert(r, 1, name)
	while #r > VALUE_RECENT_MAX do table.remove(r) end
	save_data()
end


local function push_recent(type, name)
	local r = recent[type]
	if not r then return end
	for i = #r, 1, -1 do
		if r[i] == name then table.remove(r, i) end
	end
	table.insert(r, 1, name)
	while #r > RECENT_MAX do table.remove(r) end
	save_data()
end

local function is_favorite(type, name)
	for _, n in ipairs(favorites[type] or {}) do
		if n == name then return true end
	end
	return false
end

-- Returns true if added, false if removed.
local function toggle_favorite(type, name)
	local f = favorites[type]
	for i = #f, 1, -1 do
		if f[i] == name then table.remove(f, i); save_data(); return false end
	end
	f[#f + 1] = name
	save_data()
	return true
end

-- Dynamic command-id -> { type, name } map, rebuilt on every popup.
local ID_BASE = 0xE200
local id_map = {}
local next_id = ID_BASE
-- How many TOP-LEVEL items we appended last time (to clean up before re-adding).
local last_added = 0

-- pinyin sort key cache for category names.
local py_cache = setmetatable({}, { __index = function(t, k)
	local ok, v = pcall(function() return kktrigger.pinyin(k) end)
	v = (ok and v) or k
	rawset(t, k, v)
	return v
end })

local function class_name(hwnd)
	if hwnd == 0 then return '' end
	local buf = ffi.new('char[256]')
	local n = ffi.C.GetClassNameA(hwnd, buf, 256)
	return ffi.string(buf, n)
end

local function is_trigger_eca_tree(hwnd)
	return class_name(hwnd) == 'SysTreeView32'
end

-- Remove the items we appended on a previous right-click. We identify our
-- top-level items by their '[KK]' label prefix (robust against menu reuse and
-- stale/duplicate leftovers), then drop the single separator we inserted just
-- before the block (now the trailing item, the only one with no text).
local function is_kk_label(menu, pos)
	local buf = ffi.new('unsigned short[16]')
	local n = ffi.C.GetMenuStringW(menu, pos, buf, 16, MF_BYPOSITION)
	return n >= 3 and buf[0] == 0x5B and buf[1] == 0x4B and buf[2] == 0x4B  -- '[KK'
end

local function cleanup(menu)
	local i = ffi.C.GetMenuItemCount(menu) - 1
	while i >= 0 do
		if is_kk_label(menu, i) then
			ffi.C.DeleteMenu(menu, i, MF_BYPOSITION)
		end
		i = i - 1
	end
	-- our leading separator becomes the last item once the [KK] items are gone
	local cnt = ffi.C.GetMenuItemCount(menu)
	if cnt > 0 then
		local buf = ffi.new('unsigned short[16]')
		local n = ffi.C.GetMenuStringW(menu, cnt - 1, buf, 16, MF_BYPOSITION)
		if n == 0 then ffi.C.DeleteMenu(menu, cnt - 1, MF_BYPOSITION) end
	end
	last_added = 0
end

local function w(text)
	return (uni.u2w(text))
end

local function alloc(type, name, display)
	local id = next_id
	next_id = next_id + 1
	id_map[id] = { type = type, name = name, display = display }
	return id
end

local function disp_of(f)
	return (f.display ~= '' and f.display) or f.name
end

-- ==========================================================================
-- Large-list pagination. Win32 popup menus overflow the screen when a single
-- submenu holds hundreds of items. build_grouped shows up to PAGE_SIZE items in
-- place (column-wrapped) and pushes the overflow into a recursive "下一页"
-- submenu, so no popup exceeds the screen while navigation stays trivial.
-- Backend-agnostic via a tiny builder interface:
--   B.submenu(parent, label) -> child   (create + attach a submenu)
--   B.leaf(parent, entry, flags)        (append one clickable item)
-- ==========================================================================
local PAGE_SIZE = 113   -- items shown per page before a "下一页" submenu

local function break_flag(i)
	return (i > 1 and (i - 1) % COL_ROWS == 0) and MF_MENUBARBREAK or 0
end

local function build_grouped(B, parent, list, _label_of)
	local n = #list
	local first = math.min(n, PAGE_SIZE)
	for i = 1, first do
		B.leaf(parent, list[i], break_flag(i))
	end
	if n > PAGE_SIZE then
		local rest = {}
		for i = PAGE_SIZE + 1, n do rest[#rest + 1] = list[i] end
		local sub = B.submenu(parent, ('下一页 (%d) [&N]'):format(#rest))
		build_grouped(B, sub, rest, _label_of)
	end
end

-- Build a flat submenu (no categories) from a list of identifier names.
local function build_name_list(menu, type, names, byname)
	local sub = ffi.C.CreatePopupMenu()
	local has = false
	for _, name in ipairs(names) do
		local f = byname[name]
		if f then
			ffi.C.AppendMenuW(sub, gui.MF_STRING, alloc(type, name, disp_of(f)), w(disp_of(f)))
			has = true
		end
	end
	return has and sub or nil
end

-- Build one section popup (favorites + recent + category submenus).
local function build_section(type)
	local cfg = ECA[type]
	local list = kktrigger[cfg.get]()
	if not list or #list == 0 then return nil end

	table.sort(list, function(a, b)
		local ka, kb = a.sort or '', b.sort or ''
		if ka == kb then return disp_of(a) < disp_of(b) end
		return ka < kb
	end)

	local byname = {}
	for _, f in ipairs(list) do byname[f.name] = f end

	local section = ffi.C.CreatePopupMenu()
	local any = false

	local fav = build_name_list(section, type, favorites[type] or {}, byname)
	if fav then
		ffi.C.AppendMenuW(section, MF_POPUP, fav, w('★ 收藏'))
		any = true
	end

	local rec = build_name_list(section, type, recent[type] or {}, byname)
	if rec then
		ffi.C.AppendMenuW(section, MF_POPUP, rec, w('最近使用'))
		any = true
	end

	if any then ffi.C.AppendMenuW(section, MF_SEPARATOR, 0, nil) end

	-- Group by category, sort categories by pinyin
	local groups, order = {}, {}
	for _, f in ipairs(list) do
		local c = (f.category ~= '' and f.category) or '其他'
		local g = groups[c]
		if not g then g = {}; groups[c] = g; order[#order + 1] = c end
		g[#g + 1] = f
	end
	table.sort(order, function(a, b) return py_cache[a] < py_cache[b] end)

	-- Raw-HMENU builder for ECA items (dispatched later via EVENT_MENU_COMMAND).
	local eca = {
		submenu = function(parent, label)
			local child = ffi.C.CreatePopupMenu()
			ffi.C.AppendMenuW(parent, MF_POPUP, child, w(label))
			return child
		end,
		leaf = function(parent, f, flags)
			ffi.C.AppendMenuW(parent, gui.MF_STRING + flags, alloc(type, f.name, disp_of(f)), w(disp_of(f)))
		end,
	}

	for i, c in ipairs(order) do
		local sub = ffi.C.CreatePopupMenu()
		build_grouped(eca, sub, groups[c], disp_of)
		local flags = MF_POPUP
		if i > 1 and (i - 1) % COL_ROWS == 0 then
			flags = flags + MF_MENUBARBREAK
		end
		ffi.C.AppendMenuW(section, flags, sub, w(c))
	end

	return section
end

-- Section display: only the right-clicked branch. Returns nil when the cursor
-- is not inside a trigger ECA section (e.g. the object editor tree, which is
-- also a SysTreeView32) so we never inject there.
local function section_order(owner)
	local cur = kktrigger.get_current_eca_type(owner)
	if cur == 0 or cur == 1 or cur == 2 then
		return { cur }, cur
	end
	return nil, cur
end

local function build_menu(menu, owner)
	id_map = {}
	next_id = ID_BASE

	local order, cur = section_order(owner)
	if not order then return end

	ffi.C.AppendMenuW(menu, MF_SEPARATOR, 0, nil)
	last_added = last_added + 1

	for _, type in ipairs(order) do
		local section = build_section(type)
		if section then
			ffi.C.AppendMenuW(menu, MF_POPUP, section, w('[KK] 新建' .. ECA[type].label))
			last_added = last_added + 1
		end
	end
end

-- Fired right before WE shows a popup menu (TrackPopupMenu/Ex).
function event.EVENT_TRACK_POPUP_MENU(event_data)
	if not is_trigger_eca_tree(event_data.owner) then
		return 0
	end
	if not kktrigger then
		log.warn('[quickmenu] kktrigger module not loaded, skip menu inject')
		return 0
	end
	if not quickmenu_enabled() then
		return 0
	end

	cleanup(event_data.menu)
	build_menu(event_data.menu, event_data.owner)
	return 0
end

-- Fired when any popup-menu item is chosen. Return >0 to claim the id.
function event.EVENT_MENU_COMMAND(event_data)
	local entry = id_map[event_data.id]
	if not entry then return 0 end

	local cfg = ECA[entry.type]

	-- Ctrl+Click toggles favorite instead of opening the dialog.
	if ffi.C.GetKeyState(VK_CONTROL) < 0 then
		local added = toggle_favorite(entry.type, entry.name)
		gui.message(nil, (added and '已收藏: ' or '已取消收藏: ') .. (entry.display or entry.name))
		return 1
	end

	local ok, info = kktrigger[cfg.add](entry.name)
	if ok then
		push_recent(entry.type, entry.name)
		if info then
			gui.message(nil, '对话框已打开但未定位到函数: ' .. tostring(info))
		end
	else
		gui.message(nil, '打开' .. cfg.label .. '对话框失败: ' .. tostring(info))
	end
	return 1
end

-- ==========================================================================
-- Parameter right-click menu (inside the ECA dialog).
-- kktrigger inline-hooks WE's parameter display refresh, subclasses each
-- parameter button, and calls this handler on right-click with:
--   disp      : CTriggerFunctionDisplay pointer (opaque, pass back to setters)
--   index     : parameter index within the function
--   type_name : expected parameter type, e.g. "integer" / "real" / "string"
--   type_id   : current value kind (-1 invalid, 0 preset, 1 var, 2 func, 3 string)
--   value     : raw current value text
--   x, y      : screen coords for the popup
--   ctrl      : true if Ctrl was held
-- ==========================================================================
local TPM_RIGHTBUTTON = 0x0002
local TPM_RETURNCMD   = 0x0100

-- ==========================================================================
-- Menu: a small OOP wrapper around Win32 popup menus. A root Menu owns an
-- HMENU and a shared command table; each clickable item carries a Lua callback
-- instead of a manually-managed numeric id. Submenus share the root's command
-- table so a single :track() dispatches clicks anywhere in the tree.
--
--   local m = Menu.new()
--   m:disabled('标题')
--   m:separator()
--   m:item('确定', function() ... end)
--   local sub = m:submenu('更多')
--   sub:item('A', function() ... end)
--   m:track(x, y)            -- shows, dispatches the chosen callback, frees
-- ==========================================================================
local Menu = {}
Menu.__index = Menu

local MENU_ID_BASE = 0xE300

function Menu.new(root)
	local self = setmetatable({}, Menu)
	self.handle = ffi.C.CreatePopupMenu()
	self._root = root or self
	if self._root == self then
		self._cmds = {}            -- id -> callback
		self._next = MENU_ID_BASE
	end
	return self
end

function Menu:_alloc(cb)
	local r = self._root
	local id = r._next
	r._next = r._next + 1
	r._cmds[id] = cb
	return id
end

-- Append a clickable item. `cb` is invoked (no args) when chosen. Optional
-- `flags` adds e.g. MF_MENUBARBREAK for multi-column layouts.
function Menu:item(label, cb, flags)
	ffi.C.AppendMenuW(self.handle, gui.MF_STRING + (flags or 0), self:_alloc(cb), w(label))
	return self
end

-- Append a disabled (grayed) label with no action.
function Menu:disabled(label)
	ffi.C.AppendMenuW(self.handle, gui.MF_STRING + 0x1 --[[MF_GRAYED]], 0, w(label))
	return self
end

function Menu:separator()
	ffi.C.AppendMenuW(self.handle, MF_SEPARATOR, 0, nil)
	return self
end

-- Create and append a child submenu, returning the child Menu for population.
function Menu:submenu(label, flags)
	local child = Menu.new(self._root)
	ffi.C.AppendMenuW(self.handle, MF_POPUP + (flags or 0), child.handle, w(label))
	return child
end

-- Show this (root) menu at screen x,y, dispatch the chosen item's callback, and
-- free the whole menu tree. Returns true if an item was chosen. DestroyMenu is
-- recursive, so destroying the root frees all attached submenus.
function Menu:track(x, y, owner)
	owner = owner or ffi.C.GetActiveWindow()
	local cmd = ffi.C.TrackPopupMenu(self.handle,
		TPM_RIGHTBUTTON + TPM_RETURNCMD, x, y, 0, owner, nil)
	ffi.C.DestroyMenu(self.handle)
	local cb = cmd ~= 0 and self._root._cmds[cmd]
	if cb then cb(); return true end
	return false
end

-- Sort a list of { value, label, sort } entries and append each as an item of
-- `menu`; clicking entry e invokes on_select(e). Large lists are split into
-- screen-sized sub-submenus via build_grouped.
local function add_value_items(menu, list, on_select)
	table.sort(list, function(a, b)
		local ka, kb = a.sort or '', b.sort or ''
		if ka == kb then return (a.label or '') < (b.label or '') end
		return ka < kb
	end)
	local builder = {
		submenu = function(parent, label) return parent:submenu(label) end,
		leaf = function(parent, e, flags)
			parent:item(e.label or e.value, function() on_select(e) end, flags)
		end,
	}
	build_grouped(builder, menu, list, function(e) return e.label or e.value end)
end

-- Placed-instance param types that support WE's terrain object-pick button.
local PICK_OBJ_TYPES = {
	unit = true, item = true, destructable = true,
	rect = true, camerasetup = true,
}

local function param_menu_handler(disp, index, type_name, type_id, value, x, y, ctrl)
	if not quickmenu_enabled() then return end

	local tname = tostring(type_name)
	local base_type = kktrigger.param_base_type and kktrigger.param_base_type(tname)
	local menu = Menu.new()

	-- Action closures (shared by direct items and value submenus).
	local function open_value_input()
		local ok, info = kktrigger.open_param_value_input(disp, index)
		if not ok then gui.message(nil, '打开输入框失败: ' .. tostring(info)) end
	end
	local function set_value(tid, v)
		if not kktrigger.set_param_value(disp, index, tid, v) then
			gui.message(nil, '设置参数失败')
		end
	end
	local function open_dialog(tid, v)
		local ok, info = kktrigger.open_param_dialog(disp, index, tid, v)
		if not ok then gui.message(nil, '打开参数对话框失败: ' .. tostring(info)) end
	end
	-- Selecting a preset/var/func entry: functions and array vars need the native
	-- dialog (sub-parameter allocation); everything else is set in-place.
	local function select_entry(tid)
		return function(e)
			if tid == 2 or (tid == 1 and e.is_array) then open_dialog(tid, e.value)
			else set_value(tid, e.value) end
		end
	end

	-- Header (disabled).
	menu:disabled(('参数#%d [%s]'):format(index, tname))
	menu:separator()

	-- 手动输入: 字面量类型(整数/实数/字符串)直接打开原生输入框; 布尔值则做成
	-- 子菜单，提供 TRUE/FALSE 两项(存为 jass 字面量 "true"/"false", typeId=3)。
	if base_type == 'boolean' then
		local sub = menu:submenu('手动输入...')
		sub:item('TRUE',  function() set_value(3, 'true') end)
		sub:item('FALSE', function() set_value(3, 'false') end)
	elseif kktrigger.param_supports_value(tname) then
		menu:item('手动输入...', open_value_input)
	end

	-- 变量名: 仅当本参数是逆天局部变量函数的"变量名"参数时展示(由 C 端按函数ID
	-- 判定，普通 scriptcode/注释不命中)。候选只取已声明的局部变量名，按声明类型独立:
	-- 最近使用(本机选择记录) / 当前触发器 / 高频(全图最常用)。
	local lv_is, lv_type = kktrigger.localvar_name_context(disp, index)
	if lv_is then
		local rkey = (lv_type ~= '' and lv_type) or '__any'
		local function pick_name(name)
			set_value(3, name)
			push_recent_value(rkey, name)
		end
		local names = menu:submenu('变量名')

		local rv = recent_values[rkey] or {}
		if #rv > 0 then
			local sub = names:submenu(('最近使用 (%d)'):format(#rv))
			for i, name in ipairs(rv) do
				local flags = (i > 1 and (i - 1) % COL_ROWS == 0) and MF_MENUBARBREAK or 0
				sub:item(name, function() pick_name(name) end, flags)
			end
		else
			names:disabled('最近使用 (无)')
		end

		local cur = kktrigger.get_localvar_names_current(lv_type) or {}
		if #cur > 0 then
			add_value_items(names:submenu(('当前触发器 (%d)'):format(#cur)), cur,
				function(e) pick_name(e.value) end)
		else
			names:disabled('当前触发器 (无)')
		end

		local freq = kktrigger.get_localvar_names_frequent(lv_type) or {}
		if #freq > 0 then
			local sub = names:submenu(('高频 (%d)'):format(#freq))
			for i, e in ipairs(freq) do
				local flags = (i > 1 and (i - 1) % COL_ROWS == 0) and MF_MENUBARBREAK or 0
				sub:item(('%s (%d)'):format(e.value, e.count or 0),
					function() pick_name(e.value) end, flags)
			end
		else
			names:disabled('高频 (无)')
		end
	end

	-- 局部变量读取: 把参数一键设为 "<读取函数>(变量名)"，引用已声明的同类型局部
	-- 变量。合并三个来源到一个「局部变量」子菜单: 真(KKAPI) 变量名直接显示，
	-- [逆天](YDWE) 变量名前追加 "[逆天]"。候选名按当前参数类型过滤。
	--   1. [逆天] 任意类型: YDWESetAnyTypeLocalVariable -> Get(name)
	--   2. 真 KKAPI:        KKAPISetLocalVariables      -> Get(name)
	--   3. [逆天] 按类型:   YDWESetLocalVariable<T>     -> YDWEGetLocalVariable<T>(name)
	do
		local ltype = base_type or tname
		-- 旧版 [逆天] 按类型命名的标量局部变量: base_type -> 函数名后缀。
		local YD_TYPED = {
			integer = 'Integer', real = 'Real', string = 'String', boolean = 'Boolean',
		}
		local function pick(get_func, name)
			kktrigger.set_param_function(disp, index, get_func, name)
		end
		local cur, freq = {}, {}
		local function add_src(list_cur, list_freq, get_func, prefix)
			for _, e in ipairs(list_cur or {}) do
				cur[#cur + 1] = { value = e.value, label = prefix .. e.value,
					sort = (e.sort or e.value), get_func = get_func }
			end
			for _, e in ipairs(list_freq or {}) do
				freq[#freq + 1] = { value = e.value, label = prefix .. e.value,
					count = e.count or 0, get_func = get_func }
			end
		end
		-- 1. [逆天] 任意类型
		add_src(kktrigger.get_local_reads_current(1, ltype),
			kktrigger.get_local_reads_frequent(1, ltype),
			'YDWEGetAnyTypeLocalVariable', '[逆天] ')
		-- 2. 真 KKAPI
		add_src(kktrigger.get_local_reads_current(2, ltype),
			kktrigger.get_local_reads_frequent(2, ltype),
			'KKAPIGetLocalVariables', '')
		-- 3. [逆天] 按类型标量
		local suffix = YD_TYPED[ltype]
		if suffix and kktrigger.get_typed_local_current then
			local setf = 'YDWESetLocalVariable' .. suffix
			local getf = 'YDWEGetLocalVariable' .. suffix
			add_src(kktrigger.get_typed_local_current(setf, 0),
				kktrigger.get_typed_local_frequent(setf, 0), getf, '')
		end
		if #cur > 0 or #freq > 0 then
			local root = menu:submenu('局部变量')
			if #cur > 0 then
				add_value_items(root:submenu(('当前触发器 (%d)'):format(#cur)), cur,
					function(e) pick(e.get_func, e.value) end)
			else
				root:disabled('当前触发器 (无)')
			end
			if #freq > 0 then
				table.sort(freq, function(a, b)
					if a.count ~= b.count then return a.count > b.count end
					return a.label < b.label
				end)
				local sub = root:submenu(('高频 (%d)'):format(#freq))
				for i, e in ipairs(freq) do
					local flags = (i > 1 and (i - 1) % COL_ROWS == 0) and MF_MENUBARBREAK or 0
					sub:item(('%s (%d)'):format(e.label, e.count or 0),
						function() pick(e.get_func, e.value) end, flags)
				end
			else
				root:disabled('高频 (无)')
			end
		end
	end

	-- 复制参数: 仅当参数已设置值(type_id >= 0)时可用，否则灰显。
	if tonumber(type_id) and tonumber(type_id) >= 0 then
		menu:item('复制参数', function()
			local ok, key = kktrigger.copy_param(disp, index)
			if not ok then gui.message(nil, '复制参数失败') end
		end)
	else
		menu:disabled('复制参数')
	end

	-- 在地形上选取 (placed-instance types only): drives WE's native "选择一个X"
	-- button so the user clicks an object on the terrain to reference its gg_ var.
	if PICK_OBJ_TYPES[tname] then
		menu:item('在地形上选取对象...', function()
			local ok, info = kktrigger.open_param_select_object(disp, index, tname)
			if not ok then gui.message(nil, '选取对象失败: ' .. tostring(info)) end
		end)
	end

	-- 粘贴参数: submenu of up to 10 recent copies for this type (newest first).
	local clips = kktrigger.get_param_clips(tname)
	if clips and #clips > 0 then
		local sub = menu:submenu(('粘贴参数 (%d)'):format(#clips))
		for i, c in ipairs(clips) do
			local slot = i - 1   -- 0-based, 0 = newest
			sub:item(('%d. %s'):format(i, c.label or ''), function()
				if not kktrigger.paste_param(disp, index, slot) then
					gui.message(nil, '粘贴参数失败')
				end
			end)
		end
	else
		menu:disabled('粘贴参数 (空)')
	end
	menu:separator()

	-- 预设值 (typeId 0). get_presets returns { key, label, sort }.
	local presets = kktrigger.get_presets(tname)
	if presets then for _, p in ipairs(presets) do p.value = p.key end end
	if presets and #presets > 0 then
		add_value_items(menu:submenu(('预设值 (%d)'):format(#presets)), presets, select_entry(0))
	else
		menu:disabled('预设值 (无)')
	end

	-- 最近使用 (object-editor objects, typeId 3 literal rawcode). For unit/item/
	-- destructable/doodad/ability/buff/upgrade code params; recorded as the user
	-- works in the object editor.
	local recent_objs = kktrigger.get_recent_objects(tname)
	if recent_objs and #recent_objs > 0 then
		local sub = menu:submenu(('最近使用 (%d)'):format(#recent_objs))
		for i, r in ipairs(recent_objs) do
			local flags = (i > 1 and (i - 1) % COL_ROWS == 0) and MF_MENUBARBREAK or 0
			sub:item(r.label or r.value, function() set_value(3, r.value) end, flags)
		end
	end

	-- 最近触发器 (typeId 1). Only for 'trigger'-type params: selecting one
	-- references that trigger's auto-generated gg_trg_ variable.
	if tname == 'trigger' then
		local rtrig = kktrigger.get_recent_triggers()
		if rtrig and #rtrig > 0 then
			local sub = menu:submenu(('最近触发器 (%d)'):format(#rtrig))
			for i, r in ipairs(rtrig) do
				local flags = (i > 1 and (i - 1) % COL_ROWS == 0) and MF_MENUBARBREAK or 0
				sub:item(r.label or r.value, function() set_value(1, r.value) end, flags)
			end
		end
	end

	-- 变量 (typeId 1). get_variables returns { name, label, sort, is_array }.
	-- Array variables route through the native dialog so WE allocates their
	-- index (arrayParam) sub-parameter; scalar variables are set in-place.
	local vars = kktrigger.get_variables(tname)
	if vars then
		for _, v in ipairs(vars) do
			v.value = v.name
			if v.is_array then v.label = (v.label or v.name) .. ' [...]' end
		end
	end
	if vars and #vars > 0 then
		add_value_items(menu:submenu(('变量 (%d)'):format(#vars)), vars, select_entry(1))
	else
		menu:disabled('变量 (无)')
	end

	-- 函数 (typeId 2). get_calls returns { name, display, category, sort }.
	-- 在函数名前加上所属分类(如 "[KKWE] - 技能")，并按分类分组排序，贴近原生弹窗。
	-- AnyGlobal/AnyType 参数(如设置变量的变量侧)只接受变量，不显示函数。
	if base_type ~= 'AnyGlobal' and base_type ~= 'AnyType' then
		local calls = kktrigger.get_calls(tname)
		if calls then
			for _, c in ipairs(calls) do
				c.value = c.name
				local disp = (c.display ~= '' and c.display) or c.name
				if c.category and c.category ~= '' then
					c.label = c.category .. ' - ' .. disp
					c.sort = py_cache[c.category] .. '\1' .. (c.sort or disp)
				else
					c.label = disp
				end
			end
		end
		if calls and #calls > 0 then
			add_value_items(menu:submenu(('函数 (%d)'):format(#calls)), calls, select_entry(2))
		else
			menu:disabled('函数 (无)')
		end
	end

	menu:track(x, y)
end

if kktrigger and kktrigger.set_param_menu_handler then
	local ok_h, installed = pcall(kktrigger.set_param_menu_handler, param_menu_handler)
	log.debug(('[parammenu] handler registered ok=%s hook=%s'):format(tostring(ok_h), tostring(installed)))
end
