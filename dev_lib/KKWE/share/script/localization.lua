require "util"
require "i18n"

local content = io.load(fs.ydwe_path() / "share" / "locale" / (i18n.languagename() .. ".yml"))
local lang = content and require('lyaml.init').load(content) or {}
function _(str)
    return lang[str] or str
end
