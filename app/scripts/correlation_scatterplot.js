define([
    'scatterplot'
    ,'jquery'
], function(scatterplot, $) {

    return function drawCorrelationScatterplot (config) {
            var __ = {
                data_array: [],
                click_handler : function() {},
                brush_handler : function() {},
                color_property : 'mirn_gexp_corr',
                xcolumn_id : 'mirn_corr',
                xcolumnlabel: 'miRNA <-> RPPA Correlation'
            };

            $.extend(__, config);

            var $container = $("#corr_scatterplot"),
            container = $container.get(0);

            var divergentColorScale = ['#D7191C', '#FFFFBF', '#2B83BA']; //peach, yellow, green

            linearScale = d3.scale.linear().domain([.7,0,-.7]).range(divergentColorScale),
            colorDataFn = function colorPoint(data) {
                return linearScale(data[__.color_property]);
            }

            $container.html("");

            var corr_sp =  new vq.ScatterPlot();

            var plot_data = {
                DATATYPE : "vq.models.ScatterPlotData",
                CONTENTS : {
                    PLOT : {
                        container: container,
                        width : 500, height: 400,
                        vertical_padding : 40,
                        horizontal_padding: 100,
                        x_label_displacement: 40,
                        y_label_displacement: -70,
                        x_tick_displacement: 20,
                        enable_transitions: true
                    },
                    axis_font :"20px helvetica",
                    tick_font :"20px helvetica",
                    stroke_width: .5,
                    radius: 3,
                    regression: 'none',
                    ycolumnid: 'gexp_corr',
                    xcolumnid: __.xcolumn_id,
                    valuecolumnid: 'id',
                    tooltip_items : {
                        Gene : 'GEXP',
                        Protein : 'RPPA',
                        miRNA : 'MIRN',
                        'RPPA/Gene Corr' : 'gexp_corr',
                        'RPPA/miRNA Corr' : 'mirn_corr',
                        'Gene/miRNA Corr' : 'gexp_mirn_corr'
                     },
                    tooltip_timeout : 200,
                    ycolumnlabel: 'GEXP <-> RPPA Correlation',
                    xcolumnlabel: __.xcolumnlabel
                }
            };

            __.fill_style = colorDataFn;
            __.stroke_style = 'black';

            $.extend(plot_data.CONTENTS, __);

            corr_sp.draw(plot_data);
            return corr_sp;
        };
});
