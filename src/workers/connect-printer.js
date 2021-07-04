global.onmessage = function(msg) {
    var request = msg.data;
    var port = request.port;

    var result = connectPrinter(port);

    global.postMessage(result);
}

function connectPrinter(port) {
    let isPortOpen = HPRTAndroidSDK.HPRTPrinterHelper.PortOpen("Bluetooth,"+port.portName);
    
    return isPortOpen;
}