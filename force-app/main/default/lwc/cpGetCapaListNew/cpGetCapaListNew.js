import { LightningElement,wire,track,api } from 'lwc';
import { refreshApex } from "@salesforce/apex";
import getOrgCapas from '@salesforce/apex/cpGetCapaList.getOrgCapas';
import getAuditFindings from '@salesforce/apex/cpGetCapaList.getAuditFindings';
import createCAPAs from '@salesforce/apex/cpGetCapaList.createCAPAs';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getUserDetails from '@salesforce/apex/cpGetCapaList.getUserDetails';
import userIdValue from '@salesforce/user/Id';
import basePath from "@salesforce/community/basePath";

export default class CpGetCapaListNew extends LightningElement {
    @api userId = userIdValue;
    @track data;
    AuditActivityResources;
    @track userProfilePicsUrl;
    fldsItemValues = [];
    userData;
    userError;
    user;
    userName;
    urlCapa = basePath +'/assessments/capas';
    iconName ='utility:edit';
    iconDeleteName ='utility:delete';
    objectApiName='Capa__c';
    
handleMenuDropdown(event) {
    let targetId = event.currentTarget.dataset.targetId;       
    let target = this.template.querySelector(`[data-id="${targetId}"]`); 
    console.log('target ', target);      
    target.classList.remove('slds-hide');
    target.classList.add('slds-show');
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
/*
@wire(getUserDetails)
wiredCapaUser(userData) {
    this.userData = userData;
    const { data, error } = userData;
    console.log('Audit Activities users: '+  JSON.stringify(userData));
    if (data) {       
        this.user = data;
        this.userProfilePicsUrl = data[0]['SmallPhotoUrl'];
        this.userName = data[0]['Name'];
    } else if (error) {
       this.userError = error;
    }
}*/
    
    @wire(getOrgCapas)
    cons(result) {
        refreshApex(result);       
        if(result.data){
            this.data = result.data;
            //console.log('data CAPA', this.data);
            let resp  = JSON.parse(JSON.stringify(result.data));         
            resp.forEach(item => {
            item['editUrl'] = '/capa/' + item['Id'];
            item['menuId'] = 'menu-' + item['Id'];
            item['unitClass'] = item['CapaWorkflowStatus__c'].replace(/\s/g, '').toLowerCase() +' card-box';
            if(item['AssignedTo__c']) {
                let userFirstName = (item.AssignedTo__r.FirstName != null && item.AssignedTo__r.FirstName != undefined) ?  item.AssignedTo__r.FirstName : ' ';
                let userLastName = (item.AssignedTo__r.LastName != null && item.AssignedTo__r.LastName != undefined) ? item.AssignedTo__r.LastName : ' ';
                item['assignToUser'] = userFirstName + ' ' + userLastName;
                item['assignSmallPhotoUrl'] = item.AssignedTo__r.SmallPhotoUrl;
                item['noAssegnedUser'] = true;
            } else {
                item['noAssegnedUser'] = false;
            }
        });
            this.data  = resp;
           
        }
        if (result.error) {
            this.data = undefined;
        }
    };
}