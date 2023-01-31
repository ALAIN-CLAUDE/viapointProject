import { LightningElement, api, track, wire} from 'lwc';
import getNavigationCustomMenuItems from '@salesforce/apex/NavigationGlobalMenuController.getNavigationCustomMenuItems';
import { CurrentPageReference } from 'lightning/navigation';

export default class UserProfileMenu extends LightningElement {
    @api linkSetUserLabel = 'User Menu';
    @api addHomeMenuItem = false; 
    @api includeImageUrls = false;
    @track userMenuItems =[];
    
    publishStatus;
    @wire(getNavigationCustomMenuItems, {
        navigationLinkSetMasterLabel: '$linkSetUserLabel',
        publishStatus: '$publishStatus',
        addHomeMenuItem: '$addHomeMenuItem',
        includeImageUrl: '$includeImageUrls'
    })
    wiredMenuUserItems({error, data}) {
        if (data && !this.isLoaded) {
            this.userMenuItems = data.map((item, index) => {
                //console.log('menuuserMenuItems Item ', item);
                return {
                    target: item.actionValue,
                    id: index,
                    menuId:'menuId' + index + index,
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
           // console.log('!!! userMenuItems menu', JSON.stringify(this.userMenuItems) );
        } else if (error) {
            this.error = error;
            this.userMenuItems = [];
            this.isLoaded = true;
            //console.error(`Navigation menu error: ${JSON.stringify(this.error)}`);
        }
    }
    @wire(CurrentPageReference)
    setCurrentPageReference(currentPageReference) {
        const app = currentPageReference && currentPageReference.state && currentPageReference.state.app;
        if (app === 'commeditor') {
            this.publishStatus = 'Draft';
        } else {
            this.publishStatus = 'Live';
        }
    }

}