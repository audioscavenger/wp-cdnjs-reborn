wp-cdnjs-reborn
===============

Integrates easily CSS and JavaScript Libraries hosted by CDNjs.com. Browse, select version and sub-assets to fit your needs.
Proudly served by Audioscavenger (http://www.blog.derewonko.com/).

Requirements
------------
![WordPress 5.1.1 tested](https://img.shields.io/wordpress/v/akismet.svg) ![PHP 5.3+](https://img.shields.io/badge/PHP-5.3%2B-blue.svg) ![jQuery 3.1.1](https://img.shields.io/badge/jQuery-3.1.1-ff69b4.svg) ![Bootstrap 3.x](https://img.shields.io/badge/Bootstrap-3.3.x-6f5499.svg)

The plugin is tested to work with ```Bootstrap 3.x```, ```jQuery 3.1.1``` and ```WordPress 5.1.1``` and **requires PHP 5.3 or later**.

Meta
----
 * Plugin Name: WP cdnjs reborn
 * Plugin URI: http://wordpress.org/plugins/wp-cdnjs-reborn/
 * Description: Integrate easily CSS and JavaScript Library hosted by http://cdnjs.com on your WordPress site.
 * Version: 0.3.2
 * Author: Audioscavenger
 * Author URI: https://github.com/audioscavenger/wp-cdnjs-reborn
 * License: GNU General Public License v3
 * License URI: license.txt
 * Text Domain: wp-cdnjs-reborn
 * Domain Path: /lang

History
-------
* Contributors          : audioscavenger
* Original Contributors : mindshare, geetjacobs, patkirts
* Original name         : WP cdnjs
* Topics                : php wordpress-plugin cdnjs js libraries 
* Requires at least     : 5.0
* Tested up to          : 5.1.1
* License               : GPLv3
* License URI           : http://www.gnu.org/licenses/gpl-3.0.html

Description
-----------
An extremely elegant plugin that allows you to search all http://cdnjs.com libraries and include them on your site.

* Builtin cdnjs.com search
* Reorder included files with an intuitive drag-and-drop interface
* Integrates seamlessly with WordPress (no developer up-sells or donation requests)
* Choose the exact version you want to include (default is latest)
* Choose the secondary assets you want to include
* Choose the non-minified or minified (default) version
* Choose where to include files (header / footer)
* Options to globally or individually enable and disable included libraries
* SSL support

Installation
------------
1. Automatically install using the builtin WordPress Plugin installer
or...
1. Upload entire `wp-cdnjs` folder to the `/wp-content/plugins/` directory.
2. Activate the plugin through the 'Plugins' menu in WordPress.

Screenshots
-----------
![Settings](https://github.com/audioscavenger/wp-cdnjs-reborn/blob/master/screenshot-1.png)
![Browse Libraries](https://github.com/audioscavenger/wp-cdnjs-reborn/blob/master/screenshot-2.png)
![Change Version](https://github.com/audioscavenger/wp-cdnjs-reborn/blob/master/screenshot-3.png)
![Add Assets](https://github.com/audioscavenger/wp-cdnjs-reborn/blob/master/screenshot-4.png)

Changelog
---------
* 0.3.2
  * just tested for 5.1.1
  * updated minimum WP version to 5.0 to force you guys to update core engine, I hope you don't mind

* 0.3.0
  * Performance increase: Removed the query strings everywhere
  * Removed font-awsome and switched to WP dashicons

* 0.2.4
  * Correct path to language files + add en_US.mo

* 0.2.3
  * Ajout de la version Francaise, vieux.

* 0.2.2
  * Release date: January 7, 2018
  * Release post: [WP CDNjs Reborn](https://wp.me/p9sB0t-7Y)
  * Creation of the readme.txt. This took me like 3 hours so it totallty justifies a new release.

* 0.2.1
  * add menu_icon + css assets
  * rename wp-cdnjs.php to wp-cdnjs-reborn.php
  * integrate 0.13 functions
  * move main functions to lib/functions.php
  * add minified js
  * table in Settings is now full width
  * cleanup php code everywhere

* 0.2.0
  * Initial fork from https://github.com/mindsharelabs/wp-cdnjs.git to https://github.com/audioscavenger/wp-cdnjs-reborn.git
  * Fix the secondary assets you want to include
  * Add column for choosing the exact version
  * Add checkbox for choosing the the non-minified version

* 0.1.3
  * Update for 4.0

* 0.1.2
  * Bugfix for header / footer setting being reversed

* 0.1.1
  * Added .pot file for translation
  * Fixed logo and WP version

* 0.1
  * Initial release


Copyright
---------
 * 
 * Modified work Copyright 2018 Eric Derewonko (http://www.derewonko.com)
 * Original work Copyright 2014 Mindshare Studios, Inc. (http://mind.sh/are/)
 * Plugin template was forked from the WP Settings Framework by Gilbert Pellegrom http://dev7studios.com
 * and the WordPress Plugin Boilerplate by Christopher Lamm http://www.theantichris.com
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License, version 3, as
 * published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
