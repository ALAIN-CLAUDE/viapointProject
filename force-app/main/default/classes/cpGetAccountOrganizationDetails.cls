public with sharing class cpGetAccountOrganizationDetails {
    @AuraEnabled(cacheable=true)
    Public static map<String,object> getAccountDetails(){
        Map<String,object> resp = new Map<String,object>();
       List<Account> accountList = [SELECT Id, BillingStreet, BillingCity,Organization__r.Name, BillingState, BillingPostalCode, BillingCountry, Name, BillingAddress, ShippingStreet, ShippingCity, ShippingState, ShippingPostalCode, ShippingCountry, ShippingAddress, Phone, Organization__c, Website FROM Account order by name ASC];
       resp.put('accounts',accountList);
        resp= cpUpdateAccountOrganizationDetails.getAccountDetails(resp);
        
        return resp ;
        
    }
    
}