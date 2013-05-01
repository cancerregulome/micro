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

  var Application = {
  
    initialize: function() {
        var url = new URL(window.location);
        _.extend(options, url.params);

        queue()
        .defer(d3.json, "data/gbm-pub2013.json")
        .await( function (err, points) {
            drawScatterplot(points);
        });

        function drawScatterplot (data_array) {
               var sp =  new vq.ScatterPlot();

                var plot_data = {
                    DATATYPE : "vq.models.ScatterPlotData",
                    CONTENTS : {
                        PLOT : {
                            container: document.getElementById("scatterplot"),
                            width : 824, height: 624,
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
                        ycolumnlabel: 'GEXP<->RPPA Correlation',
                        xcolumnlabel: 'uRNA<->RPPA Correlation',
                        brush_handler: function(d) {
                            console.log(d);
                        }
                    }
                };

                $("#btn-toggle-brush").on("click", function() {
                    sp.enableBrush();
                });

                $("#btn-toggle-zoom").on("click", function() {
                    sp.enableZoom();
                });

                sp.draw(plot_data);
                return sp;
        }

    }

};

    return Application;
});