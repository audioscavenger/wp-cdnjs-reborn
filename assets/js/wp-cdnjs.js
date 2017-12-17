// wp-cdnjs.orig.js modified
function debug() {
  return true;
}
jQuery(document).ready(function(jQuery) {

  var usedPlugins = [];
  var cdnjsSelected = jQuery('#cdnjs-selected');
  var cdnjsScripts = jQuery('#cdnjs_settings_scripts');
  cdnjsSelected.find('.index').each(function() {
    usedPlugins.push(jQuery(this).find('input.plugin_name').val());
    if (debug) console.log('cdnjsSelected-usedPlugins: '+usedPlugins);
  });

  function remoteAjaxAutoComplete(element, url) {

    jQuery(element).select2({
      width:              "55%",
      id:                 'name',
      multiple:           false,
      placeholder:        cdnjs_text.search_placeholder,
      minimumInputLength: 2,
      ajax:               {
        url:      url,
        dataType: 'json',
        //cache: true,
        data:     function(term, page) {
          return {
            search:     term,
            page_limit: 20
          }
        },
        results:  function(data, page) {
          // disable the selection of already loaded plugins within #cdnjs-selected
          if(usedPlugins) {
            for(var j = 0; j < data.results.length; j++) {
              for(var i = 0; i < usedPlugins.length; i++) {
                if(usedPlugins[i] === data.results[j].name) {
                  data.results[j].disabled = true;
                  break;
                } else {
                  data.results[j].disabled = false;
                }
              }
            }
          }
          if (debug) console.log('remoteAjaxAutoComplete-data: ',data);
          return data;
        }
      },
      formatResult:       formatResults,
      formatSelection:    formatSelection
    });

  }

  // formatResults in dropdown list with name, version, description
  function formatResults(data) {
    return '<div id="opt-' + data.filename + '" class="cdnjs-selection" title="' + data.description + '">'+data.name+' '+data.version+' ( '+data.assets.length+' versions) '+data.description+'</div>';
  }

  function formatSelection(data, container) {
    usedPlugins.push(data.name);
    return data.name;
  }

  remoteAjaxAutoComplete('#cdnjs_settings_scripts', '//api.cdnjs.com/libraries?fields=version,filename,description,assets');

  //on event handler
  cdnjsScripts.on('select2-selecting', function(e, data) {
    if(!e.object) {
      e.object = data;
    }
    jQuery('.cdnjs-selected label, .cdnjs-selected #cdnjs-selected').show();

    addLibraryRow(e.object, '#cdnjs-selected tbody');
  });

  //on event handler
  cdnjsScripts.on('select2-close', function(e, data) {
    cdnjsScripts.select2('data', null);
  });

  onVersionChange();
  onAssetChange();

  cdnjsSelected.find('tbody').sortable({
    cursor: "move",
    handle: "i.fa-arrows-v",
    stop:   function(event, ui) {
      cdnjsSelected.find('tr').removeClass('alternate');
      cdnjsSelected.find('tr:odd').addClass('alternate');
    }
  });

  cdnjsSelected.find('tr:odd').addClass('alternate');

  jQuery('.wp-cdnjs-remove-row').live('click', function(e) {
    var el = jQuery(this).parent().parent();
    var name = el.find('input.plugin_name').val();

    el.remove();

    for(var i = usedPlugins.length - 1; i >= 0; i--) {
      if(usedPlugins[i] === name) {
        usedPlugins.splice(i, 1);
      }
    }
  });

});

