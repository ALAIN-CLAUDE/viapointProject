import { LightningElement, api, wire, track } from 'lwc';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';


export default class CpObjectHeader extends LightningElement {
    @api objectApiName;
    @api recordId;
    @api recordNumber;
    @api actionName = 'edit';
    @api plural;
    recordTypeIdInfo;
    @track objectInfo;
    @track objectRecord;
    

    @wire(getObjectInfo, { objectApiName: '$objectApiName' })
    getObjectInfo({ data, error }) {
        if (error) {
            this.error = error.body || error;
        } else if (data) {
            this.objectInfo = data;
        }
    }

    get label() {
        return this.objectInfo && (this.plural ? this.objectInfo.labelPlural : this.objectInfo.label);
    }
    
    get objectApi() {
        return this.objectApiName;
    }
    get recordIdValue() {
        return this.recordId;
    }
    get title() {
        return this.objectInfo && (this.plural ? this.objectInfo.labelPlural : this.objectInfo.label);
    }

    get iconStyle() {
        return `background-color: #${this.objectInfo.themeInfo.color}`;
    }
    get newCaseButtons() {
        return (this.objectApiName === 'Location__c') ? true : false;
    }
    get contactButtons() {
        return (this.objectApiName === 'Contact') ? true : false;
    }
}