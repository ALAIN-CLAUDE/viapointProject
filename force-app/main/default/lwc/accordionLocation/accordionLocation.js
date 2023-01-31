import { LightningElement, api, wire, track } from 'lwc';
import {getRecord, getFieldValue} from 'lightning/uiRecordApi';
import basePath from "@salesforce/community/basePath";

import ACCOUNT_ID_FIELD from '@salesforce/schema/Location__c.Account__c';
import ACCOUNT_FIELD from '@salesforce/schema/Location__c.Account__r.Name';
import LOCATION_NAME_FIELD from '@salesforce/schema/Location__c.Name';
import LOCATION_TYPE_FIELD from '@salesforce/schema/Location__c.LocationType__c';
import TIME_ZONE_FIELD from '@salesforce/schema/Location__c.TimeZone__c';

import CREATEDBY_NAME_FIELD from '@salesforce/schema/Location__c.CreatedBy.Name';
import CREATED_DATE_FIELD from '@salesforce/schema/Location__c.CreatedDate';
import LAST_MODIFIED_FIELD from '@salesforce/schema/Location__c.LastModifiedBy.Name';
import LAST_MODIFIED_DATE_FIELD from '@salesforce/schema/Location__c.LastModifiedDate';

const fields = [
    ACCOUNT_FIELD,
    ACCOUNT_ID_FIELD,
    LOCATION_NAME_FIELD,
    LOCATION_TYPE_FIELD,
    TIME_ZONE_FIELD,
    CREATEDBY_NAME_FIELD,
    CREATED_DATE_FIELD,
    LAST_MODIFIED_FIELD,
    LAST_MODIFIED_DATE_FIELD

];


export default class AccordionLocation extends LightningElement {
    @api objectApiName;
    @api recordId;
    @api actionName = 'edit';

    @wire(getRecord, { recordId: '$recordId', fields })
    location;
   
    get accountId() {
        let account = getFieldValue(this.location.data, ACCOUNT_ID_FIELD);
        let linkToAccount = basePath + '/account/'+ account;
        return linkToAccount;

    }

    get account() {
        let account = String(getFieldValue(this.location.data, ACCOUNT_FIELD));
       
        return account;
    }

    get locationName() {
        let location = String(getFieldValue(this.location.data, LOCATION_NAME_FIELD));  
        //auditNumberValue = auditNumberValue.replace(/<.*?>/ig, '');
        //return this.htmlDecode(auditNumberValue);
        return location;
    }

    get locationType() {
        let type =  String(getFieldValue(this.location.data, LOCATION_TYPE_FIELD));   
        //titleName = titleName.replace(/<.*?>/ig, '');
        return type;
    }
    get timeZone() {
        let timeZone =  String(getFieldValue(this.location.data, TIME_ZONE_FIELD));   
        //titleName = titleName.replace(/<.*?>/ig, '');
        return timeZone;
    }
    get auditCreatedByName() {
        let name = getFieldValue(this.location.data, CREATEDBY_NAME_FIELD);
        return name +', ';
    }
    get auditCreatedDate() {
        return getFieldValue(this.location.data, CREATED_DATE_FIELD);
    }
    get auditModifiedByName() {
        let name = getFieldValue(this.location.data, LAST_MODIFIED_FIELD);
        return name +', ';
    }
    get auditModifiedDate() {  
        return getFieldValue(this.location.data, LAST_MODIFIED_DATE_FIELD);
    }
}