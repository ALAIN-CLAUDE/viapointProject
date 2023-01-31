import { LightningElement, api, wire, track } from 'lwc';
import getOrgAudits from '@salesforce/apex/cpGetAuditListNew.getOrgAudits';
import getUserDetails from '@salesforce/apex/cpGetAuditListNew.getUserDetails';
import { refreshApex } from "@salesforce/apex";
import basePath from "@salesforce/community/basePath";
import { NavigationMixin } from 'lightning/navigation';

export default class AuditCard extends NavigationMixin(LightningElement) {
    @track incomeData;
    objectApiName = 'Audit__c';
    dataExist = false;
    userExist = false;   
    userError;
    userDataResult;
    userName;
    urlAudits = basePath +'/assessments/audits';
/*
    navigateToRecordDetail(event){
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: event.target.dataset.targetId,
                objectApiName: this.objectApiName,
                actionName: 'view'
            }
        });
    }
*/
    @wire(getUserDetails)
    wiredUser(result) {          
        if (result.data) {
            //console.log(' AUDIT this.userDataResult = result.data;',result.data);
            this.userDataResult = result.data;
            //console.log(JSON.stringify(result.data));   
        } else if (result.error) {
            this.userError = error;
        }
    }

    @wire(getOrgAudits)
    cons(result) {
        refreshApex(result);
        if(result.data){
            this.dataExist = true;
            this.incomeData = result.data;
            let resp  = JSON.parse(JSON.stringify(result.data))
            //console.log('this isgetOrgAudits datathis isgetOrgAudits data'+JSON.stringify(result));         
            resp.forEach(item => {
                console.log('item ', item);
                let statusName = item['AuditWorkflowStatus__c'];
                let convertFormat = "{DD} {MMM} {YYYY}";
                let startDay = (item['PlannedStart__c']) ? this.convertDateFormat(new Date(item['PlannedStart__c']), convertFormat)  : ' ';           
                item['formattedDate'] = startDay;
                item['unitClass'] = statusName.toLowerCase() +' card-box';
                //item['edittUrl'] = basePath + '/audit/:recordId/' +item['Id']; 
                item['edittUrl'] = item['Id'];               
                item['menuId'] = 'menuId'+ item['Id'];
                //item['title'] = String(item['AuditTitle__c']);
                if (item['LeadAuditorInternal__c']) {                
                    item['assignSmallPhotoUrl'] = (item.LeadAuditorInternal__r.SmallPhotoUrl) ? item.LeadAuditorInternal__r.SmallPhotoUrl : "/sfsites/c/profilephoto/005/T" ;
                    item['noAssegnedUser'] = true;
                } else {
                    item['noAssegnedUser'] = false;
                }   
        });
            //console.log('1 section data result', JSON.stringify(resp));
            this.incomeData = resp;
            //console.log('1 section data result', JSON.stringify(this.incomeData));
        }
        
        if (result.error) {
            this.incomeData = undefined;
        }
    }
    
    handleMouseover(event) {
        let targetId = event.target.dataset.targetId;       
        let target = this.template.querySelector(`[data-id="${targetId}"]`);        
        target.classList.remove('slds-hide');
        target.classList.add('slds-show');
    }
    
    handleMouseLeave(event) {
        const targetId = event.target.dataset.targetId;        
        const target = this.template.querySelector(`[data-id="${targetId}"]`);      
        target.classList.add('slds-hide');
        target.classList.remove('slds-show');
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