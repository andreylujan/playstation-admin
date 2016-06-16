'use strict';

/**
 * @ngdoc overview
 * @name minovateApp
 * @description
 * # minovateApp
 *
 * Main module of the application.
 */
angular
	.module('minovateApp', [
		'ngAnimate',
		'ngCookies',
		'ngResource',
		'ngSanitize',
		'ngTouch',
		'picardy.fontawesome',
		'ui.bootstrap',
		'ui.router',
		'ui.utils',
		'angular-loading-bar',
		'angular-momentjs',
		'FBAngular',
		'lazyModel',
		'toastr',
		'angularBootstrapNavTree',
		'oc.lazyLoad',
		'ui.select',
		'ui.tree',
		'textAngular',
		'colorpicker.module',
		'angularFileUpload',
		'ngImgCrop',
		'datatables',
		'datatables.bootstrap',
		'datatables.colreorder',
		'datatables.colvis',
		'datatables.tabletools',
		'datatables.scroller',
		'datatables.columnfilter',
		'ui.grid',
		'ui.grid.resizeColumns',
		'ui.grid.edit',
		'ui.grid.moveColumns',
		'ngTable',
		'smart-table',
		'angular-flot',
		'angular-rickshaw',
		'easypiechart',
		'uiGmapgoogle-maps',
		'ui.calendar',
		'LocalStorageModule',
		'satellizer',
		'naif.base64',
		'ui.bootstrap.datetimepicker',
		'ngDroplet'
	])
	.run(['$rootScope', '$state', '$stateParams', '$log', 'Utils',
		function($rootScope, $state, $stateParams, $log, Utils) {

			$rootScope.$state = $state;
			$rootScope.$stateParams = $stateParams;

			$rootScope.$on('$stateChangeSuccess', function(event, toState) {

				event.targetScope.$watch('$viewContentLoaded', function() {

					angular.element('html, body, #content').animate({
						scrollTop: 0
					}, 200);

					setTimeout(function() {
						angular.element('#wrap').css('visibility', 'visible');

						if (!angular.element('.dropdown').hasClass('open')) {
							angular.element('.dropdown').find('>ul').slideUp();
						}
					}, 200);
				});
				$rootScope.containerClass = toState.containerClass;
			});

			// Listener que se ejecuta cuando se carga una pagina
			$rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams) {

				var isLogin = toState.name === 'core.login' || toState.name === 'core.forgotpass' || toState.name === 'core.resetpass' || toState.name === 'core.signup' || toState.name === 'core.page404';

				// $log.log('is in Login or forgotpass or resetpass or signup... ' + isLogin);
				// $log.log('loggedIn storage... ' + Utils.getInStorage('loggedIn'));

				if (isLogin) {
					return;
				}

				if (Utils.getInStorage('loggedIn') === false || Utils.getInStorage('loggedIn') === null) {
					e.preventDefault(); // stop current execution
					$state.go('core.login'); // go to login
				}

			});
		}
	])

.config(['uiSelectConfig',
	function(uiSelectConfig) {
		uiSelectConfig.theme = 'bootstrap';
	}
])

.config(['localStorageServiceProvider',
	function(localStorageServiceProvider) {
		localStorageServiceProvider
			.setStorageType('localStorage');
	}
])

.config(['$authProvider',
	function($authProvider) {
		// Parametros de configuración
		$authProvider.loginUrl = 'http://52.201.182.66/oauth/token';
		$authProvider.tokenName = 'access_token';
	}
])

.config(function($provide) {
	$provide.decorator('taOptions', ['taRegisterTool', '$delegate', '$uibModal', function(taRegisterTool, taOptions, $uibModal) {
		// $delegate is the taOptions we are decorating
		// register the tool with textAngular
		taRegisterTool('colourRed', {
			iconclass: "fa fa-picture-o",
			action: function(deferred, restoreSelection) {

				var modalInstance = $uibModal.open({
					templateUrl: './views/tmpl/modals/addFileModalContent.html',
					controller: 'AddFileModalInstanceCtrl',
					size: 'lg',
					resolve: {}
				});

				// this.$editor().wrapSelection('insertHTML', "<img src='http://cdn.arstechnica.net/wp-content/uploads/2016/02/5718897981_10faa45ac3_b-640x624.jpg'>", true);

			}

		});
		// add the button to the default toolbar definition
		taOptions.toolbar[3].push('colourRed');
		return taOptions;
	}]);
})

