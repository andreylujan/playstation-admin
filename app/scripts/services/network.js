'use strict';

 var API_URL = 'http://50.16.161.152/eretail/api/v1'; // PRODUCCIÓN
 var URL_SERVER = 'http://50.16.161.152/eretail'; // PRODUCCIÓN

//var API_URL = 'http://50.16.161.152/eretail-staging/api/v1'; // DESARROLLO
//var URL_SERVER = 'http://50.16.161.152/eretail-staging'; // DESARROLLO

// var API_URL = 'http://192.168.1.184:3000/api/v1'; // DESARROLLO PABLO
// var URL_SERVER = 'http://192.168.1.184:3000/'; // DESARROLLO PABLO

angular.module('minovateApp')

.factory('Token', function($log) {

	var token = localStorage.getItem('ls.token');
	if (token) {
		token = token.replace(/\"/g, "");
	}

	return {
		getToken: function() {
			return token;
		}
	};

})

.factory('RefreshToken', function($resource) {
	return $resource(URL_SERVER + '/oauth/token', {}, {
		save: {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/vnd.api+json'
			}
		}
	});
})

// Invitaciones
.factory('Invitations', function($resource) {

	return $resource(API_URL + '/invitations', {}, {
		save: {
			method: 'POST',
			headers: {
				'Content-Type': 'application/vnd.api+json',
				Accept: 'application/vnd.api+json'
			}
		}

	});

})

// InviteLink
.factory('InviteLink', function($resource, $state) {

	return $resource(API_URL + '/invitations/:id', {
		id: '@id'
	}, {
		update: {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/vnd.api+json',
				Accept: 'application/vnd.api+json'
			},
			params: {
				confirmation_token: '@confirmation_token'
			}
		}

	});

})


// USUARIOS
.factory('Users', function($resource) {

	return $resource(API_URL + '/users/:idUser', {
		idUser: '@idUser'
	}, {
		save: {
			method: 'POST',
			headers: {
				'Content-Type': 'application/vnd.api+json',
				Accept: 'application/vnd.api+json'
			}
		},
		query: {
			method: 'GET',
			headers: {
				Accept: 'application/vnd.api+json'
			},
			params: {
				'filter[promoter_ids]': '@promoters'
			}
		},
		update: {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/vnd.api+json',
				Accept: 'application/vnd.api+json'
			},
		},
		delete: {
			method: 'DELETE',
			headers: {
				Accept: 'application/vnd.api+json'
			},
		},
		sendEmailWithToken: {
			method: 'POST',
			headers: {
				'Content-Type': 'application/vnd.api+json',
				Accept: 'application/vnd.api+json'
			}
		},
		verifyPassToken: {
			method: 'GET',
			headers: {
				Accept: 'application/vnd.api+json'
			},
			params: {
				email: '@email',
				reset_password_token: '@reset_password_token'
			}
		}
	});

})

// RESET PASS
.factory('ResetPassword', function($resource) {

	return $resource(API_URL + '/users/:idOrganization/password', {
		idOrganization: '@idOrganization'
	}, {
		update: {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/vnd.api+json',
				Accept: 'application/vnd.api+json'
			}
		}
	});

})

// REPORTS
.factory('Reports', function($resource) {

	return $resource(API_URL + '/reports', {}, {
		query: {
			method: 'GET',
			headers: {
				'Content-Type': 'application/vnd.api+json',
				Accept: 'application/vnd.api+json'
			},
			params: {
				'all': '@all',
				'filter[assigned_user_id]': '@assigned_user_id',
				'filter[creator_id]': '@creator_id',
				'page[number]': '@number',
				'page[size]': '@size',
				'filter[title]': '@title',
				'filter[created_at]': '@created_at',
				'filter[limit_date]': '@limit_date',
				'filter[zone_name]': '@zoneName',
				'filter[dealer_name]': '@dealerName',
				'filter[store_name]': '@storeName',
				'filter[creator_name]': '@creatorName',
				'fields[reports]': '@reports'
			}
		},
		save: {
			method: 'POST',
			headers: {
				'Content-Type': 'application/vnd.api+json',
				Accept: 'application/vnd.api+json'
			}
		}
	});

})

