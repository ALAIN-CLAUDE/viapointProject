public class TimeZoneConverter {
	//public static DateTime convertToTimeZone(Datetime dt, String locale) {
    public static DateTime convertToTimeZone(Datetime dt) {
     TimeZone tz = UserInfo.getTimeZone(); 
          Integer offset=tz.getOffset(dt);
        System.debug('Offset record current: ' + offset);

   		 Integer msPerHour = 1000 * 60 * 60;
   		return dt.addHours(
    	TimeZone.getTimeZone(tz.getID()).getOffset(dt) / msPerHour
   		);
}
    public static DateTime convertToTimeZone2(Datetime dt) {
        
     TimeZone tz = UserInfo.getTimeZone(); 
          Integer offset=tz.getOffset(dt);
        System.debug('Offset record current: ' + offset);
         // target Timezone.
        TimeZone targetTZ = tz;
        System.debug('Display targetzone name: ' + targetTZ.getDisplayName());
        
        integer offsetTotargetTZ = targetTZ.getOffset(dt);
       	integer correction = offsetTotargetTZ- offset;
         DateTime targetDT = dt.addMinutes(correction / (1000 * 60));
    //return DateTime.newInstance(targetDT.hour(), targetDT.minute(), targetDT.second(), targetDT.millisecond());
	return Datetime.newInstanceGmt(targetDT.yearGmt(), targetDT.monthGmt(), targetDT.dayGmt(), targetDT.hourGmt(), targetDT.minuteGmt(),0);
    }
}