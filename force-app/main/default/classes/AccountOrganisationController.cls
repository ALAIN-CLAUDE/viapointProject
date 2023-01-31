public class AccountOrganisationController {
    public static void createOrganisation(map<id,account> newAcc){
        list<account> accUpdate = new list<account>();
        list<Organization__c> orgUpdate = new list<Organization__c>(); 
         set<string>  accName = new set<string>(); 
        
       
         
        for(account acc : [select id, name from account where id in : newAcc.keySet()]){
            accName.add(acc.Name);
        }
        
         Organization__c [] orgList =[select id, name from Organization__c where name in : accName limit 1];
        if(orgList.isEmpty()){
                  for(account acc : [select id, name from account where id in : newAcc.keySet()]){
            
            Organization__c org = new Organization__c();
            org.name = acc.name;
            orgUpdate.add(org);
            
        }
        
        insert orgUpdate ;
        
        for(account acc : [select id, name from account where id in : newAcc.keySet()]){
            for(Organization__c org : orgUpdate){
                acc.Organization__c = org.Id;
                accUpdate.add(acc);
            }
        }
        update accUpdate;
        }else{
          
              
        for(account acc : [select id, name from account where id in : newAcc.keySet()]){
            for(Organization__c org : orgUpdate){
                acc.Organization__c = org.Id;
                accUpdate.add(acc);
            }
        }
        update accUpdate;
        }
  
        
    }
    public static void EditOrganisation(map<id,account> newAcc,map<id,account> oldAcc){
        list<account> accUpdate = new list<account>();
               list<account> accUpdateOrg = new list<account>();
        list<Organization__c> orgUpdate = new list<Organization__c>();
        list<Organization__c> orgInsert = new list<Organization__c>();
         set<string>  accName = new set<string>(); 
            
        for(account acc : [select id, name from account where id in : newAcc.keySet()]){
            accName.add(acc.Name);
        }
        
         Organization__c [] orgList =[select id, name from Organization__c where name in : accName limit 1];
        
        for(account acc : [select id, name,Organization__c from account where id in : newAcc.keySet()]){
            
            account oldRec = oldAcc.get(acc.id);
            
            if(acc!= oldRec && acc.Organization__c != null){
                orgUpdate.add(new Organization__c(id= acc.Organization__c,name = acc.Name)) ;    
            } 
            if(acc != oldRec && acc.Organization__c == null && orgList.isEmpty()){
                Organization__c org = new Organization__c();
                org.name = acc.name;
                orgInsert.add(org);
                
            }
            if(acc != oldRec && acc.Organization__c == null && !orgList.isEmpty()){
                  for(Organization__c org : orgList){
                acc.Organization__c = org.Id;
                accUpdateOrg.add(acc);
            }
            }
        }
        if(!orgUpdate.isEmpty()){
            update orgUpdate ;  
        }else if(!accUpdateOrg.isEmpty()){
            update accUpdateOrg;
        }else{
            insert  orgInsert;
            
            for(account acc : [select id, name from account where id in : newAcc.keySet()]){
                for(Organization__c org : orgInsert){
                    acc.Organization__c = org.Id;
                    accUpdate.add(acc);
                }
            }
            update accUpdate;
            
        }
        
        
        
    }
    public static void deleteOrganisation(map<id,account> oldAcc){
        
        list<Organization__c> orgDelete = new list<Organization__c>();
        
        map<id,Organization__c> orgId = new map<Id,Organization__c>();
        
        for(account acc : [select id, name,Organization__c from account where id in : oldAcc.keySet()]){
            orgId.put(acc.Organization__c,null);
            
        }
        
        for(Organization__c org :  [select id , name from Organization__c  where id in : orgId.keySet()]){
            orgDelete.add(org);
        }
        
        delete  orgDelete;
        
    }
    
}