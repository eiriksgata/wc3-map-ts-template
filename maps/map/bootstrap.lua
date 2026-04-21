-- Bootstrap script for loading TSTL output
-- Supports both dev (modular) and prod (bundled) modes


-- Debugging: Enable console output
local console = require("jass.console")


local ydcommon = require("jass.common")
local ydjapi = require("jass.japi")

-- register jass.common
for key, value in pairs(ydcommon) do
  _G[key] = value
end

-- register jass.japi
for key, value in pairs(ydjapi) do
  _G[key] = value
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
