import { LightningElement, api, wire, track } from 'lwc';
import getNameFromObject from '@salesforce/apex/GlobalSearchController.getNameFromObject';
export default class ObjectRecordValue extends LightningElement {
    @api objectApiName;
    @api recordId;
    @api recordNumber;
    @track incomeData;
    error;
    recordName;
    
    @wire(getNameFromObject, {recordId: '$recordId', objectApiName:'$objectApiName'})
    wiredAudAct(result) {
            if (result.data) {
            this.recordName= result.data[0].Name;
    
            }else if (result.error) {
                this.error = result.error;
            }
        }
    
    
}