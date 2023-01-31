import { LightningElement,wire,track,api } from 'lwc';
import getAccountDetails from '@salesforce/apex/cpGetAccountOrganizationDetails.getAccountDetails';
import updateAccount from '@salesforce/apex/cpUpdateAccountOrganizationDetails.updateAccount';
import { NavigationMixin, CurrentPageReference } from 'lightning/navigation';
import { refreshApex } from "@salesforce/apex";

export default class CpGetAccountOrganizationDetailsNew extends  NavigationMixin(LightningElement) {
    @track data;
    @api recordId;
    orgnisations;
    showOrgSelection =false;
    isAdmin =false;
    pageReference;
    pageReferenceRefresh;
    wiredAccountResults;
    
    get options() {
       let orgs=[];
        for (var orgIndex in this.orgnisations) {
            if(this.orgnisations)
            orgs.push( { label:(this.isAdmin)? this.orgnisations[orgIndex].Name :this.orgnisations[orgIndex].Account.Name,
                         value: (this.isAdmin)? this.orgnisations[orgIndex].Id : this.orgnisations[orgIndex].AccountId })
           }
       return orgs
    }

    handleChange(event) {
        console.log('event.target.value', event.target.value);
      updateAccount({ orgId: event.target.value})
		.then(result => {
            console.log('result ', result);
            refreshApex(this.orgnisations);
            refreshApex(this.wiredAccountResults);
            refreshApex( this.data);
         event.stopPropagation();
         event.preventDefault();
         if (this.pageReferenceRefresh) {
            this[NavigationMixin.Navigate](this.pageReferenceRefresh);
        }
         this.navigateToCommPage(this.pageReferenceRefresh.attributes.name);
         
		})
		.catch(error => {
			this.error = error;
			this.accounts = undefined;
		})


    }
    @wire(CurrentPageReference)
    getpageRef(pageReference) {
        this.pageReferenceRefresh = pageReference;
        console.log('pageRef', pageReference);
        console.log('key', pageReference.state['c__key'])
    }
 
    navigateToCommPage(pageName) {
        console.log('pageName', pageName);
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: pageName,
                actionName: 'view'               
            }
        });
    }
    
    @wire(getAccountDetails)
    wiredGetDetails(result) {
        console.log('recordId ', this.recordId);
        this.wiredAccountResults = result;
        if (result.data) {
            this.data = result.data.accounts;
            this.orgnisations = result.data.orgnisations;
            this.selectedOrg =result.data.selectedOrg;
            this.isAdmin =result.data.isAdmin;
            if(this.orgnisations && this.orgnisations.length>1)
            this.showOrgSelection =true;
            else
            this.showOrgSelection =false;
           // console.log('this.data for account'+JSON.stringify(this.data));
        }
        else if (result.error) {
            this.error = result.error;
           // console.log('this.error '+this.error);
        }
    }
}