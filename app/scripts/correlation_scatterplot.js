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

            var divergentColorScale = ['#ee0404', '#FFFF11', '#2B33CC']; //peach, yellow, green
            var color_data = _.pluck(__.data_array,__.color_property);
            var domain = d3.extent(color_data);
            domain.splice(1,0,d3.median(color_data));

            linearScale = d3.scale.linear().domain(domain).range(divergentColorScale),
            colorDataFn = function colorPoint(data) {
                return linearScale(data[__.color_property]);
            }

            $container.html("");
            var sp = { version: '0.0.1'};
            sp.corr_sp =  new vq.ScatterPlot();

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

            sp.corr_sp.draw(plot_data);

            sp.legend = function(selection) {
                var domain = linearScale.domain(),
                range = linearScale.range(),
                width = $(selection).width() || 200,
                height = $(selection).height() || 20,
                bar_scale = d3.scale.linear().domain(domain).range([0,width/2,width]),
                $canvas = $('<canvas>').attr({id:'correlation_legend',width:width, height:height});

                var canvas = $canvas.get(0);
                $(selection).empty();
                
                $(selection).append(canvas);  
                
                var ctx = canvas.getContext("2d");
                ctx.clearRect(0, 0, width, height);

                var grad = ctx.createLinearGradient(0,0, width,0);
                grad.addColorStop(0,range[0]);
                grad.addColorStop(0.5,range[1]);
                grad.addColorStop(1,range[2]);

                ctx.rect(0, 0, width, height);
                ctx.fillStyle=grad;
                ctx.fill();

                var color_axis = d3.svg.axis()
                                    .orient('bottom')
                                    .ticks(5)
                                    .tickSize(6, 0, 6)
                                    .scale(bar_scale);

                d3.select(selection).append('svg')
                    .attr('width',width)
                    .attr('height',30)
                .append('g')
                    .attr('class','x axis')
                    .call(color_axis);

            };

            return sp;
        };
});
