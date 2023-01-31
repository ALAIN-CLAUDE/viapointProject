public without sharing class cpGetPeopleList {
    @AuraEnabled(cacheable=true)
    public static list<Contact> getOrgsPeople() {
        String userId= userinfo.getUserId();
        user [] ulist = [SELECT Id, AccountId,DefaultAccount__c,ContactId FROM User where ID =:userId];
        system.debug(ulist);
    
        map<id,Account> accountMap = new map<id,Account>();
    
        for(User u : ulist){
        
            accountMap.put(u.DefaultAccount__c,null);
        }
        
        for(Account a : [SELECT Id FROM Account where id =: accountMap.keySet() ]){
            system.debug('Account Info===> '+ a);
        }
        
        map<id,Contact> contactMap = new map<id,Contact>();
    AccountContactRelation [] accRelList = [SELECT Id, AccountId, ContactId FROM AccountContactRelation where AccountId in:accountMap.keySet() ];
        for(AccountContactRelation accRel : accRelList){
            contactMap.put(accRel.ContactId, null);
        }
        
        
        Contact [] cons= [SELECT id, LastName, FirstName, Title, Email FROM Contact where Id in: contactMap.keySet()];
            system.debug('cons '+ cons);
        
        if(!cons.isEmpty()){
            return cons;
        }else{
            return null;
        }
            
            }


            /*creating Audit Activity Resources*/
  
 @AuraEnabled//(cacheable=true)
 public static contact createPeople(string theAccountId, string theLastName, string thefirstName, string thePhone,string theMobile, string theEmail ){
    contact conObj = new contact();
    conObj.AccountId = theAccountId;
    conObj.LastName = theLastName;
    conObj.firstName =thefirstName;
    conObj.Phone = thePhone;
    conObj.MobilePhone = theMobile;
    conObj.Email = theEmail;
     

     insert conObj;
     conObj = [Select Id, LastName,FirstName,Name from contact where Id=:conObj.Id];
     return conObj;
 }
}