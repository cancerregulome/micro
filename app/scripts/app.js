/*global define */
define([
    'jquery'
    ,'underscore'
    ,'vq'
    ,'queue'
    ,'feature_scatterplot'
    ,'correlation_scatterplot'
    ], 
function ($, _, vq, queue, featureScatterPlot, correlationScatterPlot) {
    'use strict';

    var options = {
        "dataset" : "gbm_2013_pub_tumor_only"
    };

    var data_points = [],
        main_plot;

    var csp, xExtent;

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
   
    function addXAxisButtonEvents() {
        $('.xaxis_mapping').on('click','button', function(evt, ui) {
            var value = $(this).val();
            if ( value === 'RPPA' ){
                   csp = correlationScatterPlot({
                                data_array: data_points,
                                click_handler: function(d) { populateScatterplots(d); },
                                color_property : 'mirn_gexp_corr',
                                xscale: xExtent,
                                xcolumn_id : 'mirn_corr',
                                xcolumnlabel: 'miRNA <-> RPPA Correlation'
                                }).legend('#color_legend','miRNA <-> GEXP Correlation');
            } else if (value === 'GEXP') {
                    csp = correlationScatterPlot({
                                data_array: data_points,
                                click_handler: function(d) { populateScatterplots(d); },
                                color_property : 'mirn_corr',
                                xscale: xExtent,
                                xcolumn_id : 'mirn_gexp_corr',
                                xcolumnlabel: 'miRNA <-> GEXP Correlation'
                                }).legend('#color_legend','miRNA <-> RPPA Correlation');
            }
        });
    }

    function addElementEvents() {
        addXAxisButtonEvents();
        
            $('#highlight').on('autocompleteselect', function( event, ui ) {
                    var data_obj = {};
                    data_obj[ui.item[0]] = ui.item[1];
                    csp.corr_sp.highlight(data_obj);
                    $(this).val(ui.item[1]);
                    return false;
                });
    }

  var Application = {
  
    initialize: function() {

        queue()
        .defer(d3.json, "data/gbm-pub2013.json")
        .await( function (err, points) {
            addElementEvents();
            xExtent = d3.extent(_.flatten(_.map(points,function(p) { return [ p['mirn_corr'],p['mirn_gexp_corr']]; })));
            csp = correlationScatterPlot({
                data_array: points,
                click_handler: function(d) { populateScatterplots(d); },
                color_property : 'mirn_gexp_corr',
                xcolumn_id : 'mirn_corr',
                xcolumnlabel: 'miRNA <-> RPPA Correlation',
                xscale: xExtent
            }).legend('#color_legend','miRNA <-> GEXP Correlation');

            $('#highlight').autocomplete({
                source: _.uniq(
                                _.flatten(
                                    _.map(points, function(p) { 
                                            return _.pairs(_.pick(p, ['GEXP', 'MIRN','RPPA']));
                                        }), 
                                    true), function(a) { return a[0] +'' + a[1];} ),
                minLength: 2,
                delay: 200
            })
            .data( "ui-autocomplete" )._renderItem = function( ul, item ) {
                  return $( "<li>" )
                    .append(  "<a>" + item[1] + "</a>" )
                    .appendTo( ul );
            };

            data_points = points;
        });

    }

};

    return Application;
});