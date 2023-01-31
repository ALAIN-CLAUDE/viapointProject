public without sharing class cpGetAuditList {
@AuraEnabled(cacheable=true)
public static list<Audit__c> getOrgAudits(){
String userId= userinfo.getUserId();
    user [] ulist = [SELECT Id,DefaultAccount__c, Contact.AccountId, Contact.Account.DefaultAccount__c,Contact.id,Contact.Account.Name FROM User where ID =:userId ];
    system.debug(ulist);
    map<id,Contact> contactMap = new map<id,Contact>();
    map<id,Account> accountMap = new map<id,Account>();

    for(User u : ulist){
        contactMap.put(u.Contact.id,null);
        accountMap.put(u.DefaultAccount__c,null);
        system.debug('the accountId==> '+ u.DefaultAccount__c);
    }
    
map<id,Account> accountMap2 = new map<id,Account>();
for(Account a : [SELECT Id,Organization__c FROM Account where id in: accountMap.keySet()  ]){
    accountMap2.put(a.Organization__c,a);

}
system.debug('Mapped2==> '+ accountMap2);

Audit__c [] adt = [select id, Name, Organization__r.name, Organization__r.id, AuditTitle__c,LeadAuditorInternalName__c,AuditDepartment__c,AuditDepartment__r.Name, AuditWorkflowStatus__c from Audit__c where Organization__c in : accountMap2.keySet() ];

return adt;


}


@AuraEnabled(cacheable=true)    
public static List<User> getUserDetails() {

    String userId= userinfo.getUserId();
    user [] ulist = [SELECT Id,DefaultAccount__c, Contact.AccountId, Contact.Account.DefaultAccount__c,Contact.id,Contact.Account.Name FROM User where ID =:userId ];
    system.debug(ulist);
    map<id,Contact> contactMap = new map<id,Contact>();
    map<id,Account> accountMap = new map<id,Account>();

    for(User u : ulist){
        contactMap.put(u.Contact.id,null);
        accountMap.put(u.DefaultAccount__c,null);
        system.debug('the accountId==> '+ u.DefaultAccount__c);
    }
    
map<id,Account> accountMap2 = new map<id,Account>();
for(Account a : [SELECT Id,Organization__c FROM Account where id in: accountMap.keySet()  ]){
    accountMap2.put(a.Organization__c,a);

}
system.debug('Mapped2==> '+ accountMap2);
    
    set<id> storeLeadId = new set<id>();
for(Audit__c aa :[select id, Name, Organization__r.name, Organization__r.id, AuditTitle__c,LeadAuditorInternalName__c,LeadAuditorInternal__c, AuditWorkflowStatus__c,AuditDepartment__c from Audit__c where Organization__c in : accountMap2.keySet() ] ){
    storeLeadId.add(aa.LeadAuditorInternal__c);

}

            return [Select id,Name,SmallPhotoUrl, FullPhotoUrl From User where Id in:storeLeadId];
          
        }
    


}