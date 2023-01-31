import { LightningElement, api, wire, track } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import basePath from "@salesforce/community/basePath";

import AUDIT_ID_FIELD from '@salesforce/schema/AuditActivityResource__c.Audit__c';
import AUDIT_ACTIVITY_ID_FIELD from '@salesforce/schema/AuditActivityResource__c.AuditActivity__c';
import AUDIT__RESOURCE_ID_FIELD from '@salesforce/schema/AuditActivityResource__c.AuditResource__c';
import AUDIT_TITLE_FIELD from '@salesforce/schema/AuditActivityResource__c.AuditTitle__c';
import AUDIT_NUMBER_FIELD from '@salesforce/schema/AuditActivityResource__c.AuditNumber__c';
import AUDIT_ACTIVITY_NUMBER_FIELD from '@salesforce/schema/AuditActivityResource__c.AuditActivity__r.Name';
import AUDIT_ACTIVITY_TITLE_FIELD from '@salesforce/schema/AuditActivityResource__c.AuditActivityTitle__c';

import AUDIT_RESOURCE_NUMBER_FIELD from '@salesforce/schema/AuditActivityResource__c.Name';
import AUDIT_RESOURCE_TITLE_FIELD from '@salesforce/schema/AuditActivityResource__c.ResourceTitle__c';
import AUDIT_ACTIVITY_RESOURCE_NUMBER_FIELD from '@salesforce/schema/AuditActivityResource__c.AuditResource__r.Name';
import AUDIT_REQUEST_ALLOCATION_METHOD_FIELD from '@salesforce/schema/AuditActivityResource__c.RequestAllocationMethod__c';
import AUDIT_REQUEST_ALLOCATION_UNITS_FIELD from '@salesforce/schema/AuditActivityResource__c.RequestAllocationUnits__c';
import AUDIT_REQUEST_ALLOCATION_FTE_FIELD from '@salesforce/schema/AuditActivityResource__c.RequestAllocationFte__c';
import AUDIT_REQUEST_ALLOCATION_HOURS_FIELD from '@salesforce/schema/AuditActivityResource__c.RequestAllocationHours__c';
import AUDIT_REQUEST_DESCRIPTION_FIELD from '@salesforce/schema/AuditActivityResource__c.RequestDescription__c';
import AUDIT_ACTIVITY_STATUS_FIELD from '@salesforce/schema/AuditActivityResource__c.ActivityResourceWorkflowStatus__c';

import AUDIT_CREATEDBY_NAME_FIELD from '@salesforce/schema/AuditActivityResource__c.CreatedBy.Name';
import AUDIT_CREATED_DATE_FIELD from '@salesforce/schema/AuditActivityResource__c.CreatedDate';
import AUDIT_LAST_MODIFIED_FIELD from '@salesforce/schema/AuditActivityResource__c.LastModifiedBy.Name';
import AUDIT_LAST_MODIFIED_DATE_FIELD from '@salesforce/schema/AuditActivityResource__c.LastModifiedDate';


const fields = [
    AUDIT_ID_FIELD,
    AUDIT_ACTIVITY_ID_FIELD,
    AUDIT__RESOURCE_ID_FIELD,
    AUDIT_NUMBER_FIELD, 
    AUDIT_TITLE_FIELD, 
    AUDIT_ACTIVITY_NUMBER_FIELD, 
    AUDIT_ACTIVITY_TITLE_FIELD, 
    AUDIT_RESOURCE_NUMBER_FIELD,
    AUDIT_RESOURCE_TITLE_FIELD,
    AUDIT_ACTIVITY_RESOURCE_NUMBER_FIELD,
    AUDIT_REQUEST_ALLOCATION_METHOD_FIELD,
    AUDIT_REQUEST_ALLOCATION_UNITS_FIELD,
    AUDIT_REQUEST_ALLOCATION_FTE_FIELD,
    AUDIT_REQUEST_ALLOCATION_HOURS_FIELD,
    AUDIT_REQUEST_DESCRIPTION_FIELD,
    AUDIT_ACTIVITY_STATUS_FIELD,
    AUDIT_CREATEDBY_NAME_FIELD,
    AUDIT_CREATED_DATE_FIELD,
    AUDIT_LAST_MODIFIED_FIELD,
    AUDIT_LAST_MODIFIED_DATE_FIELD
];

export default class AccordionFormAuditActiveResource extends LightningElement {
    @api objectApiName;
    @api recordId;
    @api actionName = 'edit';
    @track auditActivityResource;
    //activeSections = ['A'];

    @wire(getRecord, { recordId: '$recordId', fields })
    auditActivityResource;

    get auditNumberURL() {
        let auditIdValue =  String(getFieldValue(this.auditActivityResource.data, AUDIT_ID_FIELD));       
        console.log('AUDIT_ID_FIELD ', auditIdValue);      
        let linkToAudit = basePath + '/audit/'+ auditIdValue;
        return linkToAudit;
    }
    
