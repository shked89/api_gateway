const log = (... data) => {
	console.log('log(): ' + data)
}

log.i = (info) => {
	console.log('\x1b[96m%s\x1b[0m', 'log.i(): ' + info)
}


log.endpoint = (info) => {
	console.log('\x1b[96m%s\x1b[0m', 'log.endpoint(): ' + info)
}

log.e = (error) => {
	console.error('\x1b[93m%s\x1b[0m', 'log.e(): ' + error)
}

log.critical = (criticalError) => {
	console.error('\x1b[91m%s\x1b[0m', 'log.critical(): ' + criticalError)
	// console.error('\x1b[91m\x1b[40m%s\x1b[0m', 'log.critical(): ' + criticalError)
}

log.h = (hackerMsg) => {
	console.error('\x1b[95m%s\x1b[0m', 'log.h(): ' + hackerMsg)
	// console.error('\x1b[91m\x1b[40m%s\x1b[0m', 'log.critical(): ' + criticalError)
}

module.exports = log
