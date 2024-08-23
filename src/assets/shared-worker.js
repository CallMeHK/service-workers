// shared-worker.js

let connections = []; // Array to keep track of all connected ports
let sharedState = {}; // Object to store shared state

// Event listener for incoming connections from tabs
self.onconnect = function (e) {
    const port = e.ports[0];
    connections.push(port);

    // Send the current shared state to the newly connected tab
    port.postMessage({ type: 'init', state: sharedState });

    // Event listener for messages from connected tabs
    port.onmessage = function (event) {
        const data = event.data;

        // Example: Update shared state
        if (data.type === 'updateState') {
            sharedState = { ...sharedState, ...data.state };

            // Broadcast the updated state to all connected tabs
            connections.forEach((p) => {
                p.postMessage({ type: 'stateUpdated', state: sharedState });
            });
        }
    };

    // Handle the closing of a tab (port)
    port.onclose = function () {
        connections = connections.filter(p => p !== port);
    };
};

