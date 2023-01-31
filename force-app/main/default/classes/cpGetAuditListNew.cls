public with sharing class cpGetAuditListNew {

    @AuraEnabled(cacheable=true)
    public static list<Audit__c> getOrgAudits() {       
        User [] userlist = [
            SELECT  Id,
                    DefaultAccount__c,
                    Contact.AccountId,
                    Contact.Account.DefaultAccount__c,
                    Contact.Id,
                    Contact.Account.Name
            FROM    User 
            WHERE   Id = :userinfo.getUserId() 
        ];

        Map<Id, Contact> contactMap = new Map<Id, Contact>();
        Map<Id, Account> accountMap = new Map<Id, Account>();

        for(User u : userlist){
            contactMap.put(u.Contact.Id, null);
            accountMap.put(u.DefaultAccount__c, null);
            system.debug('the accountId==> '+ u.DefaultAccount__c);
        }

        Map<Id, Account> accountMap2 = new Map<Id, Account>();
        for (Account a : [SELECT Id,Organization__c FROM Account WHERE Id IN: accountMap.keySet()]) {
            accountMap2.put(a.Organization__c,a);
        }

        system.debug('Mapped2==> '+ accountMap2);

        Audit__c [] auditList = [
            SELECT  Id,
                    Name,
                    Organization__r.Name,
                    Organization__r.Id,
                    AuditTitle__c,
                    LeadAuditorInternal__c, 
                    LeadAuditorInternal__r.SmallPhotoUrl,
                    LeadAuditorInternalName__c,
                    AuditDepartment__c,
                    AuditDepartment__r.Name,
                    AuditWorkflowStatus__c,
                    PlannedStart__c 
            FROM    Audit__c 
            WHERE   Organization__c IN : accountMap2.keySet()
        ];
        return auditList;

    }


    @AuraEnabled(cacheable=true)    
    public static List<User> getUserDetails() {
        User [] userlist = [
            SELECT  Id,
                    DefaultAccount__c,
                    Contact.AccountId,
                    Contact.Account.DefaultAccount__c,
                    Contact.Id,
                    Contact.Account.Name
            FROM    User 
            WHERE   Id = :userinfo.getUserId() 
        ];

        Map<Id, Contact> contactMap = new Map<Id, Contact>();
        Map<Id, Account> accountMap = new Map<Id, Account>();

        for(User u : userlist){
            contactMap.put(u.Contact.Id, null);
            accountMap.put(u.DefaultAccount__c, null);
            system.debug('the accountId==> '+ u.DefaultAccount__c);
        }

        Map<Id, Account> accountMap2 = new Map<Id, Account>();
        for (Account a : [SELECT Id,Organization__c FROM Account WHERE Id IN: accountMap.keySet()]) {
            accountMap2.put(a.Organization__c,a);
        }

        system.debug('Mapped2==> '+ accountMap2);

        Audit__c [] auditList = [
            SELECT  Id,
                    Name,
                    Organization__r.Name,
                    Organization__r.Id,
                    AuditTitle__c,
                    LeadAuditorInternal__c, 
                    LeadAuditorInternal__r.SmallPhotoUrl,
                    LeadAuditorInternalName__c,
                    AuditDepartment__c,
                    AuditDepartment__r.Name,
                    AuditWorkflowStatus__c,
                    PlannedStart__c 
            FROM    Audit__c 
            WHERE   Organization__c IN : accountMap2.keySet()
        ];

        set<id> storeLeadId = new set<id>();
        for(Audit__c aa : auditList){
        storeLeadId.add(aa.LeadAuditorInternal__c);

        }

        return [Select id,Name,SmallPhotoUrl, FullPhotoUrl From User where Id in:storeLeadId];

        }

}