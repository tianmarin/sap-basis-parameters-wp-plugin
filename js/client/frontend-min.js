jQuery(document).ready(function($){$(document).on({ajaxStart:function(){$("#aa_loading").addClass("abap_frontend_loading")},ajaxStop:function(){$("#aa_loading").removeClass("abap_frontend_loading")}}),$.fn.extend({animateCss:function(a,n){"on"===n&&$(this).show();var o="webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend";this.addClass("animated	"+a).one(o,function(){"off"===n&&$(this).hide(),"on"===n&&$(this).show(),$(this).removeClass("animated"+a)})},abapChangeScreen:function(a,n){var o=$(this);$(this).fadeOut(500).queue(function(t){$.ajax({url:aa_url+a,cache:!1,dataType:"html"}).done(function(n){window.console.log("HTML "+aa_url+a+" cargado"),o.html(n)}),$.getScript(aa_url+n).done(function(){window.console.log("Script "+aa_url+n+" cargado")}),t()}).fadeIn(500)}}),$("#aa_content").abapChangeScreen("html/analysis_adjust.html","js/client/analysis_adjust.js")});