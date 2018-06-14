import { RabbitNetwork } from "./network/rabbit/rabbitNetwork"
// tslint:disable-next-line:no-var-requires
const printMessage = require("print-message")

export function showHelp() {
  const info = `hycon`
  printMessage([`hycon`], { border: true })
  printMessage([`--help               show help`], { border: false })
  printMessage([`--api                activate api, --api`], { border: false })
  printMessage([`--api_port           api port, --api_port=2442`], { border: false })
  printMessage([`--verbose            verbose print`], { border: false })
  printMessage([`mining`], { border: true })
  printMessage([`--minerAddress       set miner address`], { border: false })
  printMessage([`--cpuMiners          enable mining, 0=no mining, 1=use 1 cpu`], { border: false })
  printMessage([`network`], { border: true })
  printMessage([`--disable_upnp       turn off upnp`], { border: false })
  printMessage([`--disable_nat        turn off nat traversal`], { border: false })
  printMessage([`--networkid          set networkid, --networkid=hycon`], { border: false })
  printMessage([`--nonLocal           accept remote api connectiong, --nonLocal`], { border: false })
  printMessage([`--peer               add peer, --peer rapid1.hycon.io:8148`], { border: false })
  printMessage([`--port               main port, --port=8148`], { border: false })
  printMessage([`--str_port           stratum port, --str_port=9081`], { border: false })
  printMessage([`copyright            @2018 Team Hycon`], { border: true })
}
