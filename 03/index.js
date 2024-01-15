let trackId = 1;
function workLoop(deadline) {
    trackId++;
    let isShouldYield = false;

    while (!isShouldYield) {
        console.log('workLoop', trackId );
        isShouldYield = deadline.timeRemaining() < 1;
    }
    // requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);