//This is for loading with data and also called when selecting a plugin
function onAssetChange() {
  jQuery('.select2-assets').not('.select2-offscreen').each(function(i, obj) {
    //Attach select2 to all asset dropdowns
    var objID = jQuery('#' + obj.id);
    if (debug) console.log('onAssetChange   -objID: ',objID);
    objID.select2({
      width:           "100%",
      //plugins:   [],
      //id:     'name',
      placeholder:     cdnjs_text.add_assets,
      formatNoMatches: function() {
        return cdnjs_text.no_addl_assets;
      },
      ajax:            {
        url:      '//api.cdnjs.com/libraries?fields=assets',
        dataType: 'json',
        data:     function(term, page) {
          return {
            search: jQuery(this).data("plugin-name")
          };
        },
        results:  function(data, page) {
          var results = [];
          var used_assets = [];

          theMainAsset = objID.data("asset-id");
          if (debug) console.log('onAssetChange-theMainAsset: '+theMainAsset);
          //console.log(theMainAsset);
          /*var used_assets = jQuery('#' + theMainAsset + '-asset-holder input').map(function() {
            return jQuery(this).val();
          }).get();*/
          jQuery('#' + theMainAsset + '-asset-holder input').each(function() {
            used_assets.push(jQuery(this).val());
          });
          used_assets.push(objID.data("asset-file").replace('.min', ''));

          if (debug) console.log('onAssetChange-used_assets: '+used_assets);
          if (debug) console.log('onAssetChange-data.results[0]: ',data.results[0]);  // Object { name: "clipboard.js", latest: "https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/1.7.1/clipboard.min.js", assets: Array[26] }
          if (debug) console.log('onAssetChange-data.results[0].assets[0]: ',data.results[0].assets[0]);  //Object { version: "1.7.1", files: Array[2] }

          //@todo check the selected version indeed
          assetId = cleanName(data.results[0].name);
          selectedVersion = jQuery('#' + assetId + '-row .wp-cdnjs_name input.plugin_version').val();
          if (debug) console.log('onAssetChange-selectedVersion for '+theMainAsset+': '+selectedVersion);
          
          for (j = 0; j < data.results[0].assets.length; j++) {
            asset = data.results[0].assets[j]; //Object { version: "1.7.1", files: Array[react-popper.js,react-popper.min.js] }
            if (selectedVersion == asset.version) {
              for(i = 0; i < asset.files.length; i++) {
                if (debug) console.log('onAssetChange-asset-'+selectedVersion+'.files[i]: '+asset.files[i]);
                assetToCheck = (!jQuery('#cdnjs_settings_avoid_minified').prop("checked")) ? asset.files[i] : asset.files[i].replace('.min', '');
                if(jQuery.inArray(assetToCheck, used_assets) == -1 ) {
                  if(getFileExtension(assetToCheck)) {
                    results.push({
                      id:   asset.files[i],
                      text: asset.files[i]
                    });
                  }
                }
              }
            }
          }

          return {
            results: results
          };

        }
      }
    });

    //Call on change for assest
    objID.on('select2-selecting', function(e, data) {
      if(!e.object) {
        e.object = data;
      }
      //console.log(jQuery('#'+obj.id).data( "plugin" ));
      if (debug) console.log('onAssetChange-e.object: ',e.object);  // Object { id: "core.js", text: "core.js" }
      if (debug) console.log("onAssetChange-objID.data('plugin-name'): "+objID.data("plugin-name"));  //jquery
      addAssetRow(e.object, objID.data("plugin-name"));
    });

    objID.on('select2-close', function(e, data) {
      objID.select2('data', null);
    });
  });
}

