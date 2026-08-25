-- Bootstrap script for loading TSTL output
-- Supports both dev (modular) and prod (bundled) modes


-- Debugging: Enable console output
local console = require("jass.console")


local function try_require(name)
  local ok, mod = pcall(require, name)
  if ok and type(mod) == "table" then
    return mod
  end
  return nil
end

local function copy_module_to_g(mod, overwrite)
  if type(mod) ~= "table" then
    return
  end
  for key, value in pairs(mod) do
    if overwrite or _G[key] == nil then
      _G[key] = value
    end
  end
end

local ydcommon = require("jass.common")
local ydjapi = require("jass.japi")

-- register jass.common natives
copy_module_to_g(ydcommon, true)

-- register jass.japi
copy_module_to_g(ydjapi, true)

-- BJ / blizzard.j: JASS InitBlizzard() does not put these on Lua _G.
-- KKWE yd_lua_engine exposes script functions as jass.code (no jass.blizzard).
-- Try YDWE-style names first, then KKWE's jass.code.
local bj_source
local bj_funcs
do
  local candidates = { "jass.blizzard", "blizzard", "jass.code" }
  for i = 1, #candidates do
    local mod = try_require(candidates[i])
    if mod then
      bj_source = candidates[i]
      bj_funcs = mod
      copy_module_to_g(mod, false)
      print(">>> Bootstrap: registered BJ functions from " .. bj_source)
      break
    end
  end
  if not bj_funcs then
    print(">>> Bootstrap: WARNING no BJ module (tried jass.blizzard / blizzard / jass.code)")
  end
end

-- BJ globals (bj_FORCE_ALL_PLAYERS, bj_lastCreatedUnit, ...). war3map.j already
-- called InitBlizzard() so these exist in the JASS VM.
local ydglobals = try_require("jass.globals")
if ydglobals then
  copy_module_to_g(ydglobals, false)
end

-- jass.code / jass.globals are often empty tables with __index (and maybe __pairs).
-- Keep a _G fallback so TSTL global calls still resolve if pairs() copied nothing.
do
  local mt = getmetatable(_G)
  if mt == nil then
    mt = {}
    setmetatable(_G, mt)
  end
  local prev_index = mt.__index
  local prev_newindex = mt.__newindex
  mt.__index = function(t, key)
    if bj_funcs ~= nil then
      local v = bj_funcs[key]
      if v ~= nil then
        return v
      end
    end
    if ydglobals ~= nil then
      local v = ydglobals[key]
      if v ~= nil then
        return v
      end
    end
    if prev_index ~= nil then
      if type(prev_index) == "function" then
        return prev_index(t, key)
      end
      return prev_index[key]
    end
  end
  mt.__newindex = function(t, key, value)
    -- Only known JASS names go to the VM. Writing every new _G key into
    -- jass.globals, then reading it back, native-crashes on load (handle_ref
    -- / skipped rawset). Lua-only names must still land on _G.
    if ydglobals ~= nil and type(key) == "string" then
      local p3 = string.sub(key, 1, 3)
      if p3 == "bj_" or p3 == "gg_" or string.sub(key, 1, 4) == "udg_" then
        ydglobals[key] = value
        return
      end
    end
    if type(prev_newindex) == "function" then
      prev_newindex(t, key, value)
      return
    end
    rawset(t, key, value)
  end
end

-- Re-running InitBlizzard leaks timers/forces/rects. Skip when JASS already did it.
do
  local already = nil
  if ydglobals ~= nil then
    already = ydglobals.bj_FORCE_ALL_PLAYERS or ydglobals.bj_mapInitialPlayableArea
  end
  if already == nil then
    already = _G.bj_FORCE_ALL_PLAYERS or _G.bj_mapInitialPlayableArea
  end
  if already == nil then
    local init = _G.InitBlizzard
    if type(init) ~= "function" and bj_funcs ~= nil then
      init = bj_funcs.InitBlizzard
    end
    if type(init) == "function" then
      print(">>> Bootstrap: InitBlizzard() from Lua (JASS globals were nil)")
      init()
    end
  end
end

-- 自动检测模式：如果存在 PROJECT_PATH 则为 dev 模式，否则为 prod 模式
local main
if PROJECT_PATH then
  -- Dev mode: 使用模块化加载
  print(">>> Bootstrap: Dev mode detected")
  main = require("src.main")
  console.enable = true;
