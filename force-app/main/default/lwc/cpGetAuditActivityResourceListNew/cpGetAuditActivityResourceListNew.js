import { LightningElement, wire, api, track } from 'lwc';
import getOrgAudActivityResource from '@salesforce/apex/cpGetAuditActivityResourceListNew.getOrgAudActivityResource';
import { refreshApex } from "@salesforce/apex";
import basePath from "@salesforce/community/basePath";

export default class CpGetAuditActivityResourceListNew extends LightningElement {
    @api recordId;
    @track data;
    @track dataResult;
    AuditActivityResources;
    fldsItemValues = [];
    objectApiName ='AuditActivityResource__c';
    urlAuditActivitiesResources = basePath +'/assessments/audit-activity-resources';
    @wire(getOrgAudActivityResource)
    wiredAudActRes(result) {
        refreshApex(result);
        if(result.data) {           
            console.log('3 section data' , result.data);
            let finalData = [];
            finalData = result.data;
            let finalDataResult = [];
            finalData.forEach(item =>  {
                let audActResObj = {...item};                
                let startDateFormatted = ' ';
                let finishDateFormatted = ' ';
                let startDay;
                let finishDay;
                let convertFormat = "{DD} {MMM} {YYYY}";
                let startResult = item.hasOwnProperty('start');
                let finishResult = item.hasOwnProperty('finish');
                if(startResult) {      
                    console.log('item.start)',item.start);                  
                    startDay = new Date(item.start);
                    startDateFormatted = this.convertDateFormat(startDay, convertFormat);
                    console.log('startDateFormatted', startDateFormatted);
                }
                if(finishResult) {                       
                    finishDay = new Date(item.finish);
                    finishDateFormatted = this.convertDateFormat(finishDay, convertFormat);
                }              
                let startDateValue = (startDateFormatted != null) ? startDateFormatted : '-';
                let finishDateValue = (finishDateFormatted != null) ? finishDateFormatted : '-';
               
               
                audActResObj['startdate'] = startDateValue;
                audActResObj['finishdate'] = finishDateValue;
                audActResObj['menuId'] = 'menu-' + item.recordId;
               
                console.log('audActResObj ', audActResObj);
                finalDataResult.push(audActResObj);
            });
     
        console.log('3 section data result', finalDataResult);
        this.data = finalDataResult;
        }
    }

    convertDateFormat(date, format) {
        //location = location.substr(0, location.indexOf('_'));
        let z = {
            M: date.getMonth() + 1,
            D: date.getDate(),
        };
    
        format = format.replace(/{(Y+)}/g, function(v) {
            return date.getFullYear().toString().slice(2 - v.length)
        });
    
        if(format.match(/M{3,}/g)) {
            
            format = format.replace(/({M{4,}})/g, function() {
                return date.toLocaleString( 'en-EN', { month: 'long' });
            });
    
            format = format.replace(/{M{3}}/g, function() {
                return date.toLocaleString('en-EN', { month: 'short' });
            });
    
        } else {
            format = format.replace(/{(M+)}/g, function(v) {
                return ((v.length > 1 ? "0" : "") + z.M).slice(-2)
            });
        }
    
        format = format.replace(/{(D+)}/g, function(v) {
            return ((v.length > 1 ? "0" : "") + z.D).slice(-2)
        });
        
        return format;
    }
     
}