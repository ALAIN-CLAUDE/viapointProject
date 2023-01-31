import { LightningElement,wire,track, api } from 'lwc';
import getOrgAuditFindings from '@salesforce/apex/CpGetAuditFindingList.getOrgAuditFindings';
import getUserDetails from '@salesforce/apex/CpGetAuditFindingList.getUserDetails';
import { refreshApex } from "@salesforce/apex";
import basePath from "@salesforce/community/basePath";

export default class CpGetAuditFindingListNew extends LightningElement {
    @track dataFinding;
    userProfilePicsUrl;
    userAssignedPicsUrl;   
    userData;
    userError;
    user;
    userName; 
    urlAuditFindings = basePath +'/assessments/audit-findings';
    objectApiName ='AuditFinding__c';

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

    /*@wire(getUserDetails)
    wiredUser(userData) {
        this.userData = userData;
        const { data, error } = userData;
        if (data) {
            console.log('Audit Activities Findings data', data);
            this.user = data;
            this.userProfilePicsUrl = data[0]['SmallPhotoUrl'];
            this.userName = data[0]['Name'];
        } else if (error) {
           this.userError = error;
        }
    }*/

    @wire(getOrgAuditFindings)
    cons(result) {
        refreshApex(result);
        if(result.data) {
            this.dataFinding = result.data;            
            let resp = JSON.parse(JSON.stringify(result.data));           
            resp.forEach(
            item => {                
                item['editUrl'] = '/auditfinding/' +item['Id'];
                item['menuId'] = 'menu-' + item['Id'];                
                item['unitClass'] = item.AuditFindingWorkflowStatus__c.replace(/\s/g, '').toLowerCase() +' card-box';
                if(item.AssignedTo__c != null) {
                    let userFirstName = (item.AssignedTo__r.FirstName != null && item.AssignedTo__r.FirstName != undefined) ?  item.AssignedTo__r.FirstName : ' ';
                    let userLastName = (item.AssignedTo__r.LastName != null && item.AssignedTo__r.LastName != undefined) ? item.AssignedTo__r.LastName : ' ';
                    item['assignToUser'] = userFirstName + ' ' + userLastName;
                    item['assignSmallPhotoUrl'] = item.AssignedTo__r.SmallPhotoUrl;
                    item['noAssegnedUser'] = true;
                } else {
                    item['noAssegnedUser'] = false;
                }
            });
            this.dataFinding = resp;
    }
        if (result.error) {
            this.dataFinding = undefined;
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