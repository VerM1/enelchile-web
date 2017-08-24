/**
 * Created by rodrigopalmafanjul on 13-06-17.
 */
angular.module("appenel").value("UTILS_CONFIG", {
  // example:
  // '<Pagar>' + //INICIO DE ESTRUCTURA DE PAGO
  // '<banco> String ${BANCO}</banco>' + //Siempre es un numero entero : valor 4 para WebPay
  // '<tipoPago>String ${T_DEUDA}</tipoPago>' + //va un código: UD: ULTIMO DOCUMENTO | DA: DOCUMENTO ANTERIOR
  // '<monto>String ${monto} </monto>' + // Siempre es un numero entero: 1000 | 20000000 etc
  // '<fechaVencimiento><fechaVencimiento>' +
  // '<fechaEmision></fechaEmision>' +
  // '<fechaOnClick>String ${fechaOnClick}</fechaOnClick>' + // dd/MM/yyyy HH:mm:ss fecha del día
  // '<codigoBarra></codigoBarra>' +
  // '<empresa>String ${empresa}</empresa>' + // empresa = 1 (Eneldistribucion)
  // '<nombre>String ${nombre}</nombre>' + // nombre de la persona, en caso de que nombre = null se envía Nombre
  // '<rut>String ${rut}</rut>' + // rut de la persona, en caso de ser null se envia vacío
  // '<mail>String ${mail}</mail>' + // se envia el mail de la persona, en caso de ser null se envía email@email.com<mailto:email@email.com>
  // '</Pagar>' // CIERRE ESTRUCTURA DE PAGO

  /*  PAYMENT_MODULE */
  PAYMENT_TEMPLATE: '<Pagar>' +
    '<banco></banco>' +
    '<tipoPago></tipoPago>' +
    '<monto></monto>' +
    '<fechaVencimiento></fechaVencimiento>' +
    '<fechaEmision></fechaEmision>' +
    '<fechaOnClick></fechaOnClick>' +
    '<codigoBarra></codigoBarra>' +
    '<empresa></empresa>' +
    '<nombre></nombre>' +
    '<rut></rut>' +
    '<mail></mail>' +
    '</Pagar>',
  PAYMENT_ID_BANK: '4',
  PAYMENT_ENTERPRISE: '1',
  PAYMENT_PAYMENTTYPE_1: "DV",
  PAYMENT_PAYMENTTYPE_2: "UD",
  PAYMENT_PAYMENTTYPE_3: "DA",
  PAYMENT_RRSS_IMAGE: '<img src="img/dummy/rrss.png" alt="help" class="width-full-size"/>',

  /*  CONTACT_MODULE */
  CONTACT_PHONE_NUMER: '6006960000',
  CONTACT_CODE_BRANCHES: "01",
  CONTACT_CODE_PAYMENT_PLACES: "02",

  /*  BLACKOUT_MODULE */
  BLACKOUT_TYPE_PROBLEM_1: "91",
  BLACKOUT_TYPE_PROBLEM_2: "92",

  /*  USAGE TYPE OF RATES   */
  USAGE_TYPE_RATE_1: "BT1",
  USAGE_TYPE_RATE_2: "THR",

  /*  STYLES_APP */
  STYLE_IONICLOADING_TEMPLATE: '<img src="img/logos/enel_loading.gif" width="40" class="spinner"/>',
  // STYLE_IONICLOADING_TEMPLATE: '<p class="loading-text">Cargando</p><ion-spinner icon="spiral" class="spinner-energized"></ion-spinner>',
  STYLE_LOADING_SPINNER: '<ion-spinner icon="spiral" class="spinner-energized"></ion-spinner>',


  /*  IMAGES_APP */
  IMAGE_ASSET_MODAL_HELP: '<img src="img/help/enel_help.png" alt="help" class="width-full-size" />',

  /*  ENCRYPTION KEY CRYPTO-JS */
  ENABLE_ENCRYPTION_LOCALSTORAGE: false,
  SECRET_KEY_ENCRYPTION: 'Everis2017-',

  /*  SECRET KEY TESTFAIRY */
  TESTFAIRY_SECRET_KEY: '5bd10c0da3a67fda56ea3218175f260b96f49d0b',

  /*  SF RESPONSE CODES */
  SUCCESS_CODE: '200',
  ERROR_GENERAL_CODE: '400',
  ERROR_INFO_CODE: '402',
  ERROR_SESSION_ID_CODE: '',
  ERROR_NO_CONTROLED_CODE: '-1',

  /*  GOOGLE MAPS   */
  GOOGLE_MAPS_RESTRICTED_COUNTRY: 'CL'
});