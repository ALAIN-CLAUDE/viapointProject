import { LightningElement,api, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { CurrentPageReference } from 'lightning/navigation';
import basePath from '@salesforce/community/basePath';

export default class CpEditMenu extends LightningElement {
    @api income ={};
    @track href = 'javascript:void(0);';

    pageReference;

    connectedCallback() {        
        console.log('menu edit ', this.income.editlink);
    }
}