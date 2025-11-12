/**
 * Mapping WSTG test cases ke OWASP WSTG URLs
 * Base URL: https://owasp.org/www-project-web-security-testing-guide/v42/4-Web_Application_Security_Testing/
 * Format URL: base/section-number-section-name/test-number-test-name
 */

const WSTG_BASE_URL = "https://owasp.org/www-project-web-security-testing-guide/v42/4-Web_Application_Security_Testing";

/**
 * Mapping WSTG test case IDs ke URL paths
 * Berdasarkan struktur OWASP WSTG v4.2
 */
const WSTG_MAPPING: Record<string, string> = {
  // 4.1 Information Gathering
  "INFO-01": "01-Information_Gathering/01-Conduct_Search_Engine_Discovery_Reconnaissance_for_Information_Leakage",
  "INFO-02": "01-Information_Gathering/02-Fingerprint_Web_Server",
  "INFO-03": "01-Information_Gathering/03-Review_Webserver_Metafiles_for_Information_Leakage",
  "INFO-04": "01-Information_Gathering/04-Enumerate_Applications_on_Webserver",
  "INFO-05": "01-Information_Gathering/05-Review_Webpage_Content_for_Information_Leakage",
  "INFO-06": "01-Information_Gathering/06-Identify_Application_Entry_Points",
  "INFO-07": "01-Information_Gathering/07-Map_Execution_Paths_Through_Application",
  "INFO-08": "01-Information_Gathering/08-Fingerprint_Web_Application_Framework",
  "INFO-09": "01-Information_Gathering/09-Fingerprint_Web_Application",
  "INFO-10": "01-Information_Gathering/10-Map_Application_Architecture",

  // 4.2 Configuration and Deployment Management Testing
  "CONF-01": "02-Configuration_and_Deployment_Management_Testing/01-Test_Network_Infrastructure_Configuration",
  "CONF-02": "02-Configuration_and_Deployment_Management_Testing/02-Test_Application_Platform_Configuration",
  "CONF-03": "02-Configuration_and_Deployment_Management_Testing/03-Test_File_Extensions_Handling_for_Sensitive_Information",
  "CONF-04": "02-Configuration_and_Deployment_Management_Testing/04-Review_Old_Backup_and_Unreferenced_Files_for_Sensitive_Information",
  "CONF-05": "02-Configuration_and_Deployment_Management_Testing/05-Enumerate_Infrastructure_and_Application_Admin_Interfaces",
  "CONF-06": "02-Configuration_and_Deployment_Management_Testing/06-Test_HTTP_Methods",
  "CONF-07": "02-Configuration_and_Deployment_Management_Testing/07-Test_HTTP_Strict_Transport_Security",
  "CONF-08": "02-Configuration_and_Deployment_Management_Testing/08-Test_RIA_Cross_Domain_Policy",
  "CONF-09": "02-Configuration_and_Deployment_Management_Testing/09-Test_File_Permission",
  "CONF-10": "02-Configuration_and_Deployment_Management_Testing/10-Test_for_Subdomain_Takeover",
  "CONF-11": "02-Configuration_and_Deployment_Management_Testing/11-Test_Cloud_Storage",

  // 4.3 Identity Management Testing
  "IDNT-01": "03-Identity_Management_Testing/01-Test_Role_Definitions",
  "IDNT-02": "03-Identity_Management_Testing/02-Test_User_Registration_Process",
  "IDNT-03": "03-Identity_Management_Testing/03-Test_Account_Provisioning_Process",
  "IDNT-04": "03-Identity_Management_Testing/04-Testing_for_Account_Enumeration_and_Guessable_User_Account",
  "IDNT-05": "03-Identity_Management_Testing/05-Testing_for_Weak_or_Unenforced_Username_Policy",

  // 4.4 Authentication Testing
  "ATHN-01": "04-Authentication_Testing/01-Testing_for_Credentials_Transported_over_an_Encrypted_Channel",
  "ATHN-02": "04-Authentication_Testing/02-Testing_for_Default_Credentials",
  "ATHN-03": "04-Authentication_Testing/03-Testing_for_Weak_Lock_Out_Mechanism",
  "ATHN-04": "04-Authentication_Testing/04-Testing_for_Bypassing_Authentication_Schema",
  "ATHN-05": "04-Authentication_Testing/05-Testing_for_Vulnerable_Remember_Password",
  "ATHN-06": "04-Authentication_Testing/06-Testing_for_Browser_Cache_Weaknesses",
  "ATHN-07": "04-Authentication_Testing/07-Testing_for_Weak_Password_Policy",
  "ATHN-08": "04-Authentication_Testing/08-Testing_for_Weak_Security_Question_Answer",
  "ATHN-09": "04-Authentication_Testing/09-Testing_for_Weak_Password_Change_or_Reset_Functionalities",
  "ATHN-10": "04-Authentication_Testing/10-Testing_for_Weaker_Authentication_in_Alternative_Channel",

  // 4.5 Authorization Testing
  "ATHZ-01": "05-Authorization_Testing/01-Testing_Directory_Traversal_File_Include",
  "ATHZ-02": "05-Authorization_Testing/02-Testing_for_Bypassing_Authorization_Schema",
  "ATHZ-03": "05-Authorization_Testing/03-Testing_for_Privilege_Escalation",
  "ATHZ-04": "05-Authorization_Testing/04-Testing_for_Insecure_Direct_Object_References",

  // 4.6 Session Management Testing
  "SESS-01": "06-Session_Management_Testing/01-Testing_for_Session_Management_Schema",
  "SESS-02": "06-Session_Management_Testing/02-Testing_for_Cookies_Attributes",
  "SESS-03": "06-Session_Management_Testing/03-Testing_for_Session_Fixation",
  "SESS-04": "06-Session_Management_Testing/04-Testing_for_Exposed_Session_Variables",
  "SESS-05": "06-Session_Management_Testing/05-Testing_for_Cross_Site_Request_Forgery",
  "SESS-06": "06-Session_Management_Testing/06-Testing_for_Logout_Functionality",
  "SESS-07": "06-Session_Management_Testing/07-Testing_Session_Timeout",
  "SESS-08": "06-Session_Management_Testing/08-Testing_for_Session_Puzzling",
  "SESS-09": "06-Session_Management_Testing/09-Testing_for_Session_Hijacking",

  // 4.7 Input Validation Testing
  "INPV-01": "07-Input_Validation_Testing/01-Testing_for_Reflected_Cross_Site_Scripting",
  "INPV-02": "07-Input_Validation_Testing/02-Testing_for_Stored_Cross_Site_Scripting",
  "INPV-03": "07-Input_Validation_Testing/03-Testing_for_HTTP_Verb_Tampering",
  "INPV-04": "07-Input_Validation_Testing/04-Testing_for_HTTP_Parameter_Pollution",
  "INPV-05": "07-Input_Validation_Testing/05-Testing_for_SQL_Injection",
  "INPV-06": "07-Input_Validation_Testing/06-Testing_for_LDAP_Injection",
  "INPV-07": "07-Input_Validation_Testing/07-Testing_for_XML_Injection",
  "INPV-08": "07-Input_Validation_Testing/08-Testing_for_SSI_Injection",
  "INPV-09": "07-Input_Validation_Testing/09-Testing_for_XPath_Injection",
  "INPV-10": "07-Input_Validation_Testing/10-Testing_for_IMAP_SMTP_Injection",
  "INPV-11": "07-Input_Validation_Testing/11-Testing_for_Code_Injection",
  "INPV-12": "07-Input_Validation_Testing/12-Testing_for_Command_Injection",
  "INPV-13": "07-Input_Validation_Testing/13-Testing_for_Format_String_Injection",
  "INPV-14": "07-Input_Validation_Testing/14-Testing_for_Incubated_Vulnerability",
  "INPV-15": "07-Input_Validation_Testing/15-Testing_for_HTTP_Splitting_Smuggling",
  "INPV-16": "07-Input_Validation_Testing/16-Testing_for_HTTP_Incoming_Requests",
  "INPV-17": "07-Input_Validation_Testing/17-Testing_for_Host_Header_Injection",
  "INPV-18": "07-Input_Validation_Testing/18-Testing_for_Server-side_Template_Injection",
  "INPV-19": "07-Input_Validation_Testing/19-Testing_for_Server-Side_Request_Forgery",

  // 4.8 Testing for Error Handling
  "ERRH-01": "08-Testing_for_Error_Handling/01-Testing_for_Improper_Error_Handling",
  "ERRH-02": "08-Testing_for_Error_Handling/02-Testing_for_Stack_Traces",

  // 4.9 Testing for Weak Cryptography
  "CRYP-01": "09-Testing_for_Weak_Cryptography/01-Testing_for_Weak_Transport_Layer_Security",
  "CRYP-02": "09-Testing_for_Weak_Cryptography/02-Testing_for_Padding_Oracle",
  "CRYP-03": "09-Testing_for_Weak_Cryptography/03-Testing_for_Sensitive_Information_Sent_via_Unencrypted_Channels",
  "CRYP-04": "09-Testing_for_Weak_Cryptography/04-Testing_for_Weak_Encryption",

  // 4.10 Business Logic Testing
  "BUSL-01": "10-Business_Logic_Testing/01-Test_Business_Logic_Data_Validation",
  "BUSL-02": "10-Business_Logic_Testing/02-Test_Ability_to_Forge_Requests",
  "BUSL-03": "10-Business_Logic_Testing/03-Test_Integrity_Checks",
  "BUSL-04": "10-Business_Logic_Testing/04-Test_for_Process_Timing",
  "BUSL-05": "10-Business_Logic_Testing/05-Test_Number_of_Times_a_Function_Can_Be_Used_Limits",
  "BUSL-06": "10-Business_Logic_Testing/06-Testing_for_the_Circumvention_of_Work_Flows",
  "BUSL-07": "10-Business_Logic_Testing/07-Test_Defenses_Against_Application_Misuse",
  "BUSL-08": "10-Business_Logic_Testing/08-Test_Upload_of_Unexpected_File_Types",
  "BUSL-09": "10-Business_Logic_Testing/09-Test_Upload_of_Malicious_Files",

  // 4.11 Client-side Testing
  "CLNT-01": "11-Client-side_Testing/01-Testing_for_DOM-Based_Cross_Site_Scripting",
  "CLNT-02": "11-Client-side_Testing/02-Testing_for_JavaScript_Execution",
  "CLNT-03": "11-Client-side_Testing/03-Testing_for_HTML_Injection",
  "CLNT-04": "11-Client-side_Testing/04-Testing_for_Client-side_URL_Redirect",
  "CLNT-05": "11-Client-side_Testing/05-Testing_for_CSS_Injection",
  "CLNT-06": "11-Client-side_Testing/06-Testing_for_Client-side_Resource_Manipulation",
  "CLNT-07": "11-Client-side_Testing/07-Testing_Cross_Origin_Resource_Sharing",
  "CLNT-08": "11-Client-side_Testing/08-Testing_for_Cross_Site_Flashing",
  "CLNT-09": "11-Client-side_Testing/09-Testing_for_Clickjacking",
  "CLNT-10": "11-Client-side_Testing/10-Testing_WebSockets",
  "CLNT-11": "11-Client-side_Testing/11-Testing_Web_Messaging",
  "CLNT-12": "11-Client-side_Testing/12-Testing_Browser_Storage",
  "CLNT-13": "11-Client-side_Testing/13-Testing_for_Cross_Site_Script_Inclusion",

  // 4.12 API Testing
  "APIT-01": "12-API_Testing/01-Testing_GraphQL",
};

/**
 * Parse MSTG/WSTG string dan extract test case IDs
 * Format: "BUSL-01, CLNT-06" atau "CONF-07"
 */
export function parseMSTGWSTG(mstgWstg: string): Array<{ id: string; url: string }> {
  if (!mstgWstg || !mstgWstg.trim()) return [];

  // Split by comma and clean
  const ids = mstgWstg
    .split(",")
    .map(id => id.trim())
    .filter(id => id.length > 0);

  return ids.map(id => {
    const urlPath = WSTG_MAPPING[id.toUpperCase()];
    const url = urlPath 
      ? `${WSTG_BASE_URL}/${urlPath}`
      : `${WSTG_BASE_URL}`; // Fallback to base URL if not found
    
    return { id, url };
  });
}

/**
 * Get URL untuk WSTG test case ID
 */
export function getWSTGUrl(testCaseId: string): string {
  const normalizedId = testCaseId.trim().toUpperCase();
  const urlPath = WSTG_MAPPING[normalizedId];
  
  if (urlPath) {
    return `${WSTG_BASE_URL}/${urlPath}`;
  }
  
  // Fallback to base URL
  return WSTG_BASE_URL;
}

