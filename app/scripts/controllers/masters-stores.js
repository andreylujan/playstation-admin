'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:MailComposeCtrl
 * @description
 * # MailComposeCtrl
 * Controller of the minovateApp
 */
angular.module('minovateApp')

.controller('StoresCtrl', function($scope, $log, $uibModal, $filter, NgTableParams, Stores, Utils) {

    $scope.page = {
        title: 'Tiendas',
        tableLoaded: false
    };

    var stores = [];

    var i, j = 0;

    $scope.getStores = function(e) {
        if (!e.success) {
            $log.error(e.detail);
            return;
        }

        stores = [];

        Stores.query({}, function(success) {

            for (var i = 0; i < success.data.length; i++) {
                stores.push({
                    id: success.data[i].id,
                    name: success.data[i].attributes.name
                });
            }

            $scope.tableParams = new NgTableParams({
                page: 1, // show first page
                count: 25, // count per page
                sorting: {
                    name: 'asc' // initial sorting
                }
            }, {
                total: stores.length, // length of stores
                dataset: stores
            });
            $scope.page.tableLoaded = true;

        }, function(error) {
            $log.error(error);
            if (error.status === 401) {
                Utils.refreshToken($scope.getUsers);
            }
        });
    };

    $scope.openModalCreateStore = function(idStore) {

        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'createStore.html',
            controller: 'CreateStoreModalInstance',
            resolve: {
                idStore: function() {
                    return idStore;
                }
            }
        });

        modalInstance.result.then(function(data) {
            if (data) {
                if (data.action === 'save') {
                    $log.log('agrego el');
                    $log.log(data);
                    stores.unshift({
                        id: data.id,
                        name: data.name
                    });
                }
                if (data.action === 'edit') {
                    for (i = 0; i < stores.length; i++) {
                        if (parseInt(stores[i].id) === parseInt(data.id)) {
                            stores[i].name = data.name;
                            break;
                        }
                    }
                }
                if (data.action === 'delete') {
                    for (i = 0; i < stores.length; i++) {
                        if (parseInt(stores[i].id) === parseInt(data.id)) {
                            stores.splice(i, 1);
                            break;
                        }
                    }
                }
                $scope.tableParams.reload();
            }

        }, function() {});
    };

    $scope.getStores({
        success: true,
        detail: 'OK'
    });

})