else
  -- Prod mode: 使用打包后的单文件
  print(">>> Bootstrap: Prod mode detected")
  main = require("main")
end

-- Initialize the application
if main and main.initialize then
  main.initialize()
else
  print("ERROR: Failed to load main module or initialize function not found")
end
-- do
--   local ffi = require('ffi')

--   ffi.cdef [[
--       void* GetModuleHandleA(const char* lpModuleName);
--   ]]

--   local game = tonumber(ffi.cast('int', ffi.C.GetModuleHandleA('Game.dll')))

--   -- false: low overhead (function-call trace), true: precise line trace
--   local TRACE_LINE_MODE = false
--   local last_lua_site = 'unknown'
--   local last_lua_name = 'unknown'

--   local function fmt_hex(n)
--       if not n then
--           return 'nil'
--       end
--       if n < 0 then
--           n = n + 0x100000000
--       end
--       return string.format('0x%08X', n)
--   end

--   local function log_line(key, value)
--       print(key .. ': ' .. tostring(value))
--   end

--   local function update_last_site(level, line)
--       local info = debug.getinfo(level, 'nSl')
--       if not info then
--           return
--       end
--       local src = info.short_src or info.source or 'unknown'
--       if not src:match('%.lua') then
--           return
--       end
--       local ln = line or info.currentline or -1
--       last_lua_site = string.format('%s:%d', src, ln)
--       last_lua_name = info.name or '<anonymous>'
--   end

--   if TRACE_LINE_MODE then
--       debug.sethook(function(_, line)
--           -- level=3: hook -> anonymous callback -> real user frame
--           update_last_site(3, line)
--       end, 'l')
--   else
--       debug.sethook(function(event)
--           if event ~= 'call' then
--               return
--           end
--           -- level=3: hook -> anonymous callback -> real user frame
--           update_last_site(3)
--       end, 'c')
--   end

--   require('jass.console').enable = true
--   require('jass.runtime').error_handle = function(msg)
--       -- Example:
--       -- 0xC0000005 (ACCESS_VIOLATION) at 0023:6AB627C7 : error 132: FATAL ERROR!
--       local msg_str = tostring(msg or '')
--       local code_hex = msg_str:match('^(0x[%x]+)')
--       local address = tonumber(msg_str:match('at %x+:([%x]+)'), 16)
--       local offset = address and (address - game) or nil

--       print('==== crash report begin ====')
--       log_line('raw', msg_str)
--       log_line('exception', code_hex or 'unknown')
--       log_line('address', fmt_hex(address) .. ' dec=' .. tostring(address or -1))
--       log_line('game base', fmt_hex(game))
--       log_line('offset', fmt_hex(offset) .. ' dec=' .. tostring(offset or -1))
--       log_line('last lua site', last_lua_site)
--       log_line('last lua func', last_lua_name)
--       print(debug.traceback())

--       log_line('known offsets', fmt_hex(0x2227C7) .. ', ' .. fmt_hex(0x509F99))
--       if address == game + 0x2227C7 then
--           print('没有定义定时器函数')
--       elseif address == game + 0x509F99 then
--           print('给非英雄单位使用属性书')
--       else
--           print('未知崩溃点，请把 offset 加入映射表。')
--       end
--       print('==== crash report end ====')
--   end

--   local jass = require('jass.common')
--   local code = require('jass.code')

--   local trg = jass.CreateTrigger()
--   jass.TriggerRegisterPlayerChatEvent(trg, jass.GetLocalPlayer(), '', true)
--   jass.TriggerAddAction(trg, function()
--       local text = jass.GetEventPlayerChatString()
--       if text == '1' then
--           jass.ResumeTimer(jass.CreateTimer())
--           -- Game.dll+2227C7 - 8B 50 24 - mov edx,[eax+24]
--       elseif text == '2' then
--           local u = jass.CreateUnit(jass.Player(0), string.unpack('>I4', 'hpea'), 0.00, 0.00, 270)
--           if u then
--               jass.UnitAddAbility(u, string.unpack('>I4', 'AInv'))
--               code.UnitAddItemByIdSwapped(string.unpack('>I4', 'tpow'), u)
--               -- Game.dll+509F99 - 01 86 A8000000 - add [esi+000000A8],eax
--           end
--       end
--   end)

--   return {}
-- end
