/*global define */
define([
    'jquery'
    ,'underscore'
    ,'vq'
    ,'queue'
    ,'url'
    ,'scatterplot'
    ], 
function ($, _, vq, queue, URL, scatterplot) {
    'use strict';

    var options = {
        "dataset" : "gbm_2013_pub_tumor_only"
    };

function populateScatterplots(data) {
    var gene = data["GEXP"],
        rppa = data["RPPA"],
        mirn = data["MIRN"];

    $.when( feature_request(gene,"GEXP"), feature_request(rppa.split(':')[0], "RPPA", rppa.split(':')[1]), feature_request(mirn,"MIRN"))
            .done( function(g_data, r_data, m_data ) {
                drawFeatureScatterplot(JSON.parse(g_data[0])[0],JSON.parse(r_data[0])[0]);
                drawFeatureScatterplot(JSON.parse(m_data[0])[0],JSON.parse(r_data[0])[0]);
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

  function drawFeatureScatterplot(x_axis,rppa) {
        var type = x_axis.alias.split(':')[1],
        rppa_values = rppa.patient_values.split(":").map(parseFloat),
        x_values = x_axis.patient_values.split(":").map(parseFloat);

        var data_array = _.map(rppa_values, function(val, index) { 
            var obj = {"RPPA" : val};
            obj[type] = x_values[index]; 
            return obj;
        });

        $('#' + type.toLowerCase() + "_scatterplot").html("");

        var x_fields = x_axis.alias.split(':'),
        x_label = x_fields[1] + ' ' + x_fields[2],
        rppa_fields = rppa.alias.split(':'),
        rppa_label = rppa_fields[2] +' ' + rppa_fields[7];

        data_array = data_array.filter(function(obj) { return _.isFinite(obj["RPPA"] + obj[type]);});

        var tooltip_obj = {};
        tooltip_obj[x_label] = type;
        tooltip_obj[rppa_label] = 'RPPA';

         var feature_sp =  new vq.ScatterPlot();  
         var plot_data = {
                    DATATYPE : "vq.models.ScatterPlotData",
                    CONTENTS : {
                        PLOT : {
                            container: document.getElementById(type.toLowerCase() + "_scatterplot"),
                            width : 300, height: 250,
                            dblclick_notifier : function() {},
                            vertical_padding : 80,
                            horizontal_padding: 100,
                            x_label_displacement: 40,
                            y_label_displacement: -70,
                            x_tick_displacement: 20,
                            enable_transitions: true
                        },
                        axis_font :"20px helvetica",
                        tick_font :"20px helvetica",
                        stroke_width: 2,
                        radius: 3,
                        data_array: data_array,
                        regression: 'none',
                        ycolumnid: type,
                        xcolumnid: 'RPPA',
                        valuecolumnid: 'id',
                        tooltip_items : tooltip_obj,
                        tooltip_timeout : 200,
                        ycolumnlabel: x_label,
                        xcolumnlabel: rppa_label,
                        brush_handler: function(d) {
                            console.log(d);
                        },
                        click_handler: function(d) {
                        },
                    }
                };
                feature_sp.draw(plot_data);
                return feature_sp;
        }

  function drawCorrelationScatterplot (data_array) {
               var corr_sp =  new vq.ScatterPlot();

                var plot_data = {
                    DATATYPE : "vq.models.ScatterPlotData",
                    CONTENTS : {
                        PLOT : {
                            container: document.getElementById("corr_scatterplot"),
                            width : 500, height: 400,
                            dblclick_notifier : function() {},
                            vertical_padding : 80,
                            horizontal_padding: 100,
                            x_label_displacement: 40,
                            y_label_displacement: -70,
                            x_tick_displacement: 20,
                            enable_transitions: true
                        },
                        axis_font :"20px helvetica",
                        tick_font :"20px helvetica",
                        stroke_width: 2,
                        radius: 3,
                        data_array: data_array,
                        regression: 'none',
                        ycolumnid: 'gexp_corr',
                        xcolumnid: 'mirn_corr',
                        valuecolumnid: 'id',
                        tooltip_items : {
                            Gene : 'GEXP',
                            Protein : 'RPPA',
                            miRNA : 'MIRN',
                            'Gene Corr' : 'gexp_corr',
                            'miRNA Corr' : 'mirn_corr'
                         },
                        tooltip_timeout : 200,
                        ycolumnlabel: 'GEXP<->RPPA Correlation',
                        xcolumnlabel: 'miRNA<->RPPA Correlation',
                        brush_handler: function(d) {
                            console.log(d);
                        },
                        click_handler: function(d) {
                            populateScatterplots(d);
                        },
                    }
                };
                corr_sp.draw(plot_data);
                return corr_sp;
        }

  var Application = {
  
    initialize: function() {
        var url = new URL(window.location);
        _.extend(options, url.params);

        queue()
        .defer(d3.json, "data/gbm-pub2013.json")
        .await( function (err, points) {
            drawCorrelationScatterplot(points);
            $('#highlight').autocomplete({source: _.pluck(points,'GEXP')});
        });


        

    }

};

    return Application;
});