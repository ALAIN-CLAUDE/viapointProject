import { LightningElement, api, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { getRecord } from 'lightning/uiRecordApi';
import { getRelatedListsInfo } from 'lightning/uiRelatedListApi';
import { getRelatedListInfo } from 'lightning/uiRelatedListApi';
import AUDIT_OBJECT from '@salesforce/schema/Audit__c';
import AUDIT_ACTIVITY_OBJECT from '@salesforce/schema/AuditActivity__c';

export default class RelatedRecordCardValue extends NavigationMixin(LightningElement) {
        @api objectApiName;
        @api recordId;
        @api actionName = 'edit';
        @api recordNumber;
        activeSections = ['A'];
        error;
        relatedLists;
        relatedAuditActivitiesLists;
        displayProductsColumns;
    
        navigateToRecordList() {
            this[NavigationMixin.Navigate]({
                type: 'standard__objectPage',
                attributes: {
                    objectApiName: this.objectApiName,
                    actionName: 'audits'
                }
            });
        }
    
       
        @wire(getRelatedListsInfo, {
            parentObjectApiName: AUDIT_OBJECT.objectApiName,
            recordTypeId: '012000000000000AAA' //optional
        })listInfo({ error, data }) {
            if (data) {
                console.log('getRelatedListsInfo', JSON.stringify(data));
                this.relatedLists = data.relatedLists;
                this.error = undefined;
            } else if (error) {
                this.error = error;
                this.relatedLists = undefined;
            }
        }
}