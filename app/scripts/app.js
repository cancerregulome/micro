/*global define */
define([
    'jquery'
    ,'underscore'
    ,'vq'
    ,'queue'
    ,'url'
    ,'feature_scatterplot'
    ,'correlation_scatterplot'
    ], 
function ($, _, vq, queue, URL, featureScatterPlot, correlationScatterPlot) {
    'use strict';

    var options = {
        "dataset" : "gbm_2013_pub_tumor_only"
    };

    var data_points = [],
        main_plot;

function populateScatterplots(data) {
    var gene = data["GEXP"],
        rppa = data["RPPA"],
        mirn = data["MIRN"];

    $.when( feature_request(gene,"GEXP"), feature_request(rppa.split(':')[0], "RPPA", rppa.split(':')[1]), feature_request(mirn,"MIRN"))
            .done( function(g_data, r_data, m_data ) {
                featureScatterPlot({
                    x_axis: JSON.parse(g_data[0])[0],
                    rppa: JSON.parse(r_data[0])[0]
                    });

                featureScatterPlot({
                    x_axis: JSON.parse(m_data[0])[0],
                    rppa: JSON.parse(r_data[0])[0]
                });
            });

  }

  function feature_request (label, type, modifier) {
    return $.ajax("/google-dsapi-svc/addama/datasources/re/gbm_2013_pub_tumor_only_features/query?tq="
         + encodeURIComponent('select alias, patient_values where `label` = \'' + 
                label + '\' and source = \'' +  type + '\'' +
                (_.isUndefined(modifier) ? '' : ' and label_desc = \'' + modifier + '\' ')
                + ' limit 1')
          + "&tqx=" + encodeURIComponent('out:json_array'));
  }

        function closeHelpPanel(){

        }

    (function($){ 

         jQuery.fn.showPanel = function(callback) {
             var o = $(this); 
               o.show({
                            effect:'blind',
                            easing: 'swing',
                            duration:400,
                            complete: callback
                        });
        };

        jQuery.fn.hidePanel = function(callback) {
             var o = $(this); 
             o.hide({
                    effect:'blind',
                    easing: 'swing',
                    duration:400,
                    complete : callback
            });
        };

        jQuery.fn.swingPanel = function(callback, in_and_out, time) { 
            var time = time || 2000;
            var in_and_out = false || in_and_out;
            var callback = callback || noop;

            var o = $(this); 
            
            var delay = in_and_out;
            var completeFunction = in_and_out ? function() { 
                    o.delay(time)
                    .hidePanel(callback);
            } : callback;

            o.showPanel(completeFunction);
        };
    })(jQuery);

    function showHelpPanel(callback, doFlash) {
        var doFlash = doFlash || false;
        var new_callback = callback || noop;

        if (doFlash) {
            new_callback = function() {
                $('#helpPanel a.close-help-btn').show(); 
                toggleHelpButton(); 
                callback();
            };
            $('#helpPanel a.close-help-btn').hide();
        }
        toggleHelpButton();
        $('#helpPanel').swingPanel(new_callback, doFlash);
    }

    function flashHelpPanel() {
        showHelpPanel(noop, true);
    }

    function noop() { $.noop(); }

    function toggleHelpButton() {
        $('#helpButton').toggle('highlight');
    }

    function addHelpButtonEvent() {
        $('#helpButton').on('click', _.debounce(function() {showHelpPanel(noop, false)}, 300, true) );
        $('#helpPanel a.close-help-btn').on('click',  _.debounce(function() { $('#helpPanel').hidePanel(toggleHelpButton) }, 300, true) )
    }
    function addXAxisButtonEvents() {
        $('.xaxis_mapping').on('click','button', function(evt, ui) {
            var value = $(this).val();
            if ( value === 'RPPA' ){
                   correlationScatterPlot({
                                data_array: data_points,
                                click_handler: function(d) { populateScatterplots(d); },
                                color_property : 'mirn_gexp_corr',
                                xcolumn_id : 'mirn_corr',
                                xcolumnlabel: 'miRNA <-> RPPA Correlation'
                                });
            } else if (value === 'GEXP') {
                    correlationScatterPlot({
                                data_array: data_points,
                                click_handler: function(d) { populateScatterplots(d); },
                                color_property : 'mirn_corr',
                                xcolumn_id : 'mirn_gexp_corr',
                                xcolumnlabel: 'miRNA <-> GEXP Correlation'
                                });
            }
        });
    }

    function addElementEvents() {
        addHelpButtonEvent();
        addXAxisButtonEvents();
    }

  var Application = {
  
    initialize: function() {
        var url = new URL(window.location);
        _.extend(options, url.params);

        queue()
        .defer(d3.json, "data/gbm-pub2013.json")
        .await( function (err, points) {
            addElementEvents();
            flashHelpPanel();
            correlationScatterPlot({
                data_array: points,
                click_handler: function(d) { populateScatterplots(d); },
                color_property : 'mirn_gexp_corr',
                xcolumn_id : 'mirn_corr',
                xcolumnlabel: 'miRNA <-> RPPA Correlation'
            });
            $('#highlight').autocomplete({source: _.pluck(data_points,'GEXP')});
            data_points = points;
        });

    }

};

    return Application;
});