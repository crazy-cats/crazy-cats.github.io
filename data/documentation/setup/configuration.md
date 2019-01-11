# Overview

In CrazyCat, there are two ways to store configurations:

- Configurations which supposed to be managed by developer are stored in PHP files with array format
- Settings which can be changed in backend are stored in database `config` table


# Base Configuration

After running the CLI to create project, system generates two configuration files in `app/config` folder.


## env.php

This file is about the environment settings, such as cache, session, database etc.. Here is a demo:

```php
return [
    'global' => [
        'cache' => [
            'type' => 'files'
        ],
        'session' => [
            'type' => 'files'
        ],
        'db' => [
            'default' => [
                'type' => 'mysql',
                'host' => 'localhost',
                'username' => 'root',
                'password' => 'root',
                'database' => 'crazycat_v1',
                'prefix' => ''
            ]
        ],
        'lang' => 'en_US',
        'production_mode' => false,
        'profile' => false
    ],
    'api' => [
        'token' => '54ae6a5c0654dab12bfb4f9b344f22f0'
    ],
    'backend' => [
        'route' => 'admin',
        'lang' => 'en_US',
        'theme' => 'default',
        'merge_css' => false,
        'cookies' => [
            'duration' => 3600
        ]
    ],
    'frontend' => [
        'lang' => 'en_US',
        'theme' => 'default',
        'merge_css' => false,
        'cookies' => [
            'duration' => 3600
        ]
    ]
];
```


## modules.php

This file is about the modules' status and version. Here is a demo:

```
return [
    'CrazyCat\Admin' => [
        'enabled' => true,
        'version' => '1.0.0'
    ],
    'CrazyCat\Core' => [
        'enabled' => true,
        'version' => '1.0.0'
    ],
    'CrazyCat\Cms' => [
        'enabled' => true,
        'version' => '1.0.0'
    ],
    'CrazyCat\Menu' => [
        'enabled' => true,
        'version' => '1.0.0'
    ],
    'CrazyCat\UrlRewrite' => [
        'enabled' => true,
        'version' => '1.0.0'
    ]
];
```


# Configuration in Database

Each line of the `config` table is a setting, there are four fields of one line:

- ***scope*** - Specify which area the setting belongs to. Two properble options: `global`, `frontend`
- ***scope_id*** - Specify which stage the setting belongs to, when the scope is `frontend`
- ***path*** - Path of the setting
- ***value*** - Value of the setting

