import { LightningElement, api, wire, track } from 'lwc';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import AUDIT_TITLE from '@salesforce/schema/Audit__c.AuditTitle__c';
import AUDIT_NAME from '@salesforce/schema/Audit__c.Name';
import AUDIT_STATUS from '@salesforce/schema/Audit__c.AuditWorkflowStatus__c';

import AUDIT_ACTIVITY_TITLE from '@salesforce/schema/AuditActivity__c.AuditActivityTitle__c';
import AUDIT_ACTIVITY_NAME from '@salesforce/schema/AuditActivity__c.Name';
import AUDIT_ACTIVITY_STATUS from '@salesforce/schema/AuditActivity__c.AuditActivityWorkflowStatus__c';
const fieldsAA = [
    AUDIT_ACTIVITY_TITLE,
    AUDIT_ACTIVITY_NAME,
    AUDIT_ACTIVITY_STATUS
];
const fields = [AUDIT_TITLE, AUDIT_NAME, AUDIT_STATUS];

export default class CpProgressIindicator extends LightningElement {
    @api objectApiName;
    @api recordId;
    @api recordNumber;
    @api actionName = 'edit';
    @api plural
    recordTypeIdInfo;
    @track objectInfo;
    @track audit;
    @track auditWorkflowStatus;

    @wire(getObjectInfo, { objectApiName: '$objectApiName' })
    getObjectInfo({ data, error }) {
        if (error) {
            this.error = error.body || error;
        } else if (data) {
            this.objectInfo = data;
            console.log('this.objectInfo', JSON.stringify(this.objectInfo));
        }
    }

    @wire(getRecord, { recordId: '$recordId', fields: fields })
    audit;

    @wire(getRecord, { recordId: '$recordId', fields: fieldsAA })
    auditActivity;

    @wire(getPicklistValues, { recordTypeId: '012000000000000AAA', fieldApiName: AUDIT_STATUS })
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
        return getFieldValue(this.audit.data, AUDIT_TITLE);
    }

    get auditName() {
        return getFieldValue(this.audit.data, AUDIT_NAME);
    }

    get auditKeyStatus() {
        return getFieldValue(this.audit.data, AUDIT_STATUS);
    }

   /* get label() {
        return this.objectInfo && (this.plural ? this.objectInfo.labelPlural : this.objectInfo.label);
    }

    get title() {
        return this.objectInfo && (this.plural ? this.objectInfo.labelPlural : this.objectInfo.label);
    }

    get iconStyle() {
        return `background-color: #${this.objectInfo.themeInfo.color}`;
    }*/
}