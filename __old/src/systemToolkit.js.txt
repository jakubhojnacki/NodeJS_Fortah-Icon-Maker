class SystemToolkit {
    static getOperatingSystem() {
        let operatingSystem = process.platform;
        switch (operatingSystem) {
            case 'darwin':
                operatingSystem = "macos";
                break;
            case 'win32':
                operatingSystem = "windows";
                break;
        }
        return operatingSystem;
    }
}

module.exports = SystemToolkit;