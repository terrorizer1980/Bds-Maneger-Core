function date(fu) {
    var today = new Date();
    if (fu == 'year') {    
        return `${today.getFullYear()}`
    } else if (fu == 'day') {
        return `${String(today.getDate()).padStart(2, '0')}`
    }else if (fu == 'month') {
        return `${String(today.getMonth() + 1).padStart(2, '0')}`
    } else if (fu == 'hour'){
        return `${today.getHours()}_${today.getMinutes()}`
    } else {
        return `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`
    };
}

function Storage(){
    var LocalStorage = require('node-localstorage').LocalStorage;
    return new LocalStorage(`${require('./').api_dir}/Local_Storage`);
};
if (process.argv[0].includes('electron')){
    var electron_de = true;
} else if (process.argv[0].includes('node')){
    // console.error('Use o Electron, o Node não é totalmente suportado');
    var electron_de = undefined;
} else {
    var electron_de = false;
}
// This script server to forcefully kill old servers without being stopped before closing the application or having reloaded the page, an alternative and safer way is being sought.var
if (process.platform == 'win32') {
    var home = process.env.USERPROFILE.replaceAll('\\', '/');
    var server_dir = `${home}/bds_Server`;
    var cache_dir = `${home}/AppData/Roaming/${require(process.cwd()+'/package.json').name}\\`
    var log_file = `${server_dir}/${date()}_Bds_log.log`
    var log_date = `${date()}`
    var system = `windows`;
} else if (process.platform == 'linux') {
    var home = process.env.HOME;
    var server_dir = `${home}/bds_Server`;
    var cache_dir = `${home}/.config/${require(process.cwd() + '/package.json').name}/`
    var log_file = `${server_dir}/${date()}_Bds_log.log`
    var log_date = `${date()}`
    var system = `linux`;
} else if (process.platform == 'darwin') {
    require("open")("https://github.com/Sirherobrine23/Bds_Maneger/wiki/systems-support#a-message-for-mac-os-users")
    console.error('Please use Windows or Linux MacOS Not yet supported')
    process.exit(1984)
} else {
    console.log(`Please use an operating system (OS) compatible with Minecraft Bedrock Server ${process.platform} is not supported`);
    process.exit(2)
}
function telegram_tokenv1(){
    if (require("fs").existsSync(`${server_dir}/token.txt`)){
        return require("fs").readFileSync(`${server_dir}/token.txt`, "utf-8").replaceAll('\n', '');
    } else {
        return null;
    };
};
// 
// Module export
/* Variaveis */
module.exports.Storage = Storage
module.exports.token = telegram_tokenv1()
module.exports.home = home
module.exports.system = system
module.exports.server_dir = server_dir
module.exports.electron = electron_de
module.exports.api_dir = cache_dir
module.exports.log_file = log_file
module.exports.log_date = log_date
module.exports.bds_latest = require("./Services/versions").bds_latest()

/* Commands server */
module.exports.detect = require("./Services/detect_bds").bds_detect
module.exports.get_version = require("./Services/versions").bds_version_get
module.exports.telegram = require("./Services/telegram/telegram_bot")
module.exports.start = require('./Services/start').Server_start
module.exports.stop = require('./Services/stop').Server_stop
module.exports.date = date
module.exports.command = require('./Services/command').command
module.exports.backup = require("./Services/backup").World_BAckup
module.exports.kill = require("./Services/kill").bds_kill
module.exports.version_Download = require("./Services/download").DownloadBDS
module.exports.set_config = require("./Services/bds_settings").config
module.exports.get_config = require("./Services/bds_settings").get_config
module.exports.config_example = require("./Services/bds_settings").config_example