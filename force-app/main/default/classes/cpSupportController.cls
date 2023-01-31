public without sharing class cpSupportController {
    @AuraEnabled(cacheable=true)
    public static List<Case> getAllMyCases() {	
        User [] ulist = [SELECT Id, AccountId, DefaultAccount__c,ContactId FROM User WHERE Id = :userinfo.getUserId() ];
        system.debug(ulist);    
        Map<id,Account> accountMap = new Map<Id,Account>();    
        for(User u : ulist){        
            accountMap.put(u.DefaultAccount__c,null);
        }
        Case [] caList = [
            SELECT  Id, 
                    CaseNumber, 
                    Subject, 
                    Status, 
                    Type,  
                    AccountId, 
                    ContactId, 
                    OwnerId, 
                    Owner.Name, 
                    CreatedBy.Name, 
                    CreatedBy.Id, 
                    CreatedBy.SmallPhotoUrl,
                    CreatedDate 
            FROM    Case 
            WHERE   AccountId IN: accountMap.keySet()
        ];
        return caList;
    }

    @AuraEnabled(cacheable=true)
    public static User getUserDetailsById(Id ownerUserId){
        User valueToreturn = [SELECT Id,Name,SmallPhotoUrl, FullPhotoUrl FROM User WHERE Id = :ownerUserId];
        return valueToreturn;
    }
    @AuraEnabled(cacheable=true)   
    public static List<User> getUserDetails() {
        User [] ulist = [
            SELECT Id, 
            AccountId, 
            DefaultAccount__c,
            ContactId 
            FROM User 
            WHERE Id = :userinfo.getUserId()
        ];
        system.debug(ulist);    
        Map<id,Account> accountMap = new Map<Id,Account>();       
        for(User u : ulist){                 
            accountMap.put(u.DefaultAccount__c,null);
        }
       Set<id> accountMap2 = new Set<Id>();
       set<id> storeOwnerSet = new set<id>();
        for(Account a : [SELECT Id,Organization__c FROM Account where id in: accountMap.keySet()  ]){
            storeOwnerSet.add(a.Organization__c);

        }
        Case [] caList = [
            SELECT  Id, 
                    CaseNumber, 
                    Subject, 
                    Status, 
                    Type,  
                    AccountId, 
                    ContactId, 
                    OwnerId, 
                    Owner.Name, 
                    CreatedBy.Name, 
                    CreatedBy.Id, 
                    CreatedBy.SmallPhotoUrl,
                    CreatedDate 
            FROM    Case 
            WHERE   AccountId IN: accountMap.keySet()
        ];
 
      Set<String> nameOwnerSet = new Set<String>();
    for(Case ownerCase : caList){
        storeOwnerSet.add(ownerCase.OwnerId);
        nameOwnerSet.add(ownerCase.Owner.Name);
    }
    storeOwnerSet.add(userinfo.getUserId());
    return [Select Id,Name, SmallPhotoUrl, isActive, FullPhotoUrl 
    From User where Id in:storeOwnerSet];
              
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