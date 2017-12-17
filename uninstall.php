<?php
/**
 * Plugin Name: WP cdnjs reborn
 * Plugin URI: http://wordpress.org/plugins/wp-cdnjs-reborn/
 * Description: Wordpress plugin used to integrate easily CSS and JavaScript Library hosted by http://cdnjs.com on your WordPress site.
 * Version: 0.2.0
 * Maintainer: audioscavenger
 * Maintainer URI: http://www.derewonko.com/
 * License: GNU General Public License v3
 * License URI: license.txt
 * Text Domain: wp-cdnjs-reborn
 */

//if uninstall not called from WordPress exit
if(!defined('WP_UNINSTALL_PLUGIN')) {
	exit();
}

if(!defined('WP_CDNJS_OPTIONS')) {
	define('WP_CDNJS_OPTIONS', 'cdnjs');
}

$option_name = WP_CDNJS_OPTIONS;
delete_option($option_name);
