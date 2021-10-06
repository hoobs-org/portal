# ![](https://raw.githubusercontent.com/hoobs-org/HOOBS/master/docs/logo.png)

HOOBS Capitive WiFi Portal for Debian based systems.

## Installing
First add the HOOBS repository to your sources.

```sh
wget -qO- https://dl.hoobs.org/stable | sudo bash -
```

Now you can install hoobsd and the HOOBS CLI.

```sh
sudo apt install -y hoobs-portal
```

## Usage
This is designed to run as a service. You can start the portal in debug mode with this command.

```
project debug
```

To build this project, run this command.

```
project build
```

## API
This service exposes an API for Network Manager, which allows you to view and manage network connections on your device.

**Get the current status.**

Request  
```
GET /api/
```

Response  
```json
{
    "connected": true,
    "connections": [
        {
            "iface": "eth0"
        }
    ],
    "wireless": false,
    "hotspot": {
        "running": false
    },
    "devices": [
        {
            "iface": "eth0",
            "type": "ethernet",
            "active": true
        },
        {
            "iface": "wlan0",
            "type": "wifi",
            "active": false
        }
    ]
}
```

**Turn on the wireless radio**

Request  
```
POST /api/wireless/enable/
```

**Turn off the wireless radio**

Request  
```
POST /api/wireless/disable/
```

**Get a list of available wireless networks**

Request  
```
GET /api/networks/
```

Response  
```json
[
    {
        "ssid": "My Network",
        "quality": 100,
        "security": {
            "mode": "WPA2",
            "wpa": "(none)",
            "rsn": "pair_ccmp group_ccmp psk"
        },
        "channels": [
            {
                "bssid": "68:D7:9A:22:A8:6F",
                "mode": "Infra",
                "channel": 11,
                "frequency": 2462,
                "signal": -50,
                "quality": 100
            }
        ]
    },
    {
        "ssid": "Next Door Network",
        "quality": 60,
        "security": {
            "mode": "WPA2",
            "wpa": "(none)",
            "rsn": "pair_ccmp group_ccmp psk"
        },
        "channels": [
            {
                "bssid": "70:03:7E:6E:F9:70",
                "mode": "Infra",
                "channel": 6,
                "frequency": 2437,
                "signal": -70,
                "quality": 60
            }
        ]
    }
]
```

**Connect to a wireless network**

Request  
```
POST /api/:iface/connect/
```

Parameters  
| Name  | Type   | Description                                 |
| ----- | ------ | ------------------------------------------- |
| iface | String | This is the interface from the devices list |

Body  
```json
{
    "ssid": "My Network",
    "password": "MyPassword"
}
```

**Disconnect from a wireless network**

Request  
```
POST /api/:iface/disconnect/
```

Parameters  
| Name  | Type   | Description                                 |
| ----- | ------ | ------------------------------------------- |
| iface | String | This is the interface from the devices list |

Body  
```json
{
    "ssid": "My Network"
}
```

**Turn on an ethernet port**

Request  
```
POST /api/:iface/up/
```

Parameters  
| Name  | Type   | Description                                 |
| ----- | ------ | ------------------------------------------- |
| iface | String | This is the interface from the devices list |

**Turn off an ethernet port**

Request  
```
POST /api/:iface/down/
```

Parameters  
| Name  | Type   | Description                                 |
| ----- | ------ | ------------------------------------------- |
| iface | String | This is the interface from the devices list |

**Start the captive wireless access point**

Request  
```
POST /api/hotspot/start/
```

Body  
```json
{
    "ssid": "Captive Portal"
}
```

**Stop the captive wireless access point**

Request  
```
POST /api/hotspot/stop/
```

## Legal
HOOBS and the HOOBS logo are registered trademarks of HOOBS Inc. Copyright (C) 2021 HOOBS Inc. All rights reserved.
