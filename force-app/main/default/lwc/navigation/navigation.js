import { LightningElement, api, wire, track } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import getLogoPortal from '@salesforce/resourceUrl/LogoPortal';
import getNavigationMenuItems from '@salesforce/apex/NavigationGlobalMenuController.getNavigationMenuItems';
import getUserDetails from '@salesforce/apex/NavigationGlobalMenuController.getUserDetails';
import userIdValue from '@salesforce/user/Id';

/**
 * This is a custom LWC navigation menu component.
 * Make sure the Guest user profile has access to the NavigationMenuItemsController apex class.
 */
export default class Navigation extends LightningElement {
    @api userId = userIdValue;
    @api linkSetMasterLabel='Customer Portal Menu';  
    @api addHomeMenuItem = false; 
    @api includeImageUrls = false;
    @api menuFooterItems = false;
    @track menuItems = [];   
    @track mainMenuItem;
    @track isLoaded = false;
    @track error;
    logoImage = getLogoPortal;
    publishStatus;
    @track userProfilePicsUrl;
    Userdata;
    userName;   

  
    @wire(getNavigationMenuItems, {
        navigationLinkSetMasterLabel: '$linkSetMasterLabel',
        publishStatus: '$publishStatus',
        addHomeMenuItem: '$addHomeMenuItem',
        includeImageUrl: '$includeImageUrls'
    })
    wiredMenuItems({error, data}) {
        if (data && !this.isLoaded) {
            this.menuItems = data.map((item, index) => {                
                if(item.label === 'Home') {
                    this.mainMenuItem = item.actionValue;
                }
                return {
                    target: item.actionValue,
                    id: index,
                    menuId:'menuId' + index,
                    menuSize:(item.subMenu.length === 0) ? true : false,
                    label: item.label,
                    type: item.actionType,
                    subMenu: item.subMenu,
                    imageUrl: item.imageUrl,
                    windowName: item.target
                }
            });
            this.error = undefined;
            this.isLoaded = true;           
        } else if (error) {
            this.error = error;
            this.menuItems = [];
            this.isLoaded = true;           
        }
    }

    /**
     * Using the CurrentPageReference, check if the app is 'commeditor'.
     * 
     * If the app is 'commeditor', then the page will use 'Draft' NavigationMenuItems. 
     * Otherwise, it will use the 'Live' schema.
    */
    @wire(CurrentPageReference)
    setCurrentPageReference(currentPageReference) {
        const app = currentPageReference && currentPageReference.state && currentPageReference.state.app;
        if (app === 'commeditor') {
            this.publishStatus = 'Draft';
        } else {
            this.publishStatus = 'Live';
        }
    }

    @wire(getUserDetails)
    wiredGetUser(userData) {
        console.log('Nav user ', this.userId);
        this.userData = userData;
        const { data, error } = userData;       
        if (data) {           
            this.user = data;
            this.userProfilePicsUrl = data[0]["SmallPhotoUrl"];
            this.userName = data[0]["Name"];
        } else if (error) {
           this.userError = error;
        }
    }

}