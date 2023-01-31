public with sharing class cpCardPurchasedProducts {

    @AuraEnabled(cacheable=true)
    public static User getUserTimeZone(){        
        return [SELECT Id, Name, TimeZoneSidKey, LocaleSidKey FROM User WHERE Id =:userinfo.getUserId() LIMIT 1];
       
    }
    @AuraEnabled(cacheable=true)
    public static list<OrderItem> getAllOrdersAndItems() {
        String userId= userinfo.getUserId();
        User [] ulist = [
        SELECT  Id, 
                AccountId,
                DefaultAccount__c,                 
                ContactId 
        FROM    User 
        WHERE   Id = :userinfo.getUserId()
        ];
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
        for(Order ord : [SELECT Id, Pricebook2Id, AccountId, ContractId, OwnerId, Status, EndDate, OrderNumber, ActivatedDate 
        FROM Order where  AccountId in : accountMap.keySet() ]){
            orderMap1.put(ord.id,ord);
            
            system.debug('Order id=='+ord.id + 'order '+ ord);
        }

        List<OrderItem> orderline = [
            SELECT  Id,
                    OrderId,
                    Order.EffectiveDate,
                    Quantity,
                    Product2Id,
                    Product2.Family,
                    Product2.Name,
                    Product2.ProductCardBackgroundColor__c,
                    Product2.ProductCardImage__c,
                    Order_Status__c,
                    Product_Name__c,
                    EndDate,
                    ServiceDate,
                    Order_Start_Date__c,
                    Order_Number__c,
                    UnitPrice,
                    TotalPrice
            FROM    OrderItem 
            WHERE   orderId IN :orderMap1.keySet()
        ];
        return orderline;
    }
}