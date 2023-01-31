import { LightningElement, api, wire, track } from 'lwc';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';

import CAPA_TITLE_TITLE from '@salesforce/schema/Capa__c.CapaTitle__c';
import CAPA_NAME from '@salesforce/schema/Capa__c.Name';
import CAPA_STATUS from '@salesforce/schema/Capa__c.CapaWorkflowStatus__c';
const fields = [
    CAPA_TITLE_TITLE,
    CAPA_NAME,
    CAPA_STATUS
];


export default class CpProgressBarCapa extends LightningElement {
    @api objectApiName;
    @api recordId;
    @api recordNumber;
    recordTypeIdInfo;
    @track objectInfo;
    @track auditActivity;
    @track auditWorkflowStatus;

    @wire(getObjectInfo, { objectApiName: '$objectApiName' })
    getObjectInfo({ data, error }) {
        if (error) {
            this.error = error.body || error;
        } else if (data) {
            this.objectInfo = data;
        }
    }

    @wire(getRecord, { recordId: '$recordId', fields: fields })
    capa;

    @wire(getPicklistValues, { recordTypeId: '012000000000000AAA', fieldApiName: CAPA_STATUS })
    wiredValues({ error, data }) {
        if (data) {
            console.log('data ', data);
            this.auditWorkflowStatus = data.values;
            this.error = undefined;
            console.log('data ', this.auditWorkflowStatus);
        } else {
            this.error = error;
            this.auditWorkflowStatus = undefined;
        }
    }

    get auditTitle() {
        return getFieldValue(this.capa.data, CAPA_TITLE_TITLE);
    }

    get auditName() {
        return getFieldValue(this.capa.data, CAPA_NAME);
    }
    
    get auditKeyStatus() {
        return getFieldValue(this.capa.data, CAPA_STATUS);
    }
}