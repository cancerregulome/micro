require.config({

  baseUrl: 'scripts',

  deps: [
    // 'hbs', /* need Handlebars loader */
    "main" /* main.js loads next */
  ],

  "paths": {
      "jQuery": "../components/jquery/jquery",
      "bootstrap": "vendor/bootstrap",
      "url" : "../components/url-js/url",
      "d3": "../components/d3/d3",
      "modernizr": "../components/modernizr",
      "queue": "../components/queue-async/queue",
      "underscore": "../components/underscore/underscore",
      // "science" : "../components/science/science.v1",
      "vq" : "../components/visquick/vq",
      "scatterplot" : "../components/visquick/vq.scatterplot",
      'hbs' : '../components/require-handlebars-plugin/hbs',
      'handlebars' : '../components/require-handlebars-plugin/Handlebars',
      'json2' : '../components/require-handlebars-plugin/hbs/json2',
      'i18nprecompile' : '../components/require-handlebars-plugin/hbs/i18nprecompile',
  },
  "shim": {
     "bootstrap": {
            "deps": ['jQuery'],
            "exports": 'jquery'
        },
       "underscore" : {
          "exports" : "_"
      },
       "d3" : {
          "exports" : "d3"
      },
       "queue" : {
          "exports" : "queue"
      },
      "url" : {
          "deps" : ['underscore'],
          "exports" : "URL"
      },
      "vq" : {
          "deps" : ['d3','underscore'],
          "exports" : "vq"
      },
      "scatterplot" : {
          "deps" : ["d3" , "vq", "underscore"],
          "exports" : "scatterplot"
      }
  },
  "hbs" : {
      "templateExtension" : 'hbs',
      "disableI18n" : true,
      "helperPathCallback" :       // Callback to determine the path to look for helpers
      function (name) {       // ('/template/helpers/'+name by default)
        return 'templates/helpers/' + name;
      }
  },

  callback: function(o) {
    try {
      console.log('config complete');
    } catch(e) {
      /* No console */
    }
  }

});