    get auditActivityNumberURL() {
        let auditIdValue =  String(getFieldValue(this.auditActivityResource.data, AUDIT_ACTIVITY_ID_FIELD));       
        console.log('AUDIT_ACTIVITY_ID_FIELD ', auditIdValue);      
        let linkToAuditActivity = basePath + '/auditactivity/'+ auditIdValue;
        return linkToAuditActivity;
    }
    get auditResourceNumberURL() {
        let auditIdValue =  String(getFieldValue(this.auditActivityResource.data, AUDIT__RESOURCE_ID_FIELD));       
        console.log('AUDIT_ACTIVITY_ID_FIELD ', auditIdValue);      
        let linkToAuditResource = basePath + '/auditresource/'+ auditIdValue;
        return linkToAuditResource;
    }
    
    get auditNumber() {
        let auditIdValue =  String(getFieldValue(this.auditActivityResource.data, AUDIT_ID_FIELD)); 
        let auditNumberValue =  String(getFieldValue(this.auditActivityResource.data, AUDIT_NUMBER_FIELD));             
        auditNumberValue = auditNumberValue.replace(/( |<([^>]+)>)/ig, '');
        auditNumberValue= auditNumberValue.replace(' &gt; ', ' > ');
        let linkToAudit = 'basePath' + '/audit/'+ auditNumberValue;
        return auditNumberValue;
    }
    get auditTitle() {
        console.log('auditTitle ', getFieldValue(this.auditActivityResource.data, AUDIT_TITLE_FIELD));
        let titleName =  String(getFieldValue(this.auditActivityResource.data, AUDIT_TITLE_FIELD));
        console.log('this.AUDIT_TITLE_FIELD.TYPE ', typeof titleName);     
        titleName = titleName.replace(/( |<([^>]+)>)/ig, '');
        titleName = titleName.replace(/&gt;/g, ' > '); 
        titleName = titleName.replace(/&amp;/g, ' & ');
        //let tb = encodeURI(titleName);     
        let linkToauditTitle = 'basePath' + '/audit/'+ titleName;
        return titleName;
    }

    get auditActivityNumber() {
        return getFieldValue(this.auditActivityResource.data, AUDIT_ACTIVITY_NUMBER_FIELD);
    }
    get auditActivityTitle() {
        let titleName =  String(getFieldValue(this.auditActivityResource.data, AUDIT_ACTIVITY_TITLE_FIELD));    
        titleName = titleName.replace(/<.*?>/ig, '');
        return this.htmlDecode(titleName);
    }
    get resourceNumber() {
        return getFieldValue(this.auditActivityResource.data, AUDIT_RESOURCE_NUMBER_FIELD);
    }

    get auditResourceTitle() {
        let titleName =  String(getFieldValue(this.auditActivityResource.data, AUDIT_RESOURCE_TITLE_FIELD));   
        titleName = titleName.replace(/<.*?>/ig, '');
        return this.htmlDecode(titleName);
    }

    get activityResourceNumber() {
        return getFieldValue(this.auditActivityResource.data, AUDIT_ACTIVITY_RESOURCE_NUMBER_FIELD);
    }

    get requestAllocationMethod() {
        return getFieldValue(this.auditActivityResource.data, AUDIT_REQUEST_ALLOCATION_METHOD_FIELD);
    }
    get requestAllocationUnits() {
        return getFieldValue(this.auditActivityResource.data, AUDIT_REQUEST_ALLOCATION_UNITS_FIELD);
    }
    get requestAllocationFTE() {
        return getFieldValue(this.auditActivityResource.data, AUDIT_REQUEST_ALLOCATION_FTE_FIELD);
    }
    get requestAllocationHours() {
        return getFieldValue(this.auditActivityResource.data, AUDIT_REQUEST_ALLOCATION_HOURS_FIELD);
    }
    get requestDescription() {
        return getFieldValue(this.auditActivityResource.data, AUDIT_REQUEST_DESCRIPTION_FIELD);
    }
    get auditActivityStatus() {
        return getFieldValue(this.auditActivityResource.data, AUDIT_ACTIVITY_STATUS_FIELD);
    }

    get auditCreatedByName() {
        let name = getFieldValue(this.auditActivityResource.data, AUDIT_CREATEDBY_NAME_FIELD);
        return name +', ';
    }
    get auditCreatedDate() {
        return getFieldValue(this.auditActivityResource.data, AUDIT_CREATED_DATE_FIELD);
    }
    get auditModifiedByName() {
        let name = getFieldValue(this.auditActivityResource.data, AUDIT_LAST_MODIFIED_FIELD);
        return name +', ';
    }
    get auditModifiedDate() {  
        return getFieldValue(this.auditActivityResource.data, AUDIT_LAST_MODIFIED_DATE_FIELD);
    }

    htmlDecode(value) {
        var elem = document.createElement('textarea');
        elem.innerHTML = value;
        var decoded = elem.value;
        return decoded;
    }
}