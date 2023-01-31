public with sharing class testApexClass {
   /*
    @AuraEnabled(cacheable=true)
    Public static map<String,object> getAccountDetails(){
        Map<String,object> resp = new Map<String,object>();
        List<Account> accountList = [SELECT Id, BillingStreet, BillingCity,Organization__r.Name, BillingState, BillingPostalCode, BillingCountry, Name, BillingAddress, ShippingStreet, ShippingCity, ShippingState, ShippingPostalCode, ShippingCountry, ShippingAddress, Phone, Organization__c, Website FROM Account ];
        
        return accountList;
        
    }
*/
    @AuraEnabled
    Public static list<account> getAccountRelDetails(){
       // id userId = UserInfo.getUserId();
        User [] ulist = [select id, contactId,Contact.AccountId,Contact.Account.Organization__c,DefaultAccount__c from User];// where id = : userId
        
    
       
        Map<id,user> mapUser=new Map<id,user>();
  
        for(User u : ulist){
    mapUser.put(u.ContactId,null);
   
}

system.debug('contact id==> '+mapUser );
//Map<id,AccountContactRelation> mapAccRel=new Map<id,AccountContactRelation>();
        
//AccountContactRelation [] acrel = [SELECT Id,AccountId, Account.Name,Account.Organization__c,Account.Organization__r.Name, Contact.Name FROM AccountContactRelation where ContactId in: mapUser.keySet() ];
        
Map<id,Account> mapAcc =new Map<id,Account>();
        
for(AccountContactRelation acrel :[SELECT Id,AccountId, Account.Name,Account.Organization__c,Account.Organization__r.Name, Contact.Name FROM AccountContactRelation where ContactId in: mapUser.keySet() ]) {
               mapAcc.put(acrel.AccountId, null); 
        }

        
List<Account> accountList = [SELECT Id, BillingStreet, BillingCity,Organization__r.Name, BillingState, BillingPostalCode, BillingCountry, Name, BillingAddress, ShippingStreet, ShippingCity, ShippingState, ShippingPostalCode, ShippingCountry, ShippingAddress, Phone, Organization__c, Website FROM Account where id in: mapAcc.keySet() ];
              
return accountList;
    
}
}