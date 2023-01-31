public without sharing class cpGetCaseList {
    @AuraEnabled(cacheable=true)
    public static list<Case>  getAllMyCases() {
	String userId= userinfo.getUserId();
        user [] ulist = [SELECT Id, AccountId,DefaultAccount__c,ContactId FROM User where ID =:userId ];
        system.debug(ulist);    
        map<id,Account> accountMap = new map<id,Account>();
    
        for(User u : ulist){
        
            accountMap.put(u.DefaultAccount__c,null);
        }
 

        Case [] caList = [SELECT Id, CaseNumber, Subject, Status, AccountId, ContactId, CreatedDate FROM Case where AccountId in: accountMap.keySet()];
        if(!caList.isEmpty()){
            return caList;
        }else{
            return null;  
        }
        
    }


    /*creating Case*/
  
 @AuraEnabled//(cacheable=true)
 public static case createCase(string theDescription, string theSubject, string theAccountId){
    case caseObj = new case();

    caseObj.Description = theDescription;
    caseObj.Subject = theSubject;
    caseObj.AccountId = theAccountId;
     

     insert caseObj;
     caseObj = [Select Id, CaseNumber from case where Id=:caseObj.Id];
     return caseObj;
 }
}