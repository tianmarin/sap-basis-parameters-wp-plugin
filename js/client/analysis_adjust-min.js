jQuery(document).ready(function($){function a(a){var e=new FormData;e.append("action","abap_get_chart_data_provider"),e.append("analysis",$("#aa_container").data("abap-analysis-id")),e.append("data_source",a.data("data-source")),e.append("asset",a.data("asset")),$.ajax({url:ajaxurl,type:"POST",data:e,cache:!1,dataType:"json",processData:!1,contentType:!1,success:function(a){if("OK"===a.status){switch(t.addTitle(a.analysisSid+" | "+a.assetName,15,"",1,!1),a.chartType){case"linearMax":t.dataProvider=a.message,i.title="Max "+a.assetName,t.addGraph(i),r.title="Avg "+a.assetName,t.addGraph(r),t.validateData(),t.write("adjust_chart");break;case"linearMin":t.dataProvider=a.message,n.title="Min "+a.assetName,t.addGraph(n),r.title="Avg "+a.assetName,t.addGraph(r),t.validateData(),t.write("adjust_chart")}return!0}return $.alert("Error al obtener informaci&oacute;n.<br/>&iquest;Has iniciado sesi&oacute;n?"),window.console.log("ERROR:"+JSON.stringify(a)),!1},error:function(a,e,t){window.console.log("ERROR: "+a+" - "+e+" - "+t)}})}function e(a){"hideItem"===a.type&&window.console.log("Ocultar "+a.dataItem.id),"showItem"===a.type&&window.console.log("Mostrar "+a.dataItem.id)}var t,i,n,r,s=function(){$("span[data-trigger='analysis_adjust_asset']").click(function(e){e.preventDefault(),window.console.log("Obtener información de :"+$(this).data("asset")),"undefined"!=typeof t&&t.clear(),t=null,l(),a($(this))})},l=function(){t=new AmCharts.AmSerialChart,t.categoryField="date",t.marginTop=0,t.marginBottom=0,t.marginRight=0,t.marginLeft=0,t.thousandsSeparator=",",t.decimalSeparator=".",t.dataDateFormat="YYYY-MM-DD",i=new AmCharts.AmGraph,i.id="max",i.bullet="round",i.bulletSize=3,i.lineColor="#63A0D7",i.lineThickness=1,i.type="smoothedLine",i.bezierX=6,i.bezierY=12,i.valueField="max",i.fillColors=["#63A0D7"],i.fillAlphas=.1,i.balloonText="[[category]]<br><b><span style='font-size:14px;'>[[value]]</span></b>",n=new AmCharts.AmGraph,n.id="min",n.bullet="round",n.bulletSize=3,n.lineColor="#63A0D7",n.lineThickness=1,n.type="smoothedLine",n.bezierX=6,n.bezierY=12,n.valueField="min",n.fillColors=["#63A0D7"],n.fillAlphas=.1,n.balloonText="[[category]]<br><b><span style='font-size:14px;'>[[value]]</span></b>",r=new AmCharts.AmGraph,r.id="avg",r.bullet="round",r.bulletSize=3,r.lineColor="#EE8335",r.lineThickness=1,r.type="smoothedLine",r.bezierX=6,r.bezierY=12,r.valueField="avg",r.fillColors=["#EE8335"],r.fillAlphas=.1,r.balloonText="[[category]]<br><b><span style='font-size:14px;'>[[value]]</span></b>",t.categoryAxis.parseDates=!0;var a=new AmCharts.AmLegend;a.enabled=!0,a.divId="selector_chart",a.fontSize=8,a.useGraphSettings=!0,a.align="center",a.addListener("showItem",e),a.addListener("hideItem",e),t.addLegend(a)};AmCharts.isReady?s():AmCharts.ready(s)});