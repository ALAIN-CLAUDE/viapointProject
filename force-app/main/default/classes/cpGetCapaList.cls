public without sharing class cpGetCapaList {
    @AuraEnabled(cacheable=true)
    public  static list<Order> getOrders() {
        return [SELECT Id, Type, SBQQ__TaxAmount__c, Status FROM Order];
    }

    @AuraEnabled(cacheable=true)
    public  static list<Capa__c> getOrgCapas() {
        String userId= userinfo.getUserId();
        user [] ulist = [SELECT Id, AccountId,DefaultAccount__c,ContactId FROM User where ID =:userId ];
        system.debug(ulist);
    
        map<id,Account> accountMap = new map<id,Account>();
    
        for(User u : ulist){
        
            accountMap.put(u.DefaultAccount__c,null);
        }
    map<id,Account> accountMap2 = new map<id,Account>();
    for(Account a : [SELECT Id,Organization__c FROM Account where id =: accountMap.keySet() ]){
            accountMap2.put(a.Organization__c,a);
        
    }
    system.debug('Mapped2==> '+ accountMap2);
    
    map<id,Audit__c> AuditMap1 = new map<id,Audit__c>();
    for(Audit__c adt : [select id,name  from Audit__c where Organization__c in : accountMap2.keySet() ]){
        AuditMap1.put(adt.id,adt);
    }
map<id,AuditFinding__c> AuditFindMap1 = new map<id,AuditFinding__c>();    
for(AuditFinding__c audFind :[SELECT Id FROM AuditFinding__c  where Audit__c  in : AuditMap1.keySet()]){   
    AuditFindMap1.put(audFind.id,audFind);
        }

Capa__c [] caps = [
    SELECT  Id,
            AuditFindingNumber__c,
            Priority__c,
            AuditFindingTitle__c,
            Name,
            AssignedTo__c,
            AssignedTo__r.SmallPhotoUrl,
            AssignedTo__r.FirstName,
            AssignedTo__r.LastName,
            CapaType__c,
            CapaWorkflowStatus__c,
            CapaTitle__c
    FROM    Capa__c 
    WHERE   AuditFindingNumber__c IN : AuditFindMap1.keySet()
];   

system.debug('caps'+ caps);
return caps;

}

@AuraEnabled(cacheable=true)    
public static List<User> getUserDetails() {
    User [] ulist = [
        SELECT  Id, 
                AccountId,
                DefaultAccount__c,
                ContactId 
        FROM    User 
        WHERE   Id = :userinfo.getUserId()
    ];  

    map<id,Account> accountMap = new map<id,Account>();
    
    for(User u : ulist){
    
        accountMap.put(u.DefaultAccount__c,null);
    }
    map<id,Account> accountMap2 = new map<id,Account>();
    for(Account a : [SELECT Id,Organization__c FROM Account where id =: accountMap.keySet() ]){
            accountMap2.put(a.Organization__c,a);
        
    }
    system.debug('Mapped2==> '+ accountMap2);

    map<id,Audit__c> AuditMap1 = new map<id,Audit__c>();
    for(Audit__c adt : [select id,name  from Audit__c where Organization__c in : accountMap2.keySet() ]){
        AuditMap1.put(adt.id,adt);
    }
    map<id,AuditFinding__c> AuditFindMap1 = new map<id,AuditFinding__c>();    
    for(AuditFinding__c audFind :[SELECT Id FROM AuditFinding__c  where Audit__c  in : AuditMap1.keySet()]){   
    AuditFindMap1.put(audFind.id,audFind);
    }
    set<id> storeAssignedToId = new set<id>();
    for(Capa__c aa : [SELECT Id, AssignedTo__c FROM Capa__c WHERE AuditFindingNumber__c IN : AuditFindMap1.keySet()] ){
        storeAssignedToId.add(aa.AssignedTo__c);        
    }
    return [SELECT Id, Name, SmallPhotoUrl FROM User WHERE Id IN :storeAssignedToId];  
}


@AuraEnabled
    public static List<AuditFinding__c> getAuditFindings(){
      
        String userId= userinfo.getUserId();
        user [] ulist = [SELECT Id, AccountId,DefaultAccount__c,ContactId FROM User where ID =:userId ];
        system.debug(ulist);
    
        map<id,Account> accountMap = new map<id,Account>();
    
        for(User u : ulist){
        
            accountMap.put(u.DefaultAccount__c,null);
        }
    map<id,Account> accountMap2 = new map<id,Account>();
    for(Account a : [SELECT Id,Organization__c FROM Account where id =: accountMap.keySet() ]){
            accountMap2.put(a.Organization__c,a);
        
    }
    system.debug('Mapped2==> '+ accountMap2);
    
    map<id,Audit__c> AuditMap1 = new map<id,Audit__c>();
    for(Audit__c adt : [select id,name  from Audit__c where Organization__c in : accountMap2.keySet() ]){
        AuditMap1.put(adt.id,adt);
    }
   
 AuditFinding__c [] audFindList = [SELECT Id,AuditFindingTitle__c FROM AuditFinding__c  where Audit__c  in : AuditMap1.keySet()];

 return audFindList;
}

    /*creating capa*/
  
 @AuraEnabled//(cacheable=true)
 public static Capa__c createCAPAs(string theAuditFindingId, string theCapaTitle,string theCapa,  string theCapaType, string theCapaDescription,Date theStartDate, date theDueDate){
    Capa__c capaObj = new Capa__c();
    capaObj.AuditFindingNumber__c = theAuditFindingId;
    capaObj.CapaTitle__c = theCapaTitle;
    capaObj.Capa__c = theCapa;
    capaObj.CapaDescription__c = theCapaDescription;
    capaObj.StartDate__c = theStartDate;
    capaObj.DueDate__c = theDueDate;
     

     insert capaObj;
     capaObj = [Select Id, Name,CapaTitle__c  from Capa__c where Id=:capaObj.Id];
     return capaObj;
 }
}