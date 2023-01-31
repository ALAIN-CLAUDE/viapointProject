import { LightningElement, api, wire, track } from 'lwc';
import {getRecord, getFieldValue} from 'lightning/uiRecordApi';
import basePath from "@salesforce/community/basePath";

import ACCOUNT_ID_FIELD from '@salesforce/schema/Contact.AccountId';
import ACCOUNT_NAME_FIELD from '@salesforce/schema/Contact.Account.Name';
import CONTACT_NAME_FIELD from '@salesforce/schema/Contact.Name';
import TITLE_FIELD from '@salesforce/schema/Contact.Title';
import EMAIL_FIELD from '@salesforce/schema/Contact.Email';
import PHONE_FIELD from '@salesforce/schema/Contact.Phone';
import MOBILEPHONE_FIELD from '@salesforce/schema/Contact.MobilePhone';
import REPORTS_TO_FIELD from '@salesforce/schema/Contact.ReportsTo.Name';
import MAILING_CITY_FIELD from '@salesforce/schema/Contact.MailingCity';
import MAILING_COUNTRY_FIELD from '@salesforce/schema/Contact.MailingCountry';
import MAILING_GEOCODE_FIELD from '@salesforce/schema/Contact.MailingGeocodeAccuracy';
import MAILING_POSTAL_CODE_FIELD from '@salesforce/schema/Contact.MailingPostalCode';
import MAILING_STATE_FIELD from '@salesforce/schema/Contact.MailingState';
import MAILING_STREET_FIELD from '@salesforce/schema/Contact.MailingStreet';

import OTHER_CITY_FIELD from '@salesforce/schema/Contact.OtherCity';
import OTHER_COUNTRY_FIELD from '@salesforce/schema/Contact.OtherCountry';
import OTHER_POSTAL_CODE_FIELD from '@salesforce/schema/Contact.OtherPostalCode';
import OTHER_STATE_FIELD from '@salesforce/schema/Contact.OtherState';
import OTHER_STREET_FIELD from '@salesforce/schema/Contact.OtherStreet';

import OTHER_ADDRESS_FIELD from '@salesforce/schema/Contact.OtherAddress';

import CREATEDBY_NAME_FIELD from '@salesforce/schema/Contact.CreatedBy.Name';
import CREATED_DATE_FIELD from '@salesforce/schema/Contact.CreatedDate';
import LAST_MODIFIED_FIELD from '@salesforce/schema/Contact.LastModifiedBy.Name';
import LAST_MODIFIED_DATE_FIELD from '@salesforce/schema/Contact.LastModifiedDate';

export default class AccordionContact extends LightningElement {
    @api objectApiName;
    @api recordId;
    @api actionName = 'edit';
    contactData;
    //activeSections = ['A'];
   

    @wire(getRecord, { recordId: '$recordId',
     fields: [CONTACT_NAME_FIELD, 
        ACCOUNT_ID_FIELD, 
        ACCOUNT_NAME_FIELD, 
        EMAIL_FIELD, 
        TITLE_FIELD,        
        MOBILEPHONE_FIELD, 
        REPORTS_TO_FIELD,
        MAILING_CITY_FIELD,
        MAILING_COUNTRY_FIELD,
        MAILING_GEOCODE_FIELD,
        MAILING_POSTAL_CODE_FIELD,
        MAILING_STATE_FIELD,
        MAILING_STREET_FIELD,
        OTHER_CITY_FIELD,
        OTHER_COUNTRY_FIELD,
        OTHER_POSTAL_CODE_FIELD,
        OTHER_STATE_FIELD,
        OTHER_STREET_FIELD,
        CREATEDBY_NAME_FIELD,
        CREATED_DATE_FIELD,
        LAST_MODIFIED_FIELD,
        LAST_MODIFIED_DATE_FIELD
    ],
     optionalFields: [PHONE_FIELD] })
     contactData;

    get linkAccount() {
        console.log('this.contactData.data,', this.recordId);
        console.log('this.contactData.data,', this.objectApiName);
        console.log('this.contactData,', this.contactData);
        let accountId = String(getFieldValue(this.contactData.data, ACCOUNT_ID_FIELD));
        let linkToAccount = basePath + '/account/'+ accountId;
        return linkToAccount;
    }

    get accountName() {
        return getFieldValue(this.contactData.data, ACCOUNT_NAME_FIELD);
    }

    get contactName() {
        return getFieldValue(this.contactData.data, CONTACT_NAME_FIELD);
    }

    get title() {  
        return getFieldValue(this.contactData.data, TITLE_FIELD);
    }

    get email() {  
        return getFieldValue(this.contactData.data, EMAIL_FIELD);
    }
    
    get phone() {  
        return getFieldValue(this.contactData.data, PHONE_FIELD);
    }
    get mobile() {  
        return getFieldValue(this.contactData.data, MOBILEPHONE_FIELD);
    }
    get reportTo() {  
        return getFieldValue(this.contactData.data, REPORTS_TO_FIELD);
    }
    
