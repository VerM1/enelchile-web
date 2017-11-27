/**
 * Created by rodrigopalmafanjul on 17-05-17.
 */
/**
 * @ngdoc service
 * @name UtilsModule.service:DataMapService
 * @description
 * Factory que guarda pares key/value
 *
 **/
angular.module('CoreModule').service('PopupService', function($ionicModal, $ionicLoading, $route, UTILS_CONFIG, ENDPOINTS) {


  /**
   * @ngdoc method
   * @name CoreModule.PopupService:setItem
   * @methodOf CoreModule.service:PopupService
   *
   * @description
   * Muestra un modal
   * modaltype: error-help-info-logout-validation
   *
   * @param {string} -requierido- modalType - tipo de modal a mostrar
   * @param {String} -requierido- modalTitle - titulo del modal
   * @param {String} -requierido- modalContent - contenido del modal
   * @param {object} -requierido- scope - scope del controlador que lo llama
   * @param {onClose} -opcional- function - funcion a ejecutar si es que desea cerrarse. Puede crearse un $scope.closeModal() en el
   * controlador, para que todos los popups de ese controlador usen el mismo closeModal.
   *
   */
  var openModal = function(modalType, modalTitle, modalContent, scope, onClose) {
    var route = 'views/Modals/' + modalType + 'Modal.html';
    if (onClose) {
      scope.closeModal = onClose;
    }
    $ionicModal.fromTemplateUrl(route, {
      scope: scope,
      /*animation: 'slide-in-up',*/
      animation: modalType == 'help' ? 'slide-in-up' : 'fade',
    }).then(function(modal) {
      $ionicLoading.hide();
      scope.modal = modal;
      scope.modal.title = modalTitle;
      scope.modal.content = modalContent;
      if (modalType === 'iframe') {
        $ionicLoading.show({
          template: UTILS_CONFIG.STYLE_IONICLOADING_TEMPLATE
        });
        scope.modal.show();
      } else if (modalType === 'payment') {
        $ionicLoading.show({
          template: UTILS_CONFIG.STYLE_IONICLOADING_TEMPLATE
        });
        scope.modal.show();
      } else {
        scope.modal.show();
        $ionicLoading.hide();
        $route.reload();
      }
    });
  };

  return {
    openModal: openModal
  };
});