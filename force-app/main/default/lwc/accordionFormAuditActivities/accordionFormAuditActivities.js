import { LightningElement, api, wire, track } from 'lwc';
import {getRecord, getFieldValue} from 'lightning/uiRecordApi';
import basePath from "@salesforce/community/basePath";

import AUDIT_ID_FIELD from '@salesforce/schema/AuditActivity__c.Audit__c';
import AUDIT_TITLE_FIELD from '@salesforce/schema/AuditActivity__c.AuditTitle__c';
import AUDIT_NUMBER_FIELD from '@salesforce/schema/AuditActivity__c.AuditNumber__c';
import AUDIT_ACTIVITY_NUMBER_FIELD from '@salesforce/schema/AuditActivity__c.Name';
import AUDIT_ACTIVITY_TITLE_FIELD from '@salesforce/schema/AuditActivity__c.AuditActivityTitle__c';
import AUDIT_ACTIVITY_ASSIGN_TO_FIELD from '@salesforce/schema/AuditActivity__c.AssignedTo__r.Name';
import AUDIT_ACTIVITY_PLANNED_START_FIELD from '@salesforce/schema/AuditActivity__c.PlannedStart__c';
import AUDIT_ACTIVITY_PLANNED_FINISH_FIELD from '@salesforce/schema/AuditActivity__c.PlannedFinish__c';
import AUDIT_ACTIVITY_TECH_TYPE_FIELD from '@salesforce/schema/AuditActivity__c.AuditActivityTechnologyType__c';
import AUDIT_ACTIVITY_TYPE_FIELD from '@salesforce/schema/AuditActivity__c.AuditActivityType__c';
import AUDIT_ACTIVITY_PRIORITY_FIELD from '@salesforce/schema/AuditActivity__c.Priority__c';
import AUDIT_ACTIVITY_DESCRIPTION_FIELD from '@salesforce/schema/AuditActivity__c.AuditActivityDescription__c';
import AUDIT_ACTIVITY_STATUS_FIELD from '@salesforce/schema/AuditActivity__c.AuditActivityWorkflowStatus__c';

import AUDIT_CREATEDBY_NAME_FIELD from '@salesforce/schema/AuditActivity__c.CreatedBy.Name';
import AUDIT_CREATED_DATE_FIELD from '@salesforce/schema/AuditActivity__c.CreatedDate';
import AUDIT_LAST_MODIFIED_FIELD from '@salesforce/schema/AuditActivity__c.LastModifiedBy.Name';
import AUDIT_LAST_MODIFIED_DATE_FIELD from '@salesforce/schema/AuditActivity__c.LastModifiedDate';


const fields = [
    AUDIT_ID_FIELD,
    AUDIT_NUMBER_FIELD, 
    AUDIT_TITLE_FIELD, 
    AUDIT_ACTIVITY_NUMBER_FIELD, 
    AUDIT_ACTIVITY_TITLE_FIELD, 
    AUDIT_ACTIVITY_ASSIGN_TO_FIELD,
    AUDIT_ACTIVITY_PLANNED_START_FIELD,
    AUDIT_ACTIVITY_PLANNED_FINISH_FIELD,
    AUDIT_ACTIVITY_TECH_TYPE_FIELD,
    AUDIT_ACTIVITY_TYPE_FIELD,
    AUDIT_ACTIVITY_PRIORITY_FIELD,
    AUDIT_ACTIVITY_DESCRIPTION_FIELD,
    AUDIT_ACTIVITY_STATUS_FIELD,
    AUDIT_CREATEDBY_NAME_FIELD,
    AUDIT_CREATED_DATE_FIELD,
    AUDIT_LAST_MODIFIED_FIELD,
    AUDIT_LAST_MODIFIED_DATE_FIELD
];

export default class AccordionFormAuditActivities extends LightningElement {
    @api objectApiName;
    @api recordId;
    @api actionName = 'edit';
    @track auditActivity;
    //activeSections = ['A'];

    @wire(getRecord, { recordId: '$recordId', fields })
    auditActivity;
   

    get auditNumber() {
        let auditNumberValue =  String(getFieldValue(this.auditActivity.data, AUDIT_NUMBER_FIELD));         
        auditNumberValue = auditNumberValue.replace(/<.*?>/ig, ''); 
        return this.htmlDecode(auditNumberValue);
    }
    
    get linkToAudit() {
        let auditId =  String(getFieldValue(this.auditActivity.data, AUDIT_ID_FIELD));     
        let linkToAudit = basePath + '/audit/'+ auditId;
        return linkToAudit;
    }

    get auditTitle() {
        let titleName =  String(getFieldValue(this.auditActivity.data, AUDIT_TITLE_FIELD));   
        titleName = titleName.replace(/<.*?>/ig, '');
        return this.htmlDecode(titleName);
    }
    
    get auditActivityNumber() {
        return getFieldValue(this.auditActivity.data, AUDIT_ACTIVITY_NUMBER_FIELD);
    }
    get auditActivityTitle() {       
        let titleName =  String(getFieldValue(this.auditActivity.data, AUDIT_ACTIVITY_TITLE_FIELD));   
        titleName = titleName.replace(/<.*?>/ig, '');
        return this.htmlDecode(titleName);
    }
    
    get auditActivityAssignTo() {
        return getFieldValue(this.auditActivity.data, AUDIT_ACTIVITY_ASSIGN_TO_FIELD);
    }
    get auditActivityPlannedStart() {
        return getFieldValue(this.auditActivity.data, AUDIT_ACTIVITY_PLANNED_START_FIELD);
    }
    get auditActivityPlannedFinish() {
        return getFieldValue(this.auditActivity.data, AUDIT_ACTIVITY_PLANNED_FINISH_FIELD);
    }
    get auditActivityTechType() {
        return getFieldValue(this.auditActivity.data, AUDIT_ACTIVITY_TECH_TYPE_FIELD);
    }
    get auditActivityType() {
        return getFieldValue(this.auditActivity.data, AUDIT_ACTIVITY_TYPE_FIELD);
    }
    get auditActivityPriority() {
        return getFieldValue(this.auditActivity.data, AUDIT_ACTIVITY_PRIORITY_FIELD);
    }
    get auditActivityDescription() {
        return getFieldValue(this.auditActivity.data, AUDIT_ACTIVITY_DESCRIPTION_FIELD);
    }
    get auditActivityStatus() {
        return getFieldValue(this.auditActivity.data, AUDIT_ACTIVITY_STATUS_FIELD);
    }
    get auditCreatedByName() {
        let name = getFieldValue(this.auditActivity.data, AUDIT_CREATEDBY_NAME_FIELD);
        return name +', ';
    }
    get auditCreatedDate() {
        return getFieldValue(this.auditActivity.data, AUDIT_CREATED_DATE_FIELD);
    }
    get auditModifiedByName() {
        let name = getFieldValue(this.auditActivity.data, AUDIT_LAST_MODIFIED_FIELD);
        return name +', ';
    }
    get auditModifiedDate() {  
        return getFieldValue(this.auditActivity.data, AUDIT_LAST_MODIFIED_DATE_FIELD);
    }

    htmlDecode(value) {
        var elem = document.createElement('textarea');
        elem.innerHTML = value;
        var decoded = elem.value;
        return decoded;
    }

}