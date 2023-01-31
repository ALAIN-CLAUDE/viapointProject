import { LightningElement, track, wire, api } from 'lwc';
import getOrgsPeople from '@salesforce/apex/cpCardKeyPeople.getOrgsPeople';
import { refreshApex } from "@salesforce/apex";
import basePath from "@salesforce/community/basePath";

export default class CpCardKeyPeople extends LightningElement {
    @track peopObj;
    urlKeyPeople = basePath +'/organization/people';
    objectApiName = 'Contact';

    @wire(getOrgsPeople)
    cons(result) {
        refreshApex(result);
        this.refreshTable = result;
        if (result.data) {
            this.peopObj = result.data;
            let resp  = JSON.parse(JSON.stringify(result.data));                    
            resp.forEach(item => {
               
                console.log('keyPeople ', item['IsActive']);
                item['status'] = item['IsActive'] ? 'Active' : 'Inactive';
                item['contactUrl'] = '/contact/' + item['ContactId'];
                item['unitClass'] = item['IsActive'] ? 'card-box active':'card-box inactive';
                item['menuId'] = 'menuId'+ item['Id'];
            });
            this.peopObj = resp;
            console.log('keyPeople ', JSON.parse(JSON.stringify(this.peopObj)));
        }
        if (result.error) {
            this.peopObj = undefined;
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