.controller('CreateStoreModalInstance', function($scope, $log, $uibModalInstance, idStore, Users, Stores, Dealers, Zones, Promoters, StoreTypes, Validators, Utils) {

    $scope.modal = {
        title: {
            text: null
        },
        subtitle: {
            text: null
        },
        alert: {
            color: '',
            show: false,
            title: '',
            text: null
        },
        store: {
            name: {
                text: null,
                disabled: true
            },
            code: {
                text: null,
                disabled: true
            },
            contact: {
                text: null,
                disabled: true
            },
            phone: {
                text: null,
                disabled: true
            },
            address: {
                text: null,
                disabled: true
            },
            disabled: true,
            userSupervisorId: null,
            userInstructorId: null,
            zoneId: null,
            dealerId: null,
            storeTypeId: null
        },
        users: {
            selectedUsersSupervisor: [],
            selectedUsersInstructor: [],
            users: [],
            disabled: true
        },
        zones: {
            selectedZones: {},
            zones: [],
            disabled: true
        },
        dealers: {
            selectedDealers: [],
            dealers: [],
            disabled: true
        },
        storeTypes: {
            selectedStoreTypes: [],
            storeTypes: [],
            disabled: true
        },
        promoters: {
            list: [],
            selectedUsersPromoter: [],
            disabled: true
        },
        buttons: {
            edit: {
                border: false,
                show: false,
                text: 'Editar'
            },
            create: {
                border: false,
                show: false,
                text: 'Guardar'
            },
            delete: {
                border: true,
                show: false,
                text: 'Eliminar'
            }
        }
    };

    var i = 0,
        j = 0;

    var getUsers = function(e) {
        if (!e.success) {
            $log.error(e.detail);
            return;
        }

        Users.query({
            sort: 'first_name,last_name'
        }, function(success) {
            if (success.data) {
                for (i = 0; i < success.data.length; i++) {
                    //  sólo si el usuario está activo, se agrega al array de usuarios
                    if (success.data[i].attributes.active) {
                        $scope.modal.users.users.push({
                            id: success.data[i].id,
                            firstName: success.data[i].attributes.first_name,
                            lastName: success.data[i].attributes.last_name,
                            fullName: success.data[i].attributes.first_name + ' ' + success.data[i].attributes.last_name,
                            type: 'users'
                        });
                    }
                }

                getStoreTypes({
                    success: true,
                    detail: 'OK'
                });

            } else {
                $log.error(success);
            }
        }, function(error) {
            $log.log(error);
            if (error.status === 401) {
                Utils.refreshToken(getUsers);
            }
        });
    };

    var getStoreTypes = function(e) {
        if (!e.success) {
            $log.error(e.detail);
            return;
        }

        StoreTypes.query({}, function(success) {
            // $log.log(success);
            if (success.data) {
                for (i = 0; i < success.data.length; i++) {
                    $scope.modal.storeTypes.storeTypes.push({
                        id: success.data[i].id,
                        name: success.data[i].attributes.name,
                        type: 'store_types'
                    });
                }
                getZones({
                    success: true,
                    detail: 'OK'
                });
            } else {
                $log.error(success);
            }
        }, function(error) {
            $log.error(error);
            if (error.status === 401) {
                Utils.refreshToken(getStoreTypes);
            }
        });
    };

    var getZones = function(e) {
        if (!e.success) {
            $log.error(e.detail);
            return;
        }

        Zones.query({}, function(success) {
            if (success.data) {
                $scope.modal.zones.zones = [];

                for (i = 0; i < success.data.length; i++) {
                    $scope.modal.zones.zones.push({
                        id: success.data[i].id,
                        name: success.data[i].attributes.name,
                        dealersIds: success.data[i].attributes.dealer_ids,
                        type: 'zones'
                    });
                }

                if (idStore) {
                    getStoreDetails({
                        success: true,
                        detail: 'OK'
                    });
                }

            } else {
                $log.error(success);
            }

        }, function(error) {
            $log.error(error);
            if (error.status === 401) {
                Utils.refreshToken(getZones);
            }
        });
    };

    // Carga todos los deales pertenecientes a la zona seleccionada
    $scope.getDealers = function(e) {
        if (!e.success) {
            $log.error(e.detail);
            return;
        }

        Dealers.query({}, function(success) {
            // $log.log(success);

            if (success.data) {
                $scope.modal.dealers.dealers = [];
                $scope.modal.dealers.selectedDealers = {};

                for (j = 0; j < $scope.modal.zones.selectedZones.dealersIds.length; j++) {
                    for (i = 0; i < success.data.length; i++) {
                        if ($scope.modal.zones.selectedZones.dealersIds[j] === parseInt(success.data[i].id)) {
                            $scope.modal.dealers.dealers.push({
                                id: success.data[i].id,
                                name: success.data[i].attributes.name,
                                type: 'dealers'
                            });
                            break;
                        }
                    }
                }
                // Luego de que se cargaron todos los dealers pertenecientes a la zona seleccionada
                // Si hay un idStore (se esta editando una tienda) se selecciona el dealer de la lista
                if (idStore) {
                    selectDealers();
                }
            }
        }, function(error) {
            $log.log(error);
            if (error.status === 401) {
                Utils.refreshToken($scope.getUsers);
            }
        });
    };

    var getStoreDetails = function(e) {
        if (!e.success) {
            $log.error(e.detail);
            return;
        }

        var storeTypeId = null;

        Stores.query({
            storeId: idStore,
            include: 'store_type,supervisor,instructor,promoter'
        }, function(success) {
            // $log.log(success);
            if (success.data) {
                $scope.modal.store.name.text = success.data.attributes.name;
                $scope.modal.store.contact.text = success.data.attributes.contact;
                $scope.modal.store.phone.text = success.data.attributes.phone_number;
                $scope.modal.store.address.text = success.data.attributes.address;

                $scope.modal.store.userSupervisorId = success.data.relationships.supervisor.data ? success.data.relationships.supervisor.data.id : null;
                $scope.modal.store.userPromoterId = success.data.relationships.promoter.data ? success.data.relationships.promoter.data.id : null;
                $scope.modal.store.userInstructorId = success.data.relationships.instructor.data ? success.data.relationships.instructor.data.id : null;

                $scope.modal.store.zoneId = success.data.attributes.zone_id;
                $scope.modal.store.dealerId = success.data.attributes.dealer_id;
                $scope.modal.store.code.text = success.data.attributes.code;

                $scope.modal.store.storeTypeId = success.data.relationships.store_type.data ? success.data.relationships.store_type.data.id : null;


                // Se seleccionan los datos de la tienda a editar
                selectUsersInstructor();
                selectUsersSupervisor();
                selectUsersPromoter();
                selectZones();
                // selectDealers();
                selectStoreTypes();
            } else {
                $scope.modal.alert.color = 'danger';
                $scope.modal.alert.title = 'Ha ocurrido un error al obtener los datos de la tienda';
                $scope.modal.alert.text = '';
                $scope.modal.alert.show = true;
                $log.log(success);
            }
        }, function(error) {
            $scope.modal.alert.color = 'danger';
            $scope.modal.alert.title = 'Ha ocurrido un error al obtener los datos de la tienda';
            $scope.modal.alert.text = '';
            $scope.modal.alert.show = true;
            $log.log(error);
            if (error.status === 401) {
                Utils.refreshToken(getStoreDetails);
            }
        });
    };



    var selectUsersInstructor = function() {
        for (i = 0; i < $scope.modal.users.users.length; i++) {
            if (parseInt($scope.modal.users.users[i].id) === parseInt($scope.modal.store.userSupervisorId)) {
                $scope.modal.users.selectedUsersSupervisor.id = $scope.modal.users.users[i].id;
                $scope.modal.users.selectedUsersSupervisor.fullName = $scope.modal.users.users[i].fullName;
                $scope.modal.users.selectedUsersSupervisor.type = $scope.modal.users.users[i].type;
                break;
            }
        }
    };

    var selectUsersSupervisor = function() {
        for (i = 0; i < $scope.modal.users.users.length; i++) {
            if (parseInt($scope.modal.users.users[i].id) === parseInt($scope.modal.store.userInstructorId)) {
                $scope.modal.users.selectedUsersInstructor.id = $scope.modal.users.users[i].id;
                $scope.modal.users.selectedUsersInstructor.fullName = $scope.modal.users.users[i].fullName;
                $scope.modal.users.selectedUsersInstructor.type = $scope.modal.users.users[i].type;
                break;
            }
        }
    };

    var selectUsersPromoter = function() {
        for (i = 0; i < $scope.modal.promoters.list.length; i++) {
            if (parseInt($scope.modal.promoters.list[i].id) === parseInt($scope.modal.store.userPromoterId)) {
                $scope.modal.promoters.selectedUsersPromoter.id = $scope.modal.promoters.list[i].id;
                $scope.modal.promoters.selectedUsersPromoter.name = $scope.modal.promoters.list[i].name;
                $scope.modal.promoters.selectedUsersPromoter.type = $scope.modal.promoters.list[i].type;
                break;
            }
        }
    };

    var selectZones = function() {
        for (i = 0; i < $scope.modal.zones.zones.length; i++) {
            if (parseInt($scope.modal.zones.zones[i].id) === parseInt($scope.modal.store.zoneId)) {
                $scope.modal.zones.selectedZones.id = $scope.modal.zones.zones[i].id;
                $scope.modal.zones.selectedZones.name = $scope.modal.zones.zones[i].name;
                $scope.modal.zones.selectedZones.type = $scope.modal.zones.zones[i].type;
                $scope.modal.zones.selectedZones.dealersIds = $scope.modal.zones.zones[i].dealersIds;
                break;
            }
        }
        // Cuando se selecciona la zona a la cual pertenece la tienda, se cargan los dealers pertenecientes a esa zona
        $scope.getDealers({
            success: true,
            detail: 'OK'
        });
    };

    var selectDealers = function() {
        for (i = 0; i < $scope.modal.dealers.dealers.length; i++) {
            if (parseInt($scope.modal.dealers.dealers[i].id) === parseInt($scope.modal.store.dealerId)) {
                $scope.modal.dealers.selectedDealers.id = $scope.modal.dealers.dealers[i].id;
                $scope.modal.dealers.selectedDealers.name = $scope.modal.dealers.dealers[i].name;
                $scope.modal.dealers.selectedDealers.type = $scope.modal.dealers.dealers[i].type;
                break;
            }
        }
    };

    var selectStoreTypes = function() {
        for (i = 0; i < $scope.modal.storeTypes.storeTypes.length; i++) {
            if ($scope.modal.store.storeTypeId) {
                if (parseInt($scope.modal.storeTypes.storeTypes[i].id) === parseInt($scope.modal.store.storeTypeId)) {
                    $scope.modal.storeTypes.selectedStoreTypes.id = $scope.modal.storeTypes.storeTypes[i].id;
                    $scope.modal.storeTypes.selectedStoreTypes.name = $scope.modal.storeTypes.storeTypes[i].name;
                    $scope.modal.storeTypes.selectedStoreTypes.type = $scope.modal.storeTypes.storeTypes[i].type;
                    break;
                }
            }
        }
    };

    $scope.createStore = function(e) {
        if (!e.success) {
            $log.error(e.detail);
            return;
        }

        if (!Validators.validaRequiredField($scope.modal.store.name.text)) {
            $scope.modal.alert.color = 'danger';
            $scope.modal.alert.title = 'Faltan datos';
            $scope.modal.alert.text = 'Debe indicar un nombre para la tienda';
            $scope.modal.alert.show = true;
            Utils.gotoAnyPartOfPage('topModalCreateStore');
            return;
        }

        if (!Validators.validaRequiredField($scope.modal.store.code.text)) {
            $scope.modal.alert.color = 'danger';
            $scope.modal.alert.title = 'Faltan datos';
            $scope.modal.alert.text = 'Debe indicar un código para la tienda';
            $scope.modal.alert.show = true;
            Utils.gotoAnyPartOfPage('topModalCreateStore');
            return;
        }
        /*
		if (!Validators.validaRequiredField($scope.modal.users.selectedUsersSupervisor.id)) {
			$scope.modal.alert.color = 'danger';
			$scope.modal.alert.title = 'Faltan datos';
			$scope.modal.alert.text = 'Debe indicar un supervisor';
			$scope.modal.alert.show = true;
			Utils.gotoAnyPartOfPage('topModalCreateStore');
			return;
		}

		if (!Validators.validaRequiredField($scope.modal.users.selectedUsersInstructor.id)) {
			$scope.modal.alert.color = 'danger';
			$scope.modal.alert.title = 'Faltan datos';
			$scope.modal.alert.text = 'Debe indicar un instructor';
			$scope.modal.alert.show = true;
			Utils.gotoAnyPartOfPage('topModalCreateStore');
			return;
		}

		if (!Validators.validaRequiredField($scope.modal.promoters.selectedUsersPromoter.id)) {
			$scope.modal.alert.color = 'danger';
			$scope.modal.alert.title = 'Faltan datos';
			$scope.modal.alert.text = 'Debe indicar un promotor';
			$scope.modal.alert.show = true;
			Utils.gotoAnyPartOfPage('topModalCreateStore');
			return;
		}

		if (!Validators.validaRequiredField($scope.modal.storeTypes.selectedStoreTypes.id)) {
			$scope.modal.alert.color = 'danger';
			$scope.modal.alert.title = 'Faltan datos';
			$scope.modal.alert.text = 'Debe indicar un tipo de tienda';
			$scope.modal.alert.show = true;
			Utils.gotoAnyPartOfPage('topModalCreateStore');
			return;
		}
		*/

        if (!Validators.validaRequiredField($scope.modal.zones.selectedZones.id)) {
            $scope.modal.alert.color = 'danger';
            $scope.modal.alert.title = 'Faltan datos';
            $scope.modal.alert.text = 'Debe indicar una zona para la tienda';
            $scope.modal.alert.show = true;
            Utils.gotoAnyPartOfPage('topModalCreateStore');
            return;
        }

        if (!Validators.validaRequiredField($scope.modal.dealers.selectedDealers.id)) {
            $scope.modal.alert.color = 'danger';
            $scope.modal.alert.title = 'Faltan datos';
            $scope.modal.alert.text = 'Debe indicar un dealer para la tienda';
            $scope.modal.alert.show = true;
            Utils.gotoAnyPartOfPage('topModalCreateStore');
            return;
        }

        var zone = {
            type: $scope.modal.zones.selectedZones.type,
            id: $scope.modal.zones.selectedZones.id
        };
        var dealer = {
            type: $scope.modal.dealers.selectedDealers.type,
            id: $scope.modal.dealers.selectedDealers.id
        };
        var storeType = {
            type: $scope.modal.storeTypes.selectedStoreTypes.type,
            id: $scope.modal.storeTypes.selectedStoreTypes.id
        };
        var supervisor = {
            type: $scope.modal.users.selectedUsersSupervisor.type,
            id: $scope.modal.users.selectedUsersSupervisor.id
        };
        var instructor = {
            type: $scope.modal.users.selectedUsersInstructor.type,
            id: $scope.modal.users.selectedUsersInstructor.id
        };
        var promoter = {
            type: $scope.modal.promoters.selectedUsersPromoter.type,
            id: $scope.modal.promoters.selectedUsersPromoter.id
        };

        console.log(storeType);
        var data = {
            type: 'stores',
            attributes: {
                name: $scope.modal.store.name.text,
                contact: $scope.modal.store.contact.text,
                phone_number: $scope.modal.store.phone.text,
                address: $scope.modal.store.address.text,
                code: $scope.modal.store.code.text
            },
            relationships: {
                zone: {
                    data: zone
                },
                dealer: {
                    data: dealer
                }
            }
        };

        if (storeType.id) {
            data.relationships.store_type = {
                data: storeType
            };
        }

        if (supervisor.id) {
            data.relationships.supervisor = {
                data: supervisor
            };
        }

        if (instructor.id) {
            data.relationships.instructor = {
                data: instructor
            };
        }

        if (promoter.id) {
            data.relationships.promoter = {
                data: promoter
            };
        }


        Stores.save({
            data: data
        }, function(success) {

            var newStoreInfo = {
                id: success.data.id,
                name: success.data.attributes.name,
                action: 'save'
            };
            $uibModalInstance.close(newStoreInfo);
        }, function(error) {
            $scope.modal.alert.color = 'danger';
            $scope.modal.alert.title = 'No se ha podido crear la tienda, intente nuevamente';
            $scope.modal.alert.text = '';
            $scope.modal.alert.show = true;
            $log.error(error);
            if (error.status === 401) {
                Utils.refreshToken($scope.createStore);
            }
        });
    };

    $scope.editStore = function(e) {
        if (!e.success) {
            $log.error(e.detail);
            return;
        }
        // var monthlyGoalClp = $scope.modal.store.montlyGoalClp.text ? $scope.modal.store.montlyGoalClp.text : '0';
        // var monthlyGoalUsd = $scope.modal.store.montlyGoalUsd.text ? $scope.modal.store.montlyGoalUsd.text : '0';

        if ($scope.modal.buttons.edit.text === 'Editar') {
            $scope.modal.buttons.edit.text = 'Guardar';
            // $scope.modal.buttons.edit.border = false;
            $scope.modal.store.name.disabled = false;
            $scope.modal.store.code.disabled = false;
            $scope.modal.store.contact.disabled = false;
            $scope.modal.store.phone.disabled = false;
            $scope.modal.store.address.disabled = false;
            // $scope.modal.store.montlyGoalClp.disabled = false;
            // $scope.modal.store.montlyGoalUsd.disabled = false;
            $scope.modal.users.disabled = false;
            $scope.modal.zones.disabled = false;
            $scope.modal.dealers.disabled = false;
            $scope.modal.storeTypes.disabled = false;
            $scope.modal.promoters.disabled = false;

            $scope.modal.alert.color = 'blue-ps-1';
            $scope.modal.alert.title = 'Para efectuar la edición, presione el botón Guardar';
            $scope.modal.alert.text = '';
            $scope.modal.alert.show = true;
        } else {
            $scope.modal.buttons.edit.text = 'Editar';
            $scope.modal.store.name.disabled = true;
            $scope.modal.store.code.disabled = true;
            $scope.modal.store.contact.disabled = true;
            $scope.modal.store.phone.disabled = true;
            $scope.modal.store.address.disabled = true;
            // $scope.modal.store.montlyGoalClp.disabled = true;
            // $scope.modal.store.montlyGoalUsd.disabled = true;
            $scope.modal.users.disabled = true;
            $scope.modal.zones.disabled = true;
            $scope.modal.dealers.disabled = true;
            $scope.modal.storeTypes.disabled = true;
            $scope.modal.promoters.disabled = true;

            if (!Validators.validaRequiredField($scope.modal.store.name.text)) {
                $scope.modal.alert.color = 'danger';
                $scope.modal.alert.title = 'Faltan datos';
                $scope.modal.alert.text = 'Debe indicar un nombre para la tienda';
                $scope.modal.alert.show = true;
                return;
            }

            if (!Validators.validaRequiredField($scope.modal.store.code.text)) {
                $scope.modal.alert.color = 'danger';
                $scope.modal.alert.title = 'Faltan datos';
                $scope.modal.alert.text = 'Debe indicar un código para la tienda';
                $scope.modal.alert.show = true;
                Utils.gotoAnyPartOfPage('topModalCreateStore');
                return;
            }
            /* if (!Validators.validaRequiredField($scope.modal.promoters.selectedUsersPromoter.id)) {
				$scope.modal.alert.color = 'danger';
				$scope.modal.alert.title = 'Faltan datos';
				$scope.modal.alert.text = 'Debe indicar un promotor';
				$scope.modal.alert.show = true;
				Utils.gotoAnyPartOfPage('topModalCreateStore');
				return;
			}

			if (!Validators.validaRequiredField($scope.modal.users.selectedUsersSupervisor.id)) {
				$scope.modal.alert.color = 'danger';
				$scope.modal.alert.title = 'Faltan datos';
				$scope.modal.alert.text = 'Debe indicar un usuario supervisor';
				$scope.modal.alert.show = true;
				Utils.gotoAnyPartOfPage('topModalCreateStore');
				return;
			}

			if (!Validators.validaRequiredField($scope.modal.users.selectedUsersInstructor.id)) {
				$scope.modal.alert.color = 'danger';
				$scope.modal.alert.title = 'Faltan datos';
				$scope.modal.alert.text = 'Debe indicar un usuario instructor';
				$scope.modal.alert.show = true;
				Utils.gotoAnyPartOfPage('topModalCreateStore');
				return;
			}
			*/

            /* 
			if (!Validators.validaRequiredField($scope.modal.storeTypes.selectedStoreTypes.id)) {
				$scope.modal.alert.color = 'danger';
				$scope.modal.alert.title = 'Faltan datos';
				$scope.modal.alert.text = 'Debe indicar un tipo de tienda';
				$scope.modal.alert.show = true;
				Utils.gotoAnyPartOfPage('topModalCreateStore');
				return;
			}
			*/
            if (!Validators.validaRequiredField($scope.modal.zones.selectedZones.id)) {
                $scope.modal.alert.color = 'danger';
                $scope.modal.alert.title = 'Faltan datos';
                $scope.modal.alert.text = 'Debe indicar una zona para la tienda';
                $scope.modal.alert.show = true;
                return;
            }

            if (!Validators.validaRequiredField($scope.modal.dealers.selectedDealers.id)) {
                $scope.modal.alert.color = 'danger';
                $scope.modal.alert.title = 'Faltan datos';
                $scope.modal.alert.text = 'Debe indicar un dealer para la tienda';
                $scope.modal.alert.show = true;
                return;
            }

            var zone = {
                type: $scope.modal.zones.selectedZones.type,
                id: $scope.modal.zones.selectedZones.id
            };
            var dealer = {
                type: $scope.modal.dealers.selectedDealers.type,
                id: $scope.modal.dealers.selectedDealers.id
            };
            var storeType = {
                type: $scope.modal.storeTypes.selectedStoreTypes.type,
                id: $scope.modal.storeTypes.selectedStoreTypes.id
            };
            var supervisor = {
                type: $scope.modal.users.selectedUsersSupervisor.type,
                id: $scope.modal.users.selectedUsersSupervisor.id
            };
            var instructor = {
                type: $scope.modal.users.selectedUsersInstructor.type,
                id: $scope.modal.users.selectedUsersInstructor.id
            };
            var promoter = {
                type: $scope.modal.promoters.selectedUsersPromoter.type,
                id: $scope.modal.promoters.selectedUsersPromoter.id
            };

            var data = {
                type: "stores",
                id: idStore,
                attributes: {
                    name: $scope.modal.store.name.text,
                    contact: $scope.modal.store.contact.text,
                    phone_number: $scope.modal.store.phone.text,
                    address: $scope.modal.store.address.text,
                    code: $scope.modal.store.code.text
                },
                relationships: {
                    zone: {
                        data: zone
                    },
                    dealer: {
                        data: dealer
                    }
                }
            };

            if (storeType.id) {
                data.relationships.store_type = {
                    data: storeType
                };
            }

            if (supervisor.id) {
                data.relationships.supervisor = {
                    data: supervisor
                };
            }

            if (instructor.id) {
                data.relationships.instructor = {
                    data: instructor
                };
            }

            if (promoter.id) {
                data.relationships.promoter = {
                    data: promoter
                };
            }

            Stores.update({
                storeId: idStore,
                data: data
            }, function(success) {
                var storeEditedInfo = {
                    id: success.data.id,
                    name: success.data.attributes.name,
                    action: 'edit'
                };
                $uibModalInstance.close(storeEditedInfo);
            }, function(error) {
                $scope.modal.alert.color = 'danger';
                $scope.modal.alert.title = 'No se ha podido editar la tienda, intente nuevamente';
                $scope.modal.alert.text = '';
                $scope.modal.alert.show = true;
                Utils.gotoAnyPartOfPage('topModalCreateStore');
                $log.log(error);
                if (error.status === 401) {
                    Utils.refreshToken($scope.editStore);
                }
            });
        }
    };

    $scope.deleteStore = function(e) {
        if (!e.success) {
            $log.error(e.detail);
            return;
        }

        if ($scope.modal.buttons.delete.text === 'Eliminar') {
            $scope.modal.buttons.delete.text = 'Si, Eliminar';
            $scope.modal.buttons.delete.border = false;

            $scope.modal.alert.color = 'danger';
            $scope.modal.alert.title = '¿Seguro que desea eliminar la tienda?';
            $scope.modal.alert.text = 'Para eliminarla, vuelva a presionar el botón';
            $scope.modal.alert.show = true;
        } else {
            $scope.modal.buttons.delete.text = 'Eliminar';

            Stores.delete({
                storeId: idStore
            }, function(success) {
                var storeDeletedInfo = {
                    id: idStore,
                    name: '',
                    action: 'delete'
                };
                $uibModalInstance.close(storeDeletedInfo);
            }, function(error) {
                $scope.modal.alert.color = 'danger';
                $scope.modal.alert.title = 'No se ha podido borrar la tienda';
                $scope.modal.alert.text = '';
                $scope.modal.alert.show = true;
                $log.log(error);
                if (error.status === 401) {
                    Utils.refreshToken($scope.deleteStore);
                }
            });
        }
    };

    $scope.ok = function() {
        // $uibModalInstance.close($scope.selected.item);
        $uibModalInstance.close();
    };

    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.removeAlert = function() {
        $scope.modal.alert.color = '';
        $scope.modal.alert.title = '';
        $scope.modal.alert.text = '';
        $scope.modal.alert.show = false;
    };

    getUsers({
        success: true,
        detail: 'OK'
    });

    if (idStore) {
        $scope.modal.title.text = 'Información tienda';
        $scope.modal.subtitle.text = '';
        $scope.modal.buttons.create.show = false;
        $scope.modal.buttons.edit.show = true;
        $scope.modal.buttons.delete.show = true;

        $scope.modal.buttons.edit.border = true;
        $scope.modal.buttons.create.border = true;
        $scope.modal.buttons.delete.border = true;

        $scope.modal.store.name.disabled = true;
        $scope.modal.store.contact.disabled = true;
        $scope.modal.store.phone.disabled = true;
        $scope.modal.store.address.disabled = true;
        // $scope.modal.store.montlyGoalClp.disabled = true;
        // $scope.modal.store.montlyGoalUsd.disabled = true;
        $scope.modal.users.disabled = true;
        $scope.modal.zones.disabled = true;
        $scope.modal.dealers.disabled = true;
        $scope.modal.storeTypes.disabled = true;

    } else {
        $scope.modal.title.text = 'Crear tienda';
        $scope.modal.subtitle.text = '';
        $scope.modal.buttons.create.show = true;
        $scope.modal.buttons.edit.show = false;
        $scope.modal.buttons.delete.show = false;

        $scope.modal.store.name.disabled = false;
        $scope.modal.store.code.disabled = false;
        $scope.modal.store.contact.disabled = false;
        $scope.modal.store.phone.disabled = false;
        $scope.modal.store.address.disabled = false;
        // $scope.modal.store.montlyGoalClp.disabled = false;
        // $scope.modal.store.montlyGoalUsd.disabled = false;
        $scope.modal.users.disabled = false;
        $scope.modal.zones.disabled = false;
        $scope.modal.dealers.disabled = false;
        $scope.modal.storeTypes.disabled = false;
        $scope.modal.promoters.disabled = false;
    }

});