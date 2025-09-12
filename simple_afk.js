// simple_afk.js
const mineflayer = require('mineflayer')
const { pathfinder } = require('mineflayer-pathfinder')
const fs = require('fs')

// ========== 配置 ==========
const CONFIG = {
  host: '2b2t.xin',
  port: 25565,
  username: 'AFK_Bot',
  // password: '正版密码',
  version: '1.20.1',
  logFile: './afk.log'
}
// ==========================

function log(msg) {
  const line = `[${new Date().toLocaleString()}] ${msg}`
  console.log(line)
  fs.appendFileSync(CONFIG.logFile, line + '\n')
}

function createBot() {
  const bot = mineflayer.createBot({
    host: CONFIG.host,
    port: CONFIG.port,
    username: CONFIG.username,
    password: CONFIG.password,
    version: CONFIG.version
  })

  bot.loadPlugin(pathfinder)

  // 只吃附魔金苹果
  function eatEnchantedGoldenApple() {
    const item = bot.inventory.items().find(i => i.name === 'enchanted_golden_apple')
    if (!item) return // 没有就什么都不做
    bot.equip(item, 'hand', () => {
      bot.activateItem()
      setTimeout(() => bot.deactivateItem(), 1500)
      log(`已吃附魔金苹果`)
    })
  }

  bot.on('spawn', () => log('机器人已上线'))
  bot.on('death', () => {
    log('死亡，5 秒后重生')
    setTimeout(() => bot.respawn(), 5000)
  })

  bot.on('health', () => {
    const hp = bot.health
    const food = bot.food
    log(`血量 ${hp.toFixed(1)} 饥饿 ${food}`)

    if (hp <= 1) {
      log('血量 1，主动退出')
      bot.quit()
      return
    }
    if (hp <= 10) eatEnchantedGoldenApple()
  })

  bot.on('kicked', r => log(`被踢：${r}`))
  bot.on('error', e => log(`错误：${e.message}`))
  bot.on('end', () => {
    log('断开，60 秒后重连')
    setTimeout(createBot, 60 * 1000)
  })

  process.on('SIGINT', () => {
    log('Ctrl+C 安全退出')
    bot.quit()
    process.exit()
  })
}

log('启动极简挂机')
createBot()
