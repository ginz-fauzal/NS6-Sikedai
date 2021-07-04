global.onmessage = function(msg) {

    var result = enableBluetooth();

    global.postMessage(result);
}

function enableBluetooth() {
    let mBluetoothAdapter = android.bluetooth.BluetoothAdapter.getDefaultAdapter();

    if (mBluetoothAdapter == null) {
        return { success: false, message: "Bluetooth NOT support", enabled: false}
    }
    else {
        if (mBluetoothAdapter.isEnabled()) {
            if (mBluetoothAdapter.isDiscovering()) {
                return { success: true, message: "Bluetooth is currently in device discovery process.", enabled: false};
            } else {
                return { success: true, message: "Bluetooth is enabled", enabled: true}
            }
        }
        else {
            mBluetoothAdapter.enable();
            return { success: true, message: "", enabled: false};
        }
    }

}