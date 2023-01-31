public with sharing class GlobalSearchController {

    @AuraEnabled(Cacheable=true)
    public static Object[] getAuditNameRecord(String recordId) {
        return [SELECT Id, Name FROM Audit__c WHERE Id=:recordId];
    }

    @AuraEnabled(Cacheable=true)
    public static Object[] getActivityResourceNameRecord(String recordId) {
        return [SELECT Id, Name FROM AuditActivityResource__c WHERE Id=:recordId];
    }

    @AuraEnabled(Cacheable=true)
    public static Object[] getNameFromObject(String recordId, String objectApiName) {
        return Database.query('SELECT Id, Name FROM ' + objectApiName + ' WHERE Id =:recordId');
    }

    @AuraEnabled(Cacheable=true)
    public static Object[] searchInObject(String searchString, String objectApiName) {

        String whereClause = 'WHERE Name LIKE \'%' + searchString + '%\'';
        String networkId = System.Network.getNetworkId();
        return Database.query('SELECT Id, Name FROM ' + objectApiName + ' ' + whereClause + ' ORDER BY Name');
    }

    @AuraEnabled(Cacheable=true)
    public static List<User>  searchContacts() {
        User [] ulist = [SELECT Id, AccountId, DefaultAccount__c,ContactId FROM User WHERE Id =:userinfo.getUserId()];
        Set<Id> accountSet = new Set<Id>();
        for(User u : ulist){
            accountSet.add(u.DefaultAccount__c);
        }
        
        Set<Id> contactSet = new  Set<Id>();
        AccountContactRelation [] accRelList = [
            SELECT Id, AccountId, ContactId 
            FROM AccountContactRelation 
            WHERE AccountId IN:accountSet
            ];
        for(AccountContactRelation accRel : accRelList){
            contactSet.add(accRel.ContactId);
        }
        
        Contact [] contactList= [SELECT Id, LastName, FirstName, Title, Email FROM Contact WHERE Id IN: contactSet];
        User [] userList = [
            SELECT  Id, 
                    SmallPhotoUrl, 
                    Title, 
                    ManagerId, 
                    Manager.Name, 
                    Manager.SmallPhotoUrl, 
                    isActive, 
                    email, 
                    Name, 
                    Phone,
                    ContactId, 
                    Contact.Phone,
                    Contact.Email,
                    Contact.Name
            FROM    User 
            WHERE   ContactId IN :contactSet
        ];
        return userList;
/*
        String whereClause = 'WHERE Name LIKE \'%' + searchString + '%\'';
        String networkId = System.Network.getNetworkId();
        return Database.query('SELECT Id, Name FROM  Contact ' + whereClause + ' ORDER BY Name');
    */
    }
}