// DailyReports
.factory('DailyReports', function($resource) {

	return $resource(API_URL + '/daily_reports', {}, {
		query: {
			method: 'GET',
			headers: {
				'Content-Type': 'application/vnd.api+json',
				Accept: 'application/vnd.api+json'
			},
			params: {
				'all': '@all',
				'page[number]': '@number',
				'page[size]': '@size',
				'filter[id]': '@id',
				'filter[title]': '@title',
				'filter[created_at]': '@created_at',
				'filter[limit_date]': '@limit_date',
				'filter[zone_name]': '@zoneName',
				'filter[dealer_name]': '@dealerName',
				'filter[store_name]': '@storeName',
				'filter[creator_name]': '@creatorName',
				'fields[reports]': '@reports'
			}
		}
	});

})

// ASSIGNED REPORTS (TAREAS)
.factory('AssignedReports', function($resource) {

	return $resource(API_URL + '/assigned_reports', {}, {
		query: {
			method: 'GET',
			headers: {
				'Content-Type': 'application/vnd.api+json',
				Accept: 'application/vnd.api+json'
			},
			params: {
				'all': '@all',
				'page[number]': '@number',
				'page[size]': '@size'
			}
		}
	});

})

// ZONES
.factory('Zones', function($resource) {

	return $resource(API_URL + '/zones/:zoneId', {
		zoneId: '@zoneId'
	}, {
		query: {
			method: 'GET',
			headers: {
				// 'Content-Type': 'application/vnd.api+json',
				Accept: 'application/vnd.api+json'
			},
			params: {
				include: '@include',
				'filter[dealer_ids]': '@dealers',
				'fields[zones]': '@zones'
			}
		},
		save: {
			method: 'POST',
			headers: {
				'Content-Type': 'application/vnd.api+json',
				Accept: 'application/vnd.api+json'
			}
		},
		update: {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/vnd.api+json',
				Accept: 'application/vnd.api+json'
			}
		},
		delete: {
			method: 'DELETE',
			headers: {
				Accept: 'application/vnd.api+json'
			}
		}
	});

})

// DEALERS
.factory('Dealers', function($resource) {

	return $resource(API_URL + '/dealers/:dealerId', {
		dealerId: '@dealerId'
	}, {
		query: {
			method: 'GET',
			headers: {
				'Content-Type': 'application/vnd.api+json',
				Accept: 'application/vnd.api+json'
			},
			params: {
				include: '@include',
				'filter[zone_id]': '@zoneIds',
				'filter[store_ids]': '@dealerIds',
				'fields[dealers]': '@dealers'
			}
		},
		save: {
			method: 'POST',
			headers: {
				'Content-Type': 'application/vnd.api+json',
				Accept: 'application/vnd.api+json'
			}
		},
		update: {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/vnd.api+json',
				Accept: 'application/vnd.api+json'
			}
		},
		delete: {
			method: 'DELETE',
			headers: {
				Accept: 'application/vnd.api+json'
			}
		}
	});

})

// STORES
.factory('Stores', function($resource) {

	return $resource(API_URL + '/stores/:storeId', {
		storeId: '@storeId'
	}, {
		query: {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/vnd.api+json'
			},
			params: {
				include: '@include',
				'filter[zone_id]': '@zone_id',
				'filter[dealer_id]': '@dealer_id'
			}
		},
		save: {
			method: 'POST',
			headers: {
				'Content-Type': 'application/vnd.api+json',
				Accept: 'application/vnd.api+json'
			}
		},
		update: {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/vnd.api+json',
				Accept: 'application/vnd.api+json'
			}
		},
		delete: {
			method: 'DELETE',
			headers: {
				Accept: 'application/vnd.api+json'
			}
		}
	});

})

