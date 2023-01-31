public class SetUserTimeZone {
    /*
    public static void updateTimeZone(list<Audit_Activity__c>audActList ){
        
        
	Datetime PlanStartmyDateTime ;
	Datetime PlanFinishmyDateTime ;
         TimeZone tz = UserInfo.getTimeZone(); 
       
        set<id> aditActSetId = new set<id>();
        for(Audit_Activity__c aa : audActList){
            aditActSetId.add(aa.id);
        }
    //    User [] usList= [Select id,Name,SmallPhotoUrl, FullPhotoUrl,TimeZoneSidKey From User Where Id =: Userinfo.getUserId()];
        
        
        
        Audit_Activity_Resource__c [] aarlist= new list<Audit_Activity_Resource__c>();
        for(Audit_Activity_Resource__c aaRs : [SELECT Id, Audit_Activity__c,User_PlanStart_Text__c,Audit_Activity__r.Planned_Start__c,Audit_Activity__r.Planned_Finish__c, Activity_Planned_Start__c, Activity_Planned_Finish__c FROM Audit_Activity_Resource__c where Audit_Activity__c in: aditActSetId ]){
         /*   DateTime dtPlanStart =  aaRs.Activity_Planned_Start__c;
            Integer msPerHour = 1000 * 60 * 60;
               Integer offsetPlanstart=tz.getOffset(dtPlanStart);
        System.debug('Offset record current: ' + offsetPlanstart);
          //  Integer msPerHour = 1000 * 60 * 60;
            aaRs.Users_Planned_Start_TZ__c =dtPlanStart.addHours(
    	TimeZone.getTimeZone(tz.getID()).getOffset(dtPlanStart) / msPerHour
   		);
            
            
            
             DateTime dtPlanFinish =  aaRs.Activity_Planned_Finish__c;
               Integer offsetPlanFinish=tz.getOffset(dtPlanFinish);
        System.debug('Offset record current: ' + offsetPlanFinish);
            aaRs.Users_Planned_Finish_TZ__c =dtPlanFinish.addHours(
    	TimeZone.getTimeZone(tz.getID()).getOffset(dtPlanFinish) / msPerHour
   		);*/
    /*
            if(String.valueOf(aaRs.Audit_Activity__r.Planned_Start__c) != String.valueOf(aaRs.User_PlanStart_Text__c) ){
                
            }
             PlanStartmyDateTime =aaRs.Audit_Activity__r.Planned_Start__c;
	         PlanFinishmyDateTime =aaRs.Audit_Activity__r.Planned_Finish__c;
            //	aaRs.User_PlanStart_Text__c =   aaRs.Users_Planned_Start_TZ__c ;////String.valueOf(TimeZoneConverter.convertToTimeZone2(PlanStartmyDateTime));
            aaRs.Users_Planned_Start_TZ__c =TimeZoneConverter.convertToTimeZone2(PlanStartmyDateTime);
            aaRs.Users_Planned_Finish_TZ__c=TimeZoneConverter.convertToTimeZone2( PlanFinishmyDateTime);
            aarlist.add(aaRs);
            
            
        }
        if(aarlist.size()>0){
            update aarlist;
        }
        
    }
*/
    /*
    public static void UserTimeZone(list<User>UserList,map<id,User>oldUser){
        
        User [] usList= [Select id,Name,SmallPhotoUrl, FullPhotoUrl,TimeZoneSidKey From User Where Id =: Userinfo.getUserId()];
        
        set<id> userIds = new set<id>();
    
    }
*/
}