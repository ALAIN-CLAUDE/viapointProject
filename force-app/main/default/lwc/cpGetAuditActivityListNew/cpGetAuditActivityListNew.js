import { LightningElement, wire, api, track } from 'lwc';
import { refreshApex } from "@salesforce/apex";
import getAllAuditActivities from '@salesforce/apex/cpGetAuditActivityListNew.getAllAuditActivities';
import getUserDetails from '@salesforce/apex/cpGetAuditActivityListNew.getUserDetails';
import userId from '@salesforce/user/Id';
import basePath from "@salesforce/community/basePath";

export default class CpGetAuditActivityListNew extends LightningElement {
    @api recordId;
    @api userId = userId;
    @track data;
    @track dataResult;
    objectApiName ='AuditActivity__c';
    AuditActivityResources;
    userProfilePicsUrl;   
    userData;
    userError;
    user;
    userName;
    urlAuditActivities = basePath +'/assessments/audit-activities';

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

   /* @wire(getUserDetails)
    wiredAuditUsers(userData) {
        this.userData = userData;
        const { data, error } = userData; 
        console.log('Audit Activities List users: '+  JSON.stringify(userData));     
        if (data) {
            this.user = data;
           // console.log('photo ', data[0]['SmallPhotoUrl']);
           // console.log('name', data[0]['Name']);
            this.userProfilePicsUrl = data[0]['SmallPhotoUrl'];
            this.userName = data[0]['Name'];
            
        } else if (error) {
           this.userError = error;
        }
    }*/

    @wire(getAllAuditActivities)
    wiredAudActRes(result) {
        refreshApex(result);
        if(result.data) {
            console.log('result.data; ', result.data);
            this.data = result.data;
            let resp  = JSON.parse(JSON.stringify(result.data))
            let usersId =[];
            resp.forEach(
                item => {          
                    let startDay = (item.PlannedStart__c != null) ? new Date(item.PlannedStart__c) : new Date('Sun November 19,2022'); 
                    let convertFormat = "{DD} {MMM} {YYYY}";
                    item['editUrl'] = item['Id'];
                    item['menuId'] = 'menu-' + item['Id'];
                    item['unitClass'] = item.AuditActivityWorkflowStatus__c.replace(/\s/g, '').toLowerCase() +' card-box';
                    item['formattedDate'] = this.convertDateFormat(startDay, convertFormat);
                    if(item.AssignedTo__c != null) {
                        console.log('item.AssignedTo__c != null');
                        let userFirstName = (item.AssignedTo__r.FirstName != null && item.AssignedTo__r.FirstName != undefined) ?  item.AssignedTo__r.FirstName : ' ';
                        let userLastName = (item.AssignedTo__r.LastName != null && item.AssignedTo__r.LastName != undefined) ? item.AssignedTo__r.LastName : ' ';
                        item['assignToUser'] = userFirstName + ' ' + userLastName;
                        item['assignSmallPhotoUrl'] = item.AssignedTo__r.SmallPhotoUrl;
                        item['noAssegnedUser'] = true;
                    } else {
                        console.log('ELSE item.AssignedTo__c != null');
                        item['noAssegnedUser'] = false;
                        item['assignToUser'] = '';
                        item['assignSmallPhotoUrl'] = '';
                    }
                console.log('resp list', JSON.stringify(resp));   
        });
            this.data = resp;
            console.log(' this.dataresp list', JSON.stringify( this.data));
            this.userInfoIds = usersId;    
        }
        
       
        if (result.error) {
            this.data = undefined;
            console.log('(result.error', result.error);
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