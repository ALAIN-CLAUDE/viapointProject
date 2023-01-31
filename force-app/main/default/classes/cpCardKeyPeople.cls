public without sharing class cpCardKeyPeople {
    @AuraEnabled(cacheable=true)
    public static List<User> getOrgsPeople() {
        User [] ulist = [SELECT Id, AccountId, DefaultAccount__c,ContactId FROM User WHERE Id =:userinfo.getUserId()];
        Map<Id, Account> accountMap = new Map<Id, Account>();
        for(User u : ulist){
            accountMap.put(u.DefaultAccount__c,null);
        }
        
        Map<Id, Contact> contactMap = new Map<Id, Contact>();
        AccountContactRelation [] accRelList = [SELECT Id, AccountId, ContactId FROM AccountContactRelation WHERE AccountId IN:accountMap.keySet() ];
        for(AccountContactRelation accRel : accRelList){
            contactMap.put(accRel.ContactId, null);
        }
        
        Contact [] contactList= [SELECT Id, LastName, FirstName, Title, Email FROM Contact WHERE Id IN: contactMap.keySet()];
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
            WHERE   ContactId IN :contactMap.keySet()
        ];
        return userList;
    }
}