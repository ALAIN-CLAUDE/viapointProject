import { LightningElement, track, wire, api } from 'lwc';
import getOwner from '@salesforce/apex/cpSupportController.getUserDetails';
import getMyCases from '@salesforce/apex/cpSupportController.getAllMyCases';
import getUserTimeZone from '@salesforce/apex/cpCardPurchasedProducts.getUserTimeZone';
import { refreshApex } from "@salesforce/apex";
import userId from '@salesforce/user/Id';
import basePath from "@salesforce/community/basePath";

export default class CpSupport extends LightningElement {
    @api userInfo = userId;
    @track caseData;
    objectApiName='Case';
    ticketUrl = basePath +'/support/tickets';;
    localTimeZone;
    localSidKey;
    timeZoneData;  
    @track userData=[];
    userDataResult;
    @track userProfilePicsUrl;
    userName;
    user;
    userError;
    @track photoUser = '';
    ownerId;
    ownerUserInfo;
    errorUser;getOwner
    isLoading=false;
    wiredAccountResults;
   
    @wire(getOwner)
    wiredOwnerUser(userData) {
        refreshApex(userData); 
        console.log(' this.userDataResult = result;',userData);      
        if (userData.data) {
            this.userDataResult = userData.data;
            console.log(JSON.stringify(userData.data)); 
            //console.log('Audit Activities Findings data', data);
            //is.user = data;
           //this.userProfilePicsUrl = data[0]['SmallPhotoUrl'];
           //this.userName = data[0]['Name'];
        } else if (userData.error) {
           this.userError = userData.error;
        }
    }
  
    @wire(getUserTimeZone)
    wiredTimeZoneUsers(result) {
        if(result.data){           
            let resp = JSON.parse(JSON.stringify(result.data));
            this.localTimeZone = resp['TimeZoneSidKey'];
            this.localSidKey = resp['LocaleSidKey'];           
            console.log('this.timeZone', this.localTimeZone);
            console.log('this. localSidKey', this.localSidKey);
        }
    }

    @wire(getMyCases)
    cons(result) {
        refreshApex(result);        
        if(result.data) {            
            this.caseData = result.data;
            let resp = JSON.parse(JSON.stringify(result.data));
            let userObj = this.userDataResult;
            if(userObj){
                this.isLoading=true;
            }
            //console.log('this is the caseData '+JSON.stringify(result));         
            resp.forEach(item => {
                item['editUrl'] = '/case/' + item['Id'];                
                item['menuId'] = 'menu-' + item['Id'];
                let local;              
                if(this.localSidKey) {
                    local = this.localSidKey.replace("_", "-");
                }
                let timeZone;
                if(this.localTimeZone) {
                    timeZone = this.localTimeZone;
                }
                //console.log(local, timeZone);
                let openDate = (new Date(item['CreatedDate']).toLocaleString(local, {timeZone: timeZone,}));
                //console.log('openDate', openDate);
                item['createdDateFormat'] =new Date(openDate).toLocaleString(local);
                item['unitClass'] = item['Status'].replace(/\s/g, '').toLowerCase() + ' card-box';
                item['SubjectValue'] = String(item['Subject']);              
                
                if(item['OwnerId']) {
                    console.log('true');
                    console.log('OwnerId', item['OwnerId']);
                                 
                    console.log('userObj1', JSON.stringify(userObj));                   
                    console.log('this.for', JSON.stringify(this.userDataResult));                   
                     
                    for(var i in userObj) {
                        console.log( userObj[i].SmallPhotoUrl);
                        if(userObj[i].Id === item['OwnerId']) {
                            console.log('true user id and owner id', userObj[i].isActive,'user', userObj[i].Id , 'owner', item['OwnerId'] );
                            item['assignSmallPhotoUrl'] = userObj[i].SmallPhotoUrl;                                                 
                        } 
                        console.log('alerts key', i); // alerts key
                        console.log('alerts keys value', userObj[i].Id); //alerts key's value
                    }                               
                    item['assignToUser'] = String(item.Owner.Name);                  
                    item['noAssegnedUser'] = true;
                } else {
                    item['noAssegnedUser'] = false;
                }
                item['assignSmallPhotoUrl'] = (item['assignSmallPhotoUrl']) ? item['assignSmallPhotoUrl'] : "/sfsites/c/profilephoto/005/T" ;
            });
            this.caseData = resp;
            console.log('this is the  this.caseData '+JSON.stringify( this.caseData));
            this.isLoading=true;
            refreshApex(this.caseData);     
           }
        if (result.error) {
            this.caseData = undefined;
        }
    }
   
    handleChange(event) {
        console.log('event.target.value', event.target.value);
        updateAccount({ orgId: event.target.value})
		.then(result => {
            console.log('result ', result);
            refreshApex(this.wiredAccountResults);
            refreshApex(this.data);
           
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
 
handleMouseover(event) {
    let targetId = event.target.dataset.targetId;       
    let target = this.template.querySelector(`[data-id="${targetId}"]`);       
    target.classList.remove('slds-hide');
    target.classList.add('slds-show');

}

handleMouseLeave(event) {
    const targetId = event.target.dataset.targetId;        
    const target = this.template.querySelector(`[data-id="${targetId}"]`);       
    target.classList.add('slds-hide');
    target.classList.remove('slds-show');
}

}