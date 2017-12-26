wp-cdnjs-reborn
===============

This is a Wordpress plugin used to integrate easily CSS and JavaScript Library hosted by http://cdnjs.com on your WordPress site.

History
-------
* Contributors          : audioscavenger
* Original Contributors : mindshare, geetjacobs, patkirts
* Original name         : WP cdnjs
* Topics: php wordpress-plugin cdnjs js libraries 
* Requires at least: 3.8
* Tested up to: 4.9.1
* License: GPLv3
* License URI: http://www.gnu.org/licenses/gpl-3.0.html

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


Changelog
---------
* 0.2.1
  * add menu_icon + css assets
  * rename wp-cdnjs.php to wp-cdnjs-reborn.php
  * integrate 0.13 functions
  * move main functions to lib/functions.php

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
 * Modified work Copyright 2017 Eric Derewonko (http://www.derewonko.com)
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
