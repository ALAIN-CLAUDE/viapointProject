public with sharing class getProducts {
    @AuraEnabled(cacheable=true)
    public static list<Product2> getOrgProducts() {

        return [SELECT Id, Name, ProductCode, IsActive, Family, QuantityUnitOfMeasure FROM Product2];

    }
}