require.config({

  baseUrl: 'scripts',

  paths: {
      jquery: '../components/jquery/jquery',
      "jQuery-ui": "../components/jquery-ui/ui/jquery-ui",
      bootstrap: 'vendor/bootstrap',
      url : '../components/url-js/url',
      d3: '../components/d3/d3',
      modernizr: '../components/modernizr',
      queue: '../components/queue-async/queue',
      underscore: '../components/underscore/underscore',
      // science : '../components/science/science.v1',
      vq : '../components/visquick/vq',
      scatterplot : '../components/visquick/vq.scatterplot'
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
      url : {
          'deps' : ['underscore'],
          'exports' : 'URL'
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