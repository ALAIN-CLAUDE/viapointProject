import { LightningElement,wire,track } from 'lwc';
import getAccountDetails from '@salesforce/apex/cpGetAccountOrganizationDetails.getAccountDetails';
import updateAccount from '@salesforce/apex/cpUpdateAccountOrganizationDetails.updateAccount';


export default class CpSetDefaultAccount extends LightningElement {
    
    data;
    orgnisations;
    showOrgSelection =false;
    isAdmin =false;
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
        
      updateAccount({ orgId: event.target.value})
		.then(result => {
		 window.location.reload();
			this.error = undefined;
		})
		.catch(error => {
			this.error = error;
			this.accounts = undefined;
		})


    }

    @wire(getAccountDetails)
    wiredGetDetails(result) {
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
            console.log('this.data for account'+JSON.stringify(this.data));
        }
        else if (result.error) {
            this.error = result.error;
            console.log('this.error '+this.error);
        }
    }
    
}