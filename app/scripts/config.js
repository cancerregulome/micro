require.config({

  baseUrl: 'scripts',

  paths: {
      jquery: '../bower_components/jquery/jquery',
      "jQuery-ui": "../bower_components/jquery-ui/ui/jquery-ui",
      bootstrap: 'vendor/bootstrap',
      d3: '../bower_components/d3/d3',
      modernizr: '../bower_components/modernizr',
      queue: '../bower_components/queue-async/queue',
      underscore: '../bower_components/underscore/underscore',
      vq : '../bower_components/visquick/vq',
      scatterplot : '../bower_components/visquick/vq.scatterplot'
  },
  shim: {
       'underscore' : {
          'exports' : '_'
      },
      "jQuery-ui" : {
          "deps": ["jquery"],
          "exports" : "$"
      },
      d3 : {
          'exports' : 'd3'
      },
      queue : {
          'exports' : 'queue'
      },
      'vq' : {
          'deps' : ['d3','underscore'],
          'exports' : 'vq'
      },
      'scatterplot' : {
          'deps' : ['d3' , 'vq', 'underscore'],
          'exports' : 'scatterplot'
      },
      bootstrap : {
          deps : ['jquery','jQuery-ui'],
          exports : 'bootstrap'
      }
  }

});

require(['app', 'jquery', 'jQuery-ui', 'bootstrap'], function (app, $) {
    'use strict';
    app.initialize();
});