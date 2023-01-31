trigger ContentDistribution on ContentDistribution (after insert, after update) {
    if(Trigger.isAfter){
        if(Trigger.isInsert){
           Map<Id,ContentDistribution> cdMap = new Map<Id,ContentDistribution>([
               SELECT 	ContentDocumentId, 
                       ContentDownloadUrl, 
                       ContentVersionId, 
                       DistributionPublicUrl, 
                       PdfDownloadUrl, 
                       Name, 
                       Id 
         	FROM 	ContentDistribution 
            WHERE 	Id In : trigger.newMap.keySet()
           ]);
         
            Set<Id> newCVList = new Set<Id>();
            for(Id cdVal : cdMap.keySet()){
                newCVList.add(cdMap.get(cdVal).ContentDocumentId);
            }
          
            List<ContentVersion> ver = [SELECT Id, ContentDocumentId, ContentPublicUrl__c from ContentVersion WHERE ContentDocumentId IN :newCVList];
         
            Map<Id, String> sdMAp = new Map<Id, String>();
            for(ContentVersion cvId : ver) {
                for(Id cd : cdMap.keySet() ){
                    if(cvId.ContentDocumentId == cdMap.get(cd).ContentDocumentId){
                        cvId.ContentPublicUrl__c  = cdMap.get(cd).ContentDownloadUrl;
                    }   
                }
            }
            update ver;
        }
    }
}