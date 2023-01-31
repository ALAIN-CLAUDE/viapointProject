import { LightningElement, wire, track, api } from 'lwc';
import getOrgLocations from '@salesforce/apex/cpCardLocationController.getOrgLocations';
import basePath from "@salesforce/community/basePath";
import { refreshApex } from "@salesforce/apex";
import { getRecord } from 'lightning/uiRecordApi';
import userId from '@salesforce/user/Id';
import userAccount from '@salesforce/schema/User.DefaultAccount__c';

export default class CpCardLocation extends LightningElement {
    @track locationData;
    @api user = userId;
    @api userAccountInfo = userAccount;
    objectApiName = 'Location__c';
    data;
    orgnisations;
    showOrgSelection = false;
    isAdmin = false;
    pageReference;
    pageReferenceRefresh;
    wiredAccountResults;
    selectedOrg;    
    userData;
    urlLocations = basePath +'/organization/locations';
    
    @wire(getRecord, { recordId: '$user', userAccount })
    userData;

    @wire(getOrgLocations)
    wireLocation(result) {
        refreshApex(result);
        if (result.data) {
            this.locationData = result.data;
            let resp  = JSON.parse(JSON.stringify(result.data));
            resp.forEach(item => {
                item['locationUrl'] = '/location/' +item['Id'];
                item['unitClass'] = 'card-box open';
                item['menuId'] = 'menuId'+item['Id'];
            });
            this.locationData = resp;
        }
        if (result.error) {
            this.locationData = undefined;
        }
    };

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
}