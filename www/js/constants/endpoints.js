angular.module("appenel").value("ENDPOINTS", {
  SETUP: {
    TIMEOUT: 60000,
    TIMEOUT_SESSION: 60000,
    APP_NAME: '',
    API_KEY: '',
    CLIENT_SECRET: '',
    PREPAID_ACCESS_TOKEN: '',
    COLIVING_ACCESS_TOKEN: ''
  },

  /* URLS BASE SALESFORCE*/
  // ENDPOINTS_SALESFORCE: 'https://pceveris-enel-mobile.cs44.force.com/communitytest', //PC-EVERIS
  //   ENDPOINTS_SALESFORCE: 'https://uat-emerpedev-atchchuat-enellatam.cs52.force.com/AppEnel', //UAT
  // ENDPOINTS_SALESFORCE: 'https://preprod-enelcommunity.cs52.force.com/AppEnel', //PRE-PROD
  ENDPOINTS_SALESFORCE: 'https://enelsud.force.com/Appenel', //PROD

  /*  URLS BASE EXTERNAL */
  //   ENDPOINTS_BASE_EXTERNAL: 'https://pceveris-servicerest.cs44.force.com', //PC-EVERIS
  //   ENDPOINTS_BASE_EXTERNAL: 'https://uat-enellatam.cs52.force.com', //UAT
  // ENDPOINTS_BASE_EXTERNAL: 'https://preprod-preprod-enellatam.cs52.force.com', //PRE-PROD
  ENDPOINTS_BASE_EXTERNAL: 'https://enelsudsite.secure.force.com', //PROD.


  /* SERVICIOS CON AUTENTICACION*/
  ENDPOINTS_GET_CONTACT_ID: '/services/apexrest/GetContactIdAuth/',
  ENDPOINTS_ASSESTS_LIST: '/services/apexrest/GetSupplyAuth/',
  ENDPOINTS_ASSET_DETAIL: '/services/apexrest/DetailSupply/',
  ENDPOINTS_ASSET_DEBT: '/services/apexrest/GetDebtAuth/',
  ENDPOINTS_GET_BILLS: '/services/apexrest/GetTicketAuth/', //
  ENDPOINTS_GET_PAYMENTS: '/services/apexrest/GetPaymentAuth/',
  ENDPOINTS_ENTER_READING: '/services/apexrest/EnterReadingAuth/',
  ENDPOINTS_EMERGENCY_LIGHTING_PROBLEM: '/services/apexrest/EmergencyLightingProblemAuth/',
  ENDPOINTS_EMERGENCY_BLACKOUT: '/services/apexrest/EmergencyLightCutAuth/',
  ENDPOINTS_EMERGENCY_RISK_ACCIDENT: '/services/apexrest/EmergencyRiskAccidentAuth/',
  ENDPOINTS_CONSUMPTION: '/services/apexrest/ConsumptionAuth/',
  ENDPOINTS_SETCONTACT: '/services/apexrest/SetContactAuth/',
  ENDPOINTS_EDIT_USER: '/services/apexrest/EditUserAuth/',
  ENDPOINTS_PASSWORD_CHANGE: '/services/apexrest/ChangeOwnPasswordsAuth/',
  ENDPOINTS_ASSET_PROOF_OF_DEBT: '/services/apexrest/ProofOfDebtAuth/',
  ENDPOINTS_ASSET_PAYMENT_STATUS: '/services/apexrest/PaymentStatusAuth/',
  ENDPOINTS_GET_BILL_BY_DATE: '/services/apexrest/CopyReceiptAuth/', // 
  ENDPOINTS_NOTIFICATION_LIST: '/services/apexrest/GetNotifications/', // 
  ENDPOINTS_UPDATE_NOTIFICATION: '/services/apexrest/UpdateNotifications/', // 
  ENDPOINTS_REGISTER_XID_DEVICE: '/services/apexrest/SetXID/',
  ENDPOINTS_ADD_ASSET: "/services/apexrest/SupplyAssociacionAuth/",

  /*  SERVICIOS DE ACCESO EXTERNO*/
  //   ENDPOINTS_GET_USER_SESSION: '/services/apexrest/GetSessionInfo/', // LOGIN V1
  ENDPOINTS_GET_USER_SESSION: '/services/apexrest/GetSessionInfoNeol/', //LOGIN V2.0
  ENDPOINTS_BRACNHES: '/services/apexrest/GetBranches/', //
  ENDPOINTS_FEATURED: '/services/apexrest/GetFeaturedBranches/', //
  ENDPOINTS_COMMERCIAL_DATA: '/services/apexrest/GetBusinessData/', //
  ENDPOINTS_DEBT_DATA: '/services/apexrest/GetDebt/', //
  ENDPOINTS_GET_STATES: '/services/apexrest/GetCommunes/', //
  ENDPOINTS_GET_ASSET_DEBT: '/services/apexrest/GetDebt/', //
  ENDPOINTS_EXTERNAL_EMERGENCY_LIGHTING_PROBLEM: '/services/apexrest/EmergencyLightingProblem/', //
  ENDPOINTS_EXTERNAL_EMERGENCY_RISK_ACCIDENT: '/services/apexrest/EmergencyRiskAccident/', //
  ENDPOINTS_EXTERNAL_EMERGENCY_BLACKOUT: '/services/apexrest/EmergencyLightCut/', //
  ENDPOINTS_EXTERNAL_SETCONTACT: '/services/apexrest/SetContact/', //
  ENDPOINTS_EXTERNAL_SUBJECT: '/services/apexrest/SubjectsType/', //
  ENDPOINTS_BLACKOUT_PROBLEMS_LIST: '/services/apexrest/ProblemsTypeLightCut/', //
  ENDPOINTS_LIGHTING_PROBLEMS_LIST: '/services/apexrest/ProblemsTypeStreetLighting/', //
  ENDPOINTS_RISK_ACCIDENT_PROBLEMS_LIST: '/services/apexrest/ProblemsTypeEmergencyRisk/', //
  ENDPOINTS_EXTERNAL_CHANGE_PASS: '/services/apexrest/ChangeOwnPasswords/', //
  ENDPOINTS_EXTERNAL_CODE_REQUEST: '/services/apexrest/Recoverykey/', //
  ENDPOINTS_EXTERNAL_REGISTRY_USER: '/services/apexrest/RegistryUser/', //
  ENDPOINTS_EXTERNAL_ACTIVATE_ACCOUNT: '/services/apexrest/ActivateAccount/', //
  ENDPOINTS_EXTERNAL_ASSET_PROOF_OF_DEBT: '/services/apexrest/ProofOfDebt/', //
  ENDPOINTS_EXTERNAL_ASSET_PAYMENT_STATUS: '/services/apexrest/PaymentStatus/',
  ENDPOINTS_EXTERNAL_RELATIONSHIP_WITH_ASSET: '/services/apexrest/GetTypeRelationShip/',



  /*  OTROS ENLACES   */
  ENDPOINTS_EXTERNAL_SEARCH_CLIENTID: 'https://www.enel-digital.cl/numero-cliente',
  ENDPOINTS_EXTERNAL_REGISTER_NEOL: 'https://www.eneldistribucion.cl/residencial/registro-de-usuario',
  ENDPOINTS_EXTERNAL_RECOVERY_PASS_NEOL: 'https://www.eneldistribucion.cl/Hogares/rememberPass.html',


  /* PAGOS */

  // ENDPOINTS_PAYMENT: 'https://prewebpay3g.enel.com/bdp/TraductorPage.aspx',
  ENDPOINTS_PAYMENT: 'https://webpay3g.enel.com/bdp/TraductorPage.aspx',
  ENDPOINTS_PAYMENT_SUCCESS: 'TraductorSalidaPage.aspx?exito=true',
  ENDPOINTS_PAYMENT_ERROR: 'TraductorSalidaPage.aspx?exito=false',

  /*  ANALYTICS  */
  ENDPOINTS_ANALYTICS: 'https://www.google-analytics.com/collect',
  ENDPOINTS_GOOGLE_STATICS_MAP: "https://maps.googleapis.com/maps/api/staticmap",

  /* REDES SOCIALES */
  ENDPOINTS_FACEBOOK: "https://www.facebook.com/EnelChile",
  ENDPOINTS_TWITTER: "https://twitter.com/EnelClientesCL",
});