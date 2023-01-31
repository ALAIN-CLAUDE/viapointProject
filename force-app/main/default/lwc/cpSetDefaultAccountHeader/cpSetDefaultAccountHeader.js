import { LightningElement,wire, api } from 'lwc';
import getAccountDetails from '@salesforce/apex/cpGetAccountOrganizationDetails.getAccountDetails';
import getOwner from '@salesforce/apex/cpSupportController.getUserDetails';
import updateAccount from '@salesforce/apex/cpUpdateAccountOrganizationDetails.updateAccount';
import basePath from "@salesforce/community/basePath";
import { updateRecord } from 'lightning/uiRecordApi';
import { refreshApex } from "@salesforce/apex";
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import { NavigationMixin } from 'lightning/navigation';
import userId from '@salesforce/user/Id';
import userAccount from '@salesforce/schema/User.DefaultAccount__c';

const pageRef = {
    type: 'comm__namedPage',
    attributes: {
        name: 'Home'
    },
};

export default class cpSetDefaultAccountHeader extends NavigationMixin(LightningElement) { 
    @api user = userId;
    @api userAccountInfo = userAccount;
    data;
    orgnisations;
    showOrgSelection =false;
    isAdmin =false;
    pageReferenceRefresh;
    wiredAccountResults;
    selectedOrg;
    url;    
    userData;
    url;
    
    get options() {
       let orgs=[];
        for (var orgIndex in this.orgnisations) {
            if(this.orgnisations)
            orgs.push( { label:(this.isAdmin)? this.orgnisations[orgIndex].Name :this.orgnisations[orgIndex].Account.Name,
                         value: (this.isAdmin)? this.orgnisations[orgIndex].Id : this.orgnisations[orgIndex].AccountId })
           }
       return orgs
    }


    getUrl() {
        this[NavigationMixin.GenerateUrl](pageRef).then((url) => console.log(url));
    }

    @wire(getRecord, { recordId: '$user', userAccount })
    userData;

    handleChange(event) {    
      updateAccount({ orgId: event.target.value})
		.then(result => {
            this.selectedOrg = result.DefaultAccount__c;
            refreshApex(this.wiredAccountResults);
            refreshApex(this.data);
            refreshApex(this.userData);
            refreshApex(this.selectedOrg); 
            this[NavigationMixin.Navigate](pageRef);
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
        }
        else if (result.error) {
            this.error = result.error;
        }
    }

    getPhotoUrl(){
        getOwner()
        .then(result =>{
            this.userDataResult = result;
        })
        .catch(error => {
            this.errorUser =JSON.stringify(error);            
        });
    }
}