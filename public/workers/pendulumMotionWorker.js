const UPDATE_INTERVAL_SEC = 1;

function calculateNextInterval(theta, L, params, dotTheta = 0, t0 = 0) {
    const result = [];
    const { friction, g, dt } = params;
    let t = t0;
    while (t - t0 < UPDATE_INTERVAL_SEC) {
        const coord = [theta, dotTheta];
        const doubleDotTheta = -friction*dotTheta - g / L * Math.sin(theta);
        const vector = [dotTheta, doubleDotTheta];
        result.push([+t.toFixed(params.precision), coord, vector]);

        theta += dotTheta*dt;
        dotTheta += doubleDotTheta*dt;
        t += dt;
    }

    return {
        phaseSpaceData: result,
        lastDotTheta: dotTheta,
        lastT: t,
    };
}

onmessage = function(e) {
    console.log('Worker: Message received from main script');
    const {
        theta, L, params
    } = e.data;
    const firstData = calculateNextInterval(theta, L, params)
    postMessage(firstData.phaseSpaceData)
    // setTimeout(() => {
    //
    // }, UPDATE_INTERVAL_SEC / 2 * 1000)
    // setInterval(() => {
    //
    // }, UPDATE_INTERVAL_SEC * 1000)
    // console.log(`data chunk: ${JSON.stringify(phaseSpaceData, null, 2)}`)
}
