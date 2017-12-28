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
  <td></td></tr></table>
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
    if(!empty($settings['cdnjs_settings_scripts'])) : foreach($settings['cdnjs_settings_scripts'] as $key => $value) :
      $buff = '';
      $buff.= '<tr id="'. $key .'-row" class="index">';
      $buff.= '  <td class="wp-cdnjs_move"><i class="fa fa-arrows-v"></i></td>';
      $buff.= '  <td class="wp-cdnjs_name"><strong>'. $value['name'] .'</strong> <br /><span class="currentVersion">'. $value['version'] .'</span>';
      $buff.= '    <input type="hidden" name="cdnjs[cdnjs_settings_scripts]['. $key .'][name]" class="plugin_name" value="'. $value['name'] .'" />';
      $buff.= '    <input type="hidden" name="cdnjs[cdnjs_settings_scripts]['. $key .'][version]" class="plugin_version" value="'. $value['version'] .'" />';
      $buff.= '  </td>';
      $buff.= '  <td class="wp-cdnjs_choose_version">';
      $buff.= '    <input type="hidden" id="'. $key . '-choose_version" data-plugin-id='. $key . ' data-plugin-name="'. $value['name'] .'" data-version="'. $value['version'] .'" class="select2-version">';
      $buff.= '  </td>';
      $buff.= '  <td class="wp-cdnjs_assets">';
      $mainAsset = array_shift($value['assets']);
      $mainAssetId = sanitize_title($mainAsset);
      $buff.= '    <div id="'. $key .'-asset-holder" class="included_assets">';
      $buff.= '      <div id="'. $mainAssetId .'-asset-row"><strong>'. $mainAsset.'</strong>';
      $buff.= '        <i title="Remove" style="cursor:pointer" class="fa fa-times" onclick="removeRow(\'#'. $mainAssetId .'-asset-row\');"></i>'; //@todo: verify $value['assets']>0
      $buff.= '        <input type="hidden" name="cdnjs[cdnjs_settings_scripts]['. $key .'][assets][]" value="'. $mainAsset .'">';
      $buff.= '      </div>';
      foreach($value['assets'] as $asset) :
        $assetId = sanitize_title($asset);
      $buff.= '      <div id="'. $assetId .'-asset-row">'. $asset;
      $buff.= '        <i title="Remove" style="cursor:pointer" class="fa fa-times" onclick="removeRow(\'#'. $assetId .'-asset-row\');"></i>';
      $buff.= '        <input type="hidden" name="cdnjs[cdnjs_settings_scripts]['. $key .'][assets][]" value="'. $asset .'">';
      $buff.= '      </div>';
      endforeach; 
      $buff.= '    </div>';
      $buff.= '  </td>';
      echo $buff;
      ?>
        <td class="wp-cdnjs_add_assets">
          <input type="hidden" id="<?php echo $key; ?>-add_assets" data-plugin-name="<?php echo $value['name']; ?>" data-asset-id="<?php echo $mainAssetId; ?>" data-asset-file="<?php echo $mainAsset; ?>" class="select2-assets">
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
