define([
    'scatterplot'
],
function ( scatterplot) {


return function drawFeatureScatterplot (config) {

       var __ = {
                x_axis : "N:GEXP:FAKE:::::",
                rppa : "N:RPPA:FAKE:::::",
                click_handler : function() {},
                brush_handler : function() {},
            };

            $.extend(__, config);

        var type = __.x_axis.alias.split(':')[1],
        rppa_values = __.rppa.patient_values.split(":").map(parseFloat),
        x_values = __.x_axis.patient_values.split(":").map(parseFloat);

        var data_array = _.map(rppa_values, function(val, index) { 
            var obj = {"RPPA" : val};
            obj[type] = x_values[index]; 
            return obj;
        });

        $('#' + type.toLowerCase() + "_scatterplot").html("");

        var x_fields = __.x_axis.alias.split(':'),
        x_label = x_fields[1] + ' ' + x_fields[2],
        rppa_fields = __.rppa.alias.split(':'),
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
                            vertical_padding : 40,
                            horizontal_padding: 50,
                            x_label_displacement: 30,
                            y_label_displacement: -24,
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
                        xcolumnlabel: rppa_label
                    }
                };
         
         $.extend(plot_data.CONTENTS, __);

        feature_sp.draw(plot_data);
        return feature_sp;
        };
});