public without sharing class CpGetAuditFindingList {
    @AuraEnabled(cacheable=true)
    public static list<AuditFinding__c>  getOrgAuditFindings() {
        String userId= userinfo.getUserId();
        user [] ulist = [SELECT Id, AccountId,DefaultAccount__c,ContactId FROM User where ID =:userId ];
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
        map<id,AuditFinding__c> AuditFindMap1 = new map<id,AuditFinding__c>();    
        
        AuditFinding__c [] audFindList = [
            SELECT  Id, 
                    Name,
                    Priority__c,
                    AuditFindingTitle__c, 
                    AuditTitleLinkLess__c, 
                    Finding__c, 
                    AuditFindingWorkflowStatus__c, 
                    AuditFindingType__c,
                    AssignedTo__c,
                    AssignedTo__r.SmallPhotoUrl,
                    AssignedTo__r.FirstName, 
                    AssignedTo__r.LastName, 
                    CapaRequired__c  
            FROM    AuditFinding__c  
            WHERE   Audit__c  in : AuditMap1.keySet()
        ];
        return audFindList;
    }

    @AuraEnabled(cacheable=true)    
    public static List<User> getUserDetails() {
        User [] ulist = [
            SELECT  Id, 
                    AccountId,
                    DefaultAccount__c,
                    ContactId 
            FROM    User 
            WHERE   Id = :userinfo.getUserId()
        ];  

        map<id,Account> accountMap = new map<id,Account>();

        for(User u : ulist) {        
            accountMap.put(u.DefaultAccount__c,null);
        }
        map<id,Account> accountMap2 = new map<id,Account>();
        for (Account a : [SELECT Id, Organization__c FROM Account WHERE Id =: accountMap.keySet()]){
            accountMap2.put(a.Organization__c,a);            
        }        
        map<id,Audit__c> AuditMap1 = new map<id,Audit__c>();
        for(Audit__c adt : [select id,name  from Audit__c where Organization__c in : accountMap2.keySet() ]){
            AuditMap1.put(adt.id,adt);
        }
        set<id> storeAssignedToId = new set<id>();
        for(AuditFinding__c aa : [SELECT Id, AssignedTo__c FROM AuditFinding__c WHERE Audit__c IN : AuditMap1.keySet()] ){
            storeAssignedToId.add(aa.AssignedTo__c);        
        }
        return [SELECT Id, Name, SmallPhotoUrl FROM User WHERE Id IN :storeAssignedToId];  
    }
}