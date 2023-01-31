public without sharing class cpGetAuditActivityResourceList {
    @AuraEnabled(cacheable=true)
    public static list<AuditActivityResource__c>  getOrgAudActivityResource() {
        String userId= userinfo.getUserId();
        user [] ulist = [SELECT Id, DefaultAccount__c,ContactId FROM User where ID =:userId];
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


 AuditActivityResource__c [] audActRes = [SELECT Id,Name,Audit__r.AuditTitle__c,AuditResource__r.AuditResourceTitle__c, AuditActivityTitle__c,AuditActivity__r.AuditActivityTitle__c, ResourceTitle__c, AuditTitle__c, ActivityResourceWorkflowStatus__c FROM AuditActivityResource__c where Audit__c in :AuditMap1.keySet()];   
 
system.debug('audActRes'+ audActRes);
return audActRes;
    }
}