public without sharing class cpCardAvailableProducts {
    @AuraEnabled(cacheable=true)
    public static list<Product2> getOrgProducts() {
        return [
            SELECT  Id,
                    ProductCardBackgroundColor__c,
                    ProductCardImage__c,
                    ParentProduct__c, 
                    Audit__c, 
                    ProductCode, 
                    Name, 
                    IsActive, 
                    Family,
                    CreatedBy.Name,
                    CreatedById, 
                    CreatedBy.SmallPhotoUrl 
            FROM    Product2
        ];
 
    }
    
    @AuraEnabled(cacheable=true)
    public List<String> getActiveValuesIntoList(){
        List<String> pickListValuesList= new List<String>();
        Schema.DescribeFieldResult fieldResult = Product2.IsActive.getDescribe();
        List<Schema.PicklistEntry> ple = fieldResult.getPicklistValues();
        
        for( Schema.PicklistEntry pickListVal : ple){
            pickListValuesList.add(pickListVal.getLabel());
        }
        return pickListValuesList;
    }
}