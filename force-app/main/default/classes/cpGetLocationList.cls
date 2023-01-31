public without sharing class cpGetLocationList {
    
@AuraEnabled(cacheable=true)

public static list<Location__c> getOrgLocations() {
String userId= userinfo.getUserId();
     user [] ulist = [SELECT Id, ContactId, DefaultAccount__c,AccountId FROM User where ID =:userId  ];
    system.debug(ulist);

    map<id,Account> accountMap = new map<id,Account>();

    for(User u : ulist){
    
        accountMap.put(u.DefaultAccount__c,null);
    }
    
    Location__c [] loc = [SELECT Id, Name, LocationType__c, TimeZone__c, Account__c, CreatedDate FROM Location__c where  Account__c in: accountMap.keySet() ];
    system.debug('loc==>'+ loc);

        return loc;
    

}





 /*creating Audit Activity Resources*/
  
 @AuraEnabled//(cacheable=true)
 public static Location__c createLocations(string theAccountId, string theLocationName, string theLocationType, string thetimezone){
    Location__c locObj = new Location__c();
      locObj.Account__c = theAccountId;
      locObj.Name = theLocationName ;
      locObj.LocationType__c =theLocationType;
      locObj.TimeZone__c = thetimezone;
     

     insert locObj;
     locObj = [Select Id, Name from Location__c where Id=:locObj.Id];
     return locObj;
 }
}