    get maillingAddressCity() {       
        return getFieldValue(this.contactData.data, MAILING_CITY_FIELD);
        //let state = getFieldValue(this.contactData.data, MAILING_STATE_FIELD);
        //let postalcode = getFieldValue(this.contactData.data, MAILING_POSTAL_CODE_FIELD);
        //let streetValue = (!city || city=== 'null')  ? '' : replaced;
        //return city +', '+ state +' '+ postalcode;
    }
    get maillingAddressStreet(){
        let street = getFieldValue(this.contactData.data, MAILING_STREET_FIELD);
        return street;
    }
    get maillingAddressCountry() {
        return getFieldValue(this.contactData.data, MAILING_COUNTRY_FIELD);
    }
    get maillingAddressPostal(){
        let street = getFieldValue(this.contactData.data, MAILING_POSTAL_CODE_FIELD);
        return street;
    }
    get maillingAddressState() {
        return getFieldValue(this.contactData.data, MAILING_STATE_FIELD);
    }

    get mapMarkers() {
        let city = getFieldValue(this.contactData.data, MAILING_CITY_FIELD);
        let state = getFieldValue(this.contactData.data, MAILING_STATE_FIELD);
        let postalcode = getFieldValue(this.contactData.data, MAILING_POSTAL_CODE_FIELD);
        let country =getFieldValue(this.contactData.data, MAILING_COUNTRY_FIELD);
        let street = getFieldValue(this.contactData.data, MAILING_STREET_FIELD);
        let contactName = getFieldValue(this.contactData.data, CONTACT_NAME_FIELD);
        return [ 
        {
            location: {
                City: city,
                Country: country,
                PostalCode: postalcode,
                State: state,
                Street: street,
            },
            value: 'location001',
            title: 'Mailling address',
            description:contactName,
            icon: 'standard:contact',
        },
        ]
    }
   
    get otherAddressCity() {       
        return getFieldValue(this.contactData.data, OTHER_CITY_FIELD);
       // let state = getFieldValue(this.contactData.data, OTHER_STATE_FIELD);
       // let postalcode = getFieldValue(this.contactData.data, OTHER_POSTAL_CODE_FIELD);
       // return city +', '+ state +' '+ postalcode;
    }
    get otherAddressStreet(){
        let street = getFieldValue(this.contactData.data, OTHER_STREET_FIELD);
        return street;
    }
    get otherAddressCountry() {
        return getFieldValue(this.contactData.data, OTHER_COUNTRY_FIELD);
    }

    get maillingAddressCity() {       
        return getFieldValue(this.contactData.data, MAILING_CITY_FIELD);
        //let state = getFieldValue(this.contactData.data, MAILING_STATE_FIELD);
        //let postalcode = getFieldValue(this.contactData.data, MAILING_POSTAL_CODE_FIELD);
        //let streetValue = (!city || city=== 'null')  ? '' : replaced;
        //return city +', '+ state +' '+ postalcode;
    }
  
    get otherAddressPostal(){
        let street = getFieldValue(this.contactData.data, OTHER_POSTAL_CODE_FIELD);
        return street;
    }
    get otherAddressState() {
        return getFieldValue(this.contactData.data, OTHER_STATE_FIELD);
    }
    get mapOtherMarkers() {
        let city = getFieldValue(this.contactData.data, OTHER_CITY_FIELD);
        let state = getFieldValue(this.contactData.data, OTHER_STATE_FIELD);
        let postalcode = getFieldValue(this.contactData.data, OTHER_POSTAL_CODE_FIELD);
        let country =getFieldValue(this.contactData.data, OTHER_COUNTRY_FIELD);
        let street = getFieldValue(this.contactData.data, OTHER_STREET_FIELD);
        let contactName = getFieldValue(this.contactData.data, CONTACT_NAME_FIELD);

        return [ 
        {
            location: {
                City: city,
                Country: country,
                PostalCode: postalcode,
                State: state,
                Street: street,
            },
            value: 'location001',
            title: 'Mailling address',
            description:contactName,
            icon: 'standard:contact',
        },
        ]
    }
    
    get auditCreatedByName() {
        let name = getFieldValue(this.contactData.data, CREATEDBY_NAME_FIELD);
        return name +', ';
    }

    get auditCreatedDate() {
        return getFieldValue(this.contactData.data, CREATED_DATE_FIELD);
    }

    get auditModifiedByName() {
        let name = getFieldValue(this.contactData.data, LAST_MODIFIED_FIELD);
        return name +', ';
    }

    get auditModifiedDate() {  
        return getFieldValue(this.contactData.data, LAST_MODIFIED_DATE_FIELD);
    }

    htmlDecode(value) {
        var elem = document.createElement('textarea');
        elem.innerHTML = value;
        var decoded = elem.value;
        return decoded;
    }
}