import { LightningElement, api, wire, track } from 'lwc';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import AUDIT_ACTIVITY_TITLE from '@salesforce/schema/AuditActivityResource__c.AuditActivityTitle__c';
import AUDIT_ACTIVITY_NAME from '@salesforce/schema/AuditActivityResource__c.Name';
import AUDIT_ACTIVITY_STATUS from '@salesforce/schema/AuditActivityResource__c.ActivityResourceWorkflowStatus__c';
const fields = [
    AUDIT_ACTIVITY_TITLE,
    AUDIT_ACTIVITY_NAME,
    AUDIT_ACTIVITY_STATUS
];

export default class CpProgressBarAAR extends LightningElement {
    @api objectApiName;
    @api recordId;
    @api recordNumber;
    @api actionName = 'edit';
    @api plural
    recordTypeIdInfo;
    @track objectInfo;
    @track auditAAR;
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
    auditAAR;

    @wire(getPicklistValues, { recordTypeId: '012000000000000AAA', fieldApiName: AUDIT_ACTIVITY_STATUS })
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
        return getFieldValue(this.auditAAR.data, AUDIT_ACTIVITY_TITLE);
    }

    get auditName() {
        return getFieldValue(this.auditAAR.data, AUDIT_ACTIVITY_NAME);
    }

    get auditKeyStatus() {
        return getFieldValue(this.auditAAR.data, AUDIT_ACTIVITY_STATUS);
    }
}