function onVersionChange() {
  jQuery('.select2-version').not('.select2-offscreen').each(function(i, obj) {
    //Attach select2 to all version dropdowns
    var objID = jQuery('#' + obj.id);
    if (debug) console.log('onVersionChange-objID: ',objID);
    objID.select2({
      width:           "100%",
      //plugins:   [],
      //id:     'name',
      placeholder:     cdnjs_text.choose_version,
      formatNoMatches: function() {
        return cdnjs_text.no_addl_version;
      },
      ajax:            {
        url:      '//api.cdnjs.com/libraries?fields=assets',
        dataType: 'json',
        data:     function(term, page) {
          return {
            search: jQuery(this).data("plugin-name")
          };
        },
        results:  function(data, page) {
          var results = [];
          var currentVersion;

          if (debug) console.log('onVersionChange-objID: ',objID);
          if (debug) console.log('onVersionChange-objID.data("asset-id")='+objID.data("asset-id"));
          theMainAsset = objID.data("asset-id");
          if (debug) console.log('onVersionChange-objID.data("version")='+objID.data("version"));
          currentVersion = objID.data("version");

          if (debug) console.log('onVersionChange-data.results[0]: ',data.results[0]);  // Object { name: "clipboard.js", latest: "https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/1.7.1/clipboard.min.js", assets: Array[26] }
          if (debug) console.log('onVersionChange-data.results[0].assets[0]: ',data.results[0].assets[0]);  //Object { version: "1.7.1", files: Array[2] }

          var assets = data.results[0].assets; //Object [{ version: "1.7.1", files: Array[react-popper.js,react-popper.min.js] },{..}]
          for(i = 0; i < assets.length; i++) {
            if (debug) console.log('onVersionChange-checking assets.assets[i]: ',assets[i]);

            if(jQuery.inArray(assets[i].version, currentVersion) == -1 ) {
              results.push({
                id:   assets[i].version,
                text: assets[i].version
              });
            }
          }

          return {
            results: results
          };

        }
      }
    });

    //Call on change for assest
    objID.on('select2-selecting', function(e, data) {
      if(!e.object) {
        e.object = data;
      }
      //console.log(jQuery('#'+obj.id).data( "plugin" )); // ???
      if (debug) console.log('onVersionChange-e.object: ',e.object);  // Object { id: "core.js", text: "core.js" }
      if (debug) console.log("onVersionChange-objID.data('plugin-name'): "+objID.data("plugin-name"));  //jquery
      if (debug) console.log("onVersionChange-"+objID.data("plugin-name")+"-currentVersion="+objID.data("version")+" newVersion="+e.object.text);
      
      changeVersion(objID.data("plugin-name"), e.object.text);
    });

    objID.on('select2-close', function(e, data) {
      objID.select2('data', null);
    });
  });
}

function getFileExtension(filename) {
  return !!(filename.split('.').pop() == 'css' || filename.split('.').pop() == 'js');
  // if(filename.split('.').pop() == 'css' || filename.split('.').pop() == 'js') {
    // return true;
  // } else {
    // return false;
  // }
}

function cleanName(str) {
  return str.replace(/[^a-zA-Z\d ]/g, '-').toLowerCase();
}

/* function onAssetSelect(fieldID) {
  jQuery('#' + fieldID).on('select2-selecting', function(e, data) {
    if(!e.object) {
      e.object = data;
    }
    addAssetRow(e.object, fieldID);
  });
}
 */
