jQuery(document).ready(function($){var e=aaWPADMIN.ppost;$.fn.extend({aaSearchElementList:function(){var a=$(this).closest("form"),t=new FormData;t.append("id",$("input[name='"+e+"[id]']").val()),t.append("action",a.data("search-action")),a.find(':input[type!="hidden"]').not(":input[type=button], :input[type=submit], :input[type=reset]").each(function(){t.append($(this).attr("name").replace(e,"").replace("[","").replace("]",""),$(this).val())}),$.ajax({url:ajaxurl,type:"POST",data:t,cache:!1,dataType:"json",processData:!1,contentType:!1,beforeSend:function(){},success:function(e){if(window.console.log(JSON.stringify(e)),$("#aa-new-element-list").html(""),e.elementCount>0)$.each(e.data,function(e,a){var t=$('<div class="list-group-item"></div>'),n=$('<button type="button" class="close pull-right" aria-label="open" data-element-id="'+a.elementId+'"><span aria-hidden="true">+</span></button>');n.click(function(){$(this).aaAddClassElement()}),t.append(n),t.append(a.elementTitle),t.append(a.elementBody),$("#aa-new-element-list").append(t).hide().fadeIn()});else{window.console.log(JSON.stringify(e));var a=$('<div class="list-group-item"></div>');a.append(e.noElementTitle),a.append(e.noElementBody),$("#aa-new-element-list").append(a).hide().fadeIn()}}})},aaGetElementList:function(){var a=$(this),t=new FormData;t.append("action",a.data("get-action")),t.append("id",$("input[name='"+e+"[id]']").val()),$.ajax({url:ajaxurl,type:"POST",data:t,cache:!1,dataType:"json",processData:!1,contentType:!1,beforeSend:function(){},success:function(e){if(window.console.log(JSON.stringify(e)),$("#aa-element-list").html(""),e.elementCount>0)$.each(e.data,function(e,a){var t=$('<div class="list-group-item"></div>'),n=$('<button type="button" class="close pull-right" aria-label="close" data-element-id="'+a.elementId+'"><span aria-hidden="true">&times;</span></button>');n.click(function(){$(this).aaRemoveClassElement()}),t.append(n),t.append(a.elementTitle),t.append(a.elementBody),$("#aa-element-list").append(t).hide().fadeIn()});else{var a=$('<div class="list-group-item"></div>');a.append(e.noElementTitle),a.append(e.noElementBody),$("#aa-element-list").append(a).hide().fadeIn()}},error:function(e,a,t){window.console.log("ERROR: : "+e+" - "+a+" - "+t),window.console.log("Error. Contacte a su Adminsitrador.")}})},aaRemoveClassElement:function(){var a=$(this).data("element-id"),t=new FormData;t.append("action",$("#aa-ajax-wp-filter").data("remove-action")),t.append("element_id",a),t.append("id",$("input[name='"+e+"[id]']").val()),$.ajax({url:ajaxurl,type:"POST",data:t,cache:!1,dataType:"json",processData:!1,contentType:!1,beforeSend:function(){},success:function(e){window.console.log(JSON.stringify(e)),"ok"===e.status&&$("#aa-ajax-wp-filter").aaGetElementList()},error:function(e,a,t){window.console.log(e),window.console.log("ERROR: :  - "+a+" - "+t)}})},aaAddClassElement:function(){var a=$(this).data("element-id"),t=new FormData;t.append("action",$("#aa-ajax-wp-filter").data("add-action")),t.append("element_id",a),t.append("id",$("input[name='"+e+"[id]']").val()),$.ajax({url:ajaxurl,type:"POST",data:t,cache:!1,dataType:"json",processData:!1,contentType:!1,beforeSend:function(){},success:function(e){window.console.log(JSON.stringify(e)),"ok"===e.status&&($("#aa-ajax-wp-filter").aaGetElementList(),$("#aa-new-element-list").html(""))},error:function(e,a,t){window.console.log(e),window.console.log("ERROR: :  - "+a+" - "+t)}})}}),$("#aa-ajax-wp-filter").submit(function(e){e.preventDefault()}),void 0!==$("#aa-ajax-wp-filter").data("get-action")&&($("#aa-ajax-wp-filter").aaGetElementList(),$('#aa-ajax-wp-filter input[type!="hidden"], #aa-ajax-wp-filter select').each(function(){$(this).on("input",function(){$(this).aaSearchElementList()})}),$("#aa-ajax-wp-filter .aa-sortable").sortable({axis:"y",placeholder:"placeholder",opacity:.8,start:function(){},stop:function(){var a=[];$(this).find(".list-group-item button").each(function(){a.push($(this).data("element-id"))}),window.console.log(a);var t=$(this).closest("form"),n=new FormData;n.append("id",$("input[name='"+e+"[id]']").val()),n.append("action",t.data("update-action")),n.append("element_ids",a),$.ajax({url:ajaxurl,type:"POST",data:n,cache:!1,dataType:"json",processData:!1,contentType:!1,beforeSend:function(){},success:function(e){window.console.log(JSON.stringify(e))},error:function(e,a,t){window.console.log("ERROR: : "+e+" - "+a+" - "+t),window.console.log("Error. Contacte a su Adminsitrador.")}})},change:function(){},update:function(){}}))});