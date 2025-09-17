// runtime必须首先加载
import { env } from "./runtime";
// 加载地图代码
import { mapInit } from "./map/start";

env()

// 调用mapInit,
mapInit()