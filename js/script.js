/* Author: Matjaž Horvat

*/

$(function() {

  var locales = {};

  function render() {
  	for (var locale in locales) {
  	  var ids = [];
  	  $(locales[locale]).each(function() {
        ids.push(this.id);
  	  });
      $('table').append(
        '<tr class="' + locale + '"><td>' + 
        '<a href="https://bugzilla.mozilla.org/show_bug.cgi?id=' + ids.join(', ') + '">' + locale + '</a>' + 
        '</td></tr>');
    }
  }

  /* Parses locales and categories from bug summary:
   * [locale code][and][banner][categories]
   */
  function parse(summary) {
  	var meta = [];
    $(summary.split("[")).each(function() {
      var temp = this.split("]");
      if (temp.length === 2) {
        meta.push(temp[0]);
      }
    });
    return meta;
  }

  function add(bug) {
    var meta = parse(bug.summary);
    if (meta.length === 0) {
      meta = ["Other bugs"];
    }

    var o = {
          id: bug.id,
          categories: meta
        },
        locale = meta[0];

    if (!locales[locale]) {
      locales[locale] = [o];
    } else {
      locales[locale].push(o);
    }
  }
  
  $.ajax({
  	url: 'https://api-dev.bugzilla.mozilla.org/0.9/bug', 
  	dataType: 'json',
  	data: {
      product: 'Websites',
      component: 'affiliates.mozilla.org banners'
    }, 
  	success: function(data) {
      /* Test data */
  	  data.bugs = [
        {
          id: 685443,
          summary: "[sq] Affiliates program: banners localization and layout"
        },
        {
          id: 111,
          summary: "[sl][aurora] Bug summary with 2 categories"
        },
        {
          id: 222,
          summary: "[he][beta][mobile] Bug summary with 3 categories"
        },
        {
          id: 333,
          summary: "[sl][thunderbird][aurora][beta] Bug summary with 4 categories"
        },
        {
          id: 444,
          summary: "Bug summary with 0 categories -> IGNORE"
        }
  	  ];

      $(data.bugs).each(function() {
        add(this);
      });

      render();
    }
  });
});


