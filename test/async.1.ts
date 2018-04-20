export function testAsync(runAsync: () => Promise<void>, timeout: number = 1000) {
    return (done: () => void) => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = timeout
        runAsync().then(done, (e) => { fail(e); done() }).catch((e) => { fail(e) })
    }
}
