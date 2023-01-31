import { LightningElement, api, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { getRecord } from 'lightning/uiRecordApi';
import { getRelatedListsInfo } from 'lightning/uiRelatedListApi';
import { getRelatedListInfo } from 'lightning/uiRelatedListApi';
import AUDIT_OBJECT from '@salesforce/schema/Audit__c';
import AUDIT_ACTIVITY_OBJECT from '@salesforce/schema/AuditActivity__c';

export default class RecordDetailAudutActivity extends NavigationMixin(LightningElement) {
    @api objectApiName;
    @api recordId;
    @api actionName = 'edit';
    @api recordNumber;
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

}