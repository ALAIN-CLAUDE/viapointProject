trigger AccountTrigger on Account (before insert,before update,before delete,after insert,after update,after delete,after undelete) {
    
    if(trigger.isBefore){
        if(trigger.isInsert){
            
        }
        if(trigger.isUpdate){
            
        }
        
         if(trigger.isdelete){
           AccountOrganisationController.deleteOrganisation(trigger.oldMap);
        }
    }
    if(trigger.isAfter){
        if(trigger.isInsert){
            AccountOrganisationController.createOrganisation(trigger.newMap);
        }
        if(trigger.isUpdate){
             AccountOrganisationController.EditOrganisation(trigger.newMap,trigger.oldMap);
        }
       
        if(trigger.isUndelete){
          AccountOrganisationController.createOrganisation(trigger.newMap);
        }
    }
    
}