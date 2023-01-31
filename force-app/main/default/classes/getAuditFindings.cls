public with sharing class getAuditFindings {
    @AuraEnabled(cacheable=true)
    public static list<AuditFinding__c>  getOrgAuditFindings() {
        user [] ulist = [SELECT Id, AccountId,ContactId FROM User WHERE Id = :UserInfo.getUSerId() And ContactId != null];
        system.debug(ulist);
    
        map<id,Account> accountMap = new map<id,Account>();
    
        for(User u : ulist){
        
            accountMap.put(u.AccountId,null);
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
        
       AuditFinding__c  [] audFind = [SELECT Id, Name,AuditFindingTitle__c, AuditTitleLinkLess__c, Finding__c, AuditFindingWorkflowStatus__c, AuditFindingType__c, CapaRequired__c FROM AuditFinding__c  where Audit__c  in : AuditMap1.keySet()];   
        system.debug('audRes==> '+audFind);
        return audFind;


    }
}