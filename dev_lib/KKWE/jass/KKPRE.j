#ifndef KKPREINCLUDE
#define KKPREINCLUDE


library LBKKPRE

    native DzGetBuffBar                             takes nothing returns integer
    native DzGetBuffBarButton                       takes integer row, integer col returns integer
    native DzBuffBarResize                          takes integer row, integer col returns nothing
    native DzSetBuffBarShowDuplicatedBuff           takes boolean flag returns nothing
    native DzUnitAddBuff                            takes unit target, unit source, integer typeId, integer buffId, integer level, integer priority, real duration, real data1, real data2, real data3, real data4, real data5, real data6, real data7, real data8, real data9, real data10, real data11 returns boolean
    native DzUnitAddBuffBdet                        takes unit target, integer buffId, integer level, integer priority, real duration, player detectPlayer, integer detectType returns boolean
    native DzUnitAddBuffBUan                        takes unit target, integer buffId, integer level, integer priority, real duration, integer invulnerable returns boolean
    native DzUnitAddBuffBFig                        takes unit target, integer buffId, integer level, integer priority, real duration returns boolean
    native DzUnitAddBuffBEfn                        takes unit target, integer buffId, integer level, integer priority, real duration returns boolean
    native DzUnitAddBuffBhwd                        takes unit target, integer buffId, integer level, integer priority, real duration returns boolean
    native DzUnitAddBuffBplg                        takes unit target, integer buffId, integer level, integer priority, real duration returns boolean
    native DzUnitAddBuffBrai                        takes unit target, integer buffId, integer level, integer priority, real duration returns boolean
    native DzUnitAddBuffBHwe                        takes unit target, integer buffId, integer level, integer priority, real duration returns boolean
    native DzUnitAddBuffBTLF                        takes unit target, integer buffId, integer level, integer priority, real duration returns boolean
    native DzUnitAddBuffBdef                        takes unit target, integer buffId, integer level, integer priority, real duration, real armor returns boolean
    native DzUnitAddBuffBdig                        takes unit target, unit source, integer buffId, integer level, integer priority, real duration, real dps returns boolean
    native DzUnitAddBuffBHds                        takes unit target, integer buffId, integer level, integer priority, real duration returns boolean
    native DzUnitAddBuffBNdo                        takes unit target, unit source, integer buffId, integer level, integer priority, real duration, real dps, player owner, integer unitId, integer count, real lifeTime, integer summonBuffId returns boolean
    native DzUnitAddBuffBNdi                        takes unit target, integer buffId, integer level, integer priority, real duration returns boolean
    native DzUnitAddBuffBNdh                        takes unit target, unit source, integer buffId, integer level, integer priority, real duration, real moveSpeed, real attackSpeed, integer disableType, real missChance returns boolean
    native DzUnitAddBuffBOeq                        takes unit target, unit source, integer buffId, integer level, integer priority, real duration, real moveSpeed, real attackSpeed returns boolean
    native DzUnitAddBuffBeat                        takes unit target, integer buffId, integer level, integer priority, real duration, real health, real mana returns boolean
    native DzUnitAddBuffBgra                        takes unit target, integer buffId, integer level, integer priority, real duration, integer attackCount, integer disableWeapon, integer enableWeapon, integer treeId returns boolean
    native DzUnitAddBuffBena                        takes unit target, unit source, integer buffId, integer level, integer priority, real duration, player owner, real fallTime, real height, real meleeRange returns boolean
    native DzUnitAddBuffBeng                        takes unit target, unit source, integer buffId, integer level, integer priority, real duration, player owner, real fallTime, real height, real meleeRange returns boolean
    native DzUnitAddBuffBwea                        takes unit target, unit source, integer buffId, integer level, integer priority, real duration, player owner, real fallTime, real height, real meleeRange returns boolean
    native DzUnitAddBuffBweb                        takes unit target, unit source, integer buffId, integer level, integer priority, real duration, player owner, real fallTime, real height, real meleeRange returns boolean
    native DzUnitAddBuffBEer                        takes unit target, unit source, integer buffId, integer level, integer priority, real duration, real dps returns boolean
    native DzUnitAddBuffBcrsV2                      takes unit target, unit source, integer buffId, integer level, integer priority, real duration, real missChance returns boolean
    native DzUnitAddBuffBeye                        takes unit target, integer buffId, integer level, integer priority, real duration returns boolean
    native DzUnitAddBuffBfae                        takes unit target, integer buffId, integer level, integer priority, real duration, player owner, real armorReduce returns boolean
    native DzUnitAddBuffBshs                        takes unit target, integer buffId, integer level, integer priority, real duration, player owner returns boolean
    native DzUnitAddBuffBNlm                        takes unit target, integer buffId, integer level, integer priority, real duration, integer splitCount, real splitDelay, integer attackNeeded, real healthBonus, real lifeTimeBonus, integer maxCount, integer remainingCount, real distance returns boolean
    native DzUnitAddBuffBNso                        takes unit target, unit source, integer buffId, integer level, integer priority, real duration, real damage, real interval, real moveSpeedReduce, real attackSpeedReduce, real attackReduce returns boolean
    native DzUnitAddBuffBPSE                        takes unit target, unit source, integer buffId, integer level, integer priority, real duration returns boolean
    native DzUnitAddBuffBHfa                        takes unit target, integer buffId, integer level, integer priority, real duration, real damage returns boolean
    native DzUnitAddBuffBUfa                        takes unit target, integer buffId, integer level, integer priority, real duration, real debuffDuration, real armor returns boolean
    native DzUnitAddBuffBfro                        takes unit target, unit source, integer buffId, integer level, integer priority, real duration, real moveSpeed, real attackSpeed returns boolean
    native DzUnitAddBuffBOhx                        takes unit target, unit source, integer buffId, integer level, integer priority, real duration, integer unitId returns boolean
    native DzUnitAddBuffBNht                        takes unit target, integer buffId, integer level, integer priority, real duration, real damageIncrease, real armor, real healthRegen, real manaRegen returns boolean
    native DzUnitAddBuffBprg                        takes unit target, unit source, integer buffId, integer level, integer priority, real duration, real moveSpeedUpdateCount, real attackSpeedUpdateCount, real pauseDuration, real heroPauseDuration returns boolean
    native DzUnitAddBuffBhea                        takes unit target, unit source, integer buffId, integer level, integer priority, real duration returns boolean
    native DzUnitAddBuffBrej                        takes unit target, integer buffId, integer level, integer priority, real duration, real health, real mana returns boolean
    native DzUnitAddBuffBIrm                        takes unit target, integer buffId, integer level, integer priority, real duration, real mana, integer dispel returns boolean
    native DzUnitAddBuffBIrl                        takes unit target, integer buffId, integer level, integer priority, real duration, real health, integer dispel returns boolean
    native DzUnitAddBuffBIrg                        takes unit target, integer buffId, integer level, integer priority, real duration, real health, real mana, integer dispel returns boolean
    native DzUnitAddBuffBfre                        takes unit target, unit source, integer buffId, integer level, integer priority, real duration, integer mirrorImage returns boolean
    native DzUnitAddBuffBIcb                        takes unit target, integer buffId, integer level, integer priority, real duration, real armorReduce returns boolean
    native DzUnitAddBuffBIrb                        takes unit target, integer buffId, integer level, integer priority, real duration returns boolean
    native DzUnitAddBuffBIpv                        takes unit target, integer buffId, integer level, integer priority, real duration, real lifeSteal, real damageBonus returns boolean
    native DzUnitAddBuffBUcb                        takes unit target, unit source, integer buffId, integer level, integer priority, real duration returns boolean
    native DzUnitAddBuffBEia                        takes unit target, integer buffId, integer level, integer priority, real duration, real damage returns boolean
    native DzUnitAddBuffBEim                        takes unit target, integer buffId, integer level, integer priority, real duration, real manaCost, real interval, real area, real damage, integer targetFlags, player owner returns boolean
    native DzUnitAddBuffBNpi                        takes unit target, integer buffId, integer level, integer priority, real duration, real manaCost, real interval, real area, real damage, integer targetFlags, player owner returns boolean
    native DzUnitAddBuffBpig                        takes unit target, integer buffId, integer level, integer priority, real duration, real manaCost, real interval, real area, real damage, integer targetFlags, player owner returns boolean
    native DzUnitAddBuffBIcf                        takes unit target, integer buffId, integer level, integer priority, real duration, real manaCost, real interval, real area, real damage, integer targetFlags, player owner returns boolean

    native DzStartManageInventory                   takes integer maxSize returns boolean
    native DzSetInventoryHotkey                     takes integer slot, string hotkey returns boolean
    native DzGetInventoryMaxSize                    takes nothing returns integer
    native DzGetInventoryDropSlotOrderID            takes integer slot returns integer
    native DzGetInventoryUseSlotOrderID             takes integer slot returns integer
    native DzGetInventoryBarButton                  takes integer slot returns integer
    native DzTriggerRegisterPlayerUnitSwapItemSlotEvent takes trigger whichTrigger, player whichPlayer returns event
    native DzGetSwapItemSlotEventFromSlotID         takes nothing returns integer
    native DzGetSwapItemSlotEventToSlotID           takes nothing returns integer

    native DzUnitAddBuffBUim                        takes unit target, unit source, integer buffId, integer level, integer priority, real duration, real data1, real data2 returns boolean
    native DzUnitAddBuffBNin                        takes unit target, unit source, integer buffId, integer level, integer priority, real duration, real data1, real data2 returns boolean
    native DzUnitAddBuffBinf                        takes unit target, integer buffId, integer level, integer priority, real duration, real data1, real data2, real data3, real data4 returns boolean
    native DzUnitAddBuffBinv                        takes unit target, integer buffId, integer level, integer priority, real duration, real data1 returns boolean
    native DzUnitAddBuffBvul                        takes unit target, integer buffId, integer level, integer priority, real duration returns boolean
    native DzUnitAddBuffBlsh                        takes unit target, integer buffId, integer level, integer priority, real duration, real data1, real data2, real data3 returns boolean
    native DzUnitAddBuffBlshV2                      takes unit target, integer buffId, integer level, integer priority, real duration, real data1, real data2, real data3, integer data4, player owner returns boolean
    native DzUnitAddBuffBams                        takes unit target, integer buffId, integer level, integer priority, real duration returns boolean
    native DzUnitAddBuffBam2                        takes unit target, integer buffId, integer level, integer priority, real duration, real data1 returns boolean
    native DzUnitAddBuffBmfl                        takes unit target, integer buffId, integer level, integer priority, real duration, real data1, real data2, real data3, real data4, real data5, real data6, real data7, integer data8, integer data9, integer data10 returns boolean
    native DzUnitAddBuffBNms                        takes unit target, integer buffId, integer level, integer priority, real duration, real data1, real data2 returns boolean
    native DzUnitAddBuffBOmi                        takes unit target, unit source, integer buffId, integer level, integer priority, real duration, real data1, real data2 returns boolean
    native DzUnitAddBuffBIil                        takes unit target, unit source, integer buffId, integer level, integer priority, real duration, real data1, real data2 returns boolean
    native DzUnitAddBuffBNpa                        takes unit target, integer buffId, integer level, integer priority, real duration, real data1, real data2, real data3, integer data4, integer data5, integer data6, real data7, player owner, integer data8 returns boolean
    native DzUnitAddBuffBNpm                        takes unit target, integer buffId, integer level, integer priority, real duration returns boolean
    native DzUnitAddBuffBpsh                        takes unit target, unit source, integer buffId, integer level, integer priority, real duration returns boolean
    native DzUnitAddBuffBply                        takes unit target, unit source, integer buffId, integer level, integer priority, real duration, integer data1 returns boolean
    native DzUnitAddBuffBNsa                        takes unit target, integer buffId, integer level, integer priority, real duration, real data1, real data2, real data3 returns boolean
    native DzUnitAddBuffBHtc                        takes unit target, unit source, integer buffId, integer level, integer priority, real duration, real data1, real data2 returns boolean
    native DzUnitAddBuffBCtc                        takes unit target, unit source, integer buffId, integer level, integer priority, real duration, real data1, real data2 returns boolean
    native DzUnitAddBuffBNfy                        takes unit target, integer buffId, integer level, integer priority, real duration, real data1, integer data2, real data3, integer data4, real data5, real data6 returns boolean
    native DzUnitAddBuffBNcg                        takes unit target, unit source, integer buffId, integer level, integer priority, real duration, real data1, real data2, real data3 returns boolean
    native DzUnitAddBuffBNto                        takes unit target, integer buffId, integer level, integer priority, real duration returns boolean
    native DzUnitAddBuffBuhf                        takes unit target, unit source, integer buffId, integer level, integer priority, real duration, real data1, real data2 returns boolean
    native DzUnitAddBuffBuns                        takes unit target, unit source, integer buffId, integer level, integer priority, real duration, real data1, real data2 returns boolean
    native DzUnitAddBuffBOvc                        takes unit target, integer buffId, integer level, integer priority, real duration returns boolean
    native DzUnitAddBuffBOvd                        takes unit target, integer buffId, integer level, integer priority, real duration returns boolean
    native DzUnitAddBuffBOwd                        takes unit target, integer buffId, integer level, integer priority, real duration returns boolean
    native DzUnitAddBuffBImo                        takes unit target, integer buffId, integer level, integer priority, real duration, real data1, real data2, real data3 returns boolean
    native DzUnitAddBuffBNwm                        takes unit target, integer buffId, integer level, integer priority, real duration returns boolean
    native DzUnitAddBuffBmec                        takes unit target, integer buffId, integer level, integer priority, real duration returns boolean
    native DzUnitAddBuffBNsg                        takes unit target, integer buffId, integer level, integer priority, real duration returns boolean
    native DzUnitAddBuffBNsq                        takes unit target, integer buffId, integer level, integer priority, real duration returns boolean
    native DzUnitAddBuffBNsw                        takes unit target, integer buffId, integer level, integer priority, real duration returns boolean
    native DzUnitAddBuffBOwk                        takes unit target, integer buffId, integer level, integer priority, real duration, real data1, real data2, real data3, integer data4 returns boolean
    native DzUnitAddBuffBfrz                        takes unit target, unit source, integer buffId, integer level, integer priority, real duration returns boolean
    native DzUnitAddBuffBliq                        takes unit target, unit source, integer buffId, integer level, integer priority, real duration, real data1, real data2, real data3, integer data4 returns boolean
    native DzUnitAddBuffBNab                        takes unit target, unit source, integer buffId, integer level, integer priority, real duration, real data1, real data2, real data3, real data4, real data5 returns boolean
    native DzUnitAddBuffBNsl                        takes unit target, unit source, integer buffId, integer level, integer priority, real duration returns boolean
    native DzUnitAddBuffBHbn                        takes unit target, unit source, integer buffId, integer level, integer priority, real duration, real data1, real data2 returns boolean
    native DzUnitAddBuffBbsk                        takes unit target, unit source, integer buffId, integer level, integer priority, real duration, real data1, real data2, real data3 returns boolean
    native DzUnitAddBuffBNdm                        takes unit target, integer buffId, integer level, integer priority, real duration returns boolean
    native DzUnitAddBuffBNba                        takes unit target, unit source, integer buffId, integer level, integer priority, real duration, player owner, integer data1, integer data2, real data3, integer data4 returns boolean
    native DzUnitAddBuffBNrd                        takes unit target, unit source, integer buffId, integer level, integer priority, real duration, real data1 returns boolean
    native DzUnitAddBuffBblo                        takes unit target, unit source, integer buffId, integer level, integer priority, real duration, real data1, real data2, real data3 returns boolean
    native DzUnitAddBuffBfzy                        takes unit target, unit source, integer buffId, integer level, integer priority, real duration, real data1, real data2, real data3 returns boolean
    native DzUnitAddBuffBNbf                        takes unit target, unit source, integer buffId, integer level, integer priority, real duration, real data1 returns boolean
    native DzUnitAddBuffBCbf                        takes unit target, unit source, integer buffId, integer level, integer priority, real duration, real data1 returns boolean
    native DzUnitAddBuffBpos                        takes unit target, unit source, integer buffId, integer level, integer priority, real duration, integer data1, integer data2 returns boolean
    native DzUnitAddBuffBpoc                        takes unit target, integer buffId, integer level, integer priority, real duration returns boolean
    native DzUnitAddBuffBcmg                        takes unit target, integer buffId, integer level, integer priority, real duration returns boolean
    native DzUnitAddBuffBclf                        takes unit target, unit source, integer buffId, integer level, integer priority, real duration, real data1, real data2, integer data3, real data4 returns boolean

    native DzSetUnitAbilityDataF                    takes unit Unit, integer abil_code, real value returns boolean
    native DzGetUnitAbilityDataF                    takes unit Unit, integer abil_code returns real
    native DzSetUnitAbilityDataG                    takes unit Unit, integer abil_code, real value returns boolean
    native DzGetUnitAbilityDataG                    takes unit Unit, integer abil_code returns real
    native DzSetUnitAbilityDataH                    takes unit Unit, integer abil_code, real value returns boolean
    native DzGetUnitAbilityDataH                    takes unit Unit, integer abil_code returns real
    native DzSetUnitAbilityDataI                    takes unit Unit, integer abil_code, real value returns boolean
    native DzGetUnitAbilityDataI                    takes unit Unit, integer abil_code returns real


endlibrary

#endif
