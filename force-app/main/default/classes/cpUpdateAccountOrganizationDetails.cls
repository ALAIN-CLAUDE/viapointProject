public without sharing class cpUpdateAccountOrganizationDetails {
    @AuraEnabled 
    Public static User updateAccount( String orgId){
        User u = new User();
        u.Id= UserInfo.getUserId();
        u.DefaultAccount__c = orgId;
        update u;
        return u;
    }
    @AuraEnabled
    Public static map<String,object> getAccountDetails(map<String,object> resp){
        id userId = UserInfo.getUserId();
        User u = [select id,Profile.Name, contactId,Contact.AccountId,Contact.Account.Organization__c,DefaultAccount__c from User where id = : userId];
        
        if(String.isNotBlank(u.DefaultAccount__c))
        {
            resp.put('accounts', [SELECT Id, BillingStreet, BillingCity,Organization__r.Name, BillingState, BillingPostalCode, BillingCountry, Name, BillingAddress, ShippingStreet, ShippingCity, ShippingState, ShippingPostalCode, ShippingCountry, ShippingAddress, Phone, Organization__c, Website
                                  FROM Account Where Id=:u.DefaultAccount__c order by name ASC]);
        }
        
        
        
         Map<String,AccountContactRelation> mapStrByOrg=new Map<String,AccountContactRelation>();
        
        if(u.Profile.Name =='System Administrator'){
            List<Account> accountList = [SELECT Id, Name FROM Account order by Name ASC];
            resp.put('orgnisations',accountList);
            resp.put('isAdmin',true);
        }
        else
        {
           
            for(AccountContactRelation acrel :[SELECT Id,AccountId, Account.Name,Account.Organization__c,Account.Organization__r.Name, Contact.Name FROM AccountContactRelation where ContactId =:u.contactId order by Account.Name ASC]) {
                mapStrByOrg.put(acrel.AccountId, acrel); 
            }
            resp.put('orgnisations',mapStrByOrg.values());
               resp.put('isAdmin',false);
        }
        
        //if single account update default field with that account
        if(mapStrByOrg.values().size() == 1){
            updateAccount(mapStrByOrg.values()[0].AccountId);
        }
        
        resp.put('selectedOrg',u.DefaultAccount__c);
        return resp;
    }
}