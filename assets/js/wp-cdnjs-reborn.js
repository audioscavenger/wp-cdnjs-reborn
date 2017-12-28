function debug() {
  return false;
}
jQuery(document).ready(function(jQuery) {

  var usedPlugins = [];
  var cdnjsSelected = jQuery('#cdnjs-selected');
  var cdnjsScripts = jQuery('#cdnjs_settings_scripts');
  cdnjsSelected.find('.index').each(function() {
    usedPlugins.push(jQuery(this).find('input.plugin_name').val());
    if (debug()) console.log('cdnjsSelected-usedPlugins: '+usedPlugins);
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
                  if (debug()) console.log('remoteAjaxAutoComplete-data.results[j]:',data.results[j]);  //  Object { name: "popper.js", latest: "https://cdnjs.cloudflare.com/ajax/l…", version: "1.13.0", filename: "popper.min.js", description: "A kickass library to manage your po…", assets: Array[98] }
                  data.results[j].disabled = true;
                  if (debug()) console.log('remoteAjaxAutoComplete-data.results[j]:',data.results[j]);  //  Object { name: "popper.js", latest: "https://cdnjs.cloudflare.com/ajax/l…", version: "1.13.0", filename: "popper.min.js", description: "A kickass library to manage your po…", assets: Array[98], disabled: true }
                  break;
                } else {
                  data.results[j].disabled = false;
                }
              }
            }
          }
          if (debug()) console.log('remoteAjaxAutoComplete-data: ',data); //  Object { results: Array[151], total: 151 }
          return data;
        }
      },
      formatResult:       formatLibraryResults,
      formatSelection:    formatLibrarySelection
    });

  }

  // formatLibraryResults in dropdown list with name, version, description
  function formatLibraryResults(data) {
    return '<div id="opt-' + data.filename + '" class="cdnjs-selection" title="' + data.description + '">'+data.name+' '+data.version+' ( '+data.assets.length+' versions) '+data.description+'</div>';
  }
  
  // update usedPlugins list for next Library browse
  function formatLibrarySelection(data, container) {
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
    if (debug()) console.log('onAssetChange   -objID: ',objID);
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
          assetId = cleanName(data.results[0].name);
          selectedVersion = jQuery('#' + assetId + '-row .wp-cdnjs_name input.plugin_version').val(); //1.13.0
          theMainAsset = objID.data("asset-id");
          if (debug()) console.log('onAssetChange-theMainAsset: '+theMainAsset);  //  popper-min-js
          if (debug()) console.log('onAssetChange-assetId:      '+assetId);       //  popper-js
          if (debug()) console.log('onAssetChange-selectedVersion for '+theMainAsset+': '+selectedVersion); //popper-min-js: 1.13.0

          //@todo: change '#' + theMainAsset + '-asset-holder to '#' + assetId + '-asset-holder
          //@done: we don't want the holder of the rows to be named after the main asset if we want this main asset to be changed later
          //example: popper.min.js is incompatible with bootstrap so we need to use umd/popper.min.js instead
          // https://stackoverflow.com/questions/45694811/how-to-use-popper-js-with-bootstrap-4-beta
          jQuery('#' + assetId + '-asset-holder input').each(function() {
            used_assets.push(jQuery(this).val());
          });
          // line bellow is used to avoid selection of non min version of main asset.
          // used_assets.push(objID.data("asset-file").replace('.min.', '.'));

          if (debug()) console.log('onAssetChange-used_assets: '+used_assets);  //  popper.min.js,umd/popper.min.js,popper.js
          if (debug()) console.log('onAssetChange-data.results[0]: ',data.results[0]);  //  Object { name: "popper.js", latest: "https://cdnjs.cloudflare.com/ajax/l…", assets: Array[98] }
          if (debug()) console.log('onAssetChange-data.results[0].assets[0]: ',data.results[0].assets[0]);  //  Object { version: "1.13.0-next.1", files: Array[24] }

          //@todo check the selected version indeed
          
          for (j = 0; j < data.results[0].assets.length; j++) {
            asset = data.results[0].assets[j]; //Object { version: "1.7.1", files: Array[react-popper.js,react-popper.min.js] }
            if (selectedVersion == asset.version) {
              for(i = 0; i < asset.files.length; i++) {
                if (debug()) console.log('onAssetChange-asset-'+selectedVersion+'.files[i]: '+asset.files[i]);
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
      if (debug()) console.log('onAssetChange-e.object: ',e.object);  // Object { id: "core.js", text: "core.js" }
      if (debug()) console.log("onAssetChange-objID.data('plugin-name'): "+objID.data("plugin-name"));  //jquery
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
    var pluginId = objID.data("plugin-id");
    // var currentVersion = objID.data("version");
    var currentVersion = jQuery('#' + pluginId + '-row input.plugin_version').val();
    if (debug()) console.log('onVersionChange-pluginId: '+pluginId+' currentVersion:'+currentVersion);
    if (debug()) console.log('onVersionChange-objID: ',objID);
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
          // currentVersion = objID.data("version");  // this works magically: the value is actually not updated in the DOM so where does it come from?
          currentVersion = jQuery('#' + pluginId + '-row input.plugin_version').val();
          if (debug()) console.log('onVersionChange-currentVersion: ',currentVersion);  // 1.7.1
          if (debug()) console.log('onVersionChange-data.results[0]: ',data.results[0]);  // Object { name: "clipboard.js", latest: "https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/1.7.1/clipboard.min.js", assets: Array[26] }
          if (debug()) console.log('onVersionChange-data.results[0].assets[0]: ',data.results[0].assets[0]);  //Object { version: "1.7.1", files: Array[2] }

          var assets = data.results[0].assets; // Object [{ version: "1.7.1", files: Array[react-popper.js,react-popper.min.js] },{..}]
          for(i = 0; i < assets.length; i++) {
            if(currentVersion == assets[i].version) {
            if (debug()) console.log('onVersionChange-checking assets[i]: ',assets[i]);
            results.push({
              id:   assets[i].version,
              text: assets[i].version,
              disabled: true
            });
            if (debug()) console.log('onVersionChange-checking results  : ',results);
              // break;
            } else {
            results.push({
              id:   assets[i].version,
              text: assets[i].version,
              disabled: false
            });
            }

          }
          // if (debug()) console.log('onVersionChange-data: ',data); //  Array [ Object, 88 more… ]
          // return data;
          if (debug()) console.log('onVersionChange-results: ',results); //  
          return {
            results: results
          };

        }
      },
      formatSelection:    formatVersionSelection
    });

    // update usedPlugins list for next Library browse
    function formatVersionSelection(data, container) {
      currentVersion = data.version;
      return data.version;
    }

    //Call on change for assest
    objID.on('select2-selecting', function(e, data) {
      if(!e.object) {
        e.object = data;
      }
      if (debug()) console.log('onVersionChange-e.object: ',e.object);  // Object { id: "core.js", text: "core.js" }
      if (debug()) console.log("onVersionChange-objID.data('plugin-name'): "+objID.data("plugin-name"));  //jquery
      if (debug()) console.log("onVersionChange-"+objID.data("plugin-name")+"-currentVersion="+objID.data("version")+" newVersion="+e.object.text);
      
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
  if (debug()) console.log('addLibraryRow-data: ',data);  //Object { name: "react-popper", latest: "https://cdnjs.cloudflare.com/ajax/l…", version: "0.7.4", filename: "react-popper.min.js", description: "React wrapper around PopperJS.", assets: Array[23], disabled: false }
  var assets = data.assets[0].files;
  var default_asset = data.filename;
  if (debug()) console.log('addLibraryRow-default_asset: ',default_asset);  //Object { version: "0.7.4", files: Array[2] }
  var nameID = cleanName(data.name);

  if (!jQuery('#cdnjs_settings_avoid_minified').prop("checked")) {
    // check to see if the default asset is minified, if not check to see if a min exists
    if(default_asset.indexOf('.min.') == -1) {
      for(i = 0; i < assets.length; i++) {
        // if min version exists make it the default
        if (debug()) console.log('addLibraryRow-assets[i]:'+assets[i]);
        var tmp = assets[i];
        if(default_asset == tmp.replace('.min', '')) {
          default_asset = assets[i];
          if (debug()) console.log('addLibraryRow-default_asset+min: '+default_asset);
        }
      }
    }
  } else {
    // check to see if the default asset is minified, if so check to see if a non min exists
    if(default_asset.indexOf('.min.') > -1) {
      for(i = 0; i < assets.length; i++) {
        // if non min version exists make it the default
        if (debug()) console.log('addLibraryRow-getNonMin-assets[i]:'+assets[i]);
        var tmp = assets[i];
        if(tmp == default_asset.replace('.min', '')) {
          default_asset = tmp;
          if (debug()) console.log('addLibraryRow-getNonMin-default_asset-min: '+default_asset);
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
  row += '<td class="wp-cdnjs_choose_version"><input type="hidden" id="' + nameID + '-choose_version" data-plugin-id="' + nameID + '" data-plugin-name="' + data.name + '" data-version="' + data.version + '" class="select2-version"></td>';
  row += '<td class="wp-cdnjs_assets">';
  row += '<div id="' + nameID + '-asset-holder" class="included_assets">';
  row += '<div id="' + cleanName(default_asset) + '-asset-row"><strong>'+default_asset+'</strong>';
  row += ' <i title="' + cdnjs_text.remove + '" style="cursor:pointer" class="fa fa-times" onclick="removeRow(\'#' + cleanName(default_asset) + '-asset-row\');"></i><br />';
  row += '<input type="hidden" name="cdnjs[cdnjs_settings_scripts][' + nameID + '][assets][]" value="' + default_asset + '">';
  row += '</div>';
  row += '</div>';
  row += '</td>';
  row += '<td class="wp-cdnjs_add_assets"><input type="hidden" id="' + nameID + '-add_assets" data-plugin-name="' + data.name + '" data-asset-id="' + cleanName(default_asset) + '" data-asset-file="' + default_asset + '" class="select2-assets"></td>';
  row += '<td class="wp-cdnjs_location"><select name="cdnjs[cdnjs_settings_scripts][' + nameID + '][location]" id=""><option value="1" selected="selected">' + cdnjs_text.footer + '</option><option value="0">' + cdnjs_text.header + '</option></select></td>';
  row += '<td class="wp-cdnjs_enable"><input type="hidden" name="cdnjs[cdnjs_settings_scripts][' + nameID + '][enabled]" id="" value="0"><input type="checkbox" name="cdnjs[cdnjs_settings_scripts][' + nameID + '][enabled]" id="" value="1" checked="checked"></td>';
  row += '<td><span class="wp-cdnjs-remove-row button-secondary">' + cdnjs_text.remove + '</span></td>';
  row += '</tr>';

  jQuery(location).append(row);
  jQuery('#cdnjs-selected tr:odd').addClass('alternate');
  onVersionChange();
  onAssetChange();
}

function addAssetRow(data, location) {
  if (debug()) console.log('addAssetRow-data: ',data);  //Object { id: "umd/popper.min.js", text: "umd/popper.min.js" }
  if (debug()) console.log('addAssetRow-location: '+location);  //popper.js
  var parentId = cleanName(location);
  var assetId = cleanName(data.text);
  var row = '<div id="' + assetId + '-asset-row">';
  row += data.text;
  row += ' <i title="' + cdnjs_text.remove + '" style="cursor:pointer" class="fa fa-times" onclick="removeRow(\'#' + assetId + '-asset-row\');"></i><br />';
  row += '<input type="hidden" name="cdnjs[cdnjs_settings_scripts][' + parentId + '][assets][]" value="' + data.text + '"/>';
  row += '</div>';
  if (debug()) console.log('addAssetRow-parentId: '+'#' + parentId + '-row div.included_assets');  //#jquery-row div.included_assets
  jQuery('#' + parentId + '-row div.included_assets').append(row);
}

function changeVersion(location, newVersion) {
  var parentId = cleanName(location);
  jQuery('#' + parentId + '-row span.currentVersion').text(newVersion);
  jQuery('#' + parentId + '-row input.plugin_version').val(newVersion);
  // @todo: BUG: for some reason, these 2 lines do not update the newVersion:
  jQuery('#' + parentId + '-choose_version').data('version', newVersion);
  jQuery('#' + parentId + '-choose_version').val(newVersion);
}

function removeRow(row_id) {
  // disable deletion if there is only one asset (only one #assetId-asset-row)
  if (debug()) console.log('removeRow('+row_id+'):jQuery(row_id).parent().children().size()='+jQuery(row_id).parent().children().size());
  if (jQuery(row_id).parent().children().size() > 1) {
    jQuery(row_id).remove();
  } else {
    jQuery('h1').after( '<div id="setting-error-settings_updated" class="updated settings-error notice error is-dismissible">\
    <p><strong>'+cdnjs_text.cannot_remove+'</strong></p>\
    <button type="button" class="notice-dismiss" onClick="div=this.parentElement;div.parentElement.removeChild(div);">\
      <span class="screen-reader-text">'+cdnjs_text.dismiss+'</span>\
    </button></div>' );
  }
}