.config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {

		$urlRouterProvider.otherwise('/core/login');

		$stateProvider

			.state('app', {
				abstract: true,
				url: '/app',
				templateUrl: 'views/tmpl/app.html'
			})
			//dashboard
			.state('app.dashboard', {
				url: '/dashboard',
				controller: 'DashboardCtrl',
				templateUrl: 'views/tmpl/dashboard.html',
				resolve: {
					plugins: ['$ocLazyLoad',
						function($ocLazyLoad) {
							return $ocLazyLoad.load([
								'scripts/vendor/datatables/datatables.bootstrap.min.css'
							]);
						}
					]
				}
			})
			//users
			.state('app.users', {
				url: '/users',
				template: '<div ui-view></div>'
			})
			//users/invite
			.state('app.users.invite', {
				url: '/invite',
				controller: 'UsersInviteCtrl',
				templateUrl: 'views/tmpl/users/invite.html'
			})
			//users/list
			.state('app.users.list', {
				url: '/list',
				controller: 'UsersListCtrl',
				templateUrl: 'views/tmpl/users/list.html'
			})
			//playStation
			.state('app.playStation', {
				url: '/playStation',
				template: '<div ui-view></div>'
			})
			//playStation/reports
			.state('app.playStation.reports', {
				url: '/reports',
				controller: 'ReportsCtrl',
				templateUrl: 'views/tmpl/reports/reports.html'
			})
			//playStation/my-reports
			.state('app.playStation.my-reports', {
				url: '/my-reports',
				controller: 'MyReportsCtrl',
				templateUrl: 'views/tmpl/reports/my-reports.html'
			})
			//playStation/my-tasks
			.state('app.playStation.my-tasks', {
				url: '/my-tasks',
				controller: 'MyTasksCtrl',
				templateUrl: 'views/tmpl/reports/my-tasks.html'
			})
			//playStation/create-task
			.state('app.playStation.create-task', {
				url: '/create-task',
				controller: 'CreateTaskCtrl',
				templateUrl: 'views/tmpl/reports/create-task.html'
			})
			//Masters
			.state('app.masters', {
				url: '/masters',
				template: '<div ui-view></div>'
			})
			//masters/reports
			.state('app.masters.zones', {
				url: '/reports',
				controller: 'ZonesCtrl',
				templateUrl: 'views/tmpl/masters/zones.html'
			})
			//masters/dealers
			.state('app.masters.dealers', {
				url: '/dealers',
				controller: 'DealersCtrl',
				templateUrl: 'views/tmpl/masters/dealers.html'
			})
			//masters/stores
			.state('app.masters.stores', {
				url: '/stores',
				controller: 'StoresCtrl',
				templateUrl: 'views/tmpl/masters/stores.html'
			})
			//masters/products
			.state('app.masters.products', {
				url: '/products',
				controller: 'ProductsCtrl',
				templateUrl: 'views/tmpl/masters/products.html'
			})
			//masters/checklist
			.state('app.masters.checklist', {
				url: '/checklist',
				controller: 'ChecklistCtrl',
				templateUrl: 'views/tmpl/masters/checklist.html'
			})
			//promotions
			.state('app.promotions', {
				url: '/promotions',
				template: '<div ui-view></div>'
			})
			//promotions
			.state('app.promotions.list', {
				url: '/promotions',
				controller: 'PromotionsListCtrl',
				templateUrl: 'views/tmpl/promotions/promotions-list.html'
			})
			//promotions
			.state('app.promotions.new', {
				url: '/new-promotion?idPromotion',
				controller: 'NewPromotionCtrl',
				templateUrl: 'views/tmpl/promotions/new-promotion.html'
			})
			//inbox
			.state('app.inbox', {
				url: '/inbox',
				template: '<div ui-view></div>'
			})
			//inbox
			.state('app.inbox.list', {
				url: '/inbox',
				controller: 'InboxListCtrl',
				templateUrl: 'views/tmpl/inbox/inbox-list.html'
			})
			//inbox
			.state('app.inbox.new', {
				url: '/new-inbox?idInbox',
				controller: 'NewInboxCtrl',
				templateUrl: 'views/tmpl/inbox/new-inbox.html'
			})
			//mail
			.state('app.mail', {
				abstract: true,
				url: '/mail',
				controller: 'MailCtrl',
				templateUrl: 'views/tmpl/mail/mail.html'
			})
			//mail/inbox
			.state('app.mail.inbox', {
				url: '/inbox',
				controller: 'MailInboxCtrl',
				templateUrl: 'views/tmpl/mail/inbox.html'
			})
			//mail/compose
			.state('app.mail.compose', {
				url: '/compose',
				controller: 'MailComposeCtrl',
				templateUrl: 'views/tmpl/mail/compose.html'
			})
			//mail/single
			.state('app.mail.single', {
				url: '/single',
				controller: 'MailSingleCtrl',
				templateUrl: 'views/tmpl/mail/single.html'
			})
			//ui
			.state('app.ui', {
				url: '/ui',
				template: '<div ui-view></div>'
			})
			//ui/typography
			.state('app.ui.typography', {
				url: '/typography',
				controller: 'TypographyCtrl',
				templateUrl: 'views/tmpl/ui/typography.html',
				resolve: {
					plugins: ['$ocLazyLoad',
						function($ocLazyLoad) {
							return $ocLazyLoad.load([
								'scripts/vendor/google-code-prettify/prettify.css',
								'scripts/vendor/google-code-prettify/sons-of-obsidian.css',
								'scripts/vendor/google-code-prettify/prettify.js'
							]);
						}
					]
				}
			})
			//ui/lists
			.state('app.ui.lists', {
				url: '/lists',
				controller: 'ListsCtrl',
				templateUrl: 'views/tmpl/ui/lists.html'
			})
			//ui/buttons&icons
			.state('app.ui.buttons-icons', {
				url: '/buttons-icons',
				controller: 'ButtonsIconsCtrl',
				templateUrl: 'views/tmpl/ui/buttons-icons.html'
			})
			//ui/navs&accordions
			.state('app.ui.navs', {
				url: '/navs',
				controller: 'NavsCtrl',
				templateUrl: 'views/tmpl/ui/navs.html'
			})
			//ui/modals
			.state('app.ui.modals', {
				url: '/modals',
				controller: 'ModalsCtrl',
				templateUrl: 'views/tmpl/ui/modals.html'
			})
			//ui/tiles
			.state('app.ui.tiles', {
				url: '/tiles',
				controller: 'TilesCtrl',
				templateUrl: 'views/tmpl/ui/tiles.html'
			})
			//ui/portlets
			.state('app.ui.portlets', {
				url: '/portlets',
				controller: 'PortletsCtrl',
				templateUrl: 'views/tmpl/ui/portlets.html'
			})
			//ui/grid
			.state('app.ui.grid', {
				url: '/grid',
				controller: 'GridCtrl',
				templateUrl: 'views/tmpl/ui/grid.html'
			})
			//ui/widgets
			.state('app.ui.widgets', {
				url: '/widgets',
				controller: 'WidgetsCtrl',
				templateUrl: 'views/tmpl/ui/widgets.html'
			})
			//ui/alerts & notifications
			.state('app.ui.alerts', {
				url: '/alerts',
				controller: 'AlertsCtrl',
				templateUrl: 'views/tmpl/ui/alerts.html'
			})
			//ui/general
			.state('app.ui.general', {
				url: '/general',
				controller: 'GeneralCtrl',
				templateUrl: 'views/tmpl/ui/general.html'
			})
			//ui/tree
			.state('app.ui.tree', {
				url: '/tree',
				controller: 'TreeCtrl',
				templateUrl: 'views/tmpl/ui/tree.html'
			})
			//shop
			.state('app.shop', {
				url: '/shop',
				template: '<div ui-view></div>'
			})
			//shop/orders
			.state('app.shop.orders', {
				url: '/orders',
				controller: 'OrdersCtrl',
				templateUrl: 'views/tmpl/shop/orders.html',
				resolve: {
					plugins: ['$ocLazyLoad',
						function($ocLazyLoad) {
							return $ocLazyLoad.load([
								'scripts/vendor/datatables/datatables.bootstrap.min.css',
								'scripts/vendor/datatables/Pagination/input.js',
								'scripts/vendor/datatables/ColumnFilter/jquery.dataTables.columnFilter.js'
							]);
						}
					]
				}
			})
			//shop/products
			.state('app.shop.products', {
				url: '/products',
				controller: 'ProductsCtrl',
				templateUrl: 'views/tmpl/shop/products.html',
				resolve: {
					plugins: ['$ocLazyLoad',
						function($ocLazyLoad) {
							return $ocLazyLoad.load([
								'scripts/vendor/datatables/datatables.bootstrap.min.css',
								'scripts/vendor/datatables/Pagination/input.js',
								'scripts/vendor/datatables/ColumnFilter/jquery.dataTables.columnFilter.js'
							]);
						}
					]
				}
			})
			//shop/invoices
			.state('app.shop.invoices', {
				url: '/invoices',
				controller: 'InvoicesCtrl',
				templateUrl: 'views/tmpl/shop/invoices.html',
				resolve: {
					plugins: ['$ocLazyLoad',
						function($ocLazyLoad) {
							return $ocLazyLoad.load([
								'scripts/vendor/datatables/datatables.bootstrap.min.css',
								'scripts/vendor/datatables/Pagination/input.js',
								'scripts/vendor/datatables/ColumnFilter/jquery.dataTables.columnFilter.js'
							]);
						}
					]
				}
			})
			//shop/single-order
			.state('app.shop.single-order', {
				url: '/single-order',
				controller: 'SingleOrderCtrl',
				templateUrl: 'views/tmpl/shop/single-order.html',
				resolve: {
					plugins: ['$ocLazyLoad',
						function($ocLazyLoad) {
							return $ocLazyLoad.load([
								'scripts/vendor/datatables/datatables.bootstrap.min.css',
								'scripts/vendor/datatables/Pagination/input.js',
								'scripts/vendor/datatables/ColumnFilter/jquery.dataTables.columnFilter.js'
							]);
						}
					]
				}
			})
			//shop/single-product
			.state('app.shop.single-product', {
				url: '/single-product',
				controller: 'SingleProductCtrl',
				templateUrl: 'views/tmpl/shop/single-product.html',
				resolve: {
					plugins: ['$ocLazyLoad',
						function($ocLazyLoad) {
							return $ocLazyLoad.load([
								'scripts/vendor/datatables/datatables.bootstrap.min.css',
								'scripts/vendor/datatables/Pagination/input.js',
								'scripts/vendor/datatables/ColumnFilter/jquery.dataTables.columnFilter.js',
								'scripts/vendor/touchspin/jquery.bootstrap-touchspin.js',
								'scripts/vendor/touchspin/jquery.bootstrap-touchspin.css',
								'scripts/vendor/magnific/magnific-popup.css',
								'scripts/vendor/magnific/jquery.magnific-popup.min.js'
							]);
						}
					]
				}
			})
			//shop/single-invoice
			.state('app.shop.single-invoice', {
				url: '/single-invoice',
				controller: 'SingleInvoiceCtrl',
				templateUrl: 'views/tmpl/shop/single-invoice.html',
				resolve: {
					plugins: ['$ocLazyLoad',
						function($ocLazyLoad) {
							return $ocLazyLoad.load([
								'scripts/vendor/datatables/datatables.bootstrap.min.css',
								'scripts/vendor/datatables/Pagination/input.js',
								'scripts/vendor/datatables/ColumnFilter/jquery.dataTables.columnFilter.js'
							]);
						}
					]
				}
			})
			//forms
			.state('app.forms', {
				url: '/forms',
				template: '<div ui-view></div>'
			})
			//forms/common
			.state('app.forms.common', {
				url: '/common',
				controller: 'FormsCommonCtrl',
				templateUrl: 'views/tmpl/forms/common.html',
				resolve: {
					plugins: ['$ocLazyLoad',
						function($ocLazyLoad) {
							return $ocLazyLoad.load([
								'scripts/vendor/slider/bootstrap-slider.js',
								'scripts/vendor/touchspin/jquery.bootstrap-touchspin.js',
								'scripts/vendor/touchspin/jquery.bootstrap-touchspin.css',
								'scripts/vendor/filestyle/bootstrap-filestyle.min.js'
							]);
						}
					]
				}
			})
			//forms/validate
			.state('app.forms.validate', {
				url: '/validate',
				controller: 'FormsValidateCtrl',
				templateUrl: 'views/tmpl/forms/validate.html'
			})
			//forms/wizard
			.state('app.forms.wizard', {
				url: '/wizard',
				controller: 'FormWizardCtrl',
				templateUrl: 'views/tmpl/forms/wizard.html'
			})
			//forms/upload
			.state('app.forms.upload', {
				url: '/upload',
				controller: 'FormUploadCtrl',
				templateUrl: 'views/tmpl/forms/upload.html',
				resolve: {
					plugins: ['$ocLazyLoad',
						function($ocLazyLoad) {
							return $ocLazyLoad.load([
								'scripts/vendor/filestyle/bootstrap-filestyle.min.js'
							]);
						}
					]
				}
			})
			//forms/imgcrop
			.state('app.forms.imgcrop', {
				url: '/imagecrop',
				controller: 'FormImgCropCtrl',
				templateUrl: 'views/tmpl/forms/imgcrop.html',
				resolve: {
					plugins: ['$ocLazyLoad',
						function($ocLazyLoad) {
							return $ocLazyLoad.load([
								'scripts/vendor/filestyle/bootstrap-filestyle.min.js'
							]);
						}
					]
				}
			})
			//tables
			.state('app.tables', {
				url: '/tables',
				template: '<div ui-view></div>'
			})
			//tables/bootstrap
			.state('app.tables.bootstrap', {
				url: '/bootstrap',
				controller: 'TablesBootstrapCtrl',
				templateUrl: 'views/tmpl/tables/bootstrap.html'
			})
			//tables/datatables
			.state('app.tables.datatables', {
				url: '/datatables',
				controller: 'TablesDatatablesCtrl',
				templateUrl: 'views/tmpl/tables/datatables.html',
				resolve: {
					plugins: ['$ocLazyLoad',
						function($ocLazyLoad) {
							return $ocLazyLoad.load([
								'scripts/vendor/datatables/ColReorder/css/dataTables.colReorder.min.css',
								'scripts/vendor/datatables/ColReorder/js/dataTables.colReorder.min.js',
								'scripts/vendor/datatables/Responsive/dataTables.responsive.css',
								'scripts/vendor/datatables/Responsive/dataTables.responsive.js',
								'scripts/vendor/datatables/ColVis/css/dataTables.colVis.min.css',
								'scripts/vendor/datatables/ColVis/js/dataTables.colVis.min.js',
								'scripts/vendor/datatables/TableTools/css/dataTables.tableTools.css',
								'scripts/vendor/datatables/TableTools/js/dataTables.tableTools.js',
								'scripts/vendor/datatables/datatables.bootstrap.min.css'
							]);
						}
					]
				}
			})
			//tables/uiGrid
			.state('app.tables.ui-grid', {
				url: '/ui-grid',
				controller: 'TablesUiGridCtrl',
				templateUrl: 'views/tmpl/tables/ui-grid.html'
			})
			//tables/ngTable
			.state('app.tables.ng-table', {
				url: '/ng-table',
				controller: 'TablesNgTableCtrl',
				templateUrl: 'views/tmpl/tables/ng-table.html'
			})
			//tables/smartTable
			.state('app.tables.smart-table', {
				url: '/smart-table',
				controller: 'TablesSmartTableCtrl',
				templateUrl: 'views/tmpl/tables/smart-table.html'
			})
			//tables/fooTable
			.state('app.tables.footable', {
				url: '/footable',
				controller: 'TablesFootableCtrl',
				templateUrl: 'views/tmpl/tables/footable.html',
				resolve: {
					plugins: ['$ocLazyLoad',
						function($ocLazyLoad) {
							return $ocLazyLoad.load([
								'scripts/vendor/footable/dist/footable.all.min.js',
								'scripts/vendor/footable/css/footable.core.min.css'
							]);
						}
					]
				}
			})
			//charts
			.state('app.charts', {
				url: '/charts',
				controller: 'ChartsCtrl',
				templateUrl: 'views/tmpl/charts.html',
				resolve: {
					plugins: ['$ocLazyLoad',
						function($ocLazyLoad) {
							return $ocLazyLoad.load([
								'scripts/vendor/flot/jquery.flot.resize.js',
								'scripts/vendor/flot/jquery.flot.orderBars.js',
								'scripts/vendor/flot/jquery.flot.stack.js',
								'scripts/vendor/flot/jquery.flot.pie.js',
								'scripts/vendor/gaugejs/gauge.min.js'
							]);
						}
					]
				}
			})
			//layouts
			.state('app.layouts', {
				url: '/layouts',
				template: '<div ui-view></div>'
			})
			//layouts/boxed
			.state('app.layouts.boxed', {
				url: '/boxed',
				controller: 'BoxedlayoutCtrl',
				templateUrl: 'views/tmpl/layouts/boxed.html',
				containerClass: 'boxed-layout'
			})
			//layouts/fullwidth
			.state('app.layouts.fullwidth', {
				url: '/fullwidth',
				controller: 'FullwidthlayoutCtrl',
				templateUrl: 'views/tmpl/layouts/fullwidth.html'
			})
			//layouts/sidebar-sm
			.state('app.layouts.sidebar-sm', {
				url: '/sidebar-sm',
				controller: 'SidebarsmlayoutCtrl',
				templateUrl: 'views/tmpl/layouts/sidebar-sm.html',
				containerClass: 'sidebar-sm-forced sidebar-sm'
			})
			//layouts/sidebar-xs
			.state('app.layouts.sidebar-xs', {
				url: '/sidebar-xs',
				controller: 'SidebarxslayoutCtrl',
				templateUrl: 'views/tmpl/layouts/sidebar-xs.html',
				containerClass: 'sidebar-xs-forced sidebar-xs'
			})
			//layouts/offcanvas
			.state('app.layouts.offcanvas', {
				url: '/offcanvas',
				controller: 'OffcanvaslayoutCtrl',
				templateUrl: 'views/tmpl/layouts/offcanvas.html',
				containerClass: 'sidebar-offcanvas'
			})
			//layouts/hz-menu
			.state('app.layouts.hz-menu', {
				url: '/hz-menu',
				controller: 'HzmenuCtrl',
				templateUrl: 'views/tmpl/layouts/hz-menu.html',
				containerClass: 'hz-menu'
			})
			//layouts/rtl-layout
			.state('app.layouts.rtl', {
				url: '/rtl',
				controller: 'RtlCtrl',
				templateUrl: 'views/tmpl/layouts/rtl.html',
				containerClass: 'rtl'
			})
			//maps
			.state('app.maps', {
				url: '/maps',
				template: '<div ui-view></div>'
			})
			//maps/vector
			.state('app.maps.vector', {
				url: '/vector',
				controller: 'VectorMapCtrl',
				templateUrl: 'views/tmpl/maps/vector.html',
				resolve: {
					plugins: ['$ocLazyLoad',
						function($ocLazyLoad) {
							return $ocLazyLoad.load([
								'scripts/vendor/jqvmap/jqvmap/jquery.vmap.min.js',
								'scripts/vendor/jqvmap/jqvmap/maps/jquery.vmap.world.js',
								'scripts/vendor/jqvmap/jqvmap/maps/jquery.vmap.usa.js',
								'scripts/vendor/jqvmap/jqvmap/maps/jquery.vmap.europe.js',
								'scripts/vendor/jqvmap/jqvmap/maps/jquery.vmap.germany.js'
							]);
						}
					]
				}
			})
			//maps/google
			.state('app.maps.google', {
				url: '/google',
				controller: 'GoogleMapCtrl',
				templateUrl: 'views/tmpl/maps/google.html'
			})
			//calendar
			.state('app.calendar', {
				url: '/calendar',
				controller: 'CalendarCtrl',
				templateUrl: 'views/tmpl/calendar.html'
			})
			//app core pages (errors, login,signup)
			.state('core', {
				abstract: true,
				url: '/core',
				template: '<div ui-view></div>'
			})
			//login
			.state('core.login', {
				url: '/login',
				controller: 'LoginCtrl',
				templateUrl: 'views/tmpl/pages/login.html'
			})
			//signup
			.state('core.signup', {
				url: '/signup?confirmation_token?id',
				controller: 'SignupCtrl',
				templateUrl: 'views/tmpl/pages/signup.html'
			})
			//forgot password
			.state('core.forgotpass', {
				url: '/forgotpass',
				controller: 'ForgotPasswordCtrl',
				templateUrl: 'views/tmpl/pages/forgotpass.html'
			})
			//forgot password
			.state('core.resetpass', {
				url: '/resetpass?email',
				controller: 'ResetPasswordCtrl',
				templateUrl: 'views/tmpl/pages/resetpass.html'
			})
			//page 404
			.state('core.page404', {
				url: '/page404',
				templateUrl: 'views/tmpl/pages/page404.html'
			})
			//page 500
			.state('core.page500', {
				url: '/page500',
				templateUrl: 'views/tmpl/pages/page500.html'
			})
			//page offline
			.state('core.page-offline', {
				url: '/page-offline',
				templateUrl: 'views/tmpl/pages/page-offline.html'
			})
			//locked screen
			.state('core.locked', {
				url: '/locked',
				templateUrl: 'views/tmpl/pages/locked.html'
			})
			//example pages
			.state('app.pages', {
				url: '/pages',
				template: '<div ui-view></div>'
			})
			//gallery page
			.state('app.pages.gallery', {
				url: '/gallery',
				controller: 'GalleryCtrl',
				templateUrl: 'views/tmpl/pages/gallery.html',
				resolve: {
					plugins: ['$ocLazyLoad',
						function($ocLazyLoad) {
							return $ocLazyLoad.load([
								'scripts/vendor/mixitup/jquery.mixitup.js',
								'scripts/vendor/magnific/magnific-popup.css',
								'scripts/vendor/magnific/jquery.magnific-popup.min.js'
							]);
						}
					]
				}
			})
			//timeline page
			.state('app.pages.timeline', {
				url: '/timeline',
				controller: 'TimelineCtrl',
				templateUrl: 'views/tmpl/pages/timeline.html'
			})
			//chat page
			.state('app.pages.chat', {
				url: '/chat',
				controller: 'ChatCtrl',
				templateUrl: 'views/tmpl/pages/chat.html'
			})
			//search results
			.state('app.pages.search-results', {
				url: '/search-results',
				controller: 'SearchResultsCtrl',
				templateUrl: 'views/tmpl/pages/search-results.html',
				resolve: {
					plugins: ['$ocLazyLoad',
						function($ocLazyLoad) {
							return $ocLazyLoad.load([
								'scripts/vendor/slider/bootstrap-slider.js'
							]);
						}
					]
				}
			})
			//profile page
			.state('app.pages.profile', {
				url: '/profile',
				controller: 'ProfileCtrl',
				templateUrl: 'views/tmpl/pages/profile.html',
				resolve: {
					plugins: ['$ocLazyLoad',
						function($ocLazyLoad) {
							return $ocLazyLoad.load([
								'scripts/vendor/filestyle/bootstrap-filestyle.min.js'
							]);
						}
					]
				}
			})
			//documentation
			.state('app.help', {
				url: '/help',
				controller: 'HelpCtrl',
				templateUrl: 'views/tmpl/help.html'
			});
	}
]);