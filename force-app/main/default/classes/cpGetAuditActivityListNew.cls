public class cpGetAuditActivityListNew {
    @AuraEnabled(cacheable=true)
    public static list<AuditActivity__c> getAllAuditActivities() {
        User [] ulist = [
            SELECT Id, AccountId, DefaultAccount__c, ContactId 
        FROM User where ID = :userinfo.getUserId()];
        Map<Id, Account> accountMap = new Map<Id, Account>();
    
        for(User u : ulist){
        
            accountMap.put(u.DefaultAccount__c,null);
        }
        Map<Id, Account>  accountMap2 = new Map<Id, Account> ();
        for(Account a : [SELECT Id, Organization__c FROM Account WHERE Id =: accountMap.keySet() ]){
             accountMap2.put(a.Organization__c,a);
            
        }
        
        Map<Id, Audit__c>  auditMap1 = new Map<Id, Audit__c> ();
        for(Audit__c adt : [SELECT Id, Name FROM Audit__c WHERE Organization__c IN : accountMap2.keySet() ]){
            auditMap1.put(adt.Id, adt);
        }
        
      AuditActivity__c [] adAct = [
        SELECT  Id, 
                Name, 
                Audit__c,
                UserLocale__c,
                UserTimeZone__c,
                AuditActivityType__c,
                AuditNumber__c,
                AssignedTo__c,
                AssignedTo__r.SmallPhotoUrl,
                AssignedTo__r.FirstName,   
                AssignedTo__r.LastName,
                AuditActivityWorkflowStatus__c,  
                AuditActivityTitle__c, 
                PlannedStart__c, 
                PlannedFinish__c 
        FROM    AuditActivity__c 
        WHERE   Audit__c IN :auditMap1.keySet()
        ];
        return adAct;      
    }
    

    @AuraEnabled(cacheable=true)    
    public static List<User> getUserDetails() {
        String userId= userinfo.getUserId();
        user [] ulist = [SELECT Id, AccountId,DefaultAccount__c,ContactId FROM User where ID =:userId];
        system.debug(ulist);
    
        map<id,Account> accountMap = new map<id,Account>();
    
        for(User u : ulist){
        
            accountMap.put(u.DefaultAccount__c,null);
        }
        map<id,Account> accountMap2 = new map<id,Account>();
        for(Account a : [SELECT Id,Organization__c FROM Account where id =: accountMap.keySet() ]){
             accountMap2.put(a.Organization__c,a);
            
        }
        system.debug('Mapped2==> '+ accountMap2);
        
        map<id,Audit__c> AuditMap1 = new map<id,Audit__c>();
        for(Audit__c adt : [select id,name  from Audit__c where Organization__c in : accountMap2.keySet() ]){
            AuditMap1.put(adt.id,adt);
        }
    
        set<id> storeAssignedToId = new set<id>();
        for(AuditActivity__c aa : [SELECT Id, AssignedTo__c FROM AuditActivity__c where Audit__c  in : AuditMap1.keySet()] ){
            storeAssignedToId.add(aa.AssignedTo__c);
        
        }
    
        return [Select id,Name,SmallPhotoUrl, FullPhotoUrl From User where Id in:storeAssignedToId];
    }
}