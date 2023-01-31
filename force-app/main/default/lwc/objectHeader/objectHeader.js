import { LightningElement, api, wire, track } from 'lwc';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import CASE_NUMBER from '@salesforce/schema/Case.CaseNumber';

export default class ObjectHeader extends LightningElement {
    @api objectApiName;
    @api recordId;
    caseData;
    @track objectInfo;

    @wire(getObjectInfo, { objectApiName: '$objectApiName' })
    getObjectInfo({ data, error }) {
        
        if (error) {
            this.error = error.body || error;
        } else if (data) {
            this.objectInfo = data;
        }
    }
    @wire(getRecord, { recordId: '$recordId', fields: CASE_NUMBER })
    caseData;

    get recordName() {
        console.log('this.caseData.data', this.caseData.data);
        return getFieldValue(this.caseData.data, CASE_NUMBER);
    }
    get label() {
        console.log('recordId ', this.recordId);
        return this.objectInfo && (this.plural ? this.objectInfo.labelPlural : this.objectInfo.label);
    }
    get objectApi() {
        console.log('recordId ', this.objectApiName);
        return this.objectApiName;
    }
    get recordIdValue() {
        console.log('recordId ', this.recordId);
        return this.recordId;
    }

    get iconStyle() {
        return `background-color: #${this.objectInfo.themeInfo.color}`;
    }
}