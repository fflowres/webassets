// Main entry point for the app
function onDeviceReady()
{
    document.getElementById("device_name").innerHTML = window.device.name;
    document.getElementById("device_uuid").innerHTML = window.device.uuid;
    document.getElementById("platform_name").innerHTML = window.device.platform;
    document.getElementById("platform_version").innerHTML = window.device.version;
    document.getElementById("phonegap_version").innerHTML = window.device.phonegap;
    document.getElementById("marmalade_version").innerHTML = window.device.marmalade;

    document.getElementById("deviceFieldSet").style.visibility = "visible";
}
