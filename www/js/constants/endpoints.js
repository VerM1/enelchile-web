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
  //ENDPOINTS_SALESFORCE: 'https://preprod-enelcommunity.cs52.force.com/AppEnel', //UAT
  ENDPOINTS_SALESFORCE: 'https://enelsud.force.com/Appenel', //PROD

  /*  URLS BASE EXTERNAL */
  // ENDPOINTS_BASE_EXTERNAL: 'https://pceveris-servicerest.cs44.force.com', //PC-EVERIS
  //   ENDPOINTS_BASE_EXTERNAL: 'https://uat-enellatam.cs52.force.com', //UAT
  //ENDPOINTS_BASE_EXTERNAL: 'https://preprod-preprod-enellatam.cs52.force.com', //UAT
  ENDPOINTS_BASE_EXTERNAL: 'https://enelsudsite.secure.force.com', //PROD.


  /* SERVICIOS CON AUTENTICACION*/
  ENDPOINTS_GET_CONTACT_ID: '/services/apexrest/GetContactIdAuth/',
  ENDPOINTS_ASSESTS_LIST: '/services/apexrest/GetSupplyAuth/',
  ENDPOINTS_ASSET_DETAIL: '/services/apexrest/DetailSupply/',
  ENDPOINTS_ASSET_DEBT: '/services/apexrest/GetDebtAuth',
  ENDPOINTS_GET_BILLS: '/services/apexrest/GetTicketAuth/', //REVISAR
  ENDPOINTS_GET_PAYMENTS: '/services/apexrest/GetPaymentAuth/',
  ENDPOINTS_ENTER_READING: '/services/apexrest/EnterReadingAuth/',
  ENDPOINTS_EMERGENCY_LIGHTING_PROBLEM: '/services/apexrest/EmergencyLightingProblemAuth/',
  ENDPOINTS_EMERGENCY_BLACKOUT: '/services/apexrest/EmergencyLightCutAuth/',
  ENDPOINTS_EMERGENCY_RISK_ACCIDENT: '/services/apexrest/EmergencyRiskAccidentAuth/',
  ENDPOINTS_CONSUMPTION: '/services/apexrest/ConsumptionAuth/',
  ENDPOINTS_SETCONTACT: '/services/apexrest/SetContactAuth/',
  ENDPOINTS_EDIT_USER: '/services/apexrest/EditUserAuth/',
  ENDPOINTS_PASSWORD_CHANGE: '/services/apexrest/ChangeOwnPasswordsAuth/',
  ENDPOINTS_ASSET_PROOF_OF_DEBT: '/services/apexrest/ProofOfDebtAuth',
  ENDPOINTS_GET_BILL_BY_DATE: '/services/apexrest/CopyReceiptAuth', //PC-EVERIS 

  /*  SERVICIOS DE ACCESO EXTERNO*/
  ENDPOINTS_GET_USER_SESSION: '/services/apexrest/GetSessionInfo', //PC-EVERIS
  ENDPOINTS_BRACNHES: '/services/apexrest/GetBranches', //PC-EVERIS
  ENDPOINTS_FEATURED: '/services/apexrest/GetFeaturedBranches/', //PC-EVERIS
  ENDPOINTS_COMMERCIAL_DATA: '/services/apexrest/GetBusinessData', //PC-EVERIS
  ENDPOINTS_DEBT_DATA: '/services/apexrest/GetDebt', //PC-EVERIS
  ENDPOINTS_GET_STATES: '/services/apexrest/GetCommunes/', //PC-EVERIS
  ENDPOINTS_GET_ASSET_DEBT: '/services/apexrest/GetDebt', //PE-EVERIS
  ENDPOINTS_EXTERNAL_EMERGENCY_LIGHTING_PROBLEM: '/services/apexrest/EmergencyLightingProblem/', //PC-EVERIS
  ENDPOINTS_EXTERNAL_EMERGENCY_RISK_ACCIDENT: '/services/apexrest/EmergencyRiskAccident/', //PC-EVERIS
  ENDPOINTS_EXTERNAL_EMERGENCY_BLACKOUT: '/services/apexrest/EmergencyLightCut/', //PC-EVERIS
  ENDPOINTS_EXTERNAL_SETCONTACT: '/services/apexrest/SetContact/', //PC-EVERIS
  ENDPOINTS_EXTERNAL_SUBJECT: '/services/apexrest/SubjectsType/', //PC-EVERIS
  ENDPOINTS_BLACKOUT_PROBLEMS_LIST: '/services/apexrest/ProblemsTypeLightCut/', //PC-EVERIS
  ENDPOINTS_LIGHTING_PROBLEMS_LIST: '/services/apexrest/ProblemsTypeStreetLighting/', //PC-EVERIS
  ENDPOINTS_RISK_ACCIDENT_PROBLEMS_LIST: '/services/apexrest/ProblemsTypeEmergencyRisk/', //PC-EVERIS
  ENDPOINTS_EXTERNAL_CHANGE_PASS: '/services/apexrest/ChangeOwnPasswords/', //PC-EVERIS
  ENDPOINTS_EXTERNAL_CODE_REQUEST: '/services/apexrest/Recoverykey/', //PC-EVERIS
  ENDPOINTS_EXTERNAL_REGISTRY_USER: '/services/apexrest/RegistryUser/', //PC-EVERIS
  ENDPOINTS_EXTERNAL_ACTIVATE_ACCOUNT: '/services/apexrest/ActivateAccount', //PC-EVERIS,
  ENDPOINTS_GET_ASSET_PROOF_OF_DEBT: '/services/apexrest/ProofOfDebt', //PC-EVERIS 


  /*  OTROS ENLACES   */
  ENDPOINTS_EXTERNAL_SEARCH_CLIENTID: 'http://www.enel-digital.cl/numero-cliente',

  /* PAGOS */

  // ENDPOINTS_PAYMENT: 'https://prewebpay3g.enel.com/bdp/TraductorPage.aspx',
  ENDPOINTS_PAYMENT: 'https://webpay3g.enel.com/bdp/TraductorPage.aspx',
  ENDPOINTS_PAYMENT_SUCCESS: 'TraductorSalidaPage.aspx?exito=true',
  ENDPOINTS_PAYMENT_ERROR: 'TraductorSalidaPage.aspx?exito=false',

  /*  ANALYTICS  */
  ENDPOINTS_ANALYTICS: 'https://www.google-analytics.com/collect'
});