// StoreTypes
.factory('StoreTypes', function($resource) {

	return $resource(API_URL + '/store-types', {}, {
		query: {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/vnd.api+json'
			}
		}
	});

})

// PRODUCTS
.factory('Products', function($resource) {

	return $resource(API_URL + '/products/:idProduct', {
		idProduct: '@idProduct'
	}, {
		query: {
			method: 'GET',
			headers: {
				Accept: 'application/vnd.api+json'
			},
			params: {
				include: '@include'
			}
		},
		save: {
			method: 'POST',
			headers: {
				'Accept': 'application/vnd.api+json',
				'Content-Type': 'application/vnd.api+json'
			}
		},
		update: {
			method: 'PUT',
			headers: {
				'Accept': 'application/vnd.api+json',
				'Content-Type': 'application/vnd.api+json'
			}
		},
		delete: {
			method: 'DELETE',
			headers: {
				'Accept': 'application/vnd.api+json'
			}
		}
	});

})

// ROLES
.factory('Roles', function($resource) {

	return $resource(API_URL + '/organizations/:idOrganization/roles', {
		idOrganization: '@idOrganization'
	}, {
		query: {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/vnd.api+json'
			}
		}
	});

})

// PROMOTIONS
.factory('Promotions', function($resource) {

	return $resource(API_URL + '/promotions/:idPromotion', {
		idPromotion: '@idPromotion'
	}, {
		query: {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/vnd.api+json'
			},
			params: {
				include: '@include'
			}
		},
		delete: {
			method: 'DELETE',
			headers: {
				Accept: 'application/vnd.api+json'
			}
		},
		save: {
			method: 'POST',
			headers: {
				'Content-Type': 'application/vnd.api+json',
				Accept: 'application/vnd.api+json'
			}
		},
		update: {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/vnd.api+json',
				Accept: 'application/vnd.api+json'
			}
		}
	});

})

// promotions-states
.factory('PromotionsStates', function($resource) {

	return $resource(API_URL + '/promotion-states', {}, {
		query: {
			method: 'GET',
			headers: {
				Accept: 'application/vnd.api+json'
			},
			params: {
				'page[number]': '@number',
				'page[size]': '@size',
				'filter[id]': '@id',
				'filter[title]': '@title',
				'filter[activated_at]': '@activatedAt',
				'filter[end_date]': '@endDate',
				'filter[start_date]': '@startDate',
				'filter[zone_name]': '@zoneName',
				'filter[dealer_name]': '@dealerName',
				'filter[store_name]': '@storeName',
				'filter[creator_name]': '@creatorName',
				'filter[activator_name]': '@activatorName'
			}
		}
	});

})

// PRODUCT TYPES
.factory('ProductTypes', function($resource) {

	return $resource(API_URL + '/product-types', {}, {
		query: {
			method: 'GET',
			headers: {
				Accept: 'application/vnd.api+json'
			}
		}
	});

})

// PRODUCT DESTINATIONS
.factory('ProductClassifications', function($resource) {

	return $resource(API_URL + '/product-classifications', {}, {
		query: {
			method: 'GET',
			headers: {
				Accept: 'application/vnd.api+json'
			}
		}
	});

})

// PLATFORMS
.factory('ReportTypes', function($resource) {

	return $resource(API_URL + '/organizations/:idOrganization/report-types', {
		idOrganization: ':idOrganization'
	}, {
		query: {
			method: 'GET',
			headers: {
				Accept: 'application/vnd.api+json'
			}
		}
	});

})

// REPORT TYPES
.factory('Platforms', function($resource) {

	return $resource(API_URL + '/platforms', {}, {
		query: {
			method: 'GET',
			headers: {
				Accept: 'application/vnd.api+json'
			}
		}
	});

})

// Message Actions
.factory('MessageActions', function($resource) {

	return $resource(API_URL + '/message-actions', {}, {
		query: {
			method: 'GET',
			headers: {
				Accept: 'application/vnd.api+json'
			}
		}
	});

})

// INBOX
.factory('Inbox', function($resource) {

	return $resource(API_URL + '/broadcasts/:idInbox', {
		idInbox: '@idInbox'
	}, {
		query: {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/vnd.api+json'
			},
			params: {
				include: '@include'
			}
		},
		delete: {
			method: 'DELETE',
			headers: {}
		},
		save: {
			method: 'POST',
			headers: {
				'Content-Type': 'application/vnd.api+json',
				Accept: 'application/vnd.api+json'
			}
		},
		update: {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/vnd.api+json'
			}
		}
	});

})

// Checklists
.factory('Checklists', function($resource) {

	return $resource(API_URL + '/data_parts/:idChecklist', {
		idChecklist: '@idChecklist'
	}, {
		query: {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/vnd.api+json'
			},
			params: {
				'filter[type]': '@type',
				include: '@include'
			}
		},
		save: {
			method: 'POST',
			headers: {
				'Content-Type': 'application/vnd.api+json',
				Accept: 'application/vnd.api+json'
			}
		},
		update: {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/vnd.api+json',
				Accept: 'application/vnd.api+json'
			}
		}
	});

})

// ChecklistActions
.factory('ChecklistActions', function($resource) {

	return $resource(API_URL + '/checklists/:idChecklist', {
		idChecklist: '@idChecklist'
	}, {
		save: {
			method: 'POST',
			headers: {
				'Content-Type': 'application/vnd.api+json',
				Accept: 'application/vnd.api+json'
			}
		},
		update: {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/vnd.api+json',
				Accept: 'application/vnd.api+json'
			}
		},
		delete: {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/vnd.api+json',
				Accept: 'application/vnd.api+json'
			}
		},
	});

})

// StockBreaks
.factory('StockBreaks', function($resource) {

	return $resource(API_URL + '/stock-breaks/:idStockBreak', {
		idStockBreak: '@idStockBreak'
	}, {
		query: {
			method: 'GET',
			headers: {
				'Content-Type': 'application/vnd.api+json',
				Accept: 'application/vnd.api+json'
			},
			params: {
				included: '@included'
			}
		},
		save: {
			method: 'POST',
			headers: {
				'Content-Type': 'application/vnd.api+json',
				Accept: 'application/vnd.api+json'
			}
		},
		update: {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/vnd.api+json',
				Accept: 'application/vnd.api+json'
			}
		},
		delete: {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/vnd.api+json',
				Accept: 'application/vnd.api+json'
			}
		}
	});

})

// FILES
.factory('Files', function($resource) {

	return $resource(API_URL + '/images', {}, {
		save: {
			method: 'POST',
			headers: {
				'Content-Type': 'application/vnd.api+json',
				Accept: 'application/vnd.api+json'
			}
		}
	});

})

// SUBIDAS DE METAS MENSUALES
.factory('SaleGoalUploads', function($resource) {

	return $resource(API_URL + '/sale-goal-uploads', {}, {
		query: {
			method: 'GET',
			headers: {
				'Content-Type': 'application/vnd.api+json',
				Accept: 'application/vnd.api+json'
			},
			params: {
				year: '@year',
				month: '@month'
			}
		}
	});

})

//DASHBOARD
.factory('Dashboard', function($resource) {
	return $resource(API_URL + '/dashboard/:category', {
		category: '@category'
	}, {
		query: {
			method: 'GET',
			headers: {
				'Content-Type': 'application/vnd.api+json',
				Accept: 'application/vnd.api+json'
			},
			params: {
				month: '@month',
				year: '@year',
				instructor_id: '@instructor_id',
				supervisor_id: '@supervisor_id',
				zone_id: '@zone_id',
				dealer_id: '@dealer_id',
				store_id: '@store_id',
				start_date: '@start_date',
				end_date: '@end_date'
			}
		}
	});
})

//ImagesCategories
.factory('ImagesCategories', function($resource) {
	return $resource(API_URL + '/categories', {}, {
		query: {
			method: 'GET',
			headers: {
				Accept: 'application/vnd.api+json'
			}
		}
	});
})

//Tasks
.factory('Tasks', function($resource) {
	return $resource(API_URL + '/tasks', {}, {
		save: {
			method: 'POST',
			headers: {
				Accept: 'application/vnd.api+json',
				'Content-Type': 'application/vnd.api+json'
			},
			params: {
				'fields[tasks]': 'title,description,task_start,task_end,result'
			}
		}
	});
})


//Images
.factory('Images', function($resource) {
	return $resource(API_URL + '/images/:imageId', {
		imageId: '@imageId'
	}, {
		query: {
			method: 'GET',
			headers: {
				'Content-Type': 'application/vnd.api+json',
				Accept: 'application/vnd.api+json'
			},
			params: {
				'page[number]': '@pageNumber',
				'page[size]': '@pageSize',
				include: 'category',
				zone_id: '@zone_id',
				dealer_id: '@dealer_id',
				store_id: '@store_id',
				instructor_id: '@instructor_id',
				supervisor_id: '@supervisor_id',
				start_date: 'start_date',
				end_date: 'end_date',
				category_id: '@category_id'
			}
		},
		delete: {
			method: 'DELETE',
			headers: {
				Accept: 'application/vnd.api+json'
			}
		}
	});
})

//weekly_business_sales
.factory('WeeklyBusinessSales', function($resource, $http) {
	return $resource(API_URL + '/weekly_business_sales/csv/:csv', {
		csv: '@csv'
	}, {
		upload: {
			method: "POST",
			transformRequest: angular.identity,
			headers: {
				'Content-Type': undefined
			}
		}
	});
})

//UploadProducts
.factory('UploadProducts', function($resource, $http) {
	return $resource(API_URL + '/products/csv/:csv', {
		csv: '@csv'
	}, {
		upload: {
			method: "POST",
			transformRequest: angular.identity,
			headers: {
				'Content-Type': undefined
			}
		}
	});
})

//Promoters
.factory('Promoters', function($resource) {
	return $resource(API_URL + '/promoters', {}, {
		query: {
			method: 'GET',
			headers: {
				// 'Content-Type': 'application/vnd.api+json',
				Accept: 'application/vnd.api+json'
			},
			params: {
				'filter[store_ids]': '@storeIds'
			}
		}
	});
})

.factory('ExcelDashboard', function($auth) {

	// return {
	// 	getFile: function(elem, dashboard, fileName, month, year, instructorId, supervisorId, zoneId, dealerId, storeId) {
	// 		var downloadLink = angular.element(elem);
	// 		downloadLink.attr('href', API_URL + '/dashboard/' + dashboard + '.xlsx?month=' + month + '&year=' + year + '&instructor_id=' + instructorId + '&supervisor_id=' + supervisorId + '&zone_id=' + zoneId + '&dealer_id=' + dealerId + '&store_id=' + storeId + '&access_token=' + $auth.getToken());
	// 		downloadLink.attr('download', fileName + '.xlsx');
	// 	}
	// };

	return {
		getFile: function(elem, dashboard, fileName, month, year) {
			var downloadLink = angular.element(elem);
			downloadLink.attr('href', API_URL + '/dashboard/' + dashboard + '.xlsx?month=' + month + '&year=' + year + '&access_token=' + $auth.getToken());
			downloadLink.attr('download', fileName + '.xlsx');
		}
	};

})

// CSV
.service('Csv', function($http) {

	// this.uploadFileToUrl = function(form) {

	var fd = new FormData();

	return {
		upload: function(form) {

			for (var i = 0; i < form.length; i++) {
				fd.append(form[i].field, form[i].value);
			}

			return $http.post(API_URL + '/sale_goals/csv', fd, {
				transformRequest: angular.identity,
				headers: {
					'Content-Type': undefined
				}
			});
		}
	};
});