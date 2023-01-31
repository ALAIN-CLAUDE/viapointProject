import { LightningElement, api, wire, track } from 'lwc';
import {getRecord, getFieldValue} from 'lightning/uiRecordApi';
import basePath from "@salesforce/community/basePath";

import CASE_ACCOUNT_FIELD from '@salesforce/schema/Case.Account.Name';
import CASE_ACCOUNT_ID_FIELD from '@salesforce/schema/Case.AccountId';
import CASE_CONTACT_FIELD from '@salesforce/schema/Case.Contact.Name';
import CONTACT_ID_FIELD from '@salesforce/schema/Case.ContactId';
import CASE_CONTACT_EMAIL_FIELD from '@salesforce/schema/Case.ContactEmail';
import CASE_CONTACT_PHONE_FIELD from '@salesforce/schema/Case.ContactPhone';
import CASE_NAME_FIELD from '@salesforce/schema/Case.CaseNumber';
import STATUS_FIELD from '@salesforce/schema/Case.Status';
import PROPRITY_FIELD from '@salesforce/schema/Case.Priority';
import SUBJECT_FIELD from '@salesforce/schema/Case.Subject';
import DESCRIPTION_FIELD from '@salesforce/schema/Case.Description';
import CONTACT_TITLE_FIELD from '@salesforce/schema/Case.Contact.Title';
import CREATEDBY_NAME_FIELD from '@salesforce/schema/Case.CreatedBy.Name';
import CREATED_DATE_FIELD from '@salesforce/schema/Case.CreatedDate';
import LAST_MODIFIED_FIELD from '@salesforce/schema/Case.LastModifiedBy.Name';
import LAST_MODIFIED_DATE_FIELD from '@salesforce/schema/Case.LastModifiedDate';

const fields = [
    CASE_ACCOUNT_FIELD,
    CASE_ACCOUNT_ID_FIELD,
    CASE_CONTACT_FIELD,
    CONTACT_ID_FIELD,
    CASE_NAME_FIELD,
    CASE_CONTACT_EMAIL_FIELD,
    CASE_CONTACT_PHONE_FIELD,
    STATUS_FIELD,
    PROPRITY_FIELD,
    SUBJECT_FIELD,
    DESCRIPTION_FIELD,
    CREATEDBY_NAME_FIELD,
    CREATED_DATE_FIELD,
    LAST_MODIFIED_FIELD,
    LAST_MODIFIED_DATE_FIELD

];

export default class AccordionTicket extends LightningElement {
    @api objectApiName;
    @api recordId;
    @api actionName = 'edit';

    @wire(getRecord, { recordId: '$recordId', fields:
    [   'Case.Owner.Name',
        CASE_ACCOUNT_FIELD,
        CASE_ACCOUNT_ID_FIELD,
        CASE_CONTACT_FIELD,
        CONTACT_ID_FIELD,
        CASE_NAME_FIELD,
        CASE_CONTACT_EMAIL_FIELD,
        CASE_CONTACT_PHONE_FIELD,
        CONTACT_TITLE_FIELD,
        STATUS_FIELD,
        PROPRITY_FIELD,
        SUBJECT_FIELD,
        DESCRIPTION_FIELD,
        CREATEDBY_NAME_FIELD,
        CREATED_DATE_FIELD,
        LAST_MODIFIED_FIELD,
        LAST_MODIFIED_DATE_FIELD
    
    ] })
    caseData;
   
    get caseNumber() {
      return getFieldValue(this.caseData.data, CASE_NAME_FIELD);
        //let linkToAccount = basePath + '/account/'+ account;
       // return linkToAccount;

    }
    get caseOwner() {
        return getFieldValue(this.caseData.data, 'Case.Owner.Name');
    }
    get contactLinkName(){
        let contactId = getFieldValue(this.caseData.data, CONTACT_ID_FIELD);
        let linkToContact = basePath +'/contact/' + contactId;
        return linkToContact;
    }
    get contactName() {
        let account = String(getFieldValue(this.caseData.data, CASE_CONTACT_FIELD));
       
        return account;
    }
    get contacTitle() {
        console.log('aaaa ', this.caseData.data);
        return getFieldValue(this.caseData.data, CONTACT_TITLE_FIELD);
    }
    get status() {
        return getFieldValue(this.caseData.data, STATUS_FIELD);
    }
    get priority() {
        return getFieldValue(this.caseData.data, PROPRITY_FIELD);
    }
    get subject() {
        return getFieldValue(this.caseData.data, SUBJECT_FIELD);
    }
    get description() {
        return getFieldValue(this.caseData.data, DESCRIPTION_FIELD);
    }
    get contactEmail() {
        return getFieldValue(this.caseData.data, CASE_CONTACT_EMAIL_FIELD);
    }
    get contactPhone() {
        return getFieldValue(this.caseData.data, CASE_CONTACT_PHONE_FIELD);
    }
    get accountName() {
        return getFieldValue(this.caseData.data, CASE_ACCOUNT_FIELD);
    }
    get accountLinkName() {
        let accountId = getFieldValue(this.caseData.data, CASE_ACCOUNT_ID_FIELD);
        let linkToAccount = basePath +'/account/' + accountId;
        return linkToAccount;
    }
    get auditCreatedByName() {
        let name = getFieldValue(this.caseData.data, CREATEDBY_NAME_FIELD);
        return name +', ';
    }
    get auditCreatedDate() {
        return getFieldValue(this.caseData.data, CREATED_DATE_FIELD);
    }
    get auditModifiedByName() {
        let name = getFieldValue(this.caseData.data, LAST_MODIFIED_FIELD);
        return name +', ';
    }
    get auditModifiedDate() {  
        return getFieldValue(this.caseData.data, LAST_MODIFIED_DATE_FIELD);
    }
}