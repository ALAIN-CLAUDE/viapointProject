public without sharing class cpGetOrderAndItemList {
    @AuraEnabled(cacheable=true)
    public static list<OrderItem> getAllOrdersAndItems() {
        String userId= userinfo.getUserId();
        user [] ulist = [SELECT Id, AccountId,DefaultAccount__c,ContactId FROM User where ID =:userId];
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
        
        map<id,Order> orderMap1 = new map<id,Order>();
        for(Order ord : [SELECT Id, Pricebook2Id, AccountId, ContractId, OwnerId, Status, EndDate, OrderNumber, ActivatedDate FROM Order where  AccountId in : accountMap.keySet() ]){
            orderMap1.put(ord.id,ord);
            
            system.debug('Order id=='+ord.id + 'order '+ ord);
        }

List<OrderItem> orderline = [SELECT id,orderId,Quantity,Product2Id,Product2.Name,Order_Status__c,Product_Name__c,Order_Start_Date__c,Order_Number__c, UnitPrice, TotalPrice FROM OrderItem WHERE orderId in: orderMap1.keySet()];

        
            if(!orderline.isEmpty()){
                return orderline;
            }else{
                return null;  
            }
    }
}