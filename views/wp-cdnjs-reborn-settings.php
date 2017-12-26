<?php


add_filter('wp_cdnjs_register_settings', 'wp_cdnjs_settings');

function wp_cdnjs_settings($settings) {

	// General Settings section
	$settings[] = array(
		'section_id'          => 'settings',
		'section_title'       => __('Settings', 'wp-cdnjs-reborn'),
		'section_description' => '',
		//'section_order'       => 5,
		'fields'              => array(
			array(
				'id'          => 'enable_scripts',
				'title'       => __('Enable', 'wp-cdnjs-reborn'),
				'desc'        => __('Enqueue scripts in Locations defined', 'wp-cdnjs-reborn'),
				'placeholder' => '',
				'type'        => 'checkbox',
				'std'         => 0
			),
			array(
				'id'          => 'avoid_minified',
				'title'       => __('Avoid minified', 'wp-cdnjs-reborn'),
				'desc'        => __('Avoid the minified version (selected by default)', 'wp-cdnjs-reborn'),
				'placeholder' => '',
				'type'        => 'checkbox',
				'std'         => 0
			),
			array(
				'id'    => 'scripts',
				'title' => __('Browse cdnjs Libraries', 'wp-cdnjs-reborn'),
				'desc'  => __('Search for CSS and JavaScript libraries to include.', 'wp-cdnjs-reborn'),
				'std'   => '',
				'type'  => 'cdnjs',
			),

		)
	);

	return $settings;
}

add_action('wp_cdnjs_after_field_cdnjs_settings_scripts', 'cdn_field');
function cdn_field() {
	global $wp_cdnjs;
	$settings = $wp_cdnjs->get_settings(WP_CDNJS_OPTIONS);
  // wtf($settings);

	?>

	<tr class="cdnjs-selected">
	<th scope="row"><label style="display:block"><?php _e('Enqueued cdnjs Libraries', 'wp-cdnjs-reborn') ?></label></th>
	<td>
	<table id="cdnjs-selected" class="wp-list-table widefat posts">
		<thead>
		<tr>
			<th scope="col" class="wp-cdnjs_move check-column"></th>
			<th scope="col" class="wp-cdnjs_name"><?php _e('Plugin Name', 'wp-cdnjs-reborn') ?></th>
			<th scope="col" class="wp-cdnjs_choose_version"><?php _e('Version', 'wp-cdnjs-reborn') ?></th>
			<th scope="col" class="wp-cdnjs_assets"><?php _e('Assets', 'wp-cdnjs-reborn') ?></th>
			<th scope="col" class="wp-cdnjs_add_assets"><?php _e('Add Assests', 'wp-cdnjs-reborn') ?></th>
			<th scope="col" class="wp-cdnjs_location"><?php _e('Location', 'wp-cdnjs-reborn') ?></th>
			<th scope="col" class="wp-cdnjs_enable"><?php _e('Enable', 'wp-cdnjs-reborn') ?></th>
			<th scope="col"><?php _e('Remove', 'wp-cdnjs-reborn') ?></th>
		</tr>
		</thead>
		<tbody>
		<?php
		if(!empty($settings['cdnjs_settings_scripts'])) : foreach($settings['cdnjs_settings_scripts'] as $key => $value) : ?>
			<tr id="<?php echo $key; ?>-row" class="index">
				<td class="wp-cdnjs_move"><i class="fa fa-arrows-v"></i></td>
				<td class="wp-cdnjs_name"><strong><?php echo $value['name']; ?></strong> <br /><?php _e('Version', 'wp-cdnjs-reborn') ?>: <span class="currentVersion"><?php echo $value['version']; ?></span>
					<input type="hidden" name="cdnjs[cdnjs_settings_scripts][<?php echo $key; ?>][name]" class="plugin_name" value="<?php echo $value['name']; ?>" />
					<input type="hidden" name="cdnjs[cdnjs_settings_scripts][<?php echo $key; ?>][version]" class="plugin_version" value="<?php echo $value['version']; ?>" />
				</td>
				<td class="wp-cdnjs_choose_version">
					<input type="hidden" id="<?php echo $key; ?>-choose_version" data-plugin-name="<?php echo $value['name']; ?>" data-asset-id="<?php echo sanitize_title($setasset); ?>" data-version="<?php echo $value['version']; ?>" class="select2-version">
				</td>
				<td class="wp-cdnjs_assets">
					<?php $setasset = array_shift($value['assets']); ?>
					<div id="<?php echo sanitize_title($setasset) ?>-asset-holder" class="included_assets">
						<div><strong><?php _e('Included Assets', 'wp-cdnjs-reborn') ?>:</strong></div>
						<div id="<?php echo sanitize_title($setasset) ?>-asset-row">
							<?php echo $setasset.' *'; ?>
							<input type="hidden" name="cdnjs[cdnjs_settings_scripts][<?php echo $key; ?>][assets][]" value="<?php echo $setasset; ?>">
						</div>
						<?php foreach($value['assets'] as $asset) : ?>
							<?php $cleanName = sanitize_title($asset); ?>
							<div id="<?php echo $cleanName; ?>-asset-row">&bull; <?php echo $asset; ?>
								<i title="Remove" style="cursor:pointer" class="fa fa-times" onclick="removeRow('#<?php echo $cleanName; ?>-asset-row');"></i>
								<input type="hidden" name="cdnjs[cdnjs_settings_scripts][<?php echo $key; ?>][assets][]" value="<?php echo $asset; ?>">
							</div>
						<?php endforeach; ?>
					</div>
				</td>
				<td class="wp-cdnjs_add_assets">
					<input type="hidden" id="<?php echo $key; ?>-add_assets" data-plugin-name="<?php echo $value['name']; ?>" data-asset-id="<?php echo sanitize_title($setasset); ?>" data-asset-file="<?php echo $setasset; ?>" class="select2-assets">
				</td>
				<td class="wp-cdnjs_location">
					<select name="cdnjs[cdnjs_settings_scripts][<?php echo $key; ?>][location]">
						<option value="1" <?php echo(($value['location'] == 1) ? ' selected="selected"' : ''); ?>><?php _e('Footer', 'wp-cdnjs-reborn'); ?></option>
						<option value="0" <?php echo(($value['location'] == 0) ? ' selected="selected"' : ''); ?>><?php _e('Header', 'wp-cdnjs-reborn'); ?></option>
					</select>
				</td>
				<td class="wp-cdnjs_enable">
					<input type="hidden" name="cdnjs[cdnjs_settings_scripts][<?php echo $key; ?>][enabled]" value="0"><input type="checkbox" name="cdnjs[cdnjs_settings_scripts][<?php echo $key; ?>][enabled]" value="1" <?php echo(($value['enabled'] == 1) ? ' checked="checked"' : '') ?>>
				</td>
				<td><span class="wp-cdnjs-remove-row button-secondary"><?php _e('Remove', 'wp-cdnjs-reborn') ?></span></td>
			</tr>
		<?php endforeach; endif;
		?>
		</tbody>
	</table>

<?php
}