function addLibraryRow(data, location) {
  if (debug) console.log('addLibraryRow-data: ',data);  //Object { name: "react-popper", latest: "https://cdnjs.cloudflare.com/ajax/l…", version: "0.7.4", filename: "react-popper.min.js", description: "React wrapper around PopperJS.", assets: Array[23], disabled: false }
  var assets = data.assets[0].files;
  var default_asset = data.filename;
  if (debug) console.log('addLibraryRow-default_asset: ',default_asset);  //Object { version: "0.7.4", files: Array[2] }
  var nameID = cleanName(data.name);

  if (!jQuery('#cdnjs_settings_avoid_minified').prop("checked")) {
    // check to see if the default asset is minified, if not check to see if a min exists
    if(default_asset.indexOf('.min.') == -1) {
      for(i = 0; i < assets.length; i++) {
        // if min version exists make it the default
        if (debug) console.log('addLibraryRow-assets[i]:'+assets[i]);
        var tmp = assets[i];
        if(default_asset == tmp.replace('.min', '')) {
          default_asset = assets[i];
          if (debug) console.log('addLibraryRow-default_asset+min: '+default_asset);
        }
      }
    }
  } else {
    // check to see if the default asset is minified, if so check to see if a non min exists
    if(default_asset.indexOf('.min.') > -1) {
      for(i = 0; i < assets.length; i++) {
        // if non min version exists make it the default
        if (debug) console.log('addLibraryRow-getNonMin-assets[i]:'+assets[i]);
        var tmp = assets[i];
        if(tmp == default_asset.replace('.min', '')) {
          default_asset = tmp;
          if (debug) console.log('addLibraryRow-getNonMin-default_asset-min: '+default_asset);
        }
      }
    }
  }

  var row = '<tr id="' + nameID + '-row" class="index">';
  row += '<td class="wp-cdnjs_move"><i class="fa fa-arrows-v"></i></td>';
  row += '<td class="wp-cdnjs_name"><strong>' + data.name + '</strong> <br/>' + cdnjs_text.version + ': <span class="currentVersion">' + data.version +'</span>';
  row += '<input type="hidden" name="cdnjs[cdnjs_settings_scripts][' + nameID + '][name]" class="plugin_name" value="' + data.name + '"/>';
  row += '<input type="hidden" name="cdnjs[cdnjs_settings_scripts][' + nameID + '][version]" class="plugin_version" value="' + data.version + '"/>';
  row += '</td>';
  row += '<td class="wp-cdnjs_choose_version"><input type="hidden" id="' + nameID + '-choose_version" data-plugin-name="' + data.name + '" data-asset-id="' + cleanName(default_asset) + '" data-version="' + data.version + '" class="select2-version"></td>';
  row += '<td class="wp-cdnjs_assets">';
  row += '<div id="' + cleanName(default_asset) + '-asset-holder" class="included_assets"><div><strong>' + cdnjs_text.inc_assets + ':</strong></div>';
  row += '<div id="' + cleanName(default_asset) + '-asset-row">';
  row += default_asset + ' *';
  row += '<input type="hidden" name="cdnjs[cdnjs_settings_scripts][' + nameID + '][assets][]" value="' + default_asset + '">';
  row += '</div>';
  row += '</div>';
  row += '</td>';
  row += '<td class="wp-cdnjs_add_assets"><input type="hidden" id="' + nameID + '-add_assets" data-plugin-name="' + data.name + '" data-asset-id="' + cleanName(default_asset) + '" data-asset-file="' + default_asset + '" class="select2-assets"></td>';
  row += '<td class="wp-cdnjs_location"><select name="cdnjs[cdnjs_settings_scripts][' + nameID + '][location]" id=""><option value="0" selected="selected">' + cdnjs_text.footer + '</option><option value="1">' + cdnjs_text.header + '</option></select></td>';
  row += '<td class="wp-cdnjs_enable"><input type="hidden" name="cdnjs[cdnjs_settings_scripts][' + nameID + '][enabled]" id="" value="0"><input type="checkbox" name="cdnjs[cdnjs_settings_scripts][' + nameID + '][enabled]" id="" value="1" checked="checked"></td>';
  row += '<td><span class="wp-cdnjs-remove-row button-secondary">' + cdnjs_text.remove + '</span></td>';
  row += '</tr>';

  jQuery(location).append(row);
  jQuery('#cdnjs-selected tr:odd').addClass('alternate');
  onVersionChange();
  onAssetChange();
}

function addAssetRow(data, location) {
  var nameID = cleanName(data.text);
  var row = '<div id="' + nameID + '-asset-row">';
  row += '&bull; ' + data.text;
  row += ' <i title="' + cdnjs_text.remove + '" style="cursor:pointer" class="fa fa-times" onclick="removeRow(\'#' + nameID + '-asset-row\');"></i><br />';
  row += '<input type="hidden" name="cdnjs[cdnjs_settings_scripts][' + location + '][assets][]" value="' + data.text + '"/>';
  row += '</div>';
  if (debug) console.log('addAssetRow-location: '+location);  //jquery
  if (debug) console.log('addAssetRow-id: '+'#' + location + '-row div.included_assets');  //#jquery-row div.included_assets
  jQuery('#' + location + '-row div.included_assets').append(row);
}

function changeVersion(location, newVersion) {
  jQuery('#' + location + '-row .wp-cdnjs_name span.currentVersion').text(newVersion);
  jQuery('#' + location + '-row .wp-cdnjs_name input.plugin_version').val(newVersion);
}

function removeRow(row_id) {
  jQuery(row_id).remove();
}
