<?php
//if uninstall not called from WordPress exit
if(!defined('WP_UNINSTALL_PLUGIN')) {
	exit();
}

if(!defined('WP_CDNJS_OPTIONS')) {
	define('WP_CDNJS_OPTIONS', 'cdnjs');
}

$option_name = WP_CDNJS_OPTIONS;
delete_option($option_name);
