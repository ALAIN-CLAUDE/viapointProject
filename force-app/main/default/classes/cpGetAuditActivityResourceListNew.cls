public with sharing class cpGetAuditActivityResourceListNew {

    @AuraEnabled(cacheable=true)
    public static List<AuditActivityResourceWrapper>  getOrgAudActivityResource() {
        List<AuditActivityResourceWrapper> result = new List<AuditActivityResourceWrapper>();
        User [] ulist = [SELECT Id, DefaultAccount__c, ContactId FROM User WHERE Id =:userinfo.getUserId()];
            
        Set<Id> accountSet = new Set<Id>();
        
        for (User u : ulist) {        
            accountSet.add(u.DefaultAccount__c);
        }

        Map<Id, Account> accountMap = new Map<Id, Account>();

        for (Account account : [SELECT Id, Organization__c FROM Account WHERE Id = :accountSet]) {
            accountMap.put(account.Organization__c, account);
        }
        
        Map<Id, Audit__c> auditMap = new Map<Id, Audit__c>();
        for(Audit__c audit : [SELECT Id, Name FROM Audit__c WHERE Organization__c IN :accountMap.keySet() ]) {
            auditMap.put(audit.Id, audit);
        }
        
        AuditActivityResource__c [] audActRes = [
            SELECT  Id, 
                    Name,
                    Audit__r.AuditTitle__c,
                    AuditResource__r.AuditResourceTitle__c, 
                    AuditActivityTitle__c,
                    AuditActivity__r.AuditActivityTitle__c, 
                    ResourceTitle__c,
                    RequestAllocationFte__c,
                    ActivityPlannedFinish__c, 
                    ActivityPlannedStart__c,
                    AuditTitle__c, 
                    ActivityResourceWorkflowStatus__c 
            FROM    AuditActivityResource__c 
            WHERE   Audit__c IN :auditMap.keySet()
        ];
        for (AuditActivityResource__c auditResource : audActRes) {
            result.add(populateAuditActivityRecord(auditResource));
        }
        return result;
    }

    @AuraEnabled
    public static AuditActivityResourceWrapper populateAuditActivityRecord(
        AuditActivityResource__c auditResource
    ) {
        AuditActivityResourceWrapper auditActivityRecord = new AuditActivityResourceWrapper();
        auditActivityRecord.recordId = auditResource.Id;
        auditActivityRecord.name = auditResource.Name;
        auditActivityRecord.auditResourseTitleId = auditResource.AuditResource__r.AuditResourceTitle__c;
        auditActivityRecord.auditActivityTitle = auditResource.AuditActivity__r.AuditActivityTitle__c;
        auditActivityRecord.resourceTitle = auditResource.ResourceTitle__c;
        auditActivityRecord.auditTitle = auditResource.AuditTitle__c;
        auditActivityRecord.requestAllocationFte = (auditResource.RequestAllocationFte__c != null) ? auditResource.RequestAllocationFte__c +'%' : '%';
        auditActivityRecord.status = auditResource.ActivityResourceWorkflowStatus__c;
        auditActivityRecord.start =  String.valueOfGmt(auditResource.ActivityPlannedStart__c);
        auditActivityRecord.finish =  String.valueOfGmt(auditResource.ActivityPlannedFinish__c);
        auditActivityRecord.unitClass = auditResource.ActivityResourceWorkflowStatus__c.toLowercase() + ' card-box';
        return auditActivityRecord;
    }

    public class AuditActivityResourceWrapper {
        @AuraEnabled
        public Id recordId;
        @AuraEnabled
        public String name;
        @AuraEnabled
        public String auditResourseTitleId;
        @AuraEnabled
        public String auditActivityTitle;
        @AuraEnabled
        public String resourceTitle;
        @AuraEnabled
        public String auditTitle;
        @AuraEnabled
        public String requestAllocationFte;
        @AuraEnabled
        public String status;
        @AuraEnabled
        public String start;
        @AuraEnabled
        public String finish;
        @AuraEnabled
        public String startdate;
        @AuraEnabled
        public String finishdate;
        @AuraEnabled
        public String unitClass;
    }
}