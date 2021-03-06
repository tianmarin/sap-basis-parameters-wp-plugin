/*global aaServerData*/
/*global AmCharts*/
/*global __gaTracker*/
jQuery(document).ready(function($){

//------------------------------------------------------------------------------
/*
* Definición de Variables globales
*/
//var aaUrl		=aaServerData.aaUrl;
var ajaxUrl		=aaServerData.ajaxUrl;
var userId		=aaServerData.userId;
//------------------------------------------------------------------------------
/*
* aaUploadSdfmonFile
*
* This function evaluates the selected file and uploads it using the $SDFMON PHP
* class.
* While Uploading and waiting for the final JSON %$SDFMON response, it shows the
* percentage of the file upload process and notifies the user, the state of the
* backend processing.
*
* Once the file has been processed by the backend, the SDFMON Calendar is
* reloaded to prevent the user uploading a single date data twice.
*
* Further implementations might show a percentage of the file processing.
*
* @author Cristian Marin
*/
window.aaUploadSdfmonFile=function(event){
	event.preventDefault();
	window.console.log(this);
	if((typeof this.files[0]) === undefined){
		window.console.log('No hay archivo. Undefined');
		return this;
	}
	var	file = this.files[0];
	if (file.name.trim() === ''){
		$.alert("No has seleccionado un archivo.");
		window.console.log("No file selected");
		return this;
	}
	window.console.log('Archivo a evaluar: '+file.name+' '+file.type+' '+file.size);
	if(file.type !== 'text/plain'){
		$.alert("Recuerda que debes cargar archivos exportados sin formato","Error");
		return this;
	}
	var parts = $(this).data('file-date').split('/');
	var inputYear	=parts[0];
	var inputMonth	=parts[1];
	var inputDay	=parts[2];
	var data = new FormData();
	data.append('action', 'fe_sdfmon_file_upload');
	var href=window.location.hash.split('/');
	var systemId=href[1];
	data.append('system_id', systemId);
	data.append('year', inputYear);
	data.append('month', inputMonth);
	data.append('day', inputDay);
	data.append('file_name', file.name);
	data.append('file', file);
	var statusMsg=$("<div class='uploading-msg'></div>").hide();
	var uploading	='<i class="fa fa-cloud-upload" aria-hidden="true"></i>';
	var processing	='<i class="fa fa-gear fa-spin" aria-hidden="true"></i>';
	var finished	='<i class="fa fa-check" aria-hidden="true"></i>';
	$('#sdfmon-setup .sdfmon-setup-status').append(statusMsg);
	$.ajax({
		url: ajaxUrl,
		type: 'POST',
		data: data,
		cache: false,
		dataType: 'json',
		processData: false,
		contentType: false,
		beforeSend: function () {
			statusMsg.html(uploading+" "+inputDay+'/'+inputMonth+'/'+inputYear+' Comienza la carga del archivo <small>'+file.name+'</small>').fadeIn(500);
		},
		xhr: function () {
			var xhr = new window.XMLHttpRequest();
			//Upload progress
			xhr.upload.addEventListener("progress", function(evt){
				if (evt.lengthComputable) {
					var percentComplete = Math.round(evt.loaded / evt.total * 100);
					window.console.log('Porcentaje: '+percentComplete);
					statusMsg.html(uploading+" "+inputDay+'/'+inputMonth+'/'+inputYear+' Cargando archivo <small>'+file.name+"</small> ("+percentComplete+"%)");
				}
			}, false);
			//success upload
			xhr.upload.addEventListener("load", function(evt){
				if (evt.lengthComputable) {
					statusMsg.html(processing+" "+inputDay+'/'+inputMonth+'/'+inputYear+' Procesando la informaci&oacute;n cargada');
					setTimeout(function(){
						$('#sdfmon-setup .sdfmon-setup-calendar').aaActivateSdfmonCalendar();
					}, 900);
				}
			}, false);
			//Download progress
			//If this is removed, the process is dead
			xhr.addEventListener("progress", function(evt){
				if (evt.lengthComputable) {
					window.console.log("Respuesta descargada: "+Math.round(evt.loaded / evt.total * 100)+'%');
				}else{
					window.console.log("Respuesta descargada: "+Math.round(evt.loaded / evt.total * 100)+'%');					
				}
			}, false);
			return xhr;
		},
   		success: function(response){
			window.console.log(JSON.stringify(response));
			if(response.status === 'ok'){
				statusMsg.html(finished+" "+inputDay+'/'+inputMonth+'/'+inputYear+' &iexcl;Informaci&oacute;n cargada exitosamente!').delay(5000).fadeOut(1000);
				window.console.log('OK: Carga de '+file.name);
				$('#sdfmon-setup .sdfmon-setup-calendar').aaActivateSdfmonCalendar();
				gaTrack('sdfmon-file-upload.html', 'Snapshot Monitoring Load File');
			}else{
				window.console.log('ERROR: Carga de '+file.name+'('+response.error+')');
			}
		},
		error: aaAjaxError,
	});		
// END aaUploadSdfmonFile
};
//http://www.marcusoft.net/2015/05/how-to-get-google-analytics-to-work-for-your-single-page-application.html
function gaInit() {
//	$.getScript('//www.google-analytics.com/analytics.js'); // jQuery shortcut
//	window.ga = window.ga || function () { (ga.q = ga.q || []).push(arguments); }; ga.l = +new Date();
/**
* Creates a temporary global ga object and loads analy  tics.js.
* Paramenters o, a, and m are all used internally.  They could have been declared using 'var',
* instead they are declared as parameters to save 4 bytes ('var ').
*
* @param {Window}      i The global context object.
* @param {Document}    s The DOM document object.
* @param {string}      o Must be 'script'.
* @param {string}      g URL of the analytics.js script. Inherits protocol from page.
* @param {string}      r Global name of analytics object.  Defaults to 'ga'.
* @param {DOMElement?} a Async script tag.
* @param {DOMElement?} m First script tag in document.
*/
	(function(i, s, o, g, r, a, m){
		i.GoogleAnalyticsObject = r; // Acts as a pointer to support renaming.
		// Creates an initial ga() function.  The queued commands will be executed once analytics.js loads.
		i[r] = i[r] || function() {
			(i[r].q = i[r].q || []).push(arguments);
		};
		// Sets the time (as an integer) this tag was executed.  Used for timing hits.
		i[r].l = 1 * new Date();
		// Insert the script tag asynchronously.  Inserts above current tag to prevent blocking in
		// addition to using the async attribute.
		a = s.createElement(o);
		m = s.getElementsByTagName(o)[0];
		a.async = 1;
		a.src = g;
		m.parentNode.insertBefore(a, m);
	})(window, document, 'script', '//www.google-analytics.com/analytics.js', '__gaTracker');
	__gaTracker('create', 'UA-1655231-20', 'auto');
	window.console.log("GA - Initalized");
	return __gaTracker;
}
function gaTrack(path, title) {
	var track =  { page: path, title: title};
	var __gaTracker = window.__gaTracker || gaInit();
	__gaTracker('set', track);
	__gaTracker('set', 'userId', userId); // Set the user ID using signed-in user_id.
	__gaTracker('send', 'pageview');
	window.console.log("GA - Tracked: "+path+" | User: "+userId);
}
/*
* aaCreateNewSystem
*
* 
*
* @author Cristian Marin
*/
function aaCreateNewSystem(){
	gaTrack('new-system.html', 'New System');
	var jc = $.confirm({
		buttons:{
			create: {
				text: 'Crear Sistema',
				btnClass: 'btn-blue',
				action: function(){
					jc.$content.find('form').submit(function(event){
						$(this).aaSubmitSystemForm(event,jc);
					}).trigger("submit");
					return false;
				}
			},			
			cancel: {
				text: 'Cancelar',
				btnClass: 'btn-default',
				action: function(){}
			},			
		},
		closeIcon: true,
		columnClass: 'large',
		content:function(){
			var self = this;
			var data = new FormData();
			data.append('action', 'fe_system_show_form');
			return $.ajax({
				url: ajaxUrl,
				type: 'POST',
				data: data,
				cache: false,
				dataType: 'json',
				processData: false,
				contentType: false,
				beforeSend: function () {
				},
				success: function(response){
					window.console.log(JSON.stringify(response));
					if(undefined === response.error){
						self.setTitle(response.title);
						self.setContent(response.form);
					}else{
						self.setTitle("Error");
						self.setContent(response.message);
						self.buttons.create.addClass('hidden');
					}
				},
				error: aaAjaxError,
			});
		},
		type: 'blue',
	});
}
/*
* aaCreateNewReport
*
* 
*
* @author Cristian Marin
*/
function aaCreateNewReport(id){
	gaTrack('new-report.html', 'New Report');
	var systemId=id;
	var jc = $.confirm({
		buttons:{
			create: {
				text: 'Crear Reporte',
				btnClass: 'btn-blue',
				action: function(){
					jc.$content.find('form').submit(function(event){
						$(this).aaSubmitReportForm(event,jc);
					}).trigger("submit");
					return false;
				}
			},			
			cancel: {
				text: 'Cancelar',
				btnClass: 'btn-default',
				action: function(){}
			},			
		},
		closeIcon: true,
		columnClass: 'large',
		content:function(){
			var self = this;
			var data = new FormData();
			data.append('action', 'fe_report_show_form');
			data.append('system_id', systemId);
			return $.ajax({
				url: ajaxUrl,
				type: 'POST',
				data: data,
				cache: false,
				dataType: 'json',
				processData: false,
				contentType: false,
				beforeSend: function () {
				},
				success: function(response){
					window.console.log(JSON.stringify(response));
					if(undefined === response.error){
						self.setTitle(response.title);
						self.setContent(response.form);
					}else{
						self.setTitle("Error");
						self.setContent(response.message);
						self.buttons.create.addClass('hidden');
					}
				},
				error: aaAjaxError,
			});
		},
		type: 'blue',
	});
}
var aaAjaxError = function(jqXHR, textStatus, errorThrown){
	var msg = '';
	if (jqXHR.status === 0) {
		msg = 'Not connect.\n Verify Network.';
	} else if (jqXHR.status === 404) {
		msg = 'Requested page not found. [404]';
	} else if (jqXHR.status === 500) {
		msg = 'Internal Server Error [500].';
	} else if (textStatus === 'parsererror') {
		msg = 'Requested JSON parse failed.';
	} else if (textStatus === 'timeout') {
		msg = 'Time out error.';
	} else if (textStatus === 'abort') {
		msg = 'Ajax request aborted.';
	} else {
		msg = 'Uncaught Error.\n' + jqXHR.responseText;
	}
	window.console.log("ERROR: ");
	window.console.log(jqXHR);
	window.console.log(textStatus+" - "+errorThrown);
	var text="Este error de conexión con el servidor de fondo, regularmente indica que no has iniciado sesión en Wordpress.<br/>";
	window.console.log(ajaxUrl);
	var url = ajaxUrl.replace("admin-ajax.php", "");
	text=text+"Intenta <strong><a href='"+url+"'>iniciar sesi&oacute;n</a></strong>. En caso que esto no funcione, por favor contacta al adminsitrador.";
	text=text+"<code>"+msg+"</code>";
	var title = "Error de conexión as&iacute;ncrona";
	$.alert({
		buttons:{
			heyThere: {
				text: 'OK',
				btnClass: 'btn-danger',
			},
		},
		closeIcon: true,
		columnClass: 'large',
		content:text,
		title: title,
		type:'red',
	});
};
function aaEditSystem(id){
	var systemId = id;
	var jc = $.confirm({
		buttons:{
			create: {
				text: 'Editar Sistema',
				btnClass: 'btn-orange',
				action: function(){
					jc.$content.find('form').submit(function(event){
						$(this).aaSubmitSystemForm(event,jc);
					}).trigger("submit");
					return false;
				}
			},			
			cancel: {
				text: 'Cancelar',
				btnClass: 'btn-default',
				action: function(){}
			},			
		},
		closeIcon: true,
		columnClass: 'large',
		content:function(){
			var self = this;
			var data = new FormData();
			data.append('action', 'fe_system_show_form');
			data.append('form_type', 'edit');
			data.append('item', systemId);
			return $.ajax({
				url: ajaxUrl,
				type: 'POST',
				data: data,
				cache: false,
				dataType: 'json',
				processData: false,
				contentType: false,
				beforeSend: function () {
				},
				success: function(response){
					window.console.log(JSON.stringify(response));
					if(undefined === response.error){
						self.setTitle(response.title);
						self.setContent(response.form);
					}else{
						self.setTitle("Error");
						self.setContent(response.message);
						self.buttons.create.addClass('hidden');
					}
				},
				error: function(jqXHR, textStatus, errorThrown){
					window.console.log("ERROR: ");
					window.console.log(jqXHR);
					window.console.log(textStatus+" - "+errorThrown);
					self.setContent("Error. Contacte a su Adminsitrador.");
				}
			});
		},
		type: 'orange',
	});
}
function aaEditReport(id){
	var reportId = id;
	var jc = $.confirm({
		buttons:{
			create: {
				text: 'Editar Reporte',
				btnClass: 'btn-orange',
				action: function(){
					jc.$content.find('form').submit(function(event){
						$(this).aaSubmitReportForm(event,jc);
					}).trigger("submit");
					return false;
				}
			},			
			cancel: {
				text: 'Cancelar',
				btnClass: 'btn-default',
				action: function(){}
			},			
		},
		closeIcon: true,
		columnClass: 'large',
		content:function(){
			var self = this;
			var data = new FormData();
			data.append('action', 'fe_report_show_form');
			data.append('form_type', 'edit');
			data.append('item', reportId);
			return $.ajax({
				url: ajaxUrl,
				type: 'POST',
				data: data,
				cache: false,
				dataType: 'json',
				processData: false,
				contentType: false,
				beforeSend: function () {
				},
				success: function(response){
					window.console.log(JSON.stringify(response));
					if(undefined === response.error){
						self.setTitle(response.title);
						self.setContent(response.form);
					}else{
						self.setTitle("Error");
						self.setContent(response.message);
						self.buttons.create.addClass('hidden');
					}
				},
				error: function(jqXHR, textStatus, errorThrown){
					window.console.log("ERROR: ");
					window.console.log(jqXHR);
					window.console.log(textStatus+" - "+errorThrown);
					self.setContent("Error. Contacte a su Adminsitrador.");
				}
			});
		},
		type: 'orange',
	});
}
/*
* aaGenerateChartData
*
* This function generates the random data for the #intro chart, in order to
* display contextual date information for the user.
*
* @author Cristian Marin
*/
function aaGenerateChartData(){
	var chartData = [];
	// current date
	var firstDate = new Date();
	// now set 500 minutes back
	firstDate.setDate(firstDate.getDate() - 1);
	// and generate 30 data/days items
	for (var i = 0; i < 30; i++) {
		var newDate = new Date(firstDate);
		// each time we add one minute
		newDate.setDate(newDate.getDay() + i);
		// some random number for MAX
		var max = Math.round( Math.cos( i/2 ) * 5 + Math.random() * 5 + 30);
		// some random number for AVG
		var avg = Math.round(Math.random() * 5 + 5 );
		// add data item to the array
		chartData.push({
			date: newDate,
			max: max,
			avg: avg,
		});
	}
	return chartData;
}
/*
* EXTEND FUNCTIONS
*
* The following functions extend the constructor's prototype of the JQuery
* (or $) functions. It basically merges the contents of an object onto the
* jQuery prototype to provide new jQuery instance methods.
*
*/
$.fn.extend({
/*
* aaAnimateAndStopCss
*
* Enables the animation CSS functions (https://github.com/daneden/animate.css)
* only for a first time execution.
* To its executions the following inputs are recommended:
* -animationName: any class defined in https://github.com/daneden/animate.css#basic-usage 
*
* @author Cristian Marin
*/
aaAnimateAndStopCss: function (animationName) {
	this.addClass('animated ' + animationName);
	return this;
},
/*
* aaAnimateCss
*
* Enables the animation CSS functions (https://github.com/daneden/animate.css).
* Once the animation is finished, the element might be animated again, as the
* CSS classes are removed for further usage.
*
* To its executions the following inputs are recommended:
* -animationName: any class defined in https://github.com/daneden/animate.css#basic-usage 
*
* @author Cristian Marin
*/
aaAnimateCss: function (animationName) {
	var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
	this.addClass('animated ' + animationName).one(animationEnd, function() {
		$(this).removeClass('animated ' + animationName);
	});
	return this;
},
/*
* aaNavbarFixedBehavior
*
* It changes the element (it should only be Bootstrap's Navbar component) to its
* fixed state. This aids to maintain the NavBar into it's fixed (top) position
* when the user scroll (or land) from the initial screen.
*
* To its executions, the following inputs are recommended (required):
* -fixedState: on | off
*
* @author Cristian Marin
*/
aaNavbarFixedBehavior: function (fixedState) {
	if ( fixedState === 'on'){
		$(this).addClass('navbar-fixed-top');
	}else if ( fixedState === 'off'){
		$(this).removeClass('navbar-fixed-top');
	//No state provided? Bail.
	}
	return this;
},
/*
* aaNavbarActiveSection
*
* It reflects in the element (it should only be Bootstrap's Navbar component
* link children) the active state, regarding its scroll position. It works only
* in vertical scroll contents.
*
* @author Cristian Marin
*/
aaNavbarActiveSection: function () {
	var	$this = $(this),id = $this.attr('href'),$section = $(id);
	// No section for this link? Bail.
	if ($section.length < 1){
		return this;
	}
	// Scrollex.
	$section.scrollex({
		mode: 'middle',
//		top: $('#intro-nav').height(),
//		bottom: '50vh',
		//delay:100,
		enter: function() {
			$this.parent().addClass('active');
		},
		leave: function() {
			$this.parent().parent().find('.active').removeClass('active');
		},
		
	});
	return this;
},
/*
* aaLoadContent
*
* if there is an ajax function for the section, it fetches the information
* before doing any processing
* Check the
* Remove the hidden class
* If theres another active sections it shows an animation
*
* @author Cristian Marin
*/
aaLoadContent: function(){
	if($(this).length < 1 || !$(this).parent().is('body')){
		window.location.hash="#intro";
		gaTrack('404.html', '404');
		return this;
	}
	var href = $(this).selector;
//	$.find($(this).selector).scrolly({
//		speed: 1000,
//	});
	switch(href){
		case '#system-list':
			$(this).ajaxSystemList();
			gaTrack('system-list.html', 'System List');
			$('body').addClass('on-system');
			break;
		case '#new-system':
			$('body').addClass('on-system');
			gaTrack('new-system.html', 'New System');
			$(this).aaContinueLoadContent();
			break;
		case '#system-info':
			$(this).ajaxSystemInfo();
			gaTrack('system-info.html', 'System Info');
			$('body').addClass('on-system');
			break;
		case '#sdfmon-setup':
			$(this).ajaxSdfmonSetup();
			gaTrack('sdfmon-setup.html', 'Snapshot MonitoringSetup');
			$('body').addClass('on-system');
			break;
		case '#edit-report':
			$('body').addClass('on-system');
			gaTrack('edit-report.html', 'Edit Report');
			$(this).aaContinueLoadContent();
			break;
		case '#report-preview':
			$('body').addClass('on-system');
			gaTrack('report-preview.html', 'Report Preview');
			$(this).ajaxReportPreview();
			break;
		case '#system-collab':
			$('body').addClass('on-system');
			gaTrack('system-collab.html', 'System Collab');
			$(this).ajaxSystemCollab();
			break;
		case '#sdfmon-instructions':
			gaTrack('sdfmon-instructions.html', 'Snapshot Monitoring Instructions');
			$('body').removeClass('on-system');
			$(this).aaContinueLoadContent();
			break;		
		default:
		$('body').removeClass('on-system');
		$(this).aaContinueLoadContent();
	}
	return this;
},
aaTurnOn: function(){
	$(this).addClass('active').removeClass('hidden');	
	return this;
},
aaTurnOff: function(){
	$(this).addClass('hidden').removeClass('active');	
	return this;
},
aaContinueLoadContent: function(){
	//The switch
	var href = $(this);
	var active = $('body > .active');
	var activeRef = '#'+active.attr('id');
//	if( href.selector === '#intro'){
//		gaTrack('intro.html', 'Intro');
//	}
	window.console.log( activeRef+' -> '+href.selector);
	window.console.log("activos :"+active.length);
	if( href.selector === activeRef ){
		return this;
	}
	if( active.length < 1){
		window.console.log("No active Section");
		$(this).aaTurnOn();
		return this;
	}
	var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
	active.addClass('animated fadeOutLeft');
	active.one(animationEnd, function(e) {
		//Prevent child animation trigger action
		if (e.target === this){
			window.console.log("Switch active Section");
			$(this).aaTurnOff().removeClass('animated fadeOutLeft');
			window.console.log($(this).attr('id')+" es el activo");
			window.console.log(href.attr('id')+" es el nuevo");
			href.aaTurnOn().aaAnimateCss('fadeInRight');
		}
	});
	return this;
},
ajaxSystemList: function(){
	var section=$(this);
	var data = new FormData();
	data.append('action', 'fe_system_list');
	$.ajax({
		url: ajaxUrl,
		type: 'POST',
		data: data,
		cache: false,
		dataType: 'json',
		processData: false,
		contentType: false,
		beforeSend: function () {
		},
   		success: function(response){
//			window.console.log(JSON.stringify(response));
			$('#system-list ul.list-group').html('');
			var c=0;
			if(response.elementCount>0){
				$.each(response.data,function(i,val){
					var systemText = $( val );
					systemText.find('a[data-function="system-edit"]').click(function(event){
						event.preventDefault();
						aaEditSystem($(this).data('system-id'));
					});
					var delay=(c++ *100)+'ms';
					systemText.css('-webkit-animation-delay', delay)
						.css('animation-delay', delay)
						.aaAnimateCss('flipInX');
					$('#system-list ul.list-group').append(systemText);
				});
			}
			section.aaContinueLoadContent();
		},
		error: aaAjaxError,
	});
	return this;
},
ajaxSystemCollabSearchUsers: function(){
	var target=$('#system-collab .aa-add-user-table');
	var text=$(this).val();
	var data = new FormData();
	var href=window.location.hash.split('/');
	var systemId=href[1];
	data.append('action', 'fe_search_system_users');
	data.append('system_id', systemId);
	data.append('text', text);
	$.ajax({
		url: ajaxUrl,
		type: 'POST',
		data: data,
		cache: false,
		dataType: 'json',
		processData: false,
		contentType: false,
		beforeSend: function () {
		},
   		success: function(response){
			window.console.log(JSON.stringify(response));
			target.find('a').remove();
	   		if( undefined === response.error){
				$.each(response.users, function( i, val ) {
					var user=$(val);
					user.click(function(event){
						event.preventDefault();
						$(this).ajaxAddSystemUser();
					});
			   		target.append(user);
		   		});
	   		}else{
		   		$.alert(response.message,"Error");
	   		}
   		},
		error: aaAjaxError,
	});
	return this;
},
ajaxAddSystemUser:function(){
	var user=$(this);
	var data = new FormData();
	data.append('action', 'fe_add_system_users');
	data.append('system_id', $(this).data('system-id'));
	data.append('user_id', $(this).data('user-id'));
	$.ajax({
		url: ajaxUrl,
		type: 'POST',
		data: data,
		cache: false,
		dataType: 'json',
		processData: false,
		contentType: false,
		beforeSend: function () {
		},
   		success: function(response){
//			window.console.log(JSON.stringify(response));
	   		if( undefined === response.error){
		   		$('#system-collab').ajaxSystemCollabCurrentUsers();
		   		user.remove();
	   		}else{
		   		$.alert(response.message,"Error");
	   		}
   		},
		error: aaAjaxError,
	});
	return this;	
},
ajaxRemoveSystemUser:function(){
	var user=$(this);
	var data = new FormData();
	data.append('action', 'fe_remove_system_users');
	data.append('system_id', $(this).data('system-id'));
	data.append('user_id', $(this).data('user-id'));
	$.ajax({
		url: ajaxUrl,
		type: 'POST',
		data: data,
		cache: false,
		dataType: 'json',
		processData: false,
		contentType: false,
		beforeSend: function () {
		},
   		success: function(response){
//			window.console.log(JSON.stringify(response));
	   		if( undefined === response.error){
		   		user.remove();
		   		$('#system-collab').ajaxSystemCollabCurrentUsers();
	   		}else{
		   		$.alert(response.message,"Error");
	   		}
   		},
		error: aaAjaxError,
	});
	return this;	
},
ajaxSystemCollab:function(){
	//Get system info
	var section = $(this);
	var data = new FormData();
	var href=window.location.hash.split('/');
	var systemId=href[1];
	data.append('action', 'fe_quick_system_info');
	data.append('system_id', systemId);
	$.ajax({
		url: ajaxUrl,
		type: 'POST',
		data: data,
		cache: false,
		dataType: 'json',
		processData: false,
		contentType: false,
		beforeSend: function () {
		},
   		success: function(response){
//			window.console.log(JSON.stringify(response));
	   		if( undefined === response.error){
		   		section.find('header').html(response.header);
	   		}else{
		   		$.alert("Error");
	   		}
   		},
		error: aaAjaxError,
	});
	section.find('form input').on("input",function(){
		window.console.log($(this).val());
		$(this).ajaxSystemCollabSearchUsers();
	});
	section.ajaxSystemCollabCurrentUsers();
	section.aaContinueLoadContent();
	return this;
},
ajaxSystemCollabCurrentUsers:function(){
	var currentUsers = $(this).find('.aa-current-system-users');
	var data = new FormData();
	var href=window.location.hash.split('/');
	var systemId=href[1];
	data.append('action', 'fe_system_collab_get_users');
	data.append('system_id', systemId);
	$.ajax({
		url: ajaxUrl,
		type: 'POST',
		data: data,
		cache: false,
		dataType: 'json',
		processData: false,
		contentType: false,
		beforeSend: function () {
		},
   		success: function(response){
	   		window.console.log('ajaxSystemCollabCurrentUsers');
			window.console.log(JSON.stringify(response));
	   		if( undefined === response.error){
		   		currentUsers.html('');
		   		if(undefined !== response.users && response.users.length !== 0){
					$.each(response.users, function( i, val ) {
						var user=$(val);
						user.click(function(event){
							event.preventDefault();
							$(this).ajaxRemoveSystemUser();
						});
				   		currentUsers.append(user);
			   		});
		   		}
	   		}else{
		   		$.alert(response.message,"Error");
	   		}
   		},
		error: aaAjaxError,
	});
	return this;
},
ajaxSystemInfo: function(){
	var section=$(this);
	var data = new FormData();
	window.console.log(ajaxUrl);
	var href=window.location.hash.split('/');
	var systemId=href[1];
	data.append('action', 'fe_system_info');
	data.append('system_id', systemId);
	$.ajax({
		url: ajaxUrl,
		type: 'POST',
		data: data,
		cache: false,
		dataType: 'json',
		processData: false,
		contentType: false,
		beforeSend: function () {
		},
   		success: function(response){
//			window.console.log(JSON.stringify(response));
			$('#system-info').html('');
			if(response.status === 'ok'){
				var systemText = $(response.systemInfo);
				systemText.find('a[data-function="report-edit"]').click(function(event){
					event.preventDefault();
					aaEditReport($(this).data('report-id'));
				});
				systemText.find('#new-report-button').click(function(event){
					event.preventDefault();
					aaCreateNewReport($(this).data('system-id'));
				});
				$('#system-info').append(systemText);
				section.aaContinueLoadContent();
			}
		},
		error: aaAjaxError,
	});
	return this;
},
ajaxSdfmonSetup: function(){
	var calendar=$('#sdfmon-setup .sdfmon-setup-calendar');
	calendar.html('');
	calendar.aaActivateSdfmonCalendar();
	$(this).aaContinueLoadContent();
	return this;
},
/*
* aaActivateSdfmonCalendar
*
* Setup the calendar & upload elements for the dataProvider management.
*
* @author Cristian Marin
*/
aaActivateSdfmonCalendar:function(){
	var container=$(this);
	container.aaSdfmonGetDates();
	return this;
},
/*
* aaSdfmonGetDates
*
* -Get analysis dates
* -If the user does not have authorization to this system gives the alert message
* @author Cristian Marin
*/
aaSdfmonGetDates:function(){
	var container=$(this);
	window.console.log(container);
	var data = new FormData();
	var href=window.location.hash.split('/');
	var systemId=href[1];
	data.append('action'		,'fe_sdfmon_get_dates');
	data.append('system_id'		,systemId);
	$.ajax({
		url: ajaxUrl,
		type: 'POST',
		data: data,
		cache: false,
		dataType: 'json',
		processData: false,
		contentType: false,
		beforeSend: function () {
		},
		success: function(response){
//			window.console.log(JSON.stringify(response));
			if(response.status === 'ok'){
				var aaLastDay = new Date();
				var aaAnalysisDates=[];
				if(response.dates.length < 1){
					window.console.log("no hay fechas");
				}else{
					$.each(response.dates, function( i, val ) {
						var parts = val.split('-');
						var eachDate=new Date(parts[0],parts[1]-1,parts[2]);
						aaAnalysisDates[eachDate]=true;
						aaLastDay=new Date(parts[0],parts[1]-2,parts[2]);
					});
					window.console.log(aaAnalysisDates);
					window.console.log('last day: '+aaLastDay);
				}
				container.aaBuildSdfmonCalendar(aaAnalysisDates,aaLastDay);
			}else{
				window.console.log(response.message);
				$.alert(response.userMessage);
			}
		},
		error: aaAjaxError,
	});	
	return this;
},
aaBuildSdfmonCalendar:function(usedDates,lastDay){
	var container=$(this);
	container.datepicker('destroy');
	container.datepicker({
		inline: true,
		defaultDate:lastDay,
		beforeShowDay:function(date) {
			if (usedDates[date]) {
				return [false,'aa-used-date','Análisis registrado'];
			}
				return [true, '', ''];
		},
		firstDay: 1,
		showOtherMonths: true,
		numberOfMonths:2,
		nextText: '<i class="fa fa-chevron-right" aria-hidden="true"></i>',
		prevText: '<i class="fa fa-chevron-left" aria-hidden="true"></i>',
		dateFormat: 'yy/m/d',
		maxDate:"-1d",
		monthNames: [ "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre" ],
		yearRange: "2016:2018",
		dayNamesMin: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
		onSelect: function(date){
			window.console.log(date);
			container.append(
				$('<input type="file">')
				.data('file-date',date)
				.change(window.aaUploadSdfmonFile)
				.click()
				);

//			$('#aa-sdfmon-file').data('file-date',date);
//			window.console.log($('#aa-sdfmon-file').data('file-date'));
//			$('#aa-sdfmon-file').click();
			
			//abap_sdfmon_calendar_click(date);
		},
	});
	container.datepicker('refresh');
	return this;
},
/*
* ajaxReportPreview
*
* This is it!
*
* @author Cristian Marin
*/
ajaxReportPreview: function(){
	var report=$(this);
	var data = new FormData();
	window.console.log(ajaxUrl);
	var href=window.location.hash.split('/');
	var reportId=href[1];
	data.append('action', 'fe_preview_report');
	data.append('report_id'		,reportId);
	$.ajax({
		url: ajaxUrl,
		type: 'POST',
		data: data,
		cache: false,
		dataType: 'json',
		processData: false,
		contentType: false,
		beforeSend: function () {
		},
   		success: function(response){
//			window.console.log(JSON.stringify(response));
			if(response.error === undefined){
				report.html('');
				$.each(response.sections,function(i,aaSection){
					var reportSection=$('<article></article>');
					
					var sectionHeader=$('<header></header>')
					.append( $('<h2></h2>').append(aaSection.title) );
					reportSection.append(sectionHeader);
					
					var sectionIntro=$('<div></div>')
					.append( $('<p></p>').append(aaSection.intro) );
					reportSection.append(sectionIntro);
					$.each(aaSection.charts,function(i,aaChart){
//						window.console.log(aaChart);
						//define el chart y anda a buscar los datos de cada graph
						var chart=$('<div id="aa-chart-'+aaChart.id+'"></div>').addClass('aa-report-chart loading');
						var legend=$('<div id="aa-legend-'+aaChart.id+'"></div>').addClass('aa-report-chart-legend');
						chart.aaBuildChart(aaChart.id);
						reportSection.append(chart);
						reportSection.append(legend);
					});
					var sectionOutro=$('<div></div>')
					.append( $('<p></p>').append(aaSection.outro) );
					reportSection.append(sectionOutro);
					report.append(reportSection);
				});
			}
			report.aaContinueLoadContent();
		},
		error: aaAjaxError,
	});
	return this;
},
aaBuildChart: function(chartId){
	var chartContainer=$(this);
	var data = new FormData();
	data.append('action'	,'fe_build_chart');
	data.append('chart_id'	,chartId);
	var href=window.location.hash.split('/');
	var reportId=href[1];
	data.append('report_id', reportId);
	$.ajax({
		url: ajaxUrl,
		type: 'POST',
		data: data,
		cache: false,
		dataType: 'json',
		processData: false,
		contentType: false,
		beforeSend: function () {
		},
   		success: function(response){
			window.console.log(JSON.stringify(response));
	   		if(undefined === response.error){
				var chart						=new AmCharts.AmSerialChart();
//				chart.baseHref					=true;
				//chart.addClassNames			=true;
				//chart.balloonDateFormat			="YYYY-MM-DD";
				//chart.bezierX					=12;
				//chart.bezierY					=12;
//				chart.autoMargins				=false;
				chart.borderAlpha				='0';
				chart.classNamePrefix			='aa-adjust';
				if(response.chart.timeGroup === "hourly"){
					chart.categoryField				="time";
					chart.dataDateFormat			="JJ:NN:SS";					
				}else{
					chart.categoryField				="date";
					chart.dataDateFormat			="YYYY-MM-DD";					
				}
				chart.dataProvider				=response.chart.data;
				chart.decimalSeparator			='.';
				chart.marginTop					=0;
				chart.marginBottom				=0;
				chart.marginRight				=0;
				chart.marginLeft				=0;
				chart.precision					=0;
				//chart.stackable					=response.chart.stackable;
				chart.thousandsSeparator		=',';


				// TITLE
				chart.addTitle(response.chart.title,15,'',1,false);


				// GRAPHS
				$.each(response.chart.graphs,function(i,aaGraph){
					var graph						=new AmCharts.AmGraph();

				//	graph.classNameField			="cmarin";
				//	graph.balloonText				="[[value]]";
					if(aaGraph.graphType !== 'column'){
						graph.bullet					="round";
					}
					graph.bulletSize				=3;
					graph.columnWidth				=0.2;
					graph.fillColors				=['#'+aaGraph.graphColor,'#FFFFFF'];
					graph.fillAlphas				=0.1;
					graph.id						=aaGraph.valueField;
				//	graph.legendValueText			="[[value]]";
				//	graph.legendPeriodValueText		="[[value.high]]";
					graph.lineColor					='#'+aaGraph.graphColor;
				//	graph.lineThickness				=1;
				//	graph.textClickEnabled			=true;
					graph.title						=aaGraph.name;
					graph.type						=aaGraph.graphType;
				//	graph.valueAlign				="left";
					graph.valueField				=aaGraph.valueField;
				//	graph.valueText					="[[close]]";
				//	graph.markerType				="circle";
				//	graph.visibleInLegend			=false;
					if(response.chart.stackable !== 'none'){
						graph.type			='line';
						graph.fillColors	=['#'+aaGraph.graphColor];
						graph.fillAlphas	=0.5;
					}
					chart.addGraph(graph);
				});


				// LEGEND
				if(response.chart.legend !== '0'){
					var legend						=new AmCharts.AmLegend();
					legend.align					='center';
				//	legend.autoMargins				=false;
				//	legend.backgroundAlpha			="1";
				//	legend.borderAlpha				='0.1';
				//	legend.borderColor				="#000000";
				//	legend.color					='#63A0D7';
				//	legend.combineLegend			=true;
				//	legend.divId					="aa-adjust-legend";
					legend.enabled					=true;
				//	legend.equalWidths				=true;
					legend.fontSize					=10;
				//	legend.forceWidth				=true;
				//	legend.horizontalGap			=20;
				//	legend.labelText				="<b>[[title]]<b> "+assetName;
				//	legend.labelWidth				=300;
				//	legend.marginLeft				=0;
				//	legend.marginRight				=0;
				//	legend.markerBorderAlpha		="0.5";
				//	legend.markerLabelGap			=0;
					legend.markerSize				=5;
				//	legend.maxColumns				=1;
				//	legend.position					="absolute";
				//	legend.rollOverColor			="#FF0000";
				//	legend.rollOverGraphAlpha		='0.2';
				//	legend.switchType				='v';
				//	legend.useGraphSettings			=true;
				//	legend.useMarkerColorForLabels	=true;
				//	legend.useMarkerColorForValues	=true;
				//	legend.valueAlign				="left";
				//	legend.valueText				="[[value]]";
				//	legend.valueWidth				=300;
				//	legend.width					=200;
				//	legend.addListener("showItem", window.abapAlert);
				//	legend.addListener("hideItem", window.abapAlert);
				//	chart.addLegend(legend);
					chart.addLegend(legend,'aa-legend-'+chartId);
					
				}


				//CHART CURSOR
				var cursor						=new AmCharts.ChartCursor();
			//	cursor.categoryBalloonAlpha		="0.5";
				if(response.chart.timeGroup === "hourly"){
					cursor.categoryBalloonDateFormat="JJ:NN";
				}
				chart.addChartCursor(cursor);


				// CATEGORY AXIS
				var categoryAxis				=chart.categoryAxis;
			//	categoryAxis.boldPeriodBeginning=false;
			//	categoryAxis.equalSpacing		=true;
			//	categoryAxis.dashLength=5;
				if(response.chart.timeGroup === "hourly"){
					categoryAxis.minPeriod			="hh";
					categoryAxis.markPeriodChange	=false;
					
				}
				categoryAxis.parseDates			=true;

			//	chart.categoryAxis.parseDates	=true;  
			//	chart.categoryAxis.equalSpacing	=true;


				// VALUE AXIS
				var valueAxis					=new AmCharts.ValueAxis();
				valueAxis.stackType				=response.chart.stackable;
				chart.addValueAxis(valueAxis);

				chart.validateData();
//				window.console.log(chart);
				chart.write(chartContainer.attr('id'));
				//chart.invalidateSize();
				chart.handleResize();
				chartContainer.removeClass('loading').aaAnimateAndStopCss('fadeIn');
	   		}
		},
		error: aaAjaxError,
	});		
	return this;
},
aaSubmitSystemForm: function(event,jcElement){
	var jc = jcElement;
	event.preventDefault();
	var valid = true;
	//validation
	$(this).find("input[type!='hidden']").each(function(){
		if( $(this).val().length < 1  ){
			valid=false;
			$(this).parent().addClass('has-error');
		}else{
			$(this).parent().removeClass('has-error');
		}
	});
	$(this).find("select").each(function(){
		if( $(this).val() < 1  ){
			valid=false;
			$(this).parent().addClass('has-error');
		}else{
			$(this).parent().removeClass('has-error');
		}
	});
	if(valid === true){
		var data = new FormData();
		//Por cada input o select append
		data.append('action', 'fe_create_system');
		$(this).find("input, select").each(function(){
			data.append($(this).attr('name'),$(this).val());
		});
		$.ajax({
			url: ajaxUrl,
			type: 'POST',
			data: data,
			cache: false,
			dataType: 'json',
			processData: false,
			contentType: false,
			beforeSend: function () {
			},
			success: function(response){
				jc.close();
//				window.console.log(JSON.stringify(response));
				if(undefined === response.error){
					$('#system-list').ajaxSystemList();
					$.alert(response.message);
				}else{
					$.alert(response.message);
				}
			},
		error: aaAjaxError,
		});
		window.console.log("Validado");
		return true;
	}else{
		window.console.log("No Validado");
		return false;
	}
	return true;
},
aaSubmitReportForm: function(event,jcElement){
	var jc = jcElement;
	event.preventDefault();
	var valid = true;
	//validation
	$(this).find("input[type!='hidden']").each(function(){
		if( $(this).val().length < 1  ){
			valid=false;
			$(this).parent().addClass('has-error');
		}else{
			$(this).parent().removeClass('has-error');
		}
	});
	$(this).find("select").each(function(){
		if( $(this).val() < 1  ){
			valid=false;
			$(this).parent().addClass('has-error');
		}else{
			$(this).parent().removeClass('has-error');
		}
	});
	if(valid === true){
		var data = new FormData();
		//Por cada input o select append
		data.append('action', 'fe_create_report');
		$(this).find("input, select").each(function(){
			data.append($(this).attr('name'),$(this).val());
		});
		$.ajax({
			url: ajaxUrl,
			type: 'POST',
			data: data,
			cache: false,
			dataType: 'json',
			processData: false,
			contentType: false,
			beforeSend: function () {
			},
			success: function(response){
				jc.close();
//				window.console.log(JSON.stringify(response));
				if(undefined === response.error){
					$('#system-info').ajaxSystemInfo();
					$.alert(response.message);
				}else{
					$.alert(response.message);
				}
			},
		error: aaAjaxError,
		});
		window.console.log("Validado");
		return true;
	}else{
		window.console.log("No Validado");
		return false;
	}
	return true;
},

});

//------------------------------------------------------------------------------
/*
* EVENT LISTENERS
*
* The following event listener intercepts the default navigation behavior in
* order to prevent default behaviors, and provide the expected functionality to
* the system's and user's actions.
*
*/
if ($('#intro-nav').length > 0) {
	//When header disappears, active fixed navbar
	$('#intro-header').scrollex({
			mode: 'top',
			leave: function() {$('#intro-nav').aaNavbarFixedBehavior('on');},
			enter: function() {$('#intro-nav').aaNavbarFixedBehavior('off');},
		});
	//When navbar clicks, scroll and active
	$('#intro-nav').find('a').scrolly({
		speed: 1000,
		offset: function() {return $('#intro-nav').height();}
	})
	.each(function() {
		$(this).aaNavbarActiveSection();
	});
}
$(document).on({
	ajaxStart	: function() {
		$('#aa-loading').addClass("aa-fe-loading");
	},
	ajaxStop	: function() {
		$('#aa-loading').removeClass("aa-fe-loading");
	}
});

/*$("body").delegate("a", "click", function(){
	// Push this URL "state" onto the history hash.
	if( $(this).data('changescreen') !== undefined ){
		event.preventDefault();
		var href=$(this).attr("href").split('/');
		history.pushState({}, null, $(this).attr("href"));
		$(href[0]).aaLoadContent();

	}else{
		return true;
	}
});*/
$('.aa-export').click(function(event){
	event.preventDefault();
	$("#report-preview").wordExport();

});
$(window).bind( "hashchange", function() {
//	window.console.log("Cada vez que el usuario cambia de hash, se dispara esta wea.");
		var href=window.location.hash.split('/');
//		window.console.log(href);
//		var href=$(this).attr("href").split('/');
//		history.pushState({}, null, $(this).attr("href"));
		$(href[0]).aaLoadContent();

//	var url = window.location.hash;
//	$(url).removeClass('hidden').addClass('active');
});
if( window.location.hash === '' ){
	window.location.hash="#intro";
	gaTrack('intro.html', 'Intro');
	window.console.log('default hash evaluation');
}else{
	$(window).trigger( "hashchange" ); // user refreshed the browser, fire the appropriate function
}
$('#new-system-button').click(function(event){
	event.preventDefault();
	aaCreateNewSystem();
});




/*
* New System Form Submit
*
* This event executes the following steps:
* 1. Form validation for NewSystem creation
* 2. AJAX Create System
* If SID and shortname already exists, ask user to confirm.
* 3. Open #system-list | #system_collab
* @author Cristian Marin
*/
//$('#new-system form').submit(function(event){
var chartData = aaGenerateChartData();

AmCharts.makeChart("chartdiv", {
	"type": "serial",
	"dataProvider": chartData,
	"valueAxes": [{
		//"position": "left",
		//"title": "Utilizaci&oacute;n de WorkProcess"
	}],
	"graphs": [{
		"id": "g1",
		"bullet": "round",
		"bulletSize": 3,
		"filColors":['#63A0D7','#FFF'],
		"fillAlphas": 0.1,
		"lineColor": "#63A0D7",
		"title": "Max. Active DIA WPs",
		"type": "smoothedLine",
		"valueField": "max"
		},{
		"id": "g2",
		"bullet": "round",
		"bulletSize": 3,
		"filColors":['#E38844','#FFF'],
		"fillAlphas": 0.1,
		"lineColor": "#E38844",
		"title": "Avg. Active DIA WPs",
		"type": "smoothedLine",
		"valueField": "avg"
		},		
    ],
	"titles": [
		{
			"text": "ERP | Utilizacion de WorkProcess DIA",
			"size": 15
		}
	],
	"legend": {
		"align": 'center',
		"fontSize": 10,
		"markerSize":5,
	},
	"chartCursor": {
//		"categoryBalloonDateFormat": "JJ:NN, DD MMMM",
//		"cursorPosition": "mouse"
	},
	"categoryField": "date",
	"categoryAxis": {
//		"minPeriod": "dd",
		"parseDates": true
	},
});

});

