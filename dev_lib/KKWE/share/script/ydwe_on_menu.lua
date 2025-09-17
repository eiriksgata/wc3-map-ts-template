

-- 主窗口句柄
local main_window_handle = nil

-- 启动配置对话框
local function launch_config()
	local config_program = fs.ydwe_path() / "bin" / "YDWEConfig.exe"
	local command_line = string.format('"%s"', config_program:string())
	sys.spawn(command_line, fs.ydwe_path())
end

-- 启动魔兽
local function launch_warcraft3()
	local config_program = fs.ydwe_path() / "bin" / "YDWEConfig.exe"
	local command_line = string.format('"%s" -launchwar3', config_program:string())     
	sys.spawn(command_line, fs.ydwe_path())
end

-- 显示最近一次编译错误
local function show_last_error()
	local jasshelper_path = fs.ydwe_path() / "plugin" / "jasshelper" / "jasshelper.exe"
	local command_line = string.format('"%s" --showerrors', jasshelper_path:string())
	sys.spawn(command_line, fs.ydwe_path())
end

-- 显示JassHelper版本
local function show_jasshelper_version()
	local jasshelper_path = fs.ydwe_path() / "plugin" / "jasshelper" / "jasshelper.exe"
	local command_line = string.format('"%s" --about', jasshelper_path:string())
	sys.spawn(command_line, fs.ydwe_path())
end

-- 显示cJass版本
local function show_cjass_version()
	local cjass_path = fs.ydwe_path() / "plugin" / "AdicHelper" / "AdicHelper.exe"
	local command_line = cjass_path:string()
	sys.spawn(command_line, fs.ydwe_path())
end

local function open_web_view(url, w, h)
    local exe = fs.ydwe_path() / "bin" / "WebView.exe"
    local command_line = string.format('"%s" %s %s %s', exe:string(), url, w, h)
	sys.spawn(command_line, fs.ydwe_path() / "bin")
end

-- 打开平台官网
local function open_platform_site()
	sys.spawn('explorer "https://www.reckfeng.com/"')
end

-- 打开开发者平台
local function open_authors_home_site()
	sys.spawn('explorer "https://create.reckfeng.com/"')
end

-- 打开反馈
local function open_feedback_site()
    open_web_view("https://create.reckfeng.com/feedback/", 640, 560)
end

local function crypt_map_jass()
    if gui.yesno_message(nil, _("Test function! Encrypted jass script, please choose a map file")) then
        log.trace("open crypt map")
        local exe = fs.ydwe_path() / "bin" / "YDWEConfig.exe"
        local command_line = string.format('"%s" -launchdump', exe:string())
        sys.spawn(command_line, fs.ydwe_path())
    end
end

local function open_notice(first)
    local host
    local target
    local env = http.env()
    if env == 'release' then
        host = 'https://create-api.reckfeng.com'
        target = 'https://create.reckfeng.com/wenotice'
    elseif env == 'dev' then
        host = 'https://dev-create-api-up5.ot.netease.com'
        target = 'https://dev-up5-create.reckfeng.com/wenotice'
    else
        host = 'https://qa-up5-create-api.reckfeng.com'
        target = 'https://qa-up5-create.reckfeng.com/wenotice'
    end

    local ok, content = http.get(host, '/action/remote/war3Editor/notice')
    log.trace('get notice: ' .. tostring(ok))
    if ok then
        if content:find('noticeType') then
            log.trace('Show notice window')
            open_web_view(target, 800, 600)
            return
        else
            log.trace('No notice')
        end
    end
    if not first then
        gui.message(nil, _("No announcement"))
    end
end

-- Lua测试
local function lua_test()
	-- 打开对话框让用户输入
	local ok, script_string = gui.prompt_for_input(
		main_window_handle, 													-- 父窗口句柄
		_("Lua Test"),															-- 标题栏
		_("Please enter the lua script to execute"),							-- 提示语句
		"",																		-- 文本编辑区初始文字
		_("OK"),																-- “确定”按钮文本
		_("Cancel")																-- “取消"按钮文本
	)

	if ok then
		log.trace("Execute code: " .. script_string)
		local code = load(script_string)
		if code then
			local ok, result = pcall(code)
			if ok then
				log.trace("Code execution OK. Result: " .. tostring(result))
			else
				gui.error_message(nil, _("Error occured when executing code: ") .. tostring(result))
				log.warn("Code execution failed. Error: " .. tostring(result))
			end
		else
			gui.error_message(nil, _("There are syntax errors in your code."))
			log.warn("Syntax error found in the code.")
		end
	end
end

-- 初始化菜单
-- event_data - 事件参数，table，包含以下值
--	main_window_handle - 主窗口的handle
--	main_menu_handle - 主菜单的handle
-- 返回值：一律返回0
function event.EVENT_INIT_MENU(event_data)
	log.debug("********************* on menuinit start *********************")
    log.debug("Env:", http.env())

	-- 处理一下Tile Limit Breaker插件
	if plugin then
		if plugin.loaders['YDTileLimitBreaker'] and plugin.loaders['YDTileLimitBreaker'].start then
			plugin.loaders['YDTileLimitBreaker'].start()
		end
	end

	local menu = gui.menu(event_data.main_menu_handle, _("&YDWE"))
	menu:add(_("YDWE &Config"), launch_config)
	menu:add(_("Launch &Warcraft3"), launch_warcraft3)
	menu:add(_("Show las&t compile result"), show_last_error)
	menu:add(_("Show J&assHelper version"), show_jasshelper_version)
	menu:add(_("Show c&Jass version"), show_cjass_version)
	menu:add(_("&Lua Test"), lua_test)
	local menu2 = gui.menu(event_data.main_menu_handle, _("&Platform"))
	menu2:add(_("&Crypt map script"), crypt_map_jass)
	menu2:add(_("Launch Platform &official website"), open_platform_site)
	menu2:add(_("Launch Author's &Home"), open_authors_home_site)
	menu2:add(_("Cre&dits"), show_credit)
	local menu3 = gui.menu(event_data.main_menu_handle, _("&Feedback"))
	menu3:add(_("&Feedback"), open_feedback_site)
	menu3:add(_("&Notice"), open_notice)

	main_window_handle = event_data.main_window_handle

	log.debug("********************* on menuinit end *********************")

    if http.env() ~= 'dev' then
        open_notice(true)
    end

	return 0
end
