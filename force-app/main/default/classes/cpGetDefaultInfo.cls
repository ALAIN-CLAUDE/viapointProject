public without sharing class cpGetDefaultInfo {
    
    @AuraEnabled(cacheable=true)
    public static List<account> getLocationAccounts(){
        
        id userId = UserInfo.getUserId();
        User [] ulist = [select id,Profile.Name, contactId,Contact.AccountId,Contact.Account.Organization__c,DefaultAccount__c from User where id = : userId];
        
        map<id,account> mapAccId = new map<id,account>(); 
        set<id> contactIdSet = new set<id>();  
        for(User u :ulist ) {
            mapAccId.put(u.DefaultAccount__c, null); 
            contactIdSet.add(u.contactId);
        }
        
        Account [] accountList = [select id,name,(SELECT Id, Name FROM Contacts where id in: contactIdSet)  from account where id in: mapAccId.keySet()];
        
        return accountList;
        
    }


    @AuraEnabled(cacheable=true)
    public static List<accountcontactrelation> getAccountContact(){
        
        id userId = UserInfo.getUserId();
        User [] ulist = [select id,Profile.Name, contactId,Contact.AccountId,Contact.Account.Organization__c,DefaultAccount__c from User where id = : userId];
        
        map<id,account> mapAccId = new map<id,account>(); 
        set<id> contactIdSet = new set<id>();  
        for(User u :ulist ) {
            mapAccId.put(u.DefaultAccount__c, null); 
            contactIdSet.add(u.contactId);
        }
        
        accountcontactrelation [] accountConRelList = [SELECT id, AccountId, ContactId FROM accountcontactrelation where AccountId in: mapAccId.keySet() and ContactId in: contactIdSet];
        
        return accountConRelList;
        
    }
}