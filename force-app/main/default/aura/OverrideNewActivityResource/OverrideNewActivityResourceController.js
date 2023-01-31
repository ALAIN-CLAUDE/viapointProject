({
	doInit : function(component, event, helper) {
        var value = helper.getParameterByName(component , event, 'inContextOfRef');
        var context = JSON.parse(window.atob(value));
        component.set("v.parentRecordId", context.attributes.recordId);
         component.set("v.isLoaded", true);
	},
  handleClose: function (component, event, helper) {
      
  if (event.getParam("value")) {
      var navEvt = $A.get("e.force:navigateToSObject");
      navEvt.setParams({
        recordId: event.getParam("value"),
        slideDevName: "related"
      });
      navEvt.fire();
    } else {
      var homeEvent = $A.get("e.force:navigateToObjectHome");
      homeEvent.setParams({
        scope: "Audit_Activity_Resource__c"
      });
      homeEvent.fire();
    }
    
  }
})