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
		'ngTable',
		'angular-flot',
		'LocalStorageModule',
		'satellizer',
		'naif.base64',
		'ui.bootstrap.datetimepicker',
		'highcharts-ng',
		'slick',
		'daterangepicker'
	])

.run(['$rootScope', '$state', '$stateParams', 'Utils',
	function($rootScope, $state, $stateParams, Utils) {

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

			var isLogin = toState.name === 'login' || toState.name === 'core.forgotpass' || toState.name === 'core.resetpass' || toState.name === 'core.signup' || toState.name === 'core.page404';

			// $log.log('is in Login or forgotpass or resetpass or signup... ' + isLogin);
			// $log.log('loggedIn storage... ' + Utils.getInStorage('loggedIn'));

			if (isLogin) {
				return;
			}

			if (Utils.getInStorage('loggedIn') === false || Utils.getInStorage('loggedIn') === null) {
				e.preventDefault(); // stop current execution
				$state.go('login'); // go to login
			}

		});
	}
])

.config(['uiSelectConfig', 'localStorageServiceProvider', '$authProvider',
	function(uiSelectConfig, localStorageServiceProvider, $authProvider) {
		uiSelectConfig.theme = 'bootstrap';
		localStorageServiceProvider.setStorageType('localStorage');
		//$authProvider.loginUrl = 'http://50.16.161.152/eretail/oauth/token'; 				//PRODUCCION Chile
		//$authProvider.loginUrl = 'http://50.16.161.152/eretail/colombia/oauth/token'; 		//PRODUCCION Colombia
		$authProvider.loginUrl = 'http://50.16.161.152/eretail/peru/oauth/token'; 			//PRODUCCION Peru
		// $authProvider.loginUrl = 'http://50.16.161.152/eretail-staging/oauth/token'; //DESARROLLO
		// $authProvider.loginUrl = 'http://192.168.1.184:3000/oauth/token'; //DESARROLLO PABLO
		$authProvider.tokenName = 'access_token';
	}
])

.config(['$provide', function($provide) {
	$provide.decorator('taOptions', ['taRegisterTool', '$delegate', '$uibModal', '$log', function(taRegisterTool, taOptions, $uibModal, $log) {
		// $delegate is the taOptions we are decorating
		// register the tool with textAngular

		var imageUrl = null;

		taRegisterTool('insertImageFromDevice', {
			tooltiptext: 'Insertar imágen de dispositivo',
			iconclass: "fa fa-cloud-upload",
			action: function(deferred, restoreSelection) {
				var that = this;

				var modalInstance = $uibModal.open({
					templateUrl: './views/tmpl/modals/addFileModalContent.html',
					controller: 'AddFileModalInstanceCtrl',
					size: 'md',
					resolve: {}
				});

				modalInstance.result.then(function(url) {
					return that.$editor().wrapSelection('insertHTML', "<img src='" + url + "'>", true);
				});

			}

		});

		// add the button to the default toolbar definition
		taOptions.toolbar[3].splice(2, 0, 'insertImageFromDevice');
		return taOptions;
	}]);
}])

.config(['$compileProvider',
	function($compileProvider) {
		$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|blob):/);
	}
])

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

	$stateProvider

	//login
		.state('login', {
			url: '/',
			controller: 'LoginCtrl',
			templateUrl: 'views/tmpl/pages/login.html'
		})
		.state('app', {
			abstract: true,
			url: '/app',
			templateUrl: 'views/tmpl/app.html'
		})
		//Dashboard
		.state('app.dashboard', {
			url: '/dashboard',
			template: '<div ui-view></div>'
		})
		//Dashboard/sale
		.state('app.dashboard.sale', {
			url: '/sale',
			controller: 'DashboardSaleCtrl',
			templateUrl: 'views/tmpl/dashboard/sale.html'
		})
		//Dashboard/sale
		.state('app.dashboard.promotersAndActivities', {
			url: '/promoters-and-activities',
			controller: 'DashboardPromotersAndActivitiesCtrl',
			templateUrl: 'views/tmpl/dashboard/promoters-and-activities.html'
		})
		//Dashboard/sale
		.state('app.dashboard.stock', {
			url: '/stock',
			controller: 'DashboardStockCtrl',
			templateUrl: 'views/tmpl/dashboard/stock.html'
		})
		//Dashboard/goals
		.state('app.dashboard.goals', {
			url: '/goals',
			controller: 'DashboardGoalsCtrl',
			templateUrl: 'views/tmpl/dashboard/goals.html'
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
		//playStation/taskTracking
		.state('app.playStation.task-tracking', {
			url: '/task-tracking',
			controller: 'TaskTrackingCtrl',
			templateUrl: 'views/tmpl/reports/task-tracking.html'
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
		//masters/checklist
		.state('app.masters.new-checklist', {
			url: '/new-checklist?idChecklist',
			controller: 'NewChecklistCtrl',
			templateUrl: 'views/tmpl/masters/new-checklist.html'
		})
		//masters/stock-break
		.state('app.masters.stock-break', {
			url: '/stock-break',
			controller: 'StockBreakCtrl',
			templateUrl: 'views/tmpl/masters/stock-break.html'
		})
		//masters/monthly-goals
		.state('app.masters.monthly-goals', {
			url: '/monthly-goals',
			controller: 'MonthlyGoalsCtrl',
			templateUrl: 'views/tmpl/masters/monthly-goals.html'
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
		//promotions-tracking
		.state('app.promotions.tracking', {
			url: '/promotions-tracking',
			controller: 'PromotionsTrackingCtrl',
			templateUrl: 'views/tmpl/promotions/promotions-tracking.html'
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
		//images
		.state('app.images', {
			url: '/images',
			template: '<div ui-view></div>'
		})
		//images
		.state('app.images.list', {
			url: '/images',
			controller: 'ImagesListCtrl',
			templateUrl: 'views/tmpl/images/images-list.html'
		})
		//app core pages (errors, login,signup)
		.state('core', {
			abstract: true,
			url: '/core',
			template: '<div ui-view></div>'
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
		});

	$urlRouterProvider.otherwise('/');
}]);