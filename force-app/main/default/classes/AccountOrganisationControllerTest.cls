@isTest
public class AccountOrganisationControllerTest {
	   @TestSetup
    public static void generateData()
    {
        Account acc = new account();
        acc.name ='Test';
        insert acc;
         
        Account acc2 = new account();
        acc2.name ='Test2';
        insert acc2;
        
           Organization__c org = new Organization__c();
            org.name = 'Test Org';
            insert org;
          Organization__c org2 = new Organization__c();
            org2.name = 'Test Org2';
            insert org2;
        
    }
     @isTest
    public static void testCreate()
        
    {
        list<id> itemIds = new list<id>();
        AccountOrganisationController.createOrganisation(new map<id,account> ([SELECT Id,name from account where name = 'Test' limit 1]));
       
   /*
        itemIds.add([SELECT Id,opportunity.Name from OpportunityLineItem where opportunity.Name = 'TestOpp' limit 1].id);
         sideBarProduct1.getProducts( [SELECT Id from opportunity where name = 'TestOpp' limit 1].id,true);
        sideBarProduct1.getPricebook([SELECT Id from opportunity where name = 'TestOpp' limit 1].id,true);
         sideBarProduct1.getPricebook2();
        sideBarProduct1.updateOppPricebook2([SELECT Id from opportunity where name = 'TestOpp' limit 1].id,Test.getStandardPricebookId());
        sideBarProduct1.delSelectedProducts(itemIds);
*/
    }
     @isTest
      public static void testEdit()   
    {
      account acc = [SELECT Id,name from account where name = 'Test' limit 1];
        acc.Name = 'Test2';
        update acc;
     AccountOrganisationController.EditOrganisation(new map<id,account> ([SELECT Id,name from account where name = 'Test' limit 1]),new map<id,account> ([SELECT Id,name from account where name = 'Test2' limit 1]));    
	
         account acc2 = [SELECT Id,name from account where name = 'Test2' limit 1];
        acc2.Name = 'Test2';
        update acc2;
        
          AccountOrganisationController.EditOrganisation(new map<id,account> ([SELECT Id,name from account where name = 'Test2' limit 1]),new map<id,account> ([SELECT Id,name from account where name = 'Test2' limit 1]));  
    }
    
}