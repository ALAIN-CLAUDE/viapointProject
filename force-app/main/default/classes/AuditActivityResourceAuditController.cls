public with sharing class AuditActivityResourceAuditController {
 



  @AuraEnabled(cacheable=true)

  public static List<AuditActivity__c> getAuditActivity(string auditActivityId){
    

    return [SELECT Id, Name, Audit__c,	AuditActivityResourceCount__c FROM AuditActivity__c where id =: auditActivityId];
  }

  
 @AuraEnabled(cacheable=true)

   public static List<AuditActivityResource__c> getAuditActivityResources(string auditActivityId,Boolean isViewAll){
     if(isViewAll==true){

     list<AuditActivityResource__c> audActResList = [select id,Name,AuditResource__r.Audit__c,UserLocale__c,UserTimeZone__c,LastModifiedById,AuditTitle__c,AuditTitleLinkless__c ,CreatedById,CreatedDate,ActivityPlannedStart__c,ActivityPlannedFinish__c, LastModifiedDate,createdby.name,lastmodifiedby.name,modifiedbyName__c,OwnerName__c,AuditResource__r.AuditResourceTitle__c, AuditActivity__r.AuditActivityResourceCount__c,AuditResource__r.Resource__c,AuditResource__r.ResourceType__c,ResourceTitle__c,AuditActivity__r.Audit__c,AuditActivity__c,AuditActivity__r.name,ActivityResourceWorkflowStatus__c ,RequestAllocationFte__c,RequestDescription__c ,RequestAllocationUnits__c,RequestAllocationMethod__c,ResourceType__C from AuditActivityResource__c where  AuditActivity__c =:auditActivityId  order by Name DESC];

     if(!audActResList.isEmpty()){
       return audActResList;
     }else{
       return null;
     }
       
     } 
     else{
      list<AuditActivityResource__c> audActResList = [select id,Name,AuditResource__r.Audit__c,UserLocale__c,UserTimeZone__c,LastModifiedById, AuditTitle__c,AuditTitleLinkless__c,CreatedById,CreatedDate,ActivityPlannedStart__c,ActivityPlannedFinish__c, LastModifiedDate,createdby.name,lastmodifiedby.name,modifiedbyName__c,OwnerName__c,AuditResource__r.AuditResourceTitle__c, AuditActivity__r.AuditActivityResourceCount__c,AuditResource__r.Resource__c,AuditResource__r.ResourceType__c,ResourceTitle__c,AuditActivity__r.Audit__c,AuditActivity__c,AuditActivity__r.name,ActivityResourceWorkflowStatus__c ,RequestAllocationFte__c,RequestDescription__c ,RequestAllocationUnits__c,RequestAllocationMethod__c,ResourceType__C from AuditActivityResource__c where  AuditActivity__c =:auditActivityId limit 3 ];

       if(!audActResList.isEmpty()){
        return audActResList;
      }else{
        return null;
      }
       
     }
   }


   @AuraEnabled(cacheable=true)

   public static List<AuditActivityResource__c> getAuditActivityResources2(string auditActivityId,Boolean isViewAll){
     
if(isViewAll==true){

  list<AuditActivityResource__c> audActResList =[select id,AuditResource__r.Audit__c,AuditTitle__c,UserLocale__c,LastModifiedById,UserTimeZone__c,AuditTitleLinkless__c,Name,CreatedById,CreatedDate,ActivityPlannedStart__c,ActivityPlannedFinish__c, LastModifiedDate,createdby.name,lastmodifiedby.name,modifiedbyName__c,OwnerName__c,AuditResource__r.AuditResourceTitle__c, AuditActivity__r.AuditActivityResourceCount__c,AuditResource__r.Resource__c,AuditResource__r.ResourceType__c,ResourceTitle__c,AuditActivity__r.Audit__c,AuditActivity__c,AuditActivity__r.name,ActivityResourceWorkflowStatus__c,RequestAllocationFte__c,RequestDescription__c ,RequestAllocationUnits__c,RequestAllocationMethod__c,ResourceType__C from AuditActivityResource__c where  AuditActivity__c =:auditActivityId  order by Name DESC ];
  if(!audActResList.isEmpty()){
    return audActResList;
  }else{
    return null;
  }
 
}
else{
  list<AuditActivityResource__c> audActResList = [select id,AuditResource__r.Audit__c,UserTimeZone__c,UserLocale__c,LastModifiedById,AuditTitle__c,AuditTitleLinkless__c ,Name,CreatedById,CreatedDate,ActivityPlannedStart__c,ActivityPlannedFinish__c, LastModifiedDate,createdby.name,lastmodifiedby.name,modifiedbyName__c,OwnerName__c,AuditResource__r.AuditResourceTitle__c, AuditActivity__r.AuditActivityResourceCount__c,AuditResource__r.Resource__c,AuditResource__r.ResourceType__c,ResourceTitle__c,AuditActivity__r.Audit__c,AuditActivity__c,AuditActivity__r.name,ActivityResourceWorkflowStatus__c ,RequestAllocationFte__c,RequestDescription__c ,RequestAllocationUnits__c,RequestAllocationMethod__c,ResourceType__C from AuditActivityResource__c where  AuditActivity__c =:auditActivityId limit 3 ];
  if(!audActResList.isEmpty()){
    return audActResList;
  }else{
    return null;
  }
 
}
   

   }

@AuraEnabled(cacheable=true)    
public static List<User> getUserDetails(String recId) {
           return [Select id,Name,SmallPhotoUrl, FullPhotoUrl From User where Id =:recId];
         
       }
   
    


@AuraEnabled
   public static List<AuditResource__c> getAuditResources(string auditId){
     
     List<AuditResource__c> ARList = [select id, Name,Audit__c,Resource__c,Resource__r.Name,Resource__r.ResourceType__c,Resource__r.ResourceWorkflowStatus__c,CreatedById, LastModifiedDate, LastModifiedById,CreatedDate from AuditResource__c where Audit__c =: auditId  ];
     List<AuditResource__c> newARList = new List<AuditResource__c>();
     if(auditId != null){
       for(AuditResource__c ar: ARList){
         newARList.add(ar);
 
       }
     }
   
    
     return newARList;
     

   }

/*creating Audit Activity Resources*/
 
@AuraEnabled
public static AuditActivityResource__c createAuditActivResource(string theAuditId, string theAuditActivityId, string theAuditResourceId, string RequestAllocationMethod, integer RequestAllocationUnits, string RequestDescription,string WorkflowStatus){
 AuditActivityResource__c audActResObj = new AuditActivityResource__c();
     audActResObj.Audit__c=theAuditId;
     audActResObj.AuditActivity__c=theAuditActivityId;
     audActResObj.AuditResource__c= theAuditResourceId;
     audActResObj.RequestAllocationMethod__c=RequestAllocationMethod;
     audActResObj.RequestAllocationUnits__c=RequestAllocationUnits;
     audActResObj.RequestDescription__c=RequestDescription;
     audActResObj.ActivityResourceWorkflowStatus__c=	WorkflowStatus;

    insert audActResObj;
    audActResObj = [Select Id, Name from AuditActivityResource__c where Id=:audActResObj.Id];
    return audActResObj;
}





   @AuraEnabled
   public static void delSelectedAudAct(list<Id> lstAudActResIds){ 
       try {
           list<AuditActivityResource__c> lstAudActResToDelete = new list<AuditActivityResource__c>();
           System.debug('lstAudActResIds ====> '+lstAudActResIds);
           for(Id idAudActRes : lstAudActResIds) {
             lstAudActResToDelete.add(new AuditActivityResource__c(Id = idAudActRes));
           }
           if(!lstAudActResToDelete.isEmpty()) {
               delete lstAudActResToDelete;
           }
       }
       catch(Exception ex) {
           throw new AuraHandledException(ex.getMessage());
       }
   }

  


   }