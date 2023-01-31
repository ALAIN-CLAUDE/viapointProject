public without sharing class cpCardLocationController {
    
    @AuraEnabled(cacheable=true)
    public static List<Location__c> getOrgLocations() {
        String userId= userinfo.getUserId();
        User [] ulist = [SELECT Id, ContactId, DefaultAccount__c,AccountId FROM User WHERE Id =:userId];
        Map<Id,Account> accountMap = new Map<Id,Account>();
        for(User u : ulist) {
            accountMap.put(u.DefaultAccount__c,null);
        }
        Location__c [] locationList = [
            SELECT  Id,
                    Name,
                    LocationType__c,
                    TimeZone__c,
                    Account__c,
                    Account__r.AccountWorkflowStatus__c,
                    CreatedDate,
                    CreatedById,
                    CreatedBy.SmallPhotoUrl, 
                    CreatedBy.Name
            FROM    Location__c 
            WHERE   Account__c 
            IN: accountMap.keySet() 
        ];

        return locationList;
    

}
}