public with sharing class cpAuditRelatedProducts {
    @AuraEnabled(cacheable=true)
    public static list<AuditProduct__c> getAuditRelatedProducts(String recordId) {
        return [
            SELECT  Id, 
                    Audit__c, 
                    Product__c, 
                    ProductFamily__c, 
                    ProductCode__c, 
                    ProductDescription__c,
                    ProductName__c 
            FROM    AuditProduct__c 
            WHERE   Audit__c = :recordId
        ];
 
    }

    @AuraEnabled(cacheable=true)
    public static list<AuditRule__c> getAuditRelatedRules(String recordId) {
        return [
            SELECT  Id, 
                    Rule__c, 
                    Audit__c, 
                    RuleTitle__c, 
                    RuleSet__c, 
                    RuleWorkflowStatus__c, 
                    RuleNumber__c, 
                    AuditNumber__c, 
                    AuditTitle__c 
            FROM    AuditRule__c  
            WHERE   Audit__c = :recordId
        ];
    }
   
    @AuraEnabled(cacheable=true)
    public static list<RiskAssessment__c> getAuditRelatedRisks(String recordId) {
        return [
            SELECT  Id, 
                    Location__c, 
                    RiskAssessmentTitle__c, 
                    AssignedTo__c, 
                    AssignedTo__r.Name,
                    AssignedTo__r.SmallPhotoUrl,
                    PerformanceHistory__c, 
                    RiskAssessmentWorkflowStatus__c, 
                    OverallRisk__c, 
                    OverallRiskDescription__c, 
                    Audit__c, 
                    Name 
            FROM    RiskAssessment__c  
            WHERE   Audit__c = :recordId
        ];
    }

    @AuraEnabled(cacheable=true)
    public static List<PreAuditQuestionnaire__c> getAuditRelatedPreAudit(String recordId) {
        return [
            SELECT  Id, 
                    Name, 
                    PreAuditQuestionnaireTitle__c, 
                    PreAuditQuestionnaireWorkflow_Status__c, 
                    Location__c,
                    Location__r.Name, 
                    AssignedTo__c,
                    AssignedTo__r.Name,
                    AssignedTo__r.SmallPhotoUrl, 
                    EffectiveStart__c, 
                    Audit__c 
            FROM    PreAuditQuestionnaire__c  
            WHERE   Audit__c = :recordId
        ];
    }

    @AuraEnabled(cacheable=true)
    public static List<AuditActivity__c> getRelatedAuditActivities(String recordId) {
        return [
            SELECT  Id,
                    Name,
                    AuditActivityType__c,
                    AssignedTo__c,                    
                    AssignedTo__r.Name,
                    AssignedTo__r.SmallPhotoUrl,
                    PlannedStart__c
            FROM    AuditActivity__c
            WHERE   Audit__c = :recordId
        ];
    }

    @AuraEnabled(cacheable=true)
    public static List<AuditResource__c> getRelatedAuditResources(String recordId) {
        return [
            SELECT  Id, 
                    ResourceTitleLinkless__c,
                    AuditResourceTitle2__c,
                    AuditTitle__c,
                    ResourceType__c,
                    ResourceTitle__c,
                    ResourceWorkflowStatus__c,
                    Generic__c,
                    Active__c, 
                    Audit__c,
                    Resource__c
            FROM    AuditResource__c
            WHERE   Audit__c = :recordId
        ];
    }
    
    @AuraEnabled(cacheable=true)
    public static List<AuditActivityResource__c> getRelatedAuditActivityResources(String recordId) {
        return [
            SELECT  Id, 
                    Name, 
                    Audit__c, 
                    AuditTitleLinkless__c,
                    ResourceTitle__c, 
                    ResourceType__c, 
                    AuditNumber__c, 
                    ActivityResourceWorkflowStatus__c 
            FROM    AuditActivityResource__c
            WHERE   Audit__c = :recordId
        ];
    }
        
    @AuraEnabled(cacheable=true)
    public static List<AuditActivityResource__c> getRelatedAAResources(String recordId) {
        return [
            SELECT  Id, 
                    Name, 
                    Audit__c, 
                    AuditTitleLinkless__c,
                    ResourceTitle__c, 
                    ResourceType__c, 
                    AuditNumber__c, 
                    ActivityResourceWorkflowStatus__c 
            FROM    AuditActivityResource__c
            WHERE   AuditActivity__c = :recordId
        ];
    }
    
    @AuraEnabled(cacheable=true)
    public static List<AuditFinding__c> getRelatedAuditFindings(String recordId) {
        return [
            SELECT  Id, 
                    Audit__c, 
                    Priority__c, 
                    AssignedTo__c,
                    Finding__c, 
                    CapaRequired__c, 
                    AuditFindingWorkflowStatus__c,
                    Name, 
                    AuditFindingType__c 
            FROM    AuditFinding__c
            WHERE   Audit__c = :recordId
        ];
    }

    @AuraEnabled(cacheable=true)
    public static List<Capa__c> getRelatedCapas(String recordId) {
        return [
            SELECT  Id, 
                    CapaWorkflowStatus__c,
                    CapaType__c,
                    Capa__c,
                    CapaTitle__c,
                    AuditFindingNumber__c,
                    Name 
            FROM    Capa__c 
            WHERE   AuditFindingNumber__c = :recordId
        ];
    }

    @AuraEnabled(cacheable=true)
    public static List<ContentDocument> getRelatedAuditFiles(String recordId) {
        ContentDocumentLink cdl =[SELECT Id, LinkedEntityId, ContentDocumentId, Visibility FROM ContentDocumentLink where LinkedEntityId =:recordId];
        if (cdl !=null) {
            return [
                SELECT  Id,
                        Title, 
                        FileType,
                        ParentId,
                        ContentSize,
                        CreatedDate
                FROM    ContentDocument 
                WHERE   Id =:cdl.ContentDocumentId
            ];
        } else {
            return null;
        }